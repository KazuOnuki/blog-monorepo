---
title: QnA Maker における Excel ファイルを使用した QnA ペアの追加について
date: 2021-02-03 00:00:00
categories:
- QNA Maker
tags:
- QnA ペアの追加
- Excel ファイル
---
Excel ファイルを利用して日本語の QnA ペアを追加する際の注意事項についてご紹介します。
<!-- more -->
<br>

***
# Excel ファイルを利用した場合の注意事項
Excel ファイルを利用して日本語の漢字を含める質問と回答を登録する際に、以下の図のように、登録された質問と回答の末尾に漢字のふりがなが付いていることがあります。  

<img src="https://jpaiblog.github.io/images/QnA-Maker-Import-Excel/img01.png" width=800px>  

また、上記の図では、Excel ファイルの 「Prompts」 列に入っている、漢字を含める内容がマルチターンの Prompts として反映されていません。  

この事象の原因としては、Excel 上で漢字を入力した際に自動的に付加されたふりがな (ルビ) が QnA Maker によって抽出されたためと想定されます。  
 
- [日本語の文字列にふりがな (ルビ) を使用する](https://support.microsoft.com/ja-jp/office/%E6%97%A5%E6%9C%AC%E8%AA%9E%E3%81%AE%E6%96%87%E5%AD%97%E5%88%97%E3%81%AB%E3%81%B5%E3%82%8A%E3%81%8C%E3%81%AA-%E3%83%AB%E3%83%93-%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B-673b30ed-6bbd-4759-870f-0e5616955e9a)  

>シート データを並べ替える場合、日本語データは既定でふりがなによって並べ替えられます。 正しいふりがながそれらを使用する文字に使用されている場合、日本語の用語は、国語辞書に現れるのと同じ順序で並べ替えられます。<br>
>(中略)<br>
>ふりがなを日本語版の Excel で表示し、漢字 (日本語で使用される漢字) を入力すると、Excel はふりがなを自動的にガイドに追加します。  

これは以下の図のように、Excel 上で漢字のふりがなを表示することで確認できます。  

<img src="https://jpaiblog.github.io/images/QnA-Maker-Import-Excel/img02.png" width=800px>  
 
現状 QnA Maker は Excel のふりがなも抽出するため、Excel が自動的に付与したふりがなを削除しない状態で、QnA Maker ポータルの [+Add file] もしくは [Import knowledge base] の機能で QnA ペアを追加した場合は、漢字のふりがなも質問と回答に含まれます。  
 
対処策としては、Excel ファイルからふりがなを削除することになりますが、以下の図ように、ふりがなを含むセルをコピーして別のセルへ「数式」として貼り付けると、ふりがなの部分はコピーされませんので、一括削除のアイデアとしてご参考ください。  

<img src="https://jpaiblog.github.io/images/QnA-Maker-Import-Excel/img03.png" width=800px>  
 
 
上記のように、ふりがなを削除した状態の Excel ファイルを利用して質問と回答を追加した場合は、以下の通り漢字のふりがなは表示されません。また、Excel の「Prompts」列の内容もマルチターンの Prompts として反映されるようになります。  

<img src="https://jpaiblog.github.io/images/QnA-Maker-Import-Excel/img04.png" width=800px>  

<br>

***
`変更履歴`  
`2021/02/03 created by Chao`  
`2024/05/20 modified by Uehara`