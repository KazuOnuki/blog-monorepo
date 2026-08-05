---
title: Windows PE で IOCTL サンプルを動作させる方法について
date: 2020-07-29 17:30:00
categories:
- Windows PE
tags:
- IOCTL
---
Windows PE で IOCTL サンプルを動作させる方法についてご紹介します。
<!-- more -->
<br>

***
今回は、Windows PE で IOCTL サンプルを動作させる方法についてご紹介します。  
- [IOCTL サンプル サイト](https://github.com/Microsoft/Windows-driver-samples/tree/master/general/ioctl/wdm)  

Windows PE でご自身のドライバがうまく動作しない場合の、比較の一助になれば幸いです。  

***
### 前提
今回は、以前ご案内した以下のブログと同じ環境がすでにあることを前提とします。  
- [Windows PE でのネットワーク経由のカーネルデバッガ接続方法](https://jpwdkblog.github.io/blog/2020/07/29/winpe-kernel-debug-via-network/)

上記で使用している ISO を上書きすることになるため、仮想マシンはシャットダウン (電源 OFF でもよいです) し、カーネルデバッガも終了しておきます。また、今回はあくまでもテスト目的のため、通常必要となる以下の方法での INF ファイルのドライバインストール方法を使っていない点にご留意ください。  
- [WinPE:マウントとカスタマイズ - デバイス ドライバー (.inf ファイル) を追加する](https://docs.microsoft.com/ja-jp/windows-hardware/manufacture/desktop/winpe-mount-and-customize#span-idadddriversspanadd-device-drivers-inf-files)  

今回使用する IOCTL のサンプルにも、運用環境で使用してはいけない旨記載されております。  

- [IOCTL サンプル サイト](https://github.com/Microsoft/Windows-driver-samples/tree/master/general/ioctl/wdm) 抜粋:  
  > [!CAUTION] This sample driver is not a Plug and Play driver. This is a minimal driver meant to demonstrate a feature of the operating system. Neither this driver nor its sample programs are intended for use in a production environment. Instead, they are intended for educational purposes and as a skeleton driver.  

***
### 手順

(1) IOCTL サンプルを Visual Studio 2019 で x64 / Debug でビルドします。  

- 1-1. サンプルの入手  

   IOCTL サンプルは、以下のサイトの右側の緑色の [Code] ボタンを押すと表示される [Download ZIP] ボタンで Windows-driver-samples-master.zipをダウンロードすると、Windows-driver-samples-master\general\ioctl\wdm のフォルダにあります。  
   https://github.com/Microsoft/Windows-driver-samples

- 1-2. サンプルのビルド  

   このフォルダの ioctl.sln を、Visual Studio 2019 で開きます。Exe フォルダの下にはユーザーモードアプリケーションである ioctlapp のプロジェクト、Sys フォルダの下にはカーネルモードドライバである sioctl のプロジェクトがあることを確認できます。  
   <div align="left">
   <img src="https://jpwdkblog.github.io/images/IOCTL-sample/SolutionExplorer.png">
   </div>

   **[ソリューション ‘ioctl’]** を右クリックして **[構成マネージャー]** をクリックします。  
   <div align="left">
   <img src="https://jpwdkblog.github.io/images/IOCTL-sample/ConfigurationManager.png">
   </div>

   今回は、[アクティブソリューション構成] を **[Debug]**、[アクティブ ソリューション プラットフォーム] を **[x64]** とします。  

   また、ioctlapp のプロパティを開き、[構成プロパティ]-[C/C++]-[コード生成] の [ランタイム ライブラリ] は **[マルチスレッド デバッグ (/MTd)]** にしておきます。  
   <div align="left">
   <img src="https://jpwdkblog.github.io/images/IOCTL-sample/ioctlappPropatyPage.png">
   </div>

   [ソリューション ‘ioctl’] を右クリックして [ソリューションのリビルド] をクリックします。  
   これで、ioctlapp.exe, sioctl.sys ができます。  

   次のステップに必要なファイルと場所は以下です。

   |ファイル|場所|  
   |:---|:---|  
   |ioctlapp.exe&nbsp;&nbsp;&nbsp;|ioctl\wdm\exe\x64\Debug|  
   |sioctl.sys&nbsp;&nbsp;&nbsp;|ioctl\wdm\sys\x64\Debug|  

(2) 管理者権限で起動された [展開およびイメージング ツール環境] で、以下のコマンドを実行します。(作業用ディレクトリは、前回の記事の前提のまま D:\WinPE_amd64 とします。)

- 2-1. テスト署名が利用可能になるようにします。
   ```
   > bcdedit /store d:\WinPE_amd64\media\EFI\Microsoft\Boot\BCD /set {default} testsigning on
   ```

- 2-2. 上述のアプリケーションとドライバのファイルを WinPE のイメージにコピーするために、WinPE のイメージをマウントします。
   ```
   > Dism /Mount-Image /ImageFile:"D:\WinPE_amd64\media\sources\boot.wim" /index:1 /MountDir:"D:\WinPE_amd64\mount"
   ```

   参考:  
   [Windows PE ブート イメージをマウントする](https://docs.microsoft.com/ja-jp/windows-hardware/manufacture/desktop/winpe-mount-and-customize#span-idmount_the_imagespanmount-the-windows-pe-boot-image)

- 2-3. マウントした WinPE のイメージに、上述のアプリケーションとドライバのファイルをコピーします。ここでは例として \Windows\Ioctl というフォルダにコピーするとします。
   ```
   > xcopy D:\develop\blog\ioctl\wdm\sys\x64\Debug\sioctl.sys "D:\WinPE_amd64\mount\Windows\Ioctl"

   > xcopy D:\develop\blog\ioctl\wdm\exe\x64\Debug\ioctlapp.exe "D:\WinPE_amd64\mount\Windows\Ioctl"
   ```

- 2-4. WinPE イメージのマウントを解除し、変更をコミットします。
   ```
   > Dism /Unmount-Image /MountDir:"D:\WinPE_amd64\mount" /commit
   ```

   参考:  
   [Windows PE イメージのマウントを解除し、メディアを作成する](https://docs.microsoft.com/ja-jp/windows-hardware/manufacture/desktop/winpe-mount-and-customize#span-idunmountspanunmount-the-windows-pe-image-and-create-media)  

- 2-5. 上記が完了したら、以下のコマンドで Windows PE の ISO ファイルを作成します。
   ```
   > makewinpemedia /iso d:\WinPE_amd64\winpe_x64_debug.iso
   ```

(3) 「Windows PE でのネットワーク経由のカーネルデバッガ接続方法」の記事で作成した仮想マシンを起動すると、上記の ISO ファイルで起動します。  

(4) カーネルデバッガ側は、以下のコマンドを実行することで Windows PE のターゲットにデバッガ接続し、ブレークインできます。
   ```
   > windbg.exe -k net:port=50005,key=5.5.5.5
   ```

(5) カーネルデバッガ側では、Symbol Search Path に上記 1-2. の sioctl.sys と ioctlapp.exe のシンボルファイル (sioctl.pdb と ioctlapp.pdb) の存在するフォルダへのフルパスを追記しておきます。  

(6) カーネルデバッガの Commands ウィンドウで以下のコマンドを実行して、sioctl.sys の DriverEntry にブレークポイントを貼ってから g を実行します。
   ```
   > bp sioctl!DriverEntry
   ```

(7) 仮想マシン上で開いているコマンドプロンプト上で、以下を実行します。  

- 7-1. ioctlapp.exe のある \Windows\Ioctl フォルダに移動します。
   ```
   > cd \Windows\Ioctl
   ```

- 7-2. ioctlapp.exe をオプションなしで実行します。
   ```
   > ioctlapp.exe
   ```

(8) カーネルデバッガ側で sioctl!DriverEntry にブレークインします。自動的に ioctl\wdm\sys\sioctl.c が開かない場合には開きます。  

(9) Commands ウィンドウで p などを入力して、161 行目の「return status;」までステップ実行します。ここで、!drvobj sioctl 2 と実行すれば、132 行目で「DriverObject->MajorFunction[IRP_MJ_CREATE] = SioctlCreateClose;」を実行している通り、以下のように、IOCTL_MJ_CREATE のコールバックに SIoctl!SioctlCreateClose がセットされていることがわかります。  
```Console
kd> !drvobj sioctl 2
Driver object (ffffd18d336f0e40) is for:
\Driver\SIoctl

DriverEntry:   fffff80822a76150        SIoctl!GsDriverEntry
DriverStartIo: 00000000        
DriverUnload:  fffff80822a759e0        SIoctl!SioctlUnloadDriver
AddDevice:     00000000 

Dispatch routines:
[00] IRP_MJ_CREATE                      fffff80822a751d0       SIoctl!SioctlCreateClose <<<<< ★
[01] IRP_MJ_CREATE_NAMED_PIPE           fffff80627dccd40      nt!IopInvalidDeviceRequest
[02] IRP_MJ_CLOSE                       fffff80822a751d0        SIoctl!SioctlCreateClose
[03] IRP_MJ_READ                        fffff80627dccd40        nt!IopInvalidDeviceRequest
[04] IRP_MJ_WRITE                       fffff80627dccd40        nt!IopInvalidDeviceRequest
[05] IRP_MJ_QUERY_INFORMATION           fffff80627dccd40      nt!IopInvalidDeviceRequest
[06] IRP_MJ_SET_INFORMATION             fffff80627dccd40       nt!IopInvalidDeviceRequest
[07] IRP_MJ_QUERY_EA                    fffff80627dccd40       nt!IopInvalidDeviceRequest
[08] IRP_MJ_SET_EA                      fffff80627dccd40       nt!IopInvalidDeviceRequest
[09] IRP_MJ_FLUSH_BUFFERS               fffff80627dccd40       nt!IopInvalidDeviceRequest
[0a] IRP_MJ_QUERY_VOLUME_INFORMATION    fffff80627dccd40      nt!IopInvalidDeviceRequest
[0b] IRP_MJ_SET_VOLUME_INFORMATION      fffff80627dccd40      nt!IopInvalidDeviceRequest
[0c] IRP_MJ_DIRECTORY_CONTROL           fffff80627dccd40      nt!IopInvalidDeviceRequest
[0d] IRP_MJ_FILE_SYSTEM_CONTROL         fffff80627dccd40      nt!IopInvalidDeviceRequest
[0e] IRP_MJ_DEVICE_CONTROL              fffff80822a75250       SIoctl!SioctlDeviceControl
[0f] IRP_MJ_INTERNAL_DEVICE_CONTROL     fffff80627dccd40      nt!IopInvalidDeviceRequest
[10] IRP_MJ_SHUTDOWN                    fffff80627dccd40       nt!IopInvalidDeviceRequest
[11] IRP_MJ_LOCK_CONTROL                fffff80627dccd40       nt!IopInvalidDeviceRequest
[12] IRP_MJ_CLEANUP                     fffff80627dccd40       nt!IopInvalidDeviceRequest
[13] IRP_MJ_CREATE_MAILSLOT             fffff80627dccd40       nt!IopInvalidDeviceRequest
[14] IRP_MJ_QUERY_SECURITY              fffff80627dccd40       nt!IopInvalidDeviceRequest
[15] IRP_MJ_SET_SECURITY                fffff80627dccd40       nt!IopInvalidDeviceRequest
[16] IRP_MJ_POWER                       fffff80627dccd40        nt!IopInvalidDeviceRequest
[17] IRP_MJ_SYSTEM_CONTROL              fffff80627dccd40       nt!IopInvalidDeviceRequest
[18] IRP_MJ_DEVICE_CHANGE               fffff80627dccd40       nt!IopInvalidDeviceRequest
[19] IRP_MJ_QUERY_QUOTA                 fffff80627dccd40       nt!IopInvalidDeviceRequest
[1a] IRP_MJ_SET_QUOTA                   fffff80627dccd40       nt!IopInvalidDeviceRequest
[1b] IRP_MJ_PNP                         fffff80627dccd40        nt!IopInvalidDeviceRequest
```

(10) カーネルデバッガの Commands ウィンドウで以下のコマンドを実行して、sioctl.sys の SioctlCreateClose にブレークポイントを貼ってから g を実行します。  

   ```
   > bp sioctl!SioctlCreateClose
   ```

(11) カーネルデバッガ側で SIoctl!SioctlCreateClose にブレークインします。k を実行すると、確かに ioctlapp.exe の main 関数の CreateFile からオープンされたことが確認できます。  
```Console
kd> k
# Child-SP          RetAddr           Call Site
00 ffff9088`d85c73d8 fffff806`27cceda9 SIoctl!SioctlCreateClose [D:\develop\blog\ioctl\wdm\sys\sioctl.c @ 192] 
01 (Inline Function) --------`-------- nt!IopfCallDriver+0x44
02 ffff9088`d85c73e0 fffff806`27ccde54 nt!IofCallDriver+0x59
03 ffff9088`d85c7420 fffff806`282b9b6b nt!IoCallDriverWithTracing+0x34
04 ffff9088`d85c7470 fffff806`282c09af nt!IopParseDevice+0x62b
05 ffff9088`d85c75e0 fffff806`282bee11 nt!ObpLookupObjectName+0x78f
06 ffff9088`d85c77a0 fffff806`282d99aa nt!ObOpenObjectByNameEx+0x201
07 ffff9088`d85c78e0 fffff806`282d9599 nt!IopCreateFile+0x3fa
08 ffff9088`d85c7980 fffff806`27e74e95 nt!NtCreateFile+0x79
09 ffff9088`d85c7a10 00007ffc`ff25cb04 nt!KiSystemServiceCopyEnd+0x25
0a 000000ae`5e8ff408 00007ffc`fd1c45e4 ntdll!ZwCreateFile+0x14
0b 000000ae`5e8ff410 00007ffc`fd1c422f KERNELBASE!CreateFileInternal+0x2f4
0c (Inline Function) --------`-------- KERNELBASE!CreateFileW+0x6a
0d 000000ae`5e8ff580 00007ff7`9ec81cd2 KERNELBASE!CreateFileA+0xbf
0e 000000ae`5e8ff5f0 00000000`00000000 ioctlapp!main+0x142 [D:\develop\blog\ioctl\wdm\exe\testapp.c @ 106]
```

Testapp.c の 106 行目のコードは、確かに以下の通り CreateFile() を実行しています。  
<div align="left">
<img src="https://jpwdkblog.github.io/images/IOCTL-sample/CreateFile.png">
</div>

これでオープンできているのは、sioctl.sys で以下のように、IoCreateDevice() の第 3 引数 ntUnicodeString で \Device\SIOCTL という NT Device Name をセットしており、かつ、これに対するシンボリックリンクとして、Win32 Name である \DosDevices\IoctlTest を IoCreateSymbolicLink() で作成しているためです。  
<div align="left">
<img src="https://jpwdkblog.github.io/images/IOCTL-sample/IoCreateDevice.png">
</div>

参考:  
[Introduction to MS-DOS Device Names](https://docs.microsoft.com/en-us/windows-hardware/drivers/kernel/introduction-to-ms-dos-device-names)

ただ、上記のドキュメントにも以下の抜粋の様にある通り、上記の方法を取るのは、一般には非 WDM ドライバです。WDM ドライバは一般的にはデバイスインターフェースを登録して使用します。  

抜粋：  
> A named device object that is created by a non-WDM driver typically has an MS-DOS device name. An MS-DOS device name is a symbolic link in the object manager with a name of the form \DosDevices\DosDeviceName.

> WDM drivers do not usually supply MS-DOS device names for their devices. Instead, WDM drivers use the IoRegisterDeviceInterface routine to register a device interface. The device interface specifies devices by their capabilities, rather than by a particular naming convention. For more information, see Device Interface Classes.

KMDF など WDF については、以下のドキュメントもご参考ください。  
[Using Device Interfaces](https://docs.microsoft.com/en-us/windows-hardware/drivers/wdf/using-device-interfaces)

(12) 最終的に仮想マシン上のコマンドプロンプトには、ioctlapp.exe の実行結果として、以下が表示されて、問題なく動作できていることがわかります。(各 IOCTL の動作を確認したい場合は、上記を参考に SIoctl!SioctlDeviceControl にブレークポイントを貼ってみてください。)  
<div align="left">
<img src="https://jpwdkblog.github.io/images/IOCTL-sample/SIoctl_SioctlDeviceControl.png">
</div>
<br>

以上の内容がお役に立てば幸いです。  
***
`変更履歴`  
`2020/07/29 created by Tsuda`  

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  