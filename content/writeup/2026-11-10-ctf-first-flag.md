---
title: CTF 基礎隱寫術解題 Writeup
date: 2026-11-10
category: writeup
tags: [CTF, 隱寫術, 資安學習]
summary: 記錄在練習題目中遇到的 PNG 圖片隱寫分析，以及使用工具還原 flag 的完整過程。
draft: false
---

## 題目分析

本題提供了一張看似正常的 PNG 圖檔，題目說明提示「隱藏的訊息往往就在細微的位元變化之中」。

首先確認檔案的真實格式與標頭：

```bash
file image0.png
binwalk image0.png
```

## 解題步驟

1. **檢查 EXIF 資訊**：使用 `exiftool` 檢視，發現作者註解欄位中有一段 Base64 編碼字串。
2. **LSB 隱寫分析**：使用 `zsteg` 檢驗不同通道的最低有效位元（LSB），發現通道 `b1,bgr,lsb,xy` 藏有額外資料。
3. **提取 Flag**：

```python
# 示範使用 Python 驗證特徵值
with open("flag.txt", "r") as f:
    content = f.read().strip()
    print(f"解密完成：{content}")
```

順利取得 Flag，完成本題練習！
