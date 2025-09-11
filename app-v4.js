// Торговые войны V4.0 - Финансовый университет
// Экономический симулятор международной торговли

// Данные игры
const COUNTRIES = {
    "US": {
        name: "США",
        flag: "🇺🇸",
        difficulty: "Легкая",
        bonus: 3,
        specialties: ["технологии", "финансы", "энергетика", "агропром"],
        base_modifiers: {gdpIdx: 10, expIdx: 0, impIdx: 10, cpi: -0.3, unemployment: -0.5}
    },
    "CN": {
        name: "Китай",
        flag: "🇨🇳",
        difficulty: "Простая",
        bonus: 5,
        specialties: ["производство", "экспорт", "технологии", "инфраструктура"],
        base_modifiers: {gdpIdx: 8, expIdx: 15, impIdx: 5, cpi: 0.2, unemployment: -1.5}
    },
    "DE": {
        name: "Германия",
        flag: "🇩🇪",
        difficulty: "Средняя",
        bonus: 8,
        specialties: ["автопром", "машиностроение", "химия", "экспорт"],
        base_modifiers: {gdpIdx: 5, expIdx: 8, impIdx: 3, cpi: -0.5, unemployment: -1.0}
    },
    "JP": {
        name: "Япония",
        flag: "🇯🇵",
        difficulty: "Сложная",
        bonus: 10,
        specialties: ["технологии", "автопром", "робототехника", "точное машиностроение"],
        base_modifiers: {gdpIdx: 3, expIdx: 5, impIdx: 8, cpi: -0.8, unemployment: -0.3}
    },
    "RU": {
        name: "Россия",
        flag: "🇷🇺",
        difficulty: "Очень сложная",
        bonus: 12,
        specialties: ["энергетика", "сырьё", "IT", "оборонпром"],
        base_modifiers: {gdpIdx: 0, expIdx: 5, impIdx: -3, cpi: 0.5, unemployment: 1.0}
    },
    "BR": {
        name: "Бразилия",
        flag: "🇧🇷",
        difficulty: "Экстремально сложная",
        bonus: 15,
        specialties: ["агропром", "сырьё", "энергетика", "металлургия"],
        base_modifiers: {gdpIdx: -2, expIdx: 3, impIdx: -5, cpi: 1.5, unemployment: 2.0}
    }
};

const GAME_MODES = {
    normal: {turns: 12, static: true, effectsVisible: true, multiplier: 1.0, years: 3},
    hard: {turns: 15, static: false, effectsVisible: true, multiplier: 1.5, years: 5},
    blind: {turns: 15, static: false, effectsVisible: false, multiplier: 1.0, years: 5}
};

