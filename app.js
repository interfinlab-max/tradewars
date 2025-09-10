// Игровые данные
const gameData = {
  baseState: {
    gdpIdx: 100.0,
    expIdx: 100.0,
    impIdx: 100.0,
    cpi: 2.0,
    unemployment: 5.0
  },
  stepsTotal: 15,
  countries: {
    RU: {
      name: "Россия",
      flag: "🇷🇺",
      specialties: ["энергетика", "сырьё", "IT", "оборонпром"],
      modifiers: { gdpIdx: 0, expIdx: 5, impIdx: -3, cpi: 0.5, unemployment: 1.0 }
    },
    US: {
      name: "США",
      flag: "🇺🇸",
      specialties: ["технологии", "финансы", "энергетика", "агропром"],
      modifiers: { gdpIdx: 10, expIdx: 0, impIdx: 10, cpi: -0.3, unemployment: -0.5 }
    },
    CN: {
      name: "Китай",
      flag: "🇨🇳",
      specialties: ["производство", "экспорт", "технологии", "инфраструктура"],
      modifiers: { gdpIdx: 8, expIdx: 15, impIdx: 5, cpi: 0.2, unemployment: -1.5 }
    },
    DE: {
      name: "Германия",
      flag: "🇩🇪",
      specialties: ["автопром", "машиностроение", "химия", "экспорт"],
      modifiers: { gdpIdx: 5, expIdx: 8, impIdx: 3, cpi: -0.5, unemployment: -1.0 }
    },
    JP: {
      name: "Япония",
      flag: "🇯🇵",
      specialties: ["технологии", "автопром", "робототехника", "точное машиностроение"],
      modifiers: { gdpIdx: 3, expIdx: 5, impIdx: 8, cpi: -0.8, unemployment: -0.3 }
    },
    BR: {
      name: "Бразилия",
      flag: "🇧🇷",
      specialties: ["агропром", "сырьё", "энергетика", "металлургия"],
      modifiers: { gdpIdx: -2, expIdx: 3, impIdx: -5, cpi: 1.5, unemployment: 2.0 }
    }
  },
  trustWeights: {
    "переговоры": 8, "право": 7, "открытость": 7, "диверсификация": 6, "устойчивость": 5, 
    "субсидии": 2, "дипломатия": 6, "многосторонность": 7, "инновации": 5,
    "санкции": -6, "техконтроль": -5, "эскалация": -8, "квоты": -6, "протекционизм": -7, 
    "тарифы": -4, "изоляция": -9, "односторонность": -6, "автаркия": -8
  }
};

