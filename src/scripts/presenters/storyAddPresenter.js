import { StoryModel } from '../models/storyModel';

export class StoryAddPresenter {
  constructor(view) {
    this.view = view;
    this.storyModel = new StoryModel();
  }

  async submit({ description, photoBlob, lat, lon }) {
    this.view.setLoading(true);
    try {
      await this.storyModel.addStory({ description, photoBlob, lat, lon });
      this.view.onSubmitSuccess();
    } catch (e) {
      this.view.showError(e.message);
    } finally {
      this.view.setLoading(false);
    }
  }
}
