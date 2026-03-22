# Stickman Fighting Game

Game đối kháng stickman 1v1 viết bằng HTML/CSS/JavaScript thuần.

## Demo nhanh

- Mở file `index.html` trực tiếp trên trình duyệt để chơi local.
- Hoặc deploy lên GitHub Pages để chia sẻ link cho mọi người.

## Tính năng

- Chế độ 1 người chơi (AI) và 2 người chơi.
- Tùy chỉnh âm thanh, ngôn ngữ, thời gian trận đấu và máu khởi đầu.
- Hiển thị HP, thời gian, kết quả K.O. và điểm số (chế độ 2P).

## Cấu trúc thư mục

```text
stickman-fighting/
├── index.html
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── settings.css
│   ├── about.css
│   └── buttons.css
└── js/
    ├── constants.js
    ├── state.js
    ├── audio.js
    ├── player.js
    ├── ai.js
    ├── combat.js
    ├── renderer.js
    ├── ui.js
    └── main.js
```

## Điều khiển

### Người chơi 1

- `A / D`: Di chuyển trái, phải
- `W`: Nhảy
- `U`: Đỡ đòn
- `I`: Đấm
- `O`: Đá

### Người chơi 2

- `Arrow Left / Arrow Right`: Di chuyển
- `Arrow Up`: Nhảy
- `Numpad4`: Đỡ đòn
- `Numpad5`: Đấm
- `Numpad6`: Đá

## Chạy local

Không cần cài dependency.

1. Mở thư mục project trong VS Code.
2. Mở file `index.html` bằng browser (hoặc dùng Live Server).

## Deploy GitHub Pages

Sau khi đã push code lên GitHub:

1. Vào repository trên GitHub.
2. Mở `Settings` -> `Pages`.
3. Tại `Build and deployment`, chọn:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/(root)`
4. Nhấn `Save`.
5. Đợi 1-2 phút, GitHub sẽ cung cấp link công khai.
