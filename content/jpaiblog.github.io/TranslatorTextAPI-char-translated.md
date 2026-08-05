---
title: Translator Text API の翻訳文字数の確認方法
date: 2020-05-28 00:00:00
categories:
- Translator Text API
tags:
- Translator Text API
---

 
Translator Text API の翻訳文字数の確認方法と、参考情報をご紹介します。
1. [翻訳文字数データの確認手順](#翻訳文字数データの確認手順)
1. [翻訳文字数データをファイルとしてダウンロードする手順](#翻訳文字数データをファイルとしてダウンロードする手順)
1. [（参考情報）文字数カウント方法に関する公開ドキュメント](#（参考情報）文字数カウント方法に関する公開ドキュメント) 
<!-- more -->
<br>

***

# 翻訳文字数データの確認手順
(1) Azure Portal 上で、対象のTranslator Text API のリソースを選択します。  
(2) [監視] ブレードの [メトリック] をクリックします。  
(3) 表示された、画面中央の [メトリック] から [Text Characters Translated] または、カスタム翻訳を行った文字数の確認に関しては [Text Custom Characters Translated] を選択します。  
![char-translated-1-3](https://jpaiblog.github.io/images/TranslatorTextAPI-char-translated/char1-3.jpg "char-translated-1-3")  

(4) 画面右上にある [現地時刻: 過去 24 時間 (自動)] をクリックし、表示されたポップアップから希望の時間範囲と粒度を設定します。  
![char-translated-1-4](https://jpaiblog.github.io/images/TranslatorTextAPI-char-translated/char1-4.jpg "char-translated-1-4")  

(5) グラフ上に指定した期間の翻訳文字数が表示されます。  
![char-translated-1-5](https://jpaiblog.github.io/images/TranslatorTextAPI-char-translated/char1-5.jpg "char-translated-1-5")  

(6) グラフの中で確認したい時点にカーソルをあてると、その時間帯（指定した時間の粒度単位）に絞って、翻訳文字数を表示することができます。  
![char-translated-1-6](https://jpaiblog.github.io/images/TranslatorTextAPI-char-translated/char1-6.jpg "char-translated-1-6")  

翻訳文字数のグラフを表示する際に設定したメトリック [Text Characters Translated] の説明は、下記の公開ドキュメントを参照ください。  

- [Supported metrics for Microsoft.CognitiveServices/accounts](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/supported-metrics/microsoft-cognitiveservices-accounts-metrics)
> Text Characters Translated
>> Number of characters in incoming text translation request.

***
# 翻訳文字数データをファイルとしてダウンロードする手順
(1) “１．翻訳文字数データの確認手順” に沿って、翻訳文字数のグラフを表示します。  
(2) 表示された翻訳文字数のグラフ上部の　[共有] プルダウンから [Excelへのダウンロード] を選択します。  
![char-translated-2-2](https://jpaiblog.github.io/images/TranslatorTextAPI-char-translated/char2-2.jpg "char-translated-2-2")  

(3) 翻訳文字数のグラフを表示する際に設定した “メトリック”, “時間の範囲および粒度” のデータのExcelファイルがダウンロードされます。  
![char-translated-2-3](https://jpaiblog.github.io/images/TranslatorTextAPI-char-translated/char2-3.jpg "char-translated-2-3")  

***
# （参考情報）文字数カウント方法に関する公開ドキュメント
どのようにAPIが呼び出されるかによって、カウントされる文字数は変わります。  
例えば、1文字入力の場合でも、その後ろに空白が付与されたままの状態のテキストがAPIに渡された場合、空白も含めた文字数がカウントされます。‘A’ のような状態では、1文字とカウントされますが、後ろに3つ空白を付与した ‘A   ’ のような状態の場合は、4文字とカウントされます。空白の他にも、カウントされる対象がございますので、文字数カウント方法に関する詳細は、下記の公開ドキュメントをご確認ください。  

- [よく寄せられる質問 - Translator API：Translator では文字をどのようにカウントしますか。](https://docs.microsoft.com/ja-jp/azure/cognitive-services/translator/translator-faq)

***
`変更履歴`  
`2020/05/28 created by Uehara`  
`2022/01/25 modified by Uehara`  
`2023/02/14 modified by Uehara`  
`2024/05/20 modified by Uehara`
