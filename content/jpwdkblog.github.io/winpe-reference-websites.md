---
title: Windows PE 用ドライバの開発において参考になる公開ドキュメントについて
date: 2020-08-11 12:00:00
categories:
- Windows PE
tags:
- 参考情報
---
Windows PE で動作するドライバを開発していただくにあたり、ご参照いただける公開ドキュメントをこちらにまとめてご紹介をいたします。
<!-- more -->
<br>

***
これをご案内する背景として、上記を実現するために必要な公開情報はあるものの、Windows PE で動作するドライバを開発する、という目的で一元化してはおりませんため、それらをおまとめした今回のブログがお役に立てば幸いです。  

ドライバの実装そのものに Windows PE のために特別必要な実装はございませんので、インストール方法とデバッグ方法について以下の通りご案内いたします。  

---
## ドライバのインストール方法

- [Add and Remove Drivers to an offline Windows Image](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/add-and-remove-drivers-to-an-offline-windows-image)  

- [Add Device Drivers to Windows During Windows Setup](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/add-device-drivers-to-windows-during-windows-setup)  

- [WinPE:マウントとカスタマイズ](https://docs.microsoft.com/ja-jp/windows-hardware/manufacture/desktop/winpe-mount-and-customize)  
   >デバイス ドライバー (.inf ファイル) を追加する  
   >- WinPE イメージにデバイス ドライバーを追加するには、DISM /add-driver を使用します。
   >
   >   Dism /Add-Driver /Image:"C:\WinPE_amd64\mount" /Driver:"C:\SampleDriver\driver.inf"
   >
   >1 つのコマンドを使用してイメージに複数のドライバーを追加できますが、ほとんどの場合、各ドライバー パッケージを個別に追加すると問題のトラブルシューティングが簡単になります。
ドライバーの詳細については、[デバイス ドライバー (.inf ファイル) の追加](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fja-jp%2Fwindows-hardware%2Fmanufacture%2Fdesktop%2Fwinpe-add-drivers&data=02%7C01%7Cdamochiz%40microsoft.com%7C37c50955ca634ba702c608d8383be05c%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637321177103220594&sdata=W98NawWBR4H6So2M70XucYl6WDWoZriC%2BB%2F%2FAoTvVPE%3D&reserved=0) に関するページを参照してください。 使用可能なすべての [DISM ドライバー サービス オプションを確認するには、DISM ドライバー サービスのコマンド ライン オプション](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fja-jp%2Fwindows-hardware%2Fmanufacture%2Fdesktop%2Fdism-driver-servicing-command-line-options-s14&data=02%7C01%7Cdamochiz%40microsoft.com%7C37c50955ca634ba702c608d8383be05c%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637321177103230589&sdata=IERaF%2BuCfM9z3twCzIaBnQUlytFRCisIXD3K9JGl0Ks%3D&reserved=0) に関するページを参照してください。  

- [Drvload Command-Line Options](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/drvload-command-line-options)
   >The Drvload tool adds out-of-box drivers to a booted Windows Preinstallation Environment (Windows PE) image. It takes one or more driver .inf files as inputs. To add a driver to an offline Windows PE image, use the Deployment Image Servicing and Management (DISM) tool. For more information, see [Add and Remove Drivers to an Offline Windows Image](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fwindows-hardware%2Fmanufacture%2Fdesktop%2Fadd-and-remove-drivers-to-an-offline-windows-image&data=02%7C01%7Cdamochiz%40microsoft.com%7C37c50955ca634ba702c608d8383be05c%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637321177103240581&sdata=AGaBoJ9k1469JrFJ9wD5EbgFb2kc53HEsArtVbKE33E%3D&reserved=0).
   >
   >If the driver .inf file requires a reboot, Windows PE will ignore the request. If the driver .sys file requires a reboot, then the driver cannot be added with Drvload. For more information, see [Device Drivers and Deployment Overview](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fwindows-hardware%2Fmanufacture%2Fdesktop%2Fdevice-drivers-and-deployment-overview&data=02%7C01%7Cdamochiz%40microsoft.com%7C37c50955ca634ba702c608d8383be05c%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637321177103250576&sdata=HE9JMSfjmwXzyS83feNJD46D1drGkQz7xCxIVb3%2FfD0%3D&reserved=0) and [DISM Driver Servicing Command-Line Options](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fwindows-hardware%2Fmanufacture%2Fdesktop%2Fdism-driver-servicing-command-line-options-s14&data=02%7C01%7Cdamochiz%40microsoft.com%7C37c50955ca634ba702c608d8383be05c%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C637321177103250576&sdata=TQCM7WVJBJa4vHDM%2F2llwYKB6Xc0P2ElnmVZN1x7yQo%3D&reserved=0).
   >
   >Drivers added using the Drvload tool are marked as the preferred driver for that device. If you add an updated driver during Windows Setup, the driver that you added with Drvload takes precedence.

---
## ドライバのデバッグ方法

- [WinPE: Debug Apps - Kernel-mode debugging](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/winpe-debug-apps#kernel-mode-debugging)

   上記に関連して、以下のブログも作成しておりますので、ご参考になりましたら幸いです。

- [Windows PE でのネットワーク経由カーネル デバッガ接続方法について](https://jpwdkblog.github.io/blog/2020/07/29/winpe-kernel-debug-via-network/)

- [Windows PE で IOCTL サンプルを動作させる方法について
](https://jpwdkblog.github.io/blog/2020/07/29/IOCTL-sample/)  
<br>  

以上の内容がお役に立てば幸いです。
***
`変更履歴`  
`2020/08/11 created by Tsuda`  

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  