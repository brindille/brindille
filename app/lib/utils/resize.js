'use strict';

var EventEmitter = require('events').EventEmitter,
    debounce = require('debounce'),
    emitter = new EventEmitter();

emitter.setMaxListeners(50);

var resize = module.exports = {
    applyResize: function() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.halfWidth = 0.5*this.width;
        this.halfHeight = 0.5*this.height;
        emitter.emit('resize');
    },
    addListener: function(listener) {
        emitter.on('resize', listener);
    },
    removeListener: function(listener) {
        if(listener) emitter.removeListener('resize', listener);
    }
};

resize.debouncedResize = debounce(resize.applyResize, 150);
resize.applyResize();
window.addEventListener('resize', resize.debouncedResize.bind(resize));
