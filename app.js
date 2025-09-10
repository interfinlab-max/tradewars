/* === ПАСХАЛКА R6TR0 DRAGON === 
ПК: Ctrl + Shift + R, затем набрать "6tr0" 
Мобильные: 5 быстрых тапов по лого, затем долгий тап 2 сек
ASCII Dragon:
______________
|            /
| R6TR0     / 
/        /\  /\ 
|___________/ 
(   . .)  <===(
 \ U /        |
  ___\___/______|
|               |
|   LEGENDARY   |
|   DEVELOPER   |
|_______________|
*/

// Версия игры
const GAME_VERSION = "v2.1.0";

// Игровые данные
const gameData = {
    baseState: {
        gdpIdx: 100.0,
        expIdx: 100.0,
        impIdx: 100.0,
        cpi: 2.0,
        unemployment: 5.0
    },
    stepsNormal: 15, // Статичные сценарии
    stepsAdvanced: 15, // Рандомные сценарии
    totalScenarios: 100,
    countries: {
        US: {
            name: "США",
            flag: "🇺🇸",
            difficulty: "Легкая",
            bonus: 3,
            specialties: ["технологии", "финансы", "энергетика", "агропром"],
            base_modifiers: {
                gdpIdx: 10,
                expIdx: 0,
                impIdx: 10,
                cpi: -0.3,
                unemployment: -0.5
            }
        },
        CN: {
            name: "Китай",
            flag: "🇨🇳",
            difficulty: "Простая",
            bonus: 5,
            specialties: ["производство", "экспорт", "технологии", "инфраструктура"],
            base_modifiers: {
                gdpIdx: 8,
                expIdx: 15,
                impIdx: 5,
                cpi: 0.2,
                unemployment: -1.5
            }
        },
        DE: {
            name: "Германия",
            flag: "🇩🇪",
            difficulty: "Средняя",
            bonus: 8,
            specialties: ["автопром", "машиностроение", "химия", "экспорт"],
            base_modifiers: {
                gdpIdx: 5,
                expIdx: 8,
                impIdx: 3,
                cpi: -0.5,
                unemployment: -1.0
            }
        },
        JP: {
            name: "Япония",
            flag: "🇯🇵",
            difficulty: "Сложная",
            bonus: 10,
            specialties: ["технологии", "автопром", "робототехника", "точное машиностроение"],
            base_modifiers: {
                gdpIdx: 3,
                expIdx: 5,
                impIdx: 8,
                cpi: -0.8,
                unemployment: -0.3
            }
        },
        RU: {
            name: "Россия",
            flag: "🇷🇺",
            difficulty: "Очень сложная",
            bonus: 12,
            specialties: ["энергетика", "сырьё", "IT", "оборонпром"],
            base_modifiers: {
                gdpIdx: 0,
                expIdx: 5,
                impIdx: -3,
                cpi: 0.5,
                unemployment: 1.0
            }
        },
        BR: {
            name: "Бразилия",
            flag: "🇧🇷",
            difficulty: "Экстремально сложная",
            bonus: 15,
            specialties: ["агропром", "сырьё", "энергетика", "металлургия"],
            base_modifiers: {
                gdpIdx: -2,
                expIdx: 3,
                impIdx: -5,
                cpi: 1.5,
                unemployment: 2.0
            }
        }
    },
    trustWeights: {
        "переговоры": 8,
        "право": 7,
        "открытость": 7,
        "диверсификация": 6,
        "устойчивость": 5,
        "субсидии": 2,
        "санкции": -6,
        "техконтроль": -5,
        "эскалация": -8,
        "квоты": -6,
        "safeguard": -5,
        "протекционизм": -7,
        "тарифы": -4
    }
};

// Случайные события от других стран
const randomEvents = {
    supportive: [
        {
            text: "ЕС предложил льготную торговую квоту в знак солидарности",
            effect: { gdp: 0.3, exp: 0.8, imp: 0.2, cpi: -0.1, unemployment: -0.2 }
        },
        {
            text: "Япония инвестировала в ваши зеленые технологии",
            effect: { gdp: 0.5, exp: 0.3, imp: 0.1, cpi: 0.0, unemployment: -0.3 }
        },
        {
            text: "США открыли дополнительный доступ к своему рынку",
            effect: { gdp: 0.4, exp: 1.2, imp: 0.0, cpi: -0.1, unemployment: -0.2 }
        },
        {
            text: "Китай предложил совместные инфраструктурные проекты",
            effect: { gdp: 0.6, exp: 0.4, imp: 0.3, cpi: 0.1, unemployment: -0.4 }
        },
        {
            text: "Международный валютный фонд одобрил льготный кредит",
            effect: { gdp: 0.8, exp: 0.2, imp: 0.5, cpi: 0.2, unemployment: -0.3 }
        }
    ],
    neutral: [
        {
            text: "Мировые рынки остались нейтральны к вашему решению",
            effect: { gdp: 0.0, exp: 0.0, imp: 0.0, cpi: 0.0, unemployment: 0.0 }
        },
        {
            text: "Торговые партнеры заняли выжидательную позицию",
            effect: { gdp: 0.1, exp: 0.0, imp: 0.0, cpi: 0.0, unemployment: 0.0 }
        },
        {
            text: "Международные рейтинговые агентства воздержались от оценок",
            effect: { gdp: 0.0, exp: 0.1, imp: 0.0, cpi: 0.0, unemployment: 0.0 }
        }
    ],
    hostile: [
        {
            text: "Конкуренты ввели ответные торговые ограничения",
            effect: { gdp: -0.4, exp: -0.8, imp: -0.3, cpi: 0.2, unemployment: 0.3 }
        },
        {
            text: "Крупный инвестор отозвал средства из вашей экономики",
            effect: { gdp: -0.6, exp: -0.2, imp: -0.4, cpi: 0.1, unemployment: 0.4 }
        },
        {
            text: "Торговые партнеры пересматривают условия соглашений",
            effect: { gdp: -0.3, exp: -0.6, imp: 0.0, cpi: 0.1, unemployment: 0.2 }
        },
        {
            text: "Международные санкции ограничили доступ к технологиям",
            effect: { gdp: -0.5, exp: -0.4, imp: -0.8, cpi: 0.3, unemployment: 0.5 }
        },
        {
            text: "Курс национальной валюты упал из-за недоверия инвесторов",
            effect: { gdp: -0.4, exp: 0.2, imp: -0.6, cpi: 0.4, unemployment: 0.3 }
        }
    ]
};

