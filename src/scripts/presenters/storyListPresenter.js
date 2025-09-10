import { StoryModel } from '../models/storyModel';

export class StoryListPresenter {
  constructor(view) {
    this.view = view;
    this.model = new StoryModel();
  }

  async loadStories() {
    this.view.setLoading(true);
    try {
      // sekarang ambil data lewat model, bukan langsung ke API
      const data = await this.model.getStories({ withLocation: true, page: 1, size: 20 });

      this.view.renderList(this.model.getItems());
      this.view.renderMapMarkers(this.model.getItems());
    } catch (e) {
      this.view.showError(e.message);
    } finally {
      this.view.setLoading(false);
    }
  }
}
