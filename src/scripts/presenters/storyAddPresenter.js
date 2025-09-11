import { StoryModel } from '../models/storyModel';
import NotificationHelper from '../utils/notification-helper';

export class StoryAddPresenter {
  constructor(view) {
    this.view = view;
    this.storyModel = new StoryModel();
  }

  async submit({ description, photoBlob, lat, lon }) {
    this.view.setLoading(true);
    try {
      await this.storyModel.addStory({ description, photoBlob, lat, lon });

      // ✅ kasih notifikasi setelah berhasil
      NotificationHelper.showNotification('Story berhasil ditambahkan 🎉');

      this.view.onSubmitSuccess();
    } catch (e) {
      this.view.showError(e.message);
    } finally {
      this.view.setLoading(false);
    }
  }
}
