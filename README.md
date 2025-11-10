# � TypeScript Task Manager

[![CI](https://github.com/snkrs238/typescript-task-manager/workflows/CI/badge.svg)](https://github.com/snkrs238/typescript-task-manager/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen.svg)](https://github.com/snkrs238/typescript-task-manager)

Enterprise-grade Full-Stack Task Management System built with TypeScript, Express.js & Clean Architecture

## ✨ 主な機能

- ✅ **タスク管理**: 追加・削除・完了切り替え
- 📋 **柔軟なフィルタリング**: 全タスク・完了済み・未完了を表示
- ✓ **バリデーション**: 入力検証とエラーハンドリング
- 🗑️ **一括削除**: 完了済みタスクの効率的なクリア
- 🎨 **カラフルなUI**: Chalkによる見やすい表示
- 💾 **データ永続化**: JSONファイルによる保存
- 🧪 **高いテストカバレッジ**: Jest による包括的なテスト
- 🏗️ **クリーンアーキテクチャ**: SOLID原則に基づく設計
- 🔒 **型安全**: TypeScriptによる堅牢な実装

## 🏛️ アーキテクチャ

### 設計原則

- **依存性注入 (DI)**: `ITaskStorage`インターフェースによる疎結合
- **単一責任の原則**: 各クラスが明確な責任を持つ
- **インターフェース分離**: 必要最小限のメソッドのみを公開
- **Result型パターン**: エラーハンドリングの型安全性を保証

### プロジェクト構造

```
src/
├── index.ts          # CLI エントリーポイント
├── server.ts         # Express.js Webサーバー
├── taskManager.ts    # ビジネスロジック層
├── storage.ts        # データ永続化層
└── types.ts          # 型定義・インターフェース

public/
├── index.html        # メインHTML（モダンなUI）
└── app.js            # フロントエンドJavaScript

tests/
├── taskManager.test.ts  # ビジネスロジックのテスト
└── storage.test.ts      # ストレージ層のテスト
```

### API エンドポイント

```
GET    /api/tasks              # タスク一覧取得（filter: all|completed|pending）
POST   /api/tasks              # タスク追加
PATCH  /api/tasks/:id/toggle   # 完了状態切り替え
DELETE /api/tasks/:id          # タスク削除
DELETE /api/tasks/completed    # 完了済みタスク一括削除
```

## 🚀 インストール

```bash
# リポジトリをクローン
git clone https://github.com/snkrs238/typescript-task-manager.git
cd typescript-task-manager

# 依存関係をインストール
npm install

# TypeScriptをビルド
npm run build
```

## 🌐 Web UI の起動

### 開発モード
```bash
npm run dev:server
```

### 本番モード
```bash
npm run build
npm run server
```

ブラウザで `http://localhost:3000` を開くと、モダンなWeb UIでタスク管理ができます。

### Web UI の機能
- 📱 **レスポンシブデザイン**: モバイルからデスクトップまで対応
- 🎨 **モダンなUI**: グラデーション背景と滑らかなアニメーション
- 📊 **リアルタイム統計**: 総タスク・完了・未完了の数を表示
- 🔍 **フィルタリング**: すべて・未完了・完了済みでフィルター
- ⚡ **高速**: REST APIによる非同期通信

## 📖 使い方（CLI版）

### タスクの追加
```bash
npm run dev add 買い物に行く
npm run dev add TypeScriptを勉強する
```

### タスクの一覧表示
```bash
# すべてのタスクを表示
npm run dev list

# 短縮形
npm run dev ls

# 未完了タスクのみ表示
npm run dev list --pending

# 完了済みタスクのみ表示
npm run dev list --completed
```

### タスクの完了/未完了切り替え
```bash
npm run dev toggle 1
# または
npm run dev done 1
```

### タスクの削除
```bash
npm run dev delete 1
# または
npm run dev rm 1
```

### 完了済みタスクの一括削除
```bash
npm run dev clear
```

### ヘルプの表示
```bash
npm run dev --help
npm run dev add --help
```

## 🏗️ プロジェクト構造

```
task-cli/
├── src/
│   ├── index.ts          # CLIのエントリーポイント
│   ├── taskManager.ts    # タスク管理ロジック
│   └── types.ts          # TypeScript型定義
├── dist/                 # コンパイル後のJavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ 開発

```bash
# 開発モード（ts-node使用）
npm run dev

# ビルド
npm run build

# ビルドと実行
npm run build && npm start

# ウォッチモード
npm run watch
```

## 💡 技術スタック

### コア技術
- **TypeScript 5.0+** - 型安全な開発、strictモード有効
- **Node.js 16+** - 非同期I/O、ファイルシステム操作
- **Express.js** - RESTful API サーバー
- **Commander.js** - CLIフレームワーク
- **Chalk 4.x** - ターミナル出力のスタイリング

### フロントエンド
- **Vanilla JavaScript** - フレームワーク不要のシンプル実装
- **Modern CSS** - CSS Grid、Flexbox、アニメーション
- **Responsive Design** - モバイルファースト設計
- **REST API** - Fetch APIによる非同期通信

### 開発ツール
- **Jest** - テストフレームワーク（カバレッジ70%以上）
- **ESLint** - 静的コード解析
- **Prettier** - コードフォーマッター
- **Husky** - Git Hooks管理
- **GitHub Actions** - CI/CD パイプライン

### デザインパターン
- **Dependency Injection** - テスタビリティ向上
- **Repository Pattern** - データアクセス層の抽象化
- **Result Pattern** - 型安全なエラーハンドリング
- **Factory Pattern** - オブジェクト生成の柔軟性

## 📦 データ保存

タスクは以下の場所に保存されます：
- macOS/Linux: `~/.task-cli/tasks.json`
- Windows: `%USERPROFILE%\.task-cli\tasks.json`

## 📝 ライセンス

MIT License

## 👤 作者

snkrs238 ([@snkrs238](https://github.com/snkrs238))

## � テスト

```bash
# テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジレポート生成
npm run test:coverage
```

### テスト戦略
- **ユニットテスト**: 各関数・メソッドの単体テスト
- **統合テスト**: ストレージとの連携テスト
- **モックオブジェクト**: 依存性の分離
- **カバレッジ目標**: 70%以上（branches, functions, lines, statements）

## 📊 コード品質

```bash
# 型チェック
npm run type-check

# リンター実行
npm run lint

# リンター自動修正
npm run lint:fix

# フォーマッター実行
npm run format

# フォーマットチェック
npm run format:check
```

## 🚀 CI/CD

GitHub Actionsによる自動化:
- ✅ 自動テスト実行（Node.js 16, 18, 20）
- ✅ 型チェック・リント・フォーマットチェック
- ✅ テストカバレッジレポート生成
- ✅ ビルド成果物の生成

## 🎯 実装のポイント

### 1. 型安全性
```typescript
// Result型によるエラーハンドリング
interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}
```

### 2. 依存性注入
```typescript
// ストレージの抽象化
interface ITaskStorage {
  load(): Promise<TaskStore>;
  save(store: TaskStore): Promise<void>;
}

// コンストラクタインジェクション
class TaskManager {
  constructor(private readonly storage: ITaskStorage) {}
}
```

### 3. 非同期処理
```typescript
// 全てのI/O操作を非同期化
async addTask(title: string): Promise<Result<Task>>
```

### 4. バリデーション
```typescript
// 入力検証の実装
private validateTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 500;
}
```

## �🤝 コントリビューション

プルリクエストを歓迎します！バグ報告や機能要望もお気軽にIssueで報告してください。

### 貢献方法
1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

---
