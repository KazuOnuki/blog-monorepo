---
title: QNA Maker の管理サービス (Cognitive Services リソース) のリージョンについて
date: 2020-03-03 00:00:00
categories:
- QNA Maker
tags:
- 管理サービス
---
QNA Maker の管理サービス (Cognitive Services リソース) についてご紹介します。
<!-- more -->
<br>

***
QnA Maker サービスの全体構成は下記ドキュメントの図を参照ください。  
 
- [QnA Maker 用の Azure リソース](https://docs.microsoft.com/ja-jp/azure/cognitive-services/qnamaker/concepts/azure-resources)

   ![QNA Maker](https://jpaiblog.github.io/images/QNA-management-service/key-management.png)  

Cognitive Services としてのリソースは、図中の右上の QnA Maker Subscription に相当します。例えば、ポータルを操作して KB を編集した場合、米国西部リージョンにおいてホストされている API 群が呼び出されます (5. Manage KB in portal or via APIs)。この API 群を別リージョンに移行することができないため、[こちらのサイト](https://docs.microsoft.com/ja-jp/azure/cognitive-services/qnamaker/concepts/azure-resources#management-service-region) の記載の通り、Cognitive Services リソースは米国西部リージョン固定になります。  

米国西部リージョンにある API のバックエンドから、Web Apps 上でホストされた QnA Maker ランタイムに対してアクセスし、Q&A の追加や削除といった操作が行われます。なお、実際の KB のコンテンツ (Q&A、メタデータ等) は Azure Search に保存されており、ユーザーのチャットログは Application Insights に保存されているため、顧客データは米国西部リージョンには保存されません。  

※ 管理サービスで使用する API の詳細は以下サイトを参照ください。  
 
- [QnA Maker V4.0](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)  

KB を公開した後の、ボット等のアプリケーションからの問い合わせ (4. User QnA endpoint in Bot) は GenerateAnswer API が使用されます。これは QnA Maker ランタイム (Web Apps) に対して直接アクセスするため、米国西部リージョンを経由することはありません。

※ GenerateAnswer API の詳細は以下サイトをご参照ください。  
 
- [GenerateAnswer API およびメタデータを使って回答を取得する](https://docs.microsoft.com/ja-jp/azure/cognitive-services/qnamaker/how-to/metadata-generateanswer-usage?tabs=v1)  
***
`変更履歴`  
`2020/03/03 created by Mochizuki`  