---
title: 自動機械学習 (AutoML) の同時実行数制限について
date: 2020-04-06 12:00:00
categories:
- Azure Machine Learning
tags:
- Automated Machine Learning
---
[Microsoft Azure Machine Learning ポータル](https://ml.azure.com/) より Automated Machine Learninig (以降、AutoML と記載) を複数同時実行する際の制限事項について紹介します。  
<!-- more -->
<br>

***
AutoML の実行にはワークスペース単位で同時実行できる数に制限が存在します。明確に同時実行が可能な数が設定されているものではなく、AutoML の実行に関連するリソースへの負荷が一定値を上回った場合に実行が制限される動作となります。サービス側内部構造上、主にリソース間のコミュニケーションを中継するネットワーク リソースに負荷が集中する仕組みとなっています。

以下図はトレーニング実行時のデータ フローの例です。Training Compute はサイズ変更が可能ですが、それ以外のデータを処理するリソース (通信経路上のネットワーク リソース等) の処理能力をスケール アップすることができないため、負荷が高まることで応答が遅延またはエラーが返され、処理がストップする場合があります。 

![トレーニング時のデータフロー例](https://docs.microsoft.com/ja-jp/azure/machine-learning/media/concept-enterprise-security/training-and-metrics.png)

現在、リソース間の不要なポーリング等を減らして同時実行数の向上を計るなど対応を検討しています。将来的に 100 程度の同時実行が許容できる見込みです。推奨としては、1 ワークスペース 50 の同時実行を目安に運用をご検討ください。  

> 注意  
データセンター側の物理的なリソース不足に起因して同時実行が失敗する場合もあります。タイミングによっては許容される同時実行数が少なくなる場合があることをご留意ください。

***
`変更履歴`  
`2020/04/06 created by Mochizuki`  