// Расширенная база сценариев с 3-4 вариантами выбора
function generateScenarios() {
    const GENERAL_SCENARIOS = [
        {
            id: "steel-dumping",
            title: "Демпинг стали",
            text: "Дешевая сталь из-за рубежа давит на национальную промышленность. Местные производители требуют защиты.",
            type: "general",
            choices: [
                {
                    id: "high-tariff",
                    icon: "fa-solid fa-industry",
                    label: "Высокие тарифы (25%)",
                    hint: "Быстрая защита → риск ответных мер",
                    effect: {gdp: -1.3, exp: -1.9, imp: -2.5, cpi: 0.3, unemployment: -0.5, trust: -5},
                    tags: ["тарифы", "эскалация"],
                    economicTheory: "Тарифы создают мертвый груз потерь для общества, снижая благосостояние потребителей больше, чем увеличивают прибыли производителей.",
                    history: "В 2018 году США ввели пошлины на сталь в 25%, что привело к росту цен на 30% и ответным мерам партнеров на $13.2 млрд."
                },
                {
                    id: "moderate-tariff",
                    icon: "fa-solid fa-balance-scale",
                    label: "Умеренные тарифы (10%)",
                    hint: "Компромисс между защитой и торговлей",
                    effect: {gdp: -0.5, exp: -0.8, imp: -1.2, cpi: 0.1, unemployment: -0.2, trust: -2},
                    tags: ["тарифы", "компромисс"],
                    economicTheory: "Умеренная торговая защита может временно поддержать отрасль, но снижает стимулы к повышению эффективности.",
                    history: "ЕС часто использует антидемпинговые пошлины 5-15% как компромисс между защитой и открытостью рынков."
                },
                {
                    id: "wto-complaint",
                    icon: "fa-solid fa-gavel",
                    label: "Жалоба в ВТО",
                    hint: "Долгий процесс, но законный путь",
                    effect: {gdp: 0.2, exp: 0.5, imp: 0.1, cpi: -0.1, unemployment: 0.1, trust: 3},
                    tags: ["ВТО", "дипломатия"],
                    economicTheory: "Многосторонние торговые институты обеспечивают предсказуемость и верховенство права в международной торговле.",
                    history: "Китай выиграл 15 из 21 дела в ВТО против торговых ограничений США в 2018-2020 годах."
                },
                {
                    id: "subsidize-local",
                    icon: "fa-solid fa-hand-holding-usd",
                    label: "Субсидии отечественным производителям",
                    hint: "Поддержка без барьеров для импорта",
                    effect: {gdp: 0.8, exp: 1.2, imp: 0.3, cpi: 0.2, unemployment: -0.8, trust: 1},
                    tags: ["субсидии", "поддержка"],
                    economicTheory: "Субсидии производителям могут повысить конкурентоспособность без создания торговых барьеров.",
                    history: "Программа поддержки авиастроения Airbus в ЕС помогла создать конкурента Boeing."
                }
            ]
        },
        {
            id: "currency-manipulation",
            title: "Валютная война",
            text: "Торговый партнер обвинен в искусственном занижении курса валюты для повышения конкурентоспособности экспорта.",
            type: "general",
            choices: [
                {
                    id: "currency-intervention",
                    icon: "fa-solid fa-coins",
                    label: "Валютная интервенция",
                    hint: "Ослабить собственную валюту",
                    effect: {gdp: 1.2, exp: 2.8, imp: -1.5, cpi: 0.8, unemployment: -0.8, trust: -8},
                    tags: ["валюта", "конкуренция"],
                    economicTheory: "Валютные интервенции могут улучшить торговый баланс краткосрочно, но создают глобальные дисбалансы.",
                    history: "Швейцария потратила $100 млрд на сдерживание роста франка в 2011-2015 годах."
                },
                {
                    id: "diplomatic-pressure",
                    icon: "fa-solid fa-handshake",
                    label: "Дипломатическое давление",
                    hint: "Переговоры и международное давление",
                    effect: {gdp: 0.3, exp: 0.5, imp: 0.2, cpi: 0.0, unemployment: 0.0, trust: 2},
                    tags: ["дипломатия", "переговоры"],
                    economicTheory: "Координация валютной политики через международные институты снижает риск валютных войн.",
                    history: "Соглашения Плаза (1985) и Лувра (1987) показали эффективность координации валютной политики G7."
                },
                {
                    id: "ignore-manipulation",
                    icon: "fa-solid fa-eye-slash",
                    label: "Игнорировать",
                    hint: "Сосредоточиться на внутренней конкурентоспособности",
                    effect: {gdp: -0.2, exp: -0.5, imp: 0.8, cpi: -0.3, unemployment: 0.2, trust: 0},
                    tags: ["невмешательство", "рынок"],
                    economicTheory: "Рыночные силы в долгосрочной перспективе корректируют валютные дисбалансы лучше интервенций.",
                    history: "Германия долгое время не вмешивалась в курс евро, несмотря на критику партнеров."
                }
            ]
        },
        {
            id: "tech-transfer",
            title: "Принудительная передача технологий",
            text: "Иностранные компании требуют доступ к местным технологиям в обмен на инвестиции.",
            type: "general",
            choices: [
                {
                    id: "tech-protection",
                    icon: "fa-solid fa-shield-alt",
                    label: "Защита технологий",
                    hint: "Запретить принудительную передачу",
                    effect: {gdp: -0.8, exp: -1.2, imp: 0.5, cpi: 0.2, unemployment: 0.3, trust: -3},
                    tags: ["технологии", "защита"],
                    economicTheory: "Защита интеллектуальной собственности стимулирует инновации, но может ограничить технологический трансфер.",
                    history: "Закон США о зарубежных инвестициях (FIRRMA 2018) ужесточил контроль над передачей критических технологий."
                },
                {
                    id: "selective-sharing",
                    icon: "fa-solid fa-exchange-alt",
                    label: "Избирательный обмен",
                    hint: "Обмен в некритичных областях",
                    effect: {gdp: 0.5, exp: 1.0, imp: -0.3, cpi: -0.1, unemployment: -0.2, trust: 1},
                    tags: ["технологии", "компромисс"],
                    economicTheory: "Избирательная кооперация в НИОКР может создать взаимную выгоду при сохранении конкурентных преимуществ.",
                    history: "Программа Horizon Europe позволяет участвовать третьим странам в некритичных исследованиях."
                },
                {
                    id: "open-innovation",
                    icon: "fa-solid fa-globe",
                    label: "Открытые инновации",
                    hint: "Полный технологический обмен",
                    effect: {gdp: 1.5, exp: 0.8, imp: 1.2, cpi: -0.2, unemployment: -0.5, trust: 5},
                    tags: ["открытость", "инновации"],
                    economicTheory: "Открытые инновации ускоряют технологическое развитие через обмен знаниями.",
                    history: "Модель открытых инноваций Tesla с патентами ускорила развитие электромобилей."
                }
            ]
        },
        {
            id: "supply-chain-disruption",
            title: "Нарушение цепочек поставок",
            text: "Геополитический кризис нарушил ключевые цепочки поставок. Необходимо обеспечить экономическую безопасность.",
            type: "general",
            choices: [
                {
                    id: "domestic-production",
                    icon: "fa-solid fa-home",
                    label: "Локализация производства",
                    hint: "Дорого, но надежно",
                    effect: {gdp: -2.0, exp: -1.5, imp: -3.0, cpi: 1.2, unemployment: -1.0, trust: 0},
                    tags: ["локализация", "безопасность"],
                    economicTheory: "Решоринг повышает экономическую безопасность, но снижает эффективность из-за потери сравнительных преимуществ.",
                    history: "Пандемия COVID-19 привела к решорингу $200 млрд производства в США и ЕС в 2020-2022 годах."
                },
                {
                    id: "supply-diversification",
                    icon: "fa-solid fa-route",
                    label: "Диверсификация поставщиков",
                    hint: "Снижение зависимости от одного источника",
                    effect: {gdp: -0.5, exp: 0.2, imp: -0.8, cpi: 0.3, unemployment: 0.1, trust: 2},
                    tags: ["диверсификация", "риски"],
                    economicTheory: "Диверсификация цепочек поставок снижает системные риски, но может увеличить транзакционные издержки.",
                    history: "После кризиса с Суэцким каналом компании увеличили количество поставщиков в среднем на 40%."
                },
                {
                    id: "strategic-reserves",
                    icon: "fa-solid fa-warehouse",
                    label: "Стратегические резервы",
                    hint: "Создать буферные запасы",
                    effect: {gdp: -1.0, exp: -0.3, imp: -0.5, cpi: 0.5, unemployment: -0.2, trust: 1},
                    tags: ["резервы", "стабильность"],
                    economicTheory: "Стратегические резервы обеспечивают стабильность поставок в кризисные периоды.",
                    history: "Китай создал крупнейшие в мире стратегические резервы меди, алюминия и других металлов."
                }
            ]
        },
        {
            id: "digital-tax",
            title: "Цифровое налогообложение",
            text: "Крупные технологические компании избегают налогов, используя офшорные схемы. Общественность требует справедливости.",
            type: "general",
            choices: [
                {
                    id: "unilateral-digital-tax",
                    icon: "fa-solid fa-laptop",
                    label: "Односторонний цифровой налог",
                    hint: "3% с оборота цифровых услуг",
                    effect: {gdp: 0.8, exp: -0.5, imp: 0.2, cpi: 0.1, unemployment: 0.0, trust: -4},
                    tags: ["налоги", "цифровизация"],
                    economicTheory: "Цифровые налоги могут исправить налоговые искажения, но создают риск двойного налогообложения.",
                    history: "Франция ввела 3% налог на цифровые услуги в 2019 году, что привело к угрозам торговых санкций США."
                },
                {
                    id: "oecd-framework",
                    icon: "fa-solid fa-globe",
                    label: "Глобальное соглашение ОЭСР",
                    hint: "Минимальный налог 15% для ТНК",
                    effect: {gdp: 1.2, exp: 0.3, imp: 0.1, cpi: 0.0, unemployment: 0.0, trust: 5},
                    tags: ["ОЭСР", "кооперация"],
                    economicTheory: "Международная координация налоговой политики предотвращает гонку на дно и налоговую конкуренцию.",
                    history: "Соглашение ОЭСР по Pillar One и Two 2021 года охватывает 90% мировой экономики."
                },
                {
                    id: "innovation-incentives",
                    icon: "fa-solid fa-rocket",
                    label: "Стимулы для инноваций",
                    hint: "Налоговые льготы для IT-сектора",
                    effect: {gdp: 2.0, exp: 1.8, imp: 0.5, cpi: -0.1, unemployment: -0.8, trust: 0},
                    tags: ["инновации", "стимулы"],
                    economicTheory: "Налоговые стимулы для высокотехнологичных отраслей могут ускорить экономический рост.",
                    history: "Ирландия привлекла крупные IT-компании льготной ставкой налога на прибыль 12.5%."
                }
            ]
        }
    ];

    // Генерация дополнительных разнообразных сценариев
    const additionalScenarios = [];
    const scenarioTemplates = [
        {
            title: "Торговые санкции",
            text: "Международное сообщество рассматривает введение торговых санкций против страны-нарушителя.",
            choices_count: 3
        },
        {
            title: "Зеленый переход",
            text: "Необходимо принять решение о переходе к зеленой экономике и углеродному налогу.",
            choices_count: 4
        },
        {
            title: "Миграционные потоки",
            text: "Массовая трудовая миграция влияет на рынок труда и торговые отношения.",
            choices_count: 3
        },
        {
            title: "Энергетическая безопасность",
            text: "Растущие цены на энергоносители требуют пересмотра энергетической политики.",
            choices_count: 4
        },
        {
            title: "Торговая война в высокотехнологичном секторе",
            text: "Конкуренция в сфере полупроводников и искусственного интеллекта обостряется.",
            choices_count: 3
        }
    ];

    for (let i = 6; i <= 70; i++) {
        const template = scenarioTemplates[(i - 6) % scenarioTemplates.length];
        const choicesCount = template.choices_count;
        const choices = [];

        for (let j = 1; j <= choicesCount; j++) {
            choices.push({
                id: `choice-${i}-${j}`,
                icon: `fa-solid fa-${['chart-up', 'shield', 'handshake', 'balance-scale'][j-1]}`,
                label: `Вариант ${j}`,
                hint: `Подход ${j} к решению проблемы`,
                effect: {
                    gdp: (Math.random() - 0.5) * 3,
                    exp: (Math.random() - 0.5) * 3,
                    imp: (Math.random() - 0.5) * 3,
                    cpi: (Math.random() - 0.5) * 1.5,
                    unemployment: (Math.random() - 0.5) * 2,
                    trust: (Math.random() - 0.5) * 10
                },
                tags: ["общий", "экономика"],
                economicTheory: "Каждое торговое решение имеет долгосрочные последствия для экономической структуры страны.",
                history: "История показывает разнообразие подходов к решению торговых споров."
            });
        }

        additionalScenarios.push({
            id: `general-scenario-${i}`,
            title: template.title,
            text: template.text,
            type: "general",
            choices: choices
        });
    }

    return [...GENERAL_SCENARIOS, ...additionalScenarios];
}

