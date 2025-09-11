import { StoryListPresenter } from "../../presenters/storyListPresenter";
import { Idb } from '../../utils/idb';

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
          <a class="button" href="#/favorites">❤️ Favorite Stories</a>
        </div>
        <div id="map" class="map" role="application" aria-label="Peta lokasi stories"></div>
        <ul id="stories-list" class="cards" aria-live="polite"></ul>
        <p id="stories-error" role="alert" class="error"></p>
      </section>
    `;
  }

  async afterRender() {
    // init map
    this.map = L.map("map").setView([-6.1754, 106.8272], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(this.map);
    this.markerLayer = L.layerGroup().addTo(this.map);

    await this.presenter.loadStories();
  }

  setLoading(isLoading) {
    // spinner kalau mau
  }

  renderList(items) {
    const list = document.querySelector("#stories-list");
    list.innerHTML = items
      .map(
        (it) => `
      <li class="card">
        <img src="${it.photoUrl}" alt="Foto story oleh ${it.name}"/>
        <div class="card-body">
          <h3>${it.name}</h3>
          <p>${it.description || ""}</p>
          <p><small>${it.createdAt || ""}</small></p>
          <button class="fav-btn" data-id="${it.id}" aria-label="Simpan ${it.name} ke favorit">❤️ Simpan</button>
        </div>
      </li>
    `
      )
      .join("");

    // listener save
    list.querySelectorAll(".fav-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const story = items.find((s) => s.id === id);
        await Idb.put(story);
        alert(`✅ Story "${story.name}" disimpan ke favorit`);
      });
    });
  }

  renderMapMarkers(items) {
    this.markerLayer.clearLayers();
    items.forEach((it) => {
      if (it.lat != null && it.lon != null) {
        const m = L.marker([it.lat, it.lon]).addTo(this.markerLayer);
        m.bindPopup(`<strong>${it.name}</strong><br/>${it.description || ""}`);
      }
    });
  }

  showError(msg) {
    document.querySelector("#stories-error").textContent = msg;
  }
}

export default StoriesPage;
