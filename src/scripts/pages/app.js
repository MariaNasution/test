import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import Navigation from "../components/Navigation";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipLink = null;
  #currentViewInstance = null;
  #navigation = null;

  constructor({ navigationDrawer, drawerButton, content, skipLink }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLink = skipLink;
    this.#navigation = new Navigation();

    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    // Skip link handler
    if (this.#skipLink) {
      this.#skipLink.addEventListener("click", (event) => {
        event.preventDefault();
        this.#skipLink.blur(); // gunakan this.#skipLink
        const main = this.#content; // langsung pakai #content
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
        main.scrollIntoView({ behavior: "smooth" });
        main.removeAttribute("tabindex");
        console.log("skipLink triggered");
      });
    }

    window.addEventListener("hashchange", () => this.renderPage());
  }

  async renderPage() {
    const url = getActiveRoute();
    const Page = routes[url];
    if (!Page) return;

    // render navigation
    const navContainer = document.querySelector("#navigation-drawer");
    if (navContainer) {
      navContainer.innerHTML = this.#navigation.render();
      this.#navigation.afterRender();
    }

    // cleanup previous view
    if (this.#currentViewInstance?.beforeDestroy) {
      try {
        this.#currentViewInstance.beforeDestroy();
      } catch {}
    }

    const instantiate = async () => {
      this.#currentViewInstance = new Page();
      this.#content.innerHTML = await this.#currentViewInstance.render();
      await this.#currentViewInstance.afterRender?.();
      this.#navigationDrawer.classList.remove("open");
      const main = document.querySelector("#main-content");
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
      main.removeAttribute("tabindex");
    };

    if (document.startViewTransition) {
      await document.startViewTransition(instantiate).finished;
    } else {
      await instantiate();
    }
  }
}

export default App;
