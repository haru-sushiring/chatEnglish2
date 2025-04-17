# Railway へのデプロイ手順

このプロジェクトを Railway にデプロイするための手順を説明します。

## 前提条件

- Railway アカウント
- Railway CLI のインストール

## デプロイ手順

### 1. Railway CLI のインストール

```bash
npm i -g @railway/cli
```

### 2. Railway にログイン

```bash
railway login
```

### 3. プロジェクトの初期化

```bash
railway init
```

### 4. プロジェクトのリンク

既存の Railway プロジェクトとリンクする場合：

```bash
railway link
```

### 5. 環境変数の設定

Railway ダッシュボード上で以下の環境変数を設定します：

- `APP_NAME` - アプリケーション名
- `APP_ENV` - 環境（production）
- `APP_KEY` - Laravel アプリケーションキー
- `APP_DEBUG` - デバッグモード（false）
- `APP_URL` - アプリケーションの URL
- `DB_CONNECTION` - データベース接続（mysql）
- `DB_HOST` - データベースホスト
- `DB_PORT` - データベースポート
- `DB_DATABASE` - データベース名
- `DB_USERNAME` - データベースユーザー名
- `DB_PASSWORD` - データベースパスワード

### 6. デプロイの実行

```bash
railway up
```

### 7. デプロイ後の設定

デプロイ後、マイグレーションを実行します：

```bash
railway run php artisan migrate
```

### 8. アプリケーションを開く

```bash
railway open
```

## 注意事項

- データベースサービスを別途 Railway で設定する必要があります。
- 環境変数は適切に設定してください。
- 本番環境では`APP_DEBUG=false`に設定してください。
- 静的ファイルの配信には S3 などの外部ストレージの利用を検討してください。
