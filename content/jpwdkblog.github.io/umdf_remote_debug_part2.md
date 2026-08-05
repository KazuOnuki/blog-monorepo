---
title: Visual Studio で User Mode Driver をリモート デバッグする方法 (パート 2 - デバッガーの接続とデバッグ)
date: 2025-10-01 00:00:00
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
以下のパート 1 が完了していること。  
  [Visual Studio で User Mode Driver をリモート デバッグする方法 (パート 1 - ドライバーのビルドとインストール)](https://jpwdkblog.github.io/blog/2025/09/30/umdf_remote_debug_part1/)  
<br>
  

### デバッガーの接続
次の手順を実施して、開発環境の PC から ターゲット PC 上のプロセスに対して、デバッガーをアタッチして、デバッグ可能な状態にします。  

1. ターゲット PC 上にインストールした Remote Tools for Visual Studio の Remote Debugger を **[管理者として実行]** で起動します。初回起動の場合、ファイアウォールの設定が表示されますが、すべて既定の状態で起動します。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/launchremotedebugger.png" width="30%" align="left" border="1"><br clear="left">  
  
2. **[ツール]** メニューから **[オプション]** を選択して、認証の設定を行います。今回は簡略化のため認証なしの設定 (以下) で行います。  
   | **設定項目** | **設定値** |
   | -- | -- |
   | TCP/IP ポート番号 | 4026 |
   | 認証モード | 認証なし |
   | すべてのユーザーにデバッグを許可する | チェックする |
   | アイドル タイムの最大値 (秒) | 3600 |  
  
3. ターゲット PC 上で **[ターミナル (管理者)]** を起動 (あるいはコマンド プロンプトを管理者として実行) して、次のコマンドを入力します。Visual Studio からデバッガーをアタッチするプロセス ID を確認します。  
   ``` cmd
   tasklist /m wdfsimpleum.dll
   ```
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/pid.png" width="50%" align="left" border="1"><br clear="left">    
     
4. 開発環境の PC の Visual Studio で **[デバッグ]** > **[プロセスにアタッチ]** を選択し (または Ctrl+Alt+P キーを押し)、**[プロセスにアタッチ]** ダイアログ ボックスを開きます。  
  
5. **[接続の種類]** を **[リモート (Windows - 認証なし)]** に設定し、**[検索]** ボタンをクリックします。**[リモート接続]** ダイアログ ボックスを開きます。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/remoteconn.png" width="50%" align="left" border="1"><br clear="left">  
  
6. 手順 2 で設定したターゲット PC が自動で検出されるため **[選択]** ボタンをクリックして、ダイアログを閉じます。  
  
7. **[プロセスにアタッチ]** ダイアログ ボックスに戻り、ターゲット PC 内のプロセス一覧が表示されるため、Ctrl+E キーを押してフィルターのボックスに手順 3 で確認した、デバッグ対象のプロセス ID を入力します。`WUDFHost.exe` を選択して、**[アタッチする]** をクリックします。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/attach.png" width="50%" align="left" border="1"><br clear="left">  
  
8. Visual Studio のメニューから [デバッグ] > [ウィンドウ] > [モジュール] の順にクリックして、UMDF ドライバーのシンボルがロードされていることを確認します。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/modules.png" width="50%" align="left" border="1"><br clear="left">  
  
<br>  
以上でデバッグできる状態になりました。次のステップに進み、実際のデバッグ操作を行います。
<br>  
<br>  

### ソースコード レベル デバッグの実施
現在、ドライバー *wdfsimpleum.dll* はロードされているだけの状況であり、初期化処理以外は、この段階では特に処理を実行していません。そのためドライバーを呼び出すアプリケーションを実行して、ドライバー コードを実行します。  
次の手順で、ドライバー コードが実行されたタイミングをデバッガーで捕捉します。  
  
1. ドライバーに対して `ReadFile` と `DeviceIoControl` を呼び出すアプリケーション *toast.exe* がサンプルには用意されているため、そのアプリケーションを利用します。
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/toastapp.png" width="30%" align="left" border="1"><br clear="left">   
  
   以下はドライバーの ReadFile を呼び出しているコード部分の抜粋です。
   ```c:/umdf2/exe/toast/toast.c
    //
    // Read/Write to the toaster device.
    //

    printf("\nPress 'q' to exit, any other key to read...\n");
    fflush(stdin);
    ch = _getche();

    while(tolower(ch) != 'q' )
    {

        if(!ReadFile(file, buffer, sizeof(buffer), &bytes, NULL))
        {
            printf("Error in ReadFile: %x", GetLastError());
            break;
        }
        printf("Read Successful\n");
        ch = _getche();
    }

    free (deviceInterfaceDetailData);
    CloseHandle(file);
    return 0;
   ```

   サンプルをビルドすると以下のパスに *toast.exe* が生成されるため、このファイルをターゲット PC 側の任意のフォルダー (C:\temp など) へコピーします。  

   ``` cmd
   umdf2
   └─exe
      ├─enum
      ├─notify
      └─toast
          └─x64 (or arm64)
              └─Debug (or Release)
                  └─ toast.exe
   ```


2. ターゲット PC 上の管理者権限で実行されているコマンドプロンプトにて *toast.exe* を実行します。次のような出力が得られればデバイスのオープンができています。  
   ``` cmd
   c:\temp>toast.exe
   Instance ID : ROOT\UNKNOWN\0000
   Description : Sample UMDF Toaster Driver - simple
   FriendlyName:


   List of Toaster Device Interfaces
   ---------------------------------
   1) \\?\root#unknown#0000#{781ef630-72b2-11d2-b852-00c04fad5171}

   Opening the last interface:
   \\?\root#unknown#0000#{781ef630-72b2-11d2-b852-00c04fad5171}

   Press 'q' to exit, any other key to read...
   ```
   > [!NOTE]  
   > *toast.exe* の実行時 VCRUNTRIME140.dll が見つからないといったエラーが出る場合は、プロジェクトのプロパティでランタイム ライブラリの設定を `/MT` あるいは `/MTd` にしてビルドすることで回避できます。  
   > <img src="https://jpwdkblog.github.io/images/umdfremodedbg/codegen.png" width="50%" align="left" border="1"><br clear="left">
   > 関連ドキュメント: [/MD、/MT、/LD (ランタイム ライブラリを使用)](https://learn.microsoft.com/ja-jp/cpp/build/reference/md-mt-ld-use-run-time-library?view=msvc-170)
  
  
3. 開発環境の Visual Studio で *Func\Simple\Source Files\toast.c* を開き、`ToasterEvtIoRead` 関数の先頭にブレークポイントをセットします。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/setbp.png" width="50%" align="left" border="1"><br clear="left">  
  

4. ターゲット PC の *toast.exe* を実行したコンソール画面に戻り、'q' キー以外の任意のキーを押下します。すると、開発環境の Visual Studio 側で `ToasterEvtIoRead` 関数でブレークインして、実行が停止します。
そして、デバッグしたいコードまで F10 キーなどを押下することでステップ実行することができます。  
   <img src="https://jpwdkblog.github.io/images/umdfremodedbg/breakin.png" width="50%" align="left" border="1"><br clear="left">  




  

### まとめ
以上、パート 2 ではリモートデバッガーを接続して、任意のタイミングで実行されるコードのデバッグを行えることまでを確認しました。  
  
次回の記事では、任意のタイミングではなく UMDF ドライバーの `DriverEntry` や `EvtDriverDeviceAdd` ルーチンといった初期化処理におけるリモート デバッグについて説明します。
  
  
  
***
`変更履歴`  
`2025/10/01 created by riwaida`

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  