// Специфичные сценарии для стран
const COUNTRY_SCENARIOS = {
    "US": [
        {
            id: "us-nafta-renegotiation",
            title: "Пересмотр НАФТА",
            text: "Необходимо пересмотреть торговое соглашение с соседями для защиты американских рабочих мест.",
            type: "country",
            choices: [
                {
                    id: "tough-renegotiation",
                    icon: "fa-solid fa-gavel",
                    label: "Жесткие переговоры",
                    hint: "Требовать лучших условий для США",
                    effect: {gdp: 1.5, exp: -0.8, imp: -1.2, cpi: 0.3, unemployment: -0.8, trust: -3},
                    tags: ["НАФТА", "переговоры"],
                    economicTheory: "Пересмотр торговых соглашений может улучшить условия торговли, но создает неопределенность.",
                    history: "USMCA заменила НАФТА в 2020 году с более жесткими правилами происхождения для автомобилей."
                },
                {
                    id: "maintain-nafta",
                    icon: "fa-solid fa-handshake",
                    label: "Сохранить статус-кво",
                    hint: "Не менять существующие соглашения",
                    effect: {gdp: 0.2, exp: 0.5, imp: 0.3, cpi: -0.1, unemployment: 0.1, trust: 2},
                    tags: ["стабильность", "статус-кво"],
                    economicTheory: "Стабильность торговых правил способствует долгосрочному планированию бизнеса.",
                    history: "НАФТА действовала 25 лет и создала интегрированную североамериканскую экономику."
                },
                {
                    id: "modernize-nafta",
                    icon: "fa-solid fa-sync",
                    label: "Модернизация соглашения",
                    hint: "Добавить цифровую торговлю и экологию",
                    effect: {gdp: 1.0, exp: 1.2, imp: 0.8, cpi: 0.1, unemployment: -0.3, trust: 4},
                    tags: ["модернизация", "инновации"],
                    economicTheory: "Модернизация торговых соглашений под современные реалии повышает эффективность.",
                    history: "USMCA включила новые главы по цифровой торговле и трудовым стандартам."
                }
            ]
        }
    ],
    "CN": [
        {
            id: "cn-belt-road",
            title: "Инициатива Пояса и Пути",
            text: "Масштабный инфраструктурный проект может укрепить торговые связи, но требует больших инвестиций.",
            type: "country",
            choices: [
                {
                    id: "expand-bri",
                    icon: "fa-solid fa-road",
                    label: "Расширить инициативу",
                    hint: "Увеличить инвестиции в инфраструктуру",
                    effect: {gdp: -2.0, exp: 3.5, imp: 1.0, cpi: 0.5, unemployment: -1.2, trust: 8},
                    tags: ["ПиП", "инфраструктура"],
                    economicTheory: "Инвестиции в инфраструктуру создают сетевые эффекты и долгосрочный рост торговли.",
                    history: "Китай инвестировал $1 трлн в проекты ПиП в 140+ странах с 2013 года."
                },
                {
                    id: "focus-domestic",
                    icon: "fa-solid fa-home",
                    label: "Сосредоточиться на внутреннем рынке",
                    hint: "Развивать внутреннее потребление",
                    effect: {gdp: 1.5, exp: -0.5, imp: 2.0, cpi: 0.3, unemployment: -0.8, trust: -2},
                    tags: ["внутренний рынок", "потребление"],
                    economicTheory: "Переход от экспортной к потребительской модели роста повышает устойчивость экономики.",
                    history: "Китай активно развивает политику 'двойной циркуляции' с акцентом на внутренний рынок."
                },
                {
                    id: "green-bri",
                    icon: "fa-solid fa-leaf",
                    label: "Зеленый пояс и путь",
                    hint: "Инвестиции в экологически чистую инфраструктуру",
                    effect: {gdp: -1.0, exp: 2.0, imp: 0.5, cpi: 0.2, unemployment: -0.5, trust: 6},
                    tags: ["экология", "устойчивость"],
                    economicTheory: "Зеленые инвестиции создают долгосрочные конкурентные преимущества.",
                    history: "Китай объявил о прекращении финансирования угольных проектов в рамках ПиП в 2021 году."
                }
            ]
        }
    ],
    // Добавить сценарии для других стран...
};

// Случайные события
const RANDOM_EVENTS = [
    {
        id: "oil-spike",
        title: "Скачок цен на нефть",
        description: "Геополитическая напряженность привела к росту цен на нефть на 40%",
        effect: {gdp: -0.5, exp: -0.3, imp: -0.8, cpi: 1.2, unemployment: 0.3, trust: 0},
        icon: "fa-solid fa-fire-flame-curved",
        type: "negative"
    },
    {
        id: "tech-breakthrough",
        title: "Технологический прорыв",
        description: "Ваши компании совершили прорыв в области искусственного интеллекта",
        effect: {gdp: 1.8, exp: 2.2, imp: 0.5, cpi: -0.2, unemployment: -0.5, trust: 3},
        icon: "fa-solid fa-lightbulb",
        type: "positive"
    },
    {
        id: "natural-disaster",
        title: "Стихийное бедствие",
        description: "Ураган нарушил работу ключевых портов и производственных мощностей",
        effect: {gdp: -1.2, exp: -1.8, imp: -0.5, cpi: 0.8, unemployment: 0.6, trust: 0},
        icon: "fa-solid fa-hurricane",
        type: "negative"
    },
    {
        id: "new-trade-partner",
        title: "Новый торговый партнер",
        description: "Заключено выгодное торговое соглашение с быстро растущей экономикой",
        effect: {gdp: 1.0, exp: 1.5, imp: 0.8, cpi: -0.1, unemployment: -0.3, trust: 2},
        icon: "fa-solid fa-handshake",
        type: "positive"
    },
    {
        id: "cyber-attack",
        title: "Кибератака",
        description: "Масштабная кибератака нарушила работу финансовой системы",
        effect: {gdp: -0.8, exp: -0.5, imp: -0.3, cpi: 0.3, unemployment: 0.2, trust: -1},
        icon: "fa-solid fa-virus",
        type: "negative"
    },
    {
        id: "currency-surge",
        title: "Укрепление валюты",
        description: "Приток капитала привел к укреплению национальной валюты на 15%",
        effect: {gdp: 0.5, exp: -1.0, imp: 1.2, cpi: -0.4, unemployment: 0.2, trust: 1},
        icon: "fa-solid fa-chart-line",
        type: "mixed"
    }
];

// Класс состояния игры
class GameState {
    constructor() {
        this.selectedCountry = null;
        this.selectedMode = null;
        this.currentTurn = 1;
        this.totalTurns = 12;
        this.totalYears = 3;
        this.indicators = {
            gdpIdx: 100.0,
            expIdx: 100.0,
            impIdx: 100.0,
            cpi: 2.0,
            unemployment: 5.0
        };
        this.trust = 50;
        this.history = [];
        this.currentScenario = null;
        this.availableScenarios = [];
        this.gameLog = [];
        this.isGameActive = false;
        this.charts = {
            performance: null,
            gdp: null,
            export: null,
            import: null,
            inflation: null,
            unemployment: null
        };
        this.chartData = {
            gdp: [100, 100],      // Начинаем с 2 точек
            export: [100, 100],
            import: [100, 100],
            inflation: [2.0, 2.0],
            unemployment: [5.0, 5.0]
        };
    }

    initializeScenarios() {
        try {
            const generalScenarios = generateScenarios();
            this.availableScenarios = [...generalScenarios];

            if (this.selectedCountry && COUNTRY_SCENARIOS[this.selectedCountry]) {
                this.availableScenarios.push(...COUNTRY_SCENARIOS[this.selectedCountry]);
            }

            console.log(`Initialized ${this.availableScenarios.length} scenarios`);
        } catch (error) {
            console.error('Error initializing scenarios:', error);
            this.availableScenarios = this.createFallbackScenarios();
        }
    }

