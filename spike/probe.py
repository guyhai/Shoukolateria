"""Viability spike: can a GitHub-hosted runner fetch Nevo's daily digest archive?

Answers three questions, in order:
  1. Does the request get through at all, or is there a bot-wall / datacenter-IP block?
  2. Does the archive HTML contain the class-actions section and links to digest issues?
  3. What does the markup around ייצוגיות / נושא actually look like, so parsers can be
     written against reality instead of guesses?

Prints a structural digest to the job log and saves every response under out/ for upload
as an artifact. Read-only: it fetches public pages and writes nothing back to Nevo.
"""

from __future__ import annotations

import gzip
import io
import pathlib
import re
import sys
import time
import urllib.error
import urllib.request
import zlib

ARCHIVE_URL = "https://www.nevo.co.il/DailyMailArchive.aspx"
ROBOTS_URL = "https://www.nevo.co.il/robots.txt"
OUT = pathlib.Path("out")

# A plain, honest desktop-browser UA. Nevo serves a WebForms page that may vary by client.
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "close",
}

# Markers we care about. The digest's class-actions column is titled ייצוגיות; individual
# items label their subject with נושא; issues are linked through getMsgcontent.ashx.
MARKERS = ["ייצוגיות", "נושא", "getMsgcontent", "DailyMail", "__VIEWSTATE", "תובענ"]
LINK_RE = re.compile(rb"""href\s*=\s*["']([^"']+)["']""", re.I)
MSG_RE = re.compile(r"getMsgcontent\.ashx\?[^\"'\s>]*?d=(\d+)", re.I)


def banner(text: str) -> None:
    print(f"\n{'=' * 72}\n{text}\n{'=' * 72}", flush=True)


def decompress(raw: bytes, encoding: str) -> bytes:
    if "gzip" in encoding:
        try:
            return gzip.GzipFile(fileobj=io.BytesIO(raw)).read()
        except OSError:
            return raw
    if "deflate" in encoding:
        try:
            return zlib.decompress(raw)
        except zlib.error:
            try:
                return zlib.decompress(raw, -zlib.MAX_WBITS)
            except zlib.error:
                return raw
    return raw


def decode(raw: bytes, content_type: str) -> str:
    """Nevo is a Hebrew ASP.NET site; it may serve utf-8 or windows-1255."""
    charset = None
    if "charset=" in content_type.lower():
        charset = content_type.lower().split("charset=")[-1].strip().strip('"; ')
    if not charset:
        m = re.search(rb'charset=["\']?([\w-]+)', raw[:4096], re.I)
        if m:
            charset = m.group(1).decode("ascii", "ignore")
    for candidate in [charset, "utf-8", "windows-1255", "cp1255", "iso-8859-8"]:
        if not candidate:
            continue
        try:
            return raw.decode(candidate)
        except (UnicodeDecodeError, LookupError):
            continue
    return raw.decode("utf-8", "replace")


def fetch(url: str, label: str) -> tuple[str, bytes] | None:
    """Fetch one URL, reporting exactly what came back. Returns (text, raw) or None."""
    print(f"\n--- GET {url}", flush=True)
    req = urllib.request.Request(url, headers=HEADERS)
    started = time.monotonic()
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read()
            status, headers, final_url = resp.status, dict(resp.headers), resp.url
    except urllib.error.HTTPError as exc:
        raw = exc.read() if exc.fp else b""
        status, headers, final_url = exc.code, dict(exc.headers), url
        print(f"    HTTPError {exc.code} {exc.reason}", flush=True)
    except Exception as exc:  # network-level failure: DNS, TLS, timeout, reset
        print(f"    !! {type(exc).__name__}: {exc}", flush=True)
        print("    VERDICT: request did not complete (network/TLS level)", flush=True)
        return None

    elapsed = time.monotonic() - started
    body = decompress(raw, headers.get("Content-Encoding", ""))
    text = decode(body, headers.get("Content-Type", ""))

    print(f"    status        : {status}", flush=True)
    print(f"    elapsed       : {elapsed:.2f}s", flush=True)
    print(f"    final url     : {final_url}", flush=True)
    print(f"    bytes (raw)   : {len(raw)}", flush=True)
    print(f"    bytes (body)  : {len(body)}", flush=True)
    print(f"    chars (text)  : {len(text)}", flush=True)
    for key in ("Content-Type", "Server", "Set-Cookie", "CF-Ray", "X-Powered-By",
                "Content-Encoding", "Location"):
        if key in headers:
            print(f"    {key:<14}: {str(headers[key])[:200]}", flush=True)

    # Bot-wall tells: a challenge page is small, mentions a WAF, and has no real content.
    lowered = text.lower()
    walls = [w for w in ("captcha", "cloudflare", "access denied", "incapsula",
                         "imperva", "akamai", "just a moment", "attention required",
                         "bot detection", "unusual traffic") if w in lowered]
    if walls:
        print(f"    !! possible bot-wall markers: {walls}", flush=True)

    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / f"{label}.html"
    dest.write_bytes(body)
    print(f"    saved         : {dest}", flush=True)
    return text, body


