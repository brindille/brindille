import Section from 'lib/core/Section';

export default class About extends Section {
  constructor($el) {
    super($el);

    console.log('Hello from about');
  }

  dispose() {
    super.dispose();
  }
}
