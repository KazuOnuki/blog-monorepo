---
title: Azure MachineLeaning Studio の Notebooks メニューにおける「現時点ではこれにはアクセスできません」エラーへの対応方法
date: 2021-03-29 00:00:00
categories:
- Azure Machine Learning
tags:
- Notebook
- 権限
---
本記事では、Azure MachineLeaning Studio の Notebooks メニューで開いた Notebook で処理を実行した際に「現時点ではこれにはアクセスできません」とエラーメッセージが表示されてしまう場合の対応方法をご案内します。
<!-- more -->
<br>

***
# 対応方法
## Azure MachineLeaning Studio の Compute メニュー利用による回避
Azure MachineLeaning Studio（以下 AML Studio） の Notebooks メニュー使用時に、権限に関するエラーが表示される場合があります。  

<img src="https://jpmlblog.github.io/images/AML-cannot-use-notebook/error_message.jpg" width=400px border="1">  

原因は Azure Active Directory 側の設定に依存する可能性がありますが、コンピューティング メニュー のアプリケーション URI 配下のメニューから Notebook を開き直す対応で、問題が解消する場合があります。  

<img src="https://jpmlblog.github.io/images/AML-cannot-use-notebook/notebook1.jpg" width=800px border="1">  

<br>  

Notebooks メニューと コンピューティング メニューにおいてはそれぞれのバックエンドの認証方法が異なります。  
そのため、コンピューティング メニューから Notebook を実行した場合には、AML Studio への認証情報がコンピューティングインスタンスに連携されて権限エラーが生じない可能性があります。  

なお、AML Studio を通じて配置された Notebook などのファイルが存在する階層の実体は、AMLワークスペース既定のストレージアカウントです。　　

（コンピューティングインスタンス内部から参照した際のパス例： /mnt/batch/tasks/shared/LS_root/mounts/clusters/{コンピューティングインスタンス名}/code/Users/{ユーザー名}）　　

そのため、Notebooksメニューと コンピューティング メニューのどちらのメニューを通じた利用でも、ファイルの数や内容は同じです。  
もし、コンピューティング メニューの利用で問題が解消する場合には、こちらの回避策の利用のご検討をいただければ幸いです。  

もし、コンピューティング メニュー利用による問題の回避が行えない場合には、次項の「Azure Active Directory へのネームドロケーションの登録追加」対応をご検討ください。

## Azure Active Directory へのネームドロケーションの登録追加

「アクセスできません」というエラーの権限の問題の根本的な対応として、テナント（Azure Active Directory）管理者様により、該当するコンピューティング インスタンスのIPアドレスをネームドロケーションとして追加登録していただくことで、問題が解消される可能性があります。

[- クイック スタート:Azure Active Directory でネームド ロケーションを構成する](https://docs.microsoft.com/ja-jp/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)
>ネームド ロケーションを使うと、組織内の信頼できる IP アドレス範囲にラベルを付けることができます。Azure AD では、次のためにネームド ロケーションを使用します。  
　・リスク検出で誤判定を検出する。 信頼できる場所からサインインすることで、ユーザーのサインイン リスクが低下します。  
　・場所ベースの条件付きアクセスを構成する。  
このクイック スタートでは、環境内でネームド ロケーションを構成する方法について説明します。

追加登録対象となるコンピューティングインスタンスのIPアドレスは、AMLスタジオ の Compute メニューで確認可能です。  

<img src="https://jpmlblog.github.io/images/AML-cannot-use-notebook/notebook2.jpg" width=800px border="1">
  
<br>

***
# エラーメッセージが表示される原因
## 「条件付きアクセス」の設定
コンピューティングインスタンスが不詳なデバイスとして認識され、組織データである Azure ML ワークスペースへのアクセスが叶わないことが、エラーの原因となっている可能性があります。   
「条件付きアクセス」の設定については、弊社 Azure Active Directory サポートチームがブログ記事に詳細を記載しています。
 
[ - Japan Azure Identity Support Blog-「現時点ではこれにはアクセスできません」 エラーについて](https://jpazureid.github.io/blog/azure-active-directory/conditional-cannot-access-rightnow/)
 
 
これは Azure Machine Learning の設定ではなく、テナント（Azure Active Directory）管理者による設定です。  
そのため、まずはテナント管理者様に設定条件をご確認いただく必要があります。


***

`変更履歴`  
`2021/03/29 created by Uehara`

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  