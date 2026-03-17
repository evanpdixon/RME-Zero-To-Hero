"""
Generate MP3 audio files for each chapter using Edge TTS (Andrew Neural).
Usage: python generate_audio.py
"""

import asyncio
import json
import os
import re
import subprocess

VOICE = "en-US-AndrewNeural"
AUDIO_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio")
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))


def extract_chapters():
    """Extract chapter text from dashboard HTML."""
    dashboard = os.path.join(SCRIPT_DIR, "dashboard.html")

    # Re-generate dashboard
    subprocess.run(["node", "generate_dashboard.js"], cwd=SCRIPT_DIR, check=True,
                   capture_output=True)

    with open(dashboard, "r", encoding="utf-8") as f:
        html = f.read()

    def strip_tags(s):
        s = re.sub(r'<[^>]+>', ' ', s)
        s = s.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
        s = s.replace('&quot;', '"').replace('&#39;', "'").replace('&mdash;', ' -- ')
        s = re.sub(r'\s+', ' ', s).strip()
        return s

    # Split HTML into sections
    section_pattern = r'<section id="(ch\d+)" class="chapter">(.*?)</section>'
    chapters = []

    for match in re.finditer(section_pattern, html, re.DOTALL):
        ch_id = match.group(1)
        content = match.group(2)

        # Skip placeholder chapters
        if 'placeholder-chapter' in content or 'has not been written yet' in content:
            continue

        # Get title
        title_match = re.search(r'<h2 class="chapter-title">(.*?)</h2>', content)
        title = strip_tags(title_match.group(1)) if title_match else ch_id

        # Get all readable content: section titles, paragraphs, expand notes
        text_parts = []

        # Section titles
        for m in re.finditer(r'<h3 class="section-title"[^>]*>(.*?)</h3>', content, re.DOTALL):
            text_parts.append(("heading", strip_tags(m.group(1)), m.start()))

        # Paragraphs
        for m in re.finditer(r'<p class="book-para[^"]*"[^>]*>(.*?)</p>', content, re.DOTALL):
            text_parts.append(("para", strip_tags(m.group(1)), m.start()))

        # Expand notes (read them too — they're editorial notes)
        for m in re.finditer(r'<div class="expand-note"[^>]*>(.*?)</div>', content, re.DOTALL):
            t = strip_tags(m.group(1))
            text_parts.append(("note", "Note: " + t, m.start()))

        # Sort by position in document
        text_parts.sort(key=lambda x: x[2])

        # Build full text with natural pauses
        full_text = title + ".\n\n"
        for kind, text, _ in text_parts:
            if kind == "heading":
                full_text += "\n" + text + ".\n\n"
            else:
                full_text += text + "\n\n"

        if len(text_parts) > 0:
            chapters.append({
                "id": ch_id,
                "title": title,
                "text": full_text.strip(),
                "para_count": len([p for p in text_parts if p[0] == "para"])
            })

    return chapters


async def generate_chapter_audio(chapter, index):
    """Generate MP3 for a single chapter."""
    import edge_tts

    safe_title = re.sub(r'[^a-z0-9]+', '-', chapter['title'].lower()).strip('-')
    filename = f"ch{index:02d}-{safe_title}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    text = chapter["text"]
    char_count = len(text)
    print(f"  [{index}] {chapter['title']} ({char_count} chars, {chapter['para_count']} paras)...")

    communicate = edge_tts.Communicate(text, VOICE, rate="+0%", pitch="+0Hz")
    await communicate.save(filepath)

    size_mb = os.path.getsize(filepath) / (1024 * 1024)
    print(f"       -> {filename} ({size_mb:.1f} MB)")

    return filename


async def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)

    print("Extracting chapters from dashboard...")
    chapters = extract_chapters()
    print(f"Found {len(chapters)} chapters\n")

    if not chapters:
        print("ERROR: No chapters found!")
        return

    filenames = []
    for i, ch in enumerate(chapters):
        fname = await generate_chapter_audio(ch, i + 1)
        filenames.append(fname)

    # Write manifest
    manifest = []
    for i, ch in enumerate(chapters):
        manifest.append({
            "id": ch["id"],
            "title": ch["title"],
            "file": "audio/" + filenames[i]
        })

    manifest_path = os.path.join(AUDIO_DIR, "manifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nDone! {len(filenames)} MP3s in ./audio/")
    print(f"Manifest: {manifest_path}")


if __name__ == "__main__":
    asyncio.run(main())
