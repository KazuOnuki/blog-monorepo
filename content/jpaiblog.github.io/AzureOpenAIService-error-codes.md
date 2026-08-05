---
title: Azure OpenAI Service の使用中に発生する可能性がある一般的なエラー コードについて
date: 2023-12-29 00:00:00
categories:
- Azure OpenAI
tags:
- Azure OpenAI
---
この記事では、Azure OpenAI Service の使用中に発生する可能性がある一般的なエラー コードの内容や原因、解決策についてご紹介します。 

<!-- more -->
<br>

***
## HTTP 400 エラー / Bad Request

このエラーは、クライアント側から送信したリクエストに問題があることを示します。  
原因として、プロンプトの誤入力、プロンプトがコンテンツフィルターによりブロックされている可能性が挙げられます。

**対処方法：** 
- クライアント側から送信したプロンプトを見直してください (Jsonペイロードの形式や、パラメーターのミススペルなど)
- [コンテンツのフィルター処理](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/concepts/content-filter?tabs=warning%2Cpython) の設定を確認し、必要に応じてレベルを調整してください。  
<br>

***
## HTTP 401 エラー / Unauthorized

このエラーは、認証に問題が発生していることを示します。  
原因として、Azure OpenAI Service へのリクエストに必要な API キーなどの認証情報に誤りがある可能性が挙げられます。  

例：リクエスト時にキーが含まれていない、キーに余分なスペースや欠落文字がある、アクセス トークンの有効期限が切れている、必要なロールが割り当てられていない  
 
**対処方法：**  
API キー 認証をご使用の場合は、リクエスト時に必要なENDPOINT, API-KEY, DEPLOYMENT-NAME が正しいかどうかをご確認ください。  
確認方法は、以下の公開情報をご参照ください。  
 
