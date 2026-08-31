---
title: Windows 11 26H1 ARM64 環境で ExtEscape の出力バッファを使用すると印刷に失敗する場合がある
date: 2026-08-31 00:00:00
categories:
- printscan
tags:
- bug
- ExtEscape
- printer driver
- Windows 11 26H1
- ARM64
---
この記事では、Windows 11 26H1 の ARM64 環境において、x86、x64、または ARM64EC アプリケーションから v3 プリンター ドライバーの `ExtEscape` を呼び出した際、出力バッファを使用する呼び出しがエラーとなり、印刷に失敗する場合がある問題について説明します。
<!-- more -->
<br>

***
### 概要
Windows 11 26H1 の ARM64 環境では、x86、x64、または ARM64EC アプリケーションから v3 プリンター ドライバーに対して `ExtEscape` を呼び出し、出力バッファを介してドライバーからデータを取得する場合、`ExtEscape` がエラーを返すことがあります。Microsoft Office など、タスク マネージャーの [詳細] タブにある [アーキテクチャ] 列で「ARM64 (x64 互換)」と表示されるアプリケーションも対象に含まれます。

例えば、次のように第 5 引数の `cjOutput` と第 6 引数の `lpOutData` を指定する呼び出しが該当します。

```cpp
int result = ExtEscape(
    hdc,
    VENDOR_ESCAPE_GET_DATA,
    0,
    nullptr,
    outputBufferSize,
    reinterpret_cast<LPSTR>(outputBuffer));
```

`ExtEscape` の戻り値が 0 より小さい場合はエラーを示します。ドライバーがこのエラーを印刷開始前の処理で受け取り、処理を中止する実装となっている場合、印刷ジョブが作成されず、アプリケーション上で印刷エラーとなることがあります。

`ExtEscape` の引数および戻り値の詳細については、次のドキュメントをご参照ください。  
[ExtEscape function (wingdi.h) - Win32 apps | Microsoft Learn](https://learn.microsoft.com/windows/win32/api/wingdi/nf-wingdi-extescape)

<br>

***
### 対象となる環境と条件
本問題は、次の条件をすべて満たす場合に発生することがあります。

- Windows 11 26H1 の ARM64 環境である
- 印刷元が x86、x64、または ARM64EC アプリケーションである。「ARM64 (x64 互換)」と表示される Microsoft Office などのアプリケーションも含む
- v3 プリンター ドライバーを使用している
- ドライバーまたはドライバーのユーザー インターフェイス モジュールが、`ExtEscape` の出力バッファを使用してデータを取得している

ARM64EC は、ARM64 コードと x64 コードの相互運用を可能にする ABI です。ARM64EC アプリケーションは ARM64 コードを実行する場合がありますが、x64 アプリケーションとの互換性を持つため、本記事における「ARM64EC を含まない ARM64 アプリケーション」とは区別しています。タスク マネージャーでは、ARM64EC アプリケーションのメイン実行ファイルは「ARM64 (x64 互換)」と表示されます。詳細については、[ARM64EC - Build and port apps for native performance on Arm | Microsoft Learn](https://learn.microsoft.com/windows/arm/arm64ec) をご参照ください。

出力データを要求しない呼び出し、すなわち `cjOutput` が 0 かつ `lpOutData` が `NULL` の呼び出しは、本問題の対象ではありません。また、ARM64EC を含まない ARM64 プロセスからの印刷や、すべてのプリンター ドライバーで印刷に失敗することを示すものではありません。

<br>

***
### 現象
本問題が発生した場合、次のような現象が確認されることがあります。

- x86、x64、または「ARM64 (x64 互換)」と表示されるアプリケーションから印刷すると、アプリケーションに印刷エラーが表示される
- 同じプリンター キューでも、Windows の設定画面からのテスト ページ印刷など、ARM64EC を含まない ARM64 プロセスを使用する印刷は成功する
- プリンター ドライバーの `DrvEscape` は呼び出され、正常終了している
- `DrvEscape` が出力バッファへデータを格納していても、呼び出し元の `ExtEscape` には負の値が返る
- 印刷開始前の `DocumentEvent` 処理で中断し、`StartDocPrinter` に進まないため、スプーラーに印刷ジョブが作成されない

このため、`DrvEscape` の戻り値と出力バッファだけを確認した場合、ドライバー側の処理は正常に見えることがあります。調査時には、`DrvEscape` から復帰した後、最終的にアプリケーション側の `ExtEscape` へ返される戻り値も併せて確認してください。

`DrvEscape` の仕様については、次のドキュメントをご参照ください。  
[DrvEscape function (winddi.h) - Windows drivers | Microsoft Learn](https://learn.microsoft.com/windows/win32/api/winddi/nf-winddi-drvescape)

<br>

***
### 原因
本問題は、ARM64 環境で x86、x64、または ARM64EC アプリケーションから印刷した際に `splwow64.exe` を介する経路において、`ExtEscape` の出力バッファを呼び出し元へ返す Windows 側の処理が正しく行われないことが原因です。本記事における `splwow64.exe` の説明は ARM64 版 Windows 上で確認された本問題の経路を指しており、x64 版 Windows 上の一般的な印刷経路を説明するものではありません。

ドライバーの `DrvEscape` が成功していても、その後の Windows 側の出力バッファ処理でエラーとなるため、呼び出し元では `ExtEscape` の失敗として認識されます。

<br>

***
### 回避方法
現時点では、OS の設定変更などによる回避方法は確認されていません。

アプリケーションまたはドライバーの実装を変更できる場合は、次の方法を検討してください。

- ARM64EC を含まない ARM64 アプリケーションから印刷する
- 印刷開始前の処理において、`ExtEscape` の出力バッファを使用しない設計へ変更する
- 必要なデータを別の方法で受け渡せる場合は、`ExtEscape` に依存しない通信方法へ変更する

これらは製品の構成や実装によって適用可否が異なります。変更を行う場合は、既存の対応 OS および各アーキテクチャで印刷動作に影響がないことをご確認ください。

<br>

***
### 状況
本問題は Windows の不具合であると認識しており、現在、修正する方向で作業を進めています。

修正プログラムの提供時期は現時点では未定です。提供時期などにアップデートがあり次第、こちらで状況を更新します。

関連情報：  
[Windows クライアントの更新リリース サイクル | Microsoft Learn](https://learn.microsoft.com/ja-jp/windows/deployment/update/release-cycle)

<br>

***
`変更履歴`  
`2026/08/31 created by riwaida`

※ 本記事は「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」の留意事項に準じます。  
※ 併せて「[ホームページ](https://jpwdkblog.github.io/blog/)」および「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」もご参照いただければ幸いです。
