# テスト実装例

ここでは、高品質なテストを作成するための具体的なコードパターンを紹介します。

## 1. サービスのテスト例（ロンドン学派：モック主義）

外部依存（ここでは `db`）をモックにし、サービス層のロジックのみを隔離して検証する例です。
配置場所: `src/features/post/tests/post-service.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { postService } from './post-service';
import * as dbModule from '../../db'; // モック対象

// ## Arrange ##
// 外部依存をモック化（ロンドン学派の基本）
vi.mock('../../db', () => ({
  db: {
    insert: vi.fn().mockReturnThis(),
    values: vi.fn(),
  },
}));

describe('postService.createPost()：投稿作成ロジックの検証', () => {
  const mockPostData = {
    title: 'テストタイトル',
    content: 'テスト内容',
  };

  it('正常なデータで投稿が作成され、DB保存メソッドが正しく呼ばれること', async () => {
    // ## Arrange ##
    // モックの戻り値を設定
    const mockCreatedPost = { id: 1, ...mockPostData };
    vi.mocked(dbModule.db.values).mockResolvedValue([mockCreatedPost] as any);

    // ## Act ##
    const result = await postService.createPost(mockPostData);

    // ## Assert ##
    expect(result.id).toBe(1);
    // 依存オブジェクトとの「相互作用」を検証
    expect(dbModule.db.insert).toHaveBeenCalled();
    expect(dbModule.db.values).toHaveBeenCalledWith(mockPostData);
  });

  it('タイトルが空の場合、DB保存を呼ばずにエラーをスローすること', async () => {
    // ## Arrange ##
    const invalidData = { ...mockPostData, title: '' };
    vi.clearAllMocks();

    // ## Act & Assert ##
    await expect(postService.createPost(invalidData)).rejects.toThrow('Title is required');
    // 相互作用の検証：エラー時はDB保存が呼ばれていないこと
    expect(dbModule.db.insert).not.toHaveBeenCalled();
  });
});
```

## 2. カバレッジ100%のための網羅的なテスト

条件分岐がある場合の網羅的なテスト例です。
配置場所: `src/utils/tests/auth.test.ts`

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
