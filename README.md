# 英語音読トレーニングアプリ for LD

学習障害（LD）のある方向けの英語音読練習＆読解問題アプリケーションです。Web Speech APIによる音声認識を使用して、音読速度（WPM）と理解度を測定します。

## 🎯 主な機能

- ✅ **音声認識による音読トレーニング** - Web Speech APIで音読を自動検出
- 📊 **WPM（Words Per Minute）測定** - 読書速度を計測・記録
- 📝 **4択読解問題** - 英検3級レベルの問題5問
- 📈 **学習進捗の可視化** - 正答率とWPMの推移グラフ
- 💾 **スコア記録** - LocalStorage + Firebase Firestoreに保存
- 🆔 **ユーザーID管理** - 別デバイスでも同じアカウントで記録可能
- 📥 **CSV出力** - スコアデータをダウンロード可能

## 🚀 クイックスタート

### 必要な環境

- **ブラウザ**: Google Chrome（推奨）、Microsoft Edge、Safari
- **マイク**: 音声認識に必要
- **インターネット接続**: 初回の音声認識とFirebase保存に必要

### ローカルでの起動

1. リポジトリをクローン
   ```bash
   git clone https://github.com/itiyabosi/English-reading-app-for-ld.git
   cd English-reading-app-for-ld
   ```

2. ローカルサーバーを起動
   ```bash
   # Python 3の場合
   python3 -m http.server 8000

   # Python 2の場合
   python -m SimpleHTTPServer 8000
   ```

3. ブラウザで開く
   ```
   http://localhost:8000
   ```

4. マイクへのアクセスを許可

### GitHub Pagesでのデプロイ

1. GitHubリポジトリの Settings → Pages
2. Source: `main` branch
3. 数分後、`https://your-username.github.io/repo-name/` でアクセス可能

## 📖 使い方

### 1. スタート画面
- アプリの説明と使い方を確認
- データ収集の同意チェックボックスを確認
- 「スタート」ボタンをクリック

### 2. 問題画面（全5問）
1. **音読フェーズ**
   - 「測定開始」ボタンをクリック
   - 英文を声に出して読む（自動で80%完了検出）
   - 音読結果がハイライト表示される

2. **解答フェーズ**
   - 読解問題を読む
   - 4つの選択肢から正解を選ぶ
   - 正誤フィードバックが表示される

### 3. 結果画面
- 正解数とWPMを確認
- 全問のスコアシート表示
- ユーザーIDのコピー・読み込み
- アクション選択:
  - もう一度遊ぶ
  - スコアをCSV出力
  - 履歴を見る

### 4. 履歴画面
- 過去のスコア一覧
- 推移グラフを表示
- 履歴をCSV出力
- 履歴の削除

### 5. 推移画面
- 正答率の推移グラフ（色分け: 緑 ≥80%, 黄 ≥60%, 赤 <60%）
- WPMの推移グラフ（色分け: 緑 ≥150, 黄 ≥100, 赤 <100）
- 統計情報（平均値、最高値など）

## 🔧 技術スタック

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **音声認識**: Web Speech API
- **データベース**: Firebase Firestore
- **ホスティング**: GitHub Pages
- **バージョン管理**: Git/GitHub

## 📊 データ保存

### LocalStorage
- すべてのスコアデータをブラウザ内に保存
- オフラインでも動作
- ブラウザの履歴削除で消去される可能性あり

### Firebase Firestore
- データ収集に同意した場合のみクラウド保存
- 匿名データのみ（個人情報は収集しない）
- セキュリティルールで保護

## 🔒 プライバシー

当アプリは個人情報を一切収集しません。詳細は [プライバシーポリシー](privacy.html) をご覧ください。

### 収集するデータ
- スコア（正解数、WPM、時間）
- ブラウザ情報（User Agent、言語設定）
- 匿名ユーザーID

### 収集しないデータ
- 氏名、メールアドレス、電話番号
- 音声データ（音声認識は端末内で処理）
- IPアドレス、位置情報
- その他個人を特定できる情報

## 🐛 トラブルシューティング

