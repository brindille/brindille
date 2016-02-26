import Component from 'brindille-component';
import classes from 'dom-classes';

export default class Section extends Component {
  constructor($el) {
    super($el);
  }

  transitionIn(callback) {
    TweenMax.fromTo(this.$el, 0.5, {alpha: 0}, {alpha: 1, onComplete: () => {
      callback();
    }});
    classes.remove(this.$el, 'hidden');
  }

  transitionOut(callback) {
    TweenMax.to(this.$el, 0.5, {alpha: 0, onComplete: () => {
      callback();
    }});
  }
}
