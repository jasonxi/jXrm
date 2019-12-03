define('ui', ['core', 'utility', 'global'], function(jXrm, util, global) {
    util.extend(jXrm, {
        // alertStrings	Object	Yes	The strings to be used in the alert dialog. The object contains the following attributes:
        //     - confirmButtonLabel: (Optional) String. The confirm button label. If you do not specify the button label, OK is used as the button label.
        //     - text: String. The message to be displyed in the alert dialog.
        //     - title: (Optional) String. The title of the alert dialog.
        // alertOptions	Object	No	The height and width options for alert dialog. The object contains the following attributes:
        //     - height: (Optional) Number. Height of the alert dialog in pixels.
        //     - width: (Optional) Number. Width of the alert dialog pixels.
        alert: function(alertStrings,successCallback, errorCallback, alertOptions) {
            var msg = (typeof alertStrings === 'string')? {text:alertStrings} : alertStrings;
            var opts = global.AlertOpts;
            util.extend(opts, alertOptions);
            Xrm.Navigation.openAlertDialog(msg, opts).then(successCallback, errorCallback);
        },
        // confirmStrings	Object	Yes	The strings to be used in the confirmation dialog. The object contains the following attributes:
        //     - cancelButtonLabel: (Optional) String. The cancel button label. If you do not specify the cancel button label, Cancel is used as the button label.
        //     - confirmButtonLabel: (Optional) String. The confirm button label. If you do not specify the confirm button label, OK is used as the button label.
        //     - subtitle: (Optional) String. The subtitle to be displayed in the confirmation dialog.
        //     - text: String. The message to be displayed in the confirmation dialog.
        //     - title: (Optional) String. The title to be displayed in the confirmation dialog.
        // confirmOptions	Object	No	The height and width options for confirmation dialog. The object contains the following attributes:
        //     - height: (Optional) Number. Height of the confirmation dialog in pixels.
        //     - width: (Optional) Number. Width of the confirmation dialog in pixels.
        confirm: function(confirmStrings, yesCallback, noCallback, errorCallback, confirmOptions) {
            var msg = (typeof confirmStrings === 'string')? {text:confirmStrings} : confirmStrings;
            var opts = global.ConfirmOpts;     // TODO: move to CONSTANT JS
            util.extend(opts, confirmOptions);
            Xrm.Navigation.openConfirmDialog(msg, opts).then(
                function(success) {
                    if (success.confirmed)
                        if (yesCallback) yesCallback();
                    else if (noCallback)    // TODO: BUG: not been called
                        noCallback();
                }
                ,errorCallback);
        },
        // entityFormOptions	Object	Yes	Entity form options for opening the form. The object contains the following attributes:
        //     cmdbar: (Optional) Boolean. Indicates whether to display the command bar. If you do not specify this parameter, the command bar is displayed by default.
        //     createFromEntity: (Optional) Lookup. Designates a record that will provide default values based on mapped attribute values. The lookup object has the following String properties: entityType, id, and name (optional).
        //     entityId: (Optional) String. ID of the entity record to display the form for.
        //     entityName: (Optional) String. Logical name of the entity to display the form for.
        //     formId: (Optional) String. ID of the form instance to be displayed.
        //     height: (Optional) Number. Height of the form window to be displayed in pixels.
        //     navbar: (Optional) String. Controls whether the navigation bar is displayed and whether application navigation is available using the areas and subareas defined in the sitemap. Valid vlaues are: "on", "off", or "entity".
        //         on: The navigation bar is displayed. This is the default behavior if the navbar parameter is not used.
        //         off: The navigation bar is not displayed. People can navigate using other user interface elements or the back and forward buttons.
        //         entity: On an entity form, only the navigation options for related entities are available. After navigating to a related entity, a back button is displayed in the navigation bar to allow returning to the original record.
        //     openInNewWindow: (Optional) Boolean. Indicates whether to display form in a new window.
        //     windowPosition: (Optional) Number. Specify one of the following values for the window position of the form on the screen:
        //         1:center
        //         2:side
        //     processId: (Optional) String. ID of the business process to be displayed on the form.
        //     processInstanceId: (Optional) String. ID of the business process instance to be displayed on the form.
        //     relationship: (Optional) Object. Define a relationship object to display the related records on the form. The object has the following attributes.              
        //         Name	Type	Description
        //         attributeName	String	Name of the attribute used for relationship.
        //         name	String	Name of the relationship.
        //         navigationPropertyName	String	Name of the navigation property for this relationship.
        //         relationshipType	Number	Relationship type. Specify one of the following values:
        //             0:OneToMany
        //             1:ManyToMany
        //         roleType	Number	Role type in relationship. Specify one of the following values:
        //             1:Referencing
        //             2:AssociationEntity
        //     selectedStageId: (Optional) String. ID of the selected stage in business process instance.
        //     useQuickCreateForm: (Optional) Boolean. Indicates whether to open a quick create form. If you do not specify this, by default false is passed.
        //     width: (Optional) Number. Width of the form window to be displayed in pixels.
        openForm: function(name, id, parameters, successCallback,errorCallback, options) {
            var entityFormOptions = {
                entityName: name, 
                entityId: id
            };
            if (options) util.extend(entityFormOptions, options);

            Xrm.Navigation.openForm(entityFormOptions, parameters).then(successCallback,errorCallback);
            //Xrm.Utility.openEntityForm(name,id,parameters,options)
        },
        // file	Object	Yes	An object describing the file to open. The object has the following attributes:
        //     - fileContent: String. Contents of the file.
        //     - fileName: String. Name of the file.
        //     - fileSize: Number. Size of the file in KB.
        //     - mimeType: String. MIME type of the file.
        // openFileOptions	Object	No	An object describing whether to open or save the file. The object has the following attribute:
        //     - openMode: Specify 1 to open; 2 to save.
        //     If you do not specify this parameter, by default 1 (open) is passed.
        //     This parameter is only supported on Unified Interface.
        openFile: function(file,openFileOptions) {
            Xrm.Navigation.openFile(file,openFileOptions);
        },
        // url	String	Yes	URL to open.
        // openUrlOptions	Object	No	Options to open the URL.The object contains the following attributes:
        //     - height: (Optional) Number. Height of the window to display the resultant page in pixels.
        //     - width: (Optional) Number. Width of the window to display the resultant page in pixels.
        openUrl: function(url, openUrlOptions) {
            Xrm.Navigation.openUrl(url,openUrlOptions);
        },
        // webResourceName	String	Yes	Name of the HTML web resource to open.
        // windowOptions	Object	No	Window options for opening the web resource. The object contains the following attributes:
        //     - height: (Optional) Number. Height of the window to open in pixels.
        //     - openInNewWindow: Boolean. Indicates whether to open the web resource in a new window.
        //     - width: (Optional) Number. Width of the window to open in pixels.
        // data	String	No	Data to be passed into the data parameter.
        openWebResource: function(webResourceName,windowOptions,data) {
            Xrm.Navigation.openWebResource(webResourceName,windowOptions,data);
        }
    });

    return jXrm;
});