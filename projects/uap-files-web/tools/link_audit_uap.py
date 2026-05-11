#!/usr/bin/env python3
"""
UAP Files v0.6.1 — Link Audit Tool
Scans index.html, data.js, README.md for http/https links and checks their status.
Outputs: reports/uap_files_v0_6_1_link_audit.json + .md
"""
import subprocess, re, json, os, datetime, urllib.request, urllib.error

BASE = "/home/ubuntu/projects/uap-files-web"
OUT_DIR = f"{BASE}/reports"
os.makedirs(OUT_DIR, exist_ok=True)

def extract_links(filepath):
    """Extract all http/https URLs from a file."""
    with open(filepath, encoding="utf-8", errors="ignore") as f:
        text = f.read()
    return list(set(re.findall(r'https?://[^\s\'"<>]+', text)))

def check_link(url, timeout=15):
    """Check a URL and return status info."""
    # Skip very large files
    skip_patterns = [".zip", ".tar.gz", ".iso", ".img", ".bin", ".pkg"]
    if any(url.lower().endswith(ext) for ext in skip_patterns):
        return {"url": url, "status": "LARGE_SKIPPED", "notes": "Binary archive extension"}

    try:
        req = urllib.request.Request(url, method="HEAD",
            headers={"User-Agent": "Mozilla/5.0 (compatible; UAP-Files-Audit/1.0)"})
        req.timeout = timeout
        try:
            with urllib.request.urlopen(req) as resp:
                code = resp.status
                loc = resp.url
        except urllib.error.HTTPError as e:
            code = e.code
            loc = e.url if hasattr(e, 'url') else url

        if code == 200:
            # Check content-length
            cl = resp.headers.get("Content-Length", "0")
            try:
                if int(cl) > 25 * 1024 * 1024:
                    return {"url": url, "status": "LARGE_SKIPPED", "notes": f"Content-Length {int(int(cl)/1024/1024):.0f}MB > 25MB limit"}
            except (ValueError, TypeError):
                pass
            ct = resp.headers.get("Content-Type", "")
            if "application/pdf" in ct or "application/octet-stream" in ct:
                if cl and int(cl) > 5 * 1024 * 1024:
                    return {"url": url, "status": "LARGE_SKIPPED", "notes": f"PDF/binary {int(int(cl)/1024/1024):.0f}MB > 5MB limit"}
            return {"url": url, "status": "OK", "notes": f"HTTP {code}", "final_url": loc}

        elif code in (301, 302, 303, 307, 308):
            return {"url": url, "status": "REDIRECT_OK", "notes": f"HTTP {code} → {loc}", "final_url": loc}

        elif code == 403:
            return {"url": url, "status": "ACCESS_RESTRICTED", "notes": "HTTP 403 Forbidden"}

        elif code == 401:
            return {"url": url, "status": "ACCESS_RESTRICTED", "notes": "HTTP 401 Unauthorized"}

        elif code == 404:
            return {"url": url, "status": "BROKEN", "notes": f"HTTP 404"}

        else:
            return {"url": url, "status": f"HTTP_{code}", "notes": f"HTTP {code}"}

    except urllib.error.URLError as e:
        reason = str(e.reason)
        if "timed out" in reason.lower() or "Timeout" in reason:
            return {"url": url, "status": "TIMEOUT", "notes": reason[:80]}
        elif "SSL" in reason or "CERTIFICATE" in reason:
            return {"url": url, "status": "SSL_ERROR", "notes": reason[:80]}
        elif "connection" in reason.lower():
            return {"url": url, "status": "CONNECTION_ERROR", "notes": reason[:80]}
        else:
            return {"url": url, "status": "NETWORK_ERROR", "notes": reason[:80]}

    except Exception as e:
        return {"url": url, "status": "ERROR", "notes": str(e)[:80]}

def run_audit():
    files = {
        "index.html": f"{BASE}/index.html",
        "data.js": f"{BASE}/data.js",
        "README.md": f"{BASE}/README.md",
    }

    all_links = []
    link_sources = {}

    for fname, fpath in files.items():
        if not os.path.exists(fpath):
            print(f"SKIP (not found): {fname}")
            continue
        links = extract_links(fpath)
        for url in links:
            if url not in link_sources:
                link_sources[url] = []
            link_sources[url].append(fname)
        all_links.extend(links)
        print(f"{fname}: found {len(links)} links")

    all_links = list(set(all_links))
    print(f"\nTotal unique links to check: {len(all_links)}")

    results = []
    for i, url in enumerate(all_links):
        print(f"  [{i+1}/{len(all_links)}] {url[:80]}")
        result = check_link(url)
        result["sources"] = link_sources[url]
        results.append(result)
        print(f"    → {result['status']}: {result['notes'][:60]}")

    return results

def write_outputs(results):
    # JSON
    report_json = {
        "audit_date": datetime.datetime.now().isoformat(),
        "total_links": len(results),
        "summary": {
            s: sum(1 for r in results if r["status"] == s)
            for s in set(r["status"] for r in results)
        },
        "results": sorted(results, key=lambda r: (r["status"] != "OK", r["status"] != "REDIRECT_OK", r["status"]))
    }
    json_path = f"{OUT_DIR}/uap_files_v0_6_1_link_audit.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(report_json, f, ensure_ascii=False, indent=2)
    print(f"\nJSON report: {json_path}")

    # Markdown
    md_path = f"{OUT_DIR}/uap_files_v0_6_1_link_audit.md"
    summary = report_json["summary"]
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("# UAP Files Link Audit — v0.6.1\n\n")
        f.write(f"**Audit date:** {report_json['audit_date']}\n")
        f.write(f"**Total unique links:** {len(results)}\n\n")
        f.write("## Summary\n\n")
        f.write("| Status | Count |\n|--------|-------|\n")
        for status, count in sorted(summary.items()):
            f.write(f"| {status} | {count} |\n")
        f.write("\n## Detailed Results\n\n")
        for r in report_json["results"]:
            sources = ", ".join(r["sources"])
            f.write(f"### {r['status']}: {r['url']}\n\n")
            f.write(f"- **Sources:** {sources}\n")
            f.write(f"- **Notes:** {r['notes']}\n")
            if "final_url" in r:
                f.write(f"- **Final URL:** {r['final_url']}\n")
            f.write("\n")
    print(f"Markdown report: {md_path}")

if __name__ == "__main__":
    print("UAP Files Link Audit Tool")
    print("=" * 40)
    results = run_audit()
    write_outputs(results)
    print("\nDone.")
