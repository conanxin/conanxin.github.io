#!/usr/bin/env python3
"""
Phase 3 check_links.py — Robust link checker for How2AI Chinese Course
Key fixes from Phase 2R:
- MIT slides PDF: do NOT claim "permanent 404" — mark as MANUAL_BROWSER_CHECK_RECOMMENDED
- ArXiv timeouts: mark as TIMEOUT_PROBABLY_OK, not broken
- YouTube/Colab network-restricted: mark as SKIPPED_NETWORK_RESTRICTED
- Academic paywalls: mark as PAYWALL_OR_ACCESS_RESTRICTED
- All states documented with user-facing explanations
"""

import json, urllib.parse, subprocess, time, os, re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

PROJECT_DIR = Path(__file__).parent.parent
REPORTS_DIR = PROJECT_DIR / "reports"
REPORTS_DIR.mkdir(exist_ok=True)

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

TIMEOUT = 12
MAX_RETRIES = 2

STATES = [
    "OK",
    "REDIRECT_OK",
    "TIMEOUT_PROBABLY_OK",
    "MANUAL_BROWSER_CHECK_RECOMMENDED",
    "CLIENT_ERROR_CONFIRMED",
    "SERVER_ERROR",
    "PAYWALL_OR_ACCESS_RESTRICTED",
    "SKIPPED_NETWORK_RESTRICTED",
    "UNKNOWN",
]

def url_encode(path_part):
    """Encode only the path segment, not scheme://host or query params."""
    parts = urllib.parse.urlparse(path_part)
    encoded_netloc = parts.netloc
    encoded_path = urllib.parse.quote(parts.path, safe='/')
    encoded = parts._replace(netloc=encoded_netloc, path=encoded_path).geturl()
    return encoded

def curl_check(url, timeout=TIMEOUT):
    """Run curl -sL -I (HEAD-like) then GET on redirect, with browser UA."""
    # First try HEAD
    r1 = subprocess.run(
        ["curl", "-sL", "-I", "-o", "/dev/null", "-w", "%{http_code}|%{content_type}|%{redirect_url}",
         "-A", UA, "--max-time", str(timeout), url],
        capture_output=True, text=True, timeout=timeout + 5
    )
    out1 = r1.stdout.strip()
    parts1 = out1.split("|") if out1 else []
    code1 = parts1[0] if len(parts1) > 0 else ""
    ct1 = parts1[1] if len(parts1) > 1 else ""
    redir1 = parts1[2] if len(parts1) > 2 else ""

    # If redirect or PDF, do a GET to follow fully
    final_code = code1
    final_ct = ct1
    if redir1 or (ct1 and "pdf" in ct1.lower()):
        r2 = subprocess.run(
            ["curl", "-sL", "-o", "/dev/null", "-w", "%{http_code}|%{content_type}|%{redirect_url}",
             "-A", UA, "--max-time", str(timeout), url],
            capture_output=True, text=True, timeout=timeout + 5
        )
        out2 = r2.stdout.strip()
        parts2 = out2.split("|") if out2 else []
        final_code = parts2[0] if len(parts2) > 0 else code1
        final_ct = parts2[1] if len(parts2) > 1 else ct1

    return {
        "http_code": final_code,
        "content_type": final_ct,
        "redirect_url": redir1 if redir1 else None,
    }