// Расширенная коллекция сценариев (67 общих + специфичные для каждой страны)
const scenarios = {
  general: [
    {
      id: "steel-dumping", text: "Демпинг стали давит на отрасль. Что делаем?",
      choices: [
        { id: "high-tariff", icon: "fa-solid fa-industry", label: "Высокие тарифы (нацбезопасность)", 
          hint: "Быстрая защита → риск ответных мер", effect: { gdp: -1.3, exp: -1.9, imp: -2.5, cpi: 0.3, unemployment: -0.5 }, 
          tags: ["тарифы", "эскалация"], history: "США в 2018 ввели «232» пошлины; часть партнёров ответила." },
        { id: "anti-dumping", icon: "fa-solid fa-scale-balanced", label: "Антидемпинговые меры (точечно)", 
          hint: "Следуем процедурам и таргетируем", effect: { gdp: 0.3, exp: -0.4, imp: -1.0, cpi: 0.1, unemployment: -0.2 }, 
          tags: ["право"], history: "ЕС применяет антидемпинг к стали — защита без подорожания." },
        { id: "wait-see", icon: "fa-regular fa-clock", label: "Выжидать", 
          hint: "Цены низкие, но отрасль страдает", effect: { gdp: -0.6, exp: 0.0, imp: 1.5, cpi: -0.2, unemployment: 0.8 }, 
          tags: ["выжидание"], history: "Игнорирование демпинга → падение загрузки/зависимость от импорта." }
      ]
    },
    {
      id: "sanctions-tech", text: "Союзники обсуждают ограничения на высокие технологии. Поддержать жёсткий пакет?",
      choices: [
        { id: "full-controls", icon: "fa-solid fa-microchip", label: "Строгие техконтроли", 
          hint: "Удар по оборудованию/ПО", effect: { gdp: -0.5, exp: -1.0, imp: -0.8, cpi: 0.2, unemployment: 0.3 }, 
          tags: ["санкции", "техконтроль"], history: "Ограничения 2022–2023 снижали экспорт и усложняли сервис." },
        { id: "partial-controls", icon: "fa-solid fa-sliders", label: "Точечные контролы", 
          hint: "Сужаем до ВПК", effect: { gdp: 0.1, exp: -0.3, imp: -0.2, cpi: 0.1, unemployment: 0.0 }, 
          tags: ["право", "техконтроль"], history: "Избирательный подход снижает побочный ущерб." }
      ]
    },
    {
      id: "energy-crisis", text: "Энергетический кризис: цены на газ выросли в 3 раза. Ваши действия?",
      choices: [
        { id: "subsidies-energy", icon: "fa-solid fa-fire", label: "Субсидировать энергию", 
          hint: "Поддержка бизнеса и населения", effect: { gdp: 0.8, exp: 0.5, imp: 2.0, cpi: -0.5, unemployment: -1.2 }, 
          tags: ["субсидии"], history: "Европа в 2022 субсидировала энергию на сотни млрд евро." },
        { id: "market-forces", icon: "fa-solid fa-chart-line", label: "Позволить рынку адаптироваться", 
          hint: "Высокие цены стимулируют экономию", effect: { gdp: -2.1, exp: -1.5, imp: -0.5, cpi: 1.8, unemployment: 2.5 }, 
          tags: ["открытость"], history: "Свободный рынок ведет к болезненной, но эффективной адаптации." },
        { id: "strategic-reserves", icon: "fa-solid fa-warehouse", label: "Использовать стратегические резервы", 
          hint: "Краткосрочное решение", effect: { gdp: 0.3, exp: 0.0, imp: 0.5, cpi: -0.8, unemployment: -0.3 }, 
          tags: ["устойчивость"], history: "США и ЕС использовали резервы для стабилизации цен." }
      ]
    },
    {
      id: "trade-war", text: "Торговая война эскалирует: партнёр угрожает пошлинами на $200 млрд товаров.",
      choices: [
        { id: "retaliate", icon: "fa-solid fa-fist-raised", label: "Симметричный ответ", 
          hint: "Око за око", effect: { gdp: -1.8, exp: -2.3, imp: -1.7, cpi: 0.9, unemployment: 1.4 }, 
          tags: ["эскалация", "тарифы"], history: "Торговая война США-Китай 2018-2020 привела к взаимным потерям." },
        { id: "negotiate", icon: "fa-solid fa-handshake", label: "Предложить переговоры", 
          hint: "Поиск компромисса", effect: { gdp: 0.4, exp: 0.8, imp: 0.6, cpi: -0.2, unemployment: -0.5 }, 
          tags: ["переговоры", "открытость"], history: "Дипломатические решения часто предпочтительнее эскалации." }
      ]
    },
    {
      id: "wto-dispute", text: "В ВТО подана жалоба на наши субсидии. Как реагировать?",
      choices: [
        { id: "defend-subsidies", icon: "fa-solid fa-shield", label: "Защищать субсидии", 
          hint: "Национальные интересы важнее", effect: { gdp: 0.5, exp: 0.8, imp: -0.3, cpi: 0.2, unemployment: -0.8 }, 
          tags: ["протекционизм"], history: "Многие страны защищают свои промышленные субсидии в ВТО." },
        { id: "comply-wto", icon: "fa-solid fa-balance-scale", label: "Соблюдать правила ВТО", 
          hint: "Международное право превыше всего", effect: { gdp: -0.8, exp: -0.5, imp: 0.5, cpi: -0.1, unemployment: 1.2 }, 
          tags: ["право", "открытость"], history: "Соблюдение правил ВТО укрепляют доверие к торговой системе." }
      ]
    },
    {
      id: "supply-chain-crisis", text: "Глобальный кризис цепочек поставок. Заводы простаивают из-за нехватки компонентов.",
      choices: [
        { id: "onshoring", icon: "fa-solid fa-home", label: "Стимулировать решоринг", 
          hint: "Возвращаем производство домой", effect: { gdp: -1.2, exp: -0.8, imp: -3.5, cpi: 1.5, unemployment: -1.8 }, 
          tags: ["устойчивость", "субсидии"], history: "COVID-19 заставил пересмотреть зависимость от Азии." },
        { id: "diversify-suppliers", icon: "fa-solid fa-network-wired", label: "Диверсифицировать поставщиков", 
          hint: "Снижаем риски через разнообразие", effect: { gdp: 0.5, exp: 1.2, imp: 0.8, cpi: 0.3, unemployment: -0.4 }, 
          tags: ["диверсификация", "открытость"], history: "\"Китай+1\" стратегия снижает зависимость от одного поставщика." }
      ]
    },
    {
      id: "digital-services-tax", text: "ЕС требует налог на цифровые услуги технологических гигантов. Поддержать?",
      choices: [
        { id: "support-dst", icon: "fa-solid fa-laptop-code", label: "Поддержать цифровой налог", 
          hint: "Справедливое налогообложение", effect: { gdp: -0.3, exp: -0.8, imp: 0.2, cpi: 0.1, unemployment: 0.1 }, 
          tags: ["право", "многосторонность"], history: "Франция первой ввела налог на цифровые услуги в 2019." },
        { id: "oppose-dst", icon: "fa-solid fa-times-circle", label: "Противостоять налогу", 
          hint: "Защищаем технологический сектор", effect: { gdp: 0.8, exp: 1.5, imp: -0.1, cpi: -0.2, unemployment: -0.4 }, 
          tags: ["протекционизм"], history: "США угрожали пошлинами странам, вводящим цифровые налоги." }
      ]
    }
  ],
  specific: {
    RU: [
      {
        id: "oil-price-shock-ru", text: "🇷🇺 Цены на нефть упали на 40%. Как поддержать экономику?", country: "RU",
        choices: [
          { id: "devalue-ruble", icon: "fa-solid fa-ruble-sign", label: "Ослабить рубль для конкурентоспособности", 
            hint: "Девальвация поможет экспорту", effect: { gdp: 0.5, exp: 2.0, imp: -1.5, cpi: 1.0, unemployment: -0.3 }, 
            tags: ["девальвация"], history: "Россия использовала девальвацию в 2014-2015 для адаптации к санкциям." },
          { id: "reserve-fund", icon: "fa-solid fa-piggy-bank", label: "Использовать Фонд национального благосостояния", 
            hint: "Потратить резервы на стимулы", effect: { gdp: 1.2, exp: 0.3, imp: 0.5, cpi: 0.8, unemployment: -1.5 }, 
            tags: ["субсидии", "устойчивость"], history: "ФНБ создан именно для поддержки экономики в кризисные периоды." }
        ]
      }
    ],
    US: [
      {
        id: "tech-antitrust-us", text: "🇺🇸 Антимонопольное дело против техногигантов. Разбивать компании?", country: "US",
        choices: [
          { id: "break-up-tech", icon: "fa-solid fa-hammer", label: "Разделить крупные IT-компании", 
            hint: "Восстановить конкуренцию", effect: { gdp: -1.2, exp: -0.8, imp: 0.3, cpi: 0.4, unemployment: 0.8 }, 
            tags: ["право"], history: "Разделение AT&T в 1982 стимулировало конкуренцию в телекоме." },
          { id: "regulate-not-break", icon: "fa-solid fa-balance-scale", label: "Усилить регулирование без разделения", 
            hint: "Контроль без разрушения", effect: { gdp: 0.5, exp: 0.2, imp: 0.1, cpi: 0.1, unemployment: -0.2 }, 
            tags: ["право"], history: "ЕС выбрал путь регулирования через GDPR и DMA." }
        ]
      }
    ],
    CN: [
      {
        id: "belt-road-expansion-cn", text: "🇨🇳 Инициатива \"Пояс и путь\" требует новых инвестиций. Расширять?", country: "CN",
        choices: [
          { id: "expand-bri", icon: "fa-solid fa-road", label: "Увеличить инвестиции в BRI", 
            hint: "Глобальное влияние", effect: { gdp: -1.5, exp: 3.0, imp: 0.5, cpi: 0.8, unemployment: -2.5 }, 
            tags: ["многосторонность"], history: "BRI связала 140+ стран, создав новые торговые маршруты." },
          { id: "focus-domestic", icon: "fa-solid fa-home", label: "Сосредоточиться на внутреннем рынке", 
            hint: "Двойная циркуляция", effect: { gdp: 1.8, exp: -0.8, imp: 1.2, cpi: -0.3, unemployment: -1.8 }, 
            tags: ["устойчивость"], history: "Стратегия двойной циркуляции снижает зависимость от экспорта." }
        ]
      }
    ],
    DE: [
      {
        id: "auto-industry-transition-de", text: "🇩🇪 Переход к электромобилям угрожает автопрому. Поддержать трансформацию?", country: "DE",
        choices: [
          { id: "ev-subsidies", icon: "fa-solid fa-car-battery", label: "Субсидии на электромобили", 
            hint: "Поддержка перехода", effect: { gdp: -0.8, exp: 2.5, imp: 1.0, cpi: 0.5, unemployment: -2.0 }, 
            tags: ["субсидии", "инновации"], history: "Германия инвестировала миллиарды в переход к электромобилям." },
          { id: "protect-ice", icon: "fa-solid fa-engine", label: "Защитить двигатели внутреннего сгорания", 
            hint: "Сохранение традиций", effect: { gdp: 0.5, exp: -1.2, imp: -0.5, cpi: -0.2, unemployment: 1.5 }, 
            tags: ["протекционизм"], history: "Германия лоббировала исключения для синтетических топлив в ЕС." }
        ]
      }
    ],
    JP: [
      {
        id: "aging-society-jp", text: "🇯🇵 Стареющее общество требует больше рабочих. Открыть иммиграцию?", country: "JP",
        choices: [
          { id: "open-immigration", icon: "fa-solid fa-users", label: "Расширить трудовую иммиграцию", 
            hint: "Решение демографической проблемы", effect: { gdp: 2.0, exp: 1.0, imp: 1.5, cpi: 0.8, unemployment: -3.0 }, 
            tags: ["открытость"], history: "Япония медленно открывает двери для квалифицированных мигрантов." },
          { id: "automation-focus", icon: "fa-solid fa-robot", label: "Инвестировать в автоматизацию", 
            hint: "Технологическое решение", effect: { gdp: -1.0, exp: 2.5, imp: 0.8, cpi: -0.3, unemployment: 1.5 }, 
            tags: ["инновации"], history: "Япония лидирует в промышленной робототехнике." }
        ]
      }
    ],
    BR: [
      {
        id: "amazon-deforestation-br", text: "🇧🇷 ЕС угрожает блокировать импорт из-за вырубки Амазонии. Как реагировать?", country: "BR",
        choices: [
          { id: "environmental-measures", icon: "fa-solid fa-tree", label: "Усилить защиту окружающей среды", 
            hint: "Экологическая ответственность", effect: { gdp: -1.5, exp: -0.8, imp: 0.5, cpi: 0.8, unemployment: 1.8 }, 
            tags: ["устойчивость"], history: "Бразилия под давлением усилила контроль за вырубкой леса." },
          { id: "sovereignty-defense", icon: "fa-solid fa-flag", label: "Отстаивать национальный суверенитет", 
            hint: "Внутренние дела", effect: { gdp: 0.8, exp: -2.0, imp: -0.8, cpi: -0.2, unemployment: -0.5 }, 
            tags: ["односторонность"], history: "Бразилия отвергает внешнее вмешательство в политику Амазонии." }
        ]
      }
    ]
  }
};

