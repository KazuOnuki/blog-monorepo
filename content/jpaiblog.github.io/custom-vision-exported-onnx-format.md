---
title: Custom Vision でモデルを ONNX 形式でエクスポートして利用する方法について
date: 2022-02-21 10:30:00
categories:
- Cognitive Services
tags:
- Custom Vision
---
Custom Vision において ONNX 形式でエクスポートされたモデルを使用する方法と参考情報を紹介します。
<!-- more -->
<br>

***

## エクスポートされた ONNX モデルを使用する方法

Custom Vision では、エッジ デバイス上でのリアルタイム推論用に最適化されている、"コンパクト ドメイン" で学習されたイテレーションでのみモデルのエクスポートが可能です。

- [コンパクト ドメインとは](https://docs.microsoft.com/ja-jp/azure/cognitive-services/custom-vision-service/select-domain#compact-domains)

もしコンパクト ドメイン以外のドメインで一度学習を行ったプロジェクトで、学習済みモデルのエクスポートを行いたい場合は、対象プロジェクトの設定 (Settings) から、[ドメイン (Domains)] のセクションでコンパクト ドメインを選択して、再度学習 (Train) を実行することでエクスポートが可能になります。

<img src="https://jpaiblog.github.io/images/custom-vision-exported-onnx-format/custom-vision-compact-domain.png" align="left" border="1"><br clear="left">

- [コンパクト ドメインへの変換方法](https://docs.microsoft.com/ja-jp/azure/cognitive-services/custom-vision-service/export-your-model#convert-to-a-compact-domain)

学習済みモデルをエクスポートするには、対象プロジェクトの [Performance] タブを選択し、[Export] をクリックします。

<img src="https://jpaiblog.github.io/images/custom-vision-exported-onnx-format/custom-vision-how-to-export.png" align="left" border="1"><br clear="left">

エクスポートの際にモデル ファイルの形式を指定できます。ONNX 形式のモデルを利用する場合は以下を選択します。

<img src="https://jpaiblog.github.io/images/custom-vision-exported-onnx-format/custom-vision-export-onnx.png" align="left" border="1"><br clear="left">

- [モデルをエクスポートする](https://docs.microsoft.com/ja-jp/azure/cognitive-services/custom-vision-service/export-your-model#export-your-model)

ONNX 形式のモデル ファイルをアプリケーションで利用する方法については以下のサンプルを適宜ご利用ください。

- [ONNXファイルを用いた推論サンプルコード](https://github.com/Azure-Samples/cognitive-services-onnx-customvision-sample)
- [Onnx on GitHub](https://github.com/onnx/onnx)

## 参考情報

##### ■ 再学習やエクスポートのタイミングによって、ONNX ファイル内の入力および出力のフォーマットが変更されることはあるか？

いいえ。Custom Vision の同一プロジェクト・同一ドメインで、画像やタグ付けだけを変更して再学習を行っても、入力や出力のデータサイズやノード名は固定で変わりません。また、これらの形式はエクスポートのタイミングで変更されることもないため、アプリケーションで参照するモデル ファイルの置き換えを行っても、再学習前に利用していた推論コードの変更は変更無く、そのまま実行が可能です。

***
`変更履歴`  
`2022/02/21 created by kazuyaonuki`  

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。
