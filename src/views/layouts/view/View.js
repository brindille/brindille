import Component from 'brindille-component';
import componentManager from 'lib/core/ComponentManager';
import Mediator from 'lib/Mediator';
import bindAll from 'lodash.bindall';

export default class View extends Component {
  constructor($el) {
    super($el);

    bindAll(this, 'onRoute', 'showFirstPage');

    Mediator.on('route:change:ready', this.onRoute);
    Mediator.once('route:change:first', this.showFirstPage);

    this.isSafariMobile = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
  }

  dispose() {
    Mediator.off('route:change:ready', this.onRoute);
    Mediator.off('route:change:first', this.showFirstPage);
    super.dispose();
  }

  showFirstPage() {
    this.currentPage = this._componentInstances[0];
    this.currentPage.transitionIn(this.firstPageShown);
  }

  transitionInAndAfterOut() {
    this.addNewPage();

    this.currentPage.transitionIn(() => {
      this.removeAllChilds(this.currentPage);
      this.firstPageShown();
    });
  }

  transitionOutAndAfterIn() {
    this._componentInstances[this._componentInstances.length - 1].transitionOut(() => {
      this.removeAllChilds();
      this.addNewPage();
      this.currentPage.transitionIn(this.firstPageShown);
    });
  }

  removeAllChilds(except) {
    this._componentInstances.forEach((value, i) => {
      if (value !== except) {
        value.dispose();
        this._componentInstances.splice(i, 1);
      }
    });

    if (!except) this._componentInstances = [];
  }

  addNewPage() {
    this._componentInstances.push(this.currentPage);
    this.$el.appendChild(this.currentPage.$el);
  }

  firstPageShown() {
    Mediator.emit('route:change:done');
  }

  createSection(text) {
    let $node = document.createElement('div');
    $node.innerHTML = text;
    $node = $node.firstChild;

    let componentName = $node.getAttribute('data-component');
    let Ctor = componentManager.get(componentName);

    $node.removeAttribute('data-component');

    let section = new Ctor($node);
    section.init(componentManager.rootComponent.definitions);
    section.componentName = componentName;
    section.parent = this;

    return section;
  }

  manageSpecialPages() {}

  onRoute(path, id, content) {
    window.scrollTo(0, 0);
    this.currentPath = path;
    this.currentPage = this.createSection(content.page);
    this.content = content;

    if (this._componentInstances.length && !window.isMobile) {
      this.transitionOutAndAfterIn();
      this.manageSpecialPages(id);
    } else {
      this.removeAllChilds();
      this.addNewPage();
      this.firstPageShown();
    }
  }
}
