import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/login/login-page';
import AboutPage from '../pages/about/about-page';
import StoriesPage from '../pages/stories/stories-page';
import FavoritesPage from '../pages/favorites/favorites-page';

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/login': LoginPage,
  '/about': AboutPage,
  '/stories': StoriesPage,
  '/favorites': FavoritesPage,
};

export default routes;
