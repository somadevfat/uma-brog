#!/usr/bin/env python3
"""
スキル初期化ツール - テンプレートから新しいスキルを作成します

使用法:
    init_skill.py <skill-name> --path <path>

例:
    init_skill.py my-new-skill --path skills/public
    init_skill.py my-api-helper --path skills/private
    init_skill.py custom-skill --path /custom/location
"""

import sys
from pathlib import Path


SKILL_TEMPLATE = """---
name: {skill_name}
description: [TODO: スキルが何をするか、およびいつ使用すべきかについての、完全で情報豊富な説明。このスキルを使用するタイミング（特定のシナリオ、ファイルタイプ、またはトリガーとなるタスク）を含めてください。]
---

# {skill_title}

## 概要

[TODO: このスキルが何を可能にするかを説明する1〜2文]

## このスキルの構造化

[TODO: このスキルの目的に最も適した構造を選択してください。一般的なパターン：

**1. ワークフローベース**（順次プロセスに最適）
- 明確なステップバイステップの手順がある場合に適しています
- 例：DOCXスキル。「ワークフロー決定ツリー」→「読み取り」→「作成」→「編集」
- 構造：## 概要 → ## ワークフロー決定ツリー → ## ステップ 1 → ## ステップ 2...

**2. タスクベース**（ツールのコレクションに最適）
- スキルが異なる操作や機能を提供する場合に適しています
- 例：PDFスキル。「クイックスタート」→「PDFの結合」→「PDFの分割」→「テキスト抽出」
- 構造：## 概要 → ## クイックスタート → ## タスクカテゴリ 1 → ## タスクカテゴリ 2...

**3. リファレンス/ガイドライン**（標準や仕様に最適）
- ブランドガイドライン、コーディング標準、または要件に適しています
- 例：ブランドスタイリング。「ブランドガイドライン」→「色」→「タイポグラフィ」→「機能」
- 構造：## 概要 → ## ガイドライン → ## 仕様 → ## 使用法...

**4. 機能ベース**（統合システムに最適）
- スキルが相互に関連する複数の機能を提供する場合に適しています
- 例：プロダクトマネジメント。「コア機能」→ 番号付きの機能リスト
- 構造：## 概要 → ## コア機能 → ### 1. 機能 → ### 2. 機能...

パターンは必要に応じて組み合わせることができます。ほとんどのスキルはパターンを組み合わせています（例：タスクベースで開始し、複雑な操作のためにワークフローを追加する）。

完了したら、この「このスキルの構造化」セクション全体を削除してください。これはガイダンスにすぎません。]

## [TODO: 選択した構造に基づいて、最初の主要セクションに置き換えてください]

[TODO: ここにコンテンツを追加してください。既存のスキルの例を参照してください：
- 技術スキルのためのコードサンプル
- 複雑なワークフローのための決定ツリー
- 現実的なユーザーリクエストを伴う具体的な例
- 必要に応じてスクリプト/テンプレート/リファレンスへの参照]

## リソース

このスキルには、整理された各種類のリソースをどのように構成するかを示す、例となるリソースディレクトリが含まれています：

### scripts/
特定の操作を実行するために直接実行できる実行可能コード（Python/Bashなど）。

**他のスキルの例：**
- PDFスキル：`fill_fillable_fields.py`, `extract_form_field_info.py` - PDF操作用のユーティリティ
- DOCXスキル：`document.py`, `utilities.py` - ドキュメント処理用のPythonモジュール

**適しているもの：** 自動化、データ処理、または特定の操作を実行するPythonスクリプト、シェルスクリプト、または任意の実行可能コード。

**注意：** スクリプトはコンテキストに読み込まずに実行できますが、パッチ適用や環境調整のためにClaudeによって読み取られることもあります。

### references/
Claudeのプロセスと思考を支援するために、コンテキストに読み込まれることを想定したドキュメントや参照資料。

**他のスキルの例：**
- プロダクトマネジメント：`communication.md`, `context_building.md` - 詳細なワークフローガイド
- BigQuery：APIリファレンスドキュメントとクエリ例
- 金融：スキーマドキュメント、会社ポリシー

**適しているもの：** 詳細なドキュメント、APIリファレンス、データベーススキーマ、包括的なガイド、またはClaudeが作業中に参照すべき詳細な情報。

### assets/
コンテキストに読み込まれることは想定されておらず、むしろClaudeが生成する出力内で使用されるファイル。

**他のスキルの例：**
- ブランドスタイリング：PowerPointテンプレートファイル (.pptx), ロゴファイル
- フロントエンドビルダー：HTML/Reactボイラープレートプロジェクトディレクトリ
- タイポグラフィ：フォントファイル (.ttf, .woff2)

**適しているもの：** テンプレート、ボイラープレートコード、ドキュメントテンプレート、画像、アイコン、フォント、または最終的な出力でコピーまたは使用されることが想定されているファイル。

---

**不要なディレクトリは削除できます。** すべてのスキルが3つのタイプのリソースすべてを必要とするわけではありません。
"""

