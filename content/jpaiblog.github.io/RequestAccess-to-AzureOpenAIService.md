---
title: Azure OpenAI 関連の申請について
date: 2023-04-21 00:00:00
categories:
- Azure OpenAI
tags:
- Azure OpenAI
---

**※以下は2024年1月時点の情報です。最新の状況については [Azure OpenAI Service のよくあるご質問と回答(FAQ)に関するブログ記事](https://jpaiblog.github.io/blog/2025/04/10/AzureOpenAIService-FAQ/)も併せてご参照ください。**

Azure OpenAI 関連の申請について、以下にご説明します。

<!-- more -->
<br>

***
## Azure OpenAI Service の利用開始時に行う申請

Azure OpenAI Service は申請フォーム 「[Request Access to Azure OpenAI Service](https://aka.ms/oai/access)」 より必要事項を入力して送信、承認されたサブスクリプションにて利用が可能になります。[[1]](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/limited-access)  

申請状況に関する確認はメールアドレス csgate@microsoft.com にて受け付けています。 この宛先は Azure OpenAI Service の利用申請を管理・レビューしている米国本社内の専用部門となり、公平性と独立性のために、技術サポート部門を含めた各国の他の部門はレビュープロセスに直接介入できません。 そのため、当該メールでのご質問は **英語のみ** となる点にご留意ください。  

<br>

***
## 用途に応じて行う申請

### 追加のユース ケース
利用開始申請時に選択したユース ケースとは別に、追加でユース ケースを申請する場合、申請フォーム 「[Azure OpenAI Additional Use Case Form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUM003VEJPRjRSOTZBRVZBV1E5N1lWMk1XUyQlQCN0PWcu)」 より必要事項を入力して送信ください。[[1]](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/limited-access)

### オプトアウト
弊社が定める責任ある AI の原則に従って、倫理的・社会的に問題があると考えられる利用 (abuse) を防止するために、人間によるレビューが行われる場合があります。これは要件を満たす場合にはオプトアウトすることが可能です。以下の申請フォームより必要事項を入力して送信ください。 [[1]](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/limited-access)  

- コンテンツフィルターの変更：[Azure OpenAI Limited Access Review:  Modified Content Filtering](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMlBQNkZMR0lFRldORTdVQzQ0TEI5Q1ExOSQlQCN0PWcu) 

- 不正使用監視の変更：[Azure OpenAI Limited Access Review:
Modified Abuse Monitoring](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUOE9MUTFMUlpBNk5IQlZWWkcyUEpWWEhGOCQlQCN0PWcu)

- オプトアウト申請に関する FAQ   
  > Q. オプトアウトを申請して承認されましたが、きちんと反映されているか確認したいです。確認方法はありますか？  
  > A. はい、確認方法があります。   
  > Abuse Monitoring は "ContentLogging" の項目が"false"となっているかを参照することで確認可能です。[[2]](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy#how-can-a-customer-verify-if-data-storage-for-abuse-monitoring-is-off)  
  > Content Filtering については Azure OpenAI Studio [管理]->[Content Filters]よりFilteringをオフに設定可能かどうかで確認可能です。[[6]](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/content-filters#configuring-content-filters-via-azure-openai-studio-preview)  
  ![contentFiltering-01](https://jpaiblog.github.io/images/RequestAccess-to-AzureOpenAIService/contentFiltering-01.png "contentFiltering-01")  

### クォータの引き上げ
Azure OpenAI には、適用されるクォータによる制限があります。 この引き上げを希望する場合、Azure OpenAI Studio の [管理 > クォータ > クォータの要求] の申請フォーム 「[Azure OpenAI Service: Request for Quota Increase](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR4xPXO648sJKt4GoXAed-0pUMFE1Rk9CU084RjA0TUlVSUlMWEQzVkJDNCQlQCN0PWcu)」 より必要事項を入力して送信ください。[[3]](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/quota?tabs=rest#view-and-request-quota)  

- 2023/05/23現在の状況    
  > Azure OpenAI Service は世界中から非常に高い需要が続いています。  
  > そのため、大変恐れ入りますがリソースまたはクォータの制限を引き上げる要求は、現在受付を停止しています。  
  > 受付が再開される時期については、今後の更新をお待ちいただけますと幸いです。 

- 2023/10/19現在の状況    
  > クォータの引き上げ要求の受付は再開されました。  
  > 最新の状況については [Azure OpenAI Service のクォータと制限](https://learn.microsoft.com/en-us/azure/ai-services/openai/quotas-limits#how-to-request-increases-to-the-default-quotas-and-limits)のドキュメントをご参照ください。[[5]](https://learn.microsoft.com/en-us/azure/ai-services/openai/quotas-limits#how-to-request-increases-to-the-default-quotas-and-limits) 

### GPT-4 モデル

以前は、GPT-4モデルを利用するためには申請が必要でしたが、2023年10月19日現在、申請は不要となりました。しかし、GPT-4モデルへの高い需要のため、Azure OpenAI Serviceが利用できるすべてのリージョンでGPT-4モデルが利用可能なわけではなく、利用できるリージョンは限られています[[4]](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models) 。使用中のリージョンでGPT-4が表示されない場合は、時間を置いて再度確認をお願いします。

### Azure OpenAI on your data のプライベート ネットワークのサポート
Azure OpenAI on your dataにてプライベートネットワークの利用を可能にする場合、申請フォーム 「[Apply Azure AI Search Private Endpoint Request for Azure OpenAI on Your Data](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbRw_T3EIZ1KNCuv_1duLJBgpUMUcwV1Y5QjI3UTVTMkhSVUo3R09NNVQxSyQlQCN0PWcu)  」 より必要事項を入力して送信ください。[[7]](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/use-your-data-securely#inbound-security-networking-1)  

<br>

***
## 関連ドキュメント

- [[1]: Limited access to Azure OpenAI Service - Azure Cognitive Services | Microsoft Learn](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/limited-access)  

- [[2]: Data, privacy, and security for Azure OpenAI Service - Azure Cognitive Services | Microsoft Learn](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy?context=%2Fazure%2Fcognitive-services%2Fopenai%2Fcontext%2Fcontext)  

- [[3]: Manage Azure OpenAI Service quota - Azure AI services | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/quota?tabs=rest#view-and-request-quota)  

- [[4]: Azure OpenAI Service models - Azure OpenAI | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#gpt-4-models)  

- [[5]: Azure OpenAI Service quotas and limits - Azure Cognitive Services | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/openai/quotas-limits#how-to-request-increases-to-the-default-quotas-and-limits)   

- [[6]: How to use content filters (preview) with Azure OpenAI Service - Azure OpenAI | Microsoft Learn](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/content-filters)  

- [[7]: Using your data with Azure OpenAI securely - Azure OpenAI | Microsoft Learn](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/use-your-data-securely#inbound-security-networking-1)  

- 申請関連の FAQ については、以下のドキュメントも参考になります。  
  [Cognitive Services の制限付きアクセス機能 - Azure Cognitive Services | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/cognitive-services/cognitive-services-limited-access#faq-about-limited-access)
  > 制限付きアクセスに関する FAQ  
  > : 中略  
  > Q.制限付きアクセスのサービスを使用する資格があるのはだれですか?  
  > Q.管理下の顧客とは? 管理下の顧客に該当するかどうかがわからない場合はどうすればよいですか?  
  >Q.申請が拒否された場合、私のデータはどうなりますか?  

<br>

***
`変更履歴`  
`2023/04/21 created by Kudou`  
`2023/05/23 update  by Kudou`  
`2023/07/04 update  by Kudou`   
`2023/08/18 update  by Kudou`   
`2023/10/19 update  by Kudou`   
`2024/01/05 update  by Uehara`  
`2025/04/15 add link  by Nakagami`  

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  
