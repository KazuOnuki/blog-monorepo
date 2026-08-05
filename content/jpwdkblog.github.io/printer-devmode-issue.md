---
title: プリンタ― ドライバ―のアップデートを行った際に DEVMODE 情報が更新されない
date: 2022-09-20 00:00:00
categories:
- printscan
tags:
- devmode
---
この記事は、プリンタードライバーのアップデートを行った際に発生する問題について説明します。
<!-- more -->
<br>

***
### 前提となるシナリオ
プリンタードライバーのアップデート時にプライベート部分の DEVMODE サイズや構造体をプリンタードライバーが更新している場合になります。

***
### 発生する問題
プリンタードライバーのアップデート時、更新されるドライバーでは、プライベート部分の DEVMODE サイズや構造体を更新している場合があります。このようなシナリオでは、プリンタードライバーが依頼した新しいバージョンの DEVMODE の形式に合わせて、各種 DEVMODE の値を OS が レジストリへ保存・更新します。
しかし、ドライバーの更新タイミングにおいて、OS がレジストリへの書き込み処理を行わない問題があるため、システムの再起動等を行うと、印刷設定が保存されなかったり、プリンタードライバーが予期せぬ挙動を示したりする場合があります。

***
### 回避方法
以下の OS のバージョンでは修正されております。

・Windows 11  
・Windows 10 21H2 ([2022 年 6 月 28 日 — KB5014666 (OS ビルド 19042.1806、19043.1806、19044.1806) プレビュー](https://support.microsoft.com/ja-jp/topic/2022-%E5%B9%B4-6-%E6%9C%88-28-%E6%97%A5-kb5014666-os-%E3%83%93%E3%83%AB%E3%83%89-19042-1806-19043-1806-19044-1806-%E3%83%97%E3%83%AC%E3%83%93%E3%83%A5%E3%83%BC-4bd911df-f290-4753-bdec-a83bc8709eb6)) 以降の更新プログラムが適用されている環境    
<br>
それ以外の OS バージョンでは、明示的に SetPrinter を呼び出して DEVMODE が格納されているレジストリの更新を行います。なお、この際、スプーラーサービスが保持している DEVMODEと同じ値で SetPrinter を実行した場合、レジストリの更新が行われないため、次のように確実にてレジストリが更新されるよう、一時的に DEVMODE の値を変更して SetPrinter を 実行します。  
<br>
回避方法としては、プリンタ―ドライバ―のアップデート後に、GetPrinter を1回、SetPrinter を2回呼び出します。   
１．まず、GetPrinter を呼び出して、現在の DEVMODE を取得します。   
２．続いて、1で取得した現在の DEVMODE から、値を変更（例えば、dmOrientation の値など）した DEVMODE を SetPrinter でセットします。この時、レジストリが更新されます。   
３．最後に 1 で取得した現在の DEVMODE をそのまま、SetPrinter でセットし、値を元に戻し、かつレジストリも再度更新します。   
<br>
[Modify printer settings by using the SetPrinter function](https://learn.microsoft.com/en-us/troubleshoot/windows/win32/modify-printer-settings-setprinter-api) のサンプル コードをベースとした回避方法の例となります。
上記 「１．まず、GetPrinter を呼び出して、現在の DEVMODE を取得します。」については、dmOrientation の値を変更するための DEVMODE と 「３．最後に 1 で取得した現在の DEVMODE をそのまま、SetPrinter でセットし、値を元に戻し、かつレジストリも再度更新します。」で 元に戻す DEVMODE を取得するために 2 回 GetPrinter を呼び出しています。
```c
// MySetPrinter
// Demonstrates how to use the SetPrinter API.  This particular function changes the orientation
// for the printer specified in pPrinterName to the orientation specified in dmOrientation.
// Valid values for dmOrientation are:
// DMORIENT_PORTRAIT (1) or DMORIENT_LANDSCAPE (2)
BOOL MySetPrinter(LPTSTR pPrinterName, short dmOrientation)
{
    HANDLE hPrinter = NULL;
    DWORD dwNeeded = 0;
    PRINTER_INFO_2 *pi2 = NULL;
    PRINTER_INFO_2 *pi2_org = NULL;
    DEVMODE *pDevMode = NULL;
    PRINTER_DEFAULTS pd;
    BOOL bFlag;
    LONG lFlag;

    // Open printer handle (on Windows NT, you need full-access because you
    // will eventually use SetPrinter)...
    ZeroMemory(&pd, sizeof(pd));
    pd.DesiredAccess = PRINTER_ALL_ACCESS;
    bFlag = OpenPrinter(pPrinterName, &hPrinter, &pd);
    if (!bFlag || (hPrinter == NULL))
        return FALSE;

    // The first GetPrinter tells you how big the buffer should be in
    // order to hold all of PRINTER_INFO_2. Note that this should fail with
    // ERROR_INSUFFICIENT_BUFFER.  If GetPrinter fails for any other reason
    // or dwNeeded isn't set for some reason, then there is a problem...
    SetLastError(0);
    bFlag = GetPrinter(hPrinter, 2, 0, 0, &dwNeeded);
    if ((!bFlag) && (GetLastError() != ERROR_INSUFFICIENT_BUFFER) || (dwNeeded == 0))
    {
        ClosePrinter(hPrinter);
        return FALSE;
    }

    // Allocate enough space for PRINTER_INFO_2...
    pi2 = (PRINTER_INFO_2 *)GlobalAlloc(GPTR, dwNeeded);
    if (pi2 == NULL)
    {
        ClosePrinter(hPrinter);
        return FALSE;
    }

    //１．まず、GetPrinter を呼び出して、現在の DEVMODE を取得します。
    //３．で DEVMODE の値を戻すために呼び出します。

    // The second GetPrinter fills in all the current settings, so all you
    // need to do is modify what you're interested in...
    bFlag = GetPrinter(hPrinter, 2, (LPBYTE)pi2, dwNeeded, &dwNeeded);
    if (!bFlag)
    {
        GlobalFree(pi2);
        ClosePrinter(hPrinter);
        return FALSE;
    }

    pi2_org = (PRINTER_INFO_2 *)GlobalAlloc(GPTR, dwNeeded);
    if (pi2_org == NULL)
    {
        GlobalFree(pi2);
        ClosePrinter(hPrinter);
        return FALSE;
    }
    
    //１．GetPrinter を呼び出して、現在の DEVMODE を取得します。
    //２．で dmOrientation の値を変更するために呼び出します。
    bFlag = GetPrinter(hPrinter, 2, (LPBYTE)pi2_org, dwNeeded, &dwNeeded);
    if (!bFlag)
    {
        GlobalFree(pi2);
        GlobalFree(pi2_org);
        ClosePrinter(hPrinter);
        return FALSE;
    }

    // Driver is reporting that it doesn't support this change...
    if (!(pi2->pDevMode->dmFields & DM_ORIENTATION))
    {
        GlobalFree(pi2);
        GlobalFree(pi2_org);
        ClosePrinter(hPrinter);
        return FALSE;
    }

    // Specify exactly what we are attempting to change...
    pi2->pDevMode->dmFields = DM_ORIENTATION;
    pi2->pDevMode->dmOrientation = dmOrientation;

    // Do not attempt to set security descriptor...
    pi2->pSecurityDescriptor = NULL;

    //２．続いて、１で取得した現在の DEVMODE から、値を変更（例えば、dmOrientation の値など）した 
    //DEVMODE を SetPrinter でセットします。この時、レジストリが更新されます。
    // Update printer information...
    bFlag = SetPrinter(hPrinter, 2, (LPBYTE)pi2, 0);
    if (!bFlag)
    // The driver doesn't support, or it is unable to make the change...
    {
        GlobalFree(pi2);
        GlobalFree(pi2_org);
        ClosePrinter(hPrinter);
        return FALSE;
    }

    //３．最後に 1 で取得した現在の DEVMODE をそのまま、SetPrinter でセットし、値を元に戻し、かつレジストリも再度更新します。
    bFlag = SetPrinter(hPrinter, 2, (LPBYTE)pi2_org, 0);
    if (!bFlag)
    {
        GlobalFree(pi2);
        GlobalFree(pi2_org);
        ClosePrinter(hPrinter);
        return FALSE;
    }

    // Tell other apps that there was a change...
    SendMessageTimeout(HWND_BROADCAST, WM_DEVMODECHANGE, 0L,
      (LPARAM)(LPCSTR)pPrinterName,
      SMTO_NORMAL, 1000, NULL);

    // Clean up...
    if (pi2_org)
        GlobalFree(pi2_org);
    if (pi2)
        GlobalFree(pi2);
    if (hPrinter)
        ClosePrinter(hPrinter);
    if (pDevMode)
        GlobalFree(pDevMode);
    return TRUE;
}
```
***
### 参考情報
[SetPrinter 関数](https://learn.microsoft.com/ja-jp/windows/win32/printdocs/setprinter)   
[GetPrinter 関数](https://learn.microsoft.com/ja-jp/windows/win32/printdocs/getprinter)  
[DEVMODEW 構造体](https://learn.microsoft.com/ja-jp/windows-hardware/drivers/display/the-devmodew-structure)


***
`変更履歴`  
2022/09/20 created by mitsuchi

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  