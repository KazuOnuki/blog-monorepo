---
title: 仮想ネットワーク (Vnet) 上で Azure Machine Learning を使用する方法について
date: 2020-10-28 12:00:00
categories:
- Azure Machine Learning
tags:
- 仮想ネットワーク
- Private Link
---
Azure Machine Learning を仮想ネットワーク環境で使用する場合に、参考となる情報を列記いたします。また、具体的な作成方法などを本記事にて紹介させていただきます。  

- [仮想ネットワークの分離とプライバシーの概要](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-network-security-overview)  
- [仮想ネットワークを使用して Azure Machine Learning ワークスペースをセキュリティで保護する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-secure-workspace-vnet)  
- [Azure 仮想ネットワークで Azure Machine Learning Studio を使用する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-enable-studio-virtual-network)  
- [Azure Machine Learning ワークスペース用に Azure Private Link を構成する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-configure-private-link?tabs=azure-resource-manager)  
- [仮想ネットワークの背後にワークスペースをデプロイする](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-create-workspace-template?wt.mc_id=ignite2020_presentations&tabs=azpowershell#deploy-workspace-behind-a-virtual-network)  

<!-- more -->
<br>

***
## 構築方法について
ここでは新しく仮想ネットワークを作成し、その配下に各リソースを作成する手順を紹介します。主に以下サイトの手順に従っております。  

- [仮想ネットワークの背後にワークスペースをデプロイする](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-create-workspace-template?wt.mc_id=ignite2020_presentations&tabs=azpowershell#deploy-workspace-behind-a-virtual-network)  

まずは各リソースを作成するリソース グループを作成します。なんらかのリソースの作成に失敗した際に、残存リソースの削除を簡単にするため、新たにリソース グループを作成することをおススメします。リソース基本パラメータおよび実行コマンドは以下の通りです。  

|項目|パラメータ|
|:--|:--|
|リージョン|`eastus` (米国東部)|
|リソースグル―プ|`amlvnetrg`|

```PowerShell
New-AzResourceGroup -Name amlvnetrg -Location eastus
```

次に、以下のような構成で各リソースを作成します。指定可能なパラメータは、テンプレート ファイル 「[201-machine-learning-advanced/azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json)」 より参照頂けます。それぞれ用途に応じてカスタイマイズください。  

|項目|パラメータ|仮想ネットワーク化|
|:--|:--|:--|
|リージョン|`eastus` (米国東部)|-|
|リソースグル―プ|`amlvnetrg`|-|
|仮想ネットワーク|`amlvnet`|-|
|サブネットワーク|`amlvsubnet`|-|
|ワークスペース|`amlvnetworkspace`|Private Link|
|ストレージ アカウント|`amlvnetstorage`|Vnet|
|Key Vault|`amlvnetkeyvault`|Vnet|
|Application Insights|`amlvnetappinsights`|- (未サポート)|
|Container Registry|`amlvnetconreg`|- (クォータ拡張要)|

```powershell
New-AzResourceGroupDeployment `
  -Name "amlvnetdeployment" `
  -ResourceGroupName "amlvnetrg" `
  -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-machine-learning-advanced/azuredeploy.json" `
  -location "eastus" `
  -vnetOption "new" `
  -vnetName "amlvnet" `
  -subnetName "amlvsubnet" `
  -privateEndpointType "AutoApproval" `
  -workspaceName "amlvnetworkspace" `
  -storageAccountBehindVNet "true" `
  -storageAccountName "amlvnetstorage" `
  -keyVaultName "amlvnetkeyvault" `
  -keyVaultBehindVNet "true" `
  -applicationInsightsName "amlvnetappinsights" `
  -containerRegistryName "amlvnetconreg"
```

>注意点 1 :  
>Key Vault リソースは一度削除してから同名で作り直すと soft-delete のエラーが発生します。これは、[Key Vault の論理的な削除](https://docs.microsoft.com/ja-jp/azure/key-vault/general/soft-delete-overview)が働いているためです。「[論理的に削除されたキー コンテナーを一覧表示、回復、または消去する](https://docs.microsoft.com/ja-jp/azure/key-vault/general/key-vault-recovery?tabs=azure-portal#list-recover-or-purge-a-soft-deleted-key-vault)」 の手順により、完全に削除することが可能です。 
>
> ```powershell
> New-AzResourceGroupDeployment : xx:xx:xx - Resource Microsoft.KeyVault/vaults 'amlvnetkeyvault' failed with message '{
>   "error": {
>     "code": "ConflictError",
>     "message": "Exist soft deleted vault with the same name. "
>   }
> }'
> ```

>注意点 2 :  
>10/28 現在、Application Insights は仮想ネットワーク背後へのデプロイをサポートしていません。

>注意点 3 :  
>Container Registry を仮想ネットワーク背後にデプロイする場合、幾つか[条件](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-secure-workspace-vnet#enable-azure-container-registry-acr)があります。使用したい場合、まず 「[プライベート エンドポイントとプライベート DNS クォータの引き上げ](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-manage-quotas#private-endpoint-and-private-dns-quota-increases)」 に従って、クォータ要求の引き上げをご依頼ください。  
> >次のシナリオでは、場合によっては Microsoft が所有するサブスクリプションでクォータの割り当てを依頼する必要があります。
> >
> >- カスタマーマネージド キー (CMK) を使用する Private Link 対応ワークスペース
> >- 仮想ネットワークの背後にあるワークスペースの Azure Container Registry
> >- Private Link 対応の Azure Kubernetes Service クラスターのワークスペースへのアタッチ 。
>
>クォータ引き上げ後、上述のコマンドの最後の部分を以下の通り変更することで仮想ネットワーク背後へのデプロイを実行することが可能です。  
>
> ```powershell
>   -containerRegistryName "amlvnetconreg" `
>   -containerRegistryBehindVNet "true" `
>   -containerRegistryOption "new" `
>   -containerRegistrySku "Premium"
> ```
>
>Container Registry を含めて仮想ネットワーク背後への配置した状態は、下記イメージのような状態となります。詳細は 「[ワークスペースと関連するリソースをセキュリティで保護する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-network-security-overview#secure-the-workspace-and-associated-resources)」 を参照ください。    
>
><img src="https://docs.microsoft.com/ja-jp/azure/machine-learning/media/how-to-network-security-overview/secure-workspace-resources.png" width=500px align="left" border="1"><br clear="left">

***
## 利用上の留意点
ワークスペースの Private Link を有効化することで、パブリック インターネット経由のアクセスが制限され、仮想ネットワーク上のリソースからのみアクセスが可能になります。また、Mozilla Firefox を使用した場合には別の問題も報告されておりますので、Microsoft Edge または Google Chrome のご利用をお勧めいたします。  

- [Azure Machine Learning ワークスペース用に Azure Private Link を構成する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-configure-private-link?tabs=python)
  > 重要  
  >Azure Private Link は、ワークスペースの削除やコンピューティング リソースの管理などの Azure コントロール プレーン (管理操作) には影響しません。 たとえば、コンピューティング先の作成、更新、削除などです。 これらの操作は、通常どおりパブリック インターネット経由で実行されます。 Azure Machine Learning Studio を使用するなどのデータ プレーン操作、API (公開されたパイプラインを含む)、または SDK では、プライベート エンドポイントが使用されます。  
  >
  >Mozilla Firefox を使用している場合、ワークスペースのプライベート エンドポイントにアクセスしようとしたときに問題が発生することがあります。 この問題は、Mozilla の DNS over HTTPS に関連している可能性があります。 回避策として、Microsoft Edge または Google Chrome を使用することをお勧めします。

パブリック インターネット経由でアクセスした際に表示されるエラーメッセージを以下に紹介します。  

### Studio アクセスが失敗する場合
<img src="https://jpmlblog.github.io/images/AML-use-behind-vnet/AML-Studio-error.png" width=400px align="left" border="1"><br clear="left"> 

NSG を使用してインターネット接続を制限している場合、仮想ネットワーク上のリソースからであっても Azure Machine Learning Studio へのアクセスが出来ない場合があります。下記サイトに記載されております通り、AzureFrontDoor.Frontend のサービス タグ宛の通信を許可する必要がある点についてご留意ください。  

- [Azure 仮想ネットワークで Azure Machine Learning Studio を使用する #VNet 内のリソースから Studio にアクセスする](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-enable-studio-virtual-network#access-the-studio-from-a-resource-inside-the-vnet)  
  >仮想ネットワーク内のリソース (コンピューティング インスタンスや仮想マシンなど) からスタジオにアクセスする場合は、仮想ネットワークからスタジオへの送信トラフィックを許可する必要があります。  
  >
  >たとえば、ネットワーク セキュリティ グループ (NSG) を使用して送信トラフィックを制限している場合は、 AzureFrontDoor.Frontend の サービス タグ 宛先に規則を追加します。

### Home メニュー アクセス時のエラー  
<img src="https://jpmlblog.github.io/images/AML-use-behind-vnet/AML-Home-menu-error.png" width=700px align="left" border="1"><br clear="left">  

>REQUEST_SEND_ERROR: Your request for data wasn’t sent. Here are some things to try: Check your network and internet connection, make sure a proxy server is not blocking your connection, follow our guidelines if you’re using a private link, and check if you have AdBlock turned on.

### Notebooks メニュー アクセス時のエラー  
<img src="https://jpmlblog.github.io/images/AML-use-behind-vnet/AML-Notebooks-menu-error.png" width=700px align="left" border="1"><br clear="left">  

>403: You are not authorized to access this resource. You are not authorized to access this resource.

>Request authorization to storage account failed. Storage account might be behind a VNET. Please go to the Compute tab, create a compute instance, and launch Jupyter or Jupyter Lab to use your files and notebooks.

### Compute メニュー アクセス時のエラー  
<img src="https://jpmlblog.github.io/images/AML-use-behind-vnet/AML-Compute-menu-error.png" width=700px align="left" border="1"><br clear="left">  

>403: You are not authorized to access this resource. You are not authorized to access this resource.

エラーは出力されますが、各コンピューティング リソースの作成、起動、停止、削除などの操作は可能です。必要に応じて、以下サイトを参考にロールベースでのアクセス制御 (RBAC) を実装いただくことをお勧めいたします。  

なお、Vnet に配置した Compute Instance のアプリケーション URI (Jupyter および Jupyter Lab のリンク) へのアクセスも、以下のメッセージが表示され失敗します。  

>User \<User Name\> does not have access to compute instance \<Compute Instance Name\>.
>
>Only the creator can access a compute instance.

- [Azure Machine Learning ワークスペースへのアクセスの管理](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-assign-roles)

### カスタム DNS サーバーを使用している場合

仮想ネットワークにカスタム DNS サーバーを設定している場合、DNS 名前解決にプライベート IP アドレスが返されず、アクセスに失敗する可能性があります。下記の情報に従い必要な設定をご検討ください。  

- [カスタム DNS サーバーでワークスペースを使用する方法](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-custom-dns?tabs=azure-portal)

### ExpressRoute や Azure VPN 経由でアクセスする場合

オンプレミスのマシンから ExpressRoute や Azure VPN 経由でワークスペースにアクセスする場合、名前解決で参照先 DNS サーバーの設定に依存してパブリック IP アドレスが返却されてしまい、アクセスが失敗する可能性があります。上述のカスタム DNS サーバーの設定をオンプレミスの DNS サーバーを対象に実施いただくことをご検討ください。

### Compute Instance 作成時の留意点

ワークスペースで Private Link を有効にしている場合、Compute Instance および Compute Cluster は仮想ネットワーク上にしか作成できなくなります。この時、Compute Instance を作成すると仮想ネットワーク リソースのあるリソース グループ配下に、Load Balancer、Public IP Address、Network Security Group が作成されます。これらのリソースは Compute Instance に紐づいて作成されるため、別リソース グループに移動したり、作成時点で別のリソース グループを指定できない仕様になっております。  

リソース グループ単位での管理を行う必要がある場合、仮想ネットワークを Azure Machine Learning ワークスペースと同じリソース グループに作成いただく必要がございますこと、予めご留意願います。  

> <font color="#FF0000">当該仕様変更リクエストを下記フィードバック サイトにて投稿しております。投票数が多いものから追加を検討される傾向にありますので、必要に応じてご投票およびコメントの追加にご協力いただけますと幸いです。</font>  
>
>- [Change resource group for LB, Public IP, and NSG of Compute Instance](https://feedback.azure.com/forums/257792-machine-learning/suggestions/43181112-change-resource-group-for-lb-public-ip-and-nsg-o)



<br>
※ 順次追加予定です。

***
`変更履歴`  
`2020/10/28 created by Mochizuki`  
`2020/11/05 modified by Mochizuki`  
`2021/04/19 modified by Mochizuki`

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  