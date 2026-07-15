---
title: "Một khung đọc đề RSA trong CTF"
description: "Đừng vội factor n: hãy xác định quan hệ bất thường giữa p, q, d, e, plaintext và ciphertext trước."
pubDate: 2026-07-12
tags: ["RSA", "số học", "checklist"]
---

RSA trong CTF thường không hỏng vì phép mã hóa cơ bản. Nó hỏng vì một tham số được chọn sai, bị rò rỉ một phần, hoặc được dùng trong một quan hệ mà tác giả challenge không kiểm soát hết.

## Checklist trước khi tấn công

- Có phải `p` và `q` quá gần nhau không?
- `d` có nhỏ bất thường so với `n` không?
- Có nhiều ciphertext cùng modulus hoặc cùng plaintext không?
- Có padding tự chế, message ngắn, exponent nhỏ, hay một bit leak nào không?
- Source có biến nào được sinh lại nhưng lại dùng cùng seed không?

Sau mỗi câu hỏi, hãy tạo một phép kiểm tra rẻ: so sánh độ dài bit, tính `gcd`, thử lấy căn nguyên, hoặc dựng dữ liệu toy. Những phép kiểm tra này thường quyết định nên dùng continued fractions, Coppersmith, CRT hay chỉ cần sửa một lỗi logic.

```python
from math import gcd

assert gcd(ciphertext, modulus) == 1
print(modulus.bit_length())
```

Đoạn mã trên không giải RSA. Nó chỉ minh họa tinh thần: đo đạc trước, tấn công sau.