// Состояние игры
let gameState = {
  currentScreen: 'start',
  selectedCountry: null,
  gameMode: 'normal',
  currentTurn: 0,
  currentScenario: null,
  selectedChoice: null,
  economicState: { ...gameData.baseState },
  trust: 50,
  history: [],
  charts: {},
  usedScenarios: []
};

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM загружен, инициализация игры...');
  initializeGame();
});

function initializeGame() {
  renderCountries();
  setupEventListeners();
  showScreen('start');
  console.log('Игра инициализирована');
}

function renderCountries() {
  const countriesGrid = document.getElementById('countriesGrid');
  if (!countriesGrid) {
    console.error('Элемент countriesGrid не найден');
    return;
  }
  
  countriesGrid.innerHTML = '';
  
  Object.entries(gameData.countries).forEach(([code, country]) => {
    const countryCard = document.createElement('div');
    countryCard.className = 'country-card';
    countryCard.setAttribute('data-country', code);
    
    countryCard.innerHTML = `
      <div class="country-flag">${country.flag}</div>
      <div class="country-name">${country.name}</div>
      <div class="country-specialties">${country.specialties.join(', ')}</div>
    `;
    
    // Добавляем обработчик события click
    countryCard.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Клик по стране:', code, country.name);
      selectCountry(code);
    });
    
    countriesGrid.appendChild(countryCard);
  });
  
  console.log('Карточки стран созданы:', Object.keys(gameData.countries).length);
}

