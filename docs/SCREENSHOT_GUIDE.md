# スクリーンショット撮影ガイド

このドキュメントでは、README.mdに表示するスクリーンショットの撮影方法を説明します。

## 📸 必要なスクリーンショット

### 1. Web UI - デスクトップ表示 (`web-ui-desktop.png`)

**撮影手順:**
1. サーバーを起動: `npm run dev:server`
2. ブラウザで `http://localhost:3000` を開く
3. ブラウザウィンドウを適切なサイズに調整（1440x900推奨）
4. タスクを2-3個追加（例：「TypeScriptを学習」「Web UIを実装」など）
5. 1つのタスクを完了状態にする
6. ページ全体のスクリーンショットを撮影

**撮影のポイント:**
- グラデーション背景が美しく映るようにする
- 統計情報（総タスク、完了、未完了）が見えるようにする
- ヘッダーとフッターを含める

**Macでの撮影方法:**
```bash
# ブラウザウィンドウ全体を撮影
⌘ + Shift + 4 → Spaceキー → ウィンドウをクリック
```

### 2. Web UI - タスク管理画面 (`web-ui-tasks.png`)

**撮影手順:**
1. 5-6個のタスクを追加
2. いくつかを完了状態にする
3. フィルターボタンの近くまでスクロール
4. タスクリストとフィルターボタンが見える状態で撮影

**撮影のポイント:**
- タスクのホバー効果が見えるように（可能であれば）
- フィルターボタンを含める
- 統計情報を含める

### 3. CLI版デモ (`cli-demo.png`)

**撮影手順:**
1. ターミナルを開く
2. 以下のコマンドを順番に実行し、出力を確認:
```bash
# ヘルプ表示
npm run dev -- --help

# タスク追加
npm run dev add "プロジェクトをGitHubにプッシュ"
npm run dev add "READMEを完成させる"
npm run dev add "スクリーンショットを撮影"

# タスク一覧表示
npm run dev list

# タスクを完了にする
npm run dev done 1

# 完了後の一覧表示
npm run dev list
```

3. 一連の操作が見える状態でターミナル全体を撮影

**撮影のポイント:**
- カラフルな出力が見えるようにする
- チェックマーク（✓）や色分けが明確に見える
- コマンドと出力の両方を含める

**Macでの撮影方法:**
```bash
# ターミナルウィンドウを撮影
⌘ + Shift + 4 → Spaceキー → ターミナルウィンドウをクリック
```

## 🎨 画像の最適化

撮影後、以下のツールで画像を最適化してください:

### オンラインツール
- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/

### コマンドラインツール（オプション）
```bash
# ImageMagickでリサイズ
brew install imagemagick
convert web-ui-desktop.png -resize 1600x web-ui-desktop-optimized.png
```

## 📁 ファイルの配置

撮影・最適化した画像を以下のディレクトリに保存:

```
typescript-task-manager/
└── docs/
    └── images/
        ├── web-ui-desktop.png      # Web UI デスクトップ表示
        ├── web-ui-tasks.png        # タスク管理画面
        └── cli-demo.png            # CLIデモ
```

## ✅ チェックリスト

撮影前の準備:
- [ ] サーバーが起動している (`npm run dev:server`)
- [ ] ブラウザウィンドウのサイズを調整済み
- [ ] ターミナルのフォントサイズが適切
- [ ] サンプルタスクを用意

撮影完了:
- [ ] `web-ui-desktop.png` を撮影
- [ ] `web-ui-tasks.png` を撮影
- [ ] `cli-demo.png` を撮影

後処理:
- [ ] 画像を最適化（ファイルサイズを削減）
- [ ] `docs/images/` に保存
- [ ] Gitにコミット

## 🚀 Gitにコミット

```bash
# 画像を追加
git add docs/images/

# コミット
git commit -m "docs: Add screenshots to README

- Add Web UI desktop view screenshot
- Add task management interface screenshot
- Add CLI demo screenshot"

# プッシュ
git push origin main
```

## 💡 ヒント

### 美しいスクリーンショットのコツ

1. **ブラウザのズームレベル**: 100%に設定
2. **ウィンドウサイズ**: 1440x900 または 1920x1080
3. **背景**: グラデーションが美しく映るようにする
4. **タスクの内容**: 意味のある内容を入力
   - ❌ 悪い例: "test", "aaa", "タスク1"
   - ✅ 良い例: "TypeScriptを学習", "Clean Architectureを実装"

5. **カラーバランス**: ターミナルの配色を確認
6. **影を含める**: Macのウィンドウキャプチャは自動的に影を含む

### サンプルタスクの例

```typescript
優れたサンプルタスク:
- "TypeScriptプロジェクトを完成させる"
- "Express.jsでREST APIを実装"
- "Jestでテストカバレッジ90%達成"
- "Web UIにレスポンシブデザインを適用"
- "GitHubにプッシュして公開"
- "README.mdを充実させる"
```

---

スクリーンショットを追加することで、GitHubのREADMEが一気にプロフェッショナルになります！📸✨
