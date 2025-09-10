import { StoryListPresenter } from '../../presenters/storyListPresenter';

class StoriesPage {
  constructor() {
    this.presenter = new StoryListPresenter(this);
    this.map = null;
    this.markerLayer = null;
  }

  async render() {
    return `
      <section class="container" aria-labelledby="stories-title">
        <h1 id="stories-title">Stories dengan Lokasi</h1>
        <div class="toolbar">
          <a class="button" href="#/add" id="add-link">Tambah Story</a>
        </div>
        <div id="map" class="map" role="application" aria-label="Peta lokasi stories"></div>
        <ul id="stories-list" class="cards" aria-live="polite"></ul>
        <p id="stories-error" role="alert" class="error"></p>
      </section>
    `;
  }

  async afterRender() {
    // init map
    this.map = L.map('map').setView([ -6.1754, 106.8272 ], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);
    this.markerLayer = L.layerGroup().addTo(this.map);

    await this.presenter.loadStories();
  }

  setLoading(isLoading) {
    // could show a spinner if desired
  }

  renderList(items) {
    const list = document.querySelector('#stories-list');
    list.innerHTML = items.map((it) => `
      <li class="card">
        <img src="${it.photoUrl}" alt="Foto story oleh ${it.name}"/>
        <div class="card-body">
          <h3>${it.name}</h3>
          <p>${it.description || ''}</p>
          <p><small>${it.createdAt || ''}</small></p>
        </div>
      </li>
    `).join('');
  }

  renderMapMarkers(items) {
    this.markerLayer.clearLayers();
    items.forEach((it) => {
      if (it.lat != null && it.lon != null) {
        const m = L.marker([it.lat, it.lon]).addTo(this.markerLayer);
        m.bindPopup(`<strong>${it.name}</strong><br/>${it.description || ''}`);
      }
    });
  }

  showError(msg) {
    document.querySelector('#stories-error').textContent = msg;
  }
}

export default StoriesPage;
