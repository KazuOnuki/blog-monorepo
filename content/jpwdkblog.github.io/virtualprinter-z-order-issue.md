---
title: Print Support App (PSA) 仮想プリンターで、Job UI ウィンドウが印刷を行ったアプリの背面に表示されてしまう
date: 2026-01-09 00:00:00
categories:
- printscan
tags:
- printer
---
この記事では Print Support App の仮想プリンターで発生する問題について説明します。
<!-- more -->
<br>

***
### 概要
アプリから Print Support App (PSA) で作成された仮想プリンターに対して印刷を行った際、仮想プリンターの [PrintWorkflowVirtualPrinterSession.VirtualPrinterDataAvailable](https://learn.microsoft.com/en-us/uwp/api/windows.graphics.printing.workflow.printworkflowvirtualprintersession.virtualprinterdataavailable?view=winrt-26100) で [LaunchAndCompleteUIAsync](https://learn.microsoft.com/en-us/uwp/api/windows.graphics.printing.workflow.printworkflowuilauncher.launchandcompleteuiasync?view=winrt-26100) を呼び出してプリント ワークフロー Job UI を表示した際に、表示された Job UI のウィンドウが、印刷を行ったアプリの背後に隠れてしまう現象が発生します。  
この現象は、印刷を行ったアプリが 32-bit アプリケーションだった場合に発生します。64-bit OS 上の 64-bit アプリの場合は、発生しません。  
<br>
<br>

***
### 現象
問題の現象が発生する手順は次の通りです。
1. 32-bit アプリケーションを起動します。(例：%WINDIR%\SysWOW64\msinfo32.exe など)
2. 仮想プリンターに対して印刷を行います。
3. 仮想プリンターのワークフロー Job UI ウィンドウが開きます。
4. 次の青く囲った部分のように、PSA のウィンドウが印刷を行ったアプリ ウィンドウの背後に隠れてしまうことがあります。  
<img src="https://jpwdkblog.github.io/images/virtualprinter-z-order-issue/repro.png" align="left" border="1"><br clear="left">
<br>
<br>

***
### 原因
フォアグラウンド ウィンドウを設定できるプロセスは、システムによって制限されています。制限を解除するためには、AllowSetForegroundWindow 関数などを用いて事前に設定が必要となります。  
印刷を行うアプリと、ワークフロー Job UI を表示するプログラムは、別プロセスでありこれらの制限を解除する必要がありますが、現状では、特定の条件下においてこの制限を正しく解除できていないため、ワークフロー Job UI が前面に表示されない問題が発生しています。
<br>
<br>


***
### 回避方法
この問題に対して PSA 側での実装では、有効な回避方法がありません。  
そのため、本現象が発生した場合は、アプリの背面に表示されたウィンドウをクリックして、前面に表示して操作を行ってください。あるいは、タスクバーでハイライトされているアイコンをクリックして、ワークフロー Job UI の操作を行ってください。  
<img src="https://jpwdkblog.github.io/images/virtualprinter-z-order-issue/taskbar.png" align="left" border="1"><br clear="left">
<br>
<br>


***
### 状況
この現象についてはマイクロソフトの不具合として認識しており開発部門へ報告済みとなりますが、現時点では修正の予定が決まっておりません。

<!--OS Bug ID 60581804-->

***
`変更履歴`  
`2026/01/09 created by riwaida`  

