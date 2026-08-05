---
title: Azure OpenAI Service に対するアクセス制御について
date: 2023-07-28 00:00:00
categories:
- Azure OpenAI
tags:
- Azure OpenAI
---
この記事は、Azure OpenAI Service に対するアクセス制御についてご紹介します。

<!-- more -->
<br>



***

## Azure OpenAI Service にて仮想ネットワークを構成する

Azure OpenAI Service は、他の Cognitive Services と同様、アクセス元を「特定の IP アドレス範囲」または「仮想ネットワーク」に限定することが可能です。  
詳細につきましては、以下のドキュメントをご参照ください。

- [Configure Virtual Networks for Azure Cognitive Services](https://learn.microsoft.com/en-us/azure/cognitive-services/cognitive-services-virtual-networks?tabs=portal)

  > Azure Cognitive Services は、多層型のセキュリティ モデルを採用しています。   
  > このモデルでは、ネットワークの特定のサブセットに、Cognitive Services アカウントを固定することができます。  
  > ネットワーク ルールを構成すると、指定したネットワークのセットを経由してデータを要求しているアプリケーションのみが、アカウントにアクセスできます。

なお、Azure OpenAI Service のエンドポイントのホスト名は以下となります。
```
<リソース名>.openai.azure.com
```
すべての Azure OpenAI Service リソースのエンドポイントは、リソース名以外が共通のため、リソース名が Azure 全体( Global )で一意である必要があります。

## Azure OpenAI Studio をプライベート エンドポイント接続にて使用するには
<!-- TrackingID#2305100060000313 -->

Azure OpenAI Service は、前述のアクセス元の制限に加え、プライベート エンドポイント利用をサポートしています。  
プライベート エンドポイントを利用する場合、 Azure OpenAI Service の エンドポイント (*.openai.azure.com )　へのアクセスを仮想ネットワーク内のクライアントに限定することが可能です。  
ただし、留意点として、Azure OpenAI Studio(https://oai.azure.com/)  へのアクセスでは、プライベートではない一定範囲のパブリック IP アドレスでネットワーク アクセスが必要となります。  

具体的には、Azure OpenAI Studioへアクセスするクライアントマシンのデプロイ先サブネットに紐づく NSG 及び Firewall にて、以下のドキュメントに記載されているサービスタグを許可する必要があります。  

- [Configure Virtual Networks for Azure Cognitive Services](https://learn.microsoft.com/en-us/azure/cognitive-services/cognitive-services-virtual-networks?tabs=portal)
  > Azure OpenAI、LUIS、Speech Services、または言語サービスを使用している場合、CognitiveServicesManagement タグを指定しても、SDK または REST API を使用してサービスを使用できるようになるだけです。   
  > 仮想ネットワークから Azure OpenAI Studio、LUIS ポータル、Speech Studio または言語サービスにアクセスして使用するには、次のタグを使用する必要があります。  
  > ･ AzureActiveDirectory  
  > ･ AzureFrontDoor.Frontend  
  > ･ AzureResourceManager  
  > ･ CognitiveServicesManagement  
  > ･ CognitiveServicesFrontEnd   


<!-- - [Azure OpenAI Service を Private Endpoint 経由で利用する](https://blog.aimless.jp/archives/2023/04/use-azure-openai-service-with-privateendpoint/)  
※弊社社員が有志で執筆した記事となります。 -->

Azure OpenAI Studio は、Azure OpenAI Service の機能 (HTTP REST API) を簡便に試すための、簡易な (サンプル) アプリケーションという扱いになります。   
Azure OpenAI Studio の Web サイトそのものは、特定のユーザーやリソースに紐づかない、パブリックな Web サイトとして公開されています。  
そのため、Azure OpenAI Studio の Web サイトの表示に必要なリソース (画像や JavaScript 等) のダウンロードはプライベート エンドポイント経由とはなりません。

## 特定の国からのアクセス制御について
<!-- TrackingID#2305240060001683 -->

Azure OpenAI Service は、特定の国からのアクセスを制限するような、内部的なアクセス制御を行っておりません。  
エンドポイントは、パブリックなインターネット経由 (すなわちインターネット上で到達可能なグローバル IP アドレスから) のアクセスを全て許可します。  
一方で、実際のアクセス可否は、特定の国のネットワーク制限 (例. Great Firewall of China) や法規制に左右されます。特定の地域やネットワーク環境下におけるアクセス可否は、お客様側で現地にてご確認いただく必要があります。  
ご参考 :  [Azure Virtual WAN とセキュリティ保護付きハブを使用した中国との相互接続](https://learn.microsoft.com/en-us/azure/virtual-wan/interconnect-china)


***
`変更履歴`  
`2023/07/28 created by Kudou`   

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  
