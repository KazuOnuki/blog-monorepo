---
title: 自動機械学習 (AutoML) の分類タスクのディープ ラーニング有効化について
date: 2020-12-24 12:00:00
categories:
- Azure Machine Learning
tags:
- Automated Machine Learning
---
Azure Machine Learning Studio から自動機械学習を実行する際、"ディープ ラーニングの有効化" のチェックを入れた場合の動作について紹介いたします。
<!-- more -->
<br>

***
Azure Machine Learning Studio (https://ml.azure.com/) では、UI ベースで自動機械学習を実行することが出来ます。詳細な手順は以下の公開情報を参照ください。  

- [Azure Machine Learning を使用して自動機械学習モデルを作成、確認、デプロイする](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-use-automated-ml-for-ml-models)

選択できるタスクは、分類、回帰、時系列の 3 つがあります。この時、分類タスクの "ディープ ラーニングの有効化" にチェックを入れることで、**テキスト データの特徴付け** に有効な BERT または BiLSTM を適用することが可能です。  

![enable-deep-learning-for-classification.png](https://jpmlblog.github.io/images/AML-deep-learning-for-automl/enable-deep-learning-for-classification.png)

BERT を適用する場合、コンピューティング クラスターに GPU コンピューティング (例: VM サイズ "STANDARD_NC6"、またはそれ以上の GPU) を使用する必要があります。CPU コンピューティングを使用した場合には、BiLSTM DNN 特徴抽出器が有効になります。詳細は以下の公開情報をご確認ください。  

- [BERT 統合](https://docs.microsoft.com/ja-jp/azure/machine-learning/how-to-configure-auto-features#bert-integration)

その他、参考となる公開情報をお纏めします。  

- [How BERT is integrated into Azure automated machine learning](https://techcommunity.microsoft.com/t5/azure-ai/how-bert-is-integrated-into-azure-automated-machine-learning/ba-p/1194657)
- [AutoML SDK - pretrained_text_dnn_transformer Module](https://docs.microsoft.com/en-us/python/api/azureml-automl-runtime/azureml.automl.runtime.featurizer.transformer.text.pretrained_text_dnn_transformer?view=azure-ml-py)
- [AutoML SDK - bilstm_attention_transformer Module](https://docs.microsoft.com/en-us/python/api/azureml-automl-runtime/azureml.automl.runtime.featurizer.transformer.text.bilstm_attention_transformer?view=azure-ml-py)
- [GitHub - microsoft/AzureML-BERT](https://github.com/Microsoft/AzureML-BERT)
- [GitHub - google-research/bert](https://github.com/google-research/bert)
- [GitHub - huggingface/transformers](https://github.com/huggingface/transformers)


***
`変更履歴`  
`2020/12/24 created by Mochizuki`

※ 本記事は 「[jpmlblog について](https://jpmlblog.github.io/blog/2020/01/01/about-jpmlblog/)」 の留意事項に準じます。  
※ 併せて 「[ホームページ](https://jpmlblog.github.io/blog/)」 および 「[記事一覧](https://jpmlblog.github.io/blog/archives/)」 もご参照いただければ幸いです。  