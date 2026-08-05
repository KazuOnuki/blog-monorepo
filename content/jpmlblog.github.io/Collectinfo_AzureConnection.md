---
title: Azure Machine Learning におけるネットワーク関連エラー発生時の情報採取について
date: 2020-08-31 12:00:00
categories:
- Azure Machine Learning
tags:
- 情報採取手順
---
Azure Machine Learning サービスのご利用時に、HTTP ステータス コードなどネットワーク関連のエラーが表示される場合があります。問題の調査にはネットワーク関連の情報が必要となります。以下に、汎用的な情報採取手順を紹介します。  
<!-- more -->
<br>

***
## 対象
事象の再現が可能な端末 (OS: Windows 10 の各バージョン)

## 事前準備
[こちら](https://jpmlblog.github.io//files/CollectInfo_AzureConnection.txt "CollectInfo_AzureConnection.txt") から CollectInfo_AzureConnection.txt ファイルをダウンロードします。ローカルに保存後、拡張子を .txt から .bat に変更し、任意の場所に移します。  

<font color="#FF0000">※ ダウンロード時に拡張子を .bat に変更して保存すると、ダウンロード自体がブロックされる可能性があります。  
　 ローカルに保存後に拡張子を変更ください。
</font>

<実施対象に以下が存在する状態>  
・ [任意の場所]\CollectInfo_AzureConnection.bat ファイル

## 影響
ログを採取することで負荷が上がる可能性は考えられますが、基本的に OS リソースや処理への影響はありません。 

## 実行手順
(1) 再現確認用マシンに管理者アカウントでログオンします。  
(2) CollectInfo_AzureConnection.bat ファイルを右クリックし、[管理者として実行] を選択します。  

<font color="#FF0000">※ 実行時、Microsoft Defender SmartScreen によって実行確認のメッセージが表示される可能性があります。  
　 [詳細情報] をクリックいただくと実行ボタンが表示されますので、[実行] を選択ください。  
</font>

(3) "Please enter the number you want to execute. Enter q to quit tool." メッセージに `1` を入力、リターン キーを押下し、表示に従いメニューに戻ります。  

※ CollectInfo_AzureConnection.bat のコマンド プロンプトは起動したままにしておきます。  

(4) Microsoft Edge (Chromium) または Chrome を起動し、問題が再現する操作の直前まで画面を進めます。  

※ (5) ～ (11) の手順は 「[トラブルシューティングのためにブラウザー トレースをキャプチャする](https://docs.microsoft.com/ja-jp/azure/azure-portal/capture-browser-trace)」 の内容を参考にしています。上記以外のブラウザーを使用する場合、こちらのサイトを参考に実行ください。  

(5) F12 キーを押下し、デベロッパー ツールを起動します。  
(6) [Network]タブを選択し、[Preserve log] を選択します。  

![chromium-network-preserve-log.png](https://docs.microsoft.com/ja-jp/azure/azure-portal/media/capture-browser-trace/chromium-network-preserve-log.png)  

(7) [Console] タブを選択し、[Console settings] を選択してから、[Preserve Log] を選択します。[Console settings] をもう一度選択して、設定ペインを閉じます。  

![chromium-console-preserve-log.png](https://docs.microsoft.com/ja-jp/azure/azure-portal/media/capture-browser-trace/chromium-console-preserve-log.png)  

(8) [Network] タブを選択し、 [Stop recording network log] と [Clear] を選択します。  

![chromium-stop-clear-session.png](https://docs.microsoft.com/ja-jp/azure/azure-portal/media/capture-browser-trace/chromium-stop-clear-session.png)  

(9) [Record network log] を選択して、問題を再現します。  

![chromium-start-session.png](https://docs.microsoft.com/ja-jp/azure/azure-portal/media/capture-browser-trace/chromium-start-session.png)  

※ 事象の再現を確認、そのまま十数秒ほど待ちます。  

(10) [Stop recording network log] を選択し、 [Export HAR] を選択して任意の場所に .har ファイルを保存します。  

![chromium-network-export-har.png](https://docs.microsoft.com/ja-jp/azure/azure-portal/media/capture-browser-trace/chromium-network-export-har.png)  

(11) [Console](コンソール) タブを選択します。いずれかのメッセージを右クリックし、 [Save as...] を選択して、任意の場所に .log ファイルを保存します。  

![chromium-console-select.png](https://docs.microsoft.com/ja-jp/azure/azure-portal/media/capture-browser-trace/chromium-console-select.png)  

※ 以下、CollectInfo_AzureConnection.bat のコマンド プロンプトにて再度操作を実施します。  

(12) "Please enter the number you want to execute. Enter q to quit tool." メッセージに `2` を入力、リターン キーを押下し、表示に従いメニューに戻ります。  
(13) "Please enter the number you want to execute. Enter q to quit tool." メッセージに `3` を入力、リターン キーを押下し、表示に従いメニューに戻ります。  
(14) "Please enter the number you want to execute. Enter q to quit tool." メッセージに `q` を入力、リターン キーを押下してツールを終了します。  
(15) 手順 (10) および (11) で保存したファイル (拡張子 .har および .log のファイル) と、デスクトップ上 `<YYYYMMDD 形式の年月日>_<ホスト名>_info` フォルダーをまとめて ZIP 圧縮し、お問い合わせいただく際にご提供ください。  

※ サポート リクエストに関する参考情報  
・ [Azure サポート要求を作成する](https://docs.microsoft.com/ja-jp/azure/azure-portal/supportability/how-to-create-azure-support-request)  
・ [サポート チケットの作成](https://azure.microsoft.com/ja-jp/support/create-ticket/)


***
本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  

`変更履歴`  
`2020/08/31 created by Mochizuki`