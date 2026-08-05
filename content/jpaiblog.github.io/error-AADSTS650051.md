---
title: ポータルにサインインできない事象について (AADSTS650051)
date: 2020-03-07 00:00:00
categories:
- Cognitive Services
tags:
- AADSTS650051
---
エラー コード AADSTS650051 を含むメッセージが出力し、製品ポータル (www.luis.ai や www.customvision.ai など) へのサインインが失敗する場合の対処方法を紹介します。
<!-- more -->
<br>

***
下記エラーメッセージは (ドメイン名) の DNS 名に紐づく Azure AD のテナントが、管理者不在のバイラル (非管理) テナントと呼ばれる状態 (unmanaged state) であり、それが原因でポータルへサインインできないことを意味します。  

> ErrorDescription': 'AADSTS650051: Using application '<ポータル FQDN>' is currently not supported for your organization <ドメイン名> because it is in an unmanaged state. An administrator needs to claim ownership of the company by DNS validation of <ドメイン名> before the application <ポータル FQDN> can be provisioned.`

類似のサービスに関する記事とはなりますが、詳細と対処方法は以下をご参照ください。  

- [非管理テナントのアカウントで Custom Vision Service のポータルにサインインできない場合の対処方法](https://docs.microsoft.com/ja-jp/archive/blogs/jpcognitiveblog/cannot-signin-custom-vision-service-portal)

この問題は、当該テナントに紐づく (ドメイン名) のドメインの所有確認を行うことで解消されるため、以下のドキュメントの “3. 「管理者になる」メニューを実行します。” まで実施ください。  

- [セルフサービス サインアップで登録されたドメインの対処方法](https://docs.microsoft.com/ja-jp/archive/blogs/exchangeteamjp/domain-registered-by-self-service-sign-up)

なお、この問題を解消するだけであれば、手順 4 以降の作業は必要ありませんが、手順 3 を実施する段階で DNS の設定変更が必要となります。Azure AD テナントやドメインの管理者にて確認ください。  
<br>

関連する公開情報:
- [Azure リソースにログインしようとすると “AADSTS65005” エラーを受け取ります](https://docs.microsoft.com/ja-jp/azure/active-directory/b2b/troubleshoot#you-receive-an-aadsts65005-error-when-you-try-to-log-in-to-an-azure-resource)
- [Azure Active Directory の非管理対象ディレクトリを管理者として引き継ぐ](https://docs.microsoft.com/ja-jp/azure/active-directory/users-groups-roles/domains-admin-takeover)
***
`変更履歴`  
`2020/03/07 created by Mochizuki`  