    createFallbackScenarios() {
        return [{
            id: "fallback-scenario",
            title: "Торговое решение",
            text: "Принимите важное экономическое решение.",
            type: "general",
            choices: [
                {
                    id: "choice-1",
                    icon: "fa-solid fa-chart-up",
                    label: "Либеральный подход",
                    hint: "Открыть рынки",
                    effect: {gdp: 1.0, exp: 1.5, imp: 0.5, cpi: -0.1, unemployment: -0.2, trust: 2},
                    tags: ["либерализация"],
                    economicTheory: "Либерализация способствует экономическому росту.",
                    history: "Множество стран получили выгоды от либерализации торговли."
                },
                {
                    id: "choice-2",
                    icon: "fa-solid fa-shield",
                    label: "Протекционистский подход",
                    hint: "Защитить местную промышленность",
                    effect: {gdp: -0.5, exp: -1.0, imp: -1.5, cpi: 0.3, unemployment: -0.5, trust: -2},
                    tags: ["протекционизм"],
                    economicTheory: "Протекционизм защищает местную промышленность.",
                    history: "Многие страны использовали протекционизм для развития."
                },
                {
                    id: "choice-3",
                    icon: "fa-solid fa-balance-scale",
                    label: "Сбалансированный подход",
                    hint: "Компромиссное решение",
                    effect: {gdp: 0.2, exp: 0.3, imp: 0.1, cpi: 0.1, unemployment: -0.1, trust: 1},
                    tags: ["баланс"],
                    economicTheory: "Сбалансированная политика минимизирует риски.",
                    history: "Многие успешные экономики используют смешанный подход."
                }
            ]
        }];
    }

    getCurrentScenario() {
        try {
            if (!this.availableScenarios || this.availableScenarios.length === 0) {
                throw new Error('No scenarios available');
            }

            if (GAME_MODES[this.selectedMode].static) {
                const index = Math.min(this.currentTurn - 1, this.availableScenarios.length - 1);
                return this.availableScenarios[index];
            } else {
                const randomIndex = Math.floor(Math.random() * this.availableScenarios.length);
                return this.availableScenarios[randomIndex];
            }
        } catch (error) {
            console.error('Error getting current scenario:', error);
            return this.createFallbackScenarios()[0];
        }
    }

    applyChoice(choice) {
        try {
            const mode = GAME_MODES[this.selectedMode];
            const multiplier = mode.multiplier;
            const countryMods = COUNTRIES[this.selectedCountry].base_modifiers;

            // Применяем эффекты выбора
            Object.entries(choice.effect).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    switch(key) {
                        case 'gdp':
                            this.indicators.gdpIdx += (value * multiplier) + (countryMods.gdpIdx * 0.1);
                            break;
                        case 'exp':
                            this.indicators.expIdx += (value * multiplier) + (countryMods.expIdx * 0.1);
                            break;
                        case 'imp':
                            this.indicators.impIdx += (value * multiplier) + (countryMods.impIdx * 0.1);
                            break;
                        case 'cpi':
                            this.indicators.cpi += (value * multiplier) + (countryMods.cpi * 0.1);
                            break;
                        case 'unemployment':
                            this.indicators.unemployment += (value * multiplier) + (countryMods.unemployment * 0.1);
                            break;
                        case 'trust':
                            this.trust += value * multiplier;
                            break;
                    }
                }
            });

            // Ограничения
            this.indicators.gdpIdx = Math.max(60, Math.min(140, this.indicators.gdpIdx));
            this.indicators.expIdx = Math.max(50, Math.min(150, this.indicators.expIdx));
            this.indicators.impIdx = Math.max(50, Math.min(150, this.indicators.impIdx));
            this.indicators.cpi = Math.max(-1, Math.min(8, this.indicators.cpi));
            this.indicators.unemployment = Math.max(2, Math.min(15, this.indicators.unemployment));
            this.trust = Math.max(0, Math.min(100, this.trust));

            // Обновляем данные графиков
            this.chartData.gdp.push(this.indicators.gdpIdx);
            this.chartData.export.push(this.indicators.expIdx);
            this.chartData.import.push(this.indicators.impIdx);
            this.chartData.inflation.push(this.indicators.cpi);
            this.chartData.unemployment.push(this.indicators.unemployment);

            // Логируем решение
            this.gameLog.push({
                turn: this.currentTurn,
                year: Math.ceil(this.currentTurn / (this.totalTurns / this.totalYears)),
                scenario: this.currentScenario.title,
                choice: choice.label,
                effects: choice.effect,
                theory: choice.economicTheory || "Нет теории",
                history: choice.history || "Нет исторического примера",
                indicators: {...this.indicators},
                trust: this.trust
            });

            console.log('Choice applied successfully');
        } catch (error) {
            console.error('Error applying choice:', error);
        }
    }

    applyRandomEvent(event) {
        try {
            const mode = GAME_MODES[this.selectedMode];
            const multiplier = mode.multiplier * 0.7;

            Object.entries(event.effect).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    switch(key) {
                        case 'gdp':
                            this.indicators.gdpIdx += value * multiplier;
                            break;
                        case 'exp':
                            this.indicators.expIdx += value * multiplier;
                            break;
                        case 'imp':
                            this.indicators.impIdx += value * multiplier;
                            break;
                        case 'cpi':
                            this.indicators.cpi += value * multiplier;
                            break;
                        case 'unemployment':
                            this.indicators.unemployment += value * multiplier;
                            break;
                        case 'trust':
                            this.trust += value * multiplier;
                            break;
                    }
                }
            });

            // Ограничения
            this.indicators.gdpIdx = Math.max(60, Math.min(140, this.indicators.gdpIdx));
            this.indicators.expIdx = Math.max(50, Math.min(150, this.indicators.expIdx));
            this.indicators.impIdx = Math.max(50, Math.min(150, this.indicators.impIdx));
            this.indicators.cpi = Math.max(-1, Math.min(8, this.indicators.cpi));
            this.indicators.unemployment = Math.max(2, Math.min(15, this.indicators.unemployment));
            this.trust = Math.max(0, Math.min(100, this.trust));
        } catch (error) {
            console.error('Error applying random event:', error);
        }
    }

    calculateDetailedScore() {
        try {
            const countryBonus = COUNTRIES[this.selectedCountry].bonus;
            
            // Базовые очки (0-60)
            let baseScore = 0;
            baseScore += Math.max(0, Math.min(20, (this.indicators.gdpIdx - 80) * 0.5)); // ВВП (20 points max)
            baseScore += Math.max(0, Math.min(15, (this.indicators.expIdx - 80) * 0.375)); // Экспорт (15 points max)
            baseScore += Math.max(0, Math.min(10, (120 - this.indicators.impIdx) * 0.25)); // Импорт (10 points max)
            baseScore += Math.max(0, Math.min(8, (4 - this.indicators.cpi) * 2)); // Инфляция (8 points max)
            baseScore += Math.max(0, Math.min(7, (8 - this.indicators.unemployment) * 1.17)); // Безработица (7 points max)

            // Бонус за качество решений (0-20)
            const avgTrustChange = this.gameLog.reduce((sum, log) => {
                return sum + (log.effects.trust || 0);
            }, 0) / this.gameLog.length;
            const decisionsBonus = Math.max(0, Math.min(20, 10 + avgTrustChange));

            // Бонус за последовательность (0-5)
            const consistencyBonus = this.calculateConsistencyBonus();

            const totalScore = Math.round(baseScore + countryBonus + decisionsBonus + consistencyBonus);

            return {
                total: Math.max(0, Math.min(100, totalScore)),
                base: Math.round(baseScore),
                country: countryBonus,
                decisions: Math.round(decisionsBonus),
                consistency: Math.round(consistencyBonus)
            };
        } catch (error) {
            console.error('Error calculating detailed score:', error);
            return {total: 50, base: 30, country: 10, decisions: 10, consistency: 0};
        }
    }

    calculateConsistencyBonus() {
        if (this.gameLog.length < 3) return 0;
        
        let consistentChoices = 0;
        let previousTags = [];
        
        this.gameLog.forEach(log => {
            if (previousTags.length > 0) {
                const currentTags = log.choice.tags || [];
                const hasCommonTag = currentTags.some(tag => previousTags.includes(tag));
                if (hasCommonTag) consistentChoices++;
            }
            previousTags = log.choice.tags || [];
        });
        
        return Math.min(5, (consistentChoices / this.gameLog.length) * 5);
    }
}

