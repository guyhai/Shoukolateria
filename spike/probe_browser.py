"""Fallback spike: fetch the Nevo archive through a real browser.

Runs only if the plain-HTTP probe was blocked or returned no issue links. A headless
Chromium clears naive bot-walls that key on TLS/JS fingerprints, and it also executes the
ASP.NET postbacks that may be what actually renders the issue list.
"""

from __future__ import annotations

import pathlib
import sys

from playwright.sync_api import sync_playwright

from probe import ARCHIVE_URL, MSG_RE, banner, structural_digest

OUT = pathlib.Path("out")


def main() -> int:
    banner("BROWSER FALLBACK — fetching the archive through headless Chromium")
    OUT.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            locale="he-IL",
            timezone_id="Asia/Jerusalem",
            viewport={"width": 1440, "height": 900},
        )
        page = context.new_page()

        response = page.goto(ARCHIVE_URL, wait_until="networkidle", timeout=60_000)
        status = response.status if response else "no response"
        print(f"status: {status}", flush=True)
        print(f"title : {page.title()}", flush=True)

        html = page.content()
        (OUT / "archive-browser.html").write_text(html, encoding="utf-8")
        page.screenshot(path=str(OUT / "archive-browser.png"), full_page=True)
        print(f"saved : {OUT / 'archive-browser.html'} ({len(html)} chars)", flush=True)

        structural_digest(html, "archive-browser")

        issue_ids = sorted(set(MSG_RE.findall(html)), key=int, reverse=True)
        if not issue_ids:
            banner("VERDICT: NO-GO for CI — page loads but exposes no issue links")
            print("Fixtures will have to come from a logged-in browser by hand.", flush=True)
            browser.close()
            return 1

        for issue_id in issue_ids[:2]:
            url = f"https://www.nevo.co.il/handlers/getMsgcontent.ashx?d={issue_id}"
            page.goto(url, wait_until="networkidle", timeout=60_000)
            body = page.content()
            (OUT / f"issue-{issue_id}-browser.html").write_text(body, encoding="utf-8")
            structural_digest(body, f"issue-{issue_id}-browser")

        banner("VERDICT: GO via browser — plain HTTP is blocked, Playwright works")
        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
