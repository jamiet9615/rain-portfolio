---
title: 輔大連結整合網站開發紀錄
date: 2026-11-10
category: works
tags: [網頁開發, 輔大, 專案作品]
summary: 為方便同學快速查找各處室系統所開發的靜態導航站，整合常用的校園連結。
draft: false
---

## 專案發想

大學校園裡有許多分散的資訊系統，包含選課系統、數位學習平台、圖書館預約等。由於入口往往分散在不同的處室網站，剛入學時常常要花很多時間尋找對應的入口。

因此我萌生了製作一個集中式導航站的想法，希望能以簡潔、快速載入的介面，提供同學最直覺的常用連結整理。

## 核心功能與特色

- **分類清晰**：分為教務、學務、圖書資源與生活實用四大區塊。
- **即時搜尋**：支援透過關鍵字快速過濾想要找的系統名稱。
- **響應式排版**：無論在手機或桌機上開啟都能迅速點選。

```javascript
// 簡易關鍵字搜尋示範
function filterLinks(keyword) {
  const items = document.querySelectorAll('.link-item');
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(keyword.toLowerCase()) ? 'block' : 'none';
  });
}
```

## 後續回顧

這個專案讓我熟悉了原生 JavaScript 對 DOM 的操作，也體會到解決身邊真實需求帶來的成就感！