EXAMPLE_SCRIPT = '''#!/usr/bin/env python3
"""
{skill_name} 用のヘルパースクリプト例

これは直接実行できるプレースホルダースクリプトです。
実際の実装に置き換えるか、不要な場合は削除してください。

他のスキルの実際のスクリプト例：
- pdf/scripts/fill_fillable_fields.py - PDFフォームフィールドに入力します
- pdf/scripts/convert_pdf_to_images.py - PDFページを画像に変換します
"""

def main():
    print("{skill_name} 用のサンプルスクリプトです")
    # TODO: ここに実際のスクリプトロジックを追加してください
    # これはデータ処理、ファイル変換、APIコールなどです

if __name__ == "__main__":
    main()
'''

EXAMPLE_REFERENCE = """# {skill_title} 用のリファレンスドキュメント

これは詳細なリファレンスドキュメントのプレースホルダーです。
実際のリファレンスコンテンツに置き換えるか、不要な場合は削除してください。

他のスキルの実際のリファレンスドキュメントの例：
- product-management/references/communication.md - ステータス更新に関する包括的なガイド
- product-management/references/context_building.md - コンテキスト収集に関する深掘り
- bigquery/references/ - APIリファレンスとクエリ例

## リファレンスドキュメントが役立つ場合

リファレンスドキュメントは以下に最適です：
- 包括的なAPIドキュメント
- 詳細なワークフローガイド
- 複雑なマルチステップの手順
- メインの SKILL.md に入れるには長すぎる情報
- 特定のユースケースでのみ必要となるコンテンツ

## 構造の提案

### APIリファレンスの例
- 概要
- 認証
- エンドポイントと例
- エラーコード
- レート制限

### ワークフローガイドの例
- 前提条件
- ステップバイステップの手順
- 一般的なパターン
- トラブルシューティング
- ベストプラクティス
"""

EXAMPLE_ASSET = """# アセットファイルの例

このプレースホルダーは、アセットファイルが保存される場所を表します。
実際のセットファイル（テンプレート、画像、フォントなど）に置き換えるか、不要な場合は削除してください。

アセットファイルはコンテキストに読み込まれることを想定しておらず、むしろClaudeが生成する
出力内で使用されることを想定しています。

他のスキルの実際のアセットファイルの例：
- ブランドガイドライン：logo.png, slides_template.pptx
- フロントエンドビルダー：HTML/Reactボイラープレートを含む hello-world/ ディレクトリ
- タイポグラフィ：custom-font.ttf, font-family.woff2
- データ：sample_data.csv, test_dataset.json

## 一般的なアセットタイプ

- テンプレート：.pptx, .docx, ボイラープレートディレクトリ
- 画像：.png, .jpg, .svg, .gif
- フォント：.ttf, .otf, .woff, .woff2
- ボイラープレートコード：プロジェクトディレクトリ、スターターファイル
- アイコン：.ico, .svg
- データファイル：.csv, .json, .xml, .yaml

注意：これはテキストのプレースホルダーです。実際のアセットは任意のファイル形式が可能です。
"""


