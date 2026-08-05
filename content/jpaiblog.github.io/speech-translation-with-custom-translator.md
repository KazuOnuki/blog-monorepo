---
title: Custom Translator で作成した翻訳モデルを Speech Translation で使用する方法
date: 2021-05-17 00:00:00
categories:
- Speech Services
tags:
- Speech Services
- Custom Translator
- Speech SDK
---

 
Custom Translator で作成した翻訳モデルを Speech Translation で使用する方法をご紹介します。
<!-- more -->
<br>

***

# Custom Translator で作成した翻訳モデルを Speech Translation で使用する方法
Speech Services の音声翻訳 (Speech Translation) は Speech-to-Text で文字起こしされた結果を元に Text Translation で翻訳を行います。

- [How does speech translation work?](https://www.microsoft.com/en-us/translator/business/machine-translation/#howspeech)

この時、Speech-to-Text で使用される音声認識モデルは Custom Speech でカスタマイズすることができます。

- [Custom Speech](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speech-service/custom-speech-overview)

また Text Translation については Custom Translator で構築した独自の翻訳モデルを使用することができます。

- [Custom Translator](https://docs.microsoft.com/ja-jp/azure/cognitive-services/translator/custom-translator/overview)

ここでは、Custom Translator で作成した翻訳モデルを Speech SDK で使用する方法をご紹介します。前提として、事前に Custom Translator でモデルを作成してデプロイしておく必要があります。また、モデルの識別子である Category ID は [Custom Translsator のポータルサイト](https://portal.customtranslator.azure.ai/)でモデルを作成したプロジェクトの情報から確認することができます。

![Custom Translator Category ID](https://jpaiblog.github.io/images/speech-translation-with-custom-translator/custom-translator-category-id.png)

## C# (.NET) を使用する場合のコード例:
```
SpeechTranslationConfig config = SpeechTranslationConfig.FromSubscription(SubscriptionKey, Region);

// Custom Speech のモデル指定 (*Speech-to-Text もカスタマイズする場合のみ)
config.EndpointId = "<Your Endpoint ID here>";

// Custom Translator のモデル指定
config.SetServiceProperty("category", "<Your Category ID here>", ServicePropertyChannel.UriQueryParameter);

// 以降の音声認識・翻訳は通常と同じ
```

## JavaScript を使用する場合のコード例:
```
speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(key.value, regionOptions.value);

// Custom Translator のモデル指定
speechConfig.setServiceProperty("category", "<Category ID>", SpeechSDK.ServicePropertyChannel.UriQueryParameter);

// 以降の音声認識・翻訳は通常と同じ
```

いずれの言語でも、SpeechTranslationConfig の setServiceProperty を使用して、category のパラメーターに Custom Translator の Category ID を指定する方法が基本となります。

- [Speech Services のサンプルコード](https://github.com/Azure-Samples/cognitive-services-speech-sdk)
- [Speech SDK のリファレンス](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speech-service/speech-sdk)

## Speech Translation でカスタム翻訳モデルを利用した場合の料金について
Speech Translation で Custom Translator の翻訳モデルを使用した場合に、発生する課金項目としては以下の通りです。

- (1) Speech Translation Standard ($2.50 per hour)
- (2) Custom Speech Model Hosting ($0.0538 per model per hour, Optional)
- (3) Custom Translation - Training ($10 per million source + target chars of training data (max. $300/training))
- (4) Custom Translation - Custom model hosting ($10 per hosted custom translation model per region, per month)

実際の料金レートは選択された価格帯によって異なります。(2) は Custom Speech で作成した音声認識モデルも使用する場合に発生します。Translator Text API の翻訳文字数に応じた課金 "Custom Translation - Translation ($40 per million chars of custom translation) " は Speech Translation では発生しません。

- [Speech Services の価格](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/)
- [Translator Text の価格](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/translator/)

***
`変更履歴`  
`2021/05/17 created by Nakagami`  