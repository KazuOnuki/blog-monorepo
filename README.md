# Japan Support Blogs monorepo

日本のサポート チームが運営する 4 つの GitHub Pages ブログについて、記事、画像、Hexo 設定、共通テーマを一元管理するリポジトリです。

- 中央リポジトリ: <https://github.com/japan-ai-support-blogs/blog-monorepo>
- GitHub Organization: `japan-ai-support-blogs`
- 既定ブランチ: `main`
- 公開範囲: Public

## 重要な運用方針

このリポジトリを、すべての記事と画像の **正本 (source of truth)** とします。

- 新規記事、記事修正、画像追加は `content/` 配下で行います。
- 旧 Base Repository は、既存 URL と画像配信を維持するためのミラーです。原則として直接編集しません。
- Blog Repository は Hexo の生成物を置く公開先です。手作業で編集しません。
- 公開サイト URL、記事 URL、画像 URL は統合前から変更しません。
- 旧リポジトリを誤って変更した場合は、同期前に中央リポジトリへ取り込みます。

## サイトとリポジトリの対応

| Product | Site key | 中央の記事ソース | Base Repository (ミラー) | Blog Repository (生成物) | Public Site URL |
|---|---|---|---|---|---|
| Azure AI | `jpaiblog` | `content/jpaiblog.github.io/` | <https://github.com/jpaiblog/jpaiblog.github.io> | <https://github.com/jpaiblog/blog> | <https://jpaiblog.github.io/blog/> |
| Azure IoT | `jpiotblog` | `content/jpiotblog.github.io/` | <https://github.com/jpiotblog/jpiotblog.github.io> | <https://github.com/jpiotblog/blog> | <https://jpiotblog.github.io/blog/> |
| Machine Learning | `jpmlblog` | `content/jpmlblog.github.io/` | <https://github.com/jpmlblog/jpmlblog.github.io> | <https://github.com/jpmlblog/blog> | <https://jpmlblog.github.io/blog/> |
| Windows Driver Kit | `jpwdkblog` | `content/jpwdkblog.github.io/` | <https://github.com/jpwdkblog/jpwdkblog.github.io> | <https://github.com/jpwdkblog/blog> | <https://jpwdkblog.github.io/blog/> |

### 各リポジトリの役割

**中央リポジトリ (このリポジトリ)**

- 記事と画像の正本
- 4 サイト共通の Hexo 依存関係とテーマ
- サイト別設定と favicon
- ビルド、URL 検証、ミラー同期、デプロイ用ツール
- 旧 4 Base Repository から取り込んだ全コミット履歴

**Base Repository (`<site>.github.io`)**

- 中央リポジトリから同期される互換ミラー
- 既存の画像 URL (`https://<site>.github.io/images/...`) を維持
- 直接編集は原則禁止

**Blog Repository (`<site>/blog`)**

- `hexo deploy` が生成済み HTML、CSS、JavaScript を配置する公開先
- 人が直接編集する場所ではない
- 直接変更しても、次回デプロイで中央リポジトリからの生成物に置き換わる

## ディレクトリ構成

- `content/`: 製品別の記事と画像。旧 4 Base Repository の全履歴を保持
- `sites/`: サイト別 Hexo 設定と favicon
- `themes/material-flow/`: 4 サイト共通テーマ
- `scripts/`: Hexo 実行時の互換フィルター
- `tools/`: ビルド、検証、同期、デプロイ用コマンド
- `baselines/`: 統合前から存在する公開ファイル パス一覧
- `.build/`: ビルド用一時ファイル (Git 管理外)
- `dist/`: 生成済みサイト (Git 管理外)

## 初期セットアップ

```powershell
git clone https://github.com/japan-ai-support-blogs/blog-monorepo.git
cd blog-monorepo
npm ci
npm run build
npm run verify:urls
```

Node.js、npm、Git for Windows が必要です。

## 通常の記事更新

### 1. 中央リポジトリを最新化

```powershell
git pull --ff-only
```

### 2. 記事または画像を編集

例: Azure AI の記事を追加する場合

```text
content/jpaiblog.github.io/New-AzureAI-Article.md
```

画像も同じサイトのディレクトリへ追加します。

```text
content/jpaiblog.github.io/images/New-AzureAI-Article/image01.png
```

既存画像 URL を維持する場合の記述例:

```markdown
![画面の説明](https://jpaiblog.github.io/images/New-AzureAI-Article/image01.png)
```

### 3. ビルドと確認

```powershell
# 全サイト
npm run build

# または 1 サイトのみ
npm run build:ai
npm run build:iot
npm run build:ml
npm run build:wdk

# 公開パスとリンクを検証
npm run verify:urls
```

既存記事の修正のみで URL が変わらない場合、`verify:urls` はそのまま成功します。

新規記事などで公開パスを意図的に追加・削除した場合、`verify:urls` は安全のため一度停止します。生成された `dist/` を確認した後、対象サイトのベースラインだけを更新し、その差分をレビューします。

