import AboutPresenter from '../../presenters/aboutPresenter';

export default class AboutPage {
  constructor() {
    this.presenter = new AboutPresenter(this);
  }

  async render() {
    return `
      <section class="container">
        <h1>About Page</h1>
        <div id="about-info"></div>
      </section>
    `;
  }

  async afterRender() {
    this.presenter.init();
  }

  showInfo(info) {
    const container = document.querySelector('#about-info');
    container.innerHTML = `
      <p><strong>App Name:</strong> ${info.appName}</p>
      <p><strong>Version:</strong> ${info.version}</p>
      <p><strong>Author:</strong> ${info.author}</p>
    `;
  }
}
