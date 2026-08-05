---
title: Azure Machine Learning Studio (classic) のサービス終了について
date: 2021-08-25 00:00:00
categories:
- Azure Machine Learning Studio (classic)
tags:
- サービス終了
---
Azure Machine Learning Studio (classic) は、2024 年 8 月 31 日を持ちましてサービスを終了いたします。関連する公開情報や留意事項についてご紹介させていただきます。  

- [Machine Learning Studio (classic) will retire on 31 August 2024](https://azure.microsoft.com/en-us/updates/machine-learning-studio-classic-will-retire-on-31-august-2024/)  

<!-- more -->

***
## サービス終了までの段階的制限   

| 日時 | \| サービスの制限 |
| :---- | :---- |
| 2021 年 8 月 24 日以降 | \| 公開ドキュメント・不具合等の修正は基本的に対応不可 |
| 2021 年 12 月 1 日以降 | \| 新規リソースの作成不可 |
| 2024 年 8 月 31 日以降 | \| リソース使用不可 |

※ 影響の大きな不具合は修正される可能性があります。  

***
## 対象リソース

- Azure Machine Learning Studio (classic) workspaces
- Azure Machine Learning Studio (classic) Web services 
- Azure Machine Learning Studio (classic) Web service plans

※ Azure ポータルの言語設定が日本語の場合、"(classic)" が省略されております。  

***
## 移行方法

移行に関する手順は以下公開情報に纏められております。当該ドキュメントは今後更新される可能性がございますので、適宜ご参照ください。  

- [Migrate to Azure Machine Learning](https://docs.microsoft.com/en-us/azure/machine-learning/migrate-overview)

基本的に、Azure Machine Learning Studio (classic) で使用していた機能を、移行先サービス Azure Machine Learning Service で再作成する方針となります。ボタン一つでまとめて移行できるようなものではないため、期間的に十分な余裕をもって実行いただくことをお勧めいたします。  

>移行先のサービスとの比較に関する情報は下記公開情報に纏められております。  
>[ML Studio (classic) と Azure Machine Learning スタジオ](https://docs.microsoft.com/ja-jp/azure/machine-learning/overview-what-is-machine-learning-studio#ml-studio-classic-vs-azure-machine-learning-studio)  

***
## 留意事項

ワークスペースに関連付けされている Web service plans リソースを先に削除したり、そのほか予期しない操作によってリソースの削除が完全に行われず、課金が継続して発生してしまうといったお問い合わせが複数件報告されています。  

リソースを削除後、課金情報にリソース プロバイダー "Microsoft.MachineLearning" に関する料金が継続して累積されている場合には、以下記事の情報を参考にサポート リクエストを発行いただきますようお願いいたします。  

- [Azure Machine Learning Studio (Classic) ワークスペースを削除できない事象について](https://jpmlblog.github.io/blog/2020/06/09/AMLSC-cannot-delete/)


***
`変更履歴`  
`2021/08/25 created by Mochizuki`

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  