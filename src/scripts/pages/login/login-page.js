import { AuthPresenter } from '../../presenters/authPresenter';

class LoginPage {
  constructor() {
    this.presenter = new AuthPresenter(this);
    this.loadingEl = null;
  }

  async render() {
    return `
      <section class="container" aria-labelledby="login-title">
        <h1 id="login-title">Masuk</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required autocomplete="username"/>
          </div>
          <div class="form-group">
            <label for="password">Kata Sandi</label>
            <input id="password" name="password" type="password" required autocomplete="current-password"/>
          </div>
          <button id="login-btn" type="submit">Masuk</button>
        </form>
        <br/>

        <hr aria-hidden="true"/>
        <br/>
        <h2>Daftar</h2>
        <form id="register-form">
          <div class="form-group">
            <label for="name">Nama</label>
            <input id="name" name="name" type="text" required/>
          </div>
          <div class="form-group">
            <label for="reg-email">Email</label>
            <input id="reg-email" name="email" type="email" required/>
          </div>
          <div class="form-group">
            <label for="reg-password">Kata Sandi</label>
            <input id="reg-password" name="password" type="password" required/>
          </div>
          <button id="register-btn" type="submit">Daftar</button>
        </form>
        <p id="login-error" role="alert" aria-live="polite" class="error"></p>
      </section>
    `;
  }

  async afterRender() {
    const loginForm = document.querySelector('#login-form');
    const regForm = document.querySelector('#register-form');
    this.loadingEl = document.createElement('div');
    this.loadingEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.loadingEl);

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();
      this.presenter.onLogin(email, password);
    });

    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = regForm.name.value.trim();
      const email = regForm.email.value.trim();
      const password = regForm.password.value.trim();
      this.presenter.onRegister(name, email, password);
    });
  }

  setLoading(isLoading) {
    this.loadingEl.textContent = isLoading ? 'Memproses...' : '';
  }

  onLoginSuccess() {
    window.location.hash = '/stories';
  }

  onRegisterSuccess() {
    document.querySelector('#login-error').textContent = 'Registrasi berhasil. Silakan login.';
  }

  onLogout() {
    window.location.hash = '/login';
  }

  showError(msg) {
    document.querySelector('#login-error').textContent = msg;
  }
}

export default LoginPage;