```powershell
npm run capture:baseline -- jpaiblog
git diff -- baselines/jpaiblog.txt
npm run verify:urls
```

ブラウザで確認する場合:

```powershell
npm run serve -- jpaiblog
```

### 4. 中央リポジトリへ保存

```powershell
git add .
git commit -m "Add Azure AI article"
git push origin main
```

### 5. 旧 Base Repository を同期

```powershell
npm run sync:mirrors
```

同期後、対象の旧 Base Repository で差分を確認し、commit と push を行います。特に画像を追加した場合は、公開記事をデプロイする前に Base Repository へ push してください。

例:

```powershell
git -C ../github/jpaiblog.github.io status
git -C ../github/jpaiblog.github.io add --all
git -C ../github/jpaiblog.github.io commit -m "Sync from blog monorepo"
git -C ../github/jpaiblog.github.io push
```

### 6. 公開

```powershell
# 1 サイト
npm run deploy -- jpaiblog

# 全サイト
npm run deploy
```

デプロイ処理は公開前に `verify:urls` を実行します。既存の公開パスに増減がある場合は自動的に停止します。

## GitHub Web から中央の記事を編集した場合

GitHub の Web 画面で `content/` 配下を変更しても構いません。その後、デプロイ PC で必ず中央リポジトリを取得してから作業します。

```powershell
git pull --ff-only
npm run build
npm run verify:urls
npm run sync:mirrors
```

## 旧 Base Repository を変更した場合

旧 Base Repository の変更は、中央リポジトリへ自動反映されません。

`sync:mirrors` は次を検出すると、上書きせずに停止します。

- 旧ローカル リポジトリに未コミット変更がある
- ローカル ブランチが remote より ahead / behind している
- local と remote が分岐している
- 前回同期時から旧コンテンツだけが変更されている

### 誤って変更した場合の復旧

まず、中央リポジトリの作業ツリーを clean にします。**先に `sync:mirrors` を実行しないでください。**

```powershell
git status

# 例: 旧 AI Base Repository の master を全履歴付きで取り込む
npm run import:legacy -- jpaiblog

npm run build
npm run verify:urls
git push origin main

# 中央への取り込み後にミラーを再同期
npm run sync:mirrors
```

`import:legacy` は `git subtree pull` を使用します。旧側で作成されたコミット履歴も中央リポジトリへ保持されます。

サイト キーは次のいずれかです。

- `jpaiblog`
- `jpiotblog`
- `jpmlblog`
- `jpwdkblog`

## Blog Repository を変更した場合

Blog Repository は生成物の公開先です。変更しても中央ソースへは取り込まれず、次回デプロイで上書きされます。

必要な修正は、内容に応じて次で行います。

- 記事・画像: `content/<repository>/`
- サイト固有設定: `sites/<site>/`
- 共通表示・動作: `themes/material-flow/`

## 管理メニュー

Windows では、ワークスペース ルートの `blogmanagement.bat` から統合メニューを利用できます。

```text
1. Build all sites
2. Verify public URLs
3. Sync content to legacy mirror repositories
4. Deploy all sites
5. Preview a site
6. Import accidental changes from a legacy repository
```

旧方式が必要な場合に限り、ワークスペース ルートの `blogmanagement-legacy.bat` を使用します。

## URL 互換性と安全機能

- `baselines/*.txt` に統合時点の公開ファイル パスを保存
- `npm run verify:urls` で生成結果とベースラインを比較
- URL 差分がある場合、デプロイを自動停止
- `sync:mirrors` は全ミラーの安全確認が完了してからコピーを開始
- OneDrive 環境で停止しやすい Git auto-GC / maintenance はローカル設定で無効化

意図して URL を追加または削除する場合は、生成結果、影響、必要なリダイレクト方針を確認した後に限り、対象サイトのベースラインを更新します。

```powershell
npm run capture:baseline -- jpaiblog
git diff -- baselines/jpaiblog.txt
```

`npm run verify:links` は、統合前の生成物が `../hexo/<site>.github.io/.deploy_git` に存在する移行・回帰確認用PCでのみ使用します。通常の記事追加では、新しいページが比較元に存在しないため実行しません。

## 統合時に行った互換修正

公開パスを維持したまま、旧環境の非決定的な生成結果を次のように固定しています。

- 同日公開の ML 2 記事について、前後リンクを決定的に生成
- `Azure Machine Learning Studio (Classic)` / `(classic)` を既存の大文字カテゴリ URL へ統一
- WDK の `Printer` / `printer` を既存の小文字タグ URL へ統一
- 旧 Markdown renderer の違いによる見出しアンカーをサイト別互換フィルターで再現

## 履歴

旧 4 Base Repository の `master` ブランチは、`git subtree add` を使用して squash せずに取り込んでいます。統合前の各 HEAD コミットは、中央リポジトリの `main` ブランチから到達できます。
