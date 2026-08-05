---
title: メトリック エクスプローラーを用いてAzure OpenAI の トークン使用量を確認する方法 
date: 2024-07-25 00:00:00
categories:
- Azure OpenAI
tags:
- Azure OpenAI
---
この記事はAzure Portal 上で使用できるメトリック エクスプローラーを用いて、トークン使用量の推移をグラフで表示させる方法についてご紹介します。
<!-- more -->
<br>

***
# メトリックについて

メトリックとは、Azure 上で特定のリソースに紐づいて集計された測定値のことを指します。
Azure OpenAI リソースで集計されるメトリックには、リソースのパフォーマンスや使用状況を評価するための指標が含まれます。

具体的には、Azure OpenAI リソースに関する、HTTP 要求数、入出力で処理されたトークン数、微調整モデルで処理されたトレーニング時間数などが含まれます。
このように、メトリックを確認することで現在までのトークンの使用量を簡単に確認することできるため、トークン数の消費が多い時間帯の可視化が可能になります。

# メトリックを通じて Azure OpenAI モデルで処理された入出力トークン数を確認する方法
Azure Portal 上で該当するメトリックを確認する手順についてご紹介します。
まず、以下の画像のようにAzure Portal のホーム画面から、対象の Azure OpenAI のリソースを開きます。


<img src="https://jpaiblog.github.io/images/AzureOpenAIService-Metric-TPM/step1.png" width=1200px>  


次に、以下の画像のように、上でアクセスしたAzure OpenAIリソース画面の左側のタブから「メトリック」を選択します。
選択しますと、ページ上にメトリック エクスプローラーを開くことが出来ます。
この時メトリック エクスプローラーを操作し、「スコープ」に Azure OpenAI リソース名、「メトリック名前空間」に「コグニティブ サービス 標準的なメトリック」が表示されているかを確認します。

ここでは、Azure OpenAI モデルで処理された入出力トークンの数「Processed Inference Tokens」を示すことを考えてみます。


<img src="https://jpaiblog.github.io/images/AzureOpenAIService-Metric-TPM/step2.png" width=1200px>  


公式ドキュメント[Azure OpenAI Service の監視](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/monitoring#azure-openai-metrics ) より「Azure OpenAIのメトリック」を参照することで、Azure Portalで確認できる「メトリック」と「集計」の情報を確認することができます。

以下は公式ドキュメントの一部を抜粋したものですが、今回該当するメトリックは、入力と出力の合計のトークンであることから「メトリック」の列を見ると「Processed Inference Tokens」であることがわかります。
また、その集計方法については、「集計」の列を見ると「SUM」(合計)であることがわかります。
そのため、「メトリック」に 「Processed Inference Tokens」、「集計」に 「合計」をプルダウンから選択することでトークンの使用量を確認することが可能です。　


<img src="https://jpaiblog.github.io/images/AzureOpenAIService-Metric-TPM/metricscreenshot.png" width=1200px>  


上記の画像の通り、メトリックに「Processed Inference Tokens」、集計に「合計」を入力した結果、以下のようにトークンの使用量を確認することができました。

また、画面右上(赤枠部)より時刻表示の調整が可能になります。
デフォルトでの表示以外のスケール(過去7日間や過去30日間など)で時刻の表示をすることができます。

<img src="https://jpaiblog.github.io/images/AzureOpenAIService-Metric-TPM/step3.png" width=1200px>  

ここで、次の画像のように、時間の粒度を「1 分」と選択することで、1 分あたりの入出力トークンの合計を算出することが出来ます。
先ほどの「集計」で「合計」を選択したため、1 分あたりのトークン数の合計値が、グラフに描画されています。

<img src="https://jpaiblog.github.io/images/AzureOpenAIService-Metric-TPM/step4.png" width=600px>

以上の手順で、メトリック　エクスプローラーで 1 分あたりの入出力トークン数をグラフに描画することができました。

# 関連ドキュメント

- [Azure OpenAI Service とは - Azure AI services | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/overview)
- [Azure OpenAI Service のクォータを管理する - Azure AI services | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/quota?tabs=rest)
-[Azure OpenAI Service のクォータと制限 - Azure AI services | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/quotas-limits)
- [Azure リソースのメトリックを分析する - Azure Monitor | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/azure-monitor/essentials/tutorial-metrics)
- [Azure OpenAI Service の監視 - Azure AI services | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/monitoring#azure-openai-metrics)
- [Azure Monitor メトリックによる集計と表示の説明 - Azure Monitor | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/azure-monitor/essentials/metrics-aggregation-explained)


***
`変更履歴`  
`2024/07/25 created by naokatayama`  

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  
