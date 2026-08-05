---
title: Custom Speech で作成したモデルを Speech Translation で使用する方法
date: 2025-05-02 00:00:00
categories:
- Speech Services
tags:
- Speech Services
- Custom Translator
- Speech SDK
---

 
Custom Speech で作成したモデルを Speech Translation で使用する方法をご紹介します。
<!-- more -->
<br>

***

# Custom Speech で作成したモデルを Speech Translation で使用する方法
Speech Services の音声翻訳 (Speech Translation) は、まず Speech-to-Text で文字起こしされた結果を元に Text Translation で翻訳を行います。

- [How does speech translation work?](https://www.microsoft.com/en-us/translator/business/machine-translation/#howspeech)

この時、Speech-to-Text の処理で使用される音声認識モデルは Custom Speech でカスタマイズすることができます。

- [Custom Speech](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speech-service/custom-speech-overview)

## C# (.NET) を使用する場合のコード例:

[SpeechTranslationConfig](https://learn.microsoft.com/en-us/dotnet/api/microsoft.cognitiveservices.speech.speechtranslationconfig?view=azure-dotnet) のプロパティ `EndpointId` にモデルのエンドポイント ID を指定します。

```
SpeechTranslationConfig config = SpeechTranslationConfig.FromSubscription(SubscriptionKey, Region);

// Custom Speech のモデル指定
// 例: エンドポイント ID が 51747863-4b1a-4efa-a1cb-84be48ae50d7 の場合

config.EndpointId = "51747863-4b1a-4efa-a1cb-84be48ae50d7";

// 以降の音声認識・翻訳は通常と同じ
```

## JavaScript を使用する場合のコード例:
Speech SDK for JavaScript の場合、[Speech to Text](https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/speechconfig?view=azure-node-latest) では endpointId を使用していますが、[Speech Translation](https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/speechtranslationconfig?view=azure-node-latest) では endpointId のプロパティは参照されません。
そのため、エンドポイントの URL パラメーター `cid` として指定する必要があります。

```
// リージョンが Japan East, エンドポイント ID が 51747863-4b1a-4efa-a1cb-84be48ae50d7 の場合

speechConfig = SpeechSDK.SpeechTranslationConfig.fromEndpoint(new URL("wss://japaneast.s2s.speech.microsoft.com/speech/translation/cognitiveservices/v1?cid=51747863-4b1a-4efa-a1cb-84be48ae50d7"),settings.subscriptionKey);

// 以降の音声認識・翻訳は通常と同じ
```

エンドポイントの URL を確認する方法については、[こちらのドキュメント](https://learn.microsoft.com/ja-jp/azure/ai-services/speech-service/speech-services-private-link?tabs=portal#construct-endpoint-url)の "エンドポイント URL の構築" をご参照ください。

### 補足
Speech Translation の場合に endpointId が参照されないことは [GitHub で公開されているソースコード](https://github.com/microsoft/cognitive-services-speech-sdk-js/tree/master)からご確認いただけます。

**Speech to Text の場合:**

[TranscriberConnectionFactory.ts](https://github.com/microsoft/cognitive-services-speech-sdk-js/blob/master/src/common.speech/TranscriberConnectionFactory.ts) より抜粋:
```
public setQueryParams(queryParams: IStringDictionary<string>, config: RecognizerConfig, endpointUrl: string): void {

    const endpointId: string = config.parameters.getProperty(PropertyId.SpeechServiceConnection_EndpointId, undefined);
```

**Speech Translation の場合:**

[TranslationConnectionFactory.ts](https://github.com/microsoft/cognitive-services-speech-sdk-js/blob/master/src/common.speech/TranslationConnectionFactory.ts) より抜粋:
```
public setQueryParams(queryParams: IStringDictionary<string>, config: RecognizerConfig, endpointUrl: string): void {
    // Common parameters for both V1 and V2 endpoints
    queryParams.from = config.parameters.getProperty(PropertyId.SpeechServiceConnection_RecoLanguage);
    queryParams.to = config.parameters.getProperty(PropertyId.SpeechServiceConnection_TranslationToLanguages);
    queryParams.scenario = config.recognitionMode === RecognitionMode.Interactive ? "interactive" :
        config.recognitionMode === RecognitionMode.Conversation ? "conversation" : "";
```

## 翻訳のカスタマイズについて

Custom Translator で作成した翻訳モデルも同時に使用する場合は[こちらのブログ](https://jpaiblog.github.io/blog/2021/05/17/speech-translation-with-custom-translator/)をご参照ください。

***
`変更履歴`  
`2025/05/02 created by Nakagami`  