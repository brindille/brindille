import Component from './Component';
import bindAll from 'lodash.bindall';
import {on, off} from 'dom-event';

export default class InteractiveComponent extends Component {
  constructor($el) {
    super($el);
    this.maxSwipe = 50;

    bindAll(this, 'onMouseOver', 'onMouseOut', 'onTouchStart', 'onTouchMove', 'onToucheUp', 'onClick');
    if (!window.isMobile) this.enableMouseEvents();
  }

  dispose() {
    this.disableMouseEvents();
    this.disableTouchEvents();
    super.dispose();
  }

  /*
    CLICK VS TAP event
  */

  enableClickEvents() {
    if (window.isMobile || window.isTablet)
      on(this.$el, 'touchstart', this.onClick);
    else
      on(this.$el, 'click', this.onClick);
  }

  disableClickEvents() {
    if (window.isMobile || window.isTablet)
      off(this.$el, 'touchstart', this.onClick);
    else
      off(this.$el, 'click', this.onClick);
  }

  onClick() {
    console.warn('You probably want to override onClick on', Object.getPrototypeOf(this));
  }

  /*
   *  Mouse events
   */

  onMouseOver() {
    console.warn('You probably want to override onMouseOver on', Object.getPrototypeOf(this));
  }

  onMouseOut() {
    console.warn('You probably want to override onMouseOut on', Object.getPrototypeOf(this));
  }

  enableMouseEvents() {
    on(this.$el, 'mouseenter', this.onMouseOver);
    on(this.$el, 'mouseleave', this.onMouseOut);
  }

  disableMouseEvents() {
    off(this.$el, 'mouseenter', this.onMouseOver);
    off(this.$el, 'mouseleave', this.onMouseOut);
  }

  enableMouseEvents() {
    on(this.$el, 'mouseenter', this.onMouseOver);
    on(this.$el, 'mouseleave', this.onMouseOut);
  }

  /*
   *  Touch events
   */

  enableTouchEvents(start, end) {
    this.startMax = start ? start : 0;
    this.endMax = end ? end : window.innerWidth;
    on(this.$el, 'touchstart', this.onTouchStart);
  }

  disableTouchEvents() {
    off(this.$el, 'touchstart', this.onTouchStart);
  }

  onTouchStart(e) {
    this.startSwipeX = e.touches[0].clientX;
    if (this.startSwipeX > this.startMax && this.startSwipeX < this.endMax) {
      on(window, 'touchend', this.onToucheUp);
      on(document, 'touchmove', this.onTouchMove);
    }
  }

  onTouchMove(e) {
    // e.preventDefault();
    var toucheX = e.touches[0].clientX;
    this.deltaSwipe = this.startSwipeX - toucheX;
    if (Math.abs(this.deltaSwipe) < this.maxSwipe) {
      this.animeTouchMove();
    } else {
      e.preventDefault();
    }
  }

  onToucheUp() {
    if (Math.abs(this.deltaSwipe) > this.maxSwipe) {
      if (this.deltaSwipe > 0) {
        this.swipeToLeft();
      } else {
        this.swipeToRight();
      }
    }
    off(window, 'touchend', this.onToucheUp);
    off(document, 'touchmove', this.onTouchMove);
  }

  animeTouchMove() {
    console.warn('You probably want to override animeTouchMove on', Object.getPrototypeOf(this));
  }

  swipeToLeft() {
    console.warn('You probably want to override swipeToLeft on', Object.getPrototypeOf(this));
  }

  swipeToRight() {
    console.warn('You probably want to override swipeToRight on', Object.getPrototypeOf(this));
  }
}
