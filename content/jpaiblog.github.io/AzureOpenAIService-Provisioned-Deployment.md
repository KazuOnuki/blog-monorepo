---
title: Azure OpenAI Service の Provisioned デプロイについて
date: 2024-08-29 00:00:00
categories:
- Azure OpenAI
tags:
- Azure OpenAI
---
この記事では、 Azure OpenAI Service のデプロイの種類のひとつである Provisioned (プロビジョニング済み) について説明します。
<!-- more -->
<br>

***
## Provisioned (プロビジョニング済み) のデプロイの概要

Azure OpenAI Service では、モデルをデプロイする際に[デプロイの種類](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/deployment-types)を選択します。その中で今回紹介するのは "プロビジョニング済み" (Provisioned または Provisioned-managed) のデプロイです。

[2024年8月の更新](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/concepts/provisioned-migration)により、広く一般に Provisioned のデプロイが利用できるようになりました (それ以前は、Microsoft のアカウントチームを通じて個別でリクエストが必要でした)。これに伴い、利用方法や料金体系も変更となっています。

### 新しい Provisioned のポイント
1. ユーザーは[割り当てられたクォータ](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/concepts/provisioned-throughput#model-independent-quota)の範囲で、デプロイの種類:Provisioned-managed のデプロイを作成することができます
2. Provisioned-managed のデプロイを作成すると、**ユニット数および利用時間に応じた課金が発生します** (処理されたトークン数に基づく従量課金ではありません)
3. (必要に応じて) 月単位または年単位で予約 (Reservation) を購入することで料金が割り引かれます
4. 時間単位の課金を停止するにはデプロイを削除します

### 時間単位の課金について
Provisioned のデプロイでは、指定されたユニット (Provisioned Throughput Unit, PTU) の数に応じて、ハードウェアの処理容量 (キャパシティ) が占有されます。これにより、トークン数に応じた従量課金 (Standard, Global Standard) のデプロイよりも安定したパフォーマンスが見込める一方で、高性能なハードウェアを占有するために比較的高い単価となっています (1 ユニット、 1 時間当たり 2 USD など)。また、モデル毎に最低ユニット数が決まっており、例えば gpt-4o mini であれば 25 PTU が最小単位であるため、時間単位の課金では最低でも 25 * 2 = **50 USD** が 1 時間ごとに課金されます。
※最新の価格は[Azure OpenAI Service の価格](https://azure.microsoft.com/ja-jp/pricing/details/cognitive-services/openai-service/)をご参照ください。

### 利用可能なリージョンやモデルについて
リージョンやモデル、バージョンによって、Provisioned のデプロイの利用可否は異なります。例えば、東日本リージョンでは gpt-4o は Standard では提供されていませんが、Provisioned であれば提供されています。最新の提供状況については[Azure OpenAI Service models](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models)をご参照ください。


### デプロイ時の表示について
Azure OpenAI Studio からモデルをデプロイする際には、デプロイの種類は Provisioned-managed と表示されます。また、指定されたユニット数に応じた時間単位の課金額の見込みも確認できます。

- Azure OpenAI Studio での表示例:

<img src="https://jpaiblog.github.io/images/AzureOpenAIService-Provisioned-Deployment/create-new-deployment.png" width=800px>  

## Provisioned のデプロイを制限する方法
Azure サブスクリプションで Provisioned のデプロイを作成できないように制限する必要がある場合は、[Azure Policy](https://learn.microsoft.com/ja-jp/azure/governance/policy/overview) により利用可能なデプロイの種類を限定できます。


- Provisioned のデプロイを禁止するポリシー定義の例:
```
{
    "policyRule": {
        "if": {
            "allOf": [
                {
                    "field": "type",
                    "equals": "Microsoft.CognitiveServices/accounts/deployments"
                },
                {
                    "field": "Microsoft.CognitiveServices/accounts/deployments/sku.name",
                    "equals": "ProvisionedManaged"
                }
            ]
        },
        "then": {
            "effect": "Deny"
        }
    }
}
```

- ポリシーにより操作がブロックされた場合の表示例:

<img src="https://jpaiblog.github.io/images/AzureOpenAIService-Provisioned-Deployment/blocked-by-policy.png" width=500px>  

- 参考 1. [チュートリアル:コンプライアンスを強制するポリシーの作成と管理 - 新しいカスタム ポリシーを実施する](https://learn.microsoft.com/ja-jp/azure/governance/policy/tutorials/create-and-manage#implement-a-new-custom-policy)
- 参考 2. [クイックスタート: Azure portal を使用して、ポリシーの割り当てを作成し、準拠していないリソースを特定する - ポリシー割り当てを作成する](https://learn.microsoft.com/ja-jp/azure/governance/policy/assign-policy-portal#create-a-policy-assignment)




以上は2024年8月29日時点の情報です。日本語での表示名等は今後変わる可能性があります。最新の情報は[公式ドキュメント](https://learn.microsoft.com/en-us/azure/ai-services/openai/)を併せてご参照ください。

***
`変更履歴`  
`2024-08-29 created by nakagami`  

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  