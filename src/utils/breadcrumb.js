// Rota haritası - her rotanın başlığını ve üst rotasını tanımlar
const routeMap = {
  '/': { title: 'Ana Sayfa', parent: null },
  '/user-list': { title: 'Kullanıcı Listesi', parent: '/' },
  '/create-user': { title: 'Yeni Kullanıcı', parent: '/' },
  '/country-list': { title: 'Ülkeler', parent: '/' },
  '/region-list': { title: 'Bölge Listesi', parent: '/' },
  '/group-list': { title: 'Grup Listesi', parent: '/' },
  '/group-detail': { title: 'Grup Detayı', parent: '/group-list' },
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
