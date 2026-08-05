---
title: Text to Speech の API を Entra ID 認証で呼び出す方法
date: 2025-04-21 00:00:00
categories:
- Speech Service
tags:
- Speech Service
- Text-to-Speech
- Synthesis
---

 
Speech Service の API、特に Text to Speech の API を Entra ID 認証で呼び出す方法について、Azure VM と curl を使用した場合の具体的な手順例をご紹介します。
<!-- more -->
<br>

***

# Speech Service の API を Entra ID 認証で呼び出す方法
Speech Service の API を Entra ID 認証で呼び出すには、[他の Azure AI services](https://learn.microsoft.com/ja-jp/azure/ai-services/what-are-ai-services) とは異なり、[認証トークンに追加の処理](https://learn.microsoft.com/ja-jp/azure/ai-services/speech-service/how-to-configure-azure-ad-auth?tabs=portal)が必要です。
この点を踏まえた具体的な手順例を以下にまとめていますので、アプリケーションへ組み込みいただく際の参考としてご利用ください。

## 事前準備

1. [Azure VM でシステム割り当てのマネージド ID を有効](https://learn.microsoft.com/ja-jp/entra/identity/managed-identities-azure-resources/how-to-configure-managed-identities?pivots=qs-configure-portal-windows-vm) にします。


2. (1) のマネージド ID に、Speech Service のリソースに対して Cognitive Services Speech User のロールを割り当てます。

    [Cognitive Services User など他のロール](https://learn.microsoft.com/ja-jp/azure/ai-services/speech-service/role-based-access-control)でも可能です。


3. Speech Service のリソースで[カスタムサブドメイン名](https://learn.microsoft.com/ja-jp/azure/ai-services/cognitive-services-custom-subdomains)を有効にします。

    Entra ID 認証を使用するにはカスタムサブドメイン名を有効にする必要があります。この点は[他の Azure AI services と共通](https://learn.microsoft.com/ja-jp/azure/ai-services/authentication)です。

## API 呼び出し

以降は Azure VM (Linux) に SSH でログインして curl のコマンドで動作確認します。
 
4. [マネージド ID を使用して Entra ID トークンを取得](https://learn.microsoft.com/ja-jp/entra/identity/managed-identities-azure-resources/how-to-use-vm-token)します。
 
コマンド例:
```
curl -X GET "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fcognitiveservices.azure.com" -H "Metadata: true"
```

応答例:
```
{
    "access_token": "eyJ0eX...g",
    "client_id": "2a...3",
    "expires_in": "86061",
    "expires_on": "1738835772",
    "ext_expires_in": "86399",
    "not_before": "1738749072",
    "resource": "https://cognitiveservices.azure.com",
    "token_type": "Bearer"
}
```

5. "aad#{resourceId}#{aadToken}" の形式で[トークンを成形](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-configure-azure-ad-auth?tabs=portal&pivots=programming-language-csharp)します。

例:
```
aad#/subscriptions/<Sub ID>/resourceGroups/<Resource Group>/providers/Microsoft.CognitiveServices/accounts/<Resource>#eyJ0eX...g
```

6. [Text to Speech の API](https://learn.microsoft.com/ja-jp/azure/ai-services/speech-service/rest-text-to-speech?tabs=streaming) を呼び出します
 
コマンド例:
```
curl -v --location --request POST "https://<Custom subdomain>.cognitiveservices.azure.com/tts/cognitiveservices/v1" \
--header "Authorization: aad#/subscriptions/<Sub ID>/resourceGroups/<Resource Group>/providers/Microsoft.CognitiveServices/accounts/<Resource>#eyJ0eX...g" \
--header 'Content-Type: application/ssml+xml' \
--header 'X-Microsoft-OutputFormat: audio-16khz-128kbitrate-mono-mp3' \
--header 'User-Agent: curl' \
--data-raw '<speak version='\''1.0'\'' xml:lang='\''en-US'\''>
    <voice xml:lang='\''en-US'\'' xml:gender='\''Female'\'' name='\''en-US-AvaMultilingualNeural'\''>
        my voice is my passport verify me
    </voice>
</speak>' > output.mp3
```

応答例:
```
< HTTP/2 200
< date: Wed, 05 Feb 2025 10:02:43 GMT
< content-type: audio/mpeg
```

指定したフォーマット (audio-16khz-128kbitrate-mono-mp3) で音声ファイル (output.mp3) が出力されます。

***
`変更履歴`  
`2025/04/21 created by Nakagami`  