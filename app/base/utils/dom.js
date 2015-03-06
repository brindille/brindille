var forEach = require('for-each');

module.exports = {
    attributesToData: function(domElement, model) {
        if (!domElement.tagName) {
            console.warn('[dom] attributesToData() - param must be a DOMElement');
            return;
        }
        var attributes = domElement.attributes;
        var model = {};
        var binders = [];
        var bindId;
        console.log('attributesToData', arguments);
        forEach(attributes, function(value, index) {
            if(value.name === undefined) return;
            if(value.name.indexOf('bind-') === 0) {
                bindId = value.name.replace('bind-', '');
                console.log('special bind', bindId, value.value, model[value.value], model);
                model[bindId] = model[value.value];
                binders.push({source: value.value, target: bindId});
            }
            else {
                model[value.name] = value.value;
            }
        });

        return {model: model, binders: binders};
    }
};