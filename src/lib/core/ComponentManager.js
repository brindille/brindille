class ComponentManager {
  constructor () {
    this.get = this.get.bind(this)
    this.components = {}
  }

  register (componentName, componentClass) {
    this.components[componentName] = componentClass
  }

  registerMultiple (componentList) {
    this.components = componentList
  }

  get (componentName) {
    return this.components[componentName]
  }

  setRootComponent (rootComponent) {
    this.rootComponent = rootComponent
  }

  getInstance (componentName) {
    let component = this.rootComponent.findInstance(componentName)
    if (component) return component
    return console.error(`Couldn't find any instance of ${componentName}`)
  }
}

let comp = new ComponentManager()

export default comp
