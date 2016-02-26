import Section from 'lib/core/Section';

export default class Home extends Section {
  constructor($el) {
    super($el);

    console.log('Hello from home');
  }

  dispose() {
    super.dispose();
  }
}
