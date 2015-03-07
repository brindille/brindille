/**
 * meta.js
 * Some functions to play with meta tags
 */
module.exports = {
    setTitle: function(title) {
        if (!title) return;

        document.title = title;
        var all = Array.prototype.slice.call(document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]'));
        if (!all.length) return;

        for (var i = 0, l = all.length; i < l; i++) {
            all[i].content = title;
        }
    },
    setDescription: function(description) {
        if (!description) return;

        var all = Array.prototype.slice.call(document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]'));
        if (!all.length) return;

        for (var i = 0, l = all.length; i < l; i++) {
            all[i].content = description;
        }
    }
};