explorerIGDLGV = (function () {
    "use strict";

    var debugPrefix =  "Explorer IGDLGV Plugin: ";

    function render(options) {
        apex.debug.info(debugPrefix + "Render");
        apex.debug.info(debugPrefix, options);
        // Fetch Parameters
        var regionId = options.da.action.affectedRegionId;
        var downloadFormat = options.da.action.attribute01;
        var SuppressMessage = options.da.action.attribute02;
        // Invoke Download
        invokeDownload(regionId, downloadFormat, SuppressMessage);
    }

    function invokeDownload(pRegionId, pDownloadFormat, pSuppressMessage ) {
        // Debug
        apex.debug.info(debugPrefix + "invokeDownload");
        apex.debug.info(debugPrefix, "pRegionId: " + pRegionId);
        apex.debug.info(debugPrefix, "pDownloadFormat: " + pDownloadFormat);
        apex.debug.info(debugPrefix, "pSuppressMessage: " + pSuppressMessage);

        // Check this is an IG
        if ($("#" + pRegionId + " .a-IG").length == 0) {
            apex.debug.info(debugPrefix + "Error: Region " + pRegionId + " is not an Interactive Grid");
            return;
        }

        var currentView = apex.region(pRegionId).call("getCurrentView"),
            currentReportId = currentView.model.getOption("regionData").reportId;
            // model = currentView.model;  

        // Check if Grid View
        if ( currentView.internalIdentifier != 'grid') {
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
                
            }
        });
    }

    // Public functions
    return ({
        render: render,
        invokeDownload: invokeDownload
    });

}());