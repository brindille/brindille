import InteractiveComponent from 'brindille-interactive-component';

export default class ButtonTest extends InteractiveComponent {
  constructor($el) {
    super($el);
  }

  dispose() {
    super.dispose();
  }

  onClick(e) {
    console.log('[Button test] click', e);
  }
}
