---
title: Speech to Text のコンテナーに関する FAQ
date: 2022-04-08 00:00:00
categories:
- Cognitive Services
tags:
- Speech
---
Speech to Text のコンテナーに関する FAQ をまとめました。

主にベースライン (標準) モデルのコンテナーに関する内容となります。カスタム モデルの場合は異なることがあります。
<!-- more -->
<br>

***
## コンテナーが起動しない、またはすぐに停止する
まずはオプションを除いた最小限のパラメーター構成で動作を確認します。

```
docker run --rm -it -p 5000:5000 --memory 4g --cpus 4 \
mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

- [docker run でコンテナーを実行する](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speech-service/speech-container-howto?tabs=stt%2Ccsharp%2Csimple-format#run-the-container-with-docker-run)

またコンテナーを実行しているマシンが動作要件を満たしているか確認します。CPU は最低 2 コア、メモリは 2 GB が必要となりますが、最新 (latest) のモデルでは以前よりもメモリ使用量が増大しているため、推奨構成 + α で確認することをお勧めします。

- [ホスト コンピューターの要件と推奨事項](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speech-service/speech-container-howto?tabs=stt%2Ccsharp%2Csimple-format#host-computer-requirements-and-recommendations)

- [Azure Cognitive Services container image tags and release notes](https://docs.microsoft.com/en-us/azure/cognitive-services/containers/container-image-tags?tabs=current#speech-to-text)

加えて、コンテナーの実行には CPU が AVX2 の命令をサポートしている必要があります。ホスト OS が Linux であれば以下のコマンドで AVX2 のサポート有無を確認できます。

```
grep -q avx2 /proc/cpuinfo && echo AVX2 supported || echo No AVX2 support detected
```

Speech to Text のコンテナーは Azure VM でも実行することができるため、オンプレミス環境で動作しない場合は切り分けとして Azure VM での動作確認を検討します。VM のサイズによって CPU は異なりますが、AVX2 をサポートしている CPU かどうかについては以下のリストからも確認できます。

- [Linux VM のコンピューティング ベンチマーク スコア](https://docs.microsoft.com/ja-jp/azure/virtual-machines/linux/compute-benchmark-scores )

※CPU の型番から AVX2 のサポート状況を確認するには各ベンダー (Intel, AMD など) の情報を参照します。

- 例. [Intel Product Specifications](https://ark.intel.com/content/www/us/en/ark.html#@Processors )※Intel 社のサイトとなります

## コンテナーは起動したが音声認識の結果が期待と異なる
Speech to Text のコンテナーは言語ごとにコンテナーのイメージが分かれています。latest のタグは英語 (en-us) の最新イメージです。その他の言語については下記のリストから該当する言語のイメージを取得・実行する必要があります。

- [Azure Cognitive Services container image tags and release notes](https://docs.microsoft.com/en-us/azure/cognitive-services/containers/container-image-tags?tabs=current#speech-to-text)

日本語 (ja-jp) の場合のコマンド実行例:
```
docker run --rm -it -p 5000:5000 --memory 4g --cpus 4 \
mcr.microsoft.com/azure-cognitive-services/speechservices/speech-to-text:3.0.0-amd64-ja-jp \
Eula=accept \
Billing={ENDPOINT_URI} \
ApiKey={API_KEY}
```

## ホスト OS のディレクトリを指定したログの出力に失敗する
Speech to Text のコンテナーではディレクトリをマウントすることでホスト OS 上にログを出力することができます。

- [Speech Service コンテナーを構成する - Logging の設定](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speech-service/speech-container-configuration?tabs=stt#logging-settings)
```
--mount type=bind,src=/home/azureuser/output,target=/output \
```

ここで指定されたホスト OS のディレクトリ (例. /home/azureuser/output) は Docker コンテナーから書き込みできるようにアクセス許可が設定されている必要があります。もし書き込みが許可されていない場合はコンテナーの実行は以下のようなエラーで停止します。

```
Creating directory '/app/speechtotext/xxx' failed with error 'Access to the path '/app/speechtotext/xxx' is denied.'. Please make sure that the path is writable.
```

※Docker のマウントやプロセスの実行権限の詳細については利用しているプラットフォーム (OS) によって異なります。

- 参考: [Docker docs - Use bind mounts](https://docs.docker.com/storage/bind-mounts/)※Docker のサイトとなります

## 起動後しばらく動作した後に停止する

コンテナーから課金 (Billing) エンドポイントへの接続に失敗している可能性があります。Speech to Text のコンテナーは利用量を定期的に Azure クラウドに報告する必要があり、一定時間接続に失敗すると動作を停止します。

- [課金エンドポイントへの接続について](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speech-service/speech-container-howto?tabs=stt%2Ccsharp%2Csimple-format#billing)

ホスト OS や Docker コンテナーのネットワーク構成として、課金エンドポイントに HTTPS (TCP ポート
 443) で通信が可能か確認します。例えばファイアウォールやプロキシが接続を拒否している可能性があります。
 
 - [Speech Service コンテナーのプロキシ設定](https://docs.microsoft.com/ja-jp/azure/cognitive-services/speech-service/speech-container-configuration?tabs=stt#http-proxy-credentials-settings)
 ```
 docker run --rm -it -p 5000:5000 \
--memory 2g --cpus 1 \
--mount type=bind,src=/home/azureuser/output,target=/output \
<registry-location>/<image-name> \
Eula=accept \
Billing=<endpoint> \
ApiKey=<api-key> \
HTTP_PROXY=<proxy-url> \
HTTP_PROXY_CREDS=<proxy-user>:<proxy-password> \
 ```

 また Docker は既定の DNS サーバーとして Google Public DNS (IP アドレス: 8.8.8.8) を使用するため、もしこの DNS サーバーへのアクセスが許可されない場合は別の DNS サーバーを指定する必要があります。

- 参考: [Docker 既定の DNS サーバーについて言及した GitHub 上の Issue](https://github.com/moby/moby/issues/23910)

※Linux では /etc/docker/daemon.json のファイルで既定の DNS サーバーを設定できます。

***
`変更履歴`  
`2022/04/08 created by Hiroki Nakagami`  

※ 本記事は 「[jpaiblog について](https://jpaiblog.github.io/blog/2020/01/01/about-jpaiblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpaiblog.github.io/blog/)」 および 「[記事一覧](https://jpaiblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  