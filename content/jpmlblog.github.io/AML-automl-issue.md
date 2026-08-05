---
title: parquet ファイル形式のデータ アセットを使用した場合に発生する既知の問題について 
date: 2023-04-13 00:00:00
categories:
- Azure Machine Learning
tags:
- AutoML
---

Azure Machine Learning の AutoML ジョブにおいて、parquet ファイル形式のデータ アセットを使用した場合に発生する問題についてご紹介させていただきます。

※ 2023/4/13 時点の状態となります。以降のアップデートに依って修正される可能性がある点についてご留意ください。

<!-- more -->
<br>

***
## 既知の問題の概要

Azure Machine Learning Studio から AutoML ジョブを作成する際に、parquet ファイルを使用したデータ アセットを選択した場合に [タスクと設定の選択] における [特徴量化の表示] 画面において表示されるカラムがデータ アセットのものではなく、作成に使用した parquet ファイルにおけるすべてのカラム表示されてしまう問題が確認されています。  
<br>

## 問題の詳細

問題の詳細について具体的な例を挙げてご紹介します (※ 使用するデータは Scikit Learn Toy Datasets の 1 つである [Diabetes dataset](https://scikit-learn.org/stable/datasets/toy_dataset.html#diabetes-dataset
) を使用しています)。 Azure Machine Learning Studio の [自動 ML] より画面にしたがって、自動 ML ジョブの作成を進めていきます。以下の例では、S4, S5, S6 および Y の 4 つのカラムを選択してデータ アセットを作成しています。  

// parquet ファイルからカラムを選択してデータ アセットを作成
<img src="https://jpmlblog.github.io/images/AML-automl-issue/azureml-parquet.png" width=500px align="left" border="1"><br clear="left"><br>

preview を確認すると、作成時に選択した 4 つのカラム (S4, S5, S6 および Y) でデータ アセットが作成されていることが確認できます。  

// parquet ファイルから作成したデータ アセットのプレビュー
<img src="https://jpmlblog.github.io/images/AML-automl-issue/azureml-parquet-preview.png" width=500px align="left" border="1"><br clear="left"><br>

AutoML ジョブの設定を進めていくと [タスクと設定の選択] の [特徴量化の表示] を開くと、データ アセット作成時に選択したカラム (S4, S5, S6 および Y) 以外のカラムも表示されることが確認できます (parquet ファイルのすべてのカラムが表示されています)。 こちらが本記事にてご紹介している不具合となります。  

// AutoML ジョブの [特徴量化の表示] の設定画面
<img src="https://jpmlblog.github.io/images/AML-automl-issue/azureml-parquet-featurization.png" width=500px align="left" border="1"><br clear="left"><br>

なお、csv ファイルを使用して同様な操作により作成したデータ アセットを使用した場合には、データ アセットのカラムのみ (S4, S5, S6 および Y) が表示されています。

// csv ファイルから作成したデータ アセットによる [特徴量化の表示] の設定画面
<img src="https://jpmlblog.github.io/images/AML-automl-issue/azureml-csv-featurization.png" width=500px align="left" border="1"><br clear="left">
<br>

## 対応状況

現在、本事象は Azure Machine Learning の修正予定の項目となっております。 しかしながら、現時点ではトレーニング自体は実施可能であるため、ご利用いただく際の運用によって対応していただく必要があります。  

また、本事象を原因としてお客様のビジネス インパクトが多大なものである場合には、技術サポート チームより製品開発部門に対して、本機能の開発優先度をあげるようプッシュさせていただくことも可能です。 その際には具体的な損失金額や影響を受けるユーザー数等の情報をご記載いただいたうえで、サポート リクエスト発行いただきご相談ください。  

Azure サポート リクエストは下記サイトの情報を参考に発行いただけます。 一般的に、[Azure portal](https://portal.azure.com/) の [ヘルプとサポート] から [新しいサポート リクエスト] を作成頂くことをお勧めいたします。

- [Azure サポート要求を作成する](https://docs.microsoft.com/ja-jp/azure/azure-portal/supportability/how-to-create-azure-support-request)  

<br>

***
`変更履歴`  
`2023/04/** created by Narita`

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。 