function selectCountry(countryCode) {
  console.log('Выбираем страну:', countryCode);
  
  // Убираем выделение со всех карточек
  document.querySelectorAll('.country-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Выделяем выбранную карточку
  const selectedCard = document.querySelector(`[data-country="${countryCode}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
    console.log('Карточка выделена:', countryCode);
  } else {
    console.error('Карточка не найдена:', countryCode);
  }
  
  // Обновляем состояние
  gameState.selectedCountry = countryCode;
  console.log('Состояние обновлено, выбранная страна:', gameState.selectedCountry);
  
  updateStartButton();
}

function updateStartButton() {
  const startBtn = document.getElementById('startGameBtn');
  const selectedMode = document.querySelector('input[name="gameMode"]:checked');
  
  console.log('Обновление кнопки старта:', {
    hasStartBtn: !!startBtn,
    selectedCountry: gameState.selectedCountry,
    selectedMode: selectedMode ? selectedMode.value : null
  });
  
  if (startBtn && gameState.selectedCountry && selectedMode) {
    startBtn.disabled = false;
    gameState.gameMode = selectedMode.value;
    console.log('Кнопка старта активирована, режим:', gameState.gameMode);
  } else if (startBtn) {
    startBtn.disabled = true;
    console.log('Кнопка старта деактивирована');
  }
}

function setupEventListeners() {
  console.log('Настройка обработчиков событий...');
  
  // Кнопка старта
  const startBtn = document.getElementById('startGameBtn');
  if (startBtn) {
    startBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Клик по кнопке старта');
      console.log('Текущее состояние:', {
        selectedCountry: gameState.selectedCountry,
        gameMode: gameState.gameMode,
        disabled: startBtn.disabled
      });
      
      if (gameState.selectedCountry && gameState.gameMode && !startBtn.disabled) {
        console.log('Запуск игры...');
        startGame();
      } else {
        console.log('Игра не может быть запущена - не все условия выполнены');
      }
    });
    console.log('Обработчик кнопки старта установлен');
  } else {
    console.error('Кнопка старта не найдена');
  }
  
  // Радио кнопки режима игры
  const radioButtons = document.querySelectorAll('input[name="gameMode"]');
  console.log('Найдено радио кнопок:', radioButtons.length);
  
  radioButtons.forEach((radio, index) => {
    radio.addEventListener('change', function(e) {
      console.log('Изменение режима игры:', e.target.value);
      gameState.gameMode = e.target.value;
      updateStartButton();
    });
    
    // Также добавляем обработчик клика
    radio.addEventListener('click', function(e) {
      console.log('Клик по радио кнопке:', e.target.value);
      gameState.gameMode = e.target.value;
      updateStartButton();
    });
    
    console.log(`Обработчик для радио кнопки ${index} (${radio.value}) установлен`);
  });
  
  // Кнопка следующего хода
  const nextBtn = document.getElementById('nextTurnBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      console.log('Клик по кнопке следующего хода');
      nextTurn();
    });
    console.log('Обработчик кнопки следующего хода установлен');
  }
  
  // Кнопки результатов
  const newGameBtn = document.getElementById('newGameBtn');
  if (newGameBtn) {
    newGameBtn.addEventListener('click', function() {
      console.log('Клик по кнопке новой игры');
      newGame();
    });
    console.log('Обработчик кнопки новой игры установлен');
  }
  
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      console.log('Клик по кнопке экспорта');
      exportResults();
    });
    console.log('Обработчик кнопки экспорта установлен');
  }
  
  console.log('Все обработчики событий настроены');
}

function startGame() {
  console.log('Запуск игры для страны:', gameState.selectedCountry);
  
  // Сбрасываем состояние
  gameState.economicState = { ...gameData.baseState };
  gameState.trust = 50;
  gameState.history = [];
  gameState.usedScenarios = [];
  gameState.currentTurn = 1;
  
  // Применяем модификаторы выбранной страны
  const countryModifiers = gameData.countries[gameState.selectedCountry].modifiers;
  Object.keys(countryModifiers).forEach(key => {
    gameState.economicState[key] += countryModifiers[key];
  });
  
  const country = gameData.countries[gameState.selectedCountry];
  const countryHeader = document.getElementById('selectedCountryName');
  if (countryHeader) {
    countryHeader.textContent = `${country.flag} ${country.name}`;
  }
  
  console.log('Переход на игровой экран');
  showScreen('game');
  initializeCharts();
  updateGameDisplay();
  loadNextScenario();
}

function showScreen(screenName) {
  console.log('Переключение на экран:', screenName);
  
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  const targetScreen = document.getElementById(screenName + 'Screen');
  if (targetScreen) {
    targetScreen.classList.add('active');
    gameState.currentScreen = screenName;
    console.log('Экран активирован:', screenName);
  } else {
    console.error('Экран не найден:', screenName + 'Screen');
  }
}

function loadNextScenario() {
  console.log('Загрузка сценария для хода:', gameState.currentTurn);
  
  // Умная система выбора: 67% общих, 33% специфичных
  let availableScenarios = [];
  const countrySpecific = scenarios.specific[gameState.selectedCountry] || [];
  
  if (countrySpecific.length > 0 && Math.random() < 0.33) {
    availableScenarios = countrySpecific.filter(scenario => 
      !gameState.usedScenarios.includes(scenario.id));
    console.log('Используем специфичные сценарии для страны');
  }
  
  if (availableScenarios.length === 0) {
    availableScenarios = scenarios.general.filter(scenario => 
      !gameState.usedScenarios.includes(scenario.id));
    console.log('Используем общие сценарии');
  }
  
  // Если все сценарии использованы, сбрасываем
  if (availableScenarios.length === 0) {
    gameState.usedScenarios = [];
    availableScenarios = [...scenarios.general];
    console.log('Сброс использованных сценариев');
  }
  
  const randomScenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
  gameState.currentScenario = randomScenario;
  gameState.usedScenarios.push(randomScenario.id);
  gameState.selectedChoice = null;
  
  console.log('Выбран сценарий:', randomScenario.id);
  
  renderScenario();
}

function renderScenario() {
  const scenarioTitle = document.getElementById('scenarioTitle');
  const scenarioText = document.getElementById('scenarioText');
  const scenarioType = document.getElementById('scenarioType');
  const scenarioCounter = document.getElementById('scenarioCounter');
  
  if (scenarioTitle) {
    scenarioTitle.innerHTML = `<i class="fas fa-scroll"></i> Сценарий ${gameState.currentTurn}`;
  }
  
  if (scenarioText) {
    scenarioText.textContent = gameState.currentScenario.text;
  }
  
  if (scenarioType) {
    const isSpecific = gameState.currentScenario.country;
    scenarioType.textContent = isSpecific ? 'Специфичный для страны' : 'Общий сценарий';
  }
  
  if (scenarioCounter) {
    scenarioCounter.textContent = `Сценарий ${gameState.usedScenarios.length} из доступных`;
  }
  
  const choicesContainer = document.getElementById('choicesContainer');
  if (!choicesContainer) {
    console.error('Контейнер выборов не найден');
    return;
  }
  
  choicesContainer.innerHTML = '';
  
  gameState.currentScenario.choices.forEach((choice) => {
    const choiceCard = document.createElement('div');
    choiceCard.className = 'choice-card';
    choiceCard.setAttribute('data-choice', choice.id);
    
    choiceCard.innerHTML = `
      <div class="choice-header">
        <i class="${choice.icon}"></i>
        <h3>${choice.label}</h3>
      </div>
      <p class="choice-hint">${choice.hint}</p>
    `;
    
    choiceCard.addEventListener('click', function() {
      selectChoice(choice);
    });
    
    choicesContainer.appendChild(choiceCard);
  });
  
  document.getElementById('effectsPanel').style.display = 'none';
  
  console.log('Сценарий отрендерен, выборов:', gameState.currentScenario.choices.length);
}

function selectChoice(choice) {
  console.log('Выбрано действие:', choice.label);
  
  document.querySelectorAll('.choice-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  const selectedCard = document.querySelector(`[data-choice="${choice.id}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }
  
  gameState.selectedChoice = choice;
  showEffects(choice);
}

function showEffects(choice) {
  const effectsPanel = document.getElementById('effectsPanel');
  const effectsGrid = document.getElementById('effectsGrid');
  const historicalText = document.getElementById('historicalText');
  const nextBtn = document.getElementById('nextTurnBtn');
  
  effectsGrid.innerHTML = '';
  
  if (gameState.gameMode !== 'blind') {
    const effects = gameState.gameMode === 'hard' ? 
      multiplyEffects(choice.effect, 1.5) : choice.effect;
    
    const labels = {
      gdp: 'ВВП',
      exp: 'Экспорт',
      imp: 'Импорт',
      cpi: 'Инфляция',
      unemployment: 'Безработица'
    };
    
    Object.entries(effects).forEach(([key, value]) => {
      const effectItem = document.createElement('div');
      effectItem.className = `effect-item ${value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral'}`;
      
      const sign = value > 0 ? '+' : '';
      const suffix = ['cpi', 'unemployment'].includes(key) ? '%' : '';
      
      effectItem.innerHTML = `
        <div>${labels[key]}</div>
        <div>${sign}${value.toFixed(1)}${suffix}</div>
      `;
      
      effectsGrid.appendChild(effectItem);
    });
  } else {
    const placeholderItem = document.createElement('div');
    placeholderItem.className = 'effect-item neutral';
    placeholderItem.innerHTML = `
      <div>Эффекты скрыты</div>
      <div>???</div>
    `;
    effectsGrid.appendChild(placeholderItem);
  }
  
  historicalText.textContent = choice.history || 'Исторических данных нет.';
  
  effectsPanel.style.display = 'block';
  nextBtn.disabled = false;
}

function multiplyEffects(effects, multiplier) {
  const result = {};
  Object.entries(effects).forEach(([key, value]) => {
    result[key] = value * multiplier;
  });
  return result;
}

function nextTurn() {
  if (!gameState.selectedChoice) return;
  
  console.log('Переход к следующему ходу');
  
  const effects = gameState.gameMode === 'hard' ? 
    multiplyEffects(gameState.selectedChoice.effect, 1.5) : 
    gameState.selectedChoice.effect;
  
  // Применяем эффекты с реалистичными взаимосвязями
  Object.entries(effects).forEach(([key, value]) => {
    if (key === 'gdp') key = 'gdpIdx';
    if (key === 'exp') key = 'expIdx';
    if (key === 'imp') key = 'impIdx';
    
    gameState.economicState[key] += value;
  });
  
  // Ограничиваем значения в реалистичных пределах
  gameState.economicState.gdpIdx = Math.max(20, Math.min(200, gameState.economicState.gdpIdx));
  gameState.economicState.expIdx = Math.max(10, Math.min(300, gameState.economicState.expIdx));
  gameState.economicState.impIdx = Math.max(10, Math.min(300, gameState.economicState.impIdx));
  gameState.economicState.cpi = Math.max(-2, Math.min(25, gameState.economicState.cpi));
  gameState.economicState.unemployment = Math.max(0, Math.min(30, gameState.economicState.unemployment));
  
  updateTrust();
  
  gameState.history.push({
    turn: gameState.currentTurn,
    scenario: gameState.currentScenario.text,
    choice: gameState.selectedChoice.label,
    effects: effects,
    state: { ...gameState.economicState },
    trust: gameState.trust
  });
  
  gameState.currentTurn++;
  
  if (gameState.currentTurn > gameData.stepsTotal) {
    showResults();
  } else {
    updateGameDisplay();
    loadNextScenario();
  }
}

function updateTrust() {
  let trustChange = 0;
  
  // Влияние решений на доверие
  if (gameState.selectedChoice.tags) {
    gameState.selectedChoice.tags.forEach(tag => {
      if (gameData.trustWeights[tag]) {
        trustChange += gameData.trustWeights[tag];
      }
    });
  }
  
  // Штраф за инфляцию
  if (gameState.economicState.cpi > 3.0) {
    trustChange -= (gameState.economicState.cpi - 3.0) * 0.8;
  }
  
  // НОВЫЙ штраф за безработицу
  if (gameState.economicState.unemployment > 7.0) {
    trustChange -= (gameState.economicState.unemployment - 7.0) * 0.3;
  }
  
  gameState.trust = Math.max(0, Math.min(100, gameState.trust + trustChange));
}

function updateGameDisplay() {
  document.getElementById('currentTurn').textContent = gameState.currentTurn;
  document.getElementById('currentPeriod').textContent = 
    `Q${((gameState.currentTurn - 1) % 4) + 1} Год ${Math.ceil(gameState.currentTurn / 4)}`;
  
  const progressPercent = ((gameState.currentTurn - 1) / gameData.stepsTotal) * 100;
  document.getElementById('progressFill').style.width = `${progressPercent}%`;
  
  updateIndicators();
  updateCharts();
}

function updateIndicators() {
  const state = gameState.economicState;
  const base = gameData.baseState;
  
  document.getElementById('gdpValue').textContent = state.gdpIdx.toFixed(1);
  updateIndicatorStyle('gdpIndicator', state.gdpIdx, base.gdpIdx);
  
  document.getElementById('expValue').textContent = state.expIdx.toFixed(1);
  updateIndicatorStyle('expIndicator', state.expIdx, base.expIdx);
  
  document.getElementById('impValue').textContent = state.impIdx.toFixed(1);
  updateIndicatorStyle('impIndicator', state.impIdx, base.impIdx);
  
  document.getElementById('cpiValue').textContent = state.cpi.toFixed(1) + '%';
  updateIndicatorStyle('cpiIndicator', state.cpi, base.cpi, true);
  
  document.getElementById('unemploymentValue').textContent = state.unemployment.toFixed(1) + '%';
  updateIndicatorStyle('unemploymentIndicator', state.unemployment, base.unemployment, true);
  
  document.getElementById('trustValue').textContent = Math.round(gameState.trust);
  updateIndicatorStyle('trustIndicator', gameState.trust, 50);
}

function updateIndicatorStyle(elementId, current, base, inverse = false) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.classList.remove('positive', 'negative');
  
  const isPositive = inverse ? current < base : current > base;
  const isNegative = inverse ? current > base : current < base;
  
  if (Math.abs(current - base) > 0.1) {
    if (isPositive) {
      element.classList.add('positive');
    } else if (isNegative) {
      element.classList.add('negative');
    }
  }
}

function initializeCharts() {
  console.log('Инициализация графиков');
  
  const chartConfigs = [
    { id: 'gdpChart', label: 'ВВП индекс', color: '#1FB8CD', key: 'gdpIdx' },
    { id: 'expChart', label: 'Экспорт индекс', color: '#FFC185', key: 'expIdx' },
    { id: 'impChart', label: 'Импорт индекс', color: '#B4413C', key: 'impIdx' },
    { id: 'cpiChart', label: 'Инфляция (%)', color: '#DB4545', key: 'cpi' },
    { id: 'unemploymentChart', label: 'Безработица (%)', color: '#D2BA4C', key: 'unemployment' }
  ];
  
  chartConfigs.forEach(config => {
    const canvas = document.getElementById(config.id);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    gameState.charts[config.key] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Старт'],
        datasets: [{
          label: config.label,
          data: [gameState.economicState[config.key]],
          borderColor: config.color,
          backgroundColor: config.color + '20',
          borderWidth: 2,
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: config.label,
            color: '#626c71'
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: { color: 'rgba(94, 82, 64, 0.1)' },
            ticks: { color: '#626c71' }
          },
          x: {
            grid: { color: 'rgba(94, 82, 64, 0.1)' },
            ticks: { color: '#626c71' }
          }
        }
      }
    });
  });
}

