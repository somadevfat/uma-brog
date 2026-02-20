#!/usr/bin/env python3
"""
スキルの簡易検証スクリプト - 最小構成バージョン
"""

import sys
import os
import re
import yaml
from pathlib import Path

def validate_skill(skill_path):
    """スキルの基本バリデーション"""
    skill_path = Path(skill_path)

    # SKILL.md が存在するか確認
    skill_md = skill_path / 'SKILL.md'
    if not skill_md.exists():
        return False, "SKILL.md が見つかりません"

    # フロントマターを読み取って検証
    content = skill_md.read_text()
    if not content.startswith('---'):
        return False, "YAMLフロントマターが見つかりません"

    # フロントマターを抽出
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return False, "フロントマターの形式が無効です"

    frontmatter_text = match.group(1)

    # YAMLフロントマターをパース
    try:
        frontmatter = yaml.safe_load(frontmatter_text)
        if not isinstance(frontmatter, dict):
            return False, "フロントマターはYAMLディクショナリである必要があります"
    except yaml.YAMLError as e:
        return False, f"フロントマターのYAMLが無効です: {e}"

    # 許可されるプロパティを定義
    ALLOWED_PROPERTIES = {'name', 'description', 'license', 'allowed-tools', 'metadata', 'compatibility'}

    # 予期しないプロパティをチェック（metadata下のネストされたキーは除く）
    unexpected_keys = set(frontmatter.keys()) - ALLOWED_PROPERTIES
    if unexpected_keys:
        return False, (
            f"SKILL.md のフロントマターに予期しないキーがあります: {', '.join(sorted(unexpected_keys))}。 "
            f"許可されているプロパティは次の通りです: {', '.join(sorted(ALLOWED_PROPERTIES))}"
        )

    # 必須フィールドをチェック
    if 'name' not in frontmatter:
        return False, "フロントマターに 'name' がありません"
    if 'description' not in frontmatter:
        return False, "フロントマターに 'description' がありません"

    # 検証のために名前を抽出
    name = frontmatter.get('name', '')
    if not isinstance(name, str):
        return False, f"名前は文字列である必要があります。取得された型: {type(name).__name__}"
    name = name.strip()
    if name:
        # 命名規則をチェック (ケバブケース: 小文字、数字、ハイフン)
        if not re.match(r'^[a-z0-9-]+$', name):
            return False, f"名前 '{name}' はケバブケース（小文字、数字、ハイフンのみ）である必要があります"
        if name.startswith('-') or name.endswith('-') or '--' in name:
            return False, f"名前 '{name}' はハイフンで開始・終了したり、連続したハイフンを含んだりすることはできません"
        # 名前の長さをチェック (最大64文字)
        if len(name) > 64:
            return False, f"名前が長すぎます（{len(name)} 文字）。最大は 64 文字です。"

    # 説明を抽出して検証
    description = frontmatter.get('description', '')
    if not isinstance(description, str):
        return False, f"説明は文字列である必要があります。取得された型: {type(description).__name__}"
    description = description.strip()
    if description:
        # 不等号をチェック
        if '<' in description or '>' in description:
            return False, "説明に不等号（< または >）を含めることはできません"
        # 説明の長さをチェック (最大1024文字)
        if len(description) > 1024:
            return False, f"説明が長すぎます（{len(description)} 文字）。最大は 1024 文字です。"

    # 互換性フィールドが存在する場合は検証 (オプション)
    compatibility = frontmatter.get('compatibility', '')
    if compatibility:
        if not isinstance(compatibility, str):
            return False, f"互換性フィールドは文字列である必要があります。取得された型: {type(compatibility).__name__}"
        if len(compatibility) > 500:
            return False, f"互換性フィールドが長すぎます（{len(compatibility)} 文字）。最大は 500 文字です。"

    return True, "スキルは有効です！"

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("使用法: python quick_validate.py <skill_directory>")
        sys.exit(1)
    
    valid, message = validate_skill(sys.argv[1])
    print(message)
    sys.exit(0 if valid else 1)