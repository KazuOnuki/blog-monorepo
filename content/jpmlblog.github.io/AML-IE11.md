---
title: Azure Machine Learning ワークスペースの作成が Internet Explorer 11 で失敗する
date: 2020-08-31 09:00:00
categories:
- Azure Machine Learning
tags:
- Internet Explorer 11
---
Internet Explorer 11 (IE11) 利用時に発生する現象について紹介します。
<!-- more -->
<br>

***
## IE11 関連事例について
Azure ポータルで Azure Machine Learning ワークスペースの作成が失敗するといった報告が複数件寄せられております。この事象は、Azure ポータルを Internet Explorer 11 で開いてリソース作成を行った場合に発生することが確認できております。  

<div style="text-align: center;">
(再現時、下記表示のまま状態が遷移しません)
<img src="https://jpmlblog.github.io/images/AML-IE11/Create-workspace-error.png" width=600px>
</div>    

また、Azure Machine Learning ポータル (https://ml.azure.com/) の操作においても予期しないエラーが発生するといった報告もございます。これらの事象は、別のブラウザ (Microsoft Edge または Chrome) を使用することで回避できる可能性があります。  

Internet Explorer 11 は弊社サービスに限らず幅広い Web サービスで、順次サポート対象外になる予定です。恐れ入りますが、現段階で Microsoft Edge などへの移行をご検討ください。  
 
- [Microsoft 365 アプリの Internet Explorer 11 のサポート終了と Windows 10 での Microsoft Edge レガシー版のサービス終了](https://blogs.windows.com/japan/2020/08/18/microsoft-365-apps-say-farewell-to-internet-explorer-11/)

***
## その他のブラウザーの事例について
Mozilla Firefox を使用する環境において、ワークスペースのプライベート エンドポイントにアクセスしようとしたときに問題が発生するといった報告がございます。この問題は、Mozilla の DNS over HTTPS に関連している可能性があり、Microsoft Edge および Chrome のご利用をお勧めしております。  

- [Azure Machine Learning ワークスペース用に Azure Private Link を構成する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-configure-private-link?tabs=python)
   >Mozilla Firefox を使用している場合、ワークスペースのプライベート エンドポイントにアクセスしようとしたときに問題が発生することがあります。 この問題は、Mozilla の DNS over HTTPS に関連している可能性があります。 回避策として、Microsoft Edge または Google Chrome を使用することをお勧めします。

また、Microsoft Edge および Chrome のご利用環境においても、Azure Machine Learning ポータルの一部のメニューが表示されなかったり、機能の実行が失敗するなどといった事象が報告されています。こうした事象は古いバージョンのブラウザーを使用していることに起因している可能性があるため、原因の切り分けとして以下の切り分けの実施をご検討ください。  

- ブラウザーを最新バージョンにアップデートする

***
`変更履歴`  
`2020-08-31 created by Mochizuki`