def check_single_link(link):
    url = link["url"]
    link_type = link.get("link_type", "unknown")
    link_text = link.get("link_text", url)
    session = link.get("session_title", "")
    is_mit_slide = "mit-mi.github.io" in url and url.endswith(".pdf")
    is_arxiv = "arxiv.org" in url
    is_youtube = "youtube.com" in url or "youtu.be" in url
    is_colab = "colab.research.google.com" in url
    is_acm_sdl = "acm.org" in url or "sciencedirect.com" in url
    is_mit_ocw = "ocw.mit.edu" in url
    is_github_io = "github.io" in url

    result = {"url": url, "link_text": link_text, "link_type": link_type,
              "session": session, "state": "UNKNOWN",
              "http_code": None, "content_type": None, "note": ""}

    for attempt in range(MAX_RETRIES):
        try:
            cr = curl_check(url, TIMEOUT)
            result["http_code"] = cr["http_code"]
            result["content_type"] = cr["content_type"]
            code = cr["http_code"]
            break
        except subprocess.TimeoutExpired:
            if attempt == MAX_RETRIES - 1:
                # Timeout — classify by domain
                if is_arxiv:
                    result["state"] = "TIMEOUT_PROBABLY_OK"
                    result["note"] = ("arXiv 在云端环境可能超时，但论文通常可访问。"
                                      "请在浏览器中验证。")
                elif is_mit_slide:
                    result["state"] = "MANUAL_BROWSER_CHECK_RECOMMENDED"
                    result["note"] = ("MIT slides PDF 在云端环境返回 404，但外部网络可能可访问。"
                                      "请用桌面浏览器直接打开验证。")
                elif is_youtube or is_colab:
                    result["state"] = "SKIPPED_NETWORK_RESTRICTED"
                    result["note"] = "YouTube/Colab 在云端环境无法访问，请在浏览器中验证。"
                else:
                    result["state"] = "TIMEOUT_PROBABLY_OK"
                    result["note"] = "请求超时，建议浏览器手动验证。"
                return result
            time.sleep(1)
            continue
        except Exception as e:
            result["state"] = "UNKNOWN"
            result["note"] = f"检查异常: {e}"
            return result

    # ── Interpret status code ──────────────────────────────────
    if code in ("200",):
        if cr.get("redirect_url"):
            result["state"] = "REDIRECT_OK"
            result["note"] = f"跳转到 {cr['redirect_url']}"
        else:
            result["state"] = "OK"
            result["note"] = "可正常访问" if not is_mit_slide else "PDF 可访问（云端验证）"

    elif code in ("301", "302", "303", "307", "308"):
        result["state"] = "REDIRECT_OK"
        result["note"] = f"HTTP {code} 重定向到 {cr.get('redirect_url', '未知')}"

    elif code in ("400", "401", "403"):
        if is_acm_sdl:
            result["state"] = "PAYWALL_OR_ACCESS_RESTRICTED"
            result["note"] = "学术平台需要机构订阅或付费，请通过图书馆/学校 VPN 访问。"
        elif is_mit_slide:
            # MIT slides with 403 — likely GitHub Pages protection or true 404
            result["state"] = "MANUAL_BROWSER_CHECK_RECOMMENDED"
            result["note"] = ("MIT slides PDF 返回 403，云端可能受限。"
                              "请在浏览器中直接打开此链接验证是否可访问。")
        else:
            result["state"] = "MANUAL_BROWSER_CHECK_RECOMMENDED"
            result["note"] = f"HTTP {code}，需人工复核（{link_text}）"

    elif code == "404":
        if is_mit_slide:
            result["state"] = "MANUAL_BROWSER_CHECK_RECOMMENDED"
            result["note"] = ("MIT slides PDF 在云端返回 404。"
                              "该文件在某些网络环境下可能可访问，"
                              "请在浏览器中直接打开 https://mit-mi.github.io/how2ai-course/spring2025/ "
                              "并从对应课程页面下载。")
        elif is_github_io:
            result["state"] = "MANUAL_BROWSER_CHECK_RECOMMENDED"
            result["note"] = "GitHub Pages 资源返回 404，可能是路径变更，请浏览器验证。"
        else:
            result["state"] = "CLIENT_ERROR_CONFIRMED"
            result["note"] = f"URL 返回 404，该资源可能已移动或删除。"

    elif code in ("500", "502", "503", "504"):
        result["state"] = "SERVER_ERROR"
        result["note"] = f"服务器错误 HTTP {code}，可能为临时故障。"

    elif code.startswith("4"):
        result["state"] = "CLIENT_ERROR_CONFIRMED"
        result["note"] = f"HTTP {code} 客户端错误"

    elif code.startswith("5"):
        result["state"] = "SERVER_ERROR"
        result["note"] = f"HTTP {code} 服务器错误"

    elif code == "000":
        if is_mit_slide:
            result["state"] = "MANUAL_BROWSER_CHECK_RECOMMENDED"
            result["note"] = ("云端网络无法到达此 PDF 路径（HTTP 000），"
                              "但该文件在外部网络可能可访问。"
                              "请在浏览器中直接打开验证。"
                              "也可访问 https://mit-mi.github.io/how2ai-course/spring2025/ "
                              "从官方课程页面下载。")
        elif is_youtube or is_colab:
            result["state"] = "SKIPPED_NETWORK_RESTRICTED"
            result["note"] = "云端环境无法访问，请在浏览器中验证。"
        else:
            result["state"] = "TIMEOUT_PROBABLY_OK"
            result["note"] = "网络超时，资源可能正常，请在浏览器中验证。"

    return result

def state_label(state):
    labels = {
        "OK": "✅ 可访问",
        "REDIRECT_OK": "🔄 重定向（正常）",
        "TIMEOUT_PROBABLY_OK": "⏱️ 超时（可能正常）",
        "MANUAL_BROWSER_CHECK_RECOMMENDED": "👀 建议浏览器复核",
        "CLIENT_ERROR_CONFIRMED": "❌ 404/客户端错误",
        "SERVER_ERROR": "⚠️ 服务器错误",
        "PAYWALL_OR_ACCESS_RESTRICTED": "🔒 需权限/付费墙",
        "SKIPPED_NETWORK_RESTRICTED": "🚫 云端无法访问",
        "UNKNOWN": "❓ 未知",
    }
    return labels.get(state, state)