// Расширенные сценарии (100 сценариев)
const scenarios = {
    // Статичные сценарии для нормального режима (15 шт)
    static: [
        {
            id: "steel-dumping",
            text: "Демпинг стали давит на отрасль. Что делаем?",
            choices: [
                {
                    id: "high-tariff",
                    icon: "fa-solid fa-industry",
                    label: "Высокие тарифы (нацбезопасность)",
                    hint: "Быстрая защита → риск ответных мер",
                    effect: { gdp: -1.3, exp: -1.9, imp: -2.5, cpi: 0.3, unemployment: -0.5 },
                    tags: ["тарифы", "эскалация"],
                    economicTheory: "Тарифы создают мертвый груз потерь для общества. По теории Стиглица, тарифы снижают общественное благосостояние, поскольку потери потребителей превышают выгоды производителей и налоговые поступления. В краткосрочной перспективе тарифы защищают отечественную промышленность от недобросовестной конкуренции, но в долгосрочной перспективе снижают стимулы к инновациям и повышают цены для потребителей.",
                    history: "В 2018 году администрация Трампа ввела пошлины на импорт стали в размере 25% и алюминия в размере 10% согласно разделу 232 о национальной безопасности. Меры затронули импорт на $48 млрд и вызвали ответные действия от ЕС ($3.2 млрд), Канады ($12.8 млрд), Мексики ($3 млрд), Турции ($1.8 млрд) и других стран. Исследования Peterson Institute показали, что пошлины привели к росту цен на сталь на 30%, потере 75,000 рабочих мест в отраслях-потребителях стали, но сохранению 8,700 мест в сталелитейной промышленности."
                },
                {
                    id: "anti-dumping",
                    icon: "fa-solid fa-scale-balanced",
                    label: "Антидемпинговые меры (точечно)",
                    hint: "Следуем процедурам и таргетируем",
                    effect: { gdp: 0.3, exp: -0.4, imp: -1.0, cpi: 0.1, unemployment: -0.2 },
                    tags: ["право"],
                    economicTheory: "Антидемпинговые меры базируются на принципе справедливой торговли из теории Винера-Джонсона. Они направлены против продажи товаров ниже себестоимости или ниже цен на внутреннем рынке экспортера. Однако практическое определение 'нормальной стоимости' сложно и часто политизировано. Согласно исследованиям Блондера и Франсуа, антидемпинговые меры часто используются как завуалированный протекционизм.",
                    history: "ЕС применял антидемпинговые меры против китайской стали с 2013 по 2018 год, установив пошлины от 17.2% до 73.7% на различные виды стальной продукции. Это помогло европейским производителям: ArcelorMittal увеличил прибыль на 40%, Tata Steel восстановил рентабельность. Однако цены на сталь выросли на 15-20%, что увеличило издержки автопроизводителей (Volkswagen, BMW) и строительных компаний. Китайский экспорт перенаправился в Африку и Латинскую Америку."
                },
                {
                    id: "wait-see",
                    icon: "fa-regular fa-clock",
                    label: "Выжидать",
                    hint: "Цены низкие, но отрасль страдает",
                    effect: { gdp: -0.6, exp: 0.0, imp: 1.5, cpi: -0.2, unemployment: 0.8 },
                    tags: ["открытость"],
                    economicTheory: "Подход невмешательства основан на классической теории сравнительных преимуществ Рикардо и современной теории оптимальной торговой политики Самуэльсона. Свободная торговля максимизирует общественное благосостояние через специализацию и эффективное размещение ресурсов. Краткосрочные потери в неконкурентоспособных отраслях компенсируются долгосрочными выгодами для экономики в целом.",
                    history: "Великобритания в 1846 году отменила Хлебные законы (тарифы на импорт зерна), несмотря на сопротивление землевладельцев. Отмена привела к падению цен на хлеб на 25%, краткосрочным трудностям в сельском хозяйстве (банкротство 15% фермеров), но стимулировала промышленность и торговлю. ВВП Великобритании рос на 2.5% ежегодно в 1850-1870 годах, реальные доходы рабочих выросли на 40%, страна стала 'мастерской мира'."
                }
            ]
        },
        {
            id: "energy-crisis",
            text: "Энергетический кризис: цены на газ выросли в 3 раза. Ваши действия?",
            choices: [
                {
                    id: "subsidies-energy",
                    icon: "fa-solid fa-fire",
                    label: "Субсидировать энергию",
                    hint: "Поддержка бизнеса и населения",
                    effect: { gdp: 0.8, exp: 0.5, imp: 2.0, cpi: -0.5, unemployment: -1.2 },
                    tags: ["субсидии"],
                    economicTheory: "Энергетические субсидии представляют собой пример корректирующей фискальной политики в теории Кейнса. Они снижают издержки производства, поддерживая экономическую активность в период шока. Однако создают фискальное бремя и искажают ценовые сигналы, что может привести к перепотреблению энергии и снижению стимулов к энергосбережению. Теория общественного выбора Бьюкенена предупреждает о сложности отмены субсидий в будущем из-за лоббистского давления.",
                    history: "Европа в 2022-2023 годах выделила более €780 млрд на энергетические субсидии. Германия потратила €264 млрд (7.5% ВВП): €200 млрд на 'двойной тормоз' и €64 млрд на дополнительные меры. Это предотвратило энергетическую бедность (затраты на энергию остались в пределах 6% доходов), массовые банкротства промышленности, но привело к росту госдолга Германии с 69% до 84% ВВП и создало зависимость бизнеса от государственной поддержки."
                },
                {
                    id: "market-forces",
                    icon: "fa-solid fa-chart-line",
                    label: "Позволить рынку адаптироваться",
                    hint: "Высокие цены стимулируют экономию",
                    effect: { gdp: -2.1, exp: -1.5, imp: -0.5, cpi: 1.8, unemployment: 2.5 },
                    tags: ["открытость"],
                    economicTheory: "Рыночная адаптация основана на австрийской школе экономики (Мизес, Хайек) и теории эффективных рынков Фамы. Высокие цены служат информационным сигналом, стимулирующим энергосбережение, инвестиции в альтернативные источники и технологические инновации. Кратковременная рецессия ускоряет структурную перестройку экономики в сторону энергоэффективности, создавая долгосрочные конкурентные преимущества.",
                    history: "После нефтяных кризисов 1973 и 1979 годов страны выбрали разные стратегии. США и большинство европейских стран, не субсидировавшие топливо, добились впечатляющих результатов: энергоемкость ВВП США снизилась на 60% с 1970 по 2010 год. Япония стала лидером энергоэффективности, снизив энергопотребление на единицу ВВП на 37%. Дания инвестировала в ветроэнергетику, к 2020 году 80% электричества производилось из возобновляемых источников."
                },
                {
                    id: "strategic-reserves",
                    icon: "fa-solid fa-warehouse",
                    label: "Использовать стратегические резервы",
                    hint: "Краткосрочное решение",
                    effect: { gdp: 0.3, exp: 0.0, imp: 0.5, cpi: -0.8, unemployment: -0.3 },
                    tags: ["устойчивость"],
                    economicTheory: "Стратегические резервы представляют форму экономического страхования против внешних шоков в теории портфельного управления Марковица. Они служат буфером против волатильности цен и обеспечивают энергетическую безопасность. Однако их использование — временная мера, требующая тщательного управления для избежания проциклических эффектов и истощения резервов в критический момент.",
                    history: "США создали Стратегический нефтяной резерв в 1975 году после первого нефтяного кризиса. В 2022 году администрация Байдена выпустила рекордные 180 млн баррелей (26% от общего объема) для стабилизации цен после начала конфликта в Украине. Это помогло снизить цены на бензин с $5.01 до $3.68 за галлон, сэкономив американским потребителям около $100 млрд. Однако резервы сократились до 351 млн баррелей — минимума с 1984 года."
                }
            ]
        },
        // Добавляем остальные 13 статичных сценариев...
        {
            id: "trade-war",
            text: "Торговая война эскалирует: партнёр угрожает пошлинами на $200 млрд товаров.",
            choices: [
                {
                    id: "retaliate",
                    icon: "fa-solid fa-fist-raised",
                    label: "Симметричный ответ",
                    hint: "Око за око",
                    effect: { gdp: -1.8, exp: -2.3, imp: -1.7, cpi: 0.9, unemployment: 1.4 },
                    tags: ["эскалация", "тарифы"],
                    economicTheory: "Торговые войны анализируются через призму теории игр Нэша и модель 'дилеммы заключенного' в международной торговле. Стратегия возмездия может сдержать агрессивные действия партнера (credible threat), но взаимная эскалация часто приводит к равновесию Нэша с доминированием, где обе стороны проигрывают. Модели CGE показывают, что торговые войны снижают глобальный ВВП на 1-2% через разрушение цепочек создания стоимости.",
                    history: "Торговая война США-Китай 2018-2020 стала крупнейшей после войны Смут-Хоули 1930 года. США наложили пошлины на китайские товары на $360 млрд, Китай ответил на $185 млрд американского экспорта. Исследование Federal Reserve показало: американский ВВП снизился на 0.3%, китайский — на 0.8%. Потребители США заплатили дополнительно $51 млрд в виде более высоких цен. Торговый дефицит США с Китаем практически не изменился, но перенаправился через Вьетнам и Мексику."
                },
                {
                    id: "negotiate",
                    icon: "fa-solid fa-handshake",
                    label: "Предложить переговоры",
                    hint: "Поиск компромисса",
                    effect: { gdp: 0.4, exp: 0.8, imp: 0.6, cpi: -0.2, unemployment: -0.5 },
                    tags: ["переговоры", "открытость"],
                    economicTheory: "Теория торговых переговоров Багвелла-Стайгера основана на концепции взаимовыгодных соглашений при учете внешних эффектов торговой политики. Успешные переговоры требуют 'проблемно-ориентированного' подхода с взаимными уступками в разных сферах, создавая пакетные сделки (package deals), которые максимизируют совокупные выгоды. Теория повторяющихся игр показывает, что долгосрочные отношения стабилизируют сотрудничество.",
                    history: "Переговоры по НАФТА 1991-1993 годов превратили торговые споры в крупнейшую зону свободной торговли. США отказались от протекционизма в сельском хозяйстве, Мексика — от ограничений на иностранные инвестиции, Канада — от культурных исключений. Трехсторонний товарооборот вырос с $290 млрд в 1993 до $1.3 трлн в 2020 году. НАФТА создала 6 млн рабочих мест, повысила производительность на 25%, интегрировала североамериканские цепочки поставок."
                }
            ]
        }
        // ... остальные статичные сценарии
    ],
    
    // Общие сценарии для всех стран (67 сценариев)
    general: [
        {
            id: "wto-dispute",
            text: "В ВТО подана жалоба на наши субсидии. Как реагировать?",
            choices: [
                {
                    id: "defend-subsidies",
                    icon: "fa-solid fa-shield",
                    label: "Защищать субсидии",
                    hint: "Национальные интересы важнее",
                    effect: { gdp: 0.5, exp: 0.8, imp: -0.3, cpi: 0.2, unemployment: -0.8 },
                    tags: ["протекционизм"]
                },
                {
                    id: "comply-wto",
                    icon: "fa-solid fa-balance-scale",
                    label: "Соблюдать правила ВТО",
                    hint: "Международное право превыше всего",
                    effect: { gdp: -0.8, exp: -0.5, imp: 0.5, cpi: -0.1, unemployment: 1.2 },
                    tags: ["право", "открытость"]
                }
            ]
        }
        // ... добавить остальные 66 общих сценариев
    ],
    
    // Уникальные сценарии для каждой страны (33 сценария)
    country_specific: {
        US: [
            {
                id: "us-tech-export",
                text: "Конгресс обсуждает ограничения на экспорт полупроводников. Позиция администрации?",
                choices: [
                    {
                        id: "tech-restrictions",
                        icon: "fa-solid fa-microchip",
                        label: "Поддержать ограничения",
                        hint: "Национальная безопасность превыше прибыли",
                        effect: { gdp: -0.8, exp: -2.1, imp: -0.4, cpi: 0.3, unemployment: 0.6 },
                        tags: ["техконтроль", "санкции"]
                    },
                    {
                        id: "free-tech-trade",
                        icon: "fa-solid fa-globe",
                        label: "Сохранить свободную торговлю",
                        hint: "Американские компании должны конкурировать",
                        effect: { gdp: 0.6, exp: 1.2, imp: 0.3, cpi: -0.1, unemployment: -0.4 },
                        tags: ["открытость"]
                    }
                ]
            }
            // ... остальные 32 US сценария
        ],
        CN: [
            {
                id: "cn-belt-road",
                text: "Партнеры просят увеличить финансирование проектов 'Пояса и пути'. Решение?",
                choices: [
                    {
                        id: "expand-bri",
                        icon: "fa-solid fa-road",
                        label: "Увеличить инвестиции",
                        hint: "Укрепляем геополитическое влияние",
                        effect: { gdp: -0.5, exp: 1.8, imp: 0.4, cpi: 0.2, unemployment: -0.3 },
                        tags: ["диверсификация"]
                    },
                    {
                        id: "focus-domestic",
                        icon: "fa-solid fa-home",
                        label: "Сосредоточиться на внутреннем рынке",
                        hint: "Приоритет развитию внутри страны",
                        effect: { gdp: 1.2, exp: -0.8, imp: -0.2, cpi: -0.1, unemployment: -0.8 },
                        tags: ["устойчивость"]
                    }
                ]
            }
            // ... остальные 32 CN сценария
        ],
        // Аналогично для остальных стран...
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
    randomEvents: [],
    charts: {},
    usedScenarios: [],
    availableScenarios: [],
    theme: 'auto'
};

// Переменные для пасхалки
let logoTapCount = 0;
let logoTapTimer = null;
let keySequence = '';
let keySequenceTimer = null;
let keySequenceActive = false;

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация игры...');
    initializeGame();
});

