import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import StoriesPage from '../pages/stories/stories-page';
import AddPage from '../pages/add/add-page';

const routes = {
  '/': LoginPage,
  '/login': LoginPage,
  '/stories': StoriesPage,
  '/add': AddPage,
  '/about': AboutPage,
  '/home': HomePage,
};

export default routes;
