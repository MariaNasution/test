import { Idb } from '../../utils/idb';

class FavoritesPage {
  async render() {
    return `
      <section class="container" aria-labelledby="fav-title">
        <h1 id="fav-title">❤️ Favorite Stories</h1>
        <ul id="favorites-list" class="cards"></ul>
      </section>
    `;
  }

  async afterRender() {
    const favs = await Idb.getAll();
    const list = document.querySelector("#favorites-list");

    if (!favs.length) {
      list.innerHTML = "<p>Belum ada story favorit.</p>";
      return;
    }

    list.innerHTML = favs
      .map(
        (it) => `
      <li class="card">
        <img src="${it.photoUrl}" alt="Foto story oleh ${it.name}"/>
        <div class="card-body">
          <h3>${it.name}</h3>
          <p>${it.description || ""}</p>
          <button class="del-btn" data-id="${it.id}" aria-label="Hapus ${it.name} dari favorit">🗑️ Hapus</button>
        </div>
      </li>
    `
      )
      .join("");

    // delete listener
    list.querySelectorAll(".del-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        await Idb.delete(id);
        btn.closest("li").remove();
      });
    });
  }
}

export default FavoritesPage;
