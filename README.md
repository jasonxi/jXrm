 
# Project Description
**jXrm** is inspired by jQuery and provides a JavaScript wrapping library on top of Microsoft Dynamics 365 (xRM) clientside SDK, that allows jQuery-like code style. jXrm simplifies JavaScript code compares to standard CRM SDK script.

Compare the CRM JS below,

```javascript
Xrm.Page.getAttribute('firstname').setValue(null);
Xrm.Page.getAttribute('lastname').setValue(null);
Xrm.Page.getControl('firstname').setVisible(false);
Xrm.Page.getControl('lastname').setVisible(false);
```
with jXrm code

```javascript
jXrm('#firstname, #lastname').val(null).hide();
```
# Installation
Create a WebResource and upload the _jXrm.min.js_. Reference the Web resource in a form and that's it.

# Documentation
* [References](https://github.com/jasonxi/jXrm/wiki/References)
