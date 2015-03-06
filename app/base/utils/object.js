var forEach = require('for-each');

module.exports = {

    /**
     * Recursively iterates through an object tree to find all occurences of propName key
     * no matter the depth, it then returns an array containing these paths.
     * Ex :
     *     var object = {
     *         foo: 'bar',
     *         deep: {
     *             foo: 'something'
     *         },
     *         not: 'relevant'
     *     };
     *     findKeyPaths(object, 'foo') // returns ['foo', 'deep.foo']
     *
     * @param  {Object} object   Object to iterate
     * @param  {String} propName Key name to find in object
     * @return {Array}          List of paths ending with key propName
     */
    findKeyPaths: function(object, propName) {
        var paths = [];
        forEach(object, function(value, index) {
            if(Object.prototype.toString.call(value) === '[object Object]') {
                var subPaths = this.findKeyPaths(value, propName);
                subPaths = subPaths.map(function(itemValue, itemIndex) {
                    return index + '.' + itemValue
                });
                paths = paths.concat(subPaths);
            }
            else {
                if(index === propName) {
                    paths.push(index);
                }
            }
        }.bind(this));
        return paths;
    },

    /**
     * Find the value of an object from a path to this value.
     * Ex :
     *     var object = {
     *         foo: 'bar',
     *         deep: {
     *             foo: 'something'
     *         },
     *         not: 'relevant'
     *     };
     *     findPathValue(object, 'deep.foo') // returns 'something' (result of object['deep']['foo'])
     *
     * @param  {Object} object      Object you want to explore
     * @param  {String} stringPath  Path to value in object
     * @return {*}                  Value from object at stringPath, undefined if path does not exist in object
     */
    findPathValue: function(object, stringPath) {
        var parts = stringPath.split('.');
        var last = parts.pop();
        var l = parts.length;
        var i = 1;
        var current = parts[0];

        if(current === undefined && object && object[stringPath]) return object[stringPath];

        while((object = object[current]) && i < l) {
            current = parts[i];
            i++;
        }

        if(object) {
            return object[last];
        }

        return undefined;
    }
};