### 音声認識が動かない
- **対処法**:
  - Google Chromeを使用してください
  - マイクへのアクセスを許可してください
  - HTTPSまたはlocalhostでアクセスしてください

### スタートボタンが押せない
- **対処法**:
  - ブラウザのキャッシュをクリアしてください
  - プライベートモードで試してください
  - コンソールにエラーが表示されていないか確認してください

### Firebaseに保存されない
- **対処法**:
  - データ収集の同意チェックボックスを確認
  - Firebase設定が正しいか確認
  - コンソールのエラーメッセージを確認

## 📝 開発者向け情報

### ファイル構成
```
/
├── index.html              # メインHTML（187行）
├── app.js                  # メインJavaScript（1700行）
├── style.css               # スタイルシート（800行）
├── privacy.html            # プライバシーポリシー
├── README.md               # 本ファイル
├── PROJECT_REQUIREMENTS.md # 要件定義書
└── DEVELOPMENT_INSTRUCTIONS.md # 開発指示書
```

### 重要な関数

#### 音声認識関連
- `initSpeechRecognition()` - 音声認識初期化
- `startRecording()` - 録音開始
- `stopRecording()` - 録音停止
- `checkIfReadingComplete()` - 読了チェック（80%検出）
- `compareTextWithPassage()` - 音読結果比較

#### マッチングアルゴリズム
- `findOptimalMatching()` - 動的計画法による最適マッチング
- `getMatchScore()` - マッチスコア計算
- `levenshteinDistance()` - レーベンシュタイン距離計算
- `detectSelfCorrections()` - 自己修正の検出

#### データ管理
- `saveScore()` - スコア保存（LocalStorage）
- `saveScoreToFirebase()` - スコア保存（Firebase）
- `getAllScores()` - スコア取得
- `exportScoresToCSV()` - CSV出力

#### UI制御
- `showScreen()` - 画面表示切替
- `displayQuestion()` - 問題表示
- `showResults()` - 結果表示
- `displayHistory()` - 履歴表示
- `displayProgressChart()` - 推移グラフ表示

### テストチェックリスト
- [x] スタートボタンが押せる
- [x] バージョンが正しく表示される
- [ ] 音声認識が開始できる（要ブラウザテスト）
- [ ] 音読結果が表示される（要ブラウザテスト）
- [ ] 問題に解答できる（要ブラウザテスト）
- [ ] 結果画面が表示される（要ブラウザテスト）
- [ ] スコアがLocalStorageに保存される（要ブラウザテスト）
- [ ] Firebaseに保存される（要Firebase設定）
- [ ] 履歴が表示される（要ブラウザテスト）
- [ ] 推移グラフが表示される（要ブラウザテスト）
- [ ] CSV出力ができる（要ブラウザテスト）
- [ ] ユーザーIDのコピーができる（要ブラウザテスト）
- [ ] ユーザーIDの読み込みができる（要ブラウザテスト）
- [x] コンソールにSyntaxErrorが出ない
- [x] 重複const宣言がない

## 📈 バージョン履歴

### v2.00 (2025-01-XX)
- ✨ 完全リビルド（ゼロから再構築）
- ✅ 重複const宣言の完全排除
- 🎨 新デザインシステム導入
- 📊 WPM測定・表示機能の改善
- 📈 進捗グラフの視覚化強化
- 🐛 バグ修正多数

### v1.11 (2025-01-XX)
- 🐛 重複const宣言を修正（4箇所）
- 🔧 キャッシュバスティング導入

### v1.00 (2025-01-XX)
- 🎉 初回リリース
- ✨ 基本機能実装

## 🤝 コントリビューション

バグ報告や機能リクエストは、GitHubのIssuesページからお願いします。

GitHub Issues: https://github.com/itiyabosi/English-reading-app-for-ld/issues

## 📄 ライセンス

MIT License

## 👨‍💻 作成者

開発チーム

---

**アプリURL**: https://itiyabosi.github.io/English-reading-app-for-ld/
**バージョン**: 2.00
**最終更新**: 2025年1月
