---
title: Azure Functions を使用してパイプラインを定期的に実行する方法について
date: 2020-11-30 12:00:00
categories:
- Azure Machine Learning
tags:
- Azure Functions
---
Azure Functions のタイマー トリガーを使用して、Azure Machine Learning で発行されたパイプラインを定期的に実行する方法を紹介します。
<!-- more -->
<br>

***
Azure Machine Learning で発行されたパイプラインを定期的に実行する方法は、以下の 3 つが考えられます。
&emsp;A. [Azure Machine Learning SDK for Python を使用して機械学習パイプラインのスケジュールを設定する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-schedule-pipelines)
&emsp;B. [ロジック アプリから Machine Learning パイプラインの実行をトリガーする](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-trigger-published-pipeline)
&emsp;C. Azure Functions を使用してパイプラインを定期的に実行する

C については、詳細な手順を紹介する公開ドキュメントがないため、本記事では C 方法を紹介します。

(参考情報) 

- [Azure Machine Learning パイプラインとは](https://docs.microsoft.com/ja-jp/azure/machine-learning/concept-ml-pipelines)
- [パイプラインを発行する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-deploy-pipelines#publish-a-pipeline)
- [Azure でタイマーによってトリガーされる関数を作成する](https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-create-scheduled-function) 

***
## 事前準備
本記事では、Visual Studio Code を使用して Azure Functions へデプロイを行います。事前に以下を満たしているかご確認ください。  

- Azure Machine Learning [ワークスペース リソースの作成](https://docs.microsoft.com/ja-jp/azure/machine-learning/concept-workspace#create-a-workspace)
- Azure Machine Learning ワークスペース リソースへの[サービス プリンシパル認証設定](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-setup-authentication#service-principal-authentication)  
  (手順参考) 「[Authentication in Azure Machine Learning](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/manage-azureml-service/authentication-in-azureml/authentication-in-azureml.ipynb)」 の Service Principal Authentication セクション  
- Azure Machine Learning [ワークスペース リソースの作成](https://docs.microsoft.com/ja-jp/azure/machine-learning/concept-workspace#create-a-workspace)
- [Visual Studio Code](https://code.visualstudio.com/) のインストール
- [Azure Functions 拡張機能](https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-develop-vs-code?tabs=csharp#install-the-azure-functions-extension) のインストール

***
## 設定手順
### Azure Functions のリソースの作成
Azure ポータルより Function App リソースを作成します。設定項目は、後述の画像を参照ください。

(参考) [Azure Portal で初めての関数を作成する](https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-create-first-azure-function)  
(参考) [クイック スタート:Visual Studio Code を使用して Azure で関数を作成する](https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-create-first-function-vs-code?pivots=programming-language-python)  

- 「基本」情報を設定します。
&emsp;設定例:
&emsp;&emsp;リソース グループ：任意
&emsp;&emsp;関数アプリ名：任意
&emsp;&emsp;公開：コード
&emsp;&emsp;ランタイム スタック：Python
&emsp;&emsp;バージョン：3.8
&emsp;&emsp;地域：任意

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-resource-01.png" width=600px>  

- 「ホスティング」情報を設定します。
&emsp;設定例:
&emsp;&emsp;ストレージ アカウント：既定値
&emsp;&emsp;オペレーティング システム：Linux
&emsp;&emsp;プランの種類：既定値

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-resource-02.png" width=600px>  


### Azure Functions プロジェクトの作成  
Visual Studio Code を起動し、新しいプロジェクトを作成します。

- 「Create New Project」ボタンをクリックします。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-01.png" width=400px>

- 作業用のローカル フォルダーを選択します。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-02.png" width=700px>

- プログラミング言語を選択します。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-03.png" width=800px>

- 言語のバージョンを選択します。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-04.png" width=800px>

- 「Timer trigger」を選択します。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-05.png" width=800px>

- Function App の名前を付けます。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-06.png" width=800px>

- 実行間隔を表す NCRONTAB 式の値を入力します。後で変更可能なので既定のまま進めます。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-07.png" width=800px>

- 「Add to workspace」を選択します。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-08.png" width=800px>


### コード ファイルの編集

Azure Functions プロジェクトに含まれるコード ファイル (\_\_init__.py、function.json、requirements.txt) を編集します。  

- \_\_init__.py

  - ServicePrincipalAuthentication 関数の \<Tenant_Id>、\<Application_Id>、\<Client_Secret_Value> の設定は、下記サイトの [Service Principal Authentication] セクションを参照ください。  
    (参考サイト) [Authentication in Azure Machine Learning](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/manage-azureml-service/authentication-in-azureml/authentication-in-azureml.ipynb)
  - \<Subscription_Id>、\<ResourceGroup_Name>、\<Workspace_Name>、\<Pipeline_Id> は、使用する Azure Machine Learning ワークスペース リソースおよびパイプラインの情報を入力ください。\<Experiment_Name> はトリガーによって実行した場合の実験名になりますので、任意に指定下さい。

  ```python
  import datetime
  import logging

  import azure.functions as func

  from azureml.core.authentication import ServicePrincipalAuthentication
  from azureml.pipeline.core import PublishedPipeline
  from azureml.core import Workspace
  import requests

  SVC_PR_PWD = "<Client_Secret_Value>"

  def main(mytimer: func.TimerRequest) -> None:
      utc_timestamp = datetime.datetime.utcnow().replace(
          tzinfo=datetime.timezone.utc).isoformat()

      if mytimer.past_due:
          logging.info('The timer is past due!')

      logging.info('Python timer trigger function ran at %s', utc_timestamp)
      
      logging.info('Service Principal Authentication')
      svc_pr = ServicePrincipalAuthentication(
          tenant_id="<Tenant_Id>",
          service_principal_id="<Application_Id>",
          service_principal_password=SVC_PR_PWD)
    
      logging.info('Get Workspace')
      ws = Workspace(subscription_id="<Subscription_Id>",
                      resource_group="<ResourceGroup_Name>",
                      workspace_name="<Workspace_Name>",
                      auth=svc_pr)
      
      logging.info('Get Published Pipeline')
      pipeline = PublishedPipeline.get(ws, id='<Pipeline_Id>')
      
      logging.info('Run Published Pipeline')
      pipeline_run = pipeline.submit(ws, '<Experiment_Name>')

      logging.info('Waiting result')
      pipeline_run.wait_for_completion(show_output=True)
  ```

- function.json  
  shchedule 部分を編集することで実行時刻を変更可能です。指定方法は以下のサイトが参考になります。

  - (参考サイト) [NCRONTAB 式](https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-bindings-timer?tabs=python#ncrontab-expressions)
  - (参考サイト) [NCRONTAB の例](https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-bindings-timer?tabs=python#ncrontab-examples)
  - (参考サイト) [NCRONTAB タイム ゾーン](https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-bindings-timer?tabs=python#ncrontab-time-zones)

  なお、UTC 指定となりますので、JST で指定する場合には 9 時間を差し引いた時刻を指定ください。以下画像では、毎日 8:30:00 JST に実行する設定としています。  

  ```json
  {
    "scriptFile": "__init__.py",
    "bindings": [
      {
      "name": "mytimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 30 23 * * *"
      }
    ]
  }
  ```

- requirements.txt  
  azureml-core、azureml-pipeline-core、requests を追加します。  

  ```python
  # DO NOT include azure-functions-worker in this file
  # The Python Worker is managed by Azure Functions platform
  # Manually managing azure-functions-worker may cause unexpected issues

  azure-functions
  azureml-core
  azureml-pipeline-core
  requests
  ```

### プロジェクトのデプロイ

Visual Studio Code より、Azure Functions プロジェクトのデプロイを行います。デプロイ後にコード ファイルの再編集した場合でも、再度デプロイを実行することで変更を反映することが可能です。  

- Azure アイコンをクリックして、Function App を右クリックして、「Deploy to Function App...」を選択します。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-11.png" width=400px>

- サブスクリプションを選択します。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-12.png" width=800px>

- デプロイ先の Function App リソースを選択します。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-13.png" width=800px>

- 「Deploy」ボタンをクリックします。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-14.png" width=600px>

- デプロイが完了したら、画面右下に下記のメッセージが表示されます。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-15.png" width=600px>

<br>

***
## 動作確認
Azure ポータルより、作成したタイマー トリガーが存在し、有効になっていることを確認します。  

- Function App の動作を確認します。デプロイ先の Function App リソースに移動して、「関数」ボタンをクリックします。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-16.png" width=200px>

- 作成した Function の名前をクリックします。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-17.png" width=600px>

- 「モニター」ボタンをクリックして、呼び出しのトレースを確認できます。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-18.png" width=600px>

- 上記の「日付」項目をクリックしますと、ログを確認できます。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-19.png" width=600px>

- Machine Learning リソースの実験画面で、Function App の Timer Trigger にトリガーされたパイプラインの実行を確認できます。

  <img src="https://jpmlblog.github.io/images/AML-scheduled-pipeline/create-function-project-20.png" width=600px>

<br>

Azure Functions を使用してパイプラインを定期的に実行する手順は以上となります。

***
`変更履歴`  
`2020/11/30 created by Chao`  
`2021/11/30 modified by Mochizuki`  

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  