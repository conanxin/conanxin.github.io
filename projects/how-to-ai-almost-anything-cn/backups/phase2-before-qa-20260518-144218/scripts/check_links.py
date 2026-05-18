#!/usr/bin/env python3
"""
check_links.py
检查 course.json 和 readings.json 中所有 URL 的可达性。
运行: python3 scripts/check_links.py
"""

import json
import sys
import urllib.request
import urllib.error
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

PROJECT_DIR = Path(__file__).parent.parent
DATA_DIR = PROJECT_DIR / "data"
TIMEOUT = 10

def check_url(url, timeout=TIMEOUT):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=timeout)
        return url, resp.status, True
    except urllib.error.HTTPError as e:
        return url, e.code, False
    except urllib.error.URLError:
        return url, 0, False
    except Exception:
        return url, 0, False

def collect_urls():
    urls = []
    for fname in ["course.json", "readings.json"]:
        path = DATA_DIR / fname
        if not path.exists():
            continue
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        for item in data:
            url = item.get("url", "").strip()
            if url:
                urls.append((url, item.get("id", "?"), fname))
            slides = item.get("slides_url", "").strip()
            if slides:
                urls.append((slides, item.get("id", "?"), fname))
            video = item.get("video_url", "").strip()
            if video and "youtube.com" in video:
                urls.append((video, item.get("id", "?"), fname))
    return urls

def main():
    print("=" * 50)
    print("How2AI 中文课程 — 链接可用性检查")
    print("=" * 50)

    urls = collect_urls()
    if not urls:
        print("未找到任何 URL")
        return 0

    print(f"\n共 {len(urls)} 个链接待检查 ...")
    results = []
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(check_url, u[0]): u for u in urls}
        for future in as_completed(futures):
            result = future.result()
            results.append(result)

    ok = [r for r in results if r[2]]
    fail = [r for r in results if not r[2]]

    print(f"\n✅ 可达: {len(ok)}")
    print(f"❌ 失败: {len(fail)}")
    if fail:
        print("\n失败链接详情：")
        for url, code, _ in fail:
            print(f"  [{code}] {url}")
    else:
        print("所有链接均可访问！")
    return 0 if not fail else 1

if __name__ == "__main__":
    sys.exit(main())
