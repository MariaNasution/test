import { StoryAPI } from '../data/api';

export class AuthModel {
  #tokenKey = 'story_token';

  saveToken(token) {
    localStorage.setItem(this.#tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.#tokenKey);
  }

  clear() {
    localStorage.removeItem(this.#tokenKey);
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  /**
   * Proses login (bisnis logic) dipindahkan ke sini
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<string>} token
   */
  async login(email, password) {
    const data = await StoryAPI.login({ email, password });
    const token = data?.loginResult?.token;
    if (!token) throw new Error('Token tidak ditemukan');
    this.saveToken(token);
    return token;
  }
    async register({ name, email, password }) {
    const response = await fetch('https://story-api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) throw new Error('REGISTER_FAILED');
    return await response.json();
  }

}