function updateCharts() {
  const turnLabel = `Ход ${gameState.currentTurn - 1}`;
  
  Object.entries(gameState.charts).forEach(([key, chart]) => {
    if (chart) {
      chart.data.labels.push(turnLabel);
      chart.data.datasets[0].data.push(gameState.economicState[key]);
      chart.update('none');
    }
  });
}

function showResults() {
  calculateFinalScore();
  renderResults();
  showScreen('results');
}

function calculateFinalScore() {
  const state = gameState.economicState;
  const base = gameData.baseState;
  
  const changes = {
    gdp: state.gdpIdx - base.gdpIdx,
    exp: state.expIdx - base.expIdx,
    imp: state.impIdx - base.impIdx,
    cpi: state.cpi - base.cpi,
    unemployment: state.unemployment - base.unemployment
  };
  
  let score = 0;
  score += changes.gdp * 2;      // ВВП важнее всего
  score += changes.exp * 1.5;    // Экспорт важен для торговли
  score += changes.imp * 0.5;    // Импорт менее критичен
  score -= changes.cpi * 10;     // Инфляция очень негативна
  score -= changes.unemployment * 8; // Безработица критична
  score += (gameState.trust - 50) * 0.5; // Доверие влияет на итоговую оценку
  
  gameState.finalScore = Math.round(score);
  gameState.changes = changes;
}

