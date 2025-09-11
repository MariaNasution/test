import { AuthModel } from '../models/authModel';

export class AuthPresenter {
  constructor(view) {
    this.view = view;
    this.model = new AuthModel();
  }

  async onLogin(email, password) {
    this.view.setLoading(true);
    try {
      await this.model.login(email, password);
      this.view.onLoginSuccess();
    } catch (e) {
      this.view.showError(e.message);
    } finally {
      this.view.setLoading(false);
    }
  }

  async onRegister(name, email, password) {
    this.view.setLoading(true);
    try {
      await this.model.register({ name, email, password });
      this.view.onRegisterSuccess();
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.setLoading(false);
    }
  }

  logout() {
    this.model.clear();
    this.view.onLogout();
  }

  getToken() {
    return this.model.getToken();
  }

  isLoggedIn() {
    return this.model.isLoggedIn();
  }
}