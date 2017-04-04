class Tracker {
  constructor () {
    this.trackPage = this.trackPage.bind(this)
    this.trackEvent = this.trackEvent.bind(this)

    this.lang = window.lang
  }

  trackPage (pageName) {}
  trackEvent (eventName) {}
}

export default new Tracker()
