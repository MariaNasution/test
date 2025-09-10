import { StoryAPI } from '../data/api';
import { AuthModel } from './authModel';

export class StoryModel {
  constructor() {
    this.items = [];
    this.auth = new AuthModel();
  }

  setItems(items) {
    this.items = items || [];
  }

  getItems() {
    return this.items;
  }

  async getStories({ withLocation = true, page = 1, size = 20 } = {}) {
    const token = this.auth.getToken();
    if (!token) throw new Error('Token tidak tersedia, silakan login ulang');

    const data = await StoryAPI.getStories({ token, withLocation, page, size });
    this.setItems(data?.listStory || []);
    return data;
  }

  async addStory({ description, photoBlob, lat, lon }) {
    const token = this.auth.getToken();
    if (!token) throw new Error('Token tidak tersedia, silakan login ulang');

    return StoryAPI.addStory({ token, description, photoBlob, lat, lon });
  }
}
