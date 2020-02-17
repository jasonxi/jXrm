define('entity', ['core', 'utility'], function(jXrm, util) {
    jXrm.entity = {
        get id() {
            return (jXrm.formContext || Xrm.Page).data.entity.getId();
        },
        get dataXml() {
            return (jXrm.formContext || Xrm.Page).data.entity.getDataXml();
        },
        get entityName() {
            return (jXrm.formContext || Xrm.Page).data.entity.getEntityName();
        },
        get name() {
            return (jXrm.formContext || Xrm.Page).data.entity.getPrimaryAttributeValue();
        },
        get valid() {
            return (jXrm.formContext || Xrm.Page).data.entity.isValid();
        },
        get isDirty() {
            return (jXrm.formContext || Xrm.Page).data.entity.getIsDirty();
        },
        get entityReference() {
            return (jXrm.formContext || Xrm.Page).data.entity.getEntityReference();
        },
    };

    return jXrm;
});