var inherits = require('inherits'),
	View = require('base/View');

function HomeG() {
	View.call(this, {
		template: require('sections/home-g/homeG.html')
	});
}

inherits(HomeG, View);

module.exports = HomeG;