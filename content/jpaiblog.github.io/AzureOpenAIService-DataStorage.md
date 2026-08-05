---
title: Models sold by Azure in Microsoft Foundry のデータ保存について
date: 2026-08-04 00:00:00
categories:
- Azure OpenAI
- Microsoft Foundry
tags:
- Azure OpenAI
- Microsoft Foundry
---
この記事では、Models sold by Azure in Microsoft Foundry (Azure OpenAI Service を含む) の利用時に保存 (store) されるデータについて、公開ドキュメントの内容を補足して説明します。最新の正確な情報は公開ドキュメントを参照してください。

<!-- more -->
<br>

***
## はじめに

Models sold by Azure in Microsoft Foundry の利用に関連してクラウド サービス上で保存 (store) されるデータには以下の２つがあります。

- (1) サービス提供に必要な、利用者の操作や API 呼び出しに応じて保存されるお客様データ (Customer Data)
- (2) Abuse Monitoring を目的として保存されるデータ

参考ドキュメント: [Data, privacy, and security for Models sold by Azure in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy?tabs=azure-portal)

ここでの保存 (store) とは、処理途中に揮発性のメモリ上で一時的に保持されるデータではなく、永続的なストレージ領域への保存を指します。

<br>

***
## (1) お客様データ (Customer Data)

ユーザーはデータの保存を伴う機能を利用するかどうかを選択できます。また保存されたデータはユーザーによる操作 (API 呼び出し) で削除できます。

例えば Responses API の場合、既定ではレスポンス データが 30 日間保持されます。保存しない場合は、明示的に store=false を指定します。

- [Use the Azure OpenAI Responses API](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/responses?tabs=python)

```
Delete a response
By default, response data is retained for 30 days. Delete a stored response by ID.
```

<br>

***
## (2) Abuse Monitoring を目的としたデータ

Abuse Monitoring によって機械的な監視で不正 (Abuse) の可能性が検出された場合に、人間による詳細なレビューを行うためのものです。

- [Abuse monitoring](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/abuse-monitoring)


```
By default, if prompts and completions are flagged through content classification as harmful and/or identified to be part of a potentially abusive pattern of use, they might be sampled for review by using automated means including AI models such as LLMs instead of a human reviewer.
```

Abuse Monitoring 以外の目的 (例. モデルの品質改善) で使用されることはなく、また不要となったデータを永続的に保持することはありません。

- [Data, privacy, and security for Models sold by Azure in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy?tabs=azure-portal)

```
Human reviewers assessing potential abuse can access prompts and completions data only when that data has already been flagged by the abuse monitoring system, or when the prompts and completions are part of a potentially abusive pattern of use. The human reviewers are authorized Microsoft employees who access the data via point wise queries using request IDs, Secure Access Workstations (SAWs), and Just-In-Time (JIT) request approval granted by team managers.
```

Abuse Monitoring で保存されたデータ (プロンプトや生成されたコンテンツ) を、ユーザーが個別に削除するための API や申請手続きは提供されていません。

[Modified Abuse Monitoring の申請](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/limited-access) を行って承認を得ることで、Abuse Monitoring のためのデータ保存および人間によるレビューを停止することはできます。ただし、機械的な監視自体は継続するため、判定精度が低下し誤検知 (False Positive) が増える可能性があります。

- [Abuse monitoring](https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/abuse-monitoring)


```
When abuse monitoring is modified and human review isn't performed, detection of potential abuse may be less accurate. Customers are notified of potential abuse detection as described above, and should be prepared to respond to such notification to avoid service interruption if possible.
```

<br>

***
## (補足) Prompt Caching

Customer Data の保存 (store) とは別の仕組みとして、Azure OpenAI では生成処理を高速化しコストを下げるための Prompt Caching があります。

- [Prompt caching](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/prompt-caching)

Prompt Caching は、モデル内部の計算結果を再利用する仕組みであり、プロンプト本文をそのまま恒久的に保持するものではありません。キャッシュは一定時間で消去されます。

また、Prompt Caching を個別に無効化したり、明示的に削除したりする方法は用意されていません。

<br>

***
`変更履歴`
`2026/08/04 created by Nakagami`

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  
