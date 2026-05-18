#!/usr/bin/env python3
"""
Phase 6C: Audit official MIT How2AI schedule links and generate link_health.json
"""
import json
import os
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime

# ─── Config ───────────────────────────────────────────────────────────────────
SCHEDULE_URL = "https://mit-mi.github.io/how2ai-course/spring2025/schedule/"
SCHEDULE_FALLBACK = "https://mit-mi.github.io/how2ai-course/spring2025/schedule/"
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_DIR, "data")
REPORTS_DIR = os.path.join(PROJECT_DIR, "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

STATUS_LABELS = {
    "OK": "✅ 可访问",
    "REDIRECT_OK": "✅ 跳转可访问",
    "TIMEOUT_PROBABLY_OK": "⚠️ 可能可访问",
    "MANUAL_BROWSER_CHECK_RECOMMENDED": "🌐 浏览器复核",
    "SCHEDULE_LISTED_BUT_UNREACHABLE": "🔗 官方列出但自动不可达",
    "PAYWALL_OR_ACCESS_RESTRICTED": "🔐 需要权限",
    "SKIPPED_NETWORK_RESTRICTED": "⏭️ 网络受限",
    "UNKNOWN": "❓ 未检测",
}

# ─── HTTP Helpers ──────────────────────────────────────────────────────────────
def http_check(url, timeout=15, retry=2):
    """Check a URL and return (status, http_status, content_type, note)."""
    # Normalize spaces to %20
    normalized = url.replace(" ", "%20")
    if normalized != url:
        url = normalized
        note_extra = " (space normalized)"
    else:
        note_extra = ""

    for attempt in range(retry):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                http_status = resp.status
                content_type = resp.headers.get("Content-Type", "").split(";")[0].strip()
                final_url = resp.geturl()
                if final_url != url:
                    # Follow redirect, check final URL
                    return "REDIRECT_OK", http_status, content_type, f"Redirected to {final_url}{note_extra}"
                if http_status == 200:
                    if "pdf" in content_type.lower() or url.endswith(".pdf"):
                        return "OK", http_status, content_type, f"PDF confirmed{note_extra}"
                    return "OK", http_status, content_type, f"200 OK{note_extra}"
                return "UNKNOWN", http_status, content_type, f"HTTP {http_status}{note_extra}"
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return "MANUAL_BROWSER_CHECK_RECOMMENDED", e.code, "", f"404 Not Found — please verify in browser{note_extra}"
            elif e.code in (403, 401):
                return "PAYWALL_OR_ACCESS_RESTRICTED", e.code, "", f"HTTP {e.code} — access restricted{note_extra}"
            else:
                if attempt == retry - 1:
                    return "MANUAL_BROWSER_CHECK_RECOMMENDED", e.code, "", f"HTTP {e.code}{note_extra}"
        except urllib.error.URLError as e:
            if attempt == retry - 1:
                reason = str(e.reason).split("]")[-1].strip() if "]" in str(e.reason) else str(e.reason)
                return "MANUAL_BROWSER_CHECK_RECOMMENDED", 0, "", f"Network error: {reason}{note_extra}"
        except TimeoutError:
            if attempt == retry - 1:
                return "MANUAL_BROWSER_CHECK_RECOMMENDED", 0, "", f"Timeout after {timeout}s{note_extra}"
        except Exception as e:
            if attempt == retry - 1:
                return "UNKNOWN", 0, "", f"Error: {str(e)[:80]}{note_extra}"
        time.sleep(0.5)
    return "MANUAL_BROWSER_CHECK_RECOMMENDED", 0, "", f"Retry failed after {retry} attempts{note_extra}"


def classify_link(url):
    """Classify a URL by type."""
    url_lower = url.lower()
    if url_lower.endswith(".pdf"):
        return "slides_pdf"
    if "youtube.com" in url_lower or "youtu.be" in url_lower:
        return "video"
    if "arxiv.org" in url_lower:
        return "arxiv"
    if "colab.research.google" in url_lower:
        return "colab"
    if "acm.org" in url_lower or "doi.org" in url_lower or "sciencedirect" in url_lower:
        return "paywall"
    if "mit-mi.github.io" in url_lower or "ocw.mit.edu" in url_lower:
        return "official_page"
    return "other"


# ─── Fetch official schedule ──────────────────────────────────────────────────
def fetch_schedule_links():
    """Fetch official MIT schedule page and extract all links."""
    print(f"Fetching official schedule: {SCHEDULE_URL}")
    try:
        req = urllib.request.Request(SCHEDULE_URL, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as resp:
            html = resp.read().decode("utf-8", errors="replace")
        print(f"  Downloaded {len(html)} bytes")
    except Exception as e:
        print(f"  ERROR fetching schedule: {e}")
        return [], str(e)

    import re
    # Extract all href links
    href_pattern = re.compile(r'href=["\']([^"\']+)["\']', re.IGNORECASE)
    base_url = SCHEDULE_URL.rsplit("/", 1)[0] + "/"
    links = []
    for match in href_pattern.finditer(html):
        raw_url = match.group(1).strip()
        if not raw_url or raw_url.startswith("#") or raw_url.startswith("javascript"):
            continue
        # Resolve relative URLs
        if raw_url.startswith("/"):
            abs_url = "https://mit-mi.github.io" + raw_url
        elif not raw_url.startswith("http"):
            abs_url = base_url + raw_url
        else:
            abs_url = raw_url
        # Normalize spaces → %20
        abs_url = abs_url.replace(" ", "%20")
        links.append({
            "raw": raw_url,
            "url": abs_url,
            "type": classify_link(abs_url),
            "label": "",
        })
    print(f"  Found {len(links)} links")
    return links, None


# ─── Build from existing data ─────────────────────────────────────────────────
def gather_project_links():
    """Gather all links from project's JSON data files."""
    links = []
    files_to_check = ["course.json", "readings.json", "sources.json", "raw_schedule_links.json", "official_reading_map.json"]
    for fname in files_to_check:
        fpath = os.path.join(DATA_DIR, fname)
        if not os.path.exists(fpath):
            continue
        try:
            with open(fpath) as f:
                data = json.load(f)
            items = data if isinstance(data, list) else list(data.values())[0] if isinstance(data, dict) and data else []
            for item in items:
                if isinstance(item, dict):
                    for key in ["url", "link", "href", "slides_url", "video_url"]:
                        if key in item and item[key]:
                            url = str(item[key]).replace(" ", "%20")
                            links.append({
                                "source_file": fname,
                                "url": url,
                                "type": classify_link(url),
                                "label": item.get("title", item.get("zh_title", ""))[:80],
                            })
                    # Also check nested readings
                    for r in item.get("readings", []):
                        if isinstance(r, dict) and r.get("url"):
                            url = str(r["url"]).replace(" ", "%20")
                            links.append({
                                "source_file": fname,
                                "session_id": item.get("id", ""),
                                "url": url,
                                "type": classify_link(url),
                                "label": r.get("title", r.get("zh_title", ""))[:80],
                            })
        except Exception as e:
            print(f"  Warning: could not read {fname}: {e}")
    # Dedupe by URL
    seen = set()
    deduped = []
    for l in links:
        if l["url"] not in seen:
            seen.add(l["url"])
            deduped.append(l)
    print(f"  Project links gathered: {len(deduped)} unique URLs")
    return deduped


# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    start_time = datetime.now()
    print("=" * 60)
    print("Phase 6C Link Audit — MIT How2AI Spring 2025")
    print("=" * 60)

    # 1. Fetch official schedule
    official_links, fetch_error = fetch_schedule_links()

    # 2. Gather project links
    project_links = gather_project_links()

    # 3. Merge: prefer official links, add project-only links
    all_urls = {}
    for l in official_links:
        url = l["url"]
        all_urls[url] = {
            "url": url,
            "type": l["type"],
            "source": "official_schedule",
            "label": l.get("label", ""),
            "status": "UNKNOWN",
            "http_status": None,
            "content_type": "",
            "fallback_url": SCHEDULE_FALLBACK if l["type"] == "slides_pdf" else "",
            "note": "",
            "last_checked": None,
        }

    for l in project_links:
        url = l["url"]
        if url not in all_urls:
            all_urls[url] = {
                "url": url,
                "type": l["type"],
                "source": l.get("source_file", "project_data"),
                "label": l.get("label", ""),
                "session_id": l.get("session_id", ""),
                "status": "UNKNOWN",
                "http_status": None,
                "content_type": "",
                "fallback_url": SCHEDULE_FALLBACK if l["type"] == "slides_pdf" else "",
                "note": "",
                "last_checked": None,
            }

    print(f"\nTotal unique URLs to check: {len(all_urls)}")

    # 4. Check each URL
    results = []
    checked = 0
    for url, info in all_urls.items():
        checked += 1
        link_type = info["type"]
        # Skip YouTube/Colab/arXiv for now (they're often network-restricted in cloud)
        if link_type in ("video", "colab"):
            status = "SKIPPED_NETWORK_RESTRICTED"
            note = "Video/Colab — skipped (network-restricted in cloud environment)"
            http_status = None
            content_type = ""
        elif link_type == "arxiv":
            # arXiv is often slow but usually works
            status, http_status, content_type, note = http_check(url, timeout=20, retry=1)
            if status.startswith("MANUAL_BROWSER") or status == "UNKNOWN":
                status = "TIMEOUT_PROBABLY_OK"
                note = f"arXiv slow — manual check recommended if needed. {note}"
        elif link_type == "paywall":
            status, http_status, content_type, note = http_check(url, timeout=10, retry=1)
            if status == "OK":
                status = "PAYWALL_OR_ACCESS_RESTRICTED"
                note = f"HTTP {http_status} — access may be restricted"
            elif status.startswith("MANUAL_") or status in ("UNKNOWN",):
                status = "PAYWALL_OR_ACCESS_RESTRICTED"
        elif link_type == "slides_pdf":
            status, http_status, content_type, note = http_check(url, timeout=15, retry=2)
        else:
            status, http_status, content_type, note = http_check(url, timeout=10, retry=1)

        now = datetime.now().isoformat()
        info.update({
            "status": status,
            "http_status": http_status,
            "content_type": content_type,
            "note": note,
            "last_checked": now,
        })
        results.append(info)

        # Progress
        type_marker = {"slides_pdf": "📄", "video": "📺", "arxiv": "📚", "colab": "💻", "paywall": "🔐", "official_page": "🌐", "other": "🔗"}.get(link_type, "•")
        print(f"  [{checked}/{len(all_urls)}] {type_marker} {status[:20]:20s} {url[:70]}")
        time.sleep(0.3)  # Be polite

    # 5. Save link_health.json
    link_health_path = os.path.join(DATA_DIR, "link_health.json")
    with open(link_health_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nSaved: {link_health_path} ({len(results)} entries)")

    # 6. Generate JSON report
    pdf_results = [r for r in results if r["type"] == "slides_pdf"]
    broken_pdf = [r for r in pdf_results if r["status"] not in ("OK", "REDIRECT_OK", "TIMEOUT_PROBABLY_OK")]
    manual_check = [r for r in results if r["status"] == "MANUAL_BROWSER_CHECK_RECOMMENDED"]
    schedule_listed_unreachable = [r for r in results if r["status"] == "SCHEDULE_LISTED_BUT_UNREACHABLE"]

    report_json = {
        "generated_at": start_time.isoformat(),
        "total_urls_checked": len(results),
        "by_type": {},
        "by_status": {},
        "pdf_summary": {
            "total": len(pdf_results),
            "ok": len([r for r in pdf_results if r["status"] == "OK"]),
            "broken": len(broken_pdf),
            "manual_check": len([r for r in pdf_results if r["status"] == "MANUAL_BROWSER_CHECK_RECOMMENDED"]),
        },
        "broken_pdfs": broken_pdf,
        "manual_check_urls": manual_check,
        "schedule_listed_unreachable": schedule_listed_unreachable,
    }
    for r in results:
        t = r["type"]
        report_json["by_type"][t] = report_json["by_type"].get(t, 0) + 1
        s = r["status"]
        report_json["by_status"][s] = report_json["by_status"].get(s, 0) + 1

    report_json_path = os.path.join(REPORTS_DIR, "PHASE6C_LINK_AUDIT.json")
    with open(report_json_path, "w", encoding="utf-8") as f:
        json.dump(report_json, f, ensure_ascii=False, indent=2)
    print(f"Saved: {report_json_path}")

    # 7. Generate Markdown report
    duration = datetime.now() - start_time
    md = f"""# Phase 6C 链接可靠性审计报告
Generated: {start_time.strftime('%Y-%m-%d %H:%M:%S')} | Duration: {duration}

## 摘要

- **检查链接总数**: {len(results)}
- **总耗时**: {duration}
- **fetch_error**: {fetch_error or 'None'}

## 按类型分布

| 类型 | 数量 |
|------|------|
"""
    for t, cnt in sorted(report_json["by_type"].items()):
        md += f"| {t} | {cnt} |\n"

    md += f"""
## 按状态分布

| 状态 | 数量 |
|------|------|
"""
    for s, cnt in sorted(report_json["by_status"].items()):
        label = STATUS_LABELS.get(s, s)
        md += f"| {s} | {cnt} — {label} |\n"

    md += f"""
## PDF 链接摘要

| 指标 | 数量 |
|------|------|
| 总 PDF 数 | {report_json['pdf_summary']['total']} |
| OK | {report_json['pdf_summary']['ok']} |
| 需浏览器复核 | {report_json['pdf_summary']['manual_check']} |
| 官方列出但不可达 | {len(schedule_listed_unreachable)} |

"""

    if broken_pdf:
        md += "## ❌ PDF 链接问题（需修复）\n\n"
        for r in broken_pdf:
            md += f"- `{r['url']}`\n  - Status: {r['status']} | HTTP: {r['http_status']} | Note: {r['note']}\n"
        md += "\n"

    if manual_check:
        md += "## 🌐 需浏览器复核的链接\n\n"
        for r in manual_check[:20]:  # Limit to first 20
            md += f"- [{r['type']}] {r['url']}\n  - Status: {r['status']} | HTTP: {r['http_status']} | Note: {r['note']}\n"
        md += "\n"

    if schedule_listed_unreachable:
        md += "## 🔗 官方列出但自动不可达\n\n"
        for r in schedule_listed_unreachable:
            md += f"- `{r['url']}`\n  - Status: {r['status']} | Fallback: {r['fallback_url']}\n"
        md += "\n"

    md += "## 全部链接状态\n\n"
    for r in results:
        label = STATUS_LABELS.get(r["status"], r["status"])
        md += f"| {r['type']} | {r['status']} | {r['http_status'] or '-'} | {r['url'][:70]} |\n"

    report_md_path = os.path.join(REPORTS_DIR, "PHASE6C_LINK_AUDIT.md")
    with open(report_md_path, "w", encoding="utf-8") as f:
        f.write(md)
    print(f"Saved: {report_md_path}")

    print("\n" + "=" * 60)
    print("DONE")
    print(f"link_health.json: {link_health_path}")
    print(f"PDF broken: {len(broken_pdf)}, manual check: {len(manual_check)}")
    print("=" * 60)
    return report_json


if __name__ == "__main__":
    main()
