---
title: モデルを仮想ネットワーク上の Azure Container Instances (ACI) にデプロイする方法について
date: 2020-08-18 12:00:00
categories:
- Azure Machine Learning
tags:
- Azure Container Instances
- 仮想ネットワーク
---
モデルを仮想ネットワーク上の ACI にデプロイする方法について紹介します。  

Azure Machine Learning に仮想ネットワーク (Azure Virtual Network: VNET) を使用することで、機械学習のライフサイクルをセキュリティで保護することが可能になります。例えば、ACI を仮想ネットワークに置くことで、Web エンドポイントをパブリック インターネットから保護することができます。  
<!-- more -->
<br>

***
Azure Machine Learning を使用して Azure Container Instances (ACI) にモデルを Web サービスとしてデプロイする方法は、以下の公開情報が参考になります。  

- [CLI (v1) を使用して Azure Container Instances にモデルをデプロイする](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-deploy-azure-container-instance)  
- [リモートでのモデル デプロイのトラブルシューティング](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-troubleshoot-deployment?tabs=azcli)  

仮想ネットワーク上の ACI にモデルをデプロイする場合、Azure Machine Learning ワークスペースにプライベート エンドポイント接続があるとサポートされなくなりました。  

- [仮想ネットワークを使用して Azure Machine Learning 推論環境をセキュリティで保護する #Azure Container Instances](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-secure-inferencing-vnet?tabs=python#azure-container-instances)  
---
## 仮想ネットワークの作成例

新たに仮想ネットワークを作成する際には、以下[制限事項](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-deploy-azure-container-instance#limitations)  について予めご留意ください。  
> Azure Machine Learning ワークスペースがプライベート エンドポイントで構成されている場合、VNet でのAzure Container Instances へのデプロイはサポートされていません。 代わりに、ネットワークの分離とマネージド オンライン エンドポイントを使用することを検討してください。  

「[サブネットの委任を追加または削除する - 仮想ネットワークの作成](https://docs.microsoft.com/ja-jp/azure/virtual-network/manage-subnet-delegation#create-the-virtual-network)」 の手順に従って仮想ネットワークの作成を進めます。

- [基本] タブの設定例です。仮想ネットワークはワークスペースと同じリソースグループに作成します。同じリソースグル―プの既存の仮想ネットワークでも使用可能です。名前、地域は任意です。  

   <img src="https://jpmlblog.github.io/images/AML-deploy-aci-vnet/AML-create-vnet1.png" width=600px>  

- [IP アドレス] タブの設定例です。仮想ネットワークの IP アドレス帯は任意で変更可能です。サブネットはそのままで進めます。  

   <img src="https://jpmlblog.github.io/images/AML-deploy-aci-vnet/AML-create-vnet2.png" width=600px>  

[セキュリティ]、[タグ] タブも既定のまま進めると下記の画面に進みます。手順例では、リソースグループ amlrg に amlvnet1 という仮想ネットワークが作成されます。  

   <img src="https://jpmlblog.github.io/images/AML-deploy-aci-vnet/AML-create-vnet3.png" width=350px>  
<br>  

---
## サブネットの作成例
作成した仮想ネットワークにサブネットを作成します。「[サブネットの委任を追加または削除する - サブネットを Azure サービスに委任する](https://docs.microsoft.com/ja-jp/azure/virtual-network/manage-subnet-delegation#delegate-a-subnet-to-an-azure-service)」 の手順に従って進めます。  

- サブネットの作成例です。名前、アドレス範囲は任意です。サブネットの委任に `Microsoft.ContainerInstance/containerGroups` を指定します。  

   <img src="https://jpmlblog.github.io/images/AML-deploy-aci-vnet/AML-create-subnet1.png" width=250px>  

ここまで進めると、amlvnet1 配下に default と amlsubnet1 サブネットが存在し、amlsubnet1 には委任先に `Microsoft.ContainerInstance/containerGroups` が設定されていることが確認できます。  

<img src="https://jpmlblog.github.io/images/AML-deploy-aci-vnet/AML-create-subnet2.png" width=750px>  
<br>

---
## 仮想ネットワークへのモデル デプロイ例
SDK を使用して作成する必要があります。[AciWebservice.deploy_configuration()](https://docs.microsoft.com/ja-jp/python/api/azureml-core/azureml.core.webservice.aci.aciwebservice?view=azure-ml-py#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none--primary-key-none--secondary-key-none--collect-model-data-none--cmk-vault-base-url-none--cmk-key-name-none--cmk-key-version-none--vnet-name-none--subnet-name-none-) 関数の引数 vnet_name、subnet_name に作成した仮想ネットワークとサブネットを指定して deployment_config を作成し、[Model.deploy()](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) に指定して実行します。具体的な手順は以下を参照ください。  

- [Model.deploy()](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-) の実行には models や inference_config を事前に設定している必要があります。以下に、モデル ファイル model.pkl、Conda 依存関係ファイル myenv.yml、エントリ スクリプト ファイル score.py を基にして、それぞれ設定するコード スニペットを紹介します。    

   ```Python
   from azureml.core import Workspace
   from azureml.core import Environment
   from azureml.core.model import Model
   from azureml.core.model import InferenceConfig
   
   ws = Workspace.from_config()
   model = Model.register(model_path="model.pkl",
                          model_name="mymodel",
                          workspace=ws)
   env = Environment.from_conda_specification(name='myenv', file_path='myenv.yml')
   inference_config = InferenceConfig(entry_script="score.py", environment=env)
   ```

- 「[Azure Container Instances にモデルをデプロイする - SDK を使用する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-deploy-azure-container-instance#using-the-sdk)」 のコードに vnet_name、subnet_name を追加して実行します。以下にコード スニペットを紹介します。  

   ```Python
   from azureml.core.webservice import AciWebservice, Webservice
   from azureml.core.model import Model
   
   deployment_config = AciWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1,
       vnet_name = "amlvnet1", subnet_name = "amlsubnet1")
   service = Model.deploy(ws, "aciservice", [model], inference_config, deployment_config)
   service.wait_for_deployment(show_output = True)
   ```

作成された REST エンドポイントは、Azure Machine Learning ポータルの [エンドポイント] から確認できます。以下画像では REST エンドポイントは `http://10.0.1.4/score` となっています。  

<img src="https://jpmlblog.github.io/images/AML-deploy-aci-vnet/AML-create-aci.png" width=600px>  
<br>

---
## 参考: Web サービスの動作確認例
Web サービスと同じ仮想ネットワーク上にあるコンピュート インスタンスから Web リクエストを実行する方法を紹介します。まず、[こちらのサイト](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-enable-virtual-network#compute-clusters--instances) を参照し、ネットワーク セキュリティ グループ (NSG) を作成します。下記画像ではリージョンの指定を省略しています。  

<img src="https://jpmlblog.github.io/images/AML-deploy-aci-vnet/AML-create-nsg.png" width=800px>  

作成した NSG を amlvnet1 の default サブネットに設定します。  

<img src="https://jpmlblog.github.io/images/AML-deploy-aci-vnet/AML-change-nsg.png" width=500px>  

amlvnet1 の default サブネットに Compute Instance を作成します。  

<img src="https://jpmlblog.github.io/images/AML-deploy-aci-vnet/AML-create-compute.png" width=500px>  

作成したコンピュート インスタンス上で以下のコードを実行します。[こちら](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-consume-web-service#call-the-service-python) のサイトの手順が参考になります。  

```Python
import requests
import json

scoring_uri = 'http://10.0.1.4/score'

data = {"data":
       [[ *** モデルに併せてデータを設定ください *** ]]
       }

input_data  = json.dumps(rawdata)

headers = {'Content-Type': 'application/json'}
resp = requests.post(scoring_uri, input_data , headers=headers)
print(resp.text)
```
<br>

***
`変更履歴`  
`2020/08/18 created by Mochizuki`  
`2022/03/16 created by Mochizuki`  
`2022/06/21 created by Mochizuki`  