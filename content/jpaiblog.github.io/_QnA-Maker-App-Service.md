---
title: QnA Maker に関連する App Service プランの価格レベルについて
date: 2020-10-20 12:00:00
categories:
- QnA Maker
tags:
- QnA Maker
---

QnA Maker に関連する App Servcie プランの価格レベルを Free に調整する方法をご紹介します。
<!-- more -->
<br>

***

# App Service プランの価格レベルを調整する方法について
QnA Maker の利用を検討される段階で、無料での利用が望ましいが、Free 価格レベルの QnA Maker を作成しようとしたら、関連のリソース App Service プランの価格レベルの既定値は、Standard (S1) となっています。<br>
これは、多くの一般的なシナリオで問題なく QnA Maker を利用できるコンピューティング リソースを確保するためです。

もし課金を抑えたい場合は、QnA Maker の作成後、すぐに関連のリソース App Service プランの価格レベルを Free に変更すればいいです。

以下の図のように、App Service プラン リソースの画面で、スケール アップ (App Service のプラン) ⇒ 開発/テスト ⇒ F1  ⇒ 適用 の順に実施すると、App Service プランの価格レベルを Free に変更できます。<br>
![app-service-plan-scale-down](https://jpaiblog.github.io/images/QnA-Maker-App-Service/app-service-plan-scale-down.png)

Free 価格レベルに変更する前に、Standard 価格レベルの App Service プランに対する課金が秒単位で続けられます（約 ¥13.216/時間）。
各価格レベルの課金情報とそのコンピューティング リソースのスペックについては、下記リンクから確認できます。<br>
- [App Service の価格](https://azure.microsoft.com/ja-jp/pricing/details/app-service/windows/)

なお、App Service プランの価格レベルを Free に変更した場合はリソースの制約（クォータ）により正常に動作しない場合があるので、何らか問題が発生した際は必要に応じて適切な価格レベルへの変更をご検討ください。

# QnA Maker を作成する段階で Free 価格レベルの App Service プランを作成する方法について
ここで、補足として、QnA Maker を作成する段階で、ARM テンプレートを用いて Free 価格レベルの App Service プランの作成方法を紹介します。<br>

1. QnA Makerの作成画面で基本情報を入力します。<br>
QnA Maker と Azure Search の価格レベルにそれぞれ Freeを指定した上、他の情報の入力後に、「確認および作成」をクリックします。<br>
![step01](https://jpaiblog.github.io/images/QnA-Maker-App-Service/step01.png)

2. 「Automation オプション」をクリックします。<br>
注：この画面で「作成」をクリックしないでください。<br>
![step02](https://jpaiblog.github.io/images/QnA-Maker-App-Service/step02.png)

3. 「ダウンロード」をクリックします。<br>
ダウンロードした zip ファイルを解凍します。 <br>
![step03](https://jpaiblog.github.io/images/QnA-Maker-App-Service/step03.png)

4. 「カスタム テンプレートのデプロイ」を検索します。<br>
Azure ポータルの検索バーに「カスタム テンプレートのデプロイ」を入力し、下に表示される「カスタム テンプレートのデプロイ」をクリックします。<br>
![step04](https://jpaiblog.github.io/images/QnA-Maker-App-Service/step04.png)

5. 「エディターで独自のテンプレートを作成する」をクリックします。<br>
![step05](https://jpaiblog.github.io/images/QnA-Maker-App-Service/step05.png)

6. テンプレートファイルを読み込みます。<br>
「ファイルの読み込み」をクリックして、ステップ 3 でダウンロードした template.json ファイルを選択します。<br>
![step06](https://jpaiblog.github.io/images/QnA-Maker-App-Service/step06.png)

7. テンプレートを編集して保存します。<br>
以下のように、”type:” “Microsoft.Web/serverfarms” の項目で “sku” の ”Standard” と “S1” をそれぞれ “Free” と “F1” に変更してファイルを保存します。<br>
なお、アップロード前の JSON ファイルで編集いただいても構いません。<br>
![step07](https://jpaiblog.github.io/images/QnA-Maker-App-Service/step07.png)

8. 「パラメーターの編集」をクリックします。<br>
注：Web ブラウザーによってはボタンの名前が全て表示されない場合がございますので、マウスカーソルをボタン上に置いて表示されるツールチップでご確認ください。<br>
![step08](https://jpaiblog.github.io/images/QnA-Maker-App-Service/step08.png)

9. パラメーターファイルを読み込みます。<br>
「ファイルの読み込み」をクリックし、ステップ 3 でダウンロードした parameters.json ファイルを選択します。<br>
![step09](https://jpaiblog.github.io/images/QnA-Maker-App-Service/step09.png)

10. パラメーターを保存します。<br>
![step10](https://jpaiblog.github.io/images/QnA-Maker-App-Service/step10.png)

11. テンプレートファイルをデプロイします。<br>
デプロイ先のリソースグループを選択した上、使用条件を確認して同意いただけましたら「購入」をクリックします。<br>
![step11](https://jpaiblog.github.io/images/QnA-Maker-App-Service/step11.png)

ARM テンプレートを利用して、Free の価格レベルの App Service プランを含む QnA Maker を作成する手順は以上となります。

***
`変更履歴`  
`2020/10/20 created by Chao`  