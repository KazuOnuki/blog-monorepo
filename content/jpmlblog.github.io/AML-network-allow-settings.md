---
title: Azure Machine Learning サービス宛の通信を許可する設定について
date: 2020-10-10 12:00:00
categories:
- Azure Machine Learning
tags:
- ファイアウォール
- プロキシ
---
オンプレミスの環境から Azure Machine Learning のサービスを利用する際、外部ネットワーク宛の通信をファイアウォールやプロキシ サーバー等によって制御している場合に、許可すべきホスト名等の情報をご紹介します。  

<!-- more -->
<br>

***
## ホスト名ベースの許可
Azure Machine Learning で使用する通信先ホスト名の一覧は以下サイトに一覧化されております。これらのホスト名宛の送信方向の通信を許可するよう設定ください。(2022/1/13 時点)  

- [ネットワークの着信トラフィックおよび送信トラフィックを構成する - # Microsoft のホスト](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-access-azureml-behind-firewall#microsoft-hosts)
 
  ※ \<storage\> を、使用している Azure Machine Learning ワークスペースの既定のストレージ アカウント名に置き換えてください。
  
Python パッケージをインストールして使用する要件がある場合、下記のようなホスト名宛の通信を許可する必要があります。なお、下記はインターネット上のすべての Python リソースに必要なホストの完全な一覧ではなく、最も一般的に使用されているもののみを取り上げています。たとえば、GitHub リポジトリまたはその他のホストにアクセスする必要がある場合は、そのシナリオに必要なホストを特定して追加する必要があることをご留意ください。  

- [ネットワークの着信トラフィックおよび送信トラフィックを構成する - # Python のホスト](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-access-azureml-behind-firewall#python-hosts)

R パッケージをインストールして使用する要件がある場合、下記のようなホスト名宛の通信を許可する必要があります。こちらも、必要なホストの完全な一覧ではない点についてご留意ください。  

- [ネットワークの着信トラフィックおよび送信トラフィックを構成する - # R のホスト](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-access-azureml-behind-firewall#r-hosts)

***
## WebSocket の考慮
ネットワーク機器などで WebSocket の通信をブロックしている場合、上述したホスト名一覧について許可いただくことをお勧めいたします。  
以下のホスト名について WebSocket の通信を許可するよう設定ください。  

~~*.azureml.ms~~ (2021/6/17 削除)  
~~*.notebooks.azure.net~~ (2021/6/17 削除)  
~~*.experiments.azureml.net~~  (2022/1/13 削除)  
*.instances.azureml.net  
*.instances.azureml.ms  

今後サービス側機能の変更によって別のホスト名で WebSocket 通信を必須とする場合がございますので、その際には適宜許可を追加頂くことをご検討ください。

- [(参考情報) コンピューティング クラスターとインスタンス](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-secure-training-vnet#compute-clusters--instances)  
  >コンピューティング インスタンスの Jupyter 機能を動作させるには、Web ソケット通信が無効になっていないことを確認してください。 お使いのネットワークで、*.instances.azureml.net と *.instances.azureml.ms への websocket 接続が許可されていることを確認してください。

***
## IP アドレスの範囲指定で許可する場合
下記サイトに紹介されている IP アドレス一覧を使用して許可する方法につきましては、以下サイトの機能をご利用いただける可能性がございます。実装方法などの確認が必要な場合、 Azure Network 観点にてお問い合わせください。  

- [オンプレミスのサービス タグ](https://docs.microsoft.com/ja-jp/azure/virtual-network/service-tags-overview#service-tags-on-premises)


***
`変更履歴`  
`2020/10/10 created by Mochizuki`  
`2021/06/17 modified by Mochizuki`  
`2021/07/13 modified by Mochizuki`  
`2022/01/13 modified by Uehara`  
`2022/08/02 modified by Mochizuki`  

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  
