---
title: QnA Maker の KB名称にエクスクラメーションアイコンが表示された場合の対応について
date: 2021-03-18 00:00:00
categories:
- QNA Maker
tags:
- QNA Maker
---
QnA Maker の KB名称部分にエクスクラメーション記号（！）アイコンが表示された場合の対応をご説明します。  
<!-- more -->
<br>

QnA Maker ポータル画面左上のナレッジベース（KB）名称部位に赤いエクスクラメーションアイコンが表示される場合があります。

![exclamation](https://jpaiblog.github.io/images/exclamation-displayed-on-kbname/exclamationicon.jpg "exclamation") 

このとき、表示されたアイコンににカーソルを重ねると、メッセージが表示されます。  
表示されたメッセージの内容をご確認いただき、その内容に沿った対応をご実施ください。

（もし、メッセージが表示されない場合には、当ブログの　[Webポータル画面が期待通りに表示されない場合の確認方法](https://jpaiblog.github.io/blog/2020/11/11/not-expected-display-on-the-webbrowser/)　の対応方法をご確認ください）


マークが示すメッセージとして可能性が高いものは、以下のランタイムの更新に関するメッセージです。

[QnA Maker のリソースを構成する：最新のランタイム更新プログラムを取得する](
https://docs.microsoft.com/ja-jp/azure/cognitive-services/qnamaker/how-to/configure-qna-maker-resources#get-the-latest-runtime-updates)

>QnA Maker ランタイムは、Azure portal で QnA Maker サービスを作成するときにデプロイされる Azure App Service インスタンスの一部です。   
ランタイムの更新は定期的に行われます。  
QnA Maker App Service インスタンスは、2019 年 4 月のサイト拡張リリース (バージョン 5+) 以降は自動更新モードになります。   
この更新は、アップグレード中のダウンタイムがゼロになるように設計されています。


上記ドキュメントへのリンクを記載したメッセージが表示された場合には、その手順に沿い、ランタイムを手動更新することで、赤いエクスクラメーションアイコンの表示が消えます。  

または、ランタイムの自動更新が順次実施されていく間に、一時的にアイコン表示が行われる場合があります。  
その場合には、手動更新を行わなくても、更新が自動適用されることにより、赤いエクスクラメーションアイコンの表示が消えます。  


***
`変更履歴`  
`2021/03/18 created by Uehara`  
`2022/01/25 created by Uehara`  
