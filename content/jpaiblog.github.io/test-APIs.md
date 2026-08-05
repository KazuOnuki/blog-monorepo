---
title: Cognitive Serivces で使用する API テスト ページについて
date: 2020-04-30 12:00:00
categories:
- Cognitive Services
tags:
- API
---
Cognitive Serivces の API について、テスト実行用の参考サイトを紹介します。
<!-- more -->
<br>

***
#### はじめに
- Cognitive Serivces の API は複数あります。どのような API があるかは以下サイトを参照ください。  
[Azure Cognitive Services とは](https://docs.microsoft.com/ja-jp/azure/cognitive-services/welcome)  

- Azure REST API のリファレンス サイトより、Cognitive Services の REST API を確認できます。いくつかのサービスは、こちらのサイトから REST API の実行が可能です。  
[Azure REST API Reference](https://docs.microsoft.com/en-us/rest/api/azure/)  
[Azure Cognitive Services REST API reference](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/)  
[Azure Cognitive Services - Bing Search REST API reference](https://docs.microsoft.com/en-us/rest/api/cognitiveservices-bingsearch/)  

- Cognitive Services 関連の API をまとめたサイトにも REST API を実行可能なページが用意されています。https:// に続くリージョンの指定によっては API が用意されていない場合があるため、代表的な 4 リージョンを紹介します。  
[Cognitive Services APIs (westus)](https://westus.dev.cognitive.microsoft.com/docs/services)  
[Cognitive Services APIs (westus2)](https://westus2.dev.cognitive.microsoft.com/docs/services)  
[Cognitive Services APIs (southcentralus)](https://southcentralus.dev.cognitive.microsoft.com/docs/services)  
[Cognitive Services APIs (westeurope)](https://westeurope.dev.cognitive.microsoft.com/docs/services)  

- REST API の実行には API キーが必要になります。以下のサイトから API キーを取得できます。こちらにないサービスについては、各サービスのクイック スタート ページ等から利用方法を参照ください。  
[Cognitive Services を試す](https://azure.microsoft.com/ja-jp/try/cognitive-services/)  

<br>各 API のリンクを紹介します。 掲載されていないサービスは上述で列記したサイトより検索ください。  

***
#### [Computer Vision](https://docs.microsoft.com/ja-jp/azure/cognitive-services/computer-vision/)
- [Cognitive Services APIs (?pattern=Computer%20Vision)](https://westus2.dev.cognitive.microsoft.com/docs/services?pattern=Computer+Vision)  

***
#### [Custom Vision Service](https://docs.microsoft.com/ja-jp/azure/cognitive-services/Custom-Vision-Service/)
- [Cognitive Services APIs (?pattern=Custom_Vision)](https://southcentralus.dev.cognitive.microsoft.com/docs/services?pattern=Custom_Vision)  

***
#### [Face](https://docs.microsoft.com/ja-jp/azure/cognitive-services/face/)
- [Cognitive Services APIs (?pattern=Face+API)](https://westus.dev.cognitive.microsoft.com/docs/services?pattern=Face+API)  

***
#### [Form Recognizer](https://docs.microsoft.com/ja-jp/azure/cognitive-services/form-recognizer/)
- [Cognitive Services APIs (?pattern=Form+Recognizer)](https://westus2.dev.cognitive.microsoft.com/docs/services?pattern=Form+Recognizer)  

***
#### [Speech Service](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speech-service/)  
Speech Service はさらに複数のサービス・機能に分かれます。利用可能な REST API の直リンクを以下に列挙します。サービス、機能の一覧は [こちら](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speech-service/overview) をご確認ください。  
- [Cognitive Services APIs (?pattern=Speech+to+Text)](https://westus2.dev.cognitive.microsoft.com/docs/services?pattern=Speech+to+Text)  
- [Speech to Text REST API](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speech-service/rest-speech-to-text)  
- [Conversation transcription (Preview)](https://signature.centralus.cts.speech.microsoft.com/UI/index.html)
- [Speaker Recognition](https://docs.microsoft.com/ja-jp/rest/api/speakerrecognition/)

***
#### [Speaker Recognition](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speaker-recognition/home)
- [Cognitive Services APIs (?pattern=Speaker+Recognition)](https://westus.dev.cognitive.microsoft.com/docs/services?pattern=Speaker+Recognition)  

***
#### [Language Understanding - LUIS](https://docs.microsoft.com/ja-jp/azure/cognitive-services/luis/)
利用可能な REST API の仕様について [こちら](https://docs.microsoft.com/ja-jp/azure/cognitive-services/luis/developer-reference-resource#rest-specifications) をご確認ください。  
- [Cognitive Services APIs (?pattern=LUIS)](https://westus.dev.cognitive.microsoft.com/docs/services?pattern=LUIS)  

***
#### [QnA Maker](https://docs.microsoft.com/ja-jp/azure/cognitive-services/qnamaker/)
- [QnA Maker REST APIリファレンス](https://docs.microsoft.com/ja-jp/rest/api/cognitiveservices-qnamaker/)  

***
#### [Text Analytics](https://docs.microsoft.com/ja-jp/azure/cognitive-services/text-analytics/)
- [Cognitive Services APIs (?pattern=Text+Analytics)](https://centralus.dev.cognitive.microsoft.com/docs/services?pattern=Text+Analytics)  

***
#### [Anomaly Detector](https://docs.microsoft.com/ja-jp/azure/cognitive-services/anomaly-detector/)
- [Cognitive Services APIs (?pattern=Anomaly+Detector)](https://westus2.dev.cognitive.microsoft.com/docs/services?pattern=Anomaly+Detector)  

***
#### [Content Moderator](https://docs.microsoft.com/ja-jp/azure/cognitive-services/content-moderator/)
- [Content Moderator API リファレンス](https://docs.microsoft.com/ja-jp/azure/cognitive-services/content-moderator/api-reference)
- [Cognitive Services APIs (?pattern=Content+Moderator)](https://westus.dev.cognitive.microsoft.com/docs/services?pattern=Content+Moderator)  

***
#### [Metrics Advisor](https://docs.microsoft.com/ja-jp/azure/cognitive-services/metrics-advisor/)
- [Cognitive Services APIs (?pattern=Metrics+Advisor)](https://westus2.dev.cognitive.microsoft.com/docs/services?pattern=Metrics+Advisor)  

***
#### [Personalizer](https://docs.microsoft.com/ja-jp/azure/cognitive-services/personalizer/)
- [Cognitive Services APIs (?pattern=Personalizer)](https://westus2.dev.cognitive.microsoft.com/docs/services?pattern=Personalizer)  

***
`変更履歴`  
`2020/04/30 created by Mochizuki`  
`2020/05/01 modified by Mochizuki`  
`2020/10/19 modified by Mochizuki`  
`2020/11/02 modified by Mochizuki`  
`2022/06/08 modified by Mochizuki`  

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  