def structural_digest(text: str, label: str) -> None:
    """Print what the markup around the interesting markers actually looks like."""
    banner(f"STRUCTURAL DIGEST — {label}")

    print("marker presence:", flush=True)
    for marker in MARKERS:
        count = text.count(marker)
        flag = "yes" if count else "NO "
        print(f"  [{flag}] {marker:<16} x{count}", flush=True)

    for tag in ("table", "tr", "td", "b", "strong", "a", "div", "span", "h1", "h2", "h3"):
        n = len(re.findall(rf"<{tag}\b", text, re.I))
        if n:
            print(f"  <{tag}> x{n}", flush=True)

    ids = re.findall(r'\bid=["\']([^"\']+)["\']', text)[:40]
    if ids:
        print(f"\nfirst element ids: {ids}", flush=True)
    classes = sorted({c for c in re.findall(r'\bclass=["\']([^"\']+)["\']', text)})[:40]
    if classes:
        print(f"\ndistinct class values (first 40): {classes}", flush=True)

    msg_ids = sorted(set(MSG_RE.findall(text)), key=int, reverse=True)
    print(f"\ngetMsgcontent issue ids found: {len(msg_ids)}", flush=True)
    if msg_ids:
        print(f"  newest 15: {msg_ids[:15]}", flush=True)

    hrefs = re.findall(r'href\s*=\s*["\']([^"\']+)["\']', text)
    shapes: dict[str, int] = {}
    for href in hrefs:
        shape = re.sub(r"\d+", "N", href.split("#")[0])[:90]
        shapes[shape] = shapes.get(shape, 0) + 1
    top = sorted(shapes.items(), key=lambda kv: -kv[1])[:25]
    print(f"\nhref shapes (digits->N), top 25 of {len(shapes)}:", flush=True)
    for shape, n in top:
        print(f"  x{n:<4} {shape}", flush=True)

    # The payoff: raw markup around each marker, so selectors can be written for real.
    for marker in ("ייצוגיות", "נושא"):
        for i, m in enumerate(list(re.finditer(re.escape(marker), text))[:3]):
            start, end = max(0, m.start() - 700), min(len(text), m.end() + 1500)
            excerpt = re.sub(r"\s+", " ", text[start:end])
            banner(f"CONTEXT — {label} — {marker!r} occurrence {i + 1}")
            print(excerpt, flush=True)


def main() -> int:
    banner("NEVO VIABILITY SPIKE — can a GitHub runner reach nevo.co.il?")

    robots = fetch(ROBOTS_URL, "robots")
    if robots:
        banner("robots.txt")
        print(robots[0][:3000], flush=True)

    archive = fetch(ARCHIVE_URL, "archive")
    if archive is None:
        banner("VERDICT: NO-GO — the archive request did not complete")
        return 1

    text, _ = archive
    structural_digest(text, "archive")

    msg_ids = sorted(set(MSG_RE.findall(text)), key=int, reverse=True)
    if not msg_ids:
        banner("VERDICT: PARTIAL — archive fetched, but no getMsgcontent links in the HTML")
        print("The issue list is probably rendered via an ASP.NET postback or JS.", flush=True)
        print("Next step: retry this page through Playwright.", flush=True)
        print(f"__VIEWSTATE present: {'__VIEWSTATE' in text}", flush=True)
        return 0

    # Follow the newest couple of issues, politely, to confirm the digest body is readable.
    for issue_id in msg_ids[:2]:
        time.sleep(2)
        url = f"https://www.nevo.co.il/handlers/getMsgcontent.ashx?d={issue_id}"
        got = fetch(url, f"issue-{issue_id}")
        if got:
            structural_digest(got[0], f"issue-{issue_id}")

    banner("VERDICT: GO — archive reachable and issue links present")
    return 0


if __name__ == "__main__":
    sys.exit(main())