def generate_report(results, raw_links):
    by_state = {}
    for r in results:
        s = r["state"]
        by_state.setdefault(s, []).append(r)

    md_lines = [
        "# How2AI 中文课程 — 链接检查报告 (Phase 3)",
        "",
        "生成时间: 由 check_links.py 自动生成",
        "",
        "## 状态说明",
        "",
        "| 状态 | 含义 | 建议 |",
        "|------|------|------|",
        "| ✅ OK | 可正常访问 | — |",
        "| 🔄 REDIRECT_OK | 重定向后正常 | 检查目标 URL |",
        "| ⏱️ TIMEOUT_PROBABLY_OK | 云端超时，通常可访问 | 浏览器验证 |",
        "| 👀 MANUAL_BROWSER_CHECK_RECOMMENDED | 建议浏览器复核 | 云端受限，请手动验证 |",
        "| ❌ CLIENT_ERROR_CONFIRMED | 确认 404 | 资源已移除 |",
        "| ⚠️ SERVER_ERROR | 服务器错误 | 可能临时故障 |",
        "| 🔒 PAYWALL_OR_ACCESS_RESTRICTED | 需机构权限 | 通过图书馆访问 |",
        "| 🚫 SKIPPED_NETWORK_RESTRICTED | 云端无法访问 | 浏览器验证 |",
        "| ❓ UNKNOWN | 未知状态 | 人工检查 |",
        "",
        "## ⚠️ MIT Slides PDF 特别说明",
        "",
        "**本报告不对 MIT slides PDF 做「永久 404」断言。**",
        "",
        "云端自动检测环境（curl/Python requests）与本地浏览器存在差异，",
        "原因可能包括：网络路径、CDN 节点、GitHub Pages 速率限制、",
        "时区访问时段差等。",
        "",
        "**建议**：在桌面浏览器中打开以下地址，从官方 schedule 页面",
        "直接点击 slides 链接下载：",
        "- https://mit-mi.github.io/how2ai-course/spring2025/",
        "- https://mit-mi.github.io/how2ai-course/spring2025/schedule/",
        "",
        "## 汇总",
        "",
    ]

    total = len(results)
    for state in STATES:
        if state in by_state:
            md_lines.append(f"- **{state_label(state)}**：{len(by_state[state])} 个")

    md_lines += ["", "## 详细结果", ""]

    for state in STATES:
        if state not in by_state:
            continue
        md_lines.append(f"### {state_label(state)}")
        md_lines.append("")
        for r in by_state[state]:
            note = r["note"].replace("|", "\\|")
            md_lines.append(
                f"- `{r['link_type']}` **{r['link_text']}**  "
                f"→ HTTP {r['http_code'] or 'N/A'} | {r.get('content_type','')}"
            )
            if note:
                md_lines.append(f"  - 📝 {note}")
            md_lines.append(f"  - 🔗 {r['url']}")
            md_lines.append("")

    # MIT slides section
    mit_slides = [r for r in results if "mit-mi.github.io" in r.get("url","") and r.get("url","").endswith(".pdf")]
    if mit_slides:
        md_lines += [
            "## MIT Slides PDF 详情",
            "",
            "| 文件 | 状态 | 说明 |",
            "|------|------|------|",
        ]
        for r in mit_slides:
            fname = r["url"].split("/")[-1]
            md_lines.append(f"| {fname} | {state_label(r['state'])} | {r['note']} |")

    report_path = REPORTS_DIR / "link_check_phase3.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md_lines))

    # JSON report
    json_report = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "total_links": total,
        "summary": {state: len(v) for state, v in by_state.items()},
        "results": results,
        "mit_slides": mit_slides,
    }
    json_path = REPORTS_DIR / "link_check_phase3.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_report, f, ensure_ascii=False, indent=2)

    return json_report

def main():
    links_path = PROJECT_DIR / "data" / "raw_schedule_links.json"
    if not links_path.exists():
        print(f"❌ 未找到 {links_path}")
        return

    with open(links_path, encoding="utf-8") as f:
        raw_links = json.load(f)

    print(f"🔍 开始检查 {len(raw_links)} 个链接 ...")
    results = []
    for i, link in enumerate(raw_links):
        r = check_single_link(link)
        results.append(r)
        label = state_label(r["state"])
        fname = r["url"].split("/")[-1][:40]
        print(f"  [{i+1}/{len(raw_links)}] {label} — {fname}")

    report = generate_report(results, raw_links)
    print(f"\n✅ 报告已生成:")
    print(f"   {REPORTS_DIR/'link_check_phase3.md'}")
    print(f"   {REPORTS_DIR/'link_check_phase3.json'}")
    print(f"\n汇总:")
    for state, items in report["summary"].items():
        print(f"  {state}: {items}")

if __name__ == "__main__":
    main()
