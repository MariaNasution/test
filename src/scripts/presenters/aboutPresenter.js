export default class AboutPresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    this.view.showInfo({
      appName: "My PWA App",
      version: "1.0.0",
      author: "Maria Laura Nasution",
    });
  }
}