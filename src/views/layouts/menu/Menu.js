import Component from 'brindille-component'

export default class Menu extends Component {
  constructor ($el) {
    super($el)

    // Method bindings

    // Dom nodes registering

    // Event listeners
    this.addEvents()
  }

  addEvents () {}

  removeEvents () {}

  dispose () {
    this.removeEvents()
    super.dispose()
  }
}
