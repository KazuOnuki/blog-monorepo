---
title: Azure Machine Learning Studio でモデル登録およびデプロイする場合の留意点について
date: 2020-08-25 17:00:00
categories:
- Azure Machine Learning
tags:
- モデル登録
- デプロイ
---
Azure Machine Learning Studio でモデル登録する場合の留意点についてお纏めします。
<!-- more -->
<br>

***
Azure Machine Learning Studio (https://ml.azure.com/) のユーザー インターフェイスでは、モデル登録およびデプロイを行うことができます。この時、設定方法が誤っているとモデルのデプロイ操作が長時間完了せず、結果として登録が失敗する場合があります。  

本記事では、具体的な例を挙げて手順を詳細させていただきます。  

---
## モデルの登録
Azure Machine Learning Studio (https://ml.azure.com/) の [アセット] - [モデル] の [+ モデルの登録] をクリックします。  

<img src="https://jpmlblog.github.io/images/AML-register-and-deploy-model/Register-model-button.png" width=500px>  

表示された入力項目のうち、* マークのある項目を全て埋めて [登録] ボタンをクリックします。  

<img src="https://jpmlblog.github.io/images/AML-register-and-deploy-model/Register-model-config.png" width=400px>  

この時、以下の点に留意ください。

- モデル フレームワークを誤って選択するとデプロイに失敗します。不明な場合には、[その他] を選択し、フレーム ワーク名、バージョンは空欄にします。指定するとデプロイが簡略化されますが、指定しなくても登録可能です。  
   (参考情報) [Model class](https://docs.microsoft.com/ja-jp/python/api/azureml-core/azureml.core.model(class)?view=azure-ml-py)  
   > The framework of the registered model. Using the system-supported constants from the Framework class allows for simplified deployment for some popular frameworks.

---
## モデルのデプロイ
Azure Machine Learning Studio (https://ml.azure.com/) の [アセット] - [モデル] より、登録されているモデルをクリックします。  

<img src="https://jpmlblog.github.io/images/AML-register-and-deploy-model/Deploy-model-button.png" width=500px>  

表示された入力項目のうち、* マークのある項目を全て埋めて [登録] ボタンをクリックします。  

<img src="https://jpmlblog.github.io/images/AML-register-and-deploy-model/Deploy-model-config.png" width=400px>  

この時、以下の点に留意ください。  

- エントリ スクリプト ファイルおよび Conda 依存関係ファイルは下記サイトを参考にご準備ください。  
   (参考情報) [エントリ スクリプトを定義する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-deploy-and-where?tabs=python#define-an-entry-script)  
   (参考情報) [推論構成を定義する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-deploy-and-where?tabs=python#define-an-inference-configuration)  

- エントリ スクリプト ファイルのモデル指定に誤りがあったり、Conda 依存関係ファイルが誤っていると、デプロイ操作がエラーの表示なく長時間完了しない場合があります。デプロイ先のリソースにエラーが記録されている場合がありますので、厳密な調査が必要となりましたら、モデルファイル、エントリ スクリプト ファイル、Conda 依存関係ファイルと共にサポート リクエストを発行ください。  

<b><u>(参考) 自動 ML (Automated Machine Learning) のモデルのデプロイ</b></u>  
自動 ML の実行結果からモデルをデプロイする場合、エントリ スクリプト ファイルおよび Conda 依存関係ファイルを指定する必要はありません。具体的な操作内容は下記サイトを参照ください。  
(参考情報) [モデルをデプロイする](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-use-automated-ml-for-ml-models#deploy-your-model)

***
`変更履歴`  
`2020/08/25 created by Mochizuki`  