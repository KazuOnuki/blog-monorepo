---
title: Custom Vision の Advanced トレーニングの利用方法
date: 2022-03-31 00:00:00
categories:
- Cognitive Services
tags:
- Custom Vision
---
Custom Vision の Advanced Training の利用方法をご紹介します。
<!-- more -->
<br>

***
# Custom Vision モデル作成 
Custom Vision ポータル (https://www.customvision.ai/) を使用して、画像のクラス分類 / または 物体検出のモデル作成が可能です。一連の流れについては、以下のドキュメントをご参照ください。

- [クイックスタート: Custom Vision Web ポータルを使用して画像分類器モデルを構築する](https://docs.microsoft.com/ja-jp/azure/cognitive-services/custom-vision-service/getting-started-build-a-classifier)

- [クイックスタート: クイックスタート: Custom Vision の Web サイトでオブジェクト検出器を構築する](https://docs.microsoft.com/ja-jp/azure/cognitive-services/custom-vision-service/get-started-build-detector)


モデルトレーニングでは "Quick Training" / "Advanced Training" のどちらかのタイプを選択可能です。上記ドキュメントは、比較的短時間で完了する Quick Training を前提として記載されていますが、この記事では、Advanced Training の利用手順をご案内します。

# Advanced Training の利用手順
### (1)  [Train] ボタンクリック
Custom Vision ポータル (https://www.customvision.ai/) 上で、
トレーニングデータをアップロードした後、画面右上の [Train] ボタンをクリックします。

![cv-advanced-01](https://jpaiblog.github.io/images/how-to-use-advanced-training/cv-advanced-01.png "cv-advanced-01") 

### (2) [Advanced Training] の設定

[Train] ボタンクリックで表示される子画面上で、Training Types：[Advanced Training] を選択します。

![cv-advanced-02](https://jpaiblog.github.io/images/how-to-use-advanced-training/cv-advanced-02.png "cv-advanced-02") 

Custom Vision では、トレーニング時間あたりの課金を設定させて頂いております。

- [Custom Vision の価格](https://azure.microsoft.com/ja-jp/pricing/details/cognitive-services/custom-vision-service/?cdn=disable)

そのため、ご予算の範囲内で今回のトレーニングにかけられる時間の最大値をTraining budget に設定してください。

なお、Custom Vision ポータル では、トレーニングを停止する機能のご提供がないことにご留意ください。

また、Advanced Training が完了次第、メールでお知らせすることが可能です。

お知らせ機能を利用する場合には、[Send me an email notification after training completes] のチェックボックスをクリックして、任意の Email address を記載してください。

[Train] ボタンをクリックするとトレーニングが始まります。誠に恐れ入りますが、トレーニング進捗や完了までの残り時間などの表示機能のご提供はありません。前述の メールでのトレーニング完了お知らせ機能のご利用をご検討ください、

# お問い合わせについて

リソース個別の技術的なご質問については、[DEVELOPER サポートプラン](https://azure.microsoft.com/ja-jp/support/plans/) 以上のサポートプランをご契約いただき、Azure ポータルからお問い合わせください。

なお、Azure ポータルからの起票時に選択されたサブスクリプションと、同じサブスクリプションに含まれるリソースではない場合は、調査をお承りすることができませんのでご注意ください。

- [問い合わせ起票時のセキュリティ チェックの強化について](https://jpaztech.github.io/blog/information/Different-subscriptions-research/)

***
`変更履歴`  
`2022/03/31 created by Uehara`  

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  