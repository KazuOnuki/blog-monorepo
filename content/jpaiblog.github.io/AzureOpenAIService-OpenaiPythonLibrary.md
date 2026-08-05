---
title: openai-python ライブラリについて
date: 2023-10-19 00:00:00
categories:
- Azure OpenAI
tags:
- Azure OpenAI
---
この記事は、 Azure OpenAI の公式ドキュメント上に記載がある openai-python ライブラリについてご紹介します。

<!-- more -->
<br>

***

## openai-python ライブラリについて

本ライブラリは OpenAI の API を Python で利用するための公式ライブラリで、機械学習モデルの訓練や予測など、 OpenAI の各種サービスに利用することができます。  
openai-python ライブラリは、 OpenAI 社によって管理されています。  
その為、本ライブラリに関して弊社( Microsoft )の技術サポート サービスより正式なご案内をすることはできません。  

最新の情報を確認するには、 GitHub 上の[リリース履歴](https://github.com/openai/openai-python/releases)や[アナウンス](https://github.com/openai/openai-python/discussions/categories/announcements)をご覧ください。

## openai-python ライブラリのお問い合わせ先について

openai-python に関する正式な見解が必要な場合、大変お手数ですが  [openai-python コミュニティ](https://github.com/openai/openai-python)へ直接お問い合わせをお願いします。 GitHub の [issue](https://github.com/openai/openai-python/issues) や pull request を通じて、開発者コミュニティと直接コミュニケーションを取ることが可能です。

## Azure OpenAI Service に対する openai-python ライブラリを使用する際の注意点

Azure OpenAI Service の機能変更に伴い、過去バージョンのライブラリの互換性が失われる可能性があります。 上記にて記載していますとおり、弊社では openai-python ライブラリと Azure OpenAI Service の互換性を保証していないため、ライブラリへの依存性のリスクを回避したい場合は、Azure OpenAI Service の [REST API レファレンス](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/reference)に準拠した HTTP リクエスト クライアントの実装をご検討ください。

## 特定のバージョンを指定してopenai-python ライブラリをインストールする方法

もし特定のバージョンを利用する必要が生じた場合には、以下のコマンドを実施することで特定のバージョンを指定してライブラリを使用することが可能です。  
例) v0.28.1 のバージョンを指定してインストールするコマンドは以下の通りです：

```
$ pip install openai==0.28.1
```

(参考: [https://docs.python.org/ja/3/installing/index.html#basic-usage](https://docs.python.org/ja/3/installing/index.html#basic-usage) )

## Azure 公式ドキュメントに記載のある openai-python ライブラリの取り扱いについて

Azure 公式ドキュメント内や Azure OpenAI Studio 内で、 openai-python ライブラリを使用したサンプルコードを提供しています。これらのコードは、 Azure OpenAI Service を Python のコードでよりシンプルに記載するための参考資料となっております。  
これらのサンプルコードは上記にてご案内させていただいております通り、弊社技術サポート対象としてご提供させていただいているわけではないこと、また、これらのコードはあくまで参考であり、それらがすべてのユースケースや状況で正確に動作することを保証するものではないことを前提に利用いただくようお願いします。

***
`変更履歴`  
`2023-10-19 created by Kudou`   

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  