// Глобальная переменная игры
let game = new GameState();

// Управление темой
function initializeTheme() {
    try {
        const savedTheme = localStorage.getItem('tradeWarsTheme') || 'light';
        document.documentElement.setAttribute('data-color-scheme', savedTheme);
        updateThemeIcon(savedTheme);
    } catch (error) {
        console.error('Error initializing theme:', error);
        document.documentElement.setAttribute('data-color-scheme', 'light');
    }
}

function toggleTheme() {
    try {
        const current = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('tradeWarsTheme', newTheme);
        updateThemeIcon(newTheme);
    } catch (error) {
        console.error('Error toggling theme:', error);
    }
}

function updateThemeIcon(theme) {
    try {
        const icon = document.querySelector('#theme-toggle i');
        if (icon) {
            // Всегда показываем полумесяц
            icon.className = 'fas fa-moon';
        }
    } catch (error) {
        console.error('Error updating theme icon:', error);
    }
}

// Управление экранами
function showScreen(screenId) {
    try {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            console.log(`Switched to screen: ${screenId}`);
        } else {
            console.error(`Screen not found: ${screenId}`);
        }
    } catch (error) {
        console.error('Error showing screen:', error);
    }
}

// Инициализация стран
function initializeCountries() {
    try {
        const grid = document.getElementById('countries-grid');
        if (!grid) {
            console.error('Countries grid not found');
            return;
        }

        Object.entries(COUNTRIES).forEach(([code, country]) => {
            const card = document.createElement('div');
            card.className = 'country-card';
            card.dataset.country = code;
            card.innerHTML = `
                <div class="country-flag">${country.flag}</div>
                <div class="country-name">${country.name}</div>
                <div class="country-difficulty">${country.difficulty}</div>
                <div class="country-bonus">+${country.bonus} баллов</div>
                <div class="country-specialties">
                    ${country.specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('')}
                </div>
            `;
            card.addEventListener('click', () => selectCountry(code));
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error initializing countries:', error);
    }
}

// Инициализация режимов
function initializeModes() {
    try {
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => selectMode(btn.dataset.mode));
        });
    } catch (error) {
        console.error('Error initializing modes:', error);
    }
}

