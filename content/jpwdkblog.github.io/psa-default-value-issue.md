---
title: Print Support App (PSA) にて用紙の設定が既定の値にならない
date: 2024-08-23 00:00:00
categories:
- printscan
tags:
- printer
---
この記事では Print Support App で発生する問題について説明します。
<!-- more -->
<br>

***
### 概要
PSA の `PrintSupportExtensionSession.PrintDeviceCapabilitiesChanged` イベント ハンドラーで PrintDeviceCapabilities に追加の PageMediaType オプションを追加すると、既定のオプションが選ばれない現象が発生します。

***
### 現象
例えば `PageMediaType` Feature で `ContosoMediaType` というのを追加し、次のような PrintTicket を構成した場合 `default="true"` が指定されている `AutoSelect` がオプションとして既定の設定となることが期待されます。

```
<!-- media-type-supported -->
<psk:PageMediaType psf2:psftype="Feature">
    <psk:AutoSelect psf2:psftype="Option" psf2:default="true"/>
    <psk:PhotographicGlossy psf2:psftype="Option" psf2:default="false"/>
    <psk:Photographic psf2:psftype="Option" psf2:default="false"/>
    <contoso:ContosoMediaType psf2:psftype="Option" psf2:default="false"/>
</psk:PageMediaType>
```

しかし、実際には別のオプションが既定の PrintTicket として構成される現象が発生します。本現象は PSA の印刷設定画面の最初の表示時に発生し、一度、設定が保存されると問題は発生いたしません。

***
### 回避方法

本現象を回避するためには、PSA の `PrintSupportExtensionSession.PrintDeviceCapabilitiesChanged` イベント ハンドラーにて、既定のオプションとなるオプションを PSA 自身で保存し、ユーザー既定の PrintTicket を印刷設定ダイアログを表示するタイミングで、保存した値をリストアすることで回避可能出来ます。

１．まず、PSA の BackgroundTask の `LocalStorageUtil` クラスに次のようなコードを追加します。
```C#
    // 既に既定のオプションを PrintTicket へ設定したかどうかを確認するためのメソッド
    public static bool IsAlreadyLoadedDefaultValue()
    {
        try
        {
            return (bool)ApplicationData.Current.LocalSettings.Values["IsLoadedDefaultValue"];
        }
        catch (NullReferenceException e)
        {
            return false;
        }
    }

    // 既定のオプションを PrintTicket へ適用したことを示すためのメソッド
    public static void LoadedDefaultValue(bool _bLoaded)
    {
        ApplicationData.Current.LocalSettings.Values["IsLoadedDefaultValue"] = _bLoaded;
    }

    // 指定 Feature のデフォルト オプションの値を保存します
    public static void SetPdcDefaultValue(string _Feature, string _DefaultValue)
    {
        System.Diagnostics.Debug.WriteLine("SetPdcDefaultValue: Feature=" + _Feature + ", Default=" + _DefaultValue);
        ApplicationData.Current.LocalSettings.Values[_Feature] = _DefaultValue;
    }

    // 指定 Feature のデフォルト オプションの値を返します
    public static string GetPdcDefaultValue(string _Feature)
    {
        try
        {
            return (string)ApplicationData.Current.LocalSettings.Values[_Feature];
        }
        catch (NullReferenceException e)
        {
            System.Diagnostics.Debug.WriteLine(e.Message);
            return null;
        }
    }
```  
  
    
２．`PrintSupportExtensionSession.PrintDeviceCapabilitiesChanged` イベント ハンドラーに、手順１で追加した `SaveDefaultValues()` を呼び出して、Print Device Capabilities に設定されている既定値を保存します。
```C#
    private void OnSessionPrintDeviceCapabilitiesChanged(PrintSupportExtensionSession sender, PrintSupportPrintDeviceCapabilitiesChangedEventArgs args)
    {
        var pdc = args.GetCurrentPrintDeviceCapabilities();

        // Add the custom namesapce uri to the XML document.
        pdc.DocumentElement.SetAttribute("xmlns:contoso", "http://schemas.contoso.com/keywords");
        // Add the custom media type.
        AddCustomMediaType(ref pdc, "http://schemas.contoso.com/keywords", "contoso:ContosoMediaType");

        // PDC のデフォルト値を保存するメソッドを呼び出します
        SaveDefaultValues(ref pdc);

        args.UpdatePrintDeviceCapabilities(pdc);
        args.SetPrintDeviceCapabilitiesUpdatePolicy(
            PrintSupportPrintDeviceCapabilitiesUpdatePolicy.CreatePeriodicRefresh(System.TimeSpan.FromMinutes(1)));
        args.GetDeferral().Complete();
    }
```


３．手順１と２で `LocalStorageUtil` に保存したオプションの既定値をコンボボックスの初期化処理などで利用し、コンボボックス アイテムの初期に設定します。
```C#
    private ComboBox CreatePrintTicketFeatureComboBox(PrintTicketFeature feature, bool useDefaultEventHandler = true)
    {
        if (feature == null)
        {
            return null;
        }

        var comboBox = new ComboBox
        {
            // Header is displayed in the UI, ontop of the ComboBox.
            Header = feature.DisplayName
        };
        // Construct a new List since IReadOnlyList does not support the 'IndexOf' method.
        var options = new ObservableCollection<PrintTicketOption>(feature.Options);
        // Provide the combo box with a list of options to select from.
        comboBox.ItemsSource = options;
        // Set the selected option to the option set in the print ticket.
        PrintTicketOption selectedOption;


        // PDC の既定値を LocalStorageUtil から1回だけ読み込む
        string defaultOption = LocalStorageUtil.GetPdcDefaultValue(feature.Name);
        if (!LocalStorageUtil.IsAlreadyLoadedDefaultValue() &&
            defaultOption != null)
        {
            selectedOption = options[0];
            foreach (var option in options)
            {
                if (option.Name == defaultOption)
                {
                    // デフォルト値
                    selectedOption = option;
                    break;
                }
            }
        }
        else
        {
            var featureOption = feature.GetSelectedOption();
            try
            {
                selectedOption = options.Single((option) => (
                    option.Name == featureOption.Name && option.XmlNamespace == featureOption.XmlNamespace));
            }
            // Catch exceptions, because there can be multiple features with the "None" feature name.
            // We need to handle those features seperately.
            catch (System.SystemException exception)
            {
                var nameAttribute = featureOption.XmlNode.Attributes.GetNamedItem("name");
                var attribute = featureOption.XmlNode.OwnerDocument.CreateAttribute("name");

                selectedOption = options.Single((option) => (
                    option.DisplayName == featureOption.DisplayName && option.Name == featureOption.Name && option.XmlNamespace == featureOption.XmlNamespace));

            }
        }

        comboBox.SelectedIndex = options.IndexOf(selectedOption);

        // LocalStorageUtil からの読み込みが完了したことをセットします
        LocalStorageUtil.LoadedDefaultValue(true);
```



***
### 関連ドキュメント

[PrintSupportExtensionSession.PrintDeviceCapabilitiesChanged イベント](https://learn.microsoft.com/ja-jp/uwp/api/windows.graphics.printing.printsupport.printsupportextensionsession.printdevicecapabilitieschanged?view=winrt-26100)


  
`変更履歴`  
`2024/08/07 created by riwaida`  
`2024/08/24 modified by riwaida : 回避方法の追加`  
`2025/07/10 modified by riwaida : 変更履歴の記載`  
