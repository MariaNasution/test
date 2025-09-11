export default class HomePresenter {
  constructor({ view }) {
    this.view = view;
  }

  async init() {
    // kalau ada data dari model, ambil di sini
    const message = "Gunakan menu untuk masuk dan melihat stories.";
    this.view.showMessage(message);
  }
}