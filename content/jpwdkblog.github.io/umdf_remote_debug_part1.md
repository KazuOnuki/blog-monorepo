---
title: Visual Studio で User Mode Driver をリモート デバッグする方法 (パート 1 - ドライバーのビルドとインストール)
date: 2025-09-30 00:00:00
categories:
- Debug
tags:
- Debug
- UMDF
- Visual Studio
---
この記事では、Visual Studio と Remote Tools for Visual Studio を使用した User Mode Driver のリモート デバッグ方法について説明します。
<!-- more -->
<br>

***
### 事前準備
1. ドライバーをビルド・デバッグを行う開発環境の PC とドライバーを実行しテストを行うターゲット PC をそれぞれ 1 台ずつ計 2 台の PC あるいは仮想マシンを用意します。  
2. 開発環境には Visual Studio、Windows Driver Kit (WDK) をインストールし、Windows Driver Kit サンプルを事前にダウンロードしておきます。WDK のインストールと、サンプルのダウンロードは次のリンクをご参照ください。  
  [Download the Windows Driver Kit (WDK)](https://learn.microsoft.com/en-us/windows-hardware/drivers/download-the-wdk)  
  [GitHub - Windows-driver-samples](https://github.com/Microsoft/Windows-driver-samples)  
3. ターゲット PC に Remote Tools for Visual Studio をインストールします。  
  [Download and Install the remote tools](https://visualstudio.microsoft.com/downloads/?cid=learn-onpage-download-cta#remote-tools-for-visual-studio-2022)  
4. ターゲット PC でテスト署名を有効化します。必要に応じて事前にセキュア ブートを BIOS で無効化します。テスト署名の有効化は、ドキュメント "[テスト署名されたドライバーの読み込みを有効にする](https://learn.microsoft.com/ja-jp/windows-hardware/drivers/install/the-testsigning-boot-configuration-option)" にあるように、管理者権限で起動したコマンド プロンプトで bcdedit.exe を次のように呼び出します。
   ```cmd
   Bcdedit.exe -set TESTSIGNING ON
   ```

### User Mode Driver について
事前準備が完了したらサンプル ドライバーのビルドを行います。この記事では User Mode Driver を対象としておりますが、User Mode Driver と言っても様々な種類があります。
例えば次のような種類のドライバーがあります。
- [GPS / GNSS (Global Navigation Satellite System GNSS) driver](https://learn.microsoft.com/en-us/windows-hardware/drivers/gnss/)
- [GPIO peripheral device driver](https://learn.microsoft.com/en-us/windows-hardware/drivers/gpio/)
- [Indirect display driver](https://learn.microsoft.com/en-us/windows-hardware/drivers/display/indirect-display-driver-model-overview)
- [UMDF NetAdapterCx client driver](https://learn.microsoft.com/en-us/windows-hardware/drivers/netcx/)
- [POS barcode scanner driver](https://learn.microsoft.com/en-us/windows-hardware/drivers/pos/)
- [Printer driver](https://learn.microsoft.com/en-us/windows-hardware/drivers/print/) ※
- [WIA driver](https://learn.microsoft.com/en-us/windows-hardware/drivers/image/windows-image-acquisition-drivers) ※  
  >※ Printer および WIA ドライバーは一般的な User Mode Driver Framework (UMDF) のドライバーとは異なるため、この記事のシリーズで紹介している内容の一部は適用されません。


### サンプル ドライバーのビルド
この記事では Generic なサンプルとして提供されている Toaster サンプルを使用します。Toaster サンプルは KMDF 版と UMDF 版の2種類がありますが UMDF 版は [Windows-driver-samples/general/toaster/umdf2](https://github.com/microsoft/Windows-driver-samples/tree/main/general/toaster/umdf2) にあります。

1. 開発環境 PC の Visual Studio で Windows-driver-samples\general\toaster\umdf2\umdf2toaster.sln を開きます
2. **[Solution Explorer]** を見ると、そのソリューション内には Exe, Filter, Func, Package というプロジェクトがありますが、ひとまず Solution 部分をクリックします。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/solutionexplr.png" align="left" border="1"><br clear="left">
3. 続いて、ビルド対象を選びます。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/targetplat.png" align="left" border="1"><br clear="left">
4. **[ビルド]** メニューから **[ソリューションのリビルド]** を選びビルドします。
5. ビルドが正常に終わると、その結果として x64 Debug の場合、次のような出力ファイルが得られます。
   ```cmd
   umdf2
   └─x64
     └─Debug
       ├─package.cer
       └─package
         ├─filterum.dll
         ├─filterum.inf
         ├─wdfsimpleum.dll
         ├─wdfsimpleum.inf
         └─wudf.cat
   ```

### ドライバーのインストール
ドライバーのインストールにはいくつか方法がありますが、今回はドライバー パッケージを手動でターゲット PC にコピーして、デバイス マネージャーを使ってインストールします。  
1. 前の手順の 5 の `Debug` フォルダーをターゲット PC の任意のフォルダーにコピーします。  
2. ターゲット PC 上でコピー先フォルダー内にある `package.cer` を右クリックして **[証明書のインストール]** をクリックします。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/installcert.png" align="left" border="1"><br clear="left">
3. 証明書のインポート ウィザードで次の設定で選び、**完了** をクリックして証明書をインポートします。  

    | **設定項目** | **設定値** |
    |--|--|
    | 保存場所 | ローカル コンピューター |
    | 証明書をすべて次のストアに配置する | チェックする |
    | 証明書ストア | 信頼されたルート証明機関 |
    | 物理ストアを表示する | チェックしない |
4. スタート メニューを右クリックしてデバイス マネージャーを起動します。
5. **[操作]** メニューをクリックして、**[レガシ ハードウェアの追加]** をクリックします。
6. **[ハードウェアの追加]** ウィザードで、次の設定を行い、ドライバーとデバイスのインストールを行います。  
   6-1. インストール方法の選択で **[一覧から選択したハードウェアをインストールする (詳細)]** を選び次へ。  
   6-2. **[共通ハードウェアの種類]** で **[すべてのデバイスを表示]** を選び次へ。  
   6-3. **[ディスクを使用]** をクリックして、ドライバー パッケージをコピーしたフォルダーに移動して `wdfsimpleum.inf` を選び **[開く]** をクリックします。  
   6-4. `Sample UMDF Toaster Driver - simple` を選び **[次へ]** をクリックし、残りのウィザードを進め完了します。  
      <img src="https://jpwdkblog.github.io/images/umdfremodedbg/installcomp.png" align="left" border="1"><br clear="left">
7. デバイス マネージャーに次のように表示されインストールが完了していることが分かります。  
      <img src="https://jpwdkblog.github.io/images/umdfremodedbg/devmgr.png" align="left" border="1"><br clear="left">  
   また、スタート メニューから管理者権限でターミナルを起動し、次のコマンドを入力すると UMDF ドライバーがどのプロセスにロードされているのかを確認できます。  
   ``` cmd
   PS C:\> tasklist /m wdfsimpleum.dll

   Image Name                     PID Modules
   ========================= ======== ============================================
   WUDFHost.exe                 12412 wdfsimpleum.dll
   ```
8. ドライバーのインストール ログを確認する場合は C:\Windows\INF\setupapi.dev.log を参照します。ログの見方などについては [SetupAPI テキスト ログ](https://learn.microsoft.com/ja-jp/windows-hardware/drivers/install/setupapi-text-logs) をご参照下さい。  
以下は実際に Toaster UMDF ドライバーをインストールした時のログの抜粋です。  

   ``` setupapi.dev.log
   >>> [Device Install (DiInstallDevice) - ROOT\UNKNOWN\0000]
   >>> Section start 2025/09/30 17:19:51.937
      cmd: "C:\WINDOWS\system32\mmc.exe" C:\WINDOWS\system32\devmgmt.msc
     ndv: Flags: 0x00000002
     dvi: Class GUID of device changed to: {b85b7c50-6a01-11d2-b841-00c04fad5171}.
     sto: {Setup Import Driver Package: c:\temp\debug\package\wdfsimpleum.inf} 17:19:51.939
     inf:      Provider: TODO-Set-Provider
     inf:      Class GUID: {B85B7C50-6A01-11d2-B841-00C04FAD5171}
     inf:      Driver Version: 09/30/2025,16.8.45.553
     inf:      Catalog File: wudf.cat
     sto:      {Copy Driver Package: c:\temp\debug\package\wdfsimpleum.inf} 17:19:51.943
     sto:           Driver Package = c:\temp\debug\package\wdfsimpleum.inf
     sto:           Flags          = 0x00000007
     sto:           Destination    = C:\Users\LOCALA~1\AppData\Local\Temp\{80ada83c-a1a3-e241-a557-f69a205c8309}
     sto:           Copying driver package files to 'C:\Users\LOCALA~1\AppData\Local\Temp\{80ada83c-a1a3-e241-a557-f69a205c8309}'.
     flq:           {FILE_QUEUE_COMMIT} 17:19:51.945
     flq:                Copying 'c:\temp\debug\package\wdfsimpleum.dll' to 'C:\Users\LOCALA~1\AppData\Local\Temp\{80ada83c-a1a3-e241-a557-f69a205c8309}\wdfsimpleum.dll'.
     flq:                Copying 'c:\temp\debug\package\wdfsimpleum.inf' to 'C:\Users\LOCALA~1\AppData\Local\Temp\{80ada83c-a1a3-e241-a557-f69a205c8309}\wdfsimpleum.inf'.
     flq:                Copying 'c:\temp\debug\package\wudf.cat' to 'C:\Users\LOCALA~1\AppData\Local\Temp\{80ada83c-a1a3-e241-a557-f69a205c8309}\wudf.cat'.
     flq:           {FILE_QUEUE_COMMIT - exit(0x00000000)} 17:19:51.953
     sto:      {Copy Driver Package: exit(0x00000000)} 17:19:51.953
     ump:      Import flags: 0x00000000
     pol:      {Driver package policy check} 17:19:52.002
     pol:      {Driver package policy check - exit(0x00000000)} 17:19:52.002
     sto:      {Stage Driver Package: C:\Users\LOCALA~1\AppData\Local\Temp\{80ada83c-a1a3-e241-a557-f69a205c8309}\wdfsimpleum.inf} 17:19:52.002
     inf:           Provider       = TODO-Set-Provider
     inf:           Class GUID     = {b85b7c50-6a01-11d2-b841-00c04fad5171}
     inf:           Driver Version = 09/30/2025,16.8.45.553
     inf:           Catalog File   = wudf.cat
     inf:           Version Flags  = 0x00000013
   (以下、省略)  
   ```  


### まとめ
以上でドライバーのインストールまで完了です。  
今回ドライバーのインストールは、デバイス マネージャーから手動でインスールしましたが、実際のドライバーはデバイスの接続に応じたプラグアンドプレイによるインストールになることが想定されます。なお、今回のインストールでは `ROOT\Unknown\0000` というデバイス インスタンスを作成して、ドライバーを割り当てているため、物理的なデバイスは存在していません。USB などのプラグアンドプレイのシナリオでは、バス ドライバーが `USB\VID_xxxx&PID_yyyy\*` のようなデバイス インスタンスを生成し、ドライバーがインストールされます。  
  
次回の記事では、実際にリモートでデバッガーを接続してアプリケーションからドライバーを呼び出した時の様子を開発環境上の PC で動作する Visual Studio でデバッグする作業を行います。
  
  
  
***
`変更履歴`  
`2025/09/30 created by riwaida`

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  

※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  
