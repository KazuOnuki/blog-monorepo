---
title: Azure Machine Learning Studio で参照可能なデータの格納場所について
date: 2021-06-16 00:00:00
categories:
- Azure Machine Learning
tags:
- Blob コンテナー
- ファイル共有
---
Azure Machine Learning Studio で作成した実験用ノートブック ファイルやスクリプト、実験時のログ、アップロードしたファイルなどは、Azure Machine Learning ワークスペース既定のストレージ アカウントに格納されます。お問い合わせをいただくことが多い格納先について紹介します。  
<!-- more -->
<br>

***
## Notebooks メニューから参照可能なファイル
Azure Machine Learning Studio の [Notebooks] メニューより参照可能なファイルやフォルダーは、ワークスペースが既定で使用するストレージ アカウントの [ファイル共有] の `code-<GUID>/Users` 配下に格納されます。  

また、このファイル共有はコンピューティング インスタンスにログオンした時に、`/mnt/batch/tasks/shared/LS_root/mounts/clusters/{コンピューティング インスタンス名}/code` というパスに自動でマウントされます。    

- 例: Azure Machine Learning Studio の [Notebooks] メニューのフォルダー ツリー  
   
   <img src="https://jpmlblog.github.io/images/AML-data-location/AML-UI-notebooks.png" width=350px align="left"><br clear="left">  

- 例: ストレージ アカウントの [ファイル共有] `code-<GUID>/Users` 配下  
     
   <img src="https://jpmlblog.github.io/images/AML-data-location/AML-Fileshare-code.png" width=500px align="left"><br clear="left">  

- 例: コンピューティング インスタンスの `/mnt/batch/tasks/shared/LS_root/mounts/clusters/{コンピューティング インスタンス名}/code` 配下
   
   <img src="https://jpmlblog.github.io/images/AML-data-location/AML-UI-terminal.png" width=700px align="left"><br clear="left">

---
## 実験の成果物
Azure Machine Learning Studio の [実験] メニューより参照可能な成果物 (ログ ファイルやモデル ファイル等) は、ワークスペースが既定で使用するストレージ アカウントの [Blob コンテナー] の `azureml/ExperimentRun/dcid.<実行 ID>` 配下に格納されます。  

- 例: Azure Machine Learning Studio の [実験] メニューの [詳細] タブ  
   
   <img src="https://jpmlblog.github.io/images/AML-data-location/AML-UI-experiment-detail.png" width=500px align="left"><br clear="left">  

- 例: Azure Machine Learning Studio の [実験] メニューの [出力とログ] タブ  
   
   <img src="https://jpmlblog.github.io\images\AML-data-location\AML-UI-experiment-output.png" width=600px align="left"><br clear="left">  

- 例: ストレージ アカウントの [Blob コンテナー] `azureml/ExperimentRun/dcid.<実行 ID>` 配下  

   <img src="https://jpmlblog.github.io\images\AML-data-location\AML-Blob-experimentrun.png" width=600px align="left"><br clear="left">  

---

※ 適宜追加予定です。



***
`変更履歴`  
`2021/6/16 created by Mochizuki`

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  