function initializeGame() {
    renderCountries();
    setupEventListeners();
    initializeTheme();
    setupEasterEgg();
    showScreen('start');
    updateVersionInfo();
}

function updateVersionInfo() {
    document.querySelectorAll('.game-version').forEach(el => {
        el.textContent = GAME_VERSION;
    });
}

// Система тем
function initializeTheme() {
    const savedTheme = localStorage.getItem('trade-wars-theme') || 'auto';
    gameState.theme = savedTheme;
    applyTheme(savedTheme);
    updateThemeIcon(savedTheme);
}

function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.setAttribute('data-color-scheme', 'dark');
    } else if (theme === 'light') {
        root.setAttribute('data-color-scheme', 'light');
    } else {
        root.removeAttribute('data-color-scheme');
    }
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (!icon) return;
    
    if (theme === 'dark') {
        icon.className = 'fas fa-moon';
    } else if (theme === 'light') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-circle-half-stroke';
    }
}

function toggleTheme() {
    const themes = ['auto', 'light', 'dark'];
    const currentIndex = themes.indexOf(gameState.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    gameState.theme = nextTheme;
    localStorage.setItem('trade-wars-theme', nextTheme);
    applyTheme(nextTheme);
    updateThemeIcon(nextTheme);
}

// Генерация случайных событий
function generateRandomEvent(choice, scenarioTags) {
    const isCooperativeChoice = choice.tags && (
        choice.tags.includes('переговоры') || 
        choice.tags.includes('открытость') || 
        choice.tags.includes('право')
    );
    
    const isAggressiveChoice = choice.tags && (
        choice.tags.includes('эскалация') || 
        choice.tags.includes('санкции') || 
        choice.tags.includes('протекционизм')
    );
    
    let eventType = 'neutral';
    const rand = Math.random();
    
    if (isCooperativeChoice) {
        eventType = rand < 0.7 ? 'supportive' : rand < 0.9 ? 'neutral' : 'hostile';
    } else if (isAggressiveChoice) {
        eventType = rand < 0.6 ? 'hostile' : rand < 0.8 ? 'neutral' : 'supportive';
    } else {
        eventType = rand < 0.3 ? 'supportive' : rand < 0.7 ? 'neutral' : 'hostile';
    }
    
    const events = randomEvents[eventType];
    return events[Math.floor(Math.random() * events.length)];
}

// Инициализация доступных сценариев
function initializeScenarios() {
    gameState.usedScenarios = [];
    
    if (gameState.gameMode === 'normal') {
        gameState.availableScenarios = [...scenarios.static];
    } else {
        // Для сложного и слепого режимов
        const generalScenarios = scenarios.general || [];
        const countrySpecific = scenarios.country_specific[gameState.selectedCountry] || [];
        
        gameState.availableScenarios = [
            ...generalScenarios,
            ...countrySpecific
        ];
        
        // Перемешиваем сценарии
        gameState.availableScenarios = shuffleArray(gameState.availableScenarios);
    }
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Получение следующего сценария
function getNextScenario() {
    let scenario;
    
    if (gameState.gameMode === 'normal') {
        // Статичные сценарии в определенном порядке
        scenario = gameState.availableScenarios[gameState.currentTurn];
    } else {
        // Случайный выбор из доступных
        const availableNow = gameState.availableScenarios.filter(
            s => !gameState.usedScenarios.includes(s.id)
        );
        
        if (availableNow.length === 0) {
            // Если сценарии закончились, перемешиваем заново
            gameState.usedScenarios = [];
            scenario = gameState.availableScenarios[0];
        } else {
            scenario = availableNow[Math.floor(Math.random() * availableNow.length)];
        }
    }
    
    return scenario;
}

// Пасхалка
function setupEasterEgg() {
    // Обработчик для ПК (Ctrl + Shift + R, затем "6tr0")
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            keySequence = '';
            keySequenceActive = true;
            console.log('Easter egg sequence activated');
            
            clearTimeout(keySequenceTimer);
            keySequenceTimer = setTimeout(() => {
                keySequence = '';
                keySequenceActive = false;
            }, 5000);
            return;
        }
        
        if (keySequenceActive) {
            keySequence += e.key.toLowerCase();
            console.log('Key sequence:', keySequence);
            
            if (keySequence.includes('6tr0')) {
                showDragonEasterEgg();
                keySequence = '';
                keySequenceActive = false;
                clearTimeout(keySequenceTimer);
            }
        }
    });
    
    // Обработчик для мобильных устройств (5 тапов по лого + долгий тап)
    const logoSection = document.getElementById('logoSection');
    if (logoSection) {
        logoSection.addEventListener('click', handleLogoTap);
        logoSection.addEventListener('touchend', handleLogoTap);
        
        // Долгий тап
        let longTapTimer;
        
        logoSection.addEventListener('mousedown', function() {
            if (logoTapCount >= 5) {
                longTapTimer = setTimeout(() => {
                    showDragonEasterEgg();
                    logoTapCount = 0;
                }, 2000);
            }
        });
        
        logoSection.addEventListener('touchstart', function() {
            if (logoTapCount >= 5) {
                longTapTimer = setTimeout(() => {
                    showDragonEasterEgg();
                    logoTapCount = 0;
                }, 2000);
            }
        });
        
        logoSection.addEventListener('mouseup', function() {
            clearTimeout(longTapTimer);
        });
        
        logoSection.addEventListener('touchend', function() {
            clearTimeout(longTapTimer);
        });
    }
}

