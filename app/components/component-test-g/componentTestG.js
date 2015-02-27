'use strict';

var View = require('base/View'),
    inherits = require('inherits');

function ComponentTestG(data) {
    View.call(this, {
        template: require('./componentTestG.html'),
        data: data, // if you want you can extend
        components: {
            "testh": require('components/component-test-h/componentTestH')
        }
    });
}

inherits(ComponentTestG, View);

module.exports = ComponentTestG;