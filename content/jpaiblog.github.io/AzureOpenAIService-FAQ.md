---
title: Azure OpenAI Service に関する FAQ
date: 2025-04-10 00:00:00
categories:
- Azure OpenAI
tags:
- Azure OpenAI
---
この記事では、Azure OpenAI Service に関して [Azure サポート](https://learn.microsoft.com/ja-jp/azure/azure-portal/supportability/how-to-create-azure-support-request) によくお問い合わせいただくご質問と回答 (FAQ) をまとめています。

<!-- more -->
<br>

***
# (1) 制限付きアクセス (Limited Access) について

Azure OpenAI Service には制限付きアクセス ([Limited Access](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/limited-access)) のため、利用に事前の申請が必要なケースがあります。例:

- 新しくリリースされた制限付きアクセスのモデル (例: computer-use-preview) の利用
- Modified Content Filtering の有効化
- Modified Abuse Monitoring の有効化

Limited Access の申請・審査のプロセスは、マイクロソフト本社の特別な部門が管理しています。そのため Azure ポータルからのお問い合わせでは回答できません。申請フォームに記載のメールアドレス **csgate@microsoft.com** にご連絡ください。
また **csgate@microsoft.com** へのお問い合わせは **英語のみ** での対応となりますのでご留意ください。

## Q&A
### Q:

- 申請フォームに記載するべき内容について確認したい。
- 申請が受理・承認されるまでの時間の目安を知りたい。
- 申請フォームからアクセスをリクエストしたが応答が無いため状況を確認したい。
- 申請が拒否されたのでその理由を知りたい・再審査を要求したい。
- Content Filtering / Abuse Monitoring について "オプトアウト" をリクエストしたい。 (注: マイクロソフトのドキュメントでは "オプトアウト" という単語は使用していません)

A. 申請フォームに記載のメールアドレス **csgate@microsoft.com** にご連絡ください。Azure ポータルからのお問い合わせでは回答できません。

<br>

***
# (2) クォータ申請について

Azure OpenAI Service では多くのお客様にご利用いただけるよう、利用量の上限 ([クォータ](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/quota)) が設けられています。TPM / RPM やユニット数に関する既定のクォータが不足する場合は、[専用のフォームから引き上げをリクエスト](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/quotas-limits#how-to-request-quota-increases)することができます。

## Q&A

### Q. Azure サポートに TPM / RPM のクォータ引き上げを依頼したい。
A. Azure サポートを通じたクォータ引き上げリクエストはお承りしておりません。上記の通り専用のフォームからリクエストいただけます。

### Q.申請フォームに記載するべき内容について確認したい。
A. 正式な見解は専門の部署 ( msazureopenai@microsoft.com ) にご連絡ください。Azure ポータルからのお問い合わせでは回答できません。

### Q. 申請できるクォータの上限を知りたい。承認されるかどうか事前に確認したい。
A. Azure サポートでは承認可否を事前に確認することはできません。実際に必要なクォータをフォームからリクエストいただくことをご検討ください。申請フォームでリクエスト可能な数量を超える場合、マイクロソフトのアカウント担当者 (以下、"アカウント チーム") にお問い合わせください。

### Q. クォータの申請が受理・承認されるまでの時間の目安を知りたい。
A. クォータの引き上げ申請は Azure サポートではなく、専門の部署 (msazureopenai@microsoft.com) で審査されています。申請は受け付けた順に処理されます。リードタイムに関する保証はありません。

### Q. クォータの引き上げをリクエストしたが応答が無いため状況を確認したい。
A. Azure サポートでは申請の状況を確認したり、加速したりすることはできません。申請受領の応答メールにある担当部門の連絡先 (msazureopenai@microsoft.com, 英語のみ) にお問い合わせいただくことをご検討ください。
また個別の審査状況についてビジネス面からの優先対応をご要望の場合はアカウント チームへご相談ください。

[申請フォーム](https://aka.ms/oai/quotaincrease)より抜粋:

```
Azure Technical Support cannot be used to expedite the submission process.
```

### Q. クォータ引き上げのリクエストが拒否された。
A. Azure OpenAI Service は世界中から需要があるため、リクエストされた内容 (リージョン・デプロイの種類・数量) によってはお承りできない場合があります。リクエスト内容を変更して再度申請いただくことをご検討ください。Azure サポートでは具体的な理由の説明や再審査のリクエストは受付できません。もし同じ内容での再審査をご希望の場合はアカウント チームへご相談ください。

### Q. Provisioned のデプロイで 1000 ユニットを超えるクォータをリクエストしたい。
A. 申請フォームでリクエスト可能な数量を超える場合、アカウント チームにお問い合わせください。

### Q. TPM / RPM のクォータ変更をリクエストをしていないがクォータの上限が変更された。
A. クォータの上限は変更される可能性があります。変更後のクォータで不足する場合は上記の通り専用のフォームからリクエストいただけます。

- 参考: [Manage Azure OpenAI Service quota](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/quota?tabs=rest#assign-quota)
```
Important
Quotas and limits are subject to change, for the most up-date-information consult our quotas and limits article.
```

### Q. CSP サブスクリプションでは誰が申請するべきか？パートナーか、エンドユーザーか？
A. 
原則としてはサブスクリプションの種類によらず、リクエスト対象の Azure サブスクリプションについて[契約](https://azure.microsoft.com/ja-jp/support/legal/)上の責任を負う方から申請いただくことを想定しています。Azure サポートでは個別のケースについて具体的な入力内容のアドバイスをすることはできません。

<br>

***

# (3) サンプルの Web アプリについて

[Azure OpenAI Studio](https://oai.azure.com/) や [Azure AI Foundry](https://ai.azure.com/) のチャット プレイグランドでは、 [サンプルの Web アプリ](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/use-web-app)をデプロイすることができます。この Web アプリはサンプルであり、マイクロソフトが動作を保証するものではありません。お客様ご自身が独自に開発されたアプリケーションと同じ扱いになります。このサンプルのサポートについては [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/blob/main/SUPPORT.md) に記載されています。

## Q&A

### Q. デプロイされた Web アプリにアクセスできない。
A. Web アプリケーションのどこで問題が発生しているのか (例. Entra ID 認証がエラーになる) についてはお客様側で切り分けが必要です。ソースコードは [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main) でご確認いただけます。

### Q. Web アプリで操作 (例. チャットのメッセージ送信) を行うとエラーになる。
A. お客様側で Web アプリの実装に依存しないことが切り分けされている (例. curl で呼び出した場合でも再現することを確認している) 場合は、具体的にエラーになっているサービス・API について Azure サポートで調査を支援することは可能です。

### Q. 環境変数を変更したが期待する動作にならない。
A. サンプルコードの問題は [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/blob/main/SUPPORT.md) の Issues で報告いただけます。サンプルコードの調査・デバッグは Azure サポートの対応範囲外です。

### Q. 仮想ネットワークに統合してプライベート エンドポイント経由でアクセスできるようにしたい。
A. 各サービスのネットワークに関連した機能についてそれぞれご確認ください。このサンプルを前提とした手順や構成例は用意されていません。

Azure OpenAI Service、特に On-Your-Data をご利用の場合に、ネットワークを制限 (いわゆる "閉域化") を行う方法については、[ドキュメント](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/on-your-data-configuration)が用意されています。それぞれの製品 (例. [App Service の仮想ネットワーク統合](https://learn.microsoft.com/ja-jp/azure/app-service/overview-vnet-integration)) の具体的な設定に関するお問い合わせは対象のサービス・リソースを選択して Azure ポータルからご起票ください。

### Q. サンプルの Web アプリで可能なことを確認したい。
A. Web アプリの実装や機能に関する解説は Azure サポートでは行っておりません。具体的な実装は [GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main) をご確認ください。

### Q. Web アプリの表示を変更したい・機能を追加したい。
A. お客様個別のご要件に応じた設定のアドバイスや、カスタマイズされたコードの提供は Azure サポートでは行っておりません。[GitHub](https://github.com/microsoft/sample-app-aoai-chatGPT/tree/main) のソースコードを元に必要な変更を行ってください。

<br>

***

# (4) 新しいモデル・機能やリージョンの利用可否について

将来のリリース予定については、一般に公開 (マイクロソフト公式のドキュメントやブログで広くアナウンス) されていない限り、ビジネス上の機密情報に当たるため、Azure サポートでは回答できません。

## Q&A
### Q:

- Preview の機能が GA (一般公開) となる時期を知りたい。
- OpenAI が発表した新機能が Azure OpenAI Service でいつ利用できるようになるのか。
- OpenAI の新しいモデルを Azure で利用したいが提供予定を教えてほしい。
- あるリージョン (例. 東日本) で特定のモデル・バージョン・デプロイの種類が利用できるようになる時期を知りたい。
- [データの所在地](https://azure.microsoft.com/en-us/explore/global-infrastructure/data-residency/)に要件があるため [Standard のデプロイ](https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/deployment-types#standard)で利用したい。Standard のデプロイで利用できるようになる予定はあるか。
- 提供終了 (Retirement) が予定されているモデルについて、後継のモデルがリリースされる予定や時期を知りたい。
- 提供終了となるモデルでのみサポートされている機能が、今後は新しいモデルでもサポートされるようになるか。
- モデルの提供終了予定日について、公開ドキュメントや Azure AI Foundry の日付よりも詳細な情報はあるか。

A. 公開情報でのアナウンスをお待ちください。

Azure OpenAI Service や Azure AI Foundry のリリース情報は[製品開発部門のブログ](https://azure.microsoft.com/en-us/blog/category/ai-machine-learning/)でもご確認いただけます。

### 補足: ドキュメントの更新について

[リージョンやモデルの利用可否を列挙している公開ドキュメント](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models)は手動で更新されており、最新の状況が反映されていない場合があります。また Limited Access のため一部のサブスクリプションに限定して提供されている場合もあります。

そのため実際に利用可能なモデル・バージョン・リージョン・デプロイの種類に関する最新の情報は、ご利用の Azure サブスクリプションで [Models - List](https://learn.microsoft.com/en-us/rest/api/aiservices/accountmanagement/models/list?view=rest-aiservices-accountmanagement-2024-10-01&tabs=HTTP) の API を使用してご確認いただくことが推奨されます。
 
- Azure CLI での実行例 (リージョン: japaneast の場合):
```
$ az rest -m get -u "/subscriptions/YOUR_SUBSCRIPTION_ID/providers/Microsoft.CognitiveServices/locations/japaneast/models?api-version=2024-10-01" 
 
 ...
     {
      "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/providers/Microsoft.CognitiveServices/locations/JapanEast/models/OpenAI.gpt-4.1.2025-04-14",
      "kind": "AIServices",
      "location": "JapanEast",
      "model": {
...
        "name": "gpt-4.1",
        "skus": [
          {
...
            "name": "GlobalStandard",
...
          },
          {
...
            "name": "ProvisionedManaged",
...
          },
...
      "name": "OpenAI.gpt-4.1.2025-04-14",
      "skuName": "S0",
      "type": "Microsoft.CognitiveServices/locations/models"
    },

```

Azure CLI については Azure ポータルの [Cloud Shell](https://learn.microsoft.com/ja-jp/azure/cloud-shell/overview) でも利用できます。

また、[モデルの提供終了](https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/model-retirements)のドキュメントについても同様に手動で更新されているため、Azure AI Foundry の Web ポータルで確認できる最新の情報とは日付が異なる場合があります。Azure AI Foundry と同じ情報は [Accounts - List Models](https://learn.microsoft.com/en-us/rest/api/aiservices/accountmanagement/accounts/list-models?view=rest-aiservices-accountmanagement-2024-10-01&tabs=HTTP) や [Models - List](https://learn.microsoft.com/en-us/rest/api/aiservices/accountmanagement/models/list?view=rest-aiservices-accountmanagement-2024-10-01&tabs=HTTP) の API で取得することができます (注: プロパティ名は `deprecation` となっていますが、実際は Retirement を表します)。

<br>

***

# (5) 利用契約や関連法規について

Azure の **技術 (テクニカル)** サポートは API 呼び出し時のエラーなど、何らか技術的な問題が発生した際のトラブルシューティングや修正 (break fix) を支援するものです。 Azure サポートでは利用規約や法規に関するご質問、例えば法律的な解釈や法務的なアドバイスを差し上げることはできません。

## Q&A

### Q. 現在想定している使い方は利用規約の観点から問題無いか。
A. Azure サポートでは個別の利用シナリオについて可否を判断することはできません。関連する利用規約や法規に照らした場合に問題無いかどうかは、必要に応じて専門家 (法務部門や顧問弁護士など) を交えて、ユーザー側の責任でご判断いただく必要があります。

### Q. Azure OpenAI Service の準拠法・管轄裁判所について教えてほしい。
A. Azure OpenAI Service は [Azure サブスクリプションの契約](https://azure.microsoft.com/ja-jp/support/legal/)に基づいて提供されます。準拠法や管轄裁判所は Azure OpenAI Service 固有ではなく、Azure サブスクリプションの契約で規定されているため、契約内容をご確認ください。


### Q. Azure OpenAI Service で日本国外のリージョンを使用する場合、個人情報保護法で規定された第三者提供に当たるのか。
A. 関連する利用規約やドキュメントを元にユーザー側でご判断ください。

- Azure OpenAI Service に限らず、多くの Azure サービスにおける顧客情報の取り扱いについては、サブスクリプションの利用開始時に同意されている[契約条項]((https://azure.microsoft.com/ja-jp/support/legal/))が適用されます。
- 顧客情報の取り扱い (例. EU の GDPR への準拠等) については、["Microsoft 製品およびサービス データ保護補遺" (Microsoft Products and Services Data Protection Addendum , DPA)](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) に規定されています。
- Azure OpenAI Service については製品固有の利用条件 ([Product Terms](https://go.microsoft.com/fwlink/?linkid=2185110)) があり、例えば [Abuse Monitoring](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/abuse-monitoring) について規定されています。
- 具体的な Azure OpenAI Service における顧客情報の取り扱いについては [Data, privacy, and security for Azure OpenAI Service](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/data-privacy) でも説明されています。

これらに照らした場合に、想定されている利用方法が日本の個人情報保護法の観点で問題があるかどうかについては、Azure サポートでは回答できません。必要に応じて専門家 (法務部門や顧問弁護士など) にご相談ください。

また公開情報に記載が無い、製品の内部仕様については回答できません。内部仕様は予告無く変更される可能性があるため、法務的な判断に利用することは推奨できかねます。


### Q. Azure OpenAI Service を使用して生成されたテキストや画像の著作権はサービスの利用者に帰属するのか。
A. ユーザーが Azure OpenAI Service を利用して生成したテキストや画像は顧客データです。一方これは生成物の知的財産権 (例.著作権) がユーザーに帰属することをマイクロソフトが約束するものではありません。

「AI が生成したものに著作権が認められるのかどうか？」は各国や地域の法律、また具体的な事例によっても判断が異なっています。例えば日本では文化庁が[生成 AI と著作権に関するガイドライン (外部リンク)](https://www.bunka.go.jp/seisaku/chosakuken/aiandcopyright.html)を公開しています。

想定されている利用方法で知的財産権に関する問題が無いかどうかは、必要に応じて専門家 (例. 著作権を専門とする弁護士) にご相談ください。

補足として、Customer Copyright Commitment (CCC) は「知的財産権 (intellectual property) に限って、もし第三者から権利侵害の申し立てがあった場合に、一定の要件を満たせば、マイクロソフトがお客様に代わって防御 (defend) する」という規定です。知的財産権の帰属を担保するものではありません。

- 製品条項 (Product Terms) の規定より抜粋:
```
Customer Copyright Commitment
Microsoft’s obligation to defend Customer against third-party intellectual property claims under Customer’s volume licensing agreement will apply to Customer’s use or distribution of Output Content of a Covered Product if all the following additional conditions are met:
```

- [Microsoft Customer Agreement](https://www.microsoft.com/licensing/docs/customeragreement) の日本語ドキュメントより抜粋:
```
第三者からの申し立てに対する防御
 
両当事者は、本条に規定する第三者からの申し立てについて、他方当事者を防御し、敗訴の確定判決または他方当事者が承認した和解によって生じた金員を支払うものとします。ただし、防御を行う当事者が、当該申し立てについて速やかに書面で通知を受け、その防御および和解を管理する決定権を与えられた場合に限ります。防御される当事者は、防御を行う当事者に対し、要請されたすべての支援、情報および権限を提供しなければなりません。防御を行う当事者は、他方当事者が支援の提供のために現実に支出した合理的な経費を補償します。本条は、かかる申し立てにおける両当事者の唯一の権利および全責任について規定するものです。
```

### Q. Customer Copyright Commitment (CCC) について[適用条件](https://learn.microsoft.com/en-us/legal/cognitive-services/openai/customer-copyright-commitment)を満たすために十分と言えるかどうか判断してほしい。
A. 条件に準拠していることはユーザー自身が判断して示す必要があります。

例えば "Testing and Evaluation Report" の項目について、現在実施している内容が十分かどうかは関連するドキュメントに照らしてユーザーが判断する必要があります。

もしコンテンツ フィルターなどの技術的な設定で問題がある場合は Azure サポートで対応できます。


- 参考: [Azure OpenAI Service に関してよく寄せられる質問](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/faq)
```
Customer Copyright Commitment に基づくカバレッジを取得するにはどうすればよいですか?
Customer Copyright Commitment は、2023 年 12 月 1 日の Microsoft の製品条項に含まれる規定であり、出力コンテンツに関連する特定のサードパーティの知的財産権に関するクレームから顧客を保護するための Microsoft の義務を説明するものです。 クレームの対象が Azure OpenAI Service (または顧客が安全システムを構成できる他の対象製品) から生成された出力コンテンツである場合は、カバレッジを受けるために、顧客は出力コンテンツを提供するオファリングで Azure OpenAI Service ドキュメントで必要とされるすべての軽減策を実装している必要があります。 必要な軽減策については、こちらに記載されており、継続的に更新されています。 新しいサービス、機能、モデル、またはユース ケースの場合、新しい CCC 要件が投稿され、そのようなサービス、機能、モデル、またはユース ケースの開始時または開始後に有効になります。 それ以外の場合、CCC のカバレッジを維持するために、顧客は公開から 6 か月以内に新しい軽減策を実装することになります。 顧客がクレームを申し立てる場合、その顧客は関連する要件への準拠を示す必要があります。 これらの軽減策は、Azure OpenAI Service を含め、顧客が安全システムを構成できる対象製品に必要です。他の対象製品を使っている顧客のカバレッジには影響しません。
```

<br>

***
`変更履歴` 
`2025/12/26 updated by Nakagami`  
`2025/04/10 created by Nakagami`  

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  