- [キーとエンドポイントを取得する | クイック スタート: Azure OpenAI Service を使用してテキストの生成を開始する](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/quickstart?tabs=command-line%2Cpython&pivots=rest-api#retrieve-key-and-endpoint ) 

Microsoft Entra ID 認証をご使用の場合は、リクエストを行うユーザーに対して、必要なロールが割り当たっているかどうかをご確認ください。 
詳細は、以下の公開情報をご参照ください。 
 
- [Cognitive Services User ロールに自分自身を割り当てる | マネージド ID を使用して Azure OpenAI Service を構成する方法](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/managed-identity)  
<br>

***
## HTTP 403 エラー / Forbidden

このエラーは、ネットワーク制限により生じている可能性があります。

**対処方法：**
- [Azure OpenAI Service リソースに設定したネットワーク設定](https://learn.microsoft.com/ja-jp/azure/ai-services/cognitive-services-virtual-networks?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext&tabs=portal#manage-default-network-access-rules) を確認します。  
<br>

***
## HTTP 404 エラー / Not Found 

このエラーは、クライアント側の要求で指定されたリソースが、サーバー側で見つけられなかったことを示します。 <br />
原因として、API エンドポイントが正しくないといったことが挙げられます。 
 
**対処方法：**
- [API リファレンス](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/reference) や SDK リファレンスを参照し、API エンドポイントの指定が正しいことを確認します
- エンドポイント指定時の必須パラメーターを確認します。 (リソース名、デプロイメントID、API バージョン (後述))
- API バージョン　(モデルバージョンとは異なります）が正しいかどうかをご確認ください。 (API エンドポイントは、指定された要求が正しく最新であることを確認するために、バージョン管理に api-version クエリ パラメーターを使用しており、サービス API のすべてのバージョンは、YYYY-MM-DD の日付構造になっています。)  

  > 例）https:// (中略) /openai/deployments/my-first-deployment/completions?api-version=**2022-12-01**  

<br>

***
## HTTP 408 エラー / Request Timeout 

このエラーは、サーバー側の応答がない、ネットワーク接続が不安定などでリクエストがタイムアウトしたことを示します。<br /> 
原因として、クライアント側のインターネット接続の速度が遅い、大きな要求の送信に時間がかかりすぎている、サーバー側に要求の処理に遅延を引き起こす何らかの問題がある、などが挙げられます。 
 
**対処方法：** 
- ご利用のインターネット環境において、リクエストを送信するのに十分な安定性と速度があることをご確認ください。そのうえで、再度リクエストを送信しエラーが解消するかどうかをご確認ください。
- 大きなクエリが送信されている場合は、要求を複数の小さなクエリに分割することをご検討ください。これにより、Azure OpenAI は情報をより効率的に処理することができ、タイムアウトの可能性が低減します。
- Chat Completions API を使用している場合は、API リクエストを行う際に stream=true を設定することを検討してください。これにより、サーバー側は、部分的な結果が利用可能になったときに送信できるため、タイムアウトの可能性が低減します。  
<br>

***
## HTTP 429 エラー / Too Many Requests

このエラーは、定義されたレート制限を超過していることや、バックエンドサービスがスケーリング中であることを示します。<br/>
原因として、モデルデプロイに割り当てられているクォーターの TPM (Tokens-per-Minute) が少ない場合や、Azure OpenAI サービスが需要に合わせてスケールアップしているときにスローされ、必要なスケールに達しなかった一時的なエラーの可能性が挙げられます。

**対処方法：** 
- モデルデプロイに対して割り当てている TPM のレート制限の変更を検討します。<br />
[Azure OpenAI Service のクォータを管理する - Azure AI services | Microsoft Learn](
https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/quota?tabs=rest#assign-quota )
  > デプロイ後は、Azure AI Studio の [管理>デプロイ] で [デプロイの編集] を選択して、TPM の割り当てを調整できます。 この選択は、新しいクォータ管理エクスペリエンスの [管理>クォータ] で変更することもできます。 
- 429エラーがスローされたときに提示される時間を空けて再度実行していただくことが必要となります。<br />
[Azure サービスの再試行ガイダンス - Best practices for cloud applications | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/architecture/best-practices/retry-service-specific )
  > 429 エラーの場合は、Retry-After ヘッダーに示されている時間が経過した後でのみ再試行してください。

**参考情報：** 
- [Azure OpenAI Service のクォータを管理する - Azure AI services | Microsoft Learn](
https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/quota?tabs=rest#introduction-to-quota )
  > デプロイが作成されると、割り当てられた TPM は、推論要求で適用される TPM (Tokens-per-Minute) のレート制限に直接マップされます。 1 分あたりの要求 (RPM) レート制限も適用され、その値は次の比率を使用して TPM 割り当てに比例して設定されます。<br><br> 1000 TPM あたり 6 RPM。<br>(*中略*)<br><br>RPM レート制限は、時間の経過と同時に受信した要求の数に基づいています。 <br>レート制限では、1 分間に要求が均等に分散されることを想定しています。 <br>この平均フローが維持されない場合、1 分間測定しても制限が満たされない場合でも、要求は 429 応答を受け取る可能性があります。<br>この動作を実装するために、Azure OpenAI Service は、短い時間 (通常は 1 秒または 10 秒) にわたる受信要求の速度を評価します。<br>その間に受信した要求の数が設定された RPM 制限で予想される数を超えた場合、新しい要求は次の評価期間まで 429 応答コードを受け取ります。<br>たとえば、Azure OpenAI が 1 秒間隔で要求レートを監視している場合、1 秒ごとに 10 件を超える要求を受信すると、600 RPM デプロイでレート制限が発生します (1 分あたり 600 件の要求 = 1 秒あたり 10 件の要求)。

- [レート制限のベスト プラクティス](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/quota?tabs=rest#rate-limit-best-practices)  
<br>

## HTTP 500 / 503 エラー / Service Unavailable 

このエラーは、サーバー側で問題が発生したことを表しており、以下のようなメッセージと共に応答されることがあります。<br />

> "Service Unavailable"

> "The server had an error while processing your request."

多くの場合、これは[一時的な (一過性の) 事象](https://learn.microsoft.com/ja-jp/azure/architecture/best-practices/transient-faults)です。Azure OpenAI Service では、多くのユーザーが同じ処理基盤を共有しており、一時的なリソースのひっ迫や処理の失敗により、これらのエラーが応答されることがあります。<br />
[デプロイの種類](https://learn.microsoft.com/ja-jp/azure/ai-services/openai/how-to/deployment-types)によらず、[サービスの可用性](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?lang=1)は 100% ではないため、この種のエラーの発生頻度をゼロにすることはできません。
 
**対処方法：** 
- 時間を空けて API 呼び出し (HTTP リクエスト) をリトライ (再試行) します。再試行が短時間に集中しないよう、[試行間隔の無作為化や指数バックオフ](https://learn.microsoft.com/ja-jp/azure/architecture/best-practices/transient-faults#determine-an-appropriate-retry-count-and-interval)を組み込むことが推奨されます。
- 再試行を繰り返しても失敗する状況が長時間継続している場合は、既知の問題の有無を[サービス正常性](https://learn.microsoft.com/ja-jp/azure/service-health/overview)で確認します。
<br>

***
`変更履歴`  
`2025-04-30 updated by Nakagami`   
`2023-12-29 created by Uehara`   

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  
