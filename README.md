# Download APEX Report

Download APEX Report Plugin

<img src="https://raw.githubusercontent.com/ExplorerUK/Download-APEX-Report-Plugin/master/preview.gif" width="700px">

## Demo
https://apex.oracle.com/pls/apex/f?p=9991

## Release History
19.2.1 Initial Release

## How to install
Download this repository and import the plug-in into your application from this location:

`dynamic_action_plugin_com_uk_explorer_dlar.sql`

It is strongly advised to put the JavaScript on your web server for better performance.

## Features
* Downloads IG,IR & Classic Reports
* Smooths-out the new-browser tab glitch which exists within several of the built-in download methods
* Downloaded reports honours the users filters

### IG Specific
* This plugin is an implementation the built-in IG file downloader which is'nt publicly exposed
* CSV & HTML supported
* Option to suppress the translatable success message
* Supports all report types (Primary, Alternative, Public & Prviate) for the Grid View only (i.e not Chart, Icon or Detail)
* JS Function available e.g.
<pre>explorerDLAR.invokeDownloadIG('emp', 'CSV');</pre>

### IR Specific
* CSV, PDF & HTML supported
* Option to download "Other" formats to support BI Publisher Reports 
* Supports all report types (Primary, Alternative, Public & Prviate) for the Grid View only (i.e not Chart, Icon or Detail)
* JS Function available
<pre>explorerDLAR.invokeDownloadIR('emp', 'CSV');</pre>

### Classic Report Specific
* CSV Supported
* JS Function available e.g.
<pre>explorerDLAR.invokeDownloadCR("33339448878184184"); // Must be the region ID not the static ID</pre>

## How to use
* Select Download APEX Report Plug-In as the TRUE action
* Set affected elements to a Report Region

You can also load the explorerDLAR.min.js file directly and then use any of the JS examples above to download reports in JavaScipt 

## Settings
You can find a detailed explanation in the help section of the plugin.

## Issues


## Future developments
* Please let me know any of your wishes

