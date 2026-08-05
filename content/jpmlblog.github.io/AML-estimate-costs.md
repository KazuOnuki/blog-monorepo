---
title: Azure Machine Learning のコスト見積もりについて
date: 2020-06-18 09:00:00
categories:
- Azure Machine Learning
tags:
- 価格
---
Azure Machine Learning のコスト見積もりについて、参考となる情報を紹介します。
<!-- more -->
<br>

***
本記事では具体的なコストの見積もり例を紹介します。  
コストの管理に関する基本的な考え方は、下記サイトの内容を参照ください。  

- [Azure Machine Learning のコストを計画して管理する](https://docs.microsoft.com/ja-jp/azure/machine-learning/concept-plan-manage-cost)  
- [Azure Machine Learning のコストを管理して最適化する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-manage-optimize-cost)  

***
## コスト見積もり例について

Azure Machine Learning のワークスペース自体には課金は発生しません。ワークスペースで作成したリソースに課金が発生します。  

例えば、開発環境として使用する Azure Machine Learning コンピューティング インスタンスや、トレーニングの実行環境として使用する Azure Machine Learning コンピューティング クラスターは、稼働時間分が課金対象となります。また、作成したモデルをデプロイした場合、デプロイ先のサービスについても比較的大きな課金が発生します。参考に見積もり例を後述に紹介します。  

※ ご利用方法によって試算より誤差が生じる場合がありますので、予めご留意ください。


### コンピューティング インスタンス
開発環境として Azure Machine Learning コンピューティング インスタンス (東日本リージョン、STANDARD_DS3_V2) を 1 日 10 時間起動し、30 日間使用する場合の月額  

<font color="#FF0000">**注意**  
VM としての料金に加えて、下記 3 つのサービスに対して課金が発生いたします。これらの課金はコンピューティング インスタンスを停止していても継続されます。これらのサブ リソースが作成される理由については、"サブ リソースについて" セクションをご参照ください。  

例 (東日本リージョン):  
- スタンダード ロード バランサー (約 2.8 [円/時間])  
- スタンダード (静的) パブリック IP アドレス (約 0.56 [円/時間])  
- マネージド ディスク p10 (約 2,539.04 [円/月]  
  ※ 30 [日/月] の場合、約 3.5264 [円/時間], 31 [日/月] の場合、約 3.4127 [円/時間])  

参考: [Azure Machine Learning コンピューティング インスタンスを作成して管理する](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-create-manage-compute-instance?tabs=python#manage)  
>  コンピューティング インスタンスを停止すると、コンピューティング時間の課金は停止しますが、ディスク、パブリック IP、および Standard Load Balancer に対しては引き続き課金されます。  
</font>

(VM)  
`45.808 [円/時間] x 10 [時間/日] x 30 [日] = 13742.4 [円]`  

(関連サービス ※ 30 [日/月] の場合) 
`(2.8 + 0.56 + 3.5264 [円/時間]) x 24 [時間/日] x 30 [日] = 4958.208 [円]`  

→ 合計 `13742.4 + 4958.208 = 18700.608 [円]`  

- 参考サイト  
  [サポートされている VM シリーズおよびサイズ](https://docs.microsoft.com/ja-jp/azure/machine-learning/concept-compute-target#supported-vm-series-and-sizes)  
  [Azure Machine Learning の価格](https://azure.microsoft.com/ja-jp/pricing/details/machine-learning/)  
  [負荷分散 の価格](https://azure.microsoft.com/ja-jp/pricing/details/load-balancer/)  
  [IP アドレス の価格](https://azure.microsoft.com/ja-jp/pricing/details/ip-addresses/)  
  [Managed Disks の価格](https://azure.microsoft.com/ja-jp/pricing/details/managed-disks/)  
  [料金計算ツール (+Azure Machine Learning)](https://azure.microsoft.com/ja-jp/pricing/calculator/?service=machine-learning-service)  
  [Linux Virtual Machines の料金](https://azure.microsoft.com/ja-jp/pricing/details/virtual-machines/linux/)  


### コンピューティング クラスター
トレーニング ターゲットとして Azure Machine Learning コンピューティング クラスター (東日本リージョン、STANDARD_DS3_V2) を最小 0 ノード、最大 2 ノードで作成し、2 ノードで 1 日 4 時間、30 日間使用する場合の月額  

<font color="#FF0000">**注意:**  
VM としての料金に加えて、下記 3 つのサービスに対して課金が発生いたします。環境情報を維持しないといけないコンピューティング インスタンスとは異なり、停止している場合 (起動しているノード数が 0 の場合) には割り当てが完全に解除されるため、課金は停止します。これらのサブ リソースが作成される理由については、"サブ リソースについて" セクションをご参照ください。    

例 (東日本リージョン):  
- スタンダード ロード バランサー (約 2.8 [円/時間])  
- スタンダード (静的) パブリック IP アドレス (約 0.56 [円/時間])  
- マネージド ディスク p10 (約 2,539.04 [円/月]  
  ※ 30 [日/月] の場合、約 3.5264 [円/時間], 31 [日/月] の場合、約 3.4127 [円/時間])  

</font>

(VM)  
`45.808 [円/時間/ノード] x 2 [ノード] x 4 [時間/日] x 30 [日] = 10993.92 [円]`  

(関連サービス ※ 30 [日/月] の場合) 
`(2.8 + 0.56 + 3.5264 [円/時間]) x 4 [時間/日] x 30 [日] = 826.368 [円]`  

→ 合計 `10993.92 + 826.368 = 11820.288 [円]`  

- 参考サイト  
  [サポートされている VM シリーズおよびサイズ](https://docs.microsoft.com/ja-jp/azure/machine-learning/concept-compute-target#supported-vm-series-and-sizes)  
  [Azure Machine Learning の価格](https://azure.microsoft.com/ja-jp/pricing/details/machine-learning/)  
  [Batch の価格](https://azure.microsoft.com/ja-jp/pricing/details/batch/)  
  [負荷分散 の価格](https://azure.microsoft.com/ja-jp/pricing/details/load-balancer/)  
  [IP アドレス の価格](https://azure.microsoft.com/ja-jp/pricing/details/ip-addresses/)  
  [Managed Disks の価格](https://azure.microsoft.com/ja-jp/pricing/details/managed-disks/)  
  [料金計算ツール (+Azure Machine Learning)](https://azure.microsoft.com/ja-jp/pricing/calculator/?service=machine-learning-service)  
  [Linux Virtual Machines の料金](https://azure.microsoft.com/ja-jp/pricing/details/virtual-machines/linux/)  



### 推論クラスター (Azure Kubernetes Service, AKS)
推論用クラスターとして Azure Kubernetes Service の仮想マシン (東日本リージョン、STANDARD_DS12_V2) を 3 ノードで作成し、30 日間使用する場合の月額  

> 注意:  
コア数合計を 12 以上で作成する必要があります。  

→ `51.408 [円/時間/ノード] x 3 [ノード] x 24 [時間/日] x 30 [日] = 111041.28 [円]`

- 参考サイト  
  [Azure Kubernetes Service (AKS) の価格](https://azure.microsoft.com/ja-jp/pricing/details/kubernetes-service/)  
  [料金計算ツール (+Azure Kubernetes Service)](https://azure.microsoft.com/ja-jp/pricing/calculator/?service=kubernetes-service)  
  [Linux Virtual Machines の料金](https://azure.microsoft.com/ja-jp/pricing/details/virtual-machines/linux/)  


### Azure Container Instance (ACI)
モデルを Azure Container Instance (vCPU 1、メモリ 1 GiB) にデプロイし、30 日間使用する場合の月額  

> 注意:  
Azure Machine Learning で ACI にモデルをデプロイする場合、指定したコンテナーに加えて azureml-fe-aci (それぞれ vCPU 0.1、メモリ 0.5 GiB) が作成されます。また、vCPU は小数点第一位で切り上げされて計上されます。また、メモリは小数点第二位で切り上げされて計上されます。  

(vCPU)  
`0.0015743 [円/秒/vCPU] x 2 [vCPU] x 3600 [秒/時間] x 24 [時間/日] = 272.03904 [円/日]`  
`272.03904 [円/日] x 30 [日] = 8161.1712 [円]`  
   
(メモリ)  
`0.0001721 [円/秒/GiB] x 1.5 [Gib] x 3600 [秒/時間] x 24 [時間/日] = 22.30416 [円/日]`  
`22.30416 [円/日] x 30 [日] = 669.1248 [円]`  

→ 合計 `8161.1712 + 669.1248 = 8830.296 [円]`

- 参考サイト  
  [Container Instances の価格](https://azure.microsoft.com/ja-jp/pricing/details/container-instances/)  
  [料金計算ツール (+Container Instance)](https://azure.microsoft.com/ja-jp/pricing/calculator/?service=container-instances)  

***
## 見積もりが難しいコストについて
上記に加えて以下リソースの課金が発生いたします。これらはご利用方法によって金額が大きく異なりますため、試算を含めた見積もりを例示することができません。一般的に上述の料金と比較して数パーセント程度の小さい金額となりますため、一定期間ご利用いただいた後、実際の課金額を基に見積もることをお勧めします。  

- [Azure Container Registry Basic アカウント](https://azure.microsoft.com/ja-jp/pricing/details/container-registry/)  
- [Azure ブロック BLOB Storage (汎用 v2)](https://azure.microsoft.com/ja-jp/pricing/details/storage/blobs/)  
- [Key Vault](https://azure.microsoft.com/ja-jp/pricing/details/key-vault/)  
- [Application Insights](https://azure.microsoft.com/ja-jp/pricing/details/monitor/)  

また、ワークスペースやストレージ等を仮想ネットワークに配置する場合、パブリック エンドポイントやプライベート DNS ゾーン、ロード バランサーの料金が追加で発生いたします。固定でかかる費用となりますので、こちらも一定期間ご利用いただい後、実際の課金額を基に見積もることをお勧めします。  

- [仮想ネットワークの分離とプライバシーの概要](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-network-security-overview)

***
## サブ リソースについて
コンピューティング インスタンスおよびコンピューティング クラスターを作成すると、VM の料金に加えてネットワークに関連したリソースが併せて作成されます。これらは作成されたノードとの通信を維持するために使用され、課金の対象になります。  

参考: [サブ リソース](https://docs.microsoft.com/ja-jp/azure/machine-learning/concept-workspace#sub-resources)
> これらのサブ リソースは、AML ワークスペースで作成される主要なリソースです。
>
> - VM: AML ワークスペースのコンピューティング能力を提供します。モデルのデプロイとトレーニングに不可欠な要素です。
> - ロード バランサー: コンピューティング インスタンスおよびクラスターが停止している場合でもトラフィックを管理するために、コンピューティング インスタンスとコンピューティング クラスターごとにネットワーク ロード バランサーが作成されます。
> - 仮想ネットワーク: これらは、Azure リソースが互いに通信したり、インターネットやその他のオンプレミス ネットワークと通信したりするために役立ちます。
> - 帯域幅: リージョン間のすべてのアウトバウンド データ転送をカプセル化します。

参考: [リソースの削除前にコストが発生する可能性がある](https://docs.microsoft.com/ja-jp/azure/machine-learning/concept-plan-manage-cost#costs-might-accrue-before-resource-deletion)
> Azure portal 内で、または Azure CLI を使用して Azure Machine Learning ワークスペースを削除する前、ワークスペース内でアクティブに作業していない場合でも、次のサブ リソースは一般的なコストとして蓄積されます。 後でご自身の Azure Machine Learning ワークスペースに戻る予定がある場合、これらのリソースには引き続きコストが発生する可能性があります。    
>
> - VM  
> - Load Balancer  
> - Virtual Network  
> - 帯域幅
>  
> VM はそれぞれ、実行している時間ごとに課金されます。 コストは VM の仕様によって異なります。 実行中であっても、データセットに対してアクティブに動作していない VM については、ロード バランサー経由で課金されます。 コンピューティング インスタンスごとに、1 日あたり 1 つのロード バランサーに対して請求が発生します。 コンピューティング クラスターの 50 ノードごとに、1 つの Standard ロード バランサーが課金されます。 ロード バランサーあたりの課金額は 1 日あたり約 0.33 ドルです。 停止しているコンピューティング インスタンスとコンピューティング クラスターに対してロード バランサーのコストが発生するのを回避するには、コンピューティング リソースを削除します。 サブスクリプションごと、およびリージョンごとに 1 つの仮想ネットワークが課金されます。 仮想ネットワークは、複数のリージョンまたはサブスクリプションにまたがることはできません。 vNet 設定内でプライベート エンドポイントを設定しても、料金が発生することがあります。 帯域幅は使用量に基づいて課金されます。転送データが多いほど、料金は高くなります。

***
## ワークスペース削除
Azure ポータルまたは Azure CLI で Azure Machine Learning ワークスペースを削除した後も、次のリソースは引き続き存在します。これらは削除されるまでコストが発生し続けます。  

- Azure Container Registry
- Azure Storage Account
- Key Vault
- Application Insights

これらのリソースと共にワークスペースを削除するには、SDK を使用します。

```Python
ws.delete(delete_dependent_resources=True)
```

ワークスペースに Azure Kubernetes Service (AKS) を作成する場合、またはワークスペースにコンピューティング リソースをアタッチする場合は、Azure ポータルで個別に削除する必要があります。

- 参考サイト  
  [リソースの削除後にコストが発生する可能性がある](https://docs.microsoft.com/ja-jp/azure/machine-learning/concept-plan-manage-cost#costs-might-accrue-after-resource-deletion)  
  [関連するリソース](https://docs.microsoft.com/ja-jp/azure/machine-learning/concept-workspace#associated-resources)

***
## サービスの価格に関する問い合わせ
各サービスの価格に関するご質問 (Azure Machine Learning で発生する費用の内訳を知りたい、または発生したコストがどのリソースで消費しているか、など) は、弊社課金サポートで承っております。以下の画像を参考に、サポート リクエストを発行いただきお問い合わせください。  

<img src="https://jpmlblog.github.io/images/AML-estimate-costs/support-request-for-billing.png" width=600px align="left"><br clear="left">

***
## 見積もりの依頼について
貴社ご利用方法における見積もりの回答が必要な場合、営業担当のタスクとして対応させていただいております。下記サイトを参考によりご依頼ください。  

- [Azure 価格について 1 対 1 でのガイダンスを受ける](https://azure.microsoft.com/ja-jp/pricing/contact-sales/)
- [Azure 営業担当者に問い合わせる](https://azure.microsoft.com/ja-jp/overview/sales-number/)  

***
`変更履歴`  
`2020/06/18 created by Mochizuki`  
`2020/11/12 modified by Mochizuki`  
`2020/11/18 modified by Mochizuki`  
`2020/11/27 modified by Mochizuki`  
`2021/05/26 modified by Mochizuki`  
`2021/06/07 modified by Mochizuki`  
`2021/07/20 modified by Mochizuki`  
`2021/07/28 modified by Mochizuki`  
`2021/10/15 modified by Mochizuki` 

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  