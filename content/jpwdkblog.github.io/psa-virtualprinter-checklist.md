---
title: PSA - Virtual Printer のチェックリスト
date: 2026-04-08 00:00:00
categories:
- printscan
tags:
- Printer
---
この記事では、Print Support App (PSA) で仮想プリンターを作成するときに記述する Package.appxmanifest が適切な内容かどうかのチェック項目を紹介します。

<!-- more -->

<br>

***
## PSA - Virtual Printer について
PSA v4 API で提供された機能で、PSA のアプリを提供することで OS に仮想プリンターを追加することができます。 
詳細については、ドキュメント [Print Support App v4 API design guide](https://learn.microsoft.com/en-us/windows-hardware/drivers/devapps/print-support-app-v4-design-guide) をご参照ください。  

仮想プリンターの作成には、まず Package.appxmanifest へ仮想プリンター追加のための記述が必要となります。そして、その仮想プリンターの機能を定義する Print Device Capabilities XML ファイルをアプリのリソースとして組み込みます。今回は、その Package.appxmanifest を作成する際に注意する点をチェックリストとして紹介いたします。記述が間違っていたり、記述に不足があったりすると、仮想プリンター自体が作成されません。  
<br>
  
## Package.appxmanifest の例
以下が仮想プリンター追加のための Package.appxmanifest の例となります。  
```xml
    <printsupport2:Extension Category="windows.printSupportVirtualPrinterWorkflow" EntryPoint="Tasks.VirtualPrinterBackgroundTask">
        <printsupport2:PrintSupportVirtualPrinter DisplayName="ms-resource:PdfPrintDisplayName" PrinterUri="contoso-psa:print-to-pdf" PreferredInputFormat="application/oxps" OutputFileTypes="pdf" PdcFile="Config\PrinterPdc.xml">
        <printsupport2:SupportedFormats>
            <printsupport2:SupportedFormat Type="application/pdf" MaxVersion="1.7" />
        </printsupport2:SupportedFormats>
        </printsupport2:PrintSupportVirtualPrinter>
    </printsupport2:Extension>
```

アプリをインストール後、正常に仮想プリンターが追加されると、次のようにプリンターが表示されます。  
<img src="https://jpwdkblog.github.io/images/psa-virtualprinter/btanddevices_printers.png" width="50%" align="left" border="1"><br clear="left">
<br>
  
  
## マニフェスト ファイルのチェックリスト

| 属性 / 要素名 | 必須かどうか | 内容・意味 | 注意点 |
|---|---|---|---|
| `PrintSupportVirtualPrinter` | 必須 | 仮想プリンターを定義するルート要素 |  |
| `DisplayName` | **必須** | プリンター名を表す ms-resource URI | 必ずリソースの URI を指定します。<br>指定したリソースに必ず文字列データが定義されていること。<br>上記例ではリソースデータが<br>`<data name="PsPrintDisplayName"><value>VirtualPostScriptPrinter</value></data>`<br>のようになります。 |
| `PdcFile` | **必須** | Print Device Capabilities (PDC) XML のリソース | この属性が存在しない場合、仮想プリンターは作成されません。次のようにプロジェクトに含まれていること。<br><img src="https://jpwdkblog.github.io/images/psa-virtualprinter/pdcfile.png" width="50%" align="left" border="1"> |
| `PdrFile` | 任意 | Print Device Resources (PDR) XML | 任意のため属性自体がなくても OK です。 |
| `PrinterUri` | 任意 | 仮想プリンター識別用 URI | 仮想プリンターポート名の生成に利用されたり、PSA 内部で出力先プリンターを識別するために利用したりします。複数の仮想プリンターを定義する場合は、設定することをお勧めします。明示的に指定しなかった場合、Windows が設定します。 |
| `PreferredInputFormat` | 任意 | アプリが希望する入力データ形式 | 既定値は `application/oxps` で `application/oxps` または `application/postscript` のどちらかのみが指定可能です。それら以外を指定した場合、仮想プリンターの作成に失敗します。 |
| `OutputFileTypes` | 任意 | 出力ファイルの形式の指定 | PDF など出力ファイルの形式を指定します。この値を設定すると、ユーザーに対して [名前を付けて保存] ダイアログを表示します。複数指定する場合は "PDF,PS,PWGR" のようにカンマで区切ります。<br>値を設定しないこともできます。その場合、[名前を付けて保存] ダイアログを表示されません。ファイルとして保存せずデータをアプリやサービス、クラウドに転送するような場合は、この値を削除します。 |
| `SupportedFormat` | 任意（複数可） | 対応する入力フォーマットを子要素に指定 |  |
| `SupportedFormat/Type` | **必須** | 対応フォーマットの MIME タイプ | `SupportedFormat` を指定する場合は必須です。 |
| `SupportedFormat@MaxVersion` | 任意 | 対応する最大バージョン | 数値のみが指定可能。文字列で指定した場合は、無視されます。 |
<br>
  
  
## その他
Package.appxmanifest に必要な設定が記述されていても、`PdcFile` に指定した Print Device Capabilities (PDC) XML に記述ミスや誤った内容が残っている場合、仮想プリンターが作成されない可能性があります。  
そのため、仮想プリンターが作成されない場合は、XML としての構文に間違いがないか、PDC として利用できないエレメントの記載がないかといったことも併せてチェックしてください。  
<br>  
  
## 関連ドキュメント
[MSIX Manifest Specification for Print Support Virtual Printer - Windows drivers | Microsoft Learn](https://learn.microsoft.com/en-us/windows-hardware/drivers/devapps/msix-manifest-specification-print-support-virtual-printer)  
[printSupport2:PrintSupportVirtualPrinter - Windows UWP applications | Microsoft Learn](https://learn.microsoft.com/en-us/uwp/schemas/appxpackage/uapmanifestschema/element-printsupport2-printsupportvirtualprinter)  
[printSupport2:SupportedFormat - Windows UWP applications | Microsoft Learn](https://learn.microsoft.com/en-us/uwp/schemas/appxpackage/uapmanifestschema/element-printsupport2-supportedformat)  
<br>
   

***
`変更履歴`  
`2026/04/08 created by rwiaida`

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  