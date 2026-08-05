---
title: Windows PE でのネットワーク経由カーネル デバッガ接続方法について
date: 2020-07-29 17:00:00
categories:
- Windows PE
tags:
- カーネル デバッグ
---
Windows PE でのネットワーク経由のカーネルデバッガ接続方法についてご紹介します。
<!-- more -->
<br>

***
Windows PE でのシリアルケーブル経由でのカーネルデバッガ接続方法は、以下のドキュメントが公開されております。この方法では、カーネルデバッガを起動する側であるホスト PC を選びません。  
- [WinPE: Debug Apps - Kernel-mode debugging](https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/winpe-debug-apps#kernel-mode-debugging)  

対しまして、今回ご紹介するネットワーク経由のカーネルデバッガ接続方法では、通常、以下のブログでご紹介したような kdnet.exe は、ターゲット PC の再起動が必要となるため使えず、予めホスト PC の IP アドレスを Windows PE 側の BCD に設定しておく必要があります。  
- [Hyper-V 仮想マシンへのネットワーク経由のカーネルデバッガ接続方法](https://social.msdn.microsoft.com/Forums/ja-JP/db91ddff-f8ff-49d8-bef2-2a0c596414c2/hyperv-?forum=wdksupportteamja)  

それでは、具体的な手順を紹介します。

***
### 前提
今回は、Windows PE のイメージ作成を行う環境と、カーネルデバッガを起動するホスト PC は同じ PC とします。そして、その PC の Hyper-V 仮想マシン (UEFI を使うため第二世代、セキュアブートは OFF) を、ターゲット PC として、Windows PE の ISO を読ませるようにします。  

ホスト PC には、以下のリンクから、Windows ADK for Windows 10 バージョン 1903 と、ADK 用の Windows PE アドオンをインストールしています。  

- [Windows ADK のダウンロードとインストール](https://docs.microsoft.com/ja-jp/windows-hardware/get-started/adk-install)

- [Windows ADK for Windows 10、バージョン 1903 のダウンロード](https://go.microsoft.com/fwlink/?linkid=2086042)

- [ADK 用の Windows PE アドオンのダウンロード](https://go.microsoft.com/fwlink/?linkid=2087112)

***
### 手順

(1) [スタート] -> [Windows Kits] -> [展開およびイメージング ツール環境] を管理者権限で起動します。

(2) copype.exe で、例として D:\WinPE_amd64 に作業用ディレクトリを作成します。  
(D ドライブの使用は例であり、任意の場所で問題ありません。また、すでに D:\WinPE_amd64 が存在する場合は、コマンドがエラーとなるため、事前に削除しておきます。)

```console
> copype amd64 d:\WinPE_amd64
```

(3) 以下のコマンドを実行し、Windows PE 環境側のネットワーク接続でのカーネルデバッグ設定を行います。  

- (3-A) Windows PE 環境が UEFI の場合

   ```
   > bcdedit /store d:\WinPE_amd64\media\EFI\Microsoft\Boot\BCD /set {default} debug on

   > bcdedit /store d:\WinPE_amd64\media\EFI\Microsoft\Boot\BCD /set {default} bootdebug on

   > bcdedit /store d:\WinPE_amd64\media\EFI\Microsoft\Boot\BCD /dbgsettings NET HOSTIP:<カーネルデバッガを起動するホスト PC の IP アドレス、xxx.xxx.xxx.xxx> PORT:50005 key:5.5.5.5
   ```

- (3-B) Windows PE 環境がレガシー BIOS の場合

   ```
   > bcdedit /store d:\WinPE_amd64\media\Boot\BCD /set {default} debug on

   > bcdedit /store d:\WinPE_amd64\media\Boot\BCD /set {default} bootdebug on

   > bcdedit /store d:\WinPE_amd64\media\Boot\BCD /dbgsettings NET HOSTIP:<カーネルデバッガを起動するホスト PC の IP アドレス、xxx.xxx.xxx.xxx> PORT:50005 key:5.5.5.5
   ```

   `PORT の 50005 と key の 5.5.5.5 は例です。`

(4) 以下のコマンドを実行し、設定した結果に問題ないか確認します。  
```
> bcdedit /store d:\WinPE_amd64\media\EFI\Microsoft\Boot\BCD /dbgsettings
   key                     5.5.5.5
   debugtype               NET
   hostip                  xxx.xxx.xxx.xxx
   port                    50005
   dhcp                    Yes
```

(5) 上記が完了したら、以下のコマンドで Windows PE の ISO ファイルを作成します。  
```
> makewinpemedia /iso d:\WinPE_amd64\winpe_x64_debug.iso
```

(6) 上記の ISO ファイルで Hyper-V 仮想環境 (第二世代、セキュアブートなし) を作成します。  

(上記の手順 (3) で、(3-A) で設定を行ったことが前提です。第一世代ですと、UEFI ではないため、(3-B) でないとカーネルデバッグ接続できません。また、セキュアブートは無効にする必要があります。)  

使用する仮想スイッチは、上記「[Hyper-V 仮想マシンへのネットワーク経由のカーネルデバッガ接続方法](https://social.msdn.microsoft.com/Forums/ja-JP/db91ddff-f8ff-49d8-bef2-2a0c596414c2/hyperv?forum=wdksupportteamja)」の「1. ホストPC と仮想マシンをネットワーク接続します。」と同じものを使っています。
  
<div align="left">
<img src="https://jpwdkblog.github.io/images/winpe-kernel-debug-via-network/SecureBootSetting.png">
</div>

(7) カーネルデバッガ側は、以下のコマンドを実行することで Windows PE のターゲットにデバッガ接続し、ブレークインできます。  
   ```
   > windbg.exe -k net:port=50005,key=5.5.5.5
   ```
<br>

以上の内容がお役に立てば幸いです。  
***
`変更履歴`  
`2020/07/29 created by Tsuda`  

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  