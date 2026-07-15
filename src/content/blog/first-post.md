---
title: "Bắt đầu một cuốn sổ Crypto CTF"
description: "Vì sao một write-up tốt cần ghi lại cả giả thuyết, phép thử nhỏ và những lần đi sai hướng."
pubDate: 2026-07-15
tags: ["CTF", "write-up", "workflow"]
---

Một bài crypto CTF hiếm khi bắt đầu bằng một công thức dài. Bước đầu tiên thường là đọc đề, đọc source và tách riêng những gì đề bài **thực sự** tiết lộ khỏi những gì ta đang đoán.

## Quy trình tối thiểu

1. Chép lại chính xác public parameters, ciphertext và mọi ràng buộc đầu vào/đầu ra.
2. Viết một script thật nhỏ để kiểm tra từng giả thuyết.
3. Chỉ mở rộng sang lattice, SageMath hoặc brute force khi mô hình nhỏ đã khớp.
4. Sau khi có flag, chạy lại solver từ dữ liệu gốc trước khi viết bài.

Mục tiêu của blog này là giữ lại phần suy luận đó. Một lời giải có thể tái lập sẽ hữu ích hơn nhiều so với một đoạn code chỉ chạy đúng một lần.

```text
[+] source read
[+] assumptions checked
[+] local solve reproduced
```
