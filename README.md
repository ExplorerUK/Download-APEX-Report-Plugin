# IG-Download-Interactive-Grid-View

IG Download Interactive Grid View APEX Plugin

<img src="https://raw.githubusercontent.com/ExplorerUK/IG-Download-Grid-View-Plugin/master/preview.gif" width="700px">

## Demo
https://apex.oracle.com/pls/apex/f?p=9991

## Release History
19.2 Initial Version

## How to install
Download this repository and import the plug-in into your application from this location:

`src/dynamic_action_plugin_com_uk_explorer_igdlgv.sql`

It is strongly advised to put the JavaScript on your web server for better performance.

## Features
* This plugin is an implementation the built-in IG file downloader which is'nt publicly exposed
* Smooths-out the new-browser tab glitch which exists within the built-in IG downloader and improves on the IR method
* Downloaded reports honours the users filters
* Option to suppress the translatable success message
* CSV & HTML supported
* Supports all report types (Primary, Alternative, Public & Prviate) for the Grid View only (i.e not Chart, Icon or Detail)

## How to use
Select Interactive Grid - Download Grid View Plug-In as the TRUE action
Set affected elements to a Interactive Grid Region

You can also load the explorerIGDLGV.min.js file directly and then use the following to download direclty from JavaScript

<pre>explorerIGDLGV.invokeDownload('emp', 'CSV');</pre>

## Settings
You can find a detailed explanation in the help section of the plugin.

## Issues
Warn on unsaved changes is disbaled following a download. No clear way of detecting in JS if it was ever enabled.

## Future developments
* Please let me know any of your wishes

