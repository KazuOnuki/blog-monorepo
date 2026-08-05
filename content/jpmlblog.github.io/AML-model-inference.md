---
title: Azure Machine Learning で作成したモデルの推論を実行する方法について
date: 2021-01-13 12:00:00
categories:
- Azure Machine Learning
tags:
- モデル デプロイ
- 推論
---
本記事では、Azure Machne Learning で作成したモデルを SDK を使用して推論実行する方法を紹介します。  
試験的に作成したモデルの評価を行う場合には、都度 Web サービスにデプロイする方法は効率的ではないため、ローカルにロードして推論実行する手順を紹介します。また、Web サービスにデプロイして推論を実行する方法についても併せて紹介します。  
<!-- more -->
<br>

***
## ローカルにモデルをロードして評価を行う場合
実験によって作成されたモデルのテストを行う場合、ローカル環境にロードして実行する方法をお勧めいたします。以下に、自動機械学習のチュートリアルの実行によって作成されたモデルを例にご紹介いたします。  

- [チュートリアル:Azure Machine Learning の自動 ML で分類モデルを作成する](https://docs.microsoft.com/ja-jp/azure/machine-learning/tutorial-first-experiment-automated-ml)  

自動機械学習では、複数のアルゴリズムと前処理の組み合わせを試し、それぞれの実行でモデルを作成します。上記チュートリアルのとおりに実行すると、「my-1st-automl-experiment」 という名前の実験の中で、複数のモデルが作成されます。このうちひとつのモデルをローカルにロードして、推論実行する方法を紹介します。  

モデルは、VotingEnsemble を選択します。  

<img src="https://jpmlblog.github.io/images/AML-model-inference/AML-algorithm-list.png" width=800px align="left" border="1"><br clear="left">  

「詳細」 タブより実行 ID を確認します。  

<img src="https://jpmlblog.github.io/images/AML-model-inference/AML-algorithm-details.png" width=500px align="left" border="1"><br clear="left">  

Notebooks メニューより任意のフォルダーに新しいノートブックを作成し、以下のコードを入力、実行します。experiment_name や run_id は、ご利用環境に合わせて適宜変更ください。  

```Python
# 実行 ID より Run オブジェクトを作成します。
from azureml.core import Experiment, Workspace
from azureml.core.experiment import Experiment
from azureml.core.run import Run

workspace = Workspace.from_config()
experiment_name = "my-1st-automl-experiment"
experiment = Experiment(workspace, experiment_name)
run = Run(experiment=experiment, run_id='AutoML_66d0eb73-e09c-435d-ae80-da060d204b09_69')

# モデル等の情報を download フォルダー配下に格納します。
run.download_files(output_directory='download')
```

```Python
# ダウンロードしたモデルをローカルにロードします。
import joblib
from azureml.core.model import Model

model_path = 'download/outputs/model.pkl'
model = joblib.load(model_path)
```

推論のテストに使用するデータは、トレーニング データに含まれていないものをご用意頂く必要があります。今回は既に用意されているテスト データを使用しますが、一般的にはトレーニング用に収集したデータの 1 割程度をテスト用に分割しておくことをお勧めします。

```Python
# チュートリアルのテスト用データをデータセットとして読み込みます。
from azureml.core.dataset import Dataset

test_data = "https://automlsamplenotebookdata.blob.core.windows.net/automl-sample-notebook-data/bankmarketing_test.csv"
test_dataset = Dataset.Tabular.from_delimited_files(test_data)
```

>既存のデータセットを使用する場合、上記コード セルを以下に変更します。
>```Python
># 既存のデータセットを読み込みます。
>from azureml.core.dataset import Dataset
>
># detaset_name をデータセット名に置き換えて実行します。
>test_dataset = Dataset.get_by_name(workspace, >name='bankmarketing_test')
>```

```Python
# y 列を削除して pandas のデータフレーム形式に変換します。
test = test_dataset.drop_columns(columns=['y'])
test_df = test.to_pandas_dataframe()

# predict メソッドを使用して推論を実行します。
pred  = model.predict(test_df)
pred.tolist()
```

以下の通り推論結果を表示できたかと思います。  

<img src="https://jpmlblog.github.io/images/AML-model-inference/AML-inference-result.png" width=700px align="left" border="1"><br clear="left">  

これらのコードは下記サンプル ノートブック [auto-ml-classification-bank-marketing-all-features.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/classification-bank-marketing-all-features/auto-ml-classification-bank-marketing-all-features.ipynb) を参考にしておりますので、併せて参照ください。 

>**注意点**  
>時系列予測モデルの ForecastingParameters として target_rolling_window_size パラメーターを指定していると、predict の実行が失敗することが確認できています。これは predict メソッドが target_rolling_window_size パラメーターを使用したモデルでの実行をサポートしていないためです。このような場合、以下サンプル ノートブック [auto-ml-forecasting-orange-juice-sales.ipynb](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-orange-juice-sales/auto-ml-forecasting-orange-juice-sales.ipynb) 、にありますとおり、predict メソッドではなく forecast メソッドの利用をご検討ください。  
><img src="https://jpmlblog.github.io/images/AML-model-inference/AML-forecasting-sample.png" width=800px align="left" border="1"><br clear="left">  

***
## Web サービスとしてデプロイされたモデルを使用する
作成したモデルをローカル、ACI、AKS のいずれかに Web サービスとしてデプロイした場合、要求データを REST エンドポイントに対して送信することで推論結果を得られます。  

モデルのデプロイ方法は下記公開情報に纏められています。  

- [Azure Machine Learning を使用してモデルをデプロイする](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-deploy-and-where?tabs=azcli)

デプロイした Web サービスの呼び出し方は、下記公開情報が参考になります。  

- [Web サービスとしてデプロイされた Azure Machine Learning モデルを使用する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-consume-web-service?tabs=python)  

デプロイ先がローカル、ACI、AKS それぞれのドキュメントおよびサンプル ノートブックを紹介します。  

### ローカル
- docs: [Azure Machine Learning コンピューティング インスタンスへのモデルのデプロイ](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-deploy-local-container-notebook-vm)  
- sample: [Register model and deploy locally with advanced usages](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/deploy-to-local/register-model-deploy-local-advanced.ipynb)  

### ACI (Azure Container Instance)
- docs: [Azure Container Instances にモデルをデプロイする](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-deploy-azure-container-instance)  
- sample: [Register model and deploy as webservice in ACI](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/deploy-to-cloud/model-register-and-deploy.ipynb)  
- sample: [Deploy Multiple Models as Webservice](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/deploy-multi-model/multi-model-register-and-deploy.ipynb)  

### AKS (Azure Kubernetes Service)
- docs: [Azure Kubernetes Service クラスターにモデルをデプロイする](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-deploy-azure-kubernetes-service?tabs=python)  
- sample: [Deploying a web service to Azure Kubernetes Service (AKS)](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/production-deploy-to-aks/production-deploy-to-aks.ipynb)  
- sample: [Deploying a web service to Azure Kubernetes Service (AKS) + SSL](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/production-deploy-to-aks/production-deploy-to-aks-ssl.ipynb)  
- sample: [Deploying a web service to Azure Kubernetes Service (AKS) + GPU](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/deployment/production-deploy-to-aks-gpu/production-deploy-to-aks-gpu.ipynb)  

***
## そのほか参考となる情報

### Web サービスの入力データについて
Web サービスを呼び出す Json データは、{"data": [[ 数値,数値, ... ], [ 数値,数値, ... ]]} という形式である必要があります。または、辞書形式で {"data": [{ "列名":数値, "列名":数値, ... }, { "列名":数値, "列名":数値, ... }]} としても推論を実行可能です。  

以下に、csv ファイルを入力データに変更する方法を紹介させていただきます。まず、下記のコードで推論用データ predictdata.csv を作成します。事前に作成されたデータを使用しても問題ありません。  

```Python
%%writefile predictdata.csv
Name,age,job,hobby,deposit
test1,15,none,car,150000
test2,28,office worker,200000
test3,35,bank,fishing,3600000
test4,40,journalist,1520000
```

下記コードにて、入力用のデータへ変換します。

```Python
import csv
import json

json_list = []

# CSV ファイルの読み込み
with open('predictdata.csv', 'r') as f:
    for row in csv.DictReader(f):
        json_list.append(row)

# JSON ファイルへの書き込み
with open('predict.json', 'w') as f:
    json.dump(json_list, f, ensure_ascii=False, indent=4)

# JSON ファイルのロード
with open('predict.json', 'r') as f:
    json_output = json.load(f)

# 入力用データへの成型
data = {'data': [json_output]}

# String 形式に変換
input_data = json.dumps(data)
```

このとき、input_data 以下の通りです。

```
'{"data": [[{"Name": "test1", "age": "15", "job": "none", "hobby": "car", "deposit": "150000"}, {"Name": "test2", "age": "28", "job": "office worker", "hobby": "200000", "deposit": null}, {"Name": "test3", "age": "35", "job": "bank", "hobby": "fishing", "deposit": "3600000"}, {"Name": "test4", "age": "40", "job": "journalist", "hobby": "1520000", "deposit": null}]]}'
```

### デザイナーで作成したモデルのデプロイ
デザイナーでは作成したパイプラインを公開するだけではなく、作成したモデルをデプロイする方法がございます。以下公開情報に纏められておりますので、参考にご参照ください。

- [スタジオを使用して、デザイナーでトレーニングされたモデルをデプロイする](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-deploy-model-designer)

***
`変更履歴`  
`2021/01/13 created by Mochizuki`  
`2021/01/21 created by Mochizuki`  

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  