// Выбор страны
function selectCountry(countryCode) {
    try {
        document.querySelectorAll('.country-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-country="${countryCode}"]`).classList.add('selected');
        game.selectedCountry = countryCode;
        updateStartButton();
        console.log('Selected country:', countryCode);
    } catch (error) {
        console.error('Error selecting country:', error);
    }
}

// Выбор режима
function selectMode(mode) {
    try {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('selected');
        game.selectedMode = mode;
        game.totalTurns = GAME_MODES[mode].turns;
        game.totalYears = GAME_MODES[mode].years;
        updateStartButton();
        console.log('Selected mode:', mode);
    } catch (error) {
        console.error('Error selecting mode:', error);
    }
}

// Обновление кнопки старта
function updateStartButton() {
    try {
        const startBtn = document.getElementById('start-game');
        if (startBtn) {
            startBtn.disabled = !(game.selectedCountry && game.selectedMode);
        }
    } catch (error) {
        console.error('Error updating start button:', error);
    }
}

// Начало игры
function startGame() {
    try {
        if (!game.selectedCountry || !game.selectedMode) {
            alert('Выберите страну и режим игры');
            return;
        }

        game.initializeScenarios();
        game.isGameActive = true;
        game.currentTurn = 1;
        
        showScreen('game-screen');
        updateGameUI();
        loadNextScenario();
        createIndividualCharts();
        
        console.log('Game started');
    } catch (error) {
        console.error('Error starting game:', error);
    }
}

// Обновление интерфейса игры
function updateGameUI() {
    try {
        // Обновляем информацию о стране
        const countryFlag = document.getElementById('selected-country-flag');
        const countryName = document.getElementById('selected-country-name');
        if (countryFlag && countryName) {
            countryFlag.textContent = COUNTRIES[game.selectedCountry].flag;
            countryName.textContent = COUNTRIES[game.selectedCountry].name;
        }

        // Обновляем информацию о ходе
        const currentTurn = document.getElementById('current-turn');
        const totalTurns = document.getElementById('total-turns');
        const currentYear = document.getElementById('current-year');
        const totalYears = document.getElementById('total-years');
        const progressFill = document.getElementById('progress-fill');

        if (currentTurn) currentTurn.textContent = game.currentTurn;
        if (totalTurns) totalTurns.textContent = game.totalTurns;
        if (currentYear) currentYear.textContent = `Год ${Math.ceil(game.currentTurn / (game.totalTurns / game.totalYears))}`;
        if (totalYears) totalYears.textContent = `${game.totalYears} лет`;
        if (progressFill) {
            const progress = (game.currentTurn - 1) / game.totalTurns * 100;
            progressFill.style.width = `${progress}%`;
        }

        // Обновляем доверие
        const trustValue = document.getElementById('trust-value');
        if (trustValue) trustValue.textContent = Math.round(game.trust);

        // Обновляем индикаторы
        updateIndicatorsPanel();
        updateIndividualCharts();

        console.log('Game UI updated');
    } catch (error) {
        console.error('Error updating game UI:', error);
    }
}

// Обновление панели индикаторов
function updateIndicatorsPanel() {
    try {
        const panel = document.getElementById('indicators-panel');
        if (!panel) return;

        const indicators = [
            {key: 'gdpIdx', label: 'ВВП индекс', icon: 'fa-chart-line', value: game.indicators.gdpIdx.toFixed(1)},
            {key: 'expIdx', label: 'Экспорт', icon: 'fa-shipping-fast', value: game.indicators.expIdx.toFixed(1)},
            {key: 'impIdx', label: 'Импорт', icon: 'fa-download', value: game.indicators.impIdx.toFixed(1)},
            {key: 'cpi', label: 'Инфляция', icon: 'fa-percentage', value: game.indicators.cpi.toFixed(1) + '%'},
            {key: 'unemployment', label: 'Безработица', icon: 'fa-user-times', value: game.indicators.unemployment.toFixed(1) + '%'}
        ];

        panel.innerHTML = indicators.map(indicator => {
            const trendClass = getTrendClass(indicator.key);
            return `
                <div class="indicator ${trendClass}">
                    <i class="fas ${indicator.icon}"></i>
                    <div class="indicator-info">
                        <div class="indicator-label">${indicator.label}</div>
                        <div class="indicator-value">${indicator.value}</div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error updating indicators panel:', error);
    }
}

function getTrendClass(key) {
    if (game.chartData[key === 'gdpIdx' ? 'gdp' : key === 'expIdx' ? 'export' : key === 'impIdx' ? 'import' : key === 'cpi' ? 'inflation' : 'unemployment'].length < 2) {
        return '';
    }
    
    const data = game.chartData[key === 'gdpIdx' ? 'gdp' : key === 'expIdx' ? 'export' : key === 'impIdx' ? 'import' : key === 'cpi' ? 'inflation' : 'unemployment'];
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    
    if (key === 'cpi' || key === 'unemployment' || key === 'impIdx') {
        // Для инфляции, безработицы и импорта - меньше значение лучше
        return current < previous ? 'positive' : current > previous ? 'negative' : '';
    } else {
        // Для ВВП и экспорта - больше значение лучше
        return current > previous ? 'positive' : current < previous ? 'negative' : '';
    }
}

// Создание отдельных графиков
function createIndividualCharts() {
    try {
        const charts = [
            {id: 'gdp-chart', data: 'gdp', label: 'ВВП индекс', color: '#1FB8CD'},
            {id: 'export-chart', data: 'export', label: 'Экспорт', color: '#FFC185'},
            {id: 'import-chart', data: 'import', label: 'Импорт', color: '#B4413C'},
            {id: 'inflation-chart', data: 'inflation', label: 'Инфляция (%)', color: '#FF6B6B'},
            {id: 'unemployment-chart', data: 'unemployment', label: 'Безработица (%)', color: '#4ECDC4'}
        ];

        charts.forEach(chart => {
            const canvas = document.getElementById(chart.id);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                
                if (game.charts[chart.data]) {
                    game.charts[chart.data].destroy();
                }

                const labels = Array.from({length: game.chartData[chart.data].length}, (_, i) => `Ход ${i}`);
                
                game.charts[chart.data] = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: chart.label,
                            data: game.chartData[chart.data],
                            borderColor: chart.color,
                            backgroundColor: chart.color + '20',
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: false
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: chart.label
                            }
                        }
                    }
                });
            }
        });

        console.log('Individual charts created');
    } catch (error) {
        console.error('Error creating individual charts:', error);
    }
}

// Обновление отдельных графиков
function updateIndividualCharts() {
    try {
        const dataKeys = ['gdp', 'export', 'import', 'inflation', 'unemployment'];
        
        dataKeys.forEach(key => {
            if (game.charts[key]) {
                const labels = Array.from({length: game.chartData[key].length}, (_, i) => `Ход ${i}`);
                game.charts[key].data.labels = labels;
                game.charts[key].data.datasets[0].data = game.chartData[key];
                game.charts[key].update();
            }
        });
    } catch (error) {
        console.error('Error updating individual charts:', error);
    }
}

// Загрузка следующего сценария
function loadNextScenario() {
    try {
        game.currentScenario = game.getCurrentScenario();
        
        const titleElement = document.getElementById('scenario-title');
        const descElement = document.getElementById('scenario-description');
        const choicesGrid = document.getElementById('choices-grid');

        if (titleElement) titleElement.textContent = game.currentScenario.title;
        if (descElement) descElement.textContent = game.currentScenario.text;

        if (choicesGrid && game.currentScenario.choices) {
            choicesGrid.innerHTML = '';
            game.currentScenario.choices.forEach(choice => {
                const card = document.createElement('div');
                card.className = 'choice-card';
                card.innerHTML = `
                    <div class="choice-header">
                        <i class="${choice.icon}"></i>
                        <h4>${choice.label}</h4>
                    </div>
                    <p class="choice-hint">${choice.hint}</p>
                `;
                card.addEventListener('click', () => makeChoice(choice));
                choicesGrid.appendChild(card);
            });
        }

        // Скрываем панель эффектов
        const effectsPanel = document.getElementById('choice-effects');
        if (effectsPanel) {
            effectsPanel.classList.add('hidden');
        }

        // Показываем случайное событие с 30% вероятностью
        if (Math.random() < 0.3) {
            setTimeout(() => showRandomEvent(), 1000);
        }

        console.log('Scenario loaded successfully');
    } catch (error) {
        console.error('Error loading next scenario:', error);
    }
}

// Показ случайного события
function showRandomEvent() {
    try {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        const iconElement = document.getElementById('event-icon');
        const titleElement = document.getElementById('event-title');
        const descElement = document.getElementById('event-description');

        if (iconElement) iconElement.className = event.icon;
        if (titleElement) titleElement.textContent = event.title;
        if (descElement) descElement.textContent = event.description;

        const eventPanel = document.getElementById('random-event');
        if (eventPanel) {
            eventPanel.classList.remove('hidden');

            // Применяем эффекты события
            game.applyRandomEvent(event);
            updateGameUI();

            // Скрываем через 3 секунды
            setTimeout(() => {
                eventPanel.classList.add('hidden');
            }, 3000);
        }

        console.log('Random event shown:', event.title);
    } catch (error) {
        console.error('Error showing random event:', error);
    }
}

// Выбор решения
function makeChoice(choice) {
    try {
        console.log('Making choice:', choice.label);
        game.applyChoice(choice);
        updateGameUI();
        showChoiceEffects(choice);
    } catch (error) {
        console.error('Error making choice:', error);
    }
}

// Показ эффектов выбора
function showChoiceEffects(choice) {
    try {
        const mode = GAME_MODES[game.selectedMode];
        if (mode.effectsVisible) {
            const effectsGrid = document.getElementById('effects-grid');
            if (effectsGrid) {
                effectsGrid.innerHTML = '';

                // Показываем эффекты с цветными плашками
                Object.entries(choice.effect).forEach(([key, value]) => {
                    if (key === 'trust' || typeof value !== 'number') return;

                    const effectItem = document.createElement('div');
                    effectItem.className = `effect-item ${value > 0 ? 'positive' : 'negative'}`;
                    
                    let label = '';
                    let displayValue = value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
                    let bgColor = '';

                    switch(key) {
                        case 'gdp':
                            label = 'ВВП';
                            bgColor = 'rgba(31, 184, 205, 0.1)';
                            break;
                        case 'exp':
                            label = 'Экспорт';
                            bgColor = 'rgba(255, 193, 133, 0.1)';
                            break;
                        case 'imp':
                            label = 'Импорт';
                            bgColor = 'rgba(180, 65, 60, 0.1)';
                            break;
                        case 'cpi':
                            label = 'Инфляция';
                            displayValue += '%';
                            bgColor = 'rgba(255, 107, 107, 0.1)';
                            break;
                        case 'unemployment':
                            label = 'Безработица';
                            displayValue += '%';
                            bgColor = 'rgba(78, 205, 196, 0.1)';
                            break;
                    }

                    effectItem.style.backgroundColor = bgColor;
                    effectItem.innerHTML = `
                        <div class="effect-label">${label}</div>
                        <div class="effect-value">${displayValue}</div>
                    `;
                    effectsGrid.appendChild(effectItem);
                });
            }

            // Показываем теорию и историю
            const theoryElement = document.getElementById('economic-theory-text');
            const historyElement = document.getElementById('history-text');
            if (theoryElement) theoryElement.textContent = choice.economicTheory || "Теория недоступна";
            if (historyElement) historyElement.textContent = choice.history || "Исторический пример недоступен";
        }

        const effectsPanel = document.getElementById('choice-effects');
        if (effectsPanel) {
            effectsPanel.classList.remove('hidden');
        }

        console.log('Choice effects shown');
    } catch (error) {
        console.error('Error showing choice effects:', error);
    }
}

// Следующий ход
function nextTurn() {
    try {
        console.log('Advancing to next turn...');
        game.currentTurn++;
        
        if (game.currentTurn > game.totalTurns) {
            endGame();
        } else {
            updateGameUI();
            loadNextScenario();
        }
    } catch (error) {
        console.error('Error advancing turn:', error);
    }
}

// Завершение игры
function endGame() {
    try {
        console.log('Ending game...');
        game.isGameActive = false;
        showScreen('results-screen');
        showResults();
    } catch (error) {
        console.error('Error ending game:', error);
    }
}

// Показ результатов
function showResults() {
    try {
        const detailedScore = game.calculateDetailedScore();
        
        // Показываем общую оценку
        const scoreElement = document.getElementById('final-score');
        if (scoreElement) {
            scoreElement.textContent = detailedScore.total.toString();
        }

        // Показываем разбивку оценки
        const baseScore = document.getElementById('base-score');
        const countryBonus = document.getElementById('country-bonus');
        const decisionsBonus = document.getElementById('decisions-bonus');
        const consistencyBonus = document.getElementById('consistency-bonus');

        if (baseScore) baseScore.textContent = detailedScore.base;
        if (countryBonus) countryBonus.textContent = detailedScore.country;
        if (decisionsBonus) decisionsBonus.textContent = detailedScore.decisions;
        if (consistencyBonus) consistencyBonus.textContent = detailedScore.consistency;

        // Показываем финальные индикаторы
        const finalIndicators = document.getElementById('final-indicators');
        if (finalIndicators) {
            const indicators = [
                {label: 'ВВП индекс', value: game.indicators.gdpIdx.toFixed(1)},
                {label: 'Экспорт', value: game.indicators.expIdx.toFixed(1)},
                {label: 'Импорт', value: game.indicators.impIdx.toFixed(1)},
                {label: 'Инфляция', value: game.indicators.cpi.toFixed(1) + '%'},
                {label: 'Безработица', value: game.indicators.unemployment.toFixed(1) + '%'},
                {label: 'Доверие', value: Math.round(game.trust) + '%'}
            ];

            finalIndicators.innerHTML = indicators.map(indicator => `
                <div class="final-indicator">
                    <div class="final-indicator-label">${indicator.label}</div>
                    <div class="final-indicator-value">${indicator.value}</div>
                </div>
            `).join('');
        }

        // Создаем общий график
        createPerformanceChart();

        // Генерируем анализ
        generatePolicyAnalysis(detailedScore);

        console.log('Results shown');
    } catch (error) {
        console.error('Error showing results:', error);
    }
}

// Создание общего графика производительности
function createPerformanceChart() {
    try {
        const canvas = document.getElementById('performance-chart');
        if (!canvas) {
            console.error('Chart canvas not found');
            return;
        }

        const ctx = canvas.getContext('2d');
        if (game.charts.performance) {
            game.charts.performance.destroy();
        }

        const labels = Array.from({length: game.totalTurns + 2}, (_, i) => `Ход ${i}`);

        game.charts.performance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'ВВП индекс',
                        data: game.chartData.gdp,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Экспорт',
                        data: game.chartData.export,
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Импорт',
                        data: game.chartData.import,
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Инфляция (%)',
                        data: game.chartData.inflation,
                        borderColor: '#FF6B6B',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Безработица (%)',
                        data: game.chartData.unemployment,
                        borderColor: '#4ECDC4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });

        console.log('Performance chart created');
    } catch (error) {
        console.error('Error creating performance chart:', error);
    }
}

// Генерация анализа политики
function generatePolicyAnalysis(score) {
    try {
        let analysis = `
            <div class="analysis-card">
                <h4>🎯 Общая оценка</h4>
                <p>Ваша торговая политика в роли экономического советника ${COUNTRIES[game.selectedCountry].name} 
                показала <strong>${getPerformanceLevel(score.total)}</strong> результаты.</p>
            </div>
        `;

        // Анализ по показателям
        if (game.indicators.gdpIdx > 110) {
            analysis += `
                <div class="analysis-card success">
                    <h4>📈 Экономический рост</h4>
                    <p><strong>Превосходно:</strong> ВВП вырос на ${(game.indicators.gdpIdx - 100).toFixed(1)}%. 
                    Ваши решения успешно стимулировали экономическую активность и повысили производительность.</p>
                </div>
            `;
        } else if (game.indicators.gdpIdx < 90) {
            analysis += `
                <div class="analysis-card warning">
                    <h4>📉 Экономические трудности</h4>
                    <p><strong>Требует внимания:</strong> ВВП снизился на ${(100 - game.indicators.gdpIdx).toFixed(1)}%. 
                    Возможно, протекционистские меры или внешние шоки негативно повлияли на экономику.</p>
                </div>
            `;
        }

        if (game.indicators.expIdx > 120) {
            analysis += `
                <div class="analysis-card success">
                    <h4>🚀 Экспортный успех</h4>
                    <p><strong>Отличный результат:</strong> Экспорт вырос на ${(game.indicators.expIdx - 100).toFixed(1)}%. 
                    Ваша страна успешно укрепила позиции на мировых рынках.</p>
                </div>
            `;
        }

        if (game.indicators.cpi > 4) {
            analysis += `
                <div class="analysis-card warning">
                    <h4>💰 Инфляционные риски</h4>
                    <p><strong>Высокая инфляция:</strong> ${game.indicators.cpi.toFixed(1)}% требует мер по стабилизации цен. 
                    Рассмотрите ужесточение денежно-кредитной политики.</p>
                </div>
            `;
        }

        if (game.indicators.unemployment > 8) {
            analysis += `
                <div class="analysis-card warning">
                    <h4>👥 Проблемы занятости</h4>
                    <p><strong>Высокая безработица:</strong> ${game.indicators.unemployment.toFixed(1)}% указывает на 
                    структурные проблемы рынка труда. Необходимы программы переквалификации и стимулирования спроса.</p>
                </div>
            `;
        }

        // Анализ доверия
        if (game.trust > 70) {
            analysis += `
                <div class="analysis-card success">
                    <h4>🤝 Дипломатический успех</h4>
                    <p><strong>Высокое доверие:</strong> ${Math.round(game.trust)}% открывает новые возможности 
                    для международного сотрудничества и торговых соглашений.</p>
                </div>
            `;
        } else if (game.trust < 30) {
            analysis += `
                <div class="analysis-card warning">
                    <h4>⚠️ Дипломатические сложности</h4>
                    <p><strong>Низкое доверие:</strong> ${Math.round(game.trust)}% может ограничить 
                    торговые возможности и усложнить переговоры в будущем.</p>
                </div>
            `;
        }

        // Рекомендации
        analysis += `
            <div class="analysis-card info">
                <h4>💡 Рекомендации для улучшения</h4>
                <ul>
                    ${score.total < 60 ? '<li>Сосредоточьтесь на балансе между протекционизмом и открытостью</li>' : ''}
                    ${game.indicators.cpi > 3 ? '<li>Примите меры по контролю инфляции</li>' : ''}
                    ${game.trust < 50 ? '<li>Улучшите дипломатические отношения через многосторонние соглашения</li>' : ''}
                    ${game.indicators.unemployment > 6 ? '<li>Инвестируйте в программы занятости и переквалификации</li>' : ''}
                    <li>Изучите экономическую теорию и исторические примеры для принятия более обоснованных решений</li>
                </ul>
            </div>
        `;

        const analysisElement = document.getElementById('policy-analysis');
        if (analysisElement) {
            analysisElement.innerHTML = analysis;
        }

        console.log('Policy analysis generated');
    } catch (error) {
        console.error('Error generating policy analysis:', error);
    }
}

function getPerformanceLevel(score) {
    if (score >= 80) return "выдающиеся";
    if (score >= 60) return "хорошие";
    if (score >= 40) return "удовлетворительные";
    return "неудовлетворительные";
}

// Экспорт PDF
function exportPDF() {
    try {
        if (!window.jspdf) {
            alert('PDF функция временно недоступна');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const studentName = document.getElementById('student-name')?.value || 'Не указано';
        const studentGroup = document.getElementById('student-group')?.value || 'Не указано';

        // Заголовок
        doc.setFontSize(20);
        doc.setTextColor(31, 128, 141);
        doc.text('🌍 Торговые войны V4.0', 20, 20);
        doc.setTextColor(0, 0, 0);
        
        doc.setFontSize(14);
        doc.text('Финансовый университет при Правительстве РФ', 20, 30);

        // Информация о студенте
        doc.setFontSize(12);
        doc.text(`Студент: ${studentName}`, 20, 50);
        doc.text(`Группа: ${studentGroup}`, 20, 60);
        doc.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, 20, 70);

        // Информация об игре
        doc.setFontSize(14);
        doc.setTextColor(31, 128, 141);
        doc.text('Результаты игры', 20, 90);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        doc.text(`Страна: ${COUNTRIES[game.selectedCountry].name} ${COUNTRIES[game.selectedCountry].flag}`, 20, 105);
        doc.text(`Режим: ${game.selectedMode} (${game.totalTurns} ходов = ${game.totalYears} лет)`, 20, 115);
        
        const detailedScore = game.calculateDetailedScore();
        doc.setFontSize(16);
        doc.setTextColor(31, 128, 141);
        doc.text(`Итоговая оценка: ${detailedScore.total}/100`, 20, 130);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        // Разбивка оценки
        doc.text('Детализация оценки:', 20, 145);
        doc.text(`• Базовые очки: ${detailedScore.base}/60`, 25, 155);
        doc.text(`• Бонус за сложность страны: ${detailedScore.country}/15`, 25, 165);
        doc.text(`• Бонус за качество решений: ${detailedScore.decisions}/20`, 25, 175);
        doc.text(`• Бонус за последовательность: ${detailedScore.consistency}/5`, 25, 185);

        // Финальные показатели
        doc.setFontSize(14);
        doc.setTextColor(31, 128, 141);
        doc.text('Финальные показатели:', 20, 205);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        doc.text(`ВВП индекс: ${game.indicators.gdpIdx.toFixed(1)}`, 25, 220);
        doc.text(`Экспорт: ${game.indicators.expIdx.toFixed(1)}`, 25, 230);
        doc.text(`Импорт: ${game.indicators.impIdx.toFixed(1)}`, 25, 240);
        doc.text(`Инфляция: ${game.indicators.cpi.toFixed(1)}%`, 100, 220);
        doc.text(`Безработица: ${game.indicators.unemployment.toFixed(1)}%`, 100, 230);
        doc.text(`Уровень доверия: ${Math.round(game.trust)}%`, 100, 240);

        // Новая страница для лога решений
        doc.addPage();
        doc.setFontSize(16);
        doc.setTextColor(31, 128, 141);
        doc.text('Лог принятых решений', 20, 20);
        doc.setTextColor(0, 0, 0);

        let y = 35;
        game.gameLog.forEach((log, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`Ход ${log.turn} (Год ${log.year}): ${log.scenario}`, 20, y);
            doc.setFont('helvetica', 'normal');
            doc.text(`Решение: ${log.choice}`, 20, y + 10);
            
            // Эффекты
            const effects = Object.entries(log.effects)
                .filter(([key, value]) => key !== 'trust' && typeof value === 'number')
                .map(([key, value]) => {
                    const prefix = value > 0 ? '+' : '';
                    const suffix = (key === 'cpi' || key === 'unemployment') ? '%' : '';
                    return `${key.toUpperCase()}: ${prefix}${value.toFixed(1)}${suffix}`;
                })
                .join(', ');
            
            doc.setFontSize(10);
            doc.text(`Эффекты: ${effects}`, 20, y + 20);
            y += 35;
        });

        // Сохраняем файл
        doc.save(`Торговые_войны_V4_${studentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);

        console.log('PDF exported successfully');
    } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Ошибка при экспорте PDF');
    }
}

// Экспорт лога ходов
function exportGameLog() {
    try {
        let logContent = `Торговые войны V4.0 - Лог игры\n`;
        logContent += `Студент: ${document.getElementById('student-name')?.value || 'Не указано'}\n`;
        logContent += `Группа: ${document.getElementById('student-group')?.value || 'Не указано'}\n`;
        logContent += `Дата: ${new Date().toLocaleDateString('ru-RU')}\n`;
        logContent += `Страна: ${COUNTRIES[game.selectedCountry].name}\n`;
        logContent += `Режим: ${game.selectedMode}\n`;
        logContent += `Итоговая оценка: ${game.calculateDetailedScore().total}/100\n\n`;

        logContent += `=== ДЕТАЛЬНЫЙ ЛОГ РЕШЕНИЙ ===\n\n`;

        game.gameLog.forEach((log, index) => {
            logContent += `ХОД ${log.turn} (ГОД ${log.year})\n`;
            logContent += `Сценарий: ${log.scenario}\n`;
            logContent += `Выбранное решение: ${log.choice}\n`;
            logContent += `Эффекты:\n`;
            
            Object.entries(log.effects).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    const prefix = value > 0 ? '+' : '';
                    const suffix = (key === 'cpi' || key === 'unemployment') ? '%' : '';
                    logContent += `  ${key.toUpperCase()}: ${prefix}${value.toFixed(1)}${suffix}\n`;
                }
            });
            
            logContent += `Экономическая теория: ${log.theory}\n`;
            logContent += `Исторический пример: ${log.history}\n`;
            logContent += `Показатели после хода:\n`;
            logContent += `  ВВП: ${log.indicators.gdpIdx.toFixed(1)}\n`;
            logContent += `  Экспорт: ${log.indicators.expIdx.toFixed(1)}\n`;
            logContent += `  Импорт: ${log.indicators.impIdx.toFixed(1)}\n`;
            logContent += `  Инфляция: ${log.indicators.cpi.toFixed(1)}%\n`;
            logContent += `  Безработица: ${log.indicators.unemployment.toFixed(1)}%\n`;
            logContent += `  Доверие: ${Math.round(log.trust)}%\n`;
            logContent += `\n${'='.repeat(50)}\n\n`;
        });

        // Создаем и скачиваем файл
        const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Торговые_войны_V4_лог_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('Game log exported successfully');
    } catch (error) {
        console.error('Error exporting game log:', error);
        alert('Ошибка при экспорте лога игры');
    }
}