function handleLogoTap(e) {
    e.preventDefault();
    logoTapCount++;
    console.log('Logo tap count:', logoTapCount);
    
    clearTimeout(logoTapTimer);
    logoTapTimer = setTimeout(() => {
        logoTapCount = 0;
    }, 3000);
    
    if (logoTapCount >= 5) {
        logoTapCount = 5; // Останавливаем на 5
    }
}

function showDragonEasterEgg() {
    console.log('Showing dragon easter egg!');
    const dragon = document.getElementById('dragonEasterEgg');
    if (dragon) {
        dragon.classList.remove('hidden');
        setTimeout(() => {
            dragon.classList.add('hidden');
        }, 3000);
    }
}

// Отображение стран
function renderCountries() {
    const countriesGrid = document.getElementById('countriesGrid');
    if (!countriesGrid) return;
    
    countriesGrid.innerHTML = '';
    
    Object.entries(gameData.countries).forEach(([code, country]) => {
        const countryCard = document.createElement('div');
        countryCard.className = 'country-card';
        countryCard.setAttribute('data-country', code);
        
        countryCard.innerHTML = `
            <div class="country-difficulty">${country.difficulty}</div>
            <div class="country-flag">${country.flag}</div>
            <div class="country-name">${country.name}</div>
            <div class="country-specialties">${country.specialties.join(', ')}</div>
            <div class="country-bonus">Бонус: +${country.bonus} баллов</div>
        `;
        
        countryCard.addEventListener('click', function() {
            selectCountry(code);
        });
        
        countriesGrid.appendChild(countryCard);
    });
}

// Выбор страны
function selectCountry(countryCode) {
    gameState.selectedCountry = countryCode;
    
    // Обновляем UI
    document.querySelectorAll('.country-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`[data-country="${countryCode}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    updateStartButton();
}

// Обновление кнопки старта
function updateStartButton() {
    const startBtn = document.getElementById('startBtn');
    const selectedCountry = gameState.selectedCountry;
    const selectedMode = document.querySelector('input[name="gameMode"]:checked')?.value;
    
    if (startBtn) {
        startBtn.disabled = !selectedCountry || !selectedMode;
        
        if (selectedCountry && selectedMode) {
            const country = gameData.countries[selectedCountry];
            startBtn.innerHTML = `<i class="fas fa-play"></i> Начать игру за ${country.name}`;
        } else {
            startBtn.innerHTML = `<i class="fas fa-play"></i> Начать игру`;
        }
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопка переключения темы
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Радио кнопки режимов игры
    document.querySelectorAll('input[name="gameMode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            gameState.gameMode = this.value;
            updateStartButton();
        });
    });
    
    // Кнопка старта игры
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    
    // Кнопка следующего хода
    const nextBtn = document.getElementById('nextTurnBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTurn);
    }
    
    // Кнопка новой игры
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', newGame);
    }
    
    // Кнопка экспорта PDF
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportToPDF);
    }
}

// Начало игры
function startGame() {
    if (!gameState.selectedCountry || !gameState.gameMode) return;
    
    // Применяем базовые модификаторы страны
    const country = gameData.countries[gameState.selectedCountry];
    Object.entries(country.base_modifiers).forEach(([key, value]) => {
        gameState.economicState[key] += value;
    });
    
    // Инициализируем сценарии
    initializeScenarios();
    
    // Сбрасываем состояние
    gameState.currentTurn = 0;
    gameState.history = [];
    gameState.randomEvents = [];
    gameState.trust = 50;
    
    showScreen('game');
    loadScenario();
}