def title_case_skill_name(skill_name):
    """ハイフン区切りのスキル名を表示用にタイトルケースに変換します。"""
    return ' '.join(word.capitalize() for word in skill_name.split('-'))


def init_skill(skill_name, path):
    """
    テンプレートの SKILL.md を使用して新しいスキルディレクトリを初期化します。

    引数:
        skill_name: スキルの名前
        path: スキルディレクトリを作成するパス

    戻り値:
        作成されたスキルディレクトリへのパス。エラーの場合は None。
    """
    # スキルディレクトリのパスを決定
    skill_dir = Path(path).resolve() / skill_name

    # ディレクトリがすでに存在するか確認
    if skill_dir.exists():
        print(f"❌ エラー: スキルディレクトリがすでに存在します: {skill_dir}")
        return None

    # スキルディレクトリを作成
    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
        print(f"✅ スキルディレクトリを作成しました: {skill_dir}")
    except Exception as e:
        print(f"❌ ディレクトリ作成エラー: {e}")
        return None

    # テンプレートから SKILL.md を作成
    skill_title = title_case_skill_name(skill_name)
    skill_content = SKILL_TEMPLATE.format(
        skill_name=skill_name,
        skill_title=skill_title
    )

    skill_md_path = skill_dir / 'SKILL.md'
    try:
        skill_md_path.write_text(skill_content)
        print("✅ SKILL.md を作成しました")
    except Exception as e:
        print(f"❌ SKILL.md 作成エラー: {e}")
        return None

    # サンプルファイルを含むリソースディレクトリを作成
    try:
        # サンプルスクリプトを含む scripts/ ディレクトリを作成
        scripts_dir = skill_dir / 'scripts'
        scripts_dir.mkdir(exist_ok=True)
        example_script = scripts_dir / 'example.py'
        example_script.write_text(EXAMPLE_SCRIPT.format(skill_name=skill_name))
        example_script.chmod(0o755)
        print("✅ scripts/example.py を作成しました")

        # サンプルリファレンスドキュメントを含む references/ ディレクトリを作成
        references_dir = skill_dir / 'references'
        references_dir.mkdir(exist_ok=True)
        example_reference = references_dir / 'api_reference.md'
        example_reference.write_text(EXAMPLE_REFERENCE.format(skill_title=skill_title))
        print("✅ references/api_reference.md を作成しました")

        # サンプルアセットプレースホルダーを含む assets/ ディレクトリを作成
        assets_dir = skill_dir / 'assets'
        assets_dir.mkdir(exist_ok=True)
        example_asset = assets_dir / 'example_asset.txt'
        example_asset.write_text(EXAMPLE_ASSET)
        print("✅ assets/example_asset.txt を作成しました")
    except Exception as e:
        print(f"❌ リソースディレクトリ作成エラー: {e}")
        return None

    # 次のステップを表示
    print(f"\n✅ スキル '{skill_name}' が {skill_dir} に正常に初期化されました")
    print("\n次のステップ:")
    print("1. SKILL.md を編集して TODO 項目を完了し、説明を更新してください")
    print("2. scripts/, references/, および assets/ 内のサンプルファイルをカスタマイズまたは削除してください")
    print("3. 準備ができたらバリデータ（validator）を実行してスキルの構造をチェックしてください")

    return skill_dir


def main():
    if len(sys.argv) < 4 or sys.argv[2] != '--path':
        print("使用法: init_skill.py <skill-name> --path <path>")
        print("\nスキル名の要件:")
        print("  - ケバブケースの識別子 (例: 'my-data-analyzer')")
        print("  - 小文字の英数字とハイフンのみ")
        print("  - 最大64文字")
        print("  - ディレクトリ名と正確に一致する必要があります")
        print("\n例:")
        print("  init_skill.py my-new-skill --path skills/public")
        print("  init_skill.py my-api-helper --path skills/private")
        print("  init_skill.py custom-skill --path /custom/location")
        sys.exit(1)

    skill_name = sys.argv[1]
    path = sys.argv[3]

    print(f"🚀 スキルを初期化中: {skill_name}")
    print(f"   場所: {path}")
    print()

    result = init_skill(skill_name, path)

    if result:
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
