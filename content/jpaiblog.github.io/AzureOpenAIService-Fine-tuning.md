---
title: Azure OpenAI Service の Fine-tuning について
date: 2023-07-18 00:00:00
categories:
- Azure OpenAI
tags:
- Azure OpenAI
---
この記事は、Azure OpenAI Service で実施可能である Fine-tuning の 2023 年 7 月 14 日現在の状況についてご紹介します。
<!-- more -->

<br>
<!-- TrackingID#2306300060001437 -->
<!-- TrackingID#2306290060002036 -->

***
## Fine-tuning (微調整)とは

Azure OpenAI Service では、Fine-tuning (微調整)という機能が提供されています。

[Azure OpenAI Service を使用してモデルをカスタマイズする方法](https://learn.microsoft.com/ja-jp/azure/cognitive-services/openai/how-to/fine-tuning?pivots=programming-language-studio)  

  > "微調整" と呼ばれるプロセスを使用して、個人用データセットに合わせてモデルを調整できます。  

## Fine-tuning (微調整)の現状

2023 年 7 月 14 日現在、 下記ドキュメントにも記載の通り、微調整 (Fine-tuning) されたモデルを実行可能なリージョンは現状ありません (いずれのリージョンも N/A となっています)。

- [Model Summary table and region availability : Fine-Tuning Regions](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/concepts/models#model-summary-table-and-region-availability)  

※日本語版のドキュメントは翻訳の遅れにより情報が古い場合がありますので、最新の情報は英語版のドキュメントを参照ください。  

なお、今後 予定されている機能として、「 GPT-3.5 Turbo 」および「 GPT-4 」モデルの Fine-tuning 機能があります。以下製品開発部門のブログ内で、今年 2023 年後半に向けた段階的なリリースを予定している旨を案内しています。

- [Announcing Updates to Azure OpenAI Service Models - Microsoft Community Hub](
https://techcommunity.microsoft.com/t5/ai-cognitive-services-blog/announcing-updates-to-azure-openai-service-models/ba-p/3866757)
  > Introducing new models   
  > ・Offer a preview of fine-tuning for GPT-3.5-Turbo and GPT-4.  
  > We are working on safely enabling fine-tuning for GPT-3.5 Turbo and GPT-4 and expect this feature to be available later this year.  
  > This service will initially be available on a limited basis, prioritizing customers who have previously fine-tuned the Davinci series.  
  > Fine-tuning of GPT-3.5-Turbo will replace Text and Code-Davinci-002 fine-tunable models.



## Fine-tuning (微調整)の一般的な位置付け 
補足事項といたしまして、ここで一般的な Fine-tuning の位置付けについて説明します。  
一般的に、微調整 (Fine-tuning) は最後の手段 (last resort) と位置付けられます。  
Fine-tuning の検討の前に、プロンプトを工夫 (プロンプト エンジニアリングを実施) することが推奨されています。
- [プロンプト エンジニアリングの概要](https://learn.microsoft.com/ja-jp/azure/cognitive-services/openai/concepts/prompt-engineering)    
- [プロンプト エンジニアリングの手法](https://learn.microsoft.com/ja-jp/azure/cognitive-services/openai/concepts/advanced-prompt-engineering?pivots=programming-language-chat-completions)  

特に現在は、Fine-tuning が可能な古いモデル (ada, curie 等) よりも高性能とされる gpt-35-turbo (ChatGPT) や GPT-4 などのモデルがリリースされています。    
これらの新しいモデルでプロンプト エンジニアリングを組み合わせることで、古いモデルで Fine-tuning を行うよりも、高いパフォーマンスが得られることが多くあります。  

上記の点は以下のセミナー動画でも説明されておりますので、こちらもご覧いただけますと幸いです。   
- [Azure OpenAI Developers セミナー](https://youtu.be/tFgqdHKsOME)  
※プロンプト エンジニアリングや Fine-tuning については動画の 22:25 頃から確認できます。  

## Fine-tuning (微調整)の代替手段

Fine-tuning の目的が「内部情報の活用」である場合、Azure OpenAI 以外のサービスと組み合わせた手法があります。

具体的には、「独自データ」を格納した Azure Cognitive Search と組み合わせることにより、Fine-tuning を使用せずに、基本モデルを使用して内部情報に基づいた回答文を生成できます。  
さらに、回答を提示する際に、Bing AI チャットのように、回答のソースとなるドキュメントへのポインターを表示することも可能です。  

- Azure OpenAI Service×Cognitive Searchでの独自データを利用したボット
  - 日本語の解説記事:  
  [Azure で ChatGPT × Cognitive Search を使ったエンタープライズサーチを実現](https://qiita.com/nohanaga/items/803c09b5a3a4e2d1776f)  
  ※弊社社員が有志で執筆した記事となります。  
   
  上記の元になる製品開発部門のブログ: 
  - Revolutionize your Enterprise Data with ChatGPT:  
  [Next-gen Apps w/ Azure OpenAI and Cognitive Search](https://techcommunity.microsoft.com/t5/ai-applied-ai-blog/revolutionize-your-enterprise-data-with-chatgpt-next-gen-apps-w/ba-p/3762087)
 
  - サンプルコード:  
  [ChatGPT + Enterprise data with Azure OpenAI and Cognitive Search](https://github.com/Azure-Samples/azure-search-openai-demo/)

上記を比較的簡単にお試しいただける方法として以下のプレビュー機能もリリースされています。

- プレビュー段階の機能:  
[クイック スタート: 独自のデータを使用して Azure OpenAI モデルとチャットする](https://learn.microsoft.com/ja-jp/azure/cognitive-services/openai/use-your-data-quickstart?tabs=command-line&pivots=programming-language-studio)

  ※プレビュー段階での機能であるため、「現状有姿のまま」、「瑕疵を問わない条件」で、かつ「提供可能な場合に限り提供しうる形」で提供されておりますこと事前にご理解のほどお願いいたします。    
  (プレビュー機能に関する使用条件: [Online Services Terms](https://www.microsoft.com/licensing/terms/en-US/product/ForOnlineServices/MOSA) の「Preview」事項を参照)

`変更履歴`  
`2023/07/18 created by Kudou`   

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  
