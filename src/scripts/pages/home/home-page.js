import HomePresenter from '../../presenters/homePresenter';

class HomePage {
  constructor() {
    this.presenter = new HomePresenter({ view: this });
  }

  async render() {
    return `
      <section class="container">
        <h1>Selamat datang</h1>
        <p id="home-message"></p>
        <p>
          <a class="button" href="#/login">Masuk</a> 
          atau 
          <a class="button" href="#/stories">Lihat Stories</a>
        </p>
      </section>
    `;
  }

  async afterRender() {
    await this.presenter.init();
  }

  showMessage(message) {
    const container = document.querySelector('#home-message');
    container.textContent = message;
  }
}
export default HomePage;
