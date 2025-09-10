const getActiveRoute = () => {
  const hash = window.location.hash.slice(1) || '/';
  const path = hash.split('?')[0];
  return path;
};

export { getActiveRoute };
