# Screenshots each composition with headless Chrome at 2x, then encodes WebP into public/projects.
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DEST = sys.argv[1]
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
SIZES = {'1': (600, 280), '2': (600, 400), '3': (700, 550)}
os.makedirs(DEST, exist_ok=True)
only = sys.argv[2:]

for f in sorted(os.listdir(HERE)):
    if not f.endswith('.html'):
        continue
    name = f[:-5]
    if only and name not in only:
        continue
    w, h = SIZES[name[-1]]
    png = os.path.join(HERE, name + '.png')
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2',
                    '--window-size=%d,%d' % (w, h), '--virtual-time-budget=5000', '--screenshot=' + png,
                    'file:///' + os.path.join(HERE, f).replace('\\', '/')], check=True, capture_output=True)
    out = os.path.join(DEST, name + '.webp')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', png, '-c:v', 'libwebp', '-quality', '86', out], check=True)
    print(name, os.path.getsize(out) // 1024, 'KB')