function renderResults() {
  const state = gameState.economicState;
  const changes = gameState.changes;
  
  document.getElementById('resultsSubtitle').textContent = 
    `Результаты для ${gameData.countries[gameState.selectedCountry].name}`;
  
  // Обновляем финальные значения
  document.getElementById('finalGdp').textContent = state.gdpIdx.toFixed(1);
  document.getElementById('gdpChange').textContent = formatChange(changes.gdp);
  document.getElementById('gdpChange').className = `change-value ${getChangeClass(changes.gdp)}`;
  
  document.getElementById('finalExp').textContent = state.expIdx.toFixed(1);
  document.getElementById('expChange').textContent = formatChange(changes.exp);
  document.getElementById('expChange').className = `change-value ${getChangeClass(changes.exp)}`;
  
  document.getElementById('finalImp').textContent = state.impIdx.toFixed(1);
  document.getElementById('impChange').textContent = formatChange(changes.imp);
  document.getElementById('impChange').className = `change-value ${getChangeClass(changes.imp)}`;
  
  document.getElementById('finalCpi').textContent = state.cpi.toFixed(1) + '%';
  document.getElementById('cpiChange').textContent = formatChange(changes.cpi, '%');
  document.getElementById('cpiChange').className = `change-value ${getChangeClass(changes.cpi, true)}`;
  
  document.getElementById('finalUnemployment').textContent = state.unemployment.toFixed(1) + '%';
  document.getElementById('unemploymentChange').textContent = formatChange(changes.unemployment, '%');
  document.getElementById('unemploymentChange').className = `change-value ${getChangeClass(changes.unemployment, true)}`;
  
  document.getElementById('finalTrust').textContent = Math.round(gameState.trust);
  document.getElementById('trustExplanation').textContent = getTrustExplanation();
  
  // Обновляем прогресс-бар доверия
  const trustFill = document.getElementById('trustFill');
  if (trustFill) {
    trustFill.style.width = `${gameState.trust}%`;
  }
  
  document.getElementById('finalScore').textContent = gameState.finalScore;
  document.getElementById('scoreDescription').textContent = getScoreDescription();
  
  createFinalChart();
}

