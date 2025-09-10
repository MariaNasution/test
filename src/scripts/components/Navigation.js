import { AuthModel } from "../models/authModel";

class Navigation {
  constructor() {
    this.auth = new AuthModel();
  }

  render() {
    const isLoggedIn = !!this.auth.getToken();

    return `
      <ul class="nav-list">
        <li><a href="#/home">Beranda</a></li>
        ${
          isLoggedIn
            ? `
            <li><a href="#/stories">Stories</a></li>
            <li><a href="#/add">Tambah</a></li>
            <li><a href="#/about">Tentang</a></li>
            <li><a href="#/logout" id="logout-link">Keluar</a></li>
          `
            : `
            <li><a href="#/login">Masuk</a></li>
            <li><a href="#/about">Tentang</a></li>
          `
        }
      </ul>
    `;
  }

  afterRender() {
    const logoutLink = document.querySelector("#logout-link");
    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        this.auth.clear(); // ✅ sesuai dengan AuthModel
        window.location.hash = "#/login";
      });
    }
  }
}

export default Navigation;
