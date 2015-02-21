'use strict';

var EventEmitter = require('events').EventEmitter,
    debounce = require('debounce'),
    emitter = new EventEmitter();

emitter.setMaxListeners(50);
var frequency = 1000/60;

var scrollUtil = module.exports = {
    doScroll: function() {
        this.ox = this.x;
        this.oy = this.y;
        this.x = window.scrollX || window.pageXOffset;
        this.y = window.scrollY || window.pageYOffset;

        this.direction = this.y - this.oy;
        emitter.emit('scroll');
    },
    addListener: function(listener) {
        emitter.on('scroll', listener);
    },
    removeListener: function(listener) {
        if(listener) emitter.removeListener('scroll', listener);
    }
};

scrollUtil.debouncedScroll = debounce(scrollUtil.doScroll, frequency);
scrollUtil.doScroll();
window.addEventListener('scroll', scrollUtil.debouncedScroll.bind(scrollUtil));