// Новая игра
function newGame() {
    try {
        game = new GameState();
        showScreen('start-screen');

        // Сброс выделений
        document.querySelectorAll('.country-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        updateStartButton();
        console.log('New game initialized');
    } catch (error) {
        console.error('Error starting new game:', error);
    }
}

// Пасхалка
let easterEggState = {
    keySequence: [],
    tapCount: 0,
    tapTimer: null,
    longPressTimer: null
};

function initializeEasterEgg() {
    try {
        // Десктоп: Ctrl+Shift+R -> набрать "6tr0"
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                easterEggState.keySequence = [];
                e.preventDefault();
            } else if (easterEggState.keySequence.length < 4) {
                const target = ['6', 't', 'r', '0'];
                if (e.key === target[easterEggState.keySequence.length]) {
                    easterEggState.keySequence.push(e.key);
                    if (easterEggState.keySequence.length === 4) {
                        activateEasterEgg();
                    }
                } else {
                    easterEggState.keySequence = [];
                }
            }
        });

        // Мобильные: 5 тапов + долгий тап по логотипу
        const logo = document.getElementById('logo-container');
        if (logo) {
            logo.addEventListener('touchstart', (e) => {
                easterEggState.tapCount++;
                if (easterEggState.tapTimer) {
                    clearTimeout(easterEggState.tapTimer);
                }

                easterEggState.tapTimer = setTimeout(() => {
                    easterEggState.tapCount = 0;
                }, 2000);

                if (easterEggState.tapCount === 5) {
                    easterEggState.longPressTimer = setTimeout(() => {
                        activateEasterEgg();
                    }, 1000);
                }
            });

            logo.addEventListener('touchend', () => {
                if (easterEggState.longPressTimer) {
                    clearTimeout(easterEggState.longPressTimer);
                }
            });
        }

        console.log('Easter egg initialized');
    } catch (error) {
        console.error('Error initializing easter egg:', error);
    }
}

