---
title: Print Support App (PSA) の初回起動時、[設定] ウィンドウの背面に表示されてしまう
date: 2024-08-15 00:00:00
categories:
- printscan
tags:
- printer
---
この記事では Print Support App で発生する問題について説明します。
<!-- more -->
<br>

***
### 概要
Print Support App (PSA) がインストールされた直後などにおいて、[設定] から起動時ウィンドウが設定画面の背後に隠れてしまう事象が発生します。
PSA が起動する際、つぎのダイアログが表示されるケースで事象が発生します。  
<img src="https://jpwdkblog.github.io/images/psa-z-order/wait-for-printer-connection.png" align="left" border="1"><br clear="left">
<br>
<br>

***
### 現象
問題の事象が発生する手順は次の通りです。
1. スタート メニューから [設定] をクリックします。
2. [Bluetooth とデバイス] - [プリンターとスキャナー] の順にクリックします。
3. 表示されたプリンターの一覧から PSA を起動するプリンターをクリックします。
4. [印刷設定] をクリックします。  
<img src="https://jpwdkblog.github.io/images/psa-z-order/open-print-pref.png" align="left" border="1"><br clear="left">
5. 次の青く囲った部分のように、PSA のウィンドウが設定画面の背後に隠れてしまうことがあります。  
<img src="https://jpwdkblog.github.io/images/psa-z-order/psa-window-back.png" align="left" border="1" width="50%" height="50%"><br clear="left">
<br>
<br>

***
### 状況

この現象については開発部門にて今後の対応を (次期メジャー OS アップデートでの対応について) 検討中となります。

2026 年 1 月 9 日更新  
Windows 11 25H2 ではこの問題の解消が確認されております。

<!--OS Bug ID 51218384 -->

***
`変更履歴`  
`2024/08/15 created by riwaida`  
`2025/07/10 modified by riwaida : 状況の更新`  
`2026/01/09 modified by riwaida : 状況の更新`  
