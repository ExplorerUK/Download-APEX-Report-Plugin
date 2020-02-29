explorerDLAR = (function () {
    "use strict";

    var debugPrefix = "Explorer DLAR Plugin: ";

    // https://stackoverflow.com/a/7178381
    function findWithAttr(array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }

    function render(options) {
        apex.debug.info(debugPrefix + "Render");
        apex.debug.info(debugPrefix, options);
        // Fetch Parameters
        var regionId = options.da.action.affectedRegionId;
        var downloadFormat = options.da.action.attribute01;
        var SuppressMessage = options.da.action.attribute02;
        var SuppressMessage = options.da.action.attribute02;
        var warnOnUnsavedChanges = options.page.warnOnUnsavedChanges;
        var regionIDX = findWithAttr(options.reportRegions, "AFFECTEDID", regionId);

        if (regionIDX > -1) {
            var regionObj = options.reportRegions[regionIDX];
            if (regionObj.REGIONTYPE == "NATIVE_SQL_REPORT") {
                // Classic Report 
                invokeDownloadCR(regionObj.REGIONID, warnOnUnsavedChanges);
            } else if (regionObj.REGIONTYPE == "NATIVE_IG") {
                // Invoke Download IG
                invokeDownloadIG(regionId, downloadFormat, SuppressMessage, warnOnUnsavedChanges);
            } else if (regionObj.REGIONTYPE == "NATIVE_IR") {
                // Invoke Download IR
                invokeDownloadIR(regionId, downloadFormat, warnOnUnsavedChanges);
            }
        } else {
            apex.debug.error(debugPrefix, "Could not detect report region type");
        }
    }

    function invokeDownloadIR(pRegionId, pDownloadFormat, pWarnOnUnsavedChanges) {
        // Debug
        apex.debug.info(debugPrefix + "invokeDownloadIR");
        apex.debug.info(debugPrefix, "pRegionId: " + pRegionId);
        apex.debug.info(debugPrefix, "pDownloadFormat: " + pDownloadFormat);
        apex.debug.info(debugPrefix, "pWarnOnUnsavedChanges: " + pWarnOnUnsavedChanges);

        // Prepare URL
        pDownloadFormat = pDownloadFormat.replace('HTML', 'HTMLD');
        var lUrl = 'f?p=' + pFlowId.value + ':' + pFlowStepId.value + ':' + pInstance.value + ':IR[' + pRegionId + ']_' + pDownloadFormat;

        apex.page.cancelWarnOnUnsavedChanges();
        apex.navigation.redirect(lUrl);
        if (pWarnOnUnsavedChanges) {
            // Reactivate if set at page level
            apex.page.warnOnUnsavedChanges();
        }
    }

    function invokeDownloadCR(pRegionId, pWarnOnUnsavedChanges) {
        // Debug
        apex.debug.info(debugPrefix + "invokeDownloadCR");
        apex.debug.info(debugPrefix, "pRegionId: " + pRegionId);
        apex.debug.info(debugPrefix, "pWarnOnUnsavedChanges: " + pWarnOnUnsavedChanges);
        // Thanks Hilary https://community.oracle.com/message/15393716#15393716
        var lUrl = 'f?p=' + pFlowId.value + ':' + pFlowStepId.value + ':' + pInstance.value + ':FLOW_EXCEL_OUTPUT_R' + pRegionId + '_en';

        apex.page.cancelWarnOnUnsavedChanges();
        apex.navigation.redirect(lUrl);
        if (pWarnOnUnsavedChanges) {
            // Reactivate if set at page level
            apex.page.warnOnUnsavedChanges();
        }
    }

    function invokeDownloadIG(pRegionId, pDownloadFormat, pSuppressMessage, pWarnOnUnsavedChanges) {
        // Debug
        apex.debug.info(debugPrefix + "invokeDownloadIG");
        apex.debug.info(debugPrefix, "pRegionId: " + pRegionId);
        apex.debug.info(debugPrefix, "pDownloadFormat: " + pDownloadFormat);
        apex.debug.info(debugPrefix, "pSuppressMessage: " + pSuppressMessage);
        apex.debug.info(debugPrefix, "pWarnOnUnsavedChanges: " + pWarnOnUnsavedChanges);

        // Check this is an IG
        if ($("#" + pRegionId + " .a-IG").length == 0) {
            apex.debug.info(debugPrefix + "Error: Region " + pRegionId + " is not an Interactive Grid");
            return;
        }

        var currentView = apex.region(pRegionId).call("getCurrentView"),
            currentReportId = currentView.model.getOption("regionData").reportId;
        // model = currentView.model;  

        // Check if Grid View
        if (currentView.internalIdentifier != 'grid') {
            apex.debug.info(debugPrefix + "Error: Only the Current Grid View can be downloaded");
            return;
        }

        var lData,
            lConfig = apex.region(pRegionId).call("option", "config");

        function getIGMessage(key) {
            return apex.lang.getMessage("APEX.IG." + key);
        }

        lData = {
            pageItems: "",
            regions: [
                {
                    id: lConfig.regionId,
                    ajaxIdentifier: lConfig.ajaxIdentifier,
                    ajaxColumns: lConfig.ajaxColumns,
                    reportId: currentReportId,
                    view: currentView.internalIdentifier,
                    download: JSON.parse('{"format": "' + pDownloadFormat + '"}')
                }
            ],
            salt: $v("pSalt")
        };

        apex.server.plugin(lData, {
            success: function (pData) {
                var lUrl;
                if (pSuppressMessage != 'Y') {
                    apex.message.showPageSuccess(getIGMessage("FILE_PREPARED"));
                }

                lUrl = apex.server.ajaxUrl(
                    {
                        regions: [
                            {
                                id: lConfig.regionId,
                                ajaxIdentifier: lConfig.ajaxIdentifier,
                                downloadFileId: pData.regions[0].download.id
                            }
                        ],
                        salt: $v("pSalt")
                    });

                apex.debug.info(debugPrefix + "Calling URL to get file:", lUrl);
                apex.debug.info(debugPrefix + "URL length:", lUrl.length);

                apex.page.cancelWarnOnUnsavedChanges();
                apex.navigation.redirect(lUrl);
                if (pWarnOnUnsavedChanges) {
                    // Reactivate if set at page level
                    apex.page.warnOnUnsavedChanges();
                }

            }
        });
    }

    // Public functions
    return ({
        render: render,
        invokeDownloadCR: invokeDownloadCR,
        invokeDownloadIG: invokeDownloadIG,
        invokeDownloadIR: invokeDownloadIR
    });

}());