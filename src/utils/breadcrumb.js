// Rota haritası - her rotanın başlığını ve üst rotasını tanımlar
const routeMap = {
  '/': { title: 'Ana Sayfa', parent: null },
  '/create-user': { title: 'Yeni Kullanıcı', parent: '/' },
  '/test-page-1': { title: 'Test Sayfası 1', parent: '/' },
  '/test-page-2': { title: 'Test Sayfası 2', parent: '/' },
  '/country-list': { title: 'Ülkeler', parent: '/' },
  '/create-country': { title: 'Yeni Ülke', parent: '/' },
  '/region-list': { title: 'Bölge Listesi', parent: '/' },
};

export function generateBreadcrumbs(pathname) {
  const breadcrumbs = [];
  let currentPath = pathname;

  // Dinamik rotaları kontrol et (örn: /users/123)
  const dynamicRoute = Object.keys(routeMap).find(route => {
    const pattern = new RegExp(
      '^' + route.replace(/:\w+/g, '([^/]+)') + '(?:/|$)'
    );
    return pattern.test(currentPath);
  });

  if (dynamicRoute) {
    currentPath = dynamicRoute;
  }

  while (currentPath && routeMap[currentPath]) {
    breadcrumbs.unshift({
      path: currentPath,
      title: routeMap[currentPath].title,
    });
    currentPath = routeMap[currentPath].parent;
  }

  return breadcrumbs;
}
