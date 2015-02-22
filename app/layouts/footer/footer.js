'use strict';

var Layout = require('lib/Layout');
var fs = require('fs');

var footer = new Layout({
    el: 'footer',
    template: fs.readFileSync(__dirname + '/footer.html', 'utf8'),
    data: {},
    components: {
        simpleLink: {
            componentId: 'component-test'
        },
        simpleLink2: {
            componentId: 'component-test',
            data: {
                label: 'simple link 2'
            }
        },
        simpleLink3: {
            componentId: 'component-test',
            data: {
                label: 'simple link 3'
            }
        }
    }
});

module.exports = footer;