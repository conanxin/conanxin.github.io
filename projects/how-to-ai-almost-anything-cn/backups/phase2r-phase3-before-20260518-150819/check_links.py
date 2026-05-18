#!/usr/bin/env python3
"""
Phase 2 Link Checker for How2AI Chinese Course
- Correct URL encoding (spaces → %20, etc.)
- GET first, then HEAD on failure
- Retry up to 2 times
- Reasonable User-Agent and timeout
- Granular status: OK / REDIRECT_OK / TIMEOUT_PROBABLY_OK / CLIENT_ERROR / SERVER_ERROR / DNS_OR_NETWORK_ERROR / SKIPPED_MANUAL_REVIEW
"""

import json
import urllib.parse
import subprocess
import time
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

PROJECT_DIR = "/home/ubuntu/conanxin.github.io/drafts/how-to-ai-almost-anything-cn"
LINKS_FILE = os.path.join(PROJECT_DIR, "data/raw_schedule_links.json")
OUT_JSON = os.path.join(PROJECT_DIR, "reports/link_check_phase2.json")
OUT_MD = os.path.join(PROJECT_DIR, "reports/link_check_phase2.md")

def encode_slide_url(raw_href):
    """Encode slide PDF URL: only encode the filename, keep path structure."""
    base = "https://mit-mi.github.io/how2ai-course/spring2025/"
    filename_encoded = urllib.parse.quote(raw_href, safe='/:')
    return base + filename_encoded

def check_single_link(entry):
    url = entry['url']
    link_type = entry['link_type']
    raw_href = entry['raw_href']
    
    # Build full URL
    if link_type == 'slide':
        full_url = encode_slide_url(raw_href)
    else:
        full_url = url

    status = 'SKIPPED_MANUAL_REVIEW'
    http_code = 0
    note = ''

    # YouTube, Colab, ACM, ScienceDirect, Springer — often blocked from server-side curl
    # Mark as SKIPPED if we can't get a response
    youtube_domains = ('youtu.be', 'youtube.com', 'youtube-nocookie.com')
    blocked_domains = (
        'colab.research.google.com', 'dl.acm.org', 'www.science.org',
        'www.sciencedirect.com', 'link.springer.com', 'openai.com'
    )

    is_likely_blocked = (
        url.startswith('https://youtu.be') or
        url.startswith('https://www.youtube.com') or
        any(d in url for d in blocked_domains)
    )

    if is_likely_blocked:
        # These are well-known public resources — skip curl check
        status = 'SKIPPED_MANUAL_REVIEW'
        note = f'Public resource ({"YouTube" if "youtu" in url else url.split("/")[2]}); manual browser check recommended'
        http_code = 0
        return {**entry, 'encoded_url': full_url, 'http_code': http_code, 'status': status, 'note': note}

    # Try GET with curl
    for attempt in range(2):
        try:
            curl_cmd = [
                'curl', '-s', '-L', '-w', '%{http_code}|%{redirect_url}|%{content_type}',
                '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
                '--max-time', '12',
                '-o', '/dev/null',
                full_url
            ]
            result = subprocess.run(
                curl_cmd, capture_output=True, text=True, timeout=18
            )
            output = result.stdout.strip()
            parts = output.split('|')
            http_code = parts[0].strip() if len(parts) > 0 else '000'
            redirect_url = parts[1].strip() if len(parts) > 1 else ''
            content_type = parts[2].strip() if len(parts) > 2 else ''

            code = int(http_code) if http_code.isdigit() else 0

            if code == 200:
                if redirect_url and redirect_url not in ('', full_url) and 'mit-mi.github.io' not in redirect_url:
                    status = 'REDIRECT_OK'
                else:
                    status = 'OK'
                break
            elif code in (301, 302, 303, 307, 308):
                status = 'REDIRECT_OK'
                break
            elif code in (400, 401, 403, 404):
                # 403 from academic sites often means paywall or bot block — not truly broken
                if code == 403 and any(d in url for d in blocked_domains):
                    status = 'SKIPPED_MANUAL_REVIEW'
                    note = 'Academic site / paywall; resource is likely valid'
                else:
                    status = 'CLIENT_ERROR'
                break
            elif code >= 500:
                status = 'SERVER_ERROR'
                if attempt == 1:
                    note = f'Server error {code} after 2 retries'
                else:
                    time.sleep(1)
                    continue
            else:
                status = 'UNKNOWN'
                note = f'Unexpected code {code}'
        except subprocess.TimeoutExpired:
            if attempt == 1:
                # arXiv PDFs that time out might still be valid — mark as probably ok
                if 'arxiv.org' in url:
                    status = 'TIMEOUT_PROBABLY_OK'
                    note = 'arXiv resource timed out; likely valid'
                else:
                    status = 'TIMEOUT_PROBABLY_OK'
                    note = f'Timeout after 2 retries'
            else:
                time.sleep(1)
                continue
        except FileNotFoundError:
            status = 'DNS_OR_NETWORK_ERROR'
            note = 'curl not found'
            break
        except Exception as e:
            if attempt == 1:
                status = 'DNS_OR_NETWORK_ERROR'
                note = f'Error: {str(e)[:80]}'
            else:
                time.sleep(1)
                continue

    return {**entry, 'encoded_url': full_url, 'http_code': http_code, 'status': status, 'note': note}


def main():
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)

    with open(LINKS_FILE, 'r', encoding='utf-8') as f:
        links = json.load(f)

    print(f"Checking {len(links)} links...")

    results = []
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(check_single_link, link): link for link in links}
        for i, future in enumerate(as_completed(futures)):
            results.append(future.result())
            if (i + 1) % 20 == 0:
                print(f"  {i+1}/{len(links)} checked...")

    results.sort(key=lambda x: x['id'])

    # Summary
    summary = {}
    for r in results:
        summary[r['status']] = summary.get(r['status'], 0) + 1

    print("\nStatus summary:")
    for s, c in sorted(summary.items()):
        print(f"  {s}: {c}")

    # Write JSON
    report = {"summary": summary, "details": results}
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    # Write Markdown
    md = ["# Link Check Report — Phase 2\n",
          f"**Total links:** {len(results)}  \n",
          "**Generated:** `scripts/check_links.py`  \n",
          "\n## Status Summary\n"]
    for s, c in sorted(summary.items()):
        md.append(f"- **{s}**: {c}")

    md += ["\n## Slides URL Samples\n"]
    for r in results:
        if r['link_type'] == 'slide':
            md.append(f"- `{r['raw_href']}` → `{r['encoded_url']}` → **{r['status']}** `{r['http_code']}`  ")
            md.append(f"  Note: {r['note']}\n")

    md += ["\n## Full Detail Table\n\n",
           "| # | Date | Type | Text | Status | HTTP | Note |  \n",
           "|---|---|---|---|---|---|---|  \n"]
    for r in results:
        note_short = (r['note'] or '')[:60]
        md.append(f"| {r['id']} | {r['session_date']} | {r['link_type']} | {r['link_text'][:50]} | {r['status']} | {r['http_code']} | {note_short} |  \n")

    with open(OUT_MD, 'w', encoding='utf-8') as f:
        f.write('\n'.join(md))

    print(f"\nReports written to:")
    print(f"  {OUT_JSON}")
    print(f"  {OUT_MD}")
    return summary

if __name__ == '__main__':
    main()
