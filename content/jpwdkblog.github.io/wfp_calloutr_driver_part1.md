---
title: 第1回：WFP を理解する ― カーネルコールアウトドライバー実装の土台
date: 2026-02-05 00:00:00
categories:
- Development
tags:
- Network
- WFP
---
この記事では、Windows Filtering Platform (WFP) のカーネルコールアウトドライバー実装に初めて取り組む開発者向けに、理解すべき土台と構造を "迷わず" 把握できるよう整理します。単なる API 羅列ではなく、なぜその設計が必要なのか／実装者はどの位置に立つのかをクリアにすることを目的としています。
<!-- more -->
<br>

***
## 1. WFP は何を提供する仕組みなのか
WFP は Windows ネットワークスタックに対する 統一的なフィルタリング基盤です。旧来の [TDI](https://learn.microsoft.com/ja-jp/previous-versions/windows/hardware/network/ff565094(v=vs.85)) や [LSP](https://learn.microsoft.com/en-us/windows/win32/winsock/layered-protocols-and-protocol-chains-2)、[NDIS フィルター ドライバー](https://learn.microsoft.com/ja-jp/windows-hardware/drivers/network/introduction-to-ndis-filter-drivers)といった複数のレイヤーで分断された仕組みを置き換え、以下を単一の機能で扱えるようにしています。   
- パケット単位／ストリーム単位での検査・変更  
- IPv4 / IPv6 双方のサポート  
- アプリケーション単位、ユーザー単位、コネクション単位でのポリシー制御  
- IPsec、RPC を含む幅広いレイヤーでの分類  

特に開発者にとって重要なのは、カーネルでの高速分類とコールアウトによる拡張が可能な点です。コールアウトドライバーは、特定レイヤーで到達したネットワーク データに対し、カスタム処理（深い検査、変更、再注入など）を行うことができます。   
 
  > WFP のコールアウトはフックに近い処理となります。NDIS フィルター ドライバーの場合、プロトコル スタック - NDIS ミニポート ドライバー間のパケットの通過経路（データパス）へインライン処理として追加されるのに対して、WFP のコールアウトは、WFP の場合はパケットの分類処理に割り込んで処理が行われるというイメージです。  
  
<br>  
<br>  
  
## 2. WFP のアーキテクチャを “位置関係” で理解する
WFP の中心には BFE (Base Filtering Engine) があり、ユーザーモードとカーネルモード双方に分類エンジンを持ちます。
- ユーザーモード フィルター エンジン：RPC、IPsec などを担当（約10レイヤー）  
- カーネルモード フィルター エンジン：TCP/IP スタックのネットワーク／トランスポート層（約50レイヤー）  
👉 各レイヤーの一覧はこちら [Filtering Layer Identifiers / Fwpmu.h](https://learn.microsoft.com/en-us/windows/win32/fwp/management-filtering-layer-identifiers-)
<br>  
  
フィルタリングはこのエンジン上で行われ、以下の構成要素から成り立ちます。
 - Filter（フィルター）  
   条件とアクション（許可・拒否・コールアウト呼び出しなど）を定義したルール。複数条件を持つ複合フィルターも作成できます。※フィルターはドライバー ソフトウェアを指しているのではなく、挙動を決定する定義です。
 - Sublayer（サブレイヤー）  
   フィルター同士の競合を整理し、優先順位（ウェイト）を設定するための論理的なレイヤー。コールアウト ドライバーは自身のサブレイヤーを持つのが一般的です。
 - Callout（コールアウト）  
   分類処理の中で呼び出される "拡張ポイント"。コールアウト ドライバーは以下のような用途を実現します。  
   開発者にとってコールアウトはネットワーク スタックにフックを追加する最小単位であり、分類のたびに classifyFn が実行されます。
    - 深いパケット検査（Deep Inspection）  
    - パケット／ストリームデータの変更と再注入  
    - データのログ収集   
  
<br>  
<br>  
  
## 3. FWPM（管理）と FWPS（実行）の違いを最初に押さえる  
WFP では 管理プレーン（FWPM） と 実行プレーン（FWPS） の API が明確に分離されています。以下は、具体的な API 例です。
### *Fwpm*（管理プレーン：ユーザーモード）
ユーザーモードサービスが 「WFP の設定を登録する側」 を担当します。  
#### 役割
 - エンジンのオープン、サブレイヤー追加、フィルター追加の削除 
 - トランザクション（Begin / Commit / Abort）  

#### 代表的な関数一覧  
| 関数名 | 説明 |
|-------|------ |
| `FwpmEngineOpen0` | BFE（Base Filtering Engine）への接続を開く |
| `FwpmSubLayerAdd0` | 独自サブレイヤーを登録する |
| `FwpmCalloutAdd0` | コールアウト定義を管理プレーンに追加する |
| `FwpmFilterAdd0` | フィルターを追加し WFP に適用する |
| `FwpmFilterDeleteById0` | フィルターを削除する |
| `FwpmTransactionBegin0`, `FwpmTransactionCommit0`, `FwpmTransactionAbort0` | フィルター操作のトランザクション制御 |
  
### *Fwps*（実行プレーン：カーネルモード）
カーネルドライバー（コールアウトドライバー）が 「実際の分類処理に参加する側」 を担当します。  
#### 役割
 - *classifyFn* によるパケット分類、*notifyFn* による通知の受け取り、*flowDeleteFn* でのデータフローの停止時の処理
 - ストリーム／パケットのクローン・変更・再注入
 - メタデータ参照
 - コールアウト登録／解除  

#### 代表的な関数一覧  
| 関数名 | 説明 |
|-------|------ |
| `FwpsCalloutRegister` | *classifyFn* / *notifyFn* / *flowDeleteFn* を登録 |
| `FwpsCalloutUnregisterByKey` | 登録解除 |
| `FwpsAllocateCloneNetBufferList0` | パケット（NBL）のクローン生成（修正・再注入に使用）|
| `FwpsCopyStreamDataToBuffer0` | ストリームデータを連続バッファへコピー |
| `FwpsInjectNetworkSendAsync0` | パケットを再注入する |
| `FwpsAcquireClassifyHandle0`, `FwpsReleaseClassifyHandle0` | 分類メタデータにアクセスするためのハンドル取得／解放 |  

まとめると、WFP の "設定" は FWPM、実際の "分類と処理" は FWPS と覚えておきます。
  
  
<br>  
<br>  
  
## 4. Callout Driver の構造（最小イメージ）
カーネルコールアウトドライバーは、次のような実装を行います。ユーザーモード サービスによる管理を行うドライバーの場合は `Fwpm**` は通常は呼び出しません。
1. `DriverEntry` 
   - `FwpsCalloutRegister` によりコールアウトを登録
   - `FwpmCalloutAdd`／`FwpmFilterAdd` によるレイヤーの指定や、フィルター条件の設定（通常ユーザーモード サービス側で担当）
2. `FWPS_CALLOUT`.*classifyFn*
   - ネットワークデータ到達時に呼ばれるコア関数
   - パケット (およびネットワーク ストリーム) のチェック、変更、必要に応じて一時的に処理を保留、ブロック等を実行
3. `FWPS_CALLOUT`.*notifyFn*
   - フィルターが追加されたり削除された時に通知を受信する関数。または BFE 状態が変化した際の通知を受け取る関数。
4. Packet/Stream 操作の補助を関数 (ドライバー独自の関数)
   次のような各種処理を行う各種関数を用意し、その関数から Fwps API を呼び出します。
   - パケットクローン、再注入
   - ストリームデータのバッファコピー
     例：`FwpsAllocateCloneNetBufferList0`、`FwpsCopyStreamDataToBuffer0` などを使用する処理
5. Unload 時のクリーンアップ
   - `FwpsCalloutUnregisterBy**` で登録の解除  
   - 割り当てリソース解放  

これらを KMDF / WDM ドライバーいずれでも実装可能ですが、リソース管理の観点で KMDF での実装をお勧めします。
  
  
<br>  
<br>  
  
## 5. コールアウト処理の選択
WFP のコールアウトは大きく3分類に分けられます。
 - Inline Inspection：トラフィックを変更せず観察だけを *classifyFn* 内で行う（action = CONTINUE）
 - Inline Modification：クローン → 加工 → パケットの再注入を *classifyFn* の中で実施
 - Out-of-band Inspection：一旦データを保留して、*classifyFn* の外部（専用のスレッドや、WorkItem、DPC ルーチン）で処理して、パケットの再注入を行う
実装の難度と副作用の大きさは、Inline Inspection ＜ Inline Modification ＜ Out-of-band の順に上がります。まずは Inline Inspection で処理を理解し、その後、目的に応じてパケットの変更系に進むのが学習の流れとしては理解しやすいです。

それぞれの用途と、特徴は次の通りです。  
|種類|向いている用途|副作用の大きさ※|
|---|---|---|
|Inline Inspection|ログ、監査、軽い条件分岐|小|
|Inline Modification|NAT / ヘッダ書換|中|
|Out-of-band|ストリーム単位の解析・DLP|大
|  
  > ※ここでの副作用とは、ドライバーの実装・設計ミスにより、OS のネットワーク挙動に生じる悪影響（遅延・通信断・高負荷・デッドロックなど）を指しています。
  
  
<br>  
<br>  

## 6. フィルター設定の "落とし穴" について
初めにつまづきやすいポイントとしては、コールアウト側の実装ではなく フィルター側の設定ミスです。  
 - フィルターの条件を詰め込み過ぎて分類遅延が発生
 - Weight や Sublayer の整合が取れず、期待より前に別のフィルターが介入
 - ALE (Application Layer Enforcement 層と Transport 層の理解不足により、期待しているレイヤーで *classifyFn* が呼ばれない  
特に ALE レイヤー（接続確立前後の処理）は、WinSock の listen / bind / connect / accept のどの部分に該当するのかを理解しておくのが重要です。  
関連ドキュメント : [ALE Layers](https://learn.microsoft.com/en-us/windows/win32/fwp/ale-layers)  

ALE は Winsock API と対になるよう設計されており、大まかな図で表すと次のようになります。  
```
// Client-side ALE Flow
Application
    |
    | socket()
    v
FWPM_LAYER_ALE_RESOURCE_ASSIGNMENT_V4/V6
    |
    | bind()
    v
FWPM_LAYER_ALE_BIND_REDIRECT_V4/V6      (allows redirecting the socket’s local address/port for as long as the socket exists)
    |
    | connect()
    v
FWPM_LAYER_ALE_CONNECT_REDIRECT_V4/V6   (allows modifying the remote address/port of an outbound connection)
    |
    v
FWPM_LAYER_ALE_AUTH_CONNECT_V4/V6       (first outbound SYN / first UDP send)
    |
    v
TCP 3-way handshake completes
    |
    v
FWPM_LAYER_ALE_FLOW_ESTABLISHED_V4/V6   (flow created; tracking only)
    |
    v
Data phase (send/recv)
    |
    v
FWPM_LAYER_ALE_ENDPOINT_CLOSURE_V4/V6   (FIN/RST / socket close)


// Server-side ALE Flow
Application
    |
    | socket()
    v
FWPM_LAYER_ALE_RESOURCE_ASSIGNMENT_V4/V6
    |
    | bind()
    v
FWPM_LAYER_ALE_BIND_REDIRECT_V4/V6      (allows redirecting the socket’s local address/port for as long as the socket exists)
    |
    | listen()
    v
FWPM_LAYER_ALE_AUTH_LISTEN_V4/V6        (listen call)
    |
 client connects
    |
    v
FWPM_LAYER_ALE_AUTH_RECV_ACCEPT_V4/V6   (first inbound SYN / UDP first packet)
    |
TCP 3-way handshake completes
    |
    v
FWPM_LAYER_ALE_FLOW_ESTABLISHED_V4/V6   (after a TCP 3-way handshake has successfully completed)
    |
    v
Data phase (send/recv)
    |
    v
FWPM_LAYER_ALE_ENDPOINT_CLOSURE_V4/V6

```

<br>  
<br>  


### 7. まとめ
今回（第1回）では、WFP のコールアウト ドライバー実装に必要な基礎的な内容について整理しました。  
#### ✔ 今回のポイント
 - WFP の全体像（BFE / ユーザーモード / カーネルモード）
 - FWPM（管理）と FWPS（実行）の違い
 - コールアウト処理の種類と選び方
 - ALE レイヤーの流れと注意点（connect / bind / accept の扱い）  
WFP では分かりにくい点が多いですが、これらを押さえることでサンプルコードへの理解、実際にドライバーの作成・デバッグの役に立つものと思います。

#### 次回（第2回）予告  
第2回のテーマ（予定）：実装編 基礎から実用へ  
 - コールアウトドライバーの最小コード（DriverEntry / classifyFn）
 - ユーザーモードサービスによるサブレイヤー・フィルター登録
 - netsh wfp、Security ログ、ETW を使った動作確認
 - Connect Redirect など、実案件でも役に立つシナリオ紹介
 - 開発環境セットアップ（WDK / テストサイン / カーネルデバッグ）
などを検討していますが、状況により変更となる可能性がありますことあらかじめご了承ください。  
  
<br>  
<br>  


***
`変更履歴`  
`2026/02/05 created by riwaida`

※ 本記事は 「[jpwdkblog について](https://jpwdkblog.github.io/blog/2020/01/01/aobut-jpwdkblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpwdkblog.github.io/blog/)」 および 「[記事一覧](https://jpwdkblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  

