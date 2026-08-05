---
title: HLK のテストが失敗した場合のトラブルシューティング手順
date: 2025-07-10 00:00:00
categories:
- hlk
tags:
- test
---
この記事では、Hardware Lab Kit (HLK) のテストで FAIL が発生した時の一般的なトラブルシューティング方法をご案内いたします。
<!-- more -->
<br>

***
### 1. HLK で実施すべきテスト項目であったかどうかを確認する
まず、前提として実施されたテスト項目が認定を受けるうえで必須のテスト項目であったかどうかをチェックします。  
HLK のテストは、[Windows Hardware Compatibility Program Specifications and Policies](https://learn.microsoft.com/en-us/windows-hardware/design/compatibility/whcp-specifications-policies) で定義されている要件に沿ったドライバーあるいはハードウェアであるかどうかをチェックする目的があります。つまり、対象のドライバーおよびデバイスに対するポリシー要件を定義されていない内容に対するテストは、そもそも実施する必要がありません。  
実施すべきテストのみが正しく選択されているかどうかは、"プレイリスト" が適用されているかどうかによって変わります。

この "プレイリスト" については、次のドキュメントに適用方法が記載されていますので、こちらをご覧ください。  
[手順 6:テストの選択と実行 - プレイリスト](https://learn.microsoft.com/ja-jp/windows-hardware/test/hlk/getstarted/step-6-select-and-run-tests#playlists)  

"プレイリスト" ファイルは、次のドキュメントからダウンロードできます。   
[Windows ハードウェア互換性プログラム - プレイリスト](https://learn.microsoft.com/ja-jp/windows-hardware/design/compatibility/#playlists)


***
### 2. HLK Filters
HLK では、テスト ツールそのものの問題や OS 側の問題、要件定義の問題など、お客様デバイスやドライバー以外が原因でテストが Fail となる場合があります。このような場合、その Fail についてはテスト結果を免除するためのフィルターがあります。  
フィルターのインストール手順とダウンロードは [こちら](https://learn.microsoft.com/ja-jp/windows-hardware/test/hlk/user/windows-hardware-lab-kit-filters#to-install-filters) からご確認いただけます。フィルターは機械的に毎日更新処理が実行されており、アップデートがある場合はフィルター ファイルも更新されます。そのため、テストを実施する場合は、まずフィルターのダウンロードと更新作業を実施いただくことをお勧めします。
  
  
その他フィルターの有無を [DTM Filtes](https://partner.microsoft.com/en-us/dashboard/hardware/dtmfilters) にて確認します。  
HLK Filters には、自動で適用されるもの以外にマニュアルで適用されるものもあります (通称、Manual Errata)。これは、マイクロソフトのサポート エンジニアからの指示のもとで適用されるフィルターとなります。基本的には、弊社までお問い合わせいただくことが前提となります。前述のサイトに関連しそうな内容や類似のものが見つかった場合は、お気兼ねなく [弊社サポート](https://support.serviceshub.microsoft.com/supportforbusiness/create) までお問い合わせください。お問い合わせいただく際の製品カテゴリは次の通りです。  
   <div align="left">
   <img src="https://jpwdkblog.github.io/images/troubleshoot-hlk/submitissue.png">
   </div>



***
### 3. エラー メッセージの確認
エラーログは通常、ログファイル（.wtl）に記録されており、[Result] タブでテスト結果をダブルクリックすることで開くことができます。どのテストで失敗しているのかを確認後、対応するテスト ドキュメントを確認します。テスト ドキュメントには、事前に設定すべき内容(Prerequisites) や、事前に設定すべきパラメータ (Parameters) などが記載されています。テストによっては、手動操作が求められているものもあるため、操作が不足していないかなどもご確認ください。

例：[Audio Codec - USB Audio Logo Test (Manual) - Certification - Desktop](https://learn.microsoft.com/en-us/windows-hardware/test/hlk/testref/36b1763e-0c6b-4a6e-a1cf-f4723b8d947b)

   <div align="left">
   <img src="https://jpwdkblog.github.io/images/troubleshoot-hlk/prereq.png">
   </div>

   <div align="left">
   <img src="https://jpwdkblog.github.io/images/troubleshoot-hlk/params.png">
   </div>
   
***  
### 4. トラブル シューティング作業  
失敗したテストは、そのテスト ツールだけをエクスポートして、HLK コントローラなしでスタンドアロンで個別実行することが可能です。この操作によって、デバッグ作業やログ採取など必要なアクションを行いやすくできる場合があります。
次のドキュメントで失敗したテストジョブのエクスポート手順および実行手順が記載されていますので、ご確認ください。
[失敗した HLK ジョブのエクスポート](https://learn.microsoft.com/ja-jp/windows-hardware/test/hlk/user/exporting-a-failed-hlk-job)


また、すべてのドライバーは [DF - InfVerif INF Verification](https://learn.microsoft.com/en-us/windows-hardware/test/hlk/testref/bbcc1b46-d0bf-46c8-85b4-2cd62df34a20) と呼ばれるテストが実行されます。このテストは、ドライバーをインストールするための INF ファイルの記述などの検証を行うテストとなります。基本的に OS のバージョンが新しいものになるにつれて、INF の記述に関する要件が増え、より厳格になっている傾向があります。  
お客様のドライバーが要件に沿っているかどうかをチェックするためには、[Windows Hardware Compatibility Program Specifications and Policies](https://learn.microsoft.com/en-us/windows-hardware/design/compatibility/whcp-specifications-policies) をご確認いただく必要がありますが、最新の Windows Driver Kit に含まれている [InfVerif](https://learn.microsoft.com/en-us/windows-hardware/drivers/devtest/infverif_h) ツールを用いてツールでチェックすることもできます。要件に沿っているかどうかは /h オプションを指定してツールを実行します。  

なお、HLK とは直接関係ありませんが、HLK のテストを行わずにドライバーへの署名だけを Hardware DevCenter に依頼する場合も、この InfVerif ツールの検証だけは行われます。そのため、ドライバーを作成した場合は、必ず InfVerif /h での検証を行っていただくことをお勧めいたします。


***   
### 関連情報
[Windows HLK 環境のトラブルシューティング](https://learn.microsoft.com/ja-jp/windows-hardware/test/hlk/user/troubleshooting-the-windows-hlk-environment)  
[Windows HLK テストのエラーのトラブルシューティング](https://learn.microsoft.com/ja-jp/windows-hardware/test/hlk/user/troubleshooting-windows-hlk-test-failures)  
[INF の検証エラーと警告](https://learn.microsoft.com/ja-jp/windows-hardware/drivers/devtest/inf-validation-errors-and-warnings)



***
`変更履歴`  
2025/07/10 created by riwaida

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  