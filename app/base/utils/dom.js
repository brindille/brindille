var forEach = require('for-each');

module.exports = {
    attributesToData: function(domElement) {
        if (!domElement.tagName) {
            console.warn('[dom] attributesToData() - param must be a DOMElement');
            return;
        }
        var attributes = domElement.attributes;
        var data = {};
        forEach(attributes, function(value, index) {
            data[value.name] = value.value;
        });

        return data;
    }
};