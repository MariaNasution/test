class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Selamat datang</h1>
        <p>Gunakan menu untuk masuk dan melihat stories.</p>
        <p><a class="button" href="#/login">Masuk</a> atau <a class="button" href="#/stories">Lihat Stories</a></p>
      </section>
    `;
  }
  async afterRender() {}
}
export default HomePage;
