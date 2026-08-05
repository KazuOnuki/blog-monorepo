---
title: Visual Studio で User Mode Driver をリモート デバッグする方法 (パート 3 - ドライバーロード時のデバッガー アタッチ)
date: 2025-10-02 00:00:00
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
以下のパート 1, 2 が完了していること。  
  [Visual Studio で User Mode Driver をリモート デバッグする方法 (パート 1 - ドライバーのビルドとインストール)](https://jpwdkblog.github.io/blog/2025/09/30/umdf_remote_debug_part1/)  
  [Visual Studio で User Mode Driver をリモート デバッグする方法 (パート 2 - デバッガーの接続とデバッグ)](https://jpwdkblog.github.io/blog/2025/10/01/umdf_remote_debug_part2/)  

<br>
  

### ドライバーの初期化からデバッグを開始する
パート 1 と 2 では、既にロードされているドライバーのホスト プロセス (WUDFHost.exe) に対してデバッガーをアタッチしました。  
しかしこの方法では、ドライバーの初期化処理である [`DriverEntry`](https://learn.microsoft.com/ja-jp/windows-hardware/drivers/ddi/wdm/nc-wdm-driver_initialize) や [`EvtDriverDeviceAdd`](https://learn.microsoft.com/ja-jp/windows-hardware/drivers/ddi/wdfdriver/nc-wdfdriver-evt_wdf_driver_device_add) コールバック ルーチン内の処理中にデバッガーをアタッチすることができず、デバッグを行うことができません。次の手順では、この問題を解決するための設定とリモート デバッグを開始する方法を説明します。  

1. ターゲット PC 上で、レジストリ エディタ (regedit.exe) を起動します。起動後、次のレジストリを設定します。  
   | **レジストリ キー** | **値の型** | **値の名前** | **値** |
   | -- | -- | -- | -- |
   | HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\WUDF\DebugMode | REG_DWORD | DebugModeFlags | 0x07 (16進) |
   | HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\WUDF\Services\\{*ドライバー サービス名*}\Parameters\Wdf | REG_DWORD | HostProcessDbgBreakOnDriverLoad | 120 (秒) |
  
   [`DebugModeFlags`(https://learn.microsoft.com/ja-jp/windows-hardware/drivers/wdf/registry-values-for-debugging-kmdf-drivers#debugmodeflags) はデバッグ モードを有効化し、デバイス プールの機能を無効化します。さらに再起動までのタイムアウトを無効化します。  
   [`HostProcessDbgBreakOnDriverLoad`](https://learn.microsoft.com/ja-jp/windows-hardware/drivers/wdf/registry-values-for-debugging-kmdf-drivers#hostprocessdbgbreakondriverload-driver-specific) は、デバッガーがアタッチされるまでの待機時間を秒単位で指定します。レジストリ キーにある *ドライバー サービス名* は、INF ファイルの [`UmdfService`](https://learn.microsoft.com/ja-jp/windows-hardware/drivers/wdf/specifying-wdf-directives-in-inf-files#umdfservice) ディレクティブに指定した *serviceName* です。  
   <Toaster UMDF ドライバーの例>  
   この例では `wdfsimpleum` が *serviceName* となります。
   ``` INF
   ;-------------- WDF specific section -------------
   [Toaster_Device.NT.Wdf]
   UmdfService=wdfsimpleum, Toaster_Install
   UmdfServiceOrder=wdfsimpleum
   ```
  <br>   
  
2. ターゲット PC 上でデバイス マネージャーを起動して、対象のデバイスを一度無効化し、ドライバーをアンロードされた状態にします。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/devmgr_disable.png" align="left" border="1"><br clear="left">    
<br>     

3. 開発環境の PC の Visual Studio で `DriverEntry` 関数と `ToasterEvtDeviceAdd` 関数にブレークポイントをセットしておきます。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/setbp_driverentry.png" width="50%" align="left" border="1"><br clear="left">  
<br>   

4. 開発環境の PC の Visual Studio で **[デバッグ]** > **[プロセスにアタッチ]** を選択し (または Ctrl+Alt+P キーを押し)、**[プロセスにアタッチ]** ダイアログ ボックスを開きます。**[接続の種類]** を **[リモート (Windows - 認証なし)]** の設定が維持されていることを確認し、フィルターのボックスに *WUDFHost.exe* と入力します。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/attach_wudfhost.png" width="50%" align="left" border="1"><br clear="left">  
   > [!NOTE]   
   > 上の画像のように、既に起動している WUDFHost.exe が表示される場合もありますが、これはデバッグ対象のドライバー用プロセスではないため、アタッチしないでください。次の手順でデバイスを有効化した時に、対象のプロセスが分からなくならないよう、起動済み WUDFHost.exe の PIDをメモしておくと、後の手順でプロセスを特定しやすくなります。  

<br>  

5. ターゲット PC に移動し、デバイス マネージャーでデバイスを有効化します。
  
6. 開発環境の PC に戻り **[プロセスにアタッチ]** ダイアログ ボックスに参照すると、新たに `WUDFHost.exe` が増えていることが確認できるため、そのプロセスを選択して、**[アタッチする]** をクリックします。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/attach_newwudfhost.png" width="50%" align="left" border="1"><br clear="left">  
 

7. `DebugBreak` のコードにヒットして、自動でデバッガーにブレークインします。F5 キーを押下して、そのまま実行を継続すると、手順 3 でドライバーの `DriverEntry` に設定しておいたブレークポイントにヒットして実行が停止します。そして、ステップ実行などによるデバッグ作業が行えるようになります。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/stop_driverentry.png" width="50%" align="left" border="1"><br clear="left">  

<br>  


### まとめ
手順にまとめると複雑な作業に見えますが、一連の操作に慣れてしまえば、簡単な操作でデバッグ作業を行うことができます。  
デバッガーを接続して、コードの実行状況を正しく把握することで、推測ベースのトライ & エラーによる問題解決よりも、確実な調査を行えます。リモートによるデバッガー接続を行うメリットの一つとして、ターゲット PC 上でストレステストやランダムなテストを実行する長時間の試験においても、開発環境側には大きな影響を受けないという利点があります。  
さらに、Visual Studio を使ってプロセスにアタッチすることで、Visual Studio の [診断ツール](https://learn.microsoft.com/ja-jp/visualstudio/profiling/profiling-feature-tour?view=vs-2022&pivots=programming-language-cpp#measure-performance-while-debugging) も利用することができます。診断ツールでは、CPU、メモリの使用状況を視覚的に確認でき、メモリリークの調査も行うことができます。  
  
  
<br>    
<br>  
  
***
`変更履歴`  
`2025/10/01 created by riwaida`

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  