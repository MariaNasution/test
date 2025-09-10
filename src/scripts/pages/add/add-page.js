import { StoryAddPresenter } from "../../presenters/storyAddPresenter";

class AddPage {
  constructor() {
    this.presenter = new StoryAddPresenter(this);
    this.stream = null;
    this.map = null;
    this.lat = null;
    this.lon = null;
  }

  async render() {
    return `
      <section class="container" aria-labelledby="add-title">
        <h1 id="add-title">Tambah Story</h1>
        <a href="#/stories" class="button">Kembali</a>
        <form id="add-form">
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" required></textarea>
          </div>

          <fieldset>
            <legend>Ambil Foto (kamera)</legend>
            <div class="camera">
              <video id="camera" autoplay playsinline aria-label="Pratinjau kamera"></video>
              <canvas id="snapshot" class="hidden" aria-hidden="true"></canvas>
            </div>
            <div class="controls">
              <button type="button" id="capture">Ambil Foto</button>
              <button type="button" id="retake" class="secondary">Ulangi</button>
            </div>
          </fieldset>

          <fieldset>
            <legend>Pilih Lokasi di Peta</legend>
            <p>Klik pada peta untuk mengisi latitude dan longitude. Opsional.</p>
            <div id="map" class="map" role="application" aria-label="Peta pilih lokasi"></div>
            <div class="coords" aria-live="polite">
              <label for="lat">Lat</label>
              <input id="lat" name="lat" type="text" readonly />
              <label for="lon">Lon</label>
              <input id="lon" name="lon" type="text" readonly />
            </div>
          </fieldset>

          <button type="submit">Kirim</button>
          <p id="add-error" role="alert" class="error"></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    // init camera
    const video = document.querySelector("#camera");
    const canvas = document.querySelector("#snapshot");
    const captureBtn = document.querySelector("#capture");
    const retakeBtn = document.querySelector("#retake");

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      video.srcObject = this.stream;
    } catch (e) {
      this.showError("Tidak dapat mengakses kamera: " + e.message);
    }

    captureBtn.addEventListener("click", () => {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      canvas.classList.remove("hidden");
      video.classList.add("hidden");
    });

    retakeBtn.addEventListener("click", () => {
      canvas.classList.add("hidden");
      video.classList.remove("hidden");
    });

    // init map (reset jika ada instance lama)
    const mapContainer = document.getElementById("map");
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    this.map = L.map("map").setView([-6.1754, 106.8272], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(this.map);

    let marker = null;
    this.map.on("click", (e) => {
      this.lat = e.latlng.lat;
      this.lon = e.latlng.lng;
      document.querySelector("#lat").value = this.lat.toFixed(6);
      document.querySelector("#lon").value = this.lon.toFixed(6);
      if (marker) marker.remove();
      marker = L.marker([this.lat, this.lon])
        .addTo(this.map)
        .bindPopup("Lokasi terpilih")
        .openPopup();
    });

    // form submit
    const form = document.querySelector("#add-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const description = form.description.value.trim();
      let photoBlob;

      const canvasVisible = !document
        .querySelector("#snapshot")
        .classList.contains("hidden");
      if (canvasVisible) {
        photoBlob = await new Promise((resolve) =>
          document.querySelector("#snapshot").toBlob(resolve, "image/jpeg", 0.9)
        );
      } else if (this.stream) {
        // capture a frame if user forgot to press capture
        const c = document.createElement("canvas");
        c.width = video.videoWidth;
        c.height = video.videoHeight;
        c.getContext("2d").drawImage(video, 0, 0);
        photoBlob = await new Promise((resolve) =>
          c.toBlob(resolve, "image/jpeg", 0.9)
        );
      } else {
        this.showError("Foto wajib diambil");
        return;
      }

      await this.presenter.submit({
        description,
        photoBlob,
        lat: this.lat,
        lon: this.lon,
      });
    });
  }

  setLoading(isLoading) {
    // no-op for now
  }

  onSubmitSuccess() {
    this.stopCamera();
    window.location.hash = "/stories";
  }

  showError(msg) {
    document.querySelector("#add-error").textContent = msg;
  }

  stopCamera() {
  if (this.stream) {
    this.stream.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }

  const video = document.querySelector("#camera");
  if (video) {
    video.srcObject = null; // lepas binding agar kamera benar-benar off
  }
}


  beforeDestroy() {
  console.log("beforeDestroy terpanggil");
  this.stopCamera();
  if (this.map) {
    this.map.remove();
    this.map = null;
  }
}

}

export default AddPage;
