var Factory = require('base/utils/factory');

HomeG = Factory.view({
    template: require('sections/home-g/homeG.html')
});
console.log(HomeG);
module.exports = HomeG;