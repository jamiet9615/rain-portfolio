#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/new_post.py
依據 AGENTS.md 規則快速建立新文章草稿，並自動觸發 build_index.py 更新全站索引。
這完美體現了「建立一套規則，讓之後可以依照同一套方式，很快地繼續製作新內容」。
"""

import argparse
import datetime
import os
import re
import subprocess
import sys
from pathlib import Path


def sanitize_slug(slug_str):
    slug_str = slug_str.lower().strip()
    slug_str = re.sub(r"[^a-z0-9\-]", "-", slug_str)
    slug_str = re.sub(r"-+", "-", slug_str).strip("-")
    return slug_str[:40]


def main():
    parser = argparse.ArgumentParser(description="依照 AGENTS.md 規則快速新增文章或作品頁面")
    parser.add_argument(
        "--category",
        "-c",
        required=True,
        choices=["writeup", "works", "reflections", "learning", "entertainment"],
        help="文章所屬分類代號",
    )
    parser.add_argument("--title", "-t", required=True, help="文章標題（不超過40字）")
    parser.add_argument(
        "--slug",
        "-s",
        required=True,
        help="英文識別代稱（如 fju-platform，自動轉小寫連接線）",
    )
    parser.add_argument(
        "--summary",
        "-m",
        default="",
        help="一句話簡介（列表顯示，不超過60字）",
    )
    parser.add_argument(
        "--tags",
        default="",
        help="逗號分隔的標籤列表（如: 網頁開發,專案作品）",
    )
    parser.add_argument(
        "--date",
        "-d",
        default="",
        help="日期格式 YYYY-MM-DD（預設為今天）",
    )

    args = parser.parse_args()

    project_root = Path(__file__).resolve().parent.parent
    category_dir = project_root / "content" / args.category
    category_dir.mkdir(parents=True, exist_ok=True)

    today = (
        args.date if args.date else datetime.date.today().strftime("%Y-%m-%d")
    )
    clean_slug = sanitize_slug(args.slug)
    filename = f"{today}-{clean_slug}.md"
    file_path = category_dir / filename

    if file_path.exists():
        print(f"錯誤：檔案 {filename} 已存在！", file=sys.stderr)
        sys.exit(1)

    tag_list = (
        [t.strip() for t in args.tags.split(",") if t.strip()]
        if args.tags
        else ["未分類"]
    )
    tags_formatted = "[" + ", ".join(tag_list) + "]"
    summary_text = (
        args.summary if args.summary else f"{args.title} 的詳細記錄與說明。"
    )

    content_template = f"""---
title: {args.title}
date: {today}
category: {args.category}
tags: {tags_formatted}
summary: {summary_text}
cover: ""
draft: false
---

## 專案 / 內容簡介

在此處撰寫主要內容介紹...

## 重點細節與特色

- 特色一：說明...
- 特色二：說明...

## 心得與延伸

總結與未來的優化方向...
"""

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content_template)

    print(f"✅ 已成功建立文章：content/{args.category}/{filename}")

    # 自動調用 build_index.py 重新產生 posts.json
    build_script = project_root / "scripts" / "build_index.py"
    if build_script.exists():
        subprocess.run([sys.executable, str(build_script)], check=True)
        print("🎉 全站索引 data/posts.json 已同步自動更新！")


if __name__ == "__main__":
    main()
