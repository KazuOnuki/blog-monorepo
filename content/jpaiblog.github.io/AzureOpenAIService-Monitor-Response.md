---
title: Azure OpenAI Service のレスポンスを確認する方法
date: 2025-05-01 00:00:00
categories:
- Azure OpenAI
tags:
- Azure OpenAI
---
この記事では、Azure OpenAI Service のレスポンスを Azure サービス側で確認する方法をご紹介します。

<!-- more -->
<br>

***
## Azure OpenAI Service の API レスポンスについて

Azure OpenAI Service では状況によって成功 (HTTP ステータスコード 2xx) 以外の応答が返る場合があります (具体的な例については[別のブログ記事](https://jpaiblog.github.io/blog/2023/12/29/AzureOpenAIService-error-codes/)にまとまっています)。
<br/>
その原因を調査するには、具体的にどのような応答が返っているのかを確認する必要がありますが、これは API を呼び出すクライアント (アプリケーション) 側で記録することが一般的です。
<br/>
もし呼び出し元で確認することが難しい場合は、レスポンス コードや API の種類など、限られた情報であれば Azure サービス側に組み込まれた機能で確認することができます。

## 方法 1. Azure Monitor のメトリックを使用する

Azure OpenAI Service で利用できる [Azure Monitor のメトリック](https://learn.microsoft.com/ja-jp/azure/azure-monitor/metrics/data-platform-metrics) `Azure OpenAI Requests` には、ディメンション (Dimension) として HTTP ステータスコードを表す `StatusCode` や、デプロイ名を表す `ModelDeploymentName` などが用意されています。
<br/>
これらを使用して[メトリックを分割・フィルター](https://learn.microsoft.com/ja-jp/azure/azure-monitor/metrics/analyze-metrics#use-dimension-filters-and-splitting)することにより、API 呼び出しの種類やデプロイ名、ステータス コードなどを確認することができます。

**Azure ポータルでの表示例:**

<img src="https://jpaiblog.github.io/images/AzureOpenAIService-Monitor-Response/AOAI-Metrics.png" width=800px>

<br/>

[メトリックの保持期間](https://learn.microsoft.com/ja-jp/azure/azure-monitor/metrics/analyze-metrics#configure-the-time-range)を超えない範囲であれば、過去のメトリックを参照するために事前の設定は必要ありません。

参考ドキュメント:
- [Azure OpenAI を監視する](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/monitor-openai)
- [Azure OpenAI monitoring data reference](https://learn.microsoft.com/en-us/azure/ai-services/openai/monitor-openai-reference#category-azure-openai---http-requests)

***

## 方法 2. 診断ログ (Diagnostic Log) を使用する

Azure OpenAI Service では、他の Azure AI services と同様に、API 呼び出し毎にステータスコードなどの記録を行う[診断ログ](https://learn.microsoft.com/ja-jp/azure/ai-services/diagnostic-logging)がサポートされています。 **事前に** Log Analaytics などへログを出力する設定を行うことで、API 呼び出しの種類やレスポンス コードなどを確認することができます。

**Azure ポータル (Log Analytics) での表示例:**
<img src="https://jpaiblog.github.io/images/AzureOpenAIService-Monitor-Response/AOAI-DiagLog.png" width=800px>

<br/>

Azure OpenAI Service のデータ プレーン API 呼び出しの記録は `RequestResponse` のカテゴリー (Category) で記録されます。また  代表的なプロパティは以下の通りです。

<br/>

| プロパティ名 | 説明 |
| --- | --- |
| OperationName | API の種類 (例. Chat Completions)。 |
| CallerIPAddress | 呼び出し元の IP アドレス。<br/> 注: IPv4 アドレスの最終オクテットはマスクされます。これを解除する方法はありません。またサービス エンドポイントなど仮想ネットワーク経由でアクセスした場合、Azure 内部で使われる IPv6 アドレスが記録される場合があります。 |
| ResultSignature | HTTP ステータスコード (例. 200 / 429 など)。 |
| CorrelationId | API 呼び出しの識別子。<br/> Azure サポートへお問い合わせいただく際にはこの ID を含めていただくと API 呼び出しの特定が迅速に行えるようになります。 |
| properties_s.apiName | API バージョン (例. 2025-01-01-preview)。 |
| properties_s.modelDeploymentName | デプロイ名。 |
| properties_s.modelName | モデル名 (例. gpt-4o)。 |
| properties_s.modelVersion | モデル バージョン (例. 2024-11-20)。 |

参考ドキュメント:
- [Azure OpenAI Service REST API reference](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference)

## ご留意点
診断ログについては、API 呼び出しから Log Analytics へ記録されるまでに 10 分以上の時間を要する場合があります。
<br/>
また、いずれの方法でも、HTTP リクエストやレスポンスの詳細、例えばリクエスト本文 (例. プロンプトの内容) や応答本文 (例. 生成されたテキストやエラーメッセージ)、ヘッダーなどは確認できません。これらの情報は呼び出し元のアプリケーションで記録する必要があります。顧客データ取り扱いの観点から、Azure サポートにお問い合わせいただいても、エンジニアはこれらの詳細を確認することはできません。

<br/>

***
`変更履歴`   
`2025-05-01 created by Nakagami`   

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  
