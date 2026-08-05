---
title: Azure Machine Learning SDK v1 の廃止に伴い発生するアクションについて
date: 2025-04-10 00:00:00
categories:
- Azure Machine Learning
tags:
- SDK
- v1
- deprecate
---
件名 「Action required: Migrate to Azure Machine Learning SDK version 2 before 30 June 2026 (日本語版 - アクションが必要です：2026年6月30日までに、Azure Machine Learning SDK バージョン2 に移行してください。)」 の電子メールにて通知されている内容について、必要なアクションをご紹介させていただきます。  

<!-- more -->
<br>

***
## Azure Machine Learning SDK v1 および v2 について

Azure Machine Learning サービスでは 2025 年 4 月現在、[SDK v1](https://learn.microsoft.com/en-us/azure/machine-learning/introduction?view=azureml-api-1#sdk-v1) および [SDK v2](https://learn.microsoft.com/ja-jp/python/api/overview/azure/machine-learning?view=azure-python) を使用した開発をサポートしています。それぞれ概ね同様の操作を実行することが可能ですが、使用される API は異なるため互換性は無く、SDK v1 は新機能に対応していないなど

- [Azure Machine Learning SDK & CLI (v1)](https://learn.microsoft.com/en-us/azure/machine-learning/introduction?view=azureml-api-1)  

- [What is Azure Machine Learning CLI and Python SDK v2?](https://learn.microsoft.com/en-us/azure/machine-learning/concept-v2?view=azureml-api-2)  





SDK は、Azure Resource Manager (以下、ARM) 宛に要求を発行するもの、ワークスペース リソース宛に要求を発行するものの 2 種類が存在します。 これまでの API (v1 API) は、ワークスペースやコンピューティング リソースに対する操作以外は基本的にワークスペース宛に要求を送っていました。 新しい API (v2 API) では、それらの多くが ARM 宛に要求を送る様に変更されます。  

> | API バージョン | ARM 宛の操作 | Workspace 宛の操作 |
> | :---- | :---- | :---- |
> | v1 | ワークスペースおよびコンピューティング リソースの作成、更新、削除操作 | 実験などその他の操作 | 
> | v2 | ワークスペース、コンピューティング、データストア、データセット、ジョブ、環境、コード、<br>コンポーネント、エンドポイントなど、ほとんどの操作 | 残りの操作 |

v2 API を使用することで、RBAC を使用したアクセス制御や Azure Policy の適用が使い易くなる見込みです。 また、Azure Machine Learning の [マネージド オンライン エンドポイント](https://docs.microsoft.com/ja-jp/azure/machine-learning/concept-endpoints) などの新機能は v2 API でしか使用できないため、これらが利用できるといったメリットもあります。  

---
## v2 API の使用によって発生するネットワーク分離への影響
前項で述べたように、API 操作には ARM を使用するものとワークスペースを使用するものがあり、v2 になることでその多くが ARM を使用するように変更されます。 プライベート エンドポイントを持たないワークスペースでは、ARM 宛とワークペース宛のいずれもパブリック ネットワークを経由して通信を行っているため、影響はありません。 プライベート エンドポイントを持つワークスペースでは、ワークスペース宛の通信は仮想ネットワーク内に閉じた通信になっていましたが、ARM 宛となることでほとんどの操作がパブリック ネットワーク経由となります。  

Azure のサービスから発信する ARM 宛の通信は、基本的に Azure Global Network 内には閉じています。 また、送信される情報はメタデータ (リソース ID など) やパラメータです。 例えば、[ジョブの作成や更新](https://docs.microsoft.com/ja-jp/rest/api/azureml/jobs/create-or-update) で送信されるのは [パラメーター](https://docs.microsoft.com/ja-jp/azure/machine-learning/reference-yaml-job-command) のみとなります。 ストレージ アカウント上の情報が含まれることは無く、また TLS 1.2 を使用して暗号化されているため読み取られる危険も低いです。  

以上から、基本的にこの変更がセキュリティに影響をあたえることは無いものと考えていますが、プライベート エンドポイントを持つ **"既存の"** ワークスペースについては影響の有無の判断の時間を設けるため、`v1_legacy_mode` パラメーターを用意し、予め True がセットされています。 これにより、v1 API の操作が継続されます。 なお、v2 API を使用する場合には `v1_legacy_mode` パラメーターを False にセットする必要があります。  

※ プライベート エンドポイントを持たない **"既存の"** ワークスペースは `v1_legacy_mode` パラメーターはセットされません (v2 API が使用される設定になります)。

---
## `v1_legacy_mode` パラメーターの設定値について
基本的に `v1_legacy_mode` パラメーターの設定条件は以下の通りです。 各シナリオとは異なるバージョンの API を使用したい場合には、後述の手順で変更ください。

### `2022/4/30` 以前に作成されたワークスペースの場合
  - 既定値は True
  - プライベート エンドポイントを持つ **"既存の"** ワークスペースでは `v1_legacy_mode` パラメーターに True がセット ⇒ v1 API
  - プライベート エンドポイントを持たない **"既存の"** ワークスペースでは `v1_legacy_mode` パラメーターに False がセット ⇒ v2 API (実際には何もセットされない場合があり、既定値が適用される可能性があります。 必要に応じて `v1_legacy_mode` パラメーターを手動で更新ください。)  
  
### `2022/5/1` 以降に作成されたワークスペースの場合
  - 既定値は False
  - プライベート エンドポイントを持つ **"既存の"** ワークスペースでは `v1_legacy_mode` パラメーターに True がセット ⇒ v1 API
  - プライベート エンドポイントを持たない **"既存の"** ワークスペースでは `v1_legacy_mode` パラメーターに False がセット ⇒ v2 API
  - 新しく作成するワークスペースは `v1_legacy_mode` パラメーターに False がセット ⇒ v2 API

---
## `v1_legacy_mode` パラメーターの確認・更新方法について
Azure Machine Learning 用の CLI 拡張機能 v1 ([azure-cli-ml](https://docs.microsoft.com/ja-jp/azure/machine-learning/reference-azure-machine-learning-cli)) を使用する方法が簡単です。

- 確認方法
  ```powershell
  az ml workspace show -g <myresourcegroup> -w <myworkspace> --query v1LegacyMode
  ```

- 更新方法
  ```powershell
  az ml workspace update -g <myresourcegroup> -w <myworkspace> --v1-legacy-mode <true or false>
  ```

SDK で更新する場合には、以下のコードを実行することで更新が可能ですが、`2022/5/1` 以前に作成されたワークスペースでは実行がエラーになる場合があるため、CLI 拡張機能の使用をお勧めします。

- 更新方法
  ```Python
  from azureml.core import Workspace
  
  ws = Workspace.from_config()
  ws.update(v1_legacy_mode=False)
  ```


***
`変更履歴`  
`2022/05/18 created by Mochizuki`
`2022/05/19 modified by Mochizuki`

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  