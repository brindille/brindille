'use strict';

var Factory = require('base/utils/factory');

var ComponentTestG = Factory.view({
    template: require('./componentTestG.dom'),
    model: {},
    compose: {
        "testh": require('components/component-test-h/componentTestH')
    }
});

ComponentTestG.prototype.ready = function() {
    // console.log('Ref: ', this.refs.componentTestH);
};

module.exports = ComponentTestG;