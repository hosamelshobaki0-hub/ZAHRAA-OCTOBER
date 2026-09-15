import urllib.request

checks = {
    'ticket.html': ['تذاكري', 'الخط الأخضر', 'تحميل التذكرة'],
    'admin/index.html': ['لوحة مدير النظام', 'إدارة الخطوط', 'التقارير'],
    'driver/index.html': ['لوحة السائق', 'الحافلة 12'],
}

css = urllib.request.urlopen('http://127.0.0.1:8000/css/style.css').read().decode('utf-8', 'ignore')
required_css = ['admin-shell', 'driver-grid', 'ticket-list', '.admin-panels', '.mini-stat']
print('css_check=' + str(all(v in css for v in required_css)))

for path, needles in checks.items():
    data = urllib.request.urlopen('http://127.0.0.1:8000/' + path).read().decode('utf-8', 'ignore')
    print(path + '=' + str(all(n in data for n in needles)))
