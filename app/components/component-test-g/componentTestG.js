'use strict';

var Factory = require('base/utils/factory');

var ComponentTestG = Factory.view({
    template: require('./componentTestG.html'),
    data: {},
    components: {
        "testh": require('components/component-test-h/componentTestH')
    }
});

module.exports = ComponentTestG;