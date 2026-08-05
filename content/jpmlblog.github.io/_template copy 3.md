---
title: RBAC を使用して Azure Machine Learning ワークスペースへのアクセスを管理する方法について
date: 9999-12-31 00:00:00
categories:
- Azure Machine Learning 
tags:
- RBAC
---
Azure Machine Learning ワークスペースに対して、ユーザーが出来ることを制限する方法として、Azure RBAC を利用いただけます。具体的な方法と設定した場合の動作例、よくあるご質問内容を紹介します。  

- [Azure Machine Learning ワークスペースへのアクセスの管理](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-assign-roles)
- [Azure ロールの定義について](https://docs.microsoft.com/ja-jp/azure/role-based-access-control/role-definitions)
- [Azure RBAC のベスト プラクティス](https://docs.microsoft.com/ja-jp/azure/role-based-access-control/best-practices)
- [Azure カスタム ロール](https://docs.microsoft.com/ja-jp/azure/role-based-access-control/custom-roles)
- [Azure リソース プロバイダーの操作 #Microsoft.MachineLearningServices](https://docs.microsoft.com/ja-jp/azure/role-based-access-control/resource-provider-operations#microsoftmachinelearningservices)

<!-- more -->
<br>

***
## 設定方法について
Azure Machine Learning では、[Azure Machinie Learning Studio](https://ml.azure.com/) や [Python SDK](https://docs.microsoft.com/ja-jp/python/api/overview/azure/ml/?view=azure-ml-py)、[Azure CLI](https://docs.microsoft.com/ja-jp/rest/api/azureml/workspacesandcomputes/machinelearningcompute)、[REST API](https://docs.microsoft.com/ja-jp/rest/api/azureml/) 等を使用してワークスペースにアクセスを行います。この時、各操作で実行される API 単位で権限を割り当てることが可能です。  

ワークスペースの管理者としての権限を付与する場合、ワークスペースの作成を行う必要があるか、クォータ要求を行う必要があるか、カスタム ロールを作成する必要があるかといった観点で付与するスコープを決定します。(※ [参考サイト](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-assign-roles#common-scenarios))

|アクティビティ|スコープ|
|:--|:--|
|新しいワークスペースを作成できる|リソースグループに Owner または Contributor|
|クォータ要求を発行できる|サブスクリプションに Owner または Contributor|
|新しいカスタム ロールを作成できる|サブスクリプションに Owner または Contributor|


<img src="https://jpmlblog.github.io/images/template.png" width=400px>  

***
本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  

`変更履歴`  
`9999/12/31 created by ******`