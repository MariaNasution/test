export default class LoginPresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  async login(username, password) {
    try {
      const result = await this.model.login(username, password);
      this.view.showLoginResult(result);
    } catch (error) {
      this.view.showLoginResult({ error: true, message: error.message });
    }
  }
}