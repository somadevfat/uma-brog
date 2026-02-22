# テスト実装例

ここでは、高品質なテストを作成するための具体的なコードパターンを紹介します。

## 1. サービスのテスト例

HonoX / Drizzle 環境でのサービス層のテスト例です。

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { postService } from './post-service';
import { db } from '../../db';

describe('postService.createPost()：投稿作成ロジックの検証', () => {
  // ## Arrange ##
  // 共通の準備が必要な場合は beforeEach 等を使用
  const mockPostData = {
    title: 'テストタイトル',
    content: 'テスト内容',
  };

  it('正常なデータで投稿が作成され、データが永続化されること', async () => {
    // ## Arrange ##
    // バリデーションやDB挿入のモックが必要な場合はここで設定

    // ## Act ##
    const result = await postService.createPost(mockPostData);

    // ## Assert ##
    expect(result.id).toBeDefined();
    expect(result.title).toBe(mockPostData.title);
  });

  it('タイトルが空の場合にバリデーションエラーをスローすること', async () => {
    // ## Arrange ##
    const invalidData = { ...mockPostData, title: '' };

    // ## Act & Assert ##
    // エラーのスローを検証する場合は、ActとAssertが重なる場合もある
    await expect(postService.createPost(invalidData)).rejects.toThrow('Title is required');
  });
});
```

## 2. カバレッジ100%のための網羅的なテスト

条件分岐がある場合の網羅的なテスト例です。

```typescript
/**
 * ユーザーの権限に基づいてアクションの可否を判定する関数。
 */
const canPerformAction = (role: string, isOwner: boolean): boolean => {
  // 管理者は常に可能
  if (role === 'admin') return true;
  // 一般ユーザーはオーナーであれば可能
  if (role === 'user') return isOwner;
  // それ以外は不可
  return false;
};

describe('canPerformAction()：権限判定ロジックの網羅テスト', () => {
  it('adminロールの場合、Ownerでなくてもtrueを返すこと', () => {
    // ## Arrange ##
    const role = 'admin';
    const isOwner = false;

    // ## Act ##
    const result = canPerformAction(role, isOwner);

    // ## Assert ##
    expect(result).toBe(true);
  });

  it('userロールかつOwnerの場合、trueを返すこと', () => {
    // ## Arrange ##
    const role = 'user';
    const isOwner = true;

    // ## Act ##
    const result = canPerformAction(role, isOwner);

    // ## Assert ##
    expect(result).toBe(true);
  });

  it('userロールかつOwnerでない場合、falseを返すこと', () => {
    // ## Arrange ##
    const role = 'user';
    const isOwner = false;

    // ## Act ##
    const result = canPerformAction(role, isOwner);

    // ## Assert ##
    expect(result).toBe(false);
  });

  it('未知のロールの場合、常にfalseを返すこと', () => {
    // ## Arrange ##
    const role = 'guest';
    const isOwner = true;

    // ## Act ##
    const result = canPerformAction(role, isOwner);

    // ## Assert ##
    expect(result).toBe(false);
  });
});
```

このように、すべての `if` や `return` パスを通るようにテストケースを設計することで、カバレッジ100%を達成します。
