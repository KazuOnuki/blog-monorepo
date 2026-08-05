---
title: Azure Machine Learning Studio (Classic) ワークスペースを削除できない事象について
date: 2020-06-09 12:00:00
categories:
- Azure Machine Learning Studio (Classic)
tags:
- リソース削除
---
Azure Machine Learning Studio (Classic) のワークスペース削除後も、課金が継続していたり、ポータルからワークスペースにアクセスできてしまう場合の対処方法をご紹介します。  
<!-- more -->
<br>

***
Azure ポータルから対象のリソースを削除した後、そのリソースで継続して課金が発生しているといったお問い合わせを頂くことがございます。この現象は、リソースの削除時の操作や Azure サービス側の不具合等に起因して発生いたします。  

Azure Machine Learning Studio (Classic) ワークスペース リソースにおいても、稀にこの現象が発生することが確認できています。例えば、削除したはずのワークスペースの課金が継続していたり、削除したワークスペースへのアクセスができてしまうといった現象が報告されています。  

現在、 Machine Learning Studio (Classic) については Azure ポータルからのリソース削除で、課金を含むワークスペースの情報が完全に削除されるようシステムの改修を検討中です。一方で上記のような事象が実際に発生した場合の対処としては、該当リソースの手動削除を弊社開発部門にリクエストする必要がありますので、以下の手順で情報を採取して弊社サポート窓口までお問い合わせください。

- (1) 課金が発生しているワークスペース ID / リソース ID を確認  
- (2) リソース削除を希望するサポート リクエストを発行

それぞれ具体的な手順を後述にご紹介します。  
***
<div style="text-align: left;">

### (1) ワークスペース ID / リソース ID の確認手順

課金対象になっているリソースの特定には、ワークスペース ID またはリソース ID が必要になります。どちらか一方の情報にて問題ございません。それぞれ確認方法は下記を参照ください。

- ワークスペース ID の確認方法

   「[Azure Machine Learning Studio (Classic) ワークスペース](https://studio.azureml.net/Home)」 にアクセスし、[Settings] メニューよりワークスペース ID を確認します。  

   ![workspace-id.png](https://jpmlblog.github.io/images/AMLSC-cannot-delete/workspace-id.png)  

- リソース ID の確認方法

   「[Azure の請求書と毎日の使用状況データをダウンロードまたは表示する](https://docs.microsoft.com/ja-jp/azure/cost-management-billing/manage/download-azure-invoice-daily-usage-date)」 サイトの 「Azure 請求書 (.pdf) のダウンロード」 セクションの 4. の手順より csv ファイルをダウンロードし、ResourceId (ResourceId) の項目を確認します。  

   ![download-invoice.png](https://jpmlblog.github.io/images/AMLSC-cannot-delete/download-invoice.png)  

   CSV ファイルの以下の列を確認ください。  

   ![download-invoice-csv.png](https://jpmlblog.github.io/images/AMLSC-cannot-delete/download-invoice-csv.png)  

***

### (2) リソース削除を希望するサポート リクエストを発行

「[Azure サポート要求を作成する方法](https://docs.microsoft.com/ja-jp/azure/azure-portal/supportability/how-to-create-azure-support-request)」 サイトを参考にサポート リクエストを発行します。具体的な設定項目は下記を参照ください。これら以外はサポート リクエストの指示に従いご入力ください。

- [基本] タブの設定

   問題の種類やサービス、リソースなどはこちらを参考に設定します。  

   ![support-request.png](https://jpmlblog.github.io/images/AMLSC-cannot-delete/support-request.png)  
   ※ Azure ポータルの言語設定を English にしている場合には、サービスは [Machine Learning Studio] を選択ください。

- [詳細] タブの設定

   [詳細] タブの [* 詳細] 欄に、確認したワークスペース ID またはリソース ID を記載します。  

   ![support-request-detail.png](https://jpmlblog.github.io/images/AMLSC-cannot-delete/support-request-detail.png)  
<br>

</div>

上記内容が問題解消に向けた手助けとなりましたら幸いです。  

***
`変更履歴`  
`2020/06/09 created by Mochizuki` 