---
title: Azure Private Link を使用して、Private Endpoint 経由で Cognitive Services にアクセスする方法
date: 2020-11-11 00:00:00
categories:
- Cognitive Services
tags:
- Cognitive Services
---

 
Azure Private Link を使用して、Private Endpoint 経由で Cognitive Services にアクセスする方法を解説します。  
<!-- more -->
<br>

Private Link を使用した場合、Cognitive Services のリソースを、 パブリック インターネットに 公開せずに利用できるメリットがあります。  
（Private Link を使用した、より実際的なシステム構成については、[Azure ネットワーク サービスの概要：Azure Private Link](https://docs.microsoft.com/ja-jp/azure/networking/networking-overview#azure-private-link) のドキュメントをご参照ください）  
本稿では、サンプルとして以下の図のような構成を設定する手順をご紹介します。

![endpoint01](https://jpaiblog.github.io/images/use-private-endpoints/endpoint01.jpg "endpoint01")  

1. [CognitiveServices：サポート状況を確認](#1.CognitiveServices：サポート状況を確認)
1. [CognitiveServices：リソースを作成](#2.CognitiveServices：リソースを作成) 
1. [CognitiveServices：通常の疎通を確認](#3.CognitiveServices：通常の疎通を確認) 
1. [VNET,Bastion host,およびPrivateEndpoint：リソースを作成](#4.VNET,Bastionhost,およびPrivateEndpoint：リソースを作成) 
1. [PrivateEndpoint：接続情報の確認](#5.PrivateEndpoint：接続情報の確認) 
1. [CognitiveServices：ネットワークを制限](#6.CognitiveServices：ネットワークを制限) 
1. [PrivateEndpoint+CognitiveServices：アクセスを確認](#7.PrivateEndpoint+CognitiveServices：アクセスを確認) 

<br>

***

# 1.CognitiveServices：サポート状況を確認
Cognitive Services のサービスのうち、仮想ネットワーク対応しているサービスを下記のドキュメントのリストで確認します。  
本稿では、翻訳サービスの Translator API を例として取り上げ、構成を設定していきます。

- [Configure Azure Cognitive Services virtual networks：Supported regions and service offerings](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-virtual-networks?tabs=portal#supported-regions-and-service-offerings)

2020年11月現在、全てのサービスが対応している状況ではないことにご留意ください。

***
# 2.CognitiveServices：リソースを作成
マルチサービスリソースでは、Private Link が利用できません。
以下のリンクから 単一サービスリソースを作成します。

- [クイックスタート: Azure portal を使用して Cognitive Services リソースを作成する：新しい Azure Cognitive Services リソースを作成する](https://docs.microsoft.com/ja-jp/azure/cognitive-services/cognitive-services-apis-create-account?tabs=singleservice%2Clinux#create-a-new-azure-cognitive-services-resource)

![endpoint02](https://jpaiblog.github.io/images/use-private-endpoints/endpoint02.jpg "endpoint02") 

***
# 3.CognitiveServices：通常の疎通を確認
Cognitive Services の通常の利用方法、パブリックインターネットを経由した疎通を確認します。

![endpoint03](https://jpaiblog.github.io/images/use-private-endpoints/endpoint03.jpg "endpoint03") 

（たとえば、お手元のPCから、以下の PowerShell スクリプトを用いて、Translator API にリクエストを送信し、英語の”Hello”がスペイン語の”Hola”に翻訳されることを確認します）

```
$contentType = 'application/json' 
$endpointKey='<your-key>'
$region='<your-region>'
$uri = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=es'
$body = '[{"Text":"Hello"}]'

$response = Invoke-WebRequest -Headers @{"Ocp-Apim-Subscription-Key"=$endpointKey;"Ocp-Apim-Subscription-Region"=$region} -Method POST -Uri $uri -body $body -ContentType $contentType
$response.Content
```
このスクリプトは以下のドキュメント記載の Curl コマンドを利用したスクリプトを 参考に作成しています。

- [Translator v3.0：リージョン リソースを使用した認証](https://docs.microsoft.com/ja-jp/azure/cognitive-services/translator/reference/v3-0-reference#authenticating-with-a-regional-resource)

***
# 4.VNET,Bastionhost,およびPrivateEndpoint：リソースを作成

以下のドキュメントの手順に沿って、VNET, Bastion host, および Private Endpoint のリソースを作成します。

- [クイックスタート: Azure portal を使用してプライベート エンドポイントを作成する](https://docs.microsoft.com/ja-jp/azure/private-link/create-private-endpoint-portal)  

※ 上記ドキュメント内の "[プライベート エンドポイントを作成する](https://docs.microsoft.com/ja-jp/azure/private-link/create-private-endpoint-portal#create-a-private-endpoint)" の手順で、下図のように、リソースとして ”CognitiveServices/accounts” を選択します。  

![endpoint04](https://jpaiblog.github.io/images/use-private-endpoints/endpoint04.jpg "endpoint04")

この手順が完了すると、以下のように、Cognitive Services のリソースは Internetからも Private Endpoint からもアクセス可能な状態となります。

![endpoint05](https://jpaiblog.github.io/images/use-private-endpoints/endpoint05.jpg "endpoint05") 

***
# 5.PrivateEndpoint：接続情報の確認
作成したプライベートエンドポイントの DNS の構成から、接続情報を確認し、書き留めておきます。

![endpoint06](https://jpaiblog.github.io/images/use-private-endpoints/endpoint06.jpg "endpoint06") 

![endpoint07](https://jpaiblog.github.io/images/use-private-endpoints/endpoint07.jpg "endpoint07") 

![endpoint08](https://jpaiblog.github.io/images/use-private-endpoints/endpoint08.jpg "endpoint08") 

（ご参考）
- [Configure Azure Cognitive Services virtual networks:DNS changes for private endpoints](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-virtual-networks?tabs=portal#dns-changes-for-private-endpoints)  
<<<<<<< HEAD
  > When you create a private endpoint, the DNS CNAME resource record for the Cognitive Services resource is updated to an alias in a subdomain with the prefix **'privatelink'**.  
=======
 
> When you create a private endpoint, the DNS CNAME resource record for the Cognitive Services resource is updated to an alias in a subdomain with the prefix **'privatelink'**.  


>>>>>>> 94ed51a7ff5056f43a1df2ea96a563a02f9c7077

***
# 6.CognitiveServices：ネットワークを制限
AzureポータルのTranslator  リソースページの”ネットワーク”メニューで規定のネットワーク アクセス ルールを制限します。

![endpoint09](https://jpaiblog.github.io/images/use-private-endpoints/endpoint09.jpg "endpoint09") 

この手順が完了すると、以下のように、Cognitive Services のリソースは Internetからはアクセス不可能な状態となります。

![endpoint01](https://jpaiblog.github.io/images/use-private-endpoints/endpoint01.jpg "endpoint01") 

手順3 で確認した Cognitive Services の通常の利用方法を再度実行し、パブリックインターネットを経由した利用ができなくなっていることを確認します。

***
# 7.PrivateEndpoint+CognitiveServices：アクセスを確認

Private Endpoint 経由で Translator REST API が利用できることを確認します。  
Virtual Network 内の Bastion host から PowerShell で 以下のスクリプトを実行し、手順3と同様の、英語の”Hello”がスペイン語の”Hola”に翻訳されることを確認します。

```
$contentType = 'application/json' 
$region='japaneast'
$uri = 'https://sr11-translator-eastjpn-privateendpoint-s1.privatelink.cognitiveservices.azure.com/translator/text/v3.0/translate?api-version=3.0&from=en&to=es'
$body = '[{"Text":"Hello"}]'
$response = Invoke-WebRequest -Headers @{"Ocp-Apim-Subscription-Key"=$endpointKey;"Ocp-Apim-Subscription-Region"=$region} -Method POST -Uri $uri -body $body -ContentType $contentType
$response.Content
```
![endpoint10](https://jpaiblog.github.io/images/use-private-endpoints/endpoint10.jpg "endpoint10") 

このとき、 グローバルエンドポイント (Translator の場合、"api.cognitive.microsofttranslator.com") へリクエストすることはできません。  

前の手順で書き留めたプライベートエンドポイントへリクエストするように記述します。  
（リソースによって接続情報は異なります。上記のサンプルスクリプトをそのまま実行せず、手順5の方法でそれぞれのプライベートエンドポイントの情報を確認してください）

![endpoint01](https://jpaiblog.github.io/images/use-private-endpoints/endpoint01.jpg "endpoint01") 

***
`変更履歴`  
`2020/11/11 created by Uehara`  