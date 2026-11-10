#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/build_index.py
掃描 content/ 目錄下的所有 Markdown 文章，提取 Front matter 並產生 data/posts.json。
使用純 Python 標準函式庫，無外部相依。
"""

import json
import os
import re
import sys
from pathlib import Path


def parse_front_matter(content):
    """
    自製輕量 front matter 解析器（支援字串、陣列、布林值、多層字典如 music）
    不需要額外安裝 PyYAML 套件。
    """
    match = re.match(r"^---\s*\r?\n(.*?)\r?\n---\s*\r?\n(.*)$", content, re.DOTALL)
    if not match:
        return {}, content

    yaml_block = match.group(1)
    body = match.group(2)
    meta = {}

    current_dict_key = None

    for line in yaml_block.splitlines():
        line_clean = line.rstrip()
        if not line_clean or line_clean.strip().startswith("#"):
            continue

        # 檢查是否為巢狀縮排 (例如 music:)
        indent_match = re.match(r"^\s{2,}([a-zA-Z0-9_-]+)\s*:\s*(.*)$", line_clean)
        if indent_match and current_dict_key:
            subkey = indent_match.group(1).strip()
            subval = indent_match.group(2).strip()
            # 移除引號
            if (subval.startswith('"') and subval.endswith('"')) or (
                subval.startswith("'") and subval.endswith("'")
            ):
                subval = subval[1:-1]
            meta[current_dict_key][subkey] = subval
            continue

        # 頂層 key: value
        top_match = re.match(r"^([a-zA-Z0-9_-]+)\s*:\s*(.*)$", line_clean)
        if top_match:
            key = top_match.group(1).strip()
            raw_val = top_match.group(2).strip()

            if not raw_val:
                # 可能是子物件開始，如 music:
                current_dict_key = key
                meta[key] = {}
                continue
            else:
                current_dict_key = None

            # 判斷型別
            if raw_val.startswith("[") and raw_val.endswith("]"):
                # 列表 [tag1, tag2]
                items_str = raw_val[1:-1].strip()
                if items_str:
                    items = [
                        item.strip().strip("'\"")
                        for item in items_str.split(",")
                        if item.strip()
                    ]
                else:
                    items = []
                meta[key] = items
            elif raw_val.lower() == "true":
                meta[key] = True
            elif raw_val.lower() == "false":
                meta[key] = False
            else:
                # 去除外層引號
                if (raw_val.startswith('"') and raw_val.endswith('"')) or (
                    raw_val.startswith("'") and raw_val.endswith("'")
                ):
                    raw_val = raw_val[1:-1]
                meta[key] = raw_val

    return meta, body


def main():
    root_dir = Path(__file__).resolve().parent.parent
    content_dir = root_dir / "content"
    data_dir = root_dir / "data"
    categories_file = data_dir / "categories.json"
    output_file = data_dir / "posts.json"

    if not categories_file.exists():
        print(f"錯誤：找不到分類檔案 {categories_file}", file=sys.stderr)
        sys.exit(1)

    with open(categories_file, "r", encoding="utf-8") as f:
        categories = json.load(f)
    valid_category_ids = {c["id"] for c in categories}

    posts = []

    for root, _, files in os.walk(content_dir):
        for file in files:
            if not file.endswith(".md") or file == "about.md":
                continue

            file_path = Path(root) / file
            rel_path = file_path.relative_to(content_dir)
            category_from_folder = rel_path.parts[0]

            if category_from_folder not in valid_category_ids:
                print(
                    f"警告：資料夾 '{category_from_folder}' 不在 categories.json 中，跳過 {file_path}",
                    file=sys.stderr,
                )
                continue

            slug = file_path.stem
            # 檔名格式通常為 YYYY-MM-DD-<slug>
            with open(file_path, "r", encoding="utf-8") as f:
                raw_text = f.read()

            meta, _ = parse_front_matter(raw_text)

            # 略過草稿
            if meta.get("draft") is True:
                continue

            post_category = meta.get("category", category_from_folder)
            if post_category != category_from_folder:
                print(
                    f"警告：{file} 的 category ({post_category}) 與所在目錄 ({category_from_folder}) 不符！",
                    file=sys.stderr,
                )

            post_entry = {
                "id": f"{category_from_folder}/{slug}",
                "slug": slug,
                "title": meta.get("title", slug),
                "date": str(meta.get("date", "")),
                "category": category_from_folder,
                "tags": meta.get("tags", []),
                "summary": meta.get("summary", ""),
                "cover": meta.get("cover", ""),
                "path": f"content/{category_from_folder}/{file}",
            }

            if "music" in meta and isinstance(meta["music"], dict):
                post_entry["music"] = meta["music"]

            posts.append(post_entry)

    # 依日期由新到舊排序
    posts.sort(key=lambda p: p["date"], reverse=True)

    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    print(f"成功產生 {output_file}，共計 {len(posts)} 篇文章索引。")


if __name__ == "__main__":
    main()
