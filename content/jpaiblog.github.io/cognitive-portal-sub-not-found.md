---
title: Azure の関連ポータル サイトで一部の Azure サブスクリプションやリソースが表示されない事象の原因と対処策
date: 2020-05-14 00:00:00
categories:
- Cognitive Services
tags:
- QnA Maker
- LUIS
- Custom Vision
- Speech Services
---
Azure の関連ポータル サイトで Azure サブスクリプションやリソースが表示されない原因と対処策について解説します。
<!-- more -->
<br>

***
Azure で提供されているサービスの一部は、Azure ポータル以外に独自のポータル サイトを提供しています。
より具体的に Cognitive Services を例に挙げると以下のようなポータル サイトが存在します。

- QnA Maker: [https://www.qnamaker.ai/](https://www.qnamaker.ai/)
- Custom Vision: [https://www.customvision.ai/](https://www.customvision.ai/)
- Speech Services: [https://speech.microsoft.com/](https://speech.microsoft.com/)
- LUIS: [https://www.luis.ai/](https://www.luis.ai/)

これらのポータル サイトは Azure と連携しており、サインインしたユーザーの Azure サブスクリプションやリソースを、ポータル内で表示・操作することができます。

しかしながら、例えば、以下のように複数の Azure AD ディレクトリ (contoso.onmicrosoft.com と fabrikam.onmicrosoft.com) に関連付けられているユーザー アカウント (user\@contoso.onmicrosoft.com) があるとします。この場合、ロールベースのアクセス制御 (RBAC) の設定が適切でも、上記のポータル サイトでサブスクリプションやリソースが表示されないことがあります。

![Cognitive Portal Sign-in](https://jpaiblog.github.io/images/cognitive-portal-sub-not-found/cognitive-portal-AAD-tenant.png)

### ■原因
これらのポータルサイトへ Azure AD の組織アカウントでアカウントサインインする場合、特定の Azure AD ディレクトリに依存しない common エンドポイント (login.microsoftonline.com/**common**/…) が使用されます。この時、サインイン先となるのは、ホーム ディレクトリ  (上記の図では ディレクトリ A の contoso.onmicrosoft.com) となります。通常はこの挙動で問題になることはありません。

しかし、別のディレクトリにゲスト ユーザーとして招待されることで、複数のディレクトリと関連付けられている場合、ホーム ディレクトリ以外のディレクトリ (上記の図では Bの fabrikam.onmicrosoft.com) に対するサインインは行われないため、そのディレクトリに対するアクセス トークンは取得されません。それにより、ポータルサイト上ではディレクトリ B に紐づいたサブスクリプションやリソースが表示されない事象が発生します。これは Azure AD ディレクトリへのサインインを伴うアクセス権の管理上想定される動作です。

### ■対処策
ディレクトリ B に関連付けられた Azure サブスクリプションに対するアクセス トークンを取得するには、ディレクトリ B へのサインインを明示的に完了する必要があります。

#### 方法 1. ポータル サイト内でディレクトリを変更する
ポータル サイトによっては、サイト内でディレクトリを切り替える機能が用意されています。この機能を利用してディレクトリ B に切り替えます。

例. [Custom Vision ポータル](https://www.customvision.ai/):

![Custom Vision portal dir switch](https://jpaiblog.github.io/images/cognitive-portal-sub-not-found/custom-vision-dir-switch.png)

これはディレクトリ (テナント) 固有のサインイン エンドポイント (login.microsoftonline.com/**<テナント ID またはテナント名>/**…) を使用してサインインすることで実現されています。

ご参考: [Azure AD のサインイン エンドポイント](https://docs.microsoft.com/ja-jp/azure/active-directory/develop/active-directory-v2-protocols#endpoints)

#### 方法 2. Azure ポータルでディレクトリを変更する
ポータル サイト内でディレクリを切り替える機能が用意されていない場合は、Azure ポータル ([https://portal.azure.com](https://portal.azure.com)) を使ってディレクトリの切り替えを行います。そして、各サービスのポータルサイト ([QnA Maker](https://www.qnamaker.ai/) など) にアクセスします。

特にディレクトリ B で多要素認証 (MFA) が強制されているなどサインイン方法に制約がある場合は、こちらの方法をお試しください。

Azure ポータルでのディレクトリの切り替え方法は次の手順のようになります。

1. Azure ポータルの画面右上のユーザーアイコンから「ディレクトリの切り替え」を選択します

    ![Azure portal dir switch 1](https://jpaiblog.github.io/images/cognitive-portal-sub-not-found/azure-portal-dir-switch-1.png)

2. Azure サブスクリプションが存在するディレクトリを選択してサインインを完了します

    ![Azure portal dir switch 2](https://jpaiblog.github.io/images/cognitive-portal-sub-not-found/azure-portal-dir-switch-2.png)
 
3. Web ブラウザーの別のタブで対象のポータル サイト (例. [QnA Maker](https://www.qnamaker.ai/)) を開きます

もし上記の手順でもポータル サイトで Azure サブスクリプションやリソースが表示されない場合、既定のディレクトリを Azure サブスクリプションが紐づいたディレクトリに変更してから、そのディレクトリに切り替えることで解消するかご確認ください。

### ■ 補足
ポータル サイト内でディレクトリを切り替える機能が用意されておらず、ホーム ディレクトリでサインインした場合でも、ゲスト ユーザーとして招待されているディレクトリ B に関連付けられた Azure サブスクリプションやリソースがポータル サイト上で表示されることがあります。

これは他のサイト、例えば Azure ポータルでディレクトリ B にサインインしていた場合、ブラウザーにディレクトリ B の認証情報がキャッシュされ、ディレクトリ B に関連付けられた Azure サブスクリプションに対するアクセス トークンを取得できるためです。

ディレクトリ B で多要素認証 (MFA) が強制されているなど、サインイン方法に制約がある場合は、キャッシュされたサインイン情報が有効でないため、方法 2 のように Azure ポータルで MFA などの認証を完了する必要があります。  

***
`変更履歴`  
`2020/05/14 created by Chao`  
`2020/05/14 modified by Nakagami`  