---
title: Bing Search API 関するお問い合わせについて
date: 2021-04-30 16:00:00
categories:
- Cognitive Services
- Bing Search API
tags:
- Bing Search API
---
Bing Search API に関するお問い合わせを起票いただく際にご留意いただきたい点をご案内します。
<!-- more -->
<br>

***
## (1) Bing Search API の具体的な動作に関するご質問について
Bing Search API の具体的な動作、例えば特定のパラメーターを設定するとエラーが発生する、あるクエリのみレスポンスが非常に遅い、といった内容について調査を行うには、個々の API リクエストを一意に識別可能な **BingAPIs-TraceId** が必要となります。これは API のレスポンス ヘッダーに含まれています。

- [Web Search API v7 headers](https://docs.microsoft.com/en-us/bing/search-apis/bing-web-search/reference/headers)

また、事象を再現可能な curl のコマンド例を併せて提供いただけるとよりスムーズに調査を行うことができます。例えば以下のように -v オプションを指定することで BingAPIs-TraceId を確認することもできます。

curl -v --header "Ocp-Apim-Subscription-Key: Key" "https://api.bing.microsoft.com/v7.0/custom/search?q=Test&customconfig=ID&setLang=ja&textDecorations=true&count=10&offset=10&textFormat=HTML" 

- [curl command reference](https://curl.se/docs/manpage.html) (※弊社外のサイトとなります)

その他 Bing Search API で利用可能なパラメーターやレスポンスの形式については以下のリファレンスをご参照ください。

- [Web Search API v7 reference](https://docs.microsoft.com/en-us/bing/search-apis/bing-web-search/reference/endpoints)

なお、BingAPIs-TraceId は有効期限が非常に短いため、発生から時間が経過すると調査が困難になる場合があります。

## (2) Bing Search API で取得した情報の利用について
Bing Search API は Cognitive Services とは異なる利用条件が設定されています。

- [Bing Search API use and display requirements](https://docs.microsoft.com/en-us/bing/search-apis/bing-web-search/use-display-requirements)

特に多くお問い合わせいただく内容として、Bing Search API の検索結果を機械学習もしくはそれに類する処理で使用することは禁止されています。また特定のシナリオついて、技術サポート窓口で利用の可否を回答することはできませんので、必要に応じて法務部門や顧問弁護士等の専門家にご相談いただき、利用者の責任においてご判断ください。

- [Microsoft Azure の法的情報](https://azure.microsoft.com/ja-jp/support/legal/)

## (3) Bing Search API で検索対象になる情報について
Bing Search API は[一般向けの Bing](http://www.bing.com/) と同じ検索インデックスを使用しているため、インデックスに含まれていない Web ページやコンテンツは検索の対象となりません。すなわち、通常の Bing で検索できない情報は Bing Search API の検索結果にも含まれません。これは Bing Custom Search についても同様です。ご自身が管理しているコンテンツを Bing のインデックスに追加するための具体的な手法 (いわゆる検索エンジン対策, SEO) については Azure サポート プランの対象外となるため、Bing Webmaster へお問い合わせください。

Bing Webmaster について:
- [Bing Webmaster Tools](https://www.bing.com/webmasters/about)
- [Bing Webmaster Support](https://www.bing.com/webmasters/help/webmaster-support-24ab5ebf)

Bing Custom Search について:
- [Configure your Bing Custom Search instance](https://docs.microsoft.com/en-us/bing/search-apis/bing-custom-search/how-to/define-your-custom-view)

***
`変更履歴`  
`2021/04/30 created by Nakagami`  

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  