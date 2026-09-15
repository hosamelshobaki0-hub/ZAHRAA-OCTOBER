document.addEventListener('DOMContentLoaded', function () {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const makeEmptyRecord = () => ({
    services: [],
    stores: [],
    vehicleTypes: [],
    routes: []
  });

  const safeJson = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  };

  const saveJson = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const settingsStorageKey = 'zahraaPlatformSettings';
  const formRecordsKey = 'zahraaFormRecords';
  const eventLogKey = 'zahraaEventLog';

  const storage = safeJson(settingsStorageKey, defaults || {});

  const appState = safeJson('zahraaAppState', {
    activity: [],
    forms: []
  });

  const appendActivity = (type, label, extra = {}) => {
    const event = {
      type,
      label,
      page: window.location.pathname.split('/').pop() || 'index.html',
      createdAt: new Date().toISOString(),
      extra
    };

    const activity = safeJson(eventLogKey, []);
    activity.push(event);
    if (activity.length > 80) activity.splice(0, activity.length - 80);
    saveJson(eventLogKey, activity);
  };

  const activateCards = () => {
    document.querySelectorAll('a[href], button, .card, .service-card, .route-card, .ticket-card').forEach(function (element) {
      if (!element.dataset.zahraaTracked) {
        element.dataset.zahraaTracked = '1';
        element.addEventListener('click', function () {
          const label = element.innerText ? element.innerText.trim().replace(/\s+/g, ' ') : (element.getAttribute('href') || element.className || 'element');
          appendActivity('button_click', label, { target: element.tagName });
        });
      }
    });
  };

  const captureForms = () => {
    document.querySelectorAll('form').forEach(function (form) {
      if (!form.dataset.zahraaCaptured) {
        form.dataset.zahraaCaptured = '1';
        form.addEventListener('submit', function (event) {
          const payload = {};
          const fields = form.querySelectorAll('input, textarea, select');
          fields.forEach(field => {
            if (!field.name) return;
            payload[field.name] = field.type === 'checkbox' ? field.checked : field.value;
          });

          const records = safeJson(formRecordsKey, []);
          records.push({
            page: currentPath,
            form: form.getAttribute('id') || form.getAttribute('class') || 'form',
            submittedAt: new Date().toISOString(),
            payload
          });

          if (records.length > 100) records.splice(0, records.length - 100);
          saveJson(formRecordsKey, records);
          appendActivity('form_submit', form.getAttribute('id') || 'form', { fields: Object.keys(payload) });
        });
      }
    });
  };

  document.querySelectorAll('a.nav-link').forEach(function (link) {
    const target = link.getAttribute('href');
    if (target === currentPath) {
      link.classList.add('active');
    }
  });

  document.querySelectorAll('a.sidebar-link').forEach(function (link) {
    const target = link.getAttribute('href');
    if (target && target.indexOf(currentPath) >= 0) {
      link.classList.add('active');
    }
  });

  const passwordToggle = document.getElementById('togglePassword');
  if (passwordToggle) {
    passwordToggle.addEventListener('click', function () {
      const passwordInput = document.getElementById('passwordInput');
      if (passwordInput && passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.className = 'ri-eye-line password-toggle';
      } else if (passwordInput) {
        passwordInput.type = 'password';
        this.className = 'ri-eye-off-line password-toggle';
      }
    });
  }

  const defaults = {
    platformName: 'منصة زهراء أكتوبر الرقمية',
    cityName: 'زهراء أكتوبر',
    supportPhone: '+966 000 000 000',
    supportEmail: 'support@zahraa-city.com',
    mapCenter: '30.933, 29.336',
    serviceType: 'النقل الداخلي',
    serviceAreas: 'حي اللوتس، حي الفيروز، حي الزهور، غرب المطار، نادي الداخلية',
    accessPolicy: 'إدارة كاملة',
    sessionDuration: '8 ساعات',
    paymentMethod: 'محفظة رقمية',
    dataSync: 'تزامن تلقائي',
    bannerTitle: 'عرض خاص لطلاب وموظفي زهراء أكتوبر',
    bannerDescription: 'خصم 30% على اشتراكات النقل والرحلات الدراسية، مع شحن ذكي للمحفظة ودعم مباشر عبر المنصة.',
    bannerButtonText: 'تفعيل العرض',
    bannerButtonLink: 'subscriptions.html',
    bannerImage: 'https://images.unsplash.com/photo-1552664730-cfec5f28eb9b?auto=format&fit=crop&w=1200&q=80',
    services: ['النقل الحضري', 'المشاوير الخاصة', 'الدليفري وشراء السلع', 'الخدمات المنزلية', 'المتاجر المحلية', 'المدارس والحضانات والأندية'],
    stores: ['متجر السوبر ماركت', 'متجر الخضار', 'متجر المواد'],
    vehicleTypes: ['حافلة', 'ميكروباس', 'عربيه كيوتا'],
    routes: ['خط اللوتس', 'خط الفيروز', 'خط الزهور']
  };

  const saved = JSON.parse(localStorage.getItem('zahraaPlatformSettings') || '{}');
  const data = Object.assign({}, defaults, saved);

  const applyBannerSettings = () => {
    const bannerTitle = document.getElementById('bannerTitle');
    const bannerDescription = document.getElementById('bannerDescription');
    const bannerButtonText = document.getElementById('bannerButtonText');
    const bannerButton = document.getElementById('bannerButton');
    const bannerImage = document.getElementById('bannerImage');

    if (bannerTitle && data.bannerTitle) bannerTitle.textContent = data.bannerTitle;
    if (bannerDescription && data.bannerDescription) bannerDescription.textContent = data.bannerDescription;
    if (bannerButtonText && data.bannerButtonText) bannerButtonText.textContent = data.bannerButtonText;
    if (bannerButton && data.bannerButtonLink) bannerButton.setAttribute('href', data.bannerButtonLink);
    if (bannerImage && data.bannerImage) bannerImage.setAttribute('src', data.bannerImage);
  };

  const applySettings = () => {
    const platformName = data.platformName || defaults.platformName;
    const cityName = data.cityName || defaults.cityName;

    document.querySelectorAll('[data-setting="platformName"]').forEach(node => {
      node.textContent = platformName;
    });

    document.querySelectorAll('[data-setting="cityName"]').forEach(node => {
      node.textContent = cityName;
    });

    const logo = document.querySelector('.logo span');
    if (logo) logo.textContent = platformName.replace('منصة ', '');
  };

  applySettings();
  applyBannerSettings();

  activateCards();
  captureForms();

  const walletTopupForm = document.getElementById('walletTopupForm');
  if (walletTopupForm) {
    const balanceNode = document.getElementById('walletBalance');
    const amountNode = document.getElementById('customAmount');
    const paymentNode = document.getElementById('walletPaymentMethod');

    const loadWalletBalance = () => {
      const savedBalance = Number(localStorage.getItem('zahraaWalletBalance') || 185);
      return isNaN(savedBalance) ? 185 : savedBalance;
    };

    const updateWalletBalance = (balance) => {
      if (balanceNode) balanceNode.innerHTML = `${balance.toFixed(2)} <span style="font-size: 1rem; color: #FFF;">ج.م</span>`;
    };

    const initialBalance = loadWalletBalance();
    updateWalletBalance(initialBalance);

    walletTopupForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const amount = Number(amountNode.value || 0);
      const method = paymentNode.value || 'visa';

      if (!amount || amount < 10) {
        alert('يرجى إدخال مبلغ صحيح لمبلغ الشحن');
        return;
      }

      const currentBalance = loadWalletBalance();
      const nextBalance = currentBalance + amount;
      localStorage.setItem('zahraaWalletBalance', String(nextBalance));
      updateWalletBalance(nextBalance);
      alert(`تم شحن المحفظة بنجاح عبر ${method} بمبلغ ${amount} ج.م`);
      walletTopupForm.reset();
    });
  }

  const settingsPage = document.body.getAttribute('data-page') || '';
  if (settingsPage === 'settings') {
    const settings = {
      platformName: document.getElementById('platformName'),
      cityName: document.getElementById('cityName'),
      supportPhone: document.getElementById('supportPhone'),
      supportEmail: document.getElementById('supportEmail'),
      mapCenter: document.getElementById('mapCenter'),
      serviceType: document.getElementById('serviceType'),
      serviceAreas: document.getElementById('serviceAreas'),
      accessPolicy: document.getElementById('AccessPolicy'),
      sessionDuration: document.getElementById('sessionDuration'),
      paymentMethod: document.getElementById('paymentMethod'),
      dataSync: document.getElementById('dataSync'),
      bannerTitle: document.getElementById('bannerTitle'),
      bannerDescription: document.getElementById('bannerDescription'),
      bannerButtonText: document.getElementById('bannerButtonText'),
      bannerButtonLink: document.getElementById('bannerButtonLink'),
      bannerImage: document.getElementById('bannerImage'),
      bannerImageUpload: document.getElementById('bannerImageUpload')
    };

    const fileToDataUrl = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const saveSettings = () => {
      const settingsData = {
        platformName: settings.platformName.value,
        cityName: settings.cityName.value,
        supportPhone: settings.supportPhone.value,
        supportEmail: settings.supportEmail.value,
        mapCenter: settings.mapCenter.value,
        serviceType: settings.serviceType.value,
        serviceAreas: settings.serviceAreas.value,
        accessPolicy: settings.accessPolicy.value,
        sessionDuration: settings.sessionDuration.value,
        paymentMethod: settings.paymentMethod.value,
        dataSync: settings.dataSync.value,
        bannerTitle: settings.bannerTitle.value,
        bannerDescription: settings.bannerDescription.value,
        bannerButtonText: settings.bannerButtonText.value,
        bannerButtonLink: settings.bannerButtonLink.value,
        bannerImage: settings.bannerImage.value || defaults.bannerImage,
        services: loadedServices(),
        stores: loadedStores(),
        vehicleTypes: loadedVehicleTypes(),
        routes: loadedRoutes()
      };

      localStorage.setItem('zahraaPlatformSettings', JSON.stringify(settingsData));
      alert('تم حفظ إعدادات النظام بنجاح');
      window.location.reload();
    };

    const restoreDefaults = () => {
      settings.platformName.value = defaults.platformName;
      settings.cityName.value = defaults.cityName;
      settings.supportPhone.value = defaults.supportPhone;
      settings.supportEmail.value = defaults.supportEmail;
      settings.mapCenter.value = defaults.mapCenter;
      settings.serviceType.value = defaults.serviceType;
      settings.serviceAreas.value = defaults.serviceAreas;
      settings.accessPolicy.value = defaults.accessPolicy;
      settings.sessionDuration.value = defaults.sessionDuration;
      settings.paymentMethod.value = defaults.paymentMethod;
      settings.dataSync.value = defaults.dataSync;
      settings.bannerTitle.value = defaults.bannerTitle;
      settings.bannerDescription.value = defaults.bannerDescription;
      settings.bannerButtonText.value = defaults.bannerButtonText;
      settings.bannerButtonLink.value = defaults.bannerButtonLink;
      settings.bannerImage.value = defaults.bannerImage;
      localStorage.setItem('zahraaPlatformSettings', JSON.stringify(defaults));
      alert('تمت إعادة إعدادات النظام إلى القيم الافتراضية');
      window.location.reload();
    };

    const loadedServices = () => {
      const list = document.getElementById('serviceList');
      const records = [];
      list.querySelectorAll('li').forEach(item => {
        const name = item.getAttribute('data-name');
        if (name) records.push(name);
      });
      return records;
    };

    const loadedStores = () => {
      const list = document.getElementById('storeList');
      const records = [];
      list.querySelectorAll('li').forEach(item => {
        const name = item.getAttribute('data-name');
        if (name) records.push(name);
      });
      return records;
    };

    const loadedVehicleTypes = () => {
      const list = document.getElementById('vehicleTypeList');
      const records = [];
      list.querySelectorAll('li').forEach(item => {
        const name = item.getAttribute('data-name');
        if (name) records.push(name);
      });
      return records;
    };

    const loadedRoutes = () => {
      const list = document.getElementById('routeList');
      const records = [];
      list.querySelectorAll('li').forEach(item => {
        const name = item.getAttribute('data-name');
        if (name) records.push(name);
      });
      return records;
    };

    const loadedSettings = JSON.parse(localStorage.getItem('zahraaPlatformSettings') || '{}');
    if (loadedSettings.platformName) {
      settings.platformName.value = loadedSettings.platformName;
      settings.cityName.value = loadedSettings.cityName || defaults.cityName;
      settings.supportPhone.value = loadedSettings.supportPhone || defaults.supportPhone;
      settings.supportEmail.value = loadedSettings.supportEmail || defaults.supportEmail;
      settings.mapCenter.value = loadedSettings.mapCenter || defaults.mapCenter;
      settings.serviceType.value = loadedSettings.serviceType || defaults.serviceType;
      settings.serviceAreas.value = loadedSettings.serviceAreas || defaults.serviceAreas;
      settings.accessPolicy.value = loadedSettings.accessPolicy || defaults.accessPolicy;
      settings.sessionDuration.value = loadedSettings.sessionDuration || defaults.sessionDuration;
      settings.paymentMethod.value = loadedSettings.paymentMethod || defaults.paymentMethod;
      settings.dataSync.value = loadedSettings.dataSync || defaults.dataSync;
      settings.bannerTitle.value = loadedSettings.bannerTitle || defaults.bannerTitle;
      settings.bannerDescription.value = loadedSettings.bannerDescription || defaults.bannerDescription;
      settings.bannerButtonText.value = loadedSettings.bannerButtonText || defaults.bannerButtonText;
      settings.bannerButtonLink.value = loadedSettings.bannerButtonLink || defaults.bannerButtonLink;
      settings.bannerImage.value = loadedSettings.bannerImage || defaults.bannerImage;
    }

    if (settings.bannerImageUpload) {
      settings.bannerImageUpload.addEventListener('change', async function () {
        const file = this.files && this.files[0];
        if (!file) return;

        try {
          const imageData = await fileToDataUrl(file);
          settings.bannerImage.value = imageData;
          alert('تم اختيار صورة البانر بنجاح');
        } catch (error) {
          alert('تعذر تحميل صورة البانر');
        }
      });
    }

    const renderLists = () => {
      const serviceList = document.getElementById('serviceList');
      const storeList = document.getElementById('storeList');
      const vehicleTypeList = document.getElementById('vehicleTypeList');
      const routeList = document.getElementById('routeList');

      const settingsData = JSON.parse(localStorage.getItem('zahraaPlatformSettings') || '{}');
      const services = settingsData.services || defaults.services;
      const stores = settingsData.stores || defaults.stores;
      const vehicleTypes = settingsData.vehicleTypes || defaults.vehicleTypes;
      const routes = settingsData.routes || defaults.routes;

      serviceList.innerHTML = services.map(item => `<li data-name="${item}"><span>${item}</span><i class="ri-service-line"></i></li>`).join('');
      storeList.innerHTML = stores.map(item => `<li data-name="${item}"><span>${item}</span><i class="ri-store-2-line"></i></li>`).join('');
      vehicleTypeList.innerHTML = vehicleTypes.map(item => `<li data-name="${item}"><span>${item}</span><i class="ri-bus-fill"></i></li>`).join('');
      routeList.innerHTML = routes.map(item => `<li data-name="${item}"><span>${item}</span><i class="ri-route-line"></i></li>`).join('');
    };

    const addService = () => {
      const input = document.getElementById('newServiceName');
      if (!input.value.trim()) return;

      const list = JSON.parse(localStorage.getItem('zahraaPlatformSettings') || '{}');
      const services = list.services || defaults.services;
      services.push(input.value.trim());
      list.services = services;
      localStorage.setItem('zahraaPlatformSettings', JSON.stringify(list));
      input.value = '';
      renderLists();
    };

    const addStore = () => {
      const input = document.getElementById('newStoreName');
      if (!input.value.trim()) return;

      const list = JSON.parse(localStorage.getItem('zahraaPlatformSettings') || '{}');
      const stores = list.stores || defaults.stores;
      stores.push(input.value.trim());
      list.stores = stores;
      localStorage.setItem('zahraaPlatformSettings', JSON.stringify(list));
      input.value = '';
      renderLists();
    };

    const addVehicleType = () => {
      const input = document.getElementById('newVehicleType');
      if (!input.value.trim()) return;

      const list = JSON.parse(localStorage.getItem('zahraaPlatformSettings') || '{}');
      const vehicleTypes = list.vehicleTypes || defaults.vehicleTypes;
      vehicleTypes.push(input.value.trim());
      list.vehicleTypes = vehicleTypes;
      localStorage.setItem('zahraaPlatformSettings', JSON.stringify(list));
      input.value = '';
      renderLists();
    };

    const addRoute = () => {
      const name = document.getElementById('newRouteName').value.trim();
      const stations = document.getElementById('newRouteStations').value.trim();
      if (!name) return;

      const list = JSON.parse(localStorage.getItem('zahraaPlatformSettings') || '{}');
      const routes = list.routes || defaults.routes;
      routes.push(name + (stations ? ` (${stations})` : ''));
      list.routes = routes;
      localStorage.setItem('zahraaPlatformSettings', JSON.stringify(list));
      document.getElementById('newRouteName').value = '';
      document.getElementById('newRouteStations').value = '';
      renderLists();
    };

    renderLists();

    const saveButton = document.getElementById('saveSettings');
    const resetButton = document.getElementById('resetSettings');
    const addServiceButton = document.getElementById('addService');
    const addStoreButton = document.getElementById('addStore');
    const addVehicleTypeButton = document.getElementById('addVehicleType');
    const addRouteButton = document.getElementById('addRoute');

    if (saveButton) saveButton.addEventListener('click', saveSettings);
    if (resetButton) resetButton.addEventListener('click', restoreDefaults);
    if (addServiceButton) addServiceButton.addEventListener('click', addService);
    if (addStoreButton) addStoreButton.addEventListener('click', addStore);
    if (addVehicleTypeButton) addVehicleTypeButton.addEventListener('click', addVehicleType);
    if (addRouteButton) addRouteButton.addEventListener('click', addRoute);
  }
});
