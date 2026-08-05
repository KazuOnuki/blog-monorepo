---
title: Windows 11 24H2 の WIA ドライバーのインストールにおいて ICM Profile が適用されない
date: 2025-10-02 00:00:00
categories:
- printscan
tags:
- bug
- WIA
- install
- Windows 11 24H2
---
この記事では、Windows 11 24H2 における WIA デバイス の INF ファイルに指定されているベンダー指定のカラー プロファイル (Image Color Matching Profile) が適用されない問題について説明します。
<!-- more -->
<br>

***
### 概要
Windows 11 Version 24H2 (OS Build 26100) において、WIA ドライバー (スキャナー ドライバーなど) の INF ファイルで指定できる `ICMProfiles` の値が、ドライバーのインストールを行っても正しく適用されません。  
例えば、INF ファイルに次のような記述が行われている場合が該当します。 
``` INF
ICMProfiles="My Scanner Color Space Profile.icm"
```
WIA ドライバーの INF ファイルの完全な例については、次のドキュメントをご参照ください。  
[Hello World インストール ファイル - Windows drivers | Microsoft Learn](https://learn.microsoft.com/ja-jp/windows-hardware/drivers/image/--hello-world---installation-file)  

また、WIA ドライバー固有の INF ファイル エントリについては、次のドキュメントをご参照ください。  
[WIA デバイスの INF ファイル - Windows drivers | Microsoft Learn](https://learn.microsoft.com/ja-jp/windows-hardware/drivers/image/inf-files-for-wia-devices)  


<br>  

  
***  
### 現象
この現象は Windows 11 24H2 で行われた変更が原因で発生しており、現状 100% の確率で発生します。なお、Windows 11 23H2 などの以前のバージョンでは発生しません。  
また、次のレジストリが書き込まれていないことで、事象の発生有無を確認することもできます。  
| **レジストリ キー** | **値の型** | **値の名前** |
| -- | -- | -- |
| HKLM\System\CurrentControlSet\Control\Class\\{6bdd1fc6-810f-11d0-bec7-08002be2092f}\\{デバイスの番号}\DeviceData | REG_MULTI_SZ | ICMProfile |

なお、値が設定されていない場合、標準の sRGB プロファイル (*sRGB Color Space Profile.icm*) が利用されます。そのため、INF ファイルに同プロファイルを指定しているドライバーでは、この問題によりデフォルトのプロファイルが利用されることとなるため、実質的な影響はありません。
<br>  
<br>  

***  
### 回避方法
現時点では、INF ファイルのみでこの問題を回避する方法はありません。  
しかし、ドライバーのインストール後、プログラム コードを用いて、API `InstallColorProfile` と `WcsAssociateColorProfileWithDevice` を呼び出すことで、指定した ICM Profile のインストールと WIA デバイスへの関連付けを行うことができます。  
これらの API を利用するコード サンプルは次のリンクよりご参照ください。  

[サンプル コード: ApplyIcmProfile.cpp](https://github.com/jpwdkblog/jpwdkblog.github.io/blob/master/samples/wia/icmprofile/ApplyIcmProfile.cpp)  
> [!NOTE]  
> このサンプルコードはあくまで API の利用方法を説明するためのコードであり、動作を保証するものではないということをご了承ください。  

上記各 API の詳細については次のドキュメントをご参照ください。  
[InstallColorProfileW - Win32 apps | Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/api/icm/nf-icm-installcolorprofilew)  
[WcsAssociateColorProfileWithDevice - Win32 apps | Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/api/icm/nf-icm-wcsassociatecolorprofilewithdevice)


<br>  
<br>  

***
### 状況
本問題は、Windows の不具合であると認識しており、現在修正に向けて作業中となります。  
明確な修正プログラムの提供時期については現時点では未定ですが、過去の経緯や現段階での作業状況から 2026 年 1 月ごろとなると予想しております。
具体的な提供時期などアップデートがあり次第、こちらで状況を更新いたします。   
  

関連情報：[Windows クライアントの更新リリース サイクル | Microsoft Learn](https://learn.microsoft.com/ja-jp/windows/deployment/update/release-cycle)  



<!--ID:59120214-->
<!--Rel:2025.10D-->
<!--Primary:Feature_Bundle_2510=DisabledByDefault-->
<!--Feature_SetupApi_FilterInstallInfoSet=EnabledByDefault-->

<br>

***
`変更履歴`  
`2025/10/02 created by riwaida`

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  