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
- `U + I`: cầu năng lượng (hồi chiêu 3 giây)
- `L`: tốc biến (hồi chiêu 1.5 giây)

### Người chơi 2

- `Arrow Left / Arrow Right`: Di chuyển
- `Arrow Up`: Nhảy
- `Numpad4`: Đỡ đòn
- `Numpad5`: Đấm
- `Numpad6`: Đá
- `Numpad4 + Numpad5`: cầu năng lượng (hồi chiêu 3 giây)
- `Numpad3`: tốc biến (hồi chiêu 1.5 giây)

## Sát thương đòn đánh

- Đấm gây `7` sát thương
- Kick gây `10` sát thương và gây hiệu ứng khựng
- Cầu năng lượng gây `14` sát thương
- Knockdown khi dính đủ `5` hit liên tiếp và không bị block.

## Chạy local

Không cần cài dependency.

1. Mở thư mục project trong VS Code.
2. Mở file `index.html` bằng browser (hoặc dùng Live Server).

## Deploy

Dùng netlify.app
