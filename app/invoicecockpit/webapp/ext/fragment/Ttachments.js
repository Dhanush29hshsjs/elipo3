sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';

    var that = this;
    var extractedNumber;

    return {
        onAfterItemAdded: function (oEvent) {
            debugger;
            var item = oEvent.getParameter("item");
            var par_id = window.location.href;
            const regex = /uuid=([a-fA-F0-9-]+)/;
            const match = par_id.match(regex);
            if (match) {
                extractedNumber = match[1];
                console.log(extractedNumber); // Output: 1
            } else {
                console.log("Number not found in URL");
            }

            var _createEntity = async function (item) {
                var data = {
                    mediaType: item.getMediaType(),
                    fileName: item.getFileName(),
                    size: item.getFileObject().size,
                    fkey: extractedNumber,
                };

                var settings = {
                    url: "/odata/v4/catalog/Files",
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    data: JSON.stringify(data)
                };

                await new Promise((resolve, reject) => {
                    $.ajax(settings)
                        .done((results, textStatus, request) => {
                            debugger
                            resolve(results);
                        })
                        .fail((err) => {
                            reject(err);
                        });
                });
            };

            _createEntity(item)
                .then((id) => {
                    var url = `/odata/v4/catalog/Files(id=${id})/content`;
                    item.setUploadUrl(url);
                    var oUploadSet = this.byId("uploadSet");
                    oUploadSet.setHttpRequestMethod("POST");
                    oUploadSet.uploadItem(item);
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        onUploadCompleted: function (oEvent) {
            debugger
            var oUploadSet = this.byId("uploadSet");
            oUploadSet.removeAllIncompleteItems();
            oUploadSet.getBinding("items").refresh();
        },

        onRemovePressed: function (oEvent) {
            debugger;
            // oEvent.preventDefault();
            // oEvent.getParameter("item").getBindingContext().delete();
            // MessageToast.show("Selected file has been deleted");
            oEvent.getParameter("item").destroy();

        },

        onOpenPressed: function (oEvent) {
            debugger;
            oEvent.preventDefault();
            var item = oEvent.getSource();
            var fileUrl = item.getUrl();

            // Open file in a new tab
            var newTab = window.open(fileUrl, '_blank');
            if (newTab) {
                newTab.focus();
            } else {
                // If pop-up blocker prevents opening new tab, provide alternative instructions
                alert('Please allow pop-ups to open the file.');

                return new Promise((resolve, reject) => {
                    $.ajax(settings)
                        .done((result) => {
                            resolve(result);
                        })
                        .fail((err) => {
                            reject(err);
                        });
                });
            };

            _download(item)
                .then((blob) => {
                    var url = window.URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        _download: function (item) {
            debugger
            var settings = {
                url: item.getUrl(),
                method: "GET",
                headers: {
                    "Content-type": "application/octet-stream"
                },
                xhrFields: {
                    responseType: 'blob'
                }
            }

            return new Promise((resolve, reject) => {
                $.ajax(settings)
                    .done((result) => {
                        resolve(result)
                    })
                    .fail((err) => {
                        reject(err)
                    })
            });
        },

        _createEntity: function (item) {
            debugger
            var data = {
                mediaType: item.getMediaType(),
                fileName: item.getFileName(),
                size: item.getFileObject().size
            };

            var settings = {
                url: "/attachments/Files",
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                data: JSON.stringify(data)
            }

            return new Promise((resolve, reject) => {
                $.ajax(settings)
                    .done((results, textStatus, request) => {
                        resolve(results.ID);
                    })
                    .fail((err) => {
                        reject(err);
                    })
            })
        },

        _uploadContent: function (item, id) {
            debugger
            // var url = `/attachments/Files(${id})/content`
            var url = `/attachments/Files(ID='${id}',id1=)/content`
            item.setUploadUrl(url);
            var oUploadSet = this.byId("uploadSet");
            oUploadSet.setHttpRequestMethod("PUT")
            oUploadSet.uploadItem(item);
        },

        //formatters
        formatThumbnailUrl: function (mediaType) {
            debugger
            var iconUrl;
            switch (mediaType) {
                case "image/png":
                    iconUrl = "sap-icon://card";
                    break;
                case "text/plain":
                    iconUrl = "sap-icon://document-text";
                    break;
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    iconUrl = "sap-icon://excel-attachment";
                    break;
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    iconUrl = "sap-icon://doc-attachment";
                    break;
                case "application/pdf":
                    iconUrl = "sap-icon://pdf-attachment";
                    break;
                default:
                    iconUrl = "sap-icon://attachment";
            }
            return iconUrl;
        }

    };
});
