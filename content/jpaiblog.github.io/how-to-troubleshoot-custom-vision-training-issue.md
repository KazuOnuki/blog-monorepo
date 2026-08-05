---
title: Custom Vision のトレーニングが失敗した場合の調査に必要な情報について
date: 2022-03-25 00:00:00
categories:
- Cognitive Services
tags:
- Custom Vision
---
Custom Vision のトレーニングが失敗した場合の調査に必要な情報をまとめました。
<!-- more -->
<br>

***
# Custom Vision のトレーニングが失敗した場合の調査について
Custom Vision でトレーニングを実行した際に何らかの原因によってトレーニングが失敗すると、そのイテレーションは "Failed" と表示されます。これはリソースの一時的な不足など一過性の問題でも発生するため、まずはリトライ (再実行) をお試しください。また、下記ドキュメントに記載されたトレーニング データの推奨量を満たしているかも併せてご確認ください。

- [Custom Vision のモデルを改善する方法](https://docs.microsoft.com/ja-jp/azure/cognitive-services/custom-vision-service/getting-started-improving-your-classifier)

もし繰り返し実行しても失敗する場合は別途原因の調査が必要となります。Azure ポータルからお問い合わせいただく際には、以下の情報を採取・提供いただけるとスムーズです。

### (1) トレーニングを実行したプロジェクトの ID (Project Id)

Custom Vision ポータル (https://www.customvision.ai/) 上で、
プロジェクトを選択した後、画面右上の歯車マーク (Settings) からご確認いただけます。

![cv-portal-01](https://jpaiblog.github.io/images/how-to-troubleshoot-custom-vision-training-issue/cv-portal-01.png "cv-portal-01")  

### (2) トレーニング (イテレーション) 毎に付与される ID (Iteration Id) 

まず (1) と同じプロジェクトの Settings で KEY の情報をメモしておきます。

![cv-portal-02](https://jpaiblog.github.io/images/how-to-troubleshoot-custom-vision-training-issue/cv-portal-02.png "cv-portal-02")  

次に下記のコンソールから、イテレーションを列挙する API を呼び出すことで Failed となったイテレーションの Iteration Id を確認することができます。

- [Custom Vision Training v3.3 - GetIterations](https://southcentralus.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Training_3.3/operations/5eb0bcc6548b571998fddec9)

コンソールの起動時には現在ご利用のリージョンを選択してください。

![api-console-01](https://jpaiblog.github.io/images/how-to-troubleshoot-custom-vision-training-issue/api-console-01.png "api-console-01")  

API の呼び出しには Training リソースの KEY および Project Id の情報が必要です。

![api-console-02](https://jpaiblog.github.io/images/how-to-troubleshoot-custom-vision-training-issue/api-console-02.png "api-console-02")  

API を呼び出した結果の "id" の部分が Iteration Id に相当するため、"status" が "Failed" となっているイテレーションの "id" をご提供ください。

![api-console-03](https://jpaiblog.github.io/images/how-to-troubleshoot-custom-vision-training-issue/api-console-03.png "api-console-03")  

### (3) トレーニングを実行したリソースのリソース ID

![cv-portal-03](https://jpaiblog.github.io/images/how-to-troubleshoot-custom-vision-training-issue/cv-portal-03.png "cv-portal-03")  

(1) と同様に Settings からご確認いただけます。

なお、Azure ポータルからの起票時に選択されたサブスクリプションと、同じサブスクリプションに含まれるリソースではない場合は、調査をお承りすることができませんのでご注意ください。

- [問い合わせ起票時のセキュリティ チェックの強化について](https://jpaztech.github.io/blog/information/Different-subscriptions-research/)

***
`変更履歴`  
`2022/03/25 created by Hiroki Nakagami`  

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  