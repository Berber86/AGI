import sys
from PIL import Image, ImageChops

def diff(pa, pb, thr=32):
    a = Image.open(pa).convert("RGB")
    b = Image.open(pb).convert("RGB")
    if a.size != b.size:
        b = b.resize(a.size)
    d = ImageChops.difference(a, b)
    px = d.getdata()
    n = len(px)
    hot = sum(1 for p in px if max(p) > thr)
    mean = sum(sum(p) for p in px) / (n * 3)
    return 100.0 * hot / n, mean

if __name__ == "__main__":
    pairs = [
        ("noise-normal", "/tmp/reef-noise/a.png", "/tmp/reef-noise/b.png"),
        ("s2-vs-s3-normal", "/tmp/reef-after/normal.png", "/tmp/reef-s3/normal.png"),
        ("s2-vs-s3-left", "/tmp/reef-after/normal-left.png", "/tmp/reef-s3/normal-left.png"),
        ("s2-vs-s3-right", "/tmp/reef-after/normal-right.png", "/tmp/reef-s3/normal-right.png"),
        ("s2-vs-s3-vr", "/tmp/reef-after/vr.png", "/tmp/reef-s3/vr.png"),
    ]
    for name, a, b in pairs:
        try:
            hot, mean = diff(a, b)
            print(f"{name}: hot={hot:.2f}% meanAbs={mean:.2f}")
        except Exception as e:
            print(f"{name}: ERR {e}")
