const appData = {
  routes: [
    { id: 'route01', name: 'خط 01', path: 'زهراء أكتوبر ↔ الحصري', service: 'bus', status: 'نشط' },
    { id: 'route02', name: 'خط 02', path: 'المجمع الطبي ↔ جامعة 6 أكتوبر', service: 'bus', status: 'نشط' },
    { id: 'route03', name: 'خط 03', path: 'المحطة الرئيسية ↔ نادي الداخلية', service: 'bus', status: 'نشط' },
    { id: 'routeDelivery', name: 'دليفري', path: 'توصيل وشراء السلع', service: 'delivery', status: 'قيد التشغيل' },
    { id: 'routeSchool', name: 'مدارس', path: 'مدارس و حضانات و أندية', service: 'school', status: 'نشط' }
  ],
  services: [
    { type: 'transport', label: 'النقل الحضري', active: true },
    { type: 'private', label: 'المشاوير الخاصة', active: true },
    { type: 'delivery', label: 'الدليفري وشراء السلع', active: true },
    { type: 'schools', label: 'المدارس والحضانات والأندية', active: true },
    { type: 'wallet', label: 'المحفظة', active: false },
    { type: 'complaints', label: 'المفقودات والشكاوى', active: true }
  ],
  stations: [
    { name: 'محطة المدخل الرئيسي', routeId: 'route01' },
    { name: 'المركز الطبي', routeId: 'route01' },
    { name: 'ميدان الحصري', routeId: 'route01' },
    { name: 'حي اللوتس', routeId: 'route03' },
    { name: 'حي الفيروز', routeId: 'route03' },
    { name: 'حي الزهور', routeId: 'route03' },
    { name: 'غرب المطار', routeId: 'route03' },
    { name: 'نادي الداخلية', routeId: 'route03' }
  ],
  fleet: [
    { type: 'حافلة', count: 48 },
    { type: 'موتوسكل', count: 8 },
    { type: 'اسكوتر', count: 10 },
    { type: 'عربية فان', count: 5 },
    { type: 'عربية كيوتا', count: 7 }
  ]
};

function syncSystemData(source = appData) {
  const routeCount = source.routes.length;
  const stationsCount = source.stations.length;
  const serviceCount = source.services.length;

  document.querySelectorAll('[data-sync="routes"]').forEach(node => {
    node.textContent = routeCount;
  });

  document.querySelectorAll('[data-sync="stations"]').forEach(node => {
    node.textContent = stationsCount;
  });

  document.querySelectorAll('[data-sync="services"]').forEach(node => {
    node.textContent = serviceCount;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  if (window.appData && appData) {
    syncSystemData();
  }
});
