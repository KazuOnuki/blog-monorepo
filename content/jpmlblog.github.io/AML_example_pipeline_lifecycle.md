---
title: Azure Machine Learning パイプラインを使用した自動機械学習ライフサイクルの例
date: 2021-10-21 00:00:00
categories:
- Azure Machine Learning
tags:
- パイプライン
- ライフサイクル
---
Azure Machine Learning のライフサイクルを実現する Azure Machine Learning パイプラインの利用例について紹介させていただきます。今回紹介するライフサイクルは次の通りです。  

- ストレージ アカウント上の csv ファイル読み込み  
- 自動機械学習を実行
- ベスト モデルを選択して ACI にデプロイ

<!-- more -->
<br>

***
## イメージ

// ライフサイクルは以下のようなイメージです。これを参考に後述の手順をご確認ください。  
<img src="https://jpmlblog.github.io/images/AML_example_pipeline_lifecycle/lifecycle-image.png" width=900px align="left" border="1"><br clear="left">  

## パイプラインの作成

以下の図のように、データセットを入力として自動機械学習を実行し、作成されたモデルを登録、ACI Web エンドポイントを作成または更新するパイプラインを作成します。パイプラインの作成は、ノートブック ファイルの実行により行います。実行するノートブック ファイルと、使用するデータを以下リンクからダウンロードください。  

