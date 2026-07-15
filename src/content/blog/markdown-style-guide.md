---
title: "Mẫu write-up có thể tái lập"
description: "Một cấu trúc ngắn để người đọc hiểu vì sao exploit đúng và tự chạy lại solver của bạn."
pubDate: 2026-07-03
tags: ["write-up", "solver", "CTF"]
---

Một write-up crypto tốt không cần kể mọi lần thử. Nhưng nó nên đủ thông tin để người khác dựng lại đường đi chính mà không phải đoán ý tác giả.

## Cấu trúc gợi ý

| Phần | Câu hỏi cần trả lời |
| --- | --- |
| Quan sát | Điểm bất thường nào trong đề/source dẫn tới hướng giải? |
| Mô hình | Viết lại quan hệ toán học nào? Các giả định là gì? |
| Khai thác | Vì sao thuật toán hoặc primitive này áp dụng được? |
| Kiểm chứng | Solver chạy lại trên dữ liệu local như thế nào? |
| Bài học | Dấu hiệu nào giúp nhận ra dạng bài tương tự lần sau? |

## Lưu ý khi đăng code

```python
# Luôn giữ input, output mong đợi và cách chạy cạnh solver.
assert recover_secret(instance) == expected_secret
```

Nếu challenge có server từ xa, hãy phân biệt rõ phần **đã chứng minh local** và phần **đã xác nhận khi tương tác remote**. Điều đó khiến write-up đáng tin hơn và cũng dễ debug hơn khi server thay đổi.
