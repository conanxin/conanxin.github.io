#!/usr/bin/env python3
"""
build_audio.py — 生成 Calvin and Hobbes 页面 v0.3 的中文朗读音频

输入：
  - /tmp/calvin_article_zh.txt  （从 index.html #article-translation 提取）
  - /tmp/calvin_speech_zh.txt   （从 index.html #speech-translation 提取）

输出：
  - projects/calvin-hobbes-integrity-cn/audio/article-zh.mp3
  - projects/calvin-hobbes-integrity-cn/audio/speech-zh.mp3

策略：
  - 文本过长（>4500 字符）时，edge-tts 容易触发内部长度保护或产生瑕疵。
    改用分块调用 + ffmpeg concat 合并，得到单文件 mp3。
  - 语速 -10%（与网页目标一致：略慢，适合边听边读）。
  - 输出格式 mp3，48 kbps 比特率，对纯朗读足够。
  - 若 ffmpeg 不可用，则输出多段 mp3 由页面在 <audio> 列表里加载。

本脚本不依赖任何 apt 包；只用已安装的 Python 包 edge-tts 和 ffmpeg 系统工具。
"""

import asyncio
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

VOICE = "zh-CN-YunxiNeural"
RATE  = "-10%"   # 略慢

BITRATE = "48k"
SAMPLE_RATE = "24000"

# 安全块大小：每块约 4500 字符（避免 edge-tts 内部缓冲问题）
CHUNK_SIZE = 4500


def split_text(text: str, size: int = CHUNK_SIZE) -> list:
    """按段落切分，不在句中硬切。"""
    paras = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    chunks, buf = [], ""
    for p in paras:
        if len(buf) + len(p) + 2 <= size:
            buf = (buf + "\n\n" + p) if buf else p
        else:
            if buf:
                chunks.append(buf)
                buf = ""
            if len(p) > size:
                # 极长段：再按句号切
                sentences = re.split(r"(?<=[。！？!?])\s*", p)
                buf2 = ""
                for s in sentences:
                    if len(buf2) + len(s) + 1 <= size:
                        buf2 = (buf2 + s) if buf2 else s
                    else:
                        if buf2:
                            chunks.append(buf2)
                            buf2 = s
                        else:
                            chunks.append(s)
                if buf2:
                    chunks.append(buf2)
            else:
                buf = p
    if buf:
        chunks.append(buf)
    return chunks


async def tts_one(text: str, out_path: Path) -> None:
    """单次 TTS 调用。"""
    import edge_tts
    communicate = edge_tts.Communicate(text=text, voice=VOICE, rate=RATE)
    await communicate.save(str(out_path))


async def tts_chunks(text: str, tmpdir: Path, base: str) -> list:
    """分段 TTS，返回分段文件路径列表。"""
    import edge_tts
    chunks = split_text(text)
    print(f"  → {base}: {len(chunks)} 块, 字符总数 {len(text)}")
    paths = []
    for i, chunk in enumerate(chunks, 1):
        out = tmpdir / f"{base}_{i:02d}.mp3"
        print(f"    块 {i}/{len(chunks)} ({len(chunk)} chars) -> {out.name}")
        comm = edge_tts.Communicate(text=chunk, voice=VOICE, rate=RATE)
        await comm.save(str(out))
        paths.append(out)
    return paths


def concat_mp3(parts: list, out_path: Path) -> None:
    """用 ffmpeg 拼接多段 mp3。"""
    if not shutil.which("ffmpeg"):
        raise RuntimeError("ffmpeg 不可用，无法拼接。")
    list_file = out_path.with_suffix(".list.txt")
    with list_file.open("w", encoding="utf-8") as f:
        for p in parts:
            f.write(f"file '{p.resolve()}'\n")
    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(list_file),
        "-c", "copy",
        "-b:a", BITRATE,
        str(out_path),
    ]
    print(f"  → ffmpeg concat: {' '.join(cmd)}")
    subprocess.run(cmd, check=True, capture_output=True)
    list_file.unlink(missing_ok=True)


async def synthesize(text: str, final: Path, base: str) -> None:
    final.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="tts_") as td:
        tmpdir = Path(td)
        parts = await tts_chunks(text, tmpdir, base)
        if len(parts) == 1:
            shutil.copy(parts[0], final)
        else:
            concat_mp3(parts, final)
    size_mb = final.stat().st_size / 1024 / 1024
    print(f"  ✓ {final} ({size_mb:.2f} MB)")


async def main():
    article_path = Path("/tmp/calvin_article_zh.txt")
    speech_path  = Path("/tmp/calvin_speech_zh.txt")
    if not article_path.exists() or not speech_path.exists():
        print("ERROR: 缺少 /tmp/calvin_*.txt 输入文件", file=sys.stderr)
        sys.exit(1)

    # 输出目录 = 脚本所在目录的同级 audio/
    here = Path(__file__).resolve().parent
    out_dir = here.parent / "audio"
    out_dir.mkdir(parents=True, exist_ok=True)

    article_text = article_path.read_text(encoding="utf-8").strip()
    speech_text  = speech_path.read_text(encoding="utf-8").strip()

    print(f"=== article: {len(article_text)} 字符, voice={VOICE}, rate={RATE} ===")
    await synthesize(article_text, out_dir / "article-zh.mp3", "article")

    print(f"=== speech:  {len(speech_text)} 字符, voice={VOICE}, rate={RATE} ===")
    await synthesize(speech_text,  out_dir / "speech-zh.mp3",  "speech")

    print("\nDONE")


if __name__ == "__main__":
    asyncio.run(main())