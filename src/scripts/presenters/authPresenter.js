import { StoryAPI } from "../data/api";
import { AuthModel } from "../models/authModel";

export class AuthPresenter {
  constructor(view) {
    this.view = view;
    this.auth = new AuthModel();
  }

  async onLogin(email, password) {
    this.view.setLoading(true);
    try {
      await this.auth.login(email, password);
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
      const result = await this.model.register({ name, email, password }); 
      this.view.onRegisterSuccess(result);
    } catch (error) {
      this.view.onRegisterFailed(error.message);
    } finally {
      this.view.setLoading(false);
    }
  }


  logout() {
    this.auth.clear();
    this.view.onLogout();
  }

  getToken() {
    return this.auth.getToken();
  }
  isLoggedIn() {
    return this.auth.isLoggedIn();
  }
}