// Загрузка сценария
function loadScenario() {
    const totalSteps = gameState.gameMode === 'normal' ? 
        gameData.stepsNormal : gameData.stepsAdvanced;
    
    if (gameState.currentTurn >= totalSteps) {
        showResults();
        return;
    }
    
    const scenario = getNextScenario();
    if (!scenario) {
        showResults();
        return;
    }
    
    gameState.currentScenario = scenario;
    gameState.usedScenarios.push(scenario.id);
    
    updateGameProgress();
    updateIndicators();
    renderScenario(scenario);
    updateCharts();
}

// Отображение игрового процесса
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(`${screenName}Screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    gameState.currentScreen = screenName;
}

// Обновление прогресса игры
function updateGameProgress() {
    const progressInfo = document.getElementById('progressInfo');
    const progressFill = document.getElementById('progressFill');
    const country = gameData.countries[gameState.selectedCountry];
    
    const totalSteps = gameState.gameMode === 'normal' ? 
        gameData.stepsNormal : gameData.stepsAdvanced;
    
    if (progressInfo) {
        progressInfo.innerHTML = `
            <div>
                <h1>${country.flag} ${country.name}</h1>
                <p>Режим: ${getModeDisplayName()}</p>
            </div>
            <div>
                <p>Ход ${gameState.currentTurn + 1} из ${totalSteps}</p>
                <p>Доверие: ${Math.round(gameState.trust)}</p>
            </div>
        `;
    }
    
    if (progressFill) {
        const progress = ((gameState.currentTurn + 1) / totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

function getModeDisplayName() {
    const modes = {
        'normal': 'Нормальный',
        'hard': 'Сложный', 
        'blind': 'Слепой'
    };
    return modes[gameState.gameMode] || 'Неизвестный';
}

// Обновление индикаторов
function updateIndicators() {
    const indicators = [
        { id: 'gdpIndicator', key: 'gdpIdx', format: (v) => v.toFixed(1) },
        { id: 'expIndicator', key: 'expIdx', format: (v) => v.toFixed(1) },
        { id: 'impIndicator', key: 'impIdx', format: (v) => v.toFixed(1) },
        { id: 'cpiIndicator', key: 'cpi', format: (v) => v.toFixed(1) + '%' },
        { id: 'unemploymentIndicator', key: 'unemployment', format: (v) => v.toFixed(1) + '%' }
    ];
    
    indicators.forEach(({ id, key, format }) => {
        const element = document.getElementById(id);
        if (element) {
            const value = gameState.economicState[key];
            const baseValue = gameData.baseState[key];
            const change = value - baseValue;
            
            element.querySelector('.value').textContent = format(value);
            
            // Определяем класс изменения
            let changeClass = 'neutral';
            if (key === 'cpi' || key === 'unemployment') {
                changeClass = change < -0.1 ? 'positive' : change > 0.1 ? 'negative' : 'neutral';
            } else {
                changeClass = change > 0.1 ? 'positive' : change < -0.1 ? 'negative' : 'neutral';
            }
            
            element.className = `indicator ${changeClass}`;
        }
    });
}

// Отображение сценария
function renderScenario(scenario) {
    const scenarioHeader = document.getElementById('scenarioHeader');
    const scenarioText = document.getElementById('scenarioText');
    const choicesContainer = document.getElementById('choicesContainer');
    
    if (scenarioHeader) {
        scenarioHeader.textContent = `Сценарий ${gameState.currentTurn + 1}`;
    }
    
    if (scenarioText) {
        scenarioText.textContent = scenario.text;
    }
    
    if (choicesContainer) {
        choicesContainer.innerHTML = '';
        
        scenario.choices.forEach(choice => {
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
    }
    
    // Скрываем панель эффектов при новом сценарии
    document.getElementById('effectsPanel').style.display = 'none';
}

// Выбор варианта действий
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

// Отображение эффектов
function showEffects(choice) {
    const effectsPanel = document.getElementById('effectsPanel');
    const effectsGrid = document.getElementById('effectsGrid');
    const economicTheoryText = document.getElementById('economicTheoryText');
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
    }
    
    // Отображаем экономическую теорию и историю
    if (economicTheoryText && choice.economicTheory) {
        economicTheoryText.textContent = choice.economicTheory;
        economicTheoryText.parentElement.style.display = 'block';
    } else if (economicTheoryText) {
        economicTheoryText.parentElement.style.display = 'none';
    }
    
    if (historicalText && choice.history) {
        historicalText.textContent = choice.history;
        historicalText.parentElement.style.display = 'block';
    } else if (historicalText) {
        historicalText.parentElement.style.display = 'none';
    }
    
    effectsPanel.style.display = 'block';
    nextBtn.disabled = false;
}

// Умножение эффектов (для сложного режима)
function multiplyEffects(effects, multiplier) {
    const result = {};
    Object.entries(effects).forEach(([key, value]) => {
        result[key] = value * multiplier;
    });
    return result;
}

// Следующий ход
function nextTurn() {
    if (!gameState.selectedChoice) return;
    
    const choice = gameState.selectedChoice;
    const effects = gameState.gameMode === 'hard' ? 
        multiplyEffects(choice.effect, 1.5) : choice.effect;
    
    // Генерируем случайное событие
    const randomEvent = generateRandomEvent(choice, gameState.currentScenario.tags);
    
    // Применяем основные эффекты
    Object.entries(effects).forEach(([key, value]) => {
        gameState.economicState[key] += value;
    });
    
    // Применяем случайное событие
    Object.entries(randomEvent.effect).forEach(([key, value]) => {
        gameState.economicState[key] += value;
    });
    
    // Обновляем доверие
    updateTrust(choice);
    
    // Сохраняем в истории
    gameState.history.push({
        turn: gameState.currentTurn + 1,
        scenario: gameState.currentScenario.text,
        choice: choice.label,
        effects: effects,
        randomEvent: randomEvent,
        state: { ...gameState.economicState },
        trust: gameState.trust
    });
    
    gameState.randomEvents.push(randomEvent);
    
    // Переходим к следующему ходу
    gameState.currentTurn++;
    gameState.selectedChoice = null;
    
    loadScenario();
}

// Обновление доверия
function updateTrust(choice) {
    if (!choice.tags) return;
    
    let trustChange = 0;
    choice.tags.forEach(tag => {
        if (gameData.trustWeights[tag]) {
            trustChange += gameData.trustWeights[tag];
        }
    });
    
    gameState.trust = Math.max(0, Math.min(100, gameState.trust + trustChange));
}

// Обновление графиков
function updateCharts() {
    // Здесь можно добавить код для обновления графиков
    // Пока оставим заглушку
}

// Показать результаты
function showResults() {
    calculateFinalScore();
    showScreen('results');
    renderResults();
    createFinalChart();
}

// Расчет финального счета
function calculateFinalScore() {
    const country = gameData.countries[gameState.selectedCountry];
    const state = gameState.economicState;
    const base = gameData.baseState;
    
    // Вычисляем изменения
    gameState.changes = {
        gdp: state.gdpIdx - base.gdpIdx,
        exp: state.expIdx - base.expIdx,
        imp: state.impIdx - base.impIdx,
        cpi: state.cpi - base.cpi,
        unemployment: state.unemployment - base.unemployment
    };
    
    // Базовые очки (0-60)
    let baseScore = 30; // Стартовые очки
    baseScore += Math.max(-15, Math.min(15, gameState.changes.gdp * 1.5));
    baseScore += Math.max(-10, Math.min(10, gameState.changes.exp * 1.0));
    baseScore += Math.max(-10, Math.min(10, -gameState.changes.cpi * 5));
    baseScore += Math.max(-10, Math.min(10, -gameState.changes.unemployment * 2));
    
    // Бонус за сложность страны (0-15)
    const countryBonus = country.bonus;
    
    // Бонус за качество решений (0-20)
    const avgTrustChange = gameState.history.reduce((sum, turn) => {
        return sum + (turn.trust - 50);
    }, 0) / Math.max(1, gameState.history.length);
    const performanceBonus = Math.max(0, Math.min(20, avgTrustChange * 0.4 + 10));
    
    // Бонус за последовательность (0-5)
    const consistencyBonus = gameState.trust > 40 ? 5 : gameState.trust > 20 ? 3 : 0;
    
    gameState.finalScore = Math.max(0, Math.min(100, baseScore + countryBonus + performanceBonus + consistencyBonus));
    
    gameState.scoreBreakdown = {
        baseScore: Math.round(baseScore),
        countryBonus: countryBonus,
        performanceBonus: Math.round(performanceBonus),
        consistencyBonus: consistencyBonus
    };
}

// Отображение результатов
function renderResults() {
    updateResultsHeader();
    updateFinalIndicators();
    updateFinalScore();
    updateTrustAnalysis();
    generateDetailedAnalysis();
    generateGameLog();
}

// Обновление заголовка результатов
function updateResultsHeader() {
    const country = gameData.countries[gameState.selectedCountry];
    const selectedCountryDisplay = document.getElementById('selectedCountryDisplay');
    const analysisTitle = document.getElementById('analysisTitle');
    
    if (selectedCountryDisplay) {
        selectedCountryDisplay.innerHTML = `
            <div class="results-country-flag">${country.flag}</div>
            <div>
                <h2>${country.name}</h2>
                <p>Режим: ${getModeDisplayName()}</p>
            </div>
        `;
    }
    
    if (analysisTitle) {
        analysisTitle.innerHTML = `
            <div class="analysis-country-flag">${country.flag}</div>
            <h2>Анализ вашей экономической стратегии за ${country.name}</h2>
        `;
    }
}

// Обновление финальных показателей
function updateFinalIndicators() {
    const finalIndicatorsGrid = document.getElementById('finalIndicatorsGrid');
    if (!finalIndicatorsGrid) return;
    
    const indicators = [
        {
            icon: 'fa-solid fa-chart-line',
            label: 'ВВП индекс',
            key: 'gdpIdx',
            suffix: '',
            inverse: false
        },
        {
            icon: 'fa-solid fa-arrow-up-right-from-square', 
            label: 'Экспорт индекс',
            key: 'expIdx',
            suffix: '',
            inverse: false
        },
        {
            icon: 'fa-solid fa-arrow-down-right-to-square',
            label: 'Импорт индекс', 
            key: 'impIdx',
            suffix: '',
            inverse: false
        },
        {
            icon: 'fa-solid fa-percentage',
            label: 'Инфляция',
            key: 'cpi',
            suffix: '%',
            inverse: true
        },
        {
            icon: 'fa-solid fa-users',
            label: 'Безработица',
            key: 'unemployment', 
            suffix: '%',
            inverse: true
        }
    ];
    
    finalIndicatorsGrid.innerHTML = '';
    
    indicators.forEach(({ icon, label, key, suffix, inverse }) => {
        const finalValue = gameState.economicState[key];
        const baseValue = gameData.baseState[key];
        const change = finalValue - baseValue;
        
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        
        resultCard.innerHTML = `
            <i class="${icon}"></i>
            <h3>${label}</h3>
            <div class="result-values">
                <div class="final-value">${finalValue.toFixed(1)}${suffix}</div>
                <div class="change-value ${getChangeClass(change, inverse)}">
                    ${formatChange(change, suffix)}
                </div>
            </div>
        `;
        
        finalIndicatorsGrid.appendChild(resultCard);
    });
}

// Обновление финального счета
function updateFinalScore() {
    const finalScoreCard = document.getElementById('finalScoreCard');
    if (!finalScoreCard) return;
    
    const score = gameState.finalScore;
    let scoreClass = 'poor';
    
    if (score >= 80) scoreClass = 'excellent';
    else if (score >= 60) scoreClass = 'good';  
    else if (score >= 40) scoreClass = 'average';
    
    finalScoreCard.className = `score-card ${scoreClass}`;
    
    const scoreValue = finalScoreCard.querySelector('.score-value');
    const scoreDescription = finalScoreCard.querySelector('.score-description');
    const scoreBreakdown = finalScoreCard.querySelector('.score-breakdown');
    
    if (scoreValue) {
        scoreValue.textContent = `${score}/100`;
    }
    
    if (scoreDescription) {
        scoreDescription.textContent = getScoreDescription();
    }
    
    if (scoreBreakdown) {
        const breakdown = gameState.scoreBreakdown;
        scoreBreakdown.innerHTML = `
            <strong>Структура оценки:</strong><br>
            • Базовые очки: ${breakdown.baseScore}/60<br>
            • Бонус за сложность: ${breakdown.countryBonus}/15<br>
            • Качество решений: ${breakdown.performanceBonus}/20<br>
            • Последовательность: ${breakdown.consistencyBonus}/5
        `;
    }
}

// Обновление анализа доверия
function updateTrustAnalysis() {
    const trustValue = document.getElementById('trustValue');
    const trustExplanation = document.getElementById('trustExplanation');
    
    if (trustValue) {
        trustValue.textContent = Math.round(gameState.trust);
    }
    
    if (trustExplanation) {
        trustExplanation.textContent = getTrustExplanation();
    }
}

// Генерация подробного анализа
function generateDetailedAnalysis() {
    const analysisContent = document.getElementById('analysisContent');
    if (!analysisContent) return;
    
    analysisContent.innerHTML = '';
    
    // Анализ торговой политики
    const tradeSection = document.createElement('div');
    tradeSection.className = 'analysis-section';
    tradeSection.innerHTML = `
        <h4><i class="fas fa-handshake"></i> Торговая политика</h4>
        <p>${analyzeTradePolicies()}</p>
    `;
    analysisContent.appendChild(tradeSection);
    
    // Анализ дипломатии
    const diplomacySection = document.createElement('div'); 
    diplomacySection.className = 'analysis-section';
    diplomacySection.innerHTML = `
        <h4><i class="fas fa-globe"></i> Дипломатические отношения</h4>
        <p>${analyzeDiplomacy()}</p>
    `;
    analysisContent.appendChild(diplomacySection);
    
    // Сильные стороны
    const strengthsSection = document.createElement('div');
    strengthsSection.className = 'analysis-section strengths';
    strengthsSection.innerHTML = `
        <h4><i class="fas fa-thumbs-up"></i> Сильные стороны</h4>
        <p>${analyzeStrengths()}</p>
    `;
    analysisContent.appendChild(strengthsSection);
    
    // Слабые стороны
    const weaknessesSection = document.createElement('div');
    weaknessesSection.className = 'analysis-section weaknesses';
    weaknessesSection.innerHTML = `
        <h4><i class="fas fa-exclamation-triangle"></i> Слабые стороны</h4>
        <p>${analyzeWeaknesses()}</p>
    `;
    analysisContent.appendChild(weaknessesSection);
    
    // Рекомендации
    const recommendationsSection = document.createElement('div');
    recommendationsSection.className = 'analysis-section recommendations';
    recommendationsSection.innerHTML = `
        <h4><i class="fas fa-lightbulb"></i> Рекомендации</h4>
        <p>${generateRecommendations()}</p>
    `;
    analysisContent.appendChild(recommendationsSection);
}

// Генерация лога ходов
function generateGameLog() {
    const gameLogContent = document.getElementById('gameLogContent');
    if (!gameLogContent) return;
    
    gameLogContent.innerHTML = '';
    
    gameState.history.forEach((turn, index) => {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        logEntry.innerHTML = `
            <div class="log-turn">
                <h4>Ход ${turn.turn}</h4>
                <div class="log-scenario">${turn.scenario}</div>
            </div>
            <div class="log-choice">
                <strong>Выбрано:</strong> ${turn.choice}
            </div>
            <div class="log-random-event">
                <strong>Случайное событие:</strong> ${turn.randomEvent.text}
            </div>
            <div class="log-effects">
                <strong>Результат:</strong> 
                ВВП ${formatChange(turn.effects.gdp)}, 
                Экспорт ${formatChange(turn.effects.exp)}, 
                Импорт ${formatChange(turn.effects.imp)}, 
                Инфляция ${formatChange(turn.effects.cpi, '%')}, 
                Безработица ${formatChange(turn.effects.unemployment, '%')}
            </div>
        `;
        
        gameLogContent.appendChild(logEntry);
    });
}

// Функции анализа (упрощенные версии)
function analyzeTradePolicies() {
    const history = gameState.history;
    let protectionistMoves = 0;
    let opennessMoves = 0;
    
    history.forEach(turn => {
        if (turn.choice.toLowerCase().includes('тариф') || 
            turn.choice.toLowerCase().includes('пошлин') || 
            turn.choice.toLowerCase().includes('защит')) {
            protectionistMoves++;
        }
        if (turn.choice.toLowerCase().includes('перегов') || 
            turn.choice.toLowerCase().includes('сотруд') || 
            turn.choice.toLowerCase().includes('откр')) {
            opennessMoves++;
        }
    });
    
    if (protectionistMoves > opennessMoves) {
        return `Вы придерживались преимущественно протекционистского подхода (${protectionistMoves} защитных мер против ${opennessMoves} открытых). Это защитило внутренние отрасли, но могло снизить конкурентоспособность экономики и вызвать торговые конфликты.`;
    } else if (opennessMoves > protectionistMoves) {
        return `Ваша торговая политика была направлена на открытость и сотрудничество (${opennessMoves} открытых решений против ${protectionistMoves} защитных). Это способствовало международной интеграции, но могло создать уязвимость для отечественных производителей.`;
    } else {
        return `Вы демонстрировали сбалансированный подход к торговой политике, комбинируя защитные меры с открытостью к сотрудничеству. Это показывает понимание сложности международных экономических отношений.`;
    }
}

function analyzeDiplomacy() {
    const trustLevel = gameState.trust;
    const history = gameState.history;
    let cooperativeMoves = history.filter(turn => 
        turn.choice.toLowerCase().includes('перегов') || 
        turn.choice.toLowerCase().includes('сотруд') || 
        turn.choice.toLowerCase().includes('компромисс')
    ).length;
    
    if (trustLevel >= 70) {
        return `Отличная дипломатическая работа! Уровень доверия ${trustLevel} свидетельствует о том, что международное сообщество воспринимает вас как надежного и предсказуемого партнера. Ваши ${cooperativeMoves} кооперативных решения способствовали укреплению международных отношений.`;
    } else if (trustLevel >= 50) {
        return `Умеренно успешная дипломатия. Уровень доверия ${trustLevel} показывает, что партнеры в целом готовы к сотрудничеству, но есть определенные опасения по поводу некоторых ваших решений. Больше внимания к переговорам могло бы улучшить отношения.`;
    } else {
        return `Проблемы в дипломатии. Низкий уровень доверия (${trustLevel}) указывает на то, что многие ваши решения были восприняты как агрессивные или непредсказуемые. Это может затруднить будущее экономическое сотрудничество и привести к изоляции.`;
    }
}

function analyzeStrengths() {
    const changes = gameState.changes;
    const strengths = [];
    
    if (changes.gdp > 5) {
        strengths.push('успешное стимулирование экономического роста');
    }
    if (changes.exp > 10) {
        strengths.push('значительное увеличение экспортного потенциала');
    }
    if (changes.unemployment < -2) {
        strengths.push('эффективное снижение безработицы');
    }
    if (changes.cpi < 1 && changes.cpi > -1) {
        strengths.push('поддержание стабильной инфляции');
    }
    if (gameState.trust > 60) {
        strengths.push('сохранение доверия международных партнеров');
    }
    
    if (strengths.length === 0) {
        return 'К сожалению, явных сильных сторон выявить не удалось. Это указывает на необходимость пересмотра подходов к экономической политике.';
    }
    
    return `Ваши главные достижения: ${strengths.join(', ')}. Эти результаты показывают понимание ключевых принципов макроэкономического управления.`;
}

function analyzeWeaknesses() {
    const changes = gameState.changes;
    const weaknesses = [];
    
    if (changes.gdp < -3) {
        weaknesses.push('серьезное падение ВВП указывает на неэффективность экономической политики');
    }
    if (changes.unemployment > 3) {
        weaknesses.push('рост безработицы свидетельствует о проблемах на рынке труда');
    }
    if (changes.cpi > 3) {
        weaknesses.push('высокая инфляция подрывает покупательную способность населения');
    }
    if (gameState.trust < 40) {
        weaknesses.push('потеря доверия международного сообщества ограничивает возможности сотрудничества');
    }
    
    // Анализ ошибочных решений
    const problematicDecisions = gameState.history.filter(turn => {
        const effects = turn.effects;
        return (effects.gdp < -1 && effects.unemployment > 1) || 
               (effects.cpi > 1 && effects.gdp < 0);
    });
    
    if (problematicDecisions.length > 0) {
        weaknesses.push(`${problematicDecisions.length} решений привели к одновременному ухудшению нескольких показателей`);
    }
    
    if (weaknesses.length === 0) {
        return 'Серьезных системных ошибок не выявлено, но всегда есть место для улучшений в координации экономической политики.';
    }
    
    return `Основные проблемы: ${weaknesses.join('; ')}. Эти ошибки часто связаны с недооценкой долгосрочных последствий краткосрочных решений.`;
}

function generateRecommendations() {
    const changes = gameState.changes;
    const recommendations = [];
    
    if (changes.gdp < 0) {
        recommendations.push('фокус на стимулировании экономического роста через инвестиции в инфраструктуру и инновации');
    }
    if (changes.unemployment > 2) {
        recommendations.push('активная политика занятости, включая переквалификацию и поддержку малого бизнеса');
    }
    if (changes.cpi > 2) {
        recommendations.push('более осторожная фискальная политика для контроля инфляционного давления');
    }
    if (gameState.trust < 50) {
        recommendations.push('приоритет переговорам и многостороннему сотрудничеству для восстановления доверия');
    }
    
    recommendations.push('более внимательное изучение исторических примеров и экономической теории при принятии решений');
    recommendations.push('учет долгосрочных последствий при краткосрочном планировании');
    
    return `В следующий раз рекомендуется: ${recommendations.join('; ')}. Помните, что экономическая политика требует баланса между различными целями и интересами.`;
}

// Вспомогательные функции
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
        return "Отличное доверие международного сообщества. Ваша политика была взвешенной и конструктивной, что создает благоприятные условия для будущих торгово-экономических соглашений.";
    } else if (trust >= 60) {
        return "Хороший уровень доверия. В целом ваши решения были разумными и предсказуемыми, хотя некоторые действия вызвали определенные опасения у торговых партнеров.";
    } else if (trust >= 40) {
        return "Средний уровень доверия. Некоторые решения были восприняты как агрессивные или непредсказуемые, что может осложнить будущие переговоры и экономическое сотрудничество.";
    } else if (trust >= 20) {
        return "Низкий уровень доверия. Многие решения были восприняты международным сообществом негативно, что серьезно подрывает возможности для взаимовыгодного сотрудничества.";
    } else {
        return "Критически низкое доверие. Ваша политика серьезно подорвала международные отношения, что может привести к изоляции и ответным экономическим мерам.";
    }
}

function getScoreDescription() {
    const score = gameState.finalScore;
    if (score >= 80) {
        return "Превосходно! Вы демонстрируете глубокое понимание международной торговли и макроэкономики.";
    } else if (score >= 60) {
        return "Хорошо! Ваша экономическая стратегия показала положительные результаты.";
    } else if (score >= 40) {
        return "Удовлетворительно. Есть как успехи, так и области для улучшения.";
    } else if (score >= 20) {
        return "Неудовлетворительно. Стратегия нуждается в пересмотре основных подходов.";
    } else {
        return "Критично! Необходимо изучить основы экономической теории и торговой политики.";
    }
}

// Создание финального графика
function createFinalChart() {
    const canvas = document.getElementById('finalChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const labels = ['Старт'];
    gameState.history.forEach((_, index) => {
        labels.push(`Ход ${index + 1}`);
    });
    
    const gdpData = [gameData.baseState.gdpIdx];
    const expData = [gameData.baseState.expIdx];
    const impData = [gameData.baseState.impIdx];
    
    gameState.history.forEach(h => {
        gdpData.push(h.state.gdpIdx);
        expData.push(h.state.expIdx);
        impData.push(h.state.impIdx);
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
                    tension: 0.1
                },
                {
                    label: 'Экспорт индекс',
                    data: expData,
                    borderColor: '#FFC185',
                    backgroundColor: '#FFC18520',
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: 'Импорт индекс',
                    data: impData,
                    borderColor: '#B4413C',
                    backgroundColor: '#B4413C20',
                    borderWidth: 2,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--color-card-border').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim()
                    }
                },
                x: {
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--color-card-border').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary').trim()
                    }
                }
            }
        }
    });
}

// Новая игра
function newGame() {
    // Уничтожаем старые графики
    Object.values(gameState.charts).forEach(chart => {
        if (chart && chart.destroy) {
            chart.destroy();
        }
    });
    
    // Сбрасываем состояние игры
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
        randomEvents: [],
        charts: {},
        usedScenarios: [],
        availableScenarios: [],
        theme: gameState.theme // Сохраняем тему
    };
    
    // Сбрасываем UI
    document.querySelectorAll('.country-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.querySelectorAll('input[name="gameMode"]').forEach(radio => {
        radio.checked = radio.value === 'normal';
    });
    
    updateStartButton();
    showScreen('start');
}

// Экспорт в PDF
function exportToPDF() {
    const studentName = document.getElementById('studentName').value.trim();
    const studentGroup = document.getElementById('studentGroup').value.trim();
    
    if (!studentName || !studentGroup) {
        alert('Пожалуйста, заполните ФИО и группу для экспорта PDF');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Настройка шрифта для поддержки русского языка  
    doc.setFont('helvetica');
    
    const country = gameData.countries[gameState.selectedCountry];
    const state = gameState.economicState;
    
    // Заголовок
    doc.setFontSize(16);
    doc.text('OTCHET PO SIMULYACII "TORGOVYE VOJNY"', 105, 20, { align: 'center' });
    
    // ФИО и группа
    doc.setFontSize(12);
    doc.text(`FIO: ${studentName}`, 20, 35);
    doc.text(`Gruppa: ${studentGroup}`, 20, 45);
    doc.text(`Data: ${new Date().toLocaleDateString('ru-RU')}`, 20, 55);
    doc.text(`Versiya: ${GAME_VERSION}`, 20, 65);
    
    // Выбранная страна
    doc.setFontSize(14);
    doc.text(`Strana: ${country.name}`, 20, 80);
    doc.setFontSize(10);
    doc.text(`Slozhnost': ${country.difficulty} (+${country.bonus} ballov)`, 20, 90);
    doc.text(`Rezhim: ${getModeDisplayName()}`, 20, 100);
    
    // Общая оценка
    doc.setFontSize(14);
    doc.text(`ITOGOVAYA OCENKA: ${gameState.finalScore}/100`, 105, 115, { align: 'center' });
    
    // Экономические показатели
    doc.setFontSize(12);
    doc.text('FINAL\'NYE POKAZATELI:', 20, 130);
    doc.setFontSize(10);
    doc.text(`VVP indeks: ${state.gdpIdx.toFixed(1)} (izmenenie: ${formatChange(gameState.changes.gdp)})`, 20, 140);
    doc.text(`Eksport indeks: ${state.expIdx.toFixed(1)} (izmenenie: ${formatChange(gameState.changes.exp)})`, 20, 150);
    doc.text(`Import indeks: ${state.impIdx.toFixed(1)} (izmenenie: ${formatChange(gameState.changes.imp)})`, 20, 160);
    doc.text(`Inflyaciya: ${state.cpi.toFixed(1)}% (izmenenie: ${formatChange(gameState.changes.cpi, '%')})`, 20, 170);
    doc.text(`Bezrabotica: ${state.unemployment.toFixed(1)}% (izmenenie: ${formatChange(gameState.changes.unemployment, '%')})`, 20, 180);
    doc.text(`Doverie: ${Math.round(gameState.trust)}`, 20, 190);
    
    // Разбивка оценки
    doc.setFontSize(12);
    doc.text('STRUKTURA OCENKI:', 20, 205);
    doc.setFontSize(10);
    const breakdown = gameState.scoreBreakdown;
    doc.text(`Bazovye ochki: ${breakdown.baseScore}/60`, 20, 215);
    doc.text(`Bonus za slozhnost': ${breakdown.countryBonus}/15`, 20, 225);
    doc.text(`Kachestvo reshenij: ${breakdown.performanceBonus}/20`, 20, 235);
    doc.text(`Posledovatel'nost': ${breakdown.consistencyBonus}/5`, 20, 245);
    
    // Краткий анализ
    doc.setFontSize(12);
    doc.text('KRATKIJ ANALIZ:', 20, 260);
    doc.setFontSize(9);
    // Разбиваем длинный текст на строки (упрощенный анализ для PDF)
    const analysis = `Obshchaya ocenka: ${getScoreDescription()}`;
    const lines = doc.splitTextToSize(analysis, 170);
    let yPos = 270;
    lines.slice(0, 4).forEach(line => { // Ограничиваем количество строк
        doc.text(line, 20, yPos);
        yPos += 8;
    });
    
    // Сохранение PDF
    doc.save(`Torgovye_vojny_${studentName.replace(/\s+/g, '_')}_${studentGroup}.pdf`);
}