---
title: UWP アプリから nul ポートが指定されているプリンターに印刷できない
date: 2022-03-10 17:30:00
categories:
- printscan
tags:
- Windows 10
---
この記事では、Windows 10 における印刷における問題について説明します。
<!-- more -->
<br>

***
### 概要
現在、Windows 10 の [2021 年 12 月 14 日— KB5008212 (OS ビルド 19041.1415、19042.1415、19043.1415、および 19044.1415)](https://support.microsoft.com/ja-jp/topic/2021-%E5%B9%B4-12-%E6%9C%88-14-%E6%97%A5-kb5008212-os-%E3%83%93%E3%83%AB%E3%83%89-19041-1415-19042-1415-19043-1415-%E3%81%8A%E3%82%88%E3%81%B3-19044-1415-b46200db-74c3-450e-b200-51013957312a) を適用した環境において、UWP アプリから `nul:` ポートが指定されているプリンターで印刷が失敗することを確認しています。

現象
次のような条件で問題が発生します。
- プリンターのプロパティにて、プリンター ポートとして次のように `nul:` が指定されています。
   <img src="https://jpwdkblog.github.io/images/printer-null-port-issue/printerprops.png" align="left" border="1"><br clear="left">


- [フォト] などの UWP ベースのアプリから印刷します。  
   その結果、次のようなエラーが発生します。
   <img src="https://jpwdkblog.github.io/images/printer-null-port-issue/print-error.png" align="left" border="1"><br clear="left">

<br>

***
### 解決方法
2022/6/2 の更新プログラム KB5014023 (OS Builds 19042.1741, 19043.1741, and 19044.1741) にて、この問題について者は修正されました。

June 2, 2022—KB5014023 (OS Builds 19042.1741, 19043.1741, and 19044.1741) Preview <br>
https://support.microsoft.com/en-us/topic/june-2-2022-kb5014023-os-builds-19042-1741-19043-1741-and-19044-1741-preview-65ac6a5d-439a-4e88-b431-a5e2d4e2516a

<br>



***
`変更履歴`  
`2022/03/10 created by riwaida`  
`2022/10/02 modified by riwaida: 更新プログラムの情報追加`  

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  
