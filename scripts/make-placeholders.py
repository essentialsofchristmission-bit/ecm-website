# Generates labelled placeholder images in public/images. Replace them with real photos using the same file names.
import os, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
os.makedirs(OUT, exist_ok=True)
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

PALETTES = [((11, 92, 46), (22, 22, 107)), ((22, 22, 107), (11, 92, 46)), ((179, 0, 0), (22, 22, 107)), ((11, 92, 46), (8, 50, 28)), ((40, 40, 140), (179, 0, 0))]

def font(path, size):
    return ImageFont.truetype(path, size)

def placeholder(name, w, h, label, pal=0):
    random.seed(name)
    a, b = PALETTES[pal % len(PALETTES)]
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        for x in range(0, w):
            t = (x / w * 0.6 + y / h * 0.4)
            px[x, y] = tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    for _ in range(14):
        r = random.randint(min(w, h) // 10, min(w, h) // 3)
        cx, cy = random.randint(0, w), random.randint(0, h)
        g.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255, random.randint(10, 35)))
    glow = glow.filter(ImageFilter.GaussianBlur(min(w, h) // 25))
    img = Image.alpha_composite(img.convert("RGBA"), glow)
    s = min(w, h)
    cx, cy = w // 2, int(h * 0.42)
    arm = s // 9
    shapes = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shapes)
    sd.rectangle([cx - arm // 6, cy - arm, cx + arm // 6, cy + arm * 1.3], fill=(255, 255, 255, 60))
    sd.rectangle([cx - arm * 0.7, cy - arm * 0.45, cx + arm * 0.7, cy - arm * 0.12], fill=(255, 255, 255, 60))
    img = Image.alpha_composite(img, shapes)
    d = ImageDraw.Draw(img)
    f1 = font(BOLD, max(16, s // 16))
    f2 = font(REG, max(12, s // 30))
    tw = d.textlength(label, font=f1)
    d.text(((w - tw) / 2, cy + arm * 1.6), label, font=f1, fill=(255, 255, 255, 235))
    sub = "Replace: public/images/" + name
    tw2 = d.textlength(sub, font=f2)
    d.text(((w - tw2) / 2, cy + arm * 1.6 + s // 12), sub, font=f2, fill=(255, 255, 255, 170))
    img.convert("RGB").save(os.path.join(OUT, name), quality=82)

def logo():
    S = 512
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([4, 4, S - 4, S - 4], fill=(255, 255, 255, 255), outline=(11, 92, 46, 255), width=22)
    d.ellipse([60, 60, S - 60, S - 60], outline=(247, 0, 0, 255), width=10)
    f = font(BOLD, 150)
    tw = d.textlength("ECM", font=f)
    d.text(((S - tw) / 2, 160), "ECM", font=f, fill=(22, 22, 107, 255))
    f2 = font(BOLD, 34)
    t2 = "LOGO"
    d.text(((S - d.textlength(t2, font=f2)) / 2, 340), t2, font=f2, fill=(11, 92, 46, 255))
    img.save(os.path.join(OUT, "logo.png"))

if __name__ == "__main__":
    logo()
    placeholder("hero-worship.jpg", 1920, 1080, "Worship photo", 0)
    placeholder("og-image.jpg", 1200, 630, "Essentials of Christ Mission", 0)
    placeholder("pastor-samuel-tandoh.jpg", 800, 1000, "Pastor Dr. Samuel E. Tandoh", 1)
    placeholder("leader-2.jpg", 800, 1000, "Leader photo", 3)
    placeholder("leader-3.jpg", 800, 1000, "Leader photo", 4)
    placeholder("about-church.jpg", 1600, 1000, "Church family photo", 1)
    placeholder("live-banner.jpg", 1600, 900, "Livestream photo", 2)
    placeholder("give-banner.jpg", 1600, 900, "Giving photo", 3)
    placeholder("contact-banner.jpg", 1600, 900, "Church building photo", 1)
    for i, m in enumerate(["go-ye", "children", "youth", "choir", "media"]):
        placeholder(f"ministry-{m}.jpg", 1200, 800, f"{m.replace('-', ' ').title()} Ministry", i)
    for i in range(1, 4):
        placeholder(f"outreach-go-ye-train-{i}.jpg", 1200, 800, f"Go Ye Train photo {i}", i + 1)
    for i in range(1, 10):
        placeholder(f"gallery-{i:02d}.jpg", 1200, 900, f"Gallery photo {i}", i)
    for e in ["thanksgiving-service", "youth-conference", "go-ye-train-2026", "christmas-carols"]:
        placeholder(f"event-{e}.jpg", 1080, 1350, "Event flyer", hash(e) % 5)