function activateEasterEgg() {
    try {
        const modal = document.getElementById('easter-egg-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }

        easterEggState.keySequence = [];
        easterEggState.tapCount = 0;
        console.log('Easter egg activated!');
    } catch (error) {
        console.error('Error activating easter egg:', error);
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing Trade Wars V4.0...');
        
        initializeTheme();
        initializeCountries();
        initializeModes();
        initializeEasterEgg();

        // Обработчики событий
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        const startGameBtn = document.getElementById('start-game');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', startGame);
        }

        const nextTurnBtn = document.getElementById('next-turn');
        if (nextTurnBtn) {
            nextTurnBtn.addEventListener('click', nextTurn);
        }

        const newGameBtn = document.getElementById('new-game');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', newGame);
        }

        const exportBtn = document.getElementById('export-pdf');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportPDF);
        }

        const exportLogBtn = document.getElementById('export-log');
        if (exportLogBtn) {
            exportLogBtn.addEventListener('click', exportGameLog);
        }

        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                const modal = document.getElementById('easter-egg-modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        }

        // Закрытие модального окна при клике вне его
        const easterEggModal = document.getElementById('easter-egg-modal');
        if (easterEggModal) {
            easterEggModal.addEventListener('click', (e) => {
                if (e.target.id === 'easter-egg-modal') {
                    easterEggModal.classList.add('hidden');
                }
            });
        }

        console.log('Trade Wars V4.0 initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('Ошибка при инициализации приложения. Пожалуйста, обновите страницу.');
    }
});