# Crypto CTF Notes

Một blog cá nhân tĩnh bằng Astro dành cho các ghi chép tiếng Việt về cryptography trong CTF. Giao diện dùng font terminal của template gốc, với bảng màu xanh dương, xanh da trời và đen.

## Chạy ở máy cá nhân

Yêu cầu: Node.js 22 trở lên.

```bash
npm install
npm run dev
```

Sau đó mở địa chỉ Astro in ra trong terminal. Kiểm tra bản production bằng:

```bash
npm run build
npm run preview
```

## Cá nhân hóa blog

Sửa [src/consts.ts](src/consts.ts) trước:

- `AUTHOR_NAME`: tên hiển thị ở footer.
- `GITHUB_USERNAME`: username GitHub dùng cho các liên kết.
- `SITE_TITLE`, `SITE_DESCRIPTION`, `QUOTE`: tên và mô tả của blog.
- `TOPICS`: các thẻ chủ đề ở trang chủ.

Mỗi bài viết là một file `.md` hoặc `.mdx` trong `src/content/blog/`. Ví dụ:

```md
---
title: "Tên bài viết"
description: "Tóm tắt ngắn để hiện trên card và metadata."
pubDate: 2026-07-15
tags: ["RSA", "Coppersmith"]
draft: false
---

Nội dung bài viết ở đây.
```

`draft: true` sẽ ẩn bài khỏi trang chủ, trang blog, RSS và file build. Khi muốn chèn component Astro vào bài viết, hãy dùng `.mdx`.

## Deploy lên GitHub Pages

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) build Astro và deploy thư mục `dist/` bằng GitHub Actions. Không cần tạo nhánh `gh-pages`.

1. Đẩy repository lên tài khoản GitHub của bạn.
2. Vào **Settings → Pages** của repository.
3. Ở **Build and deployment → Source**, chọn **GitHub Actions**.
4. Push lên nhánh `main` hoặc chạy thủ công workflow **Deploy blog to GitHub Pages** trong tab **Actions**.

Nếu repository là `https://github.com/<username>/<repository>`, trang sẽ ở:

```text
https://<username>.github.io/<repository>/
```

Nếu bạn đặt tên repository là `<username>.github.io`, blog sẽ ở ngay domain gốc:

```text
https://<username>.github.io/
```

`astro.config.mjs` tự nhận `GITHUB_REPOSITORY` trong Actions để đặt đúng `site` và `base`, nên link, RSS, sitemap và tài nguyên tĩnh vẫn hoạt động ở cả hai kiểu URL trên.

### Custom domain (tùy chọn)

Trong **Settings → Secrets and variables → Actions → Variables**, thêm:

```text
SITE_URL=https://blog.example.com
BASE_PATH=/
```

Sau đó cấu hình domain đó trong **Settings → Pages**. Nếu dùng `CNAME`, tạo thêm `public/CNAME` chứa đúng domain của bạn trước khi deploy.

## Cấu trúc chính

```text
src/content/blog/       Bài viết Markdown và MDX
src/components/         Hero, navbar, card bài viết, metadata
src/pages/              Trang chủ, blog, RSS và robots.txt
src/styles/global.css   Font và bảng màu xanh–đen
.github/workflows/      Build và deploy GitHub Pages
```
