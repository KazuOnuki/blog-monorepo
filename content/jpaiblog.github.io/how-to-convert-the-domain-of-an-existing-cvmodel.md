---
title: Custom Vision モデルのドメイン変更方法
date: 2023-02-28 00:00:00
categories:
- Cognitive Services
tags:
- Custom Vision
---
Custom Vision モデルのドメイン変更方法をご紹介します。
<!-- more -->
<br>

***
# Custom Vision モデルのドメインについて 
Azure Custom Vision を使用して、画像のクラス分類 / または 物体検出のモデル作成が可能です。
モデルのトレーニング開始前には、モデルのドメイン（対応領域）を選択します。ドメインの詳細については、以下のドキュメントをご確認ください。

- [Custom Vision プロジェクトのドメインを選択する](https://learn.microsoft.com/ja-jp/azure/cognitive-services/custom-vision-service/select-domain)

一方で、モデルのトレーニングが完了した後にも、ドメインの変更は可能です。ドメインを変更することで、ご自分のシナリオに、より適したモデルとなり、精度の向上が見込める場合があります。

なお、ドメインの変更に際して、再度、画像のタグ付けの作業を行って頂く必要はありません。

また、ドメインの変更の結果が、既存モデルに上書きされることはありません。
１つのプロジェクトの中で、ドメインを変更したトレーニング結果は別々に保持されます。

以下は、Custom Vision ポータルで、１つのプロジェクトに異なるドメイン（General (Compact[S1] と General (Compact)) ）が保持されている例のスクリーンショットです。

![cv-domain01](https://jpaiblog.github.io/images/how-to-convert-the-domain-of-an-existing-cvmodel/cv-domain01.jpg "cv-domain01") 

この記事では、既存モデルのドメインの変更方法をご紹介します。

# 既存モデルのドメイン変更手順
### (1)  プロジェクト設定画面の表示
Custom Vision ポータル (https://www.customvision.ai/) 上で、プロジェクトを一覧表示します。

一覧から、対象のプロジェクトを選択し、ページ右上にある 歯車 アイコンを選択して、プロジェクト設定画面を表示します。

![cv-domain02](https://jpaiblog.github.io/images/how-to-convert-the-domain-of-an-existing-cvmodel/cv-domain02.jpg "cv-domain02") 

### (2) ドメインの選択と、変更の保存

[Domains] セクションで、[General [A1]] 等、任意ドメインを変更先として選択します。 [Save Changes] を選択して変更を保存します。

![cv-domain03](https://jpaiblog.github.io/images/how-to-convert-the-domain-of-an-existing-cvmodel/cv-domain03.jpg "cv-domain03") 

### (3) 再トレーニング実行

[Train] ボタンを使用して、再度トレーニングを行います。

![cv-domain04](https://jpaiblog.github.io/images/how-to-convert-the-domain-of-an-existing-cvmodel/cv-domain04.jpg "cv-domain04") 

### (4) 新しいモデルのテスト

トレーニング完了後、[Performance] タブで、ドメイン変更が反映されたモデルの新しい Iteration のパフォーマンスを確認できます。

![cv-domain05](https://jpaiblog.github.io/images/how-to-convert-the-domain-of-an-existing-cvmodel/cv-domain05.jpg "cv-domain05") 

個別の画像に対する精度を確認する場合には、[Quick Test] ボタンを使用して、該当の Iteration を指定したテストを行います。

![cv-domain06](https://jpaiblog.github.io/images/how-to-convert-the-domain-of-an-existing-cvmodel/cv-domain06.jpg "cv-domain06") 
　
 
***
`変更履歴`  
`2023/02/28 created by Uehara`  

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  