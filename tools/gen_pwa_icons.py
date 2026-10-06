"""Gera ícones PWA (192x192 e 512x512) usando o mesmo gerador do executável."""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from build_exe import ROOT, draw_icon, downscale, png

def main():
    assets_dir = os.path.join(ROOT, "assets")
    os.makedirs(assets_dir, exist_ok=True)

    base = draw_icon(768)

    # 512x512
    # Para 512, reamostramos ou desenhamos em 512
    img512 = draw_icon(512)
    with open(os.path.join(assets_dir, "icon-512.png"), "wb") as f:
        f.write(png(img512))
    print("Gerado assets/icon-512.png")

    # 192x192
    img192 = draw_icon(192)
    with open(os.path.join(assets_dir, "icon-192.png"), "wb") as f:
        f.write(png(img192))
    print("Gerado assets/icon-192.png")

if __name__ == "__main__":
    main()