- [aml-pipeline-sample_1.ipynb](https://jpmlblog.github.io/files/AML_example_pipeline_lifecycle/aml-pipeline-sample_1.ipynb "aml-pipeline-sample_1.ipynb")  
- [machineData.csv](https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/machineData.csv "machineData.csv")  

// 上記ファイルを使って以下のような処理を行うパイプラインを作成します。
<img src="https://jpmlblog.github.io/images/AML_example_pipeline_lifecycle/pipeline-image.png" width=700px align="left" border="1"><br clear="left">  

### データの配置

ダウンロードした machineData.csv ファイルを、Azure Machine Learning ワークスペースの既定のストレージ アカウントのコンテナー `azureml-blobstore-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (xxx 部分はランダムな英数字)` 配下に `Datasets` フォルダーを作成し、アップロードしておきます。  

<img src="https://jpmlblog.github.io/images/AML_example_pipeline_lifecycle/azureml-blobstore-container.png" width=700px align="left" border="1"><br clear="left">  

### ノートブックの実行

aml-pipeline-sample_1.ipynb ファイルは、以下の通り Azure Machine Learning Studio の Notebooks のフォルダーにアップロードし、`[カーネルを再起動し、すべてのセルを実行する]` をクリックします。(実行時に cpu-cluster という名前の STANDARD_DS12_V2 のコンピューティング クラスターが作成されます。既に存在する場合はそのコンピューティング クラスターを使用します。)

<img src="https://jpmlblog.github.io/images/AML_example_pipeline_lifecycle/azureml-studio-notebook.png" width=700px align="left" border="1"><br clear="left">  

### パイプラインの公開

実行が終了すると、以下の通りエンドポイントとパイプラインが作成されるため、正常に実行が終了していることを確認して `[公開]` ボタンをクリックし、任意の名前で実行します。実行後、パイプライン エンドポイントが作成されます。(サンプル では pipeline_with_automlstep という名前になります。)  

// 自動機械学習によって作成されたモデルをデプロイしたリアルタイム エンドポイント
<img src="https://jpmlblog.github.io/images/AML_example_pipeline_lifecycle/azureml-studio-endpoint.png" width=600px align="left" border="1"><br clear="left">  

// ノートブックで定義したパイプラインの実行結果 (この画面で [公開] ボタンを押す)
<img src="https://jpmlblog.github.io/images/AML_example_pipeline_lifecycle/azureml-studio-pipeline.png" width=600px align="left" border="1"><br clear="left">  

// 外部から呼び出せるように公開されたパイプラインのエンドポイント
<img src="https://jpmlblog.github.io/images/AML_example_pipeline_lifecycle/azureml-studio-published-pipeline.png" width=600px align="left" border="1"><br clear="left">  

***
## パイプラインの使用

公開したパイプライン エンドポイントの REST エンドポイントに対し、POST メソッドで要求を送信するとパイプラインを実行されます。これにより、`azureml-blobstore-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (xxx 部分はランダムな英数字) / Datasets` フォルダー配下の machineData.csv ファイルを新しいファイルに変更してパイプラインを実行するだけで、新しいファイルを使用した自動機械学習、モデルの登録、ACI エンドポイントの作成を簡単に行うことが可能になります。  

// REST エンドポイントは、公開されたパイプラインの概要ページより確認できます。
<img src="https://jpmlblog.github.io/images/AML_example_pipeline_lifecycle/azureml-studio-published-pipeline-REST.png" width=850px align="left" border="1"><br clear="left">  

REST エンドポイントへの要求送信方法は多種ありますが、後述に Python および PowherShell を使用した実行方法を紹介させていただきます。  

### Python での実行

下記コードの <公開したパイプラインの REST エンドポイント> を上述の REST エンドポイント URL に置き換えて　Notebook 上から実行するだけで、パイプラインをトリガーすることが可能です。  

json 形式で実験名やパイプライン パラメーターを引数として渡すことが可能です。ただし、primary_metric は作りこみは不十分なので、変更する際には aml-pipeline-sample_1.ipynb ファイル側のロジックも含めて変更をご検討ください。  

- ExperimentName: 実験の名前
- model_name: 登録されるモデルの名前
- primary_metric: 自動機械学習のプライマリ メトリック
- aciservice_name: ACI エンドポイントの名前

```Python
from azureml.core.authentication import InteractiveLoginAuthentication
import requests

auth = InteractiveLoginAuthentication()
aad_token = auth.get_authentication_header()

response = requests.post("<公開したパイプラインの REST エンドポイント>",
                         headers=aad_token,
                         json={"ExperimentName": "pipeline-cycle-test",
                               "ParameterAssignments": 
                               {"model_name": "automlmodel",
                               "primary_metric": "r2_score",
                               "aciservice_name": "aciservice"}})
```

### PowerShell での実行

下記コマンドの <公開したパイプラインの REST エンドポイント> を上述の REST エンドポイント URL に置き換えて PowerShell コマンド プロンプト上で実行するだけで、パイプラインをトリガーすることが可能です。  

$postText で実験名やパイプライン パラメーターを引数として渡すことが可能です。Python での実行と同じように primary_metric を変更する際には aml-pipeline-sample_1.ipynb ファイル側のロジックも含めて変更をご検討ください。  

- ExperimentName: 実験の名前
- model_name: 登録されるモデルの名前
- primary_metric: 自動機械学習のプライマリ メトリック
- aciservice_name: ACI エンドポイントの名前

```PowerShell
az login

$aad_token = az account get-access-token
$convert_token = $aad_token | ConvertFrom-Json
$parsed_token = "Bearer "+$convert_token.accessToken

$requestUri = "<公開したパイプラインの REST エンドポイント>"
 
$requestHeader = @{
  'Content-type'='application/json'
  'authorization' = $parsed_token
}
 
$postText =  "{""ExperimentName"": ""pipeline-cycle-test"",""ParameterAssignments"": {""model_name"": ""automlmldel"", ""primary_metric"": ""r2_score"", ""aciservice_name"": ""aciservice""}}"

$postBody = [Text.Encoding]::UTF8.GetBytes($postText)

Invoke-RestMethod -Method POST -Uri $requestUri -Headers $requestHeader -Body $postBody
```

サービス プリンシパルを使用すると、ワークスペースに対してアクセス権のないユーザーでもパイプラインを実行できるようになります。まず、下記サイトの手順に従いアプリケーションの登録を行い、ワークスペース リソースに "共同作成者 (Contributor)" ロールを付与します。  
 
- [Authentication in Azure Machine Learning](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/manage-azureml-service/authentication-in-azureml/authentication-in-azureml.ipynb) ※ Service Principal Authentication セクションを参照ください。

上述のコマンドのうち 1 行目を以下の通り変更して実行ください。  

```PowerSHell
az login --service-principal -u "<アプリケーション (クライアント) ID>" -p "<クライアント シークレット>" --tenant "<ディレクトリ (テナント) ID>"
```


***
`変更履歴`  
`2021/10/21 created by Mochizuki`  
`2021/11/19 modified by Mochizuki`

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  