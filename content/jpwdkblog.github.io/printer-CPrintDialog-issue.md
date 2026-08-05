---
title: CPrintDialog を利用したアプリケーションから印刷できない
date: 2023-06-05 00:00:00
categories:
- printscan
tags:
- CPrintDialog
---
この記事は、CPrintDialog を利用したアプリケーションから印刷した際に発生する問題について説明します。
<!-- more -->
<br>

***
### 現象
MFC の CPringDialog クラスを利用して [印刷] ダイアログから印刷を行った場合、正常に印刷が行われない場合があります。この現象は CPrintDialog::CPrintDialog() の第一引数 bPrintSetupOnly に TRUE、第二引数 dwFlags に PD_USEDEVMODECOPIES を指定している、または第二引数に何も設定していない場合に発生します。(第二引数 dwFlags に何も設定しない場合は、既定で PD_USEDEVMODECOPIES が設定されます。) 

なお、この現象が発生するとき、プリンター ドライバー側の視点では DrvStartDoc 関数が呼ばれません。

***
### 原因
CPrintDialog::CPrintDialog() の第一引数 bPrintSetupOnly に TRUE、第二引数 dwFlags に PD_USEDEVMODECOPIES が指定された状況では、PrintDialog::m_pd構造体の nCopies メンバーが既定で 0 となります。この値は、印刷する部数を示しており、最終的に DEVMODE 構造体の dmCopies メンバーに設定されて GDI およびプリンタードライバーで利用されます。GDI は DEVMODE.dmCopies が 0 の場合、印刷する部数は無いものと判断して印刷を行いません。その際、GDI はプリンター ドライバーの DrvStartDoc 関数を呼び出しません。

***
### 回避方法
CPrintDialog::CPrintDialog() の実行後に CPrintDialog::m_pd構造体の nCopies メンバーに 1 を設定します。

以下は回避方法としてのサンプルコード例となります。 CPrintDialog::CPrintDialog(TRUE) で dlg オブジェクトを構築した後に、m_pd構造体の nCopies に 1 を設定して、StartDoc 関数を実行します。  

```c

    HDC printHDC;
    CString strMsg;

    CPrintDialog dlg(TRUE);
    dlg.m_pd.nCopies = 1; 
    if (dlg.DoModal() == IDOK)
    {
        // DEVMODEの取得
        DEVMODE* devmode = dlg.GetDevMode();

        //印刷用HDCの取得
        printHDC = CreateDC(NULL, dlg.GetDeviceName(), NULL, devmode);
        if (NULL == printHDC)
        {
            strMsg.Format(_T("CreateDC is NULL"));
            MessageBox(strMsg);
            return;
        }

        CDC PrinterDC;
        PrinterDC.Attach(printHDC);

        CString 	docname;
        docname.Format(_T("PrintTest"));
        DOCINFO    docinfo = { 0 };

        //DOCINFOを用意
        docinfo.cbSize = sizeof(docinfo);
        docinfo.lpszDocName = docname;

        PrinterDC.StartDoc(&docinfo);
```
***
### 参考情報
[CPrintDialog クラス](https://learn.microsoft.com/ja-jp/cpp/mfc/reference/cprintdialog-class?view=msvc-170)   
[DEVMODEA 構造体 (wingdi.h)](https://learn.microsoft.com/ja-jp/windows/win32/api/wingdi/ns-wingdi-devmodea)  
[PRINTDLGA structure (commdlg.h)](https://learn.microsoft.com/ja-jp/windows/win32/api/commdlg/ns-commdlg-printdlga)


***
`変更履歴`  
2023/06/05 created by mitsuchi

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  