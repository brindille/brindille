'use strict';

var Emitter = require('emitter-component'),
    debounce = require('debounce'),
    frequency = 1000/60;

var scrollUtil = module.exports = {
    doScroll: function() {
        this.ox = this.x;
        this.oy = this.y;
        this.x = window.scrollX || window.pageXOffset;
        this.y = window.scrollY || window.pageYOffset;

        this.direction = this.y - this.oy;
        this.emit('scroll');
    },
    addListener: function(listener) {
        this.on('scroll', listener);
    },
    removeListener: function(listener) {
        if(listener) this.off('scroll', listener);
    }
};

Emitter(scrollUtil);
scrollUtil.debouncedScroll = debounce(scrollUtil.doScroll, frequency);
scrollUtil.doScroll();
window.addEventListener('scroll', scrollUtil.debouncedScroll.bind(scrollUtil));