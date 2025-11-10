# 転職ポートフォリオ向け技術概要

## 🎯 プロジェクトの目的

このプロジェクトは、TypeScriptを使用したプロフェッショナルなCLIツールの実装例として作成されました。
エンタープライズレベルの開発プラクティスを示すことを目的としています。

## 🏗️ アーキテクチャの特徴

### 1. クリーンアーキテクチャ

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│         (CLI - index.ts)            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Business Logic Layer         │
│      (TaskManager - SOLID)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Data Access Layer            │
│    (FileTaskStorage - Repository)   │
└─────────────────────────────────────┘
```

### 2. SOLID原則の適用

- **単一責任の原則 (SRP)**
  - `TaskManager`: ビジネスロジックのみを担当
  - `FileTaskStorage`: データの永続化のみを担当
  - `index.ts`: CLI表示とユーザー入力のみを担当

- **オープン・クローズドの原則 (OCP)**
  - `ITaskStorage`インターフェースにより、新しいストレージ実装を追加可能
  - 既存コードの変更なしで拡張可能

- **リスコフの置換原則 (LSP)**
  - すべてのストレージ実装は`ITaskStorage`を実装
  - どの実装も同じように動作

- **インターフェース分離の原則 (ISP)**
  - 最小限のメソッドのみを持つインターフェース設計
  - 不必要な依存関係の排除

- **依存性逆転の原則 (DIP)**
  - 上位層（TaskManager）は下位層（Storage）の抽象に依存
  - 具体的な実装には依存しない

### 3. デザインパターン

#### Dependency Injection
```typescript
class TaskManager {
  constructor(private readonly storage: ITaskStorage) {}
}

// 使用例
const storage = new FileTaskStorage();
const manager = new TaskManager(storage);
```

#### Repository Pattern
```typescript
interface ITaskStorage {
  load(): Promise<TaskStore>;
  save(store: TaskStore): Promise<void>;
}
```

#### Result Pattern
```typescript
interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

// 型安全なエラーハンドリング
const result = await taskManager.addTask(title);
if (result.success && result.data) {
  // 成功時の処理
} else {
  // エラーハンドリング
}
```

## 💻 技術的な実装のポイント

### 1. TypeScriptの型安全性

```typescript
// 厳格な型チェック
"strict": true
"noImplicitAny": true
"strictNullChecks": true

// インターフェースによる契約
interface ITaskManager {
  addTask(title: string): Promise<Result<Task>>;
  // ...
}
```

### 2. 非同期処理の適切な管理

```typescript
// すべてのI/O操作を非同期化
async load(): Promise<TaskStore>
async save(store: TaskStore): Promise<void>

// エラーハンドリング
try {
  await fs.writeFile(this.dataFile, data, 'utf-8');
} catch (error) {
  throw new Error(`Failed to save tasks: ${error.message}`);
}
```

### 3. バリデーションとエラーハンドリング

```typescript
private validateTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 500;
}

if (!this.validateTitle(title)) {
  return {
    success: false,
    error: new Error('Task title must be between 1 and 500 characters'),
  };
}
```

### 4. テスタビリティ

```typescript
// モックオブジェクトを使用したテスト
class MockStorage implements ITaskStorage {
  private store: TaskStore = { tasks: [], nextId: 1 };
  
  async load(): Promise<TaskStore> {
    return JSON.parse(JSON.stringify(this.store));
  }
}

// DIにより簡単にモック化
const mockStorage = new MockStorage();
const taskManager = new TaskManager(mockStorage);
```

## 📊 コード品質指標

### テストカバレッジ
- **Statements**: 91.76%
- **Branches**: 56.25%
- **Functions**: 100%
- **Lines**: 91.13%

### コード品質ツール
- ✅ ESLint: 静的コード解析
- ✅ Prettier: コードフォーマット
- ✅ TypeScript Strict Mode: 厳格な型チェック
- ✅ Husky: Git Hooks による品質保証

### CI/CD
- GitHub Actionsによる自動テスト
- 複数のNode.jsバージョンでのテスト（16, 18, 20）
- 自動ビルドとアーティファクト生成

## 🚀 実装した機能

### 基本機能
- タスクの CRUD 操作
- フィルタリング（全て・完了・未完了）
- 一括削除

### エンジニアリング機能
- 包括的なエラーハンドリング
- 入力バリデーション
- データ永続化
- 非同期I/O処理
- ユニット/統合テスト

## 📚 学んだ技術

1. **TypeScript**
   - 高度な型システム
   - ジェネリクス
   - ユーティリティ型

2. **設計パターン**
   - Dependency Injection
   - Repository Pattern
   - Result Pattern

3. **テスト駆動開発**
   - Jest を使用したテスト
   - モックオブジェクト
   - カバレッジ測定

4. **DevOps**
   - CI/CD パイプライン
   - 自動化されたコード品質チェック
   - Git Hooks

## 🎓 このプロジェクトで示せるスキル

✅ TypeScriptの深い理解と実践的な使用
✅ オブジェクト指向設計とSOLID原則
✅ クリーンアーキテクチャの実装
✅ テスト駆動開発とテスタブルなコード
✅ 非同期プログラミング
✅ エラーハンドリングとバリデーション
✅ CI/CDとDevOps実践
✅ コード品質管理
✅ ドキュメンテーション能力

## 💼 面接での話題

このプロジェクトについて話す際のポイント：

1. **なぜこの設計を選んだか**
   - 依存性注入によるテスタビリティの向上
   - インターフェース分離による拡張性
   - Result型による型安全なエラーハンドリング

2. **どのように品質を保証したか**
   - 90%以上のテストカバレッジ
   - ESLint/Prettierによる統一されたコードスタイル
   - CI/CDによる自動化

3. **実際の開発で学んだこと**
   - 小さく始めてリファクタリングする重要性
   - テストファーストのアプローチ
   - ドキュメンテーションの価値

4. **今後の改善案**
   - データベース（SQLite等）への移行
   - タグ機能の追加
   - 優先度設定
   - 複数ユーザー対応
   - Web UI の追加
