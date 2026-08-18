"""Source-selection spike for the class-actions tool.

Nevo's robots.txt disallows automated access, so the primary source moves to the
courts' official public register (פנקס התובענות הייצוגיות) and to open-data
publications of the same record. This probe answers, in one CI run:

  * Which candidate sources are reachable, and what does each robots.txt say?
  * Does any of them publish *structured* records (CSV/JSON via a CKAN API),
    which would remove the need to scrape HTML at all?
  * For the HTML registers, what does the markup actually look like?

Everything fetched is saved under out/ for upload as an artifact.
"""

from __future__ import annotations

import json
import pathlib
import re
import time
import urllib.parse

from probe import HEADERS, banner, decode, decompress, fetch, structural_digest  # noqa: F401

OUT = pathlib.Path("out")

# Hosts whose robots.txt we want on the record before fetching anything else.
ROBOTS_HOSTS = [
    "https://data.gov.il",
    "https://www.odata.org.il",
    "https://www.court.gov.il",
    "https://elyon1.court.gov.il",
    "https://www.gov.il",
]

# CKAN open-data portals. If either publishes the register as CSV/JSON, that
# becomes the primary source and the whole HTML-scraping layer disappears.
CKAN_PORTALS = [
    ("data.gov.il", "https://data.gov.il/api/3/action"),
    ("odata.org.il", "https://www.odata.org.il/api/3/action"),
]
CKAN_QUERIES = ["תובענות ייצוגיות", "class action", "ייצוגיות"]

# HTML candidates: the current register on נט המשפט and the pre-2014 static one.
HTML_TARGETS = [
    ("court-home", "https://www.court.gov.il/"),
    ("elyon-register-main", "https://elyon1.court.gov.il/heb/tovanot_yezugiyot/main.htm"),
    ("elyon-register-list", "https://elyon1.court.gov.il/heb/tovanot_yezugiyot/list.htm"),
    ("gov-il-guide", "https://www.gov.il/he/departments/guides/class_action"),
]

# Words that would mark a page as actually carrying register records.
REGISTER_MARKERS = ["ייצוגי", "תובענ", "נתבע", "פנקס", "בקשת אישור", "מספר הליך"]


def get_json(url: str, label: str) -> dict | None:
    got = fetch(url, label)
    if not got:
        return None
    text = got[0]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        print(f"    (not JSON; first 300 chars) {text[:300]!r}", flush=True)
        return None


def probe_robots() -> None:
    banner("ROBOTS.TXT FOR EVERY CANDIDATE HOST")
    for host in ROBOTS_HOSTS:
        label = "robots-" + urllib.parse.urlparse(host).netloc.replace(".", "_")
        got = fetch(f"{host}/robots.txt", label)
        if not got:
            continue
        text = got[0]
        print(f"\n----- robots.txt @ {host} -----", flush=True)
        print(text[:2500], flush=True)
        # The two questions that matter: is everything disallowed, and are AI
        # agents singled out the way Nevo singled them out?
        blanket = re.search(r"User-agent:\s*\*\s*\n(?:[^\n]*\n)*?Disallow:\s*/\s*$",
                            text, re.I | re.M)
        print(f"\n  blanket 'Disallow: /' for *  : {bool(blanket)}", flush=True)
        for bot in ("ClaudeBot", "anthropic-ai", "GPTBot", "CCBot"):
            print(f"  mentions {bot:<14}: {bot.lower() in text.lower()}", flush=True)
        time.sleep(1)


def probe_ckan() -> None:
    banner("CKAN OPEN-DATA PORTALS — is the register published as structured data?")
    for name, base in CKAN_PORTALS:
        for query in CKAN_QUERIES:
            url = f"{base}/package_search?q={urllib.parse.quote(query)}&rows=10"
            label = f"ckan-{name}-{abs(hash(query)) % 9999}"
            data = get_json(url, label)
            time.sleep(1)
            if not data or not data.get("success"):
                continue
            results = data.get("result", {}).get("results", [])
            print(f"\n  {name} q={query!r}: {data['result'].get('count')} datasets",
                  flush=True)
            for ds in results[:6]:
                print(f"    - {ds.get('name')} :: {ds.get('title')}", flush=True)
                for res in ds.get("resources", [])[:8]:
                    print(
                        f"        [{res.get('format'):<6}] {res.get('name')}\n"
                        f"          {res.get('url')}",
                        flush=True,
                    )

        # The dataset slug seen in search results, fetched directly.
        data = get_json(f"{base}/package_show?id=class-action", f"ckan-{name}-class-action")
        time.sleep(1)
        if data and data.get("success"):
            ds = data["result"]
            banner(f"{name} :: dataset 'class-action'")
            print(f"title: {ds.get('title')}", flush=True)
            print(f"notes: {str(ds.get('notes'))[:800]}", flush=True)
            for res in ds.get("resources", []):
                print(f"\n  resource: {res.get('name')}", flush=True)
                print(f"    format : {res.get('format')}", flush=True)
                print(f"    url    : {res.get('url')}", flush=True)
                print(f"    updated: {res.get('last_modified') or res.get('created')}",
                      flush=True)
                # Pull the head of the first tabular resource to see real columns.
                if str(res.get("format", "")).upper() in {"CSV", "JSON", "XLSX"}:
                    sample = fetch(str(res.get("url")), f"sample-{res.get('id')}")
                    time.sleep(1)
                    if sample:
                        head = sample[0][:2000]
                        print("    --- first 2000 chars ---", flush=True)
                        print(head, flush=True)


def probe_html() -> None:
    banner("HTML REGISTERS")
    for label, url in HTML_TARGETS:
        got = fetch(url, label)
        time.sleep(2)
        if not got:
            continue
        text = got[0]
        print("\n  register markers:", flush=True)
        for marker in REGISTER_MARKERS:
            print(f"    {marker:<12} x{text.count(marker)}", flush=True)

        # Surface anything that looks like a route into the register itself.
        hrefs = re.findall(r'href\s*=\s*["\']([^"\']+)["\']', text)
        interesting = sorted({
            h for h in hrefs
            if re.search(r"yezug|yizug|class[_-]?action|tovanot|pinkas|ClassAction", h, re.I)
        })
        if interesting:
            print(f"\n  candidate register links ({len(interesting)}):", flush=True)
            for href in interesting[:25]:
                print(f"    {href}", flush=True)

        if any(text.count(m) > 3 for m in REGISTER_MARKERS):
            structural_digest(text, label)


def main() -> int:
    banner("SOURCE-SELECTION SPIKE — courts register and open data")
    OUT.mkdir(parents=True, exist_ok=True)
    probe_robots()
    probe_ckan()
    probe_html()
    banner("DONE — compare sources above; prefer structured data over HTML scraping")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
