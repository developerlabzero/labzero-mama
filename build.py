"""Build a single-file, offline copy of LabZero Mama.

Usage: python3 build.py
Writes dist/labzero-mama.html (open it directly in any browser).
"""
import pathlib, re

ROOT = pathlib.Path(__file__).parent
src = (ROOT / "src" / "index.html").read_text(encoding="utf-8")

def inline_script(match):
    path = (ROOT / "src" / match.group(1)).resolve()
    return "<script>\n" + path.read_text(encoding="utf-8") + "\n</script>"

out = src.replace('<link rel="stylesheet" href="styles.css">',
                  "<style>\n" + (ROOT / "src" / "styles.css").read_text(encoding="utf-8") + "\n</style>")
out = re.sub(r'<script src="([^"]+)"></script>', inline_script, out)
(ROOT / "dist").mkdir(exist_ok=True)
(ROOT / "dist" / "labzero-mama.html").write_text(out, encoding="utf-8")
print("Wrote dist/labzero-mama.html (%d KB)" % (len(out.encode()) // 1024))
