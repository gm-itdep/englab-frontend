from PIL import Image
import numpy as np


def find_bottom_grid_y(img: Image.Image, x: int, y_start: int = 0, y_end: int | None = None) -> int:
    arr = np.array(img.convert("RGB"))
    h = arr.shape[0]
    if y_end is None:
        y_end = h

    x0 = max(0, x - 3)
    x1 = min(arr.shape[1], x + 4)

    strip = arr[y_start:y_end, x0:x1, :].mean(axis=(1, 2)).astype(np.float64)
    k = 5
    kernel = np.ones(k) / k
    sm = np.convolve(strip, kernel, mode="same")

    start = int(len(sm) * 0.4)
    lower = sm[start:]
    idxs = np.argsort(lower)[:20]
    ys = (idxs + start) + y_start
    return int(max(ys))


def estimate_bottom(img_path: str) -> list[int]:
    img = Image.open(img_path)
    xs = [180, 220, 260, 300, 340, 380, 420]
    return [find_bottom_grid_y(img, x=x, y_start=0, y_end=img.size[1]) for x in xs]


fig_path = "figma-admin-chart-58-11721.png"
our_path = r".\assets\c__Users_Sabina_Agam_AppData_Roaming_Cursor_User_workspaceStorage_2c809646b98f968c5a4117b5df86b726_images_image-143a7056-6282-4429-addd-732abed8f8c9.png"

fig_cands = estimate_bottom(fig_path)
our_cands = estimate_bottom(our_path)

fig_med = int(np.median(fig_cands))
our_med = int(np.median(our_cands))
delta = our_med - fig_med

print("fig candidates:", fig_cands)
print("our candidates:", our_cands)
print("fig median:", fig_med)
print("our median:", our_med)
print("delta (our - figma) px:", delta)

