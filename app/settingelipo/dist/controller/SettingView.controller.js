sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";var t="123e4567-e89b-12d3-a456-426614174000";return e.extend("settingui.controller.SettingView",{onInit:function(){debugger;this.getView().bindElement(`/Setting(${t})`)},onBackEndSelect:function(e){debugger;let t=e.getSource().getSelectedKey();var a=this.byId("contentVbox");if(t!="SAP"){for(let e=1;e<=5;e++){a.getItems()[e].setVisible(false)}}else{for(let e=1;e<=5;e++){a.getItems()[e].setVisible(true)}}},handleUploadComplete:function(e){debugger;var t=e.mParameters.status;if(t==204){sap.m.MessageToast.show("File Uploaded")}e.getSource().getParent().getItems()[0].getBindingContext().refresh()},changefile:function(e){debugger;var a=this.getOwnerComponent().getManifestObject()._oBaseUri._string;var n=this.byId("fileupload1");n.removeAllHeaderParameters();var i=new sap.ui.unified.FileUploaderParameter;i.setName("slug");i.setValue(e.mParameters.newValue);n.addHeaderParameter(i);var r=`${a}odata/v4/catalog/Setting(id=${t})/content`;n.setUploadUrl(r);n.checkFileReadable().then(async function(){var e=await n.upload();console.log()}).catch(function(e){debugger})},onFileSizeExceeded:function(e){debugger;sap.m.MessageToast.show("File Size Exceeded")},onSelectChangeFun:function(e){debugger}})});
//# sourceMappingURL=SettingView.controller.js.map