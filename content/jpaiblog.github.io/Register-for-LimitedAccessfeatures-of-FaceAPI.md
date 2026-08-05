---
title: Azure Face API 顔認識機能の制限および利用申請について
date: 2023-03-14 00:00:00
categories:
- Face API
tags:
- Face API Recognition Identify
---
Azure Face API 顔認識機能の制限および、利用申請について、以下にご説明します。
<!-- more -->
<br>

***
# Face リソース作成日と機能制限

2022 年 6 月より前に作成された Face リソースでは、2023 年 6 月 30 日までの間、Face API が提供する全ての機能が利用することができました。<br>
これは、Face API の機能制限に関する発表が 2022 年 6 月に行われたため、それより前に作成された Face リソースに対する約１年の移行措置でした。<br><br>
なお、移行措置は 2023年 6月 30日 に終了しました。<br>それ以降にも、後述する「顔認識」機能を継続利用する場合は、利用申請および承認が必要です。<br>

[Responsible AI investments and safeguards for facial recognition | Azure Blog and Updates | Microsoft Azure (Posted on June 21, 2022)](https://azure.microsoft.com/en-us/blog/responsible-ai-investments-and-safeguards-for-facial-recognition/)
> Starting June 30, 2023, existing customers will no longer be able to access facial recognition capabilities if their facial recognition application has not been approved.
 
[Azure ポータル](https://portal.azure.com/) で Face リソースページの [プロパティ] メニューを開くと、リソース作成日が確認できます。

![face01](https://jpaiblog.github.io/images/Register-for-LimitedAccessfeatures-of-FaceAPI/face01.png "face01")

# Face API 提供機能について

Azure Face API の提供機能は、主に、以下の 2つの機能（顔検出、顔認識）に大別できます。
 

    1. 顔検出
    2. 顔認識
    

<p>
上記のうち、「顔検出」（<B>Facial Detection</B>）機能には  「<B>廃止された機能</B>」 と、2023 年 6 月 30 日以降も  「<B>申請不要で利用できる機能</B>」および、 「<B>申請および承認が必要な機能</B>」 の 3 つが含まれます。<br><br>
「顔認識」 機能は、その配下の 「顔識別」 （<B>Facial identification</B>） および 「顔検証」（<B>Facial verification</B>） ともに全て 「<B>申請および承認が必要な機能</B>」 です。
</p>
<p>
それぞれの詳細を、以下に詳述します。
</p>

# 廃止された機能

## 「顔検出」機能を通じて得られる顔属性の一部の情報
<p>
「顔検出」機能を通じて得られる顔属性のうち、特定の一部情報は廃止されました。詳細は以下をご参照ください。 これらは、申請を行っても利用することはできません。

[顔検出と顔属性 - Face - Azure Cognitive Services | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/cognitive-services/computer-vision/concept-face-detection#attributes)
>  注意事項：感情の状態やアイデンティティの属性の推測に使用できる顔認識機能は廃止されました。この機能は使い方を誤ると、ステレオタイプ化、差別、サービスの不当な拒否に人々をさらす可能性があります。 たとえば、感情、性別、年齢、笑顔、顔ひげ、髪、メイクを予測する機能が該当します。 
</p>

# 申請不要で利用できる機能
<p>
「顔検出」 機能のみを利用する場合は、利用申請は不要です。<br>
この機能は 「この画像に 1 つ以上の人間の顔がありますか?」 という質問に答えます。画像内の人間の顔が検出され、その位置を示す座標情報と属性情報が返されます。<br>
たとえば、人数（顔の数）を数えたり、プライバシーのために画像の顔領域に "ぼかし" を入れたりするだけのユースケースでの利用が想定されています。<br>

[顔認識に関する責任あるAIポリシーの変更とガイダンスについて | Microsoft Base](https://www.microsoft.com/ja-jp/events/azurebase/blog/responsible-ai-investments-and-safeguards-for-facial-recognition/)
> 顔検出機能 (ぼかし、露出、眼鏡、頭部姿勢、ランドマーク、ノイズ、オクルージョン、顔の境界ボックスなど) は引き続き一般提供を行いますので、申請は不要です。
</p>
<p>
なお、「顔検出」機能において、もし、顔情報を一意の識別子文字列で特定するための「Face ID」を利用する場合には、申請および承認が必要です。<br>

[顔検出、属性、入力データ | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/ai-services/computer-vision/concept-face-detection#face-id)
> Face ID には、申し込みフォーム（ https://aka.ms/facerecognition ）に入力することで申請できる、制限付きアクセスの承認が必要です。 
<br>

そのため、申請承認なしで「顔検出」機能の Detect API を利用する場合には、「Face ID」利用有無を指定する「returnFaceId」 パラメーター を 明示的に「false」 として設定するようにご留意ください。（既定値「true」の設定のまま利用する場合には、申請承認が必要です）

[Face API - v1.0　API Reference | Face - Detect](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236)
> Request parameters / <B>returnFaceId</B> (optional) / boolean / 
Return faceIds of the detected faces or not. <B>The default value is true.</B>
</p>

# 申請および承認が必要な機能
<p>「顔認識」機能は、「申請および承認が必要な機能」です。<br>
なお、Face API における「顔認識」機能配下の「<B>顔識別（Facial identification）</B>」、「<B>顔検証（Facial verification）</B>」の両機能の差異については、以下のドキュメント抜粋をご参照ください。

[Azure Face サービスとは - Azure Cognitive Services | Microsoft Docs](https://docs.microsoft.com/ja-jp/azure/cognitive-services/computer-vision/overview-identity#identification)
> 顔識別では、画像内の 1 つの顔を、安全なリポジトリ内の一連の顔と <B>"一対多"</B> で照合できます。

> 検証操作は、"これら 2 つの顔は同じ人物のものでしょうか?" という質問に答えます。
また、検証では、画像内の顔をセキュリティで保護されたリポジトリや写真からの 1 つの顔と <B>"1 対 1"</B> で照合して、それらが同じ個人であることが確認されます
</p>
<p>

[顔認識利用申請フォーム](https://aka.ms/facerecognition) では、申請対象ユース ケースが「顔識別」か「顔検証」かどちらに該当するかを選択して申請する必要があります。

ユースケースに関する詳細は、以下のドキュメントもご参照ください。<br>
[Use cases for Face - Azure Cognitive Services | Microsoft Learn](https://learn.microsoft.com/ja-jp/legal/cognitive-services/face/transparency-note?context=%2Fazure%2Fcognitive-services%2Fcomputer-vision%2Fcontext%2Fcontext) 

</p>
<p>


申請フォームに記載されたもの以外のユースケースに関するフィードバックについては、申請フォームとは別途の [フィードバックフォーム](https://aka.ms/CogSvcsLimitedAccessFeedback) が用意されています。<br>
なお、こちらのフォームに登録した内容はフィードバックに留まり、利用申請とはみなされない点にご留意ください。
</p>

# 申請に関する情報
<P>

[申請フォーム](https://aka.ms/facerecognition) および申請後のご連絡メール等は、英語のみでの対応となり、日本語対応はございません。<br>
Face API の利用申請を管理・レビューするのは米国本社内の専用部門であり、公平性と独立性のために、技術サポート部門を含めた各国の他の部門はレビュープロセスに直接介入できないためです。
</p>
<P>
申請に関する FAQ については、以下のドキュメントもご参考として頂けます。

[Cognitive Services の制限付きアクセス機能 - Azure Cognitive Services | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/cognitive-services/cognitive-services-limited-access#faq-about-limited-access)
> 制限付きアクセスに関する FAQ <br>（抜粋）<br>
Q.制限付きアクセスのサービスを使用する資格があるのはだれですか?<br>
Q.管理下の顧客とは? 管理下の顧客に該当するかどうかがわからない場合はどうすればよいですか?<br>
Q.申請が拒否された場合、私のデータはどうなりますか?<br>

</P>

# 関連ドキュメント
<P>

- [Responsible AI investments and safeguards for facial recognition | Azure Blog and Updates | Microsoft Azure](https://azure.microsoft.com/en-us/blog/responsible-ai-investments-and-safeguards-for-facial-recognition/)<br>
- [顔認識に関する責任あるAIポリシーの変更とガイダンスについて | Microsoft Base　（※ 上記ドキュメントの日本語翻訳です）](https://www.microsoft.com/ja-jp/events/azurebase/blog/responsible-ai-investments-and-safeguards-for-facial-recognition/)<br>
- [Responsible AI investments and safeguards for Facial Recognition | Azure の更新情報 | Microsoft Azure](https://azure.microsoft.com/ja-jp/updates/facelimitedaccess/)<br>
***
`変更履歴`  
`2023/03/22 created by Uehara`  
`2024/05/20 modified by Uehara`

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  