function formatChange(value, suffix = '') {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}${suffix}`;
}

function getChangeClass(value, inverse = false) {
  if (Math.abs(value) < 0.1) return 'neutral';
  if (inverse) {
    return value < 0 ? 'positive' : 'negative';
  } else {
    return value > 0 ? 'positive' : 'negative';
  }
}

function getTrustExplanation() {
  const trust = gameState.trust;
  if (trust >= 80) {
    return "Превосходное доверие международного сообщества. Ваша политика была конструктивной и способствовала укреплению торговых отношений.";
  } else if (trust >= 60) {
    return "Хороший уровень доверия. В целом ваши решения были разумными и способствовали стабильности.";
  } else if (trust >= 40) {
    return "Средний уровень доверия. Некоторые решения вызвали обеспокоенность партнёров, но общий курс остался предсказуемым.";
  } else if (trust >= 20) {
    return "Низкий уровень доверия. Многие решения были восприняты как агрессивные или непредсказуемые, что осложнило торговые отношения.";
  } else {
    return "Критически низкое доверие. Ваша политика серьёзно подорвала международные отношения и может привести к изоляции.";
  }
}

function getScoreDescription() {
  const score = gameState.finalScore;
  if (score >= 50) {
    return "Превосходно! Экономическая стратегия была очень успешной. Вы достигли выдающихся результатов.";
  } else if (score >= 20) {
    return "Отлично! Экономика показала сильные положительные результаты при разумной торговой политике.";
  } else if (score >= 0) {
    return "Хорошо. Экономические показатели улучшились, хотя есть области для развития.";
  } else if (score >= -20) {
    return "Удовлетворительно. Есть как успехи, так и проблемы. Политика нуждается в корректировке.";
  } else if (score >= -40) {
    return "Неудовлетворительно. Экономика столкнулась с серьёзными трудностями из-за принятых решений.";
  } else {
    return "Критично! Экономическая политика привела к серьёзному кризису. Требуется кардинальный пересмотр стратегии.";
  }
}

function createFinalChart() {
  const canvas = document.getElementById('finalChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  const labels = ['Старт'];
  gameState.history.forEach((_, index) => {
    labels.push(`Ход ${index + 1}`);
  });
  
  const gdpData = [gameData.baseState.gdpIdx + gameData.countries[gameState.selectedCountry].modifiers.gdpIdx];
  const expData = [gameData.baseState.expIdx + gameData.countries[gameState.selectedCountry].modifiers.expIdx];
  const impData = [gameData.baseState.impIdx + gameData.countries[gameState.selectedCountry].modifiers.impIdx];
  const trustData = [50];
  
  gameState.history.forEach(h => {
    gdpData.push(h.state.gdpIdx);
    expData.push(h.state.expIdx);
    impData.push(h.state.impIdx);
    trustData.push(h.trust);
  });
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'ВВП индекс',
          data: gdpData,
          borderColor: '#1FB8CD',
          backgroundColor: '#1FB8CD20',
          borderWidth: 2,
          tension: 0.1,
          yAxisID: 'y'
        },
        {
          label: 'Экспорт индекс', 
          data: expData,
          borderColor: '#FFC185',
          backgroundColor: '#FFC18520',
          borderWidth: 2,
          tension: 0.1,
          yAxisID: 'y'
        },
        {
          label: 'Импорт индекс',
          data: impData,
          borderColor: '#B4413C',
          backgroundColor: '#B4413C20',
          borderWidth: 2,
          tension: 0.1,
          yAxisID: 'y'
        },
        {
          label: 'Доверие',
          data: trustData,
          borderColor: '#5D878F',
          backgroundColor: '#5D878F20',
          borderWidth: 2,
          tension: 0.1,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: false,
          title: {
            display: true,
            text: 'Индексы'
          },
          grid: { color: 'rgba(94, 82, 64, 0.1)' },
          ticks: { color: '#626c71' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Доверие'
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: { color: '#626c71' }
        },
        x: {
          grid: { color: 'rgba(94, 82, 64, 0.1)' },
          ticks: { color: '#626c71' }
        }
      }
    }
  });
}

function newGame() {
  Object.values(gameState.charts).forEach(chart => {
    if (chart && chart.destroy) {
      chart.destroy();
    }
  });
  
  gameState = {
    currentScreen: 'start',
    selectedCountry: null,
    gameMode: 'normal',
    currentTurn: 0,
    currentScenario: null,
    selectedChoice: null,
    economicState: { ...gameData.baseState },
    trust: 50,
    history: [],
    charts: {},
    usedScenarios: []
  };
  
  document.querySelectorAll('.country-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  document.querySelectorAll('input[name="gameMode"]').forEach(radio => {
    radio.checked = radio.value === 'normal';
  });
  
  updateStartButton();
  showScreen('start');
}

function exportResults() {
  const results = {
    country: gameData.countries[gameState.selectedCountry].name,
    countryCode: gameState.selectedCountry,
    mode: gameState.gameMode,
    initialState: gameData.baseState,
    finalState: gameState.economicState,
    changes: gameState.changes,
    finalTrust: gameState.trust,
    finalScore: gameState.finalScore,
    decisions: gameState.history.map(h => ({
      turn: h.turn,
      scenario: h.scenario,
      choice: h.choice,
      effects: h.effects,
      economicState: h.state,
      trust: h.trust
    })),
    summary: {
      totalTurns: gameData.stepsTotal,
      gameVersion: "4.0",
      completedAt: new Date().toISOString()
    }
  };
  
  const dataStr = JSON.stringify(results, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `trade_wars_v4_${gameState.selectedCountry}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}