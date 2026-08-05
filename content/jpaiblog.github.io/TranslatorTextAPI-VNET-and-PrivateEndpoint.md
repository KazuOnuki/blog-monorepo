---
title: Translator Text API へのアクセスを VNET やプライベート エンドポイントに限定する方法
date: 2022-04-13 00:00:00
categories:
- Translator Text API
tags:
- Translator Text API
---

Translator Text API の呼び出しを特定の VNET やプライベート エンドポイント経由に限定する方法について紹介します。
<!-- more -->
<br>

***

# Cognitive Services における VNET との統合
Translator Text API を含む Cognitive Services では、リソースを VNET と統合して、API へのアクセスを特定の VNET やプライベート エンドポイント経由に限定する方法を提供しています。

- [Azure Cognitive Services 仮想ネットワークを構成する](https://docs.microsoft.com/ja-jp/azure/cognitive-services/cognitive-services-virtual-networks?tabs=portal)

Translator Text API については他の API とは一部異なる点があるため、本ブログ記事では具体的な設定および API の呼び出し手順を例として紹介します。

- [Translator Text API v3.0 - 仮想ネットワークのサポート](https://docs.microsoft.com/ja-jp/azure/cognitive-services/translator/reference/v3-0-reference#virtual-network-support)


# Translator Text API を VNET に統合する
Translator Text API へのアクセスを VNET やプライベート エンドポイントに限定した場合は、通常とは以下の点が異なります。

- グローバル トランスレーター エンドポイント ("api.cognitive.microsofttranslator.com") は使用できません。代わりに[カスタム サブドメイン](https://docs.microsoft.com/ja-jp/azure/cognitive-services/cognitive-services-custom-subdomains)を使用します。
- 認証にトークン (Authorization ヘッダー)　を使うことはできません。代わりにサブスクリプション キー (Ocp-Apim-Subscription-Key) を使用します。
- Ocp-Apim-Subscription-Region ヘッダーで Translator リソースのリージョンを指定します。(global の場合のみ省略可能)
 
上記を踏まえた手順例を以下で紹介します。ここでは簡便のためリクエストの送信元を Azure 上の仮想マシン (VM) とします。

## 手順例

### (1) Ubuntu Server 18.04 の VM および仮想ネットワークを新規で作成します
仮想ネットワークやその他のリソースのリージョンは東日本とします。

- 参考: [Azure で Linux 仮想マシンを作成する](https://docs.microsoft.com/ja-jp/learn/modules/create-linux-virtual-machine-in-azure/)

 
### (2) Translator Text API のリソースを作成します
リージョンとして東日本を選択します。
 
設定例:

![Create Translator Azure Resource](https://jpaiblog.github.io/images/TranslatorTextAPI-VNET-and-PrivateEndpoint/2-create-resource-1.png)
 
 
### (3) Translator Text API のネットワークの設定で (1) の仮想ネットワークを指定します

Translator Text API へのアクセスを指定された仮想ネットーク (VNET) からのみに限定します。

![Add VNET](https://jpaiblog.github.io/images/TranslatorTextAPI-VNET-and-PrivateEndpoint/3-add-vnet-1.png)
 
VNET を指定したタイミングでカスタム サブドメイン名が割り当てられます。
 
![Custom subdomain](https://jpaiblog.github.io/images/TranslatorTextAPI-VNET-and-PrivateEndpoint/3-custom-subdomain.png)

### (4) 仮想マシンから Translator Text API の呼び出しが成功することを確認します

- [仮想ネットワークのサポート – Translator Text API](https://docs.microsoft.com/ja-jp/azure/cognitive-services/translator/reference/v3-0-reference#virtual-network-support)
```
カスタム エンドポイントを使用する Translator を呼び出す要求の例を次に示します。
// Pass secret key and region using headers
curl -X POST "https://<your-custom-domain>.cognitiveservices.azure.com/translator/text/v3.0/translate?api-version=3.0&to=es" \
     -H "Ocp-Apim-Subscription-Key:<your-key>" \
     -H "Ocp-Apim-Subscription-Region:<your-region>" \
     -H "Content-Type: application/json" \
     -d "[{'Text':'Hello, what is your name?'}]"
```

コマンドと結果の例:
```
$ curl -X POST "https://<your-custom-domain>.cognitiveservices.azure.com/translator/text/v3.0/translate?api-version=3.0&to=es"      -H "Ocp-Apim-Subscription-Key:xxx "      -H "Ocp-Apim-Subscription-Region:japaneast"      -H "Content-Type: application/json"      -d "[{'Text':'Hello, what is your name?'}]"

[{"detectedLanguage":{"language":"en","score":1.0},"translations":[{"text":"Hola, ¿cómo te llamas?","to":"es"}]}]
```

ここで、仮想ネットワーク外からアクセスしようとした場合、以下のようなエラーで失敗します。

``` 
{"error":{"code":"AccessDenied","message": "Access denied due to Virtual Network/Firewall rules. Your IP address is XX.XX.XX.XX."}}
```

この設定では、Translator Text API 側でアクセスを許可する送信元を特定の仮想ネットワークに限定しているだけで、VM から見た宛先は仮想ネットワークのプライベート IP アドレスではなくパブリック IP アドレスになります。
これは、仮想マシン上でカスタムサブドメイン名を名前解決した結果から確認できます。
 
### コマンドと結果の例:
```
$ dig <your-custom-domain>.cognitiveservices.azure.com

...

;; ANSWER SECTION:
<your-custom-domain>.cognitiveservices.azure.com. 541 IN CNAME japaneast.prod.vnet.cog.trafficmanager.net.
japaneast.prod.vnet.cog.trafficmanager.net. 60 IN CNAME vnetproxyv1-jpe-prod.japaneast.cloudapp.azure.com.
vnetproxyv1-jpe-prod.japaneast.cloudapp.azure.com. 9 IN A 40.79.187.171
```
パブリック IP アドレスである 40.79.187.171 に名前解決されています。

### (5) プライベート IP アドレスで通信するためにプライベート エンドポイントを追加します
 
Translator Text API は他の Cognitive Services と同様にプライベート エンドポイントをサポートしています。

- [プライベート エンドポイントを使用する](https://docs.microsoft.com/ja-jp/azure/cognitive-services/cognitive-services-virtual-networks?tabs=portal#use-private-endpoints)
```
お使いの Cognitive Services リソースのプライベート エンドポイントを使用すると、仮想ネットワーク (VNet) 上のクライアントはプライベート リンクを介してデータに安全にアクセスできるようになります。 プライベート エンドポイントは、Cognitive Services リソースの VNet アドレス空間からの IP アドレスを使用します。
```

設定例:

![Add private endpoint](https://jpaiblog.github.io/images/TranslatorTextAPI-VNET-and-PrivateEndpoint/5-add-private-endpoint.png)

 [DNS の設定](https://docs.microsoft.com/ja-jp/azure/private-link/private-endpoint-dns)が更新されると、名前解決した結果がプライベート IP アドレスとなります。
 
コマンドと結果の例:
```
$ dig <your-custom-domain>.cognitiveservices.azure.com
 
...

;; ANSWER SECTION:
<your-custom-domain>.cognitiveservices.azure.com. 900 IN CNAME <your-custom-domain>.privatelink.cognitiveservices.azure.com.
<your-custom-domain>.privatelink.cognitiveservices.azure.com. 9 IN A 10.0.0.5
```

この状態で仮想マシンから curl コマンドで Translator の API を呼び出すとプライベート IP アドレス (プライベートエンドポイント経由) でのアクセスになります。

***
`変更履歴`  
`2022/04/13 created by Hiroki Nakagami`  


※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  