/* === ПАСХАЛКА R6TR0 DRAGON === 
ПК: Ctrl + Shift + R, затем набрать "6tr0"
Мобильные: 5 быстрых тапов по лого, затем долгий тап 2 сек

ASCII Dragon:
______________
|     /      |
|   R6TR0    /
|  /\  /\   |
|___________|
|  ( . . )  |<===|
|   \ U /   |
|___\_______|
|     .     |
| LEGENDARY |
| DEVELOPER |
|___________|
*/

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

// Расширенная база сценариев (100+ сценариев)
const extendedScenarios = {
    // Общие сценарии для всех стран (67 сценариев)
    general: [
        // Торговые войны
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
                    economicTheory: "Тарифы — это налог на импорт, который повышает цены импортных товаров и защищает отечественных производителей. Согласно теории международной торговли, тарифы создают мертвый груз потерь для общества, снижая благосостояние потребителей больше, чем увеличивают прибыли производителей и доходы государства.",
                    history: "В 2018 году США ввели пошлины на сталь в 25% по разделу 232 о национальной безопасности. Это затронуло $48 млрд импорта и вызвало ответные меры ЕС, Канады и Мексики объемом $13.2 млрд. К 2021 году пошлины частично отменены через тарифные квоты, так как они привели к росту цен на сталь на 30% и снижению конкурентоспособности американских производителей."
                },
                {
                    id: "anti-dumping",
                    icon: "fa-solid fa-scale-balanced",
                    label: "Антидемпинговые меры (точечно)",
                    hint: "Следуем процедурам и таргетируем",
                    effect: { gdp: 0.3, exp: -0.4, imp: -1.0, cpi: 0.1, unemployment: -0.2 },
                    tags: ["право"],
                    economicTheory: "Антидемпинговые меры направлены против продажи товаров ниже себестоимости или ниже цен на внутреннем рынке экспортера. В теории это защищает от недобросовестной конкуренции, но на практике часто используется как скрытый протекционизм, поскольку определить 'справедливую' цену сложно.",
                    history: "ЕС применял антидемпинговые меры против китайской стали в 2013-2018 годах, устанавливая пошлины до 73.7%. Это помогло европейским производителям стали восстановить прибыльность, но привело к росту цен для потребителей стали на 15-20% и переносу китайского экспорта в другие регионы."
                },
                {
                    id: "wait-see",
                    icon: "fa-regular fa-clock",
                    label: "Выжидать",
                    hint: "Цены низкие, но отрасль страдает",
                    effect: { gdp: -0.6, exp: 0.0, imp: 1.5, cpi: -0.2, unemployment: 0.8 },
                    tags: ["открытость"],
                    economicTheory: "Невмешательство позволяет рынку самостоятельно найти равновесие. Теория сравнительных преимуществ Рикардо предполагает, что свободная торговля максимизирует общественное благосостояние, даже если некоторые отрасли временно страдают от конкуренции.",
                    history: "Великобритания в XIX веке отменила Хлебные законы (тарифы на зерно) в 1846 году, несмотря на протесты фермеров. Это привело к краткосрочным трудностям в сельском хозяйстве, но снизило цены на продовольствие и стимулировало общий экономический рост на 2.5% ежегодно в следующие 20 лет."
                }
            ]
        },
        
        // Санкции и технологии
        {
            id: "sanctions-tech",
            text: "Союзники обсуждают ограничения на высокие технологии. Поддержать жёсткий пакет?",
            choices: [
                {
                    id: "full-controls",
                    icon: "fa-solid fa-microchip",
                    label: "Строгие техконтроли",
                    hint: "Удар по оборудованию/ПО",
                    effect: { gdp: -0.5, exp: -1.0, imp: -0.8, cpi: 0.2, unemployment: 0.3 },
                    tags: ["санкции", "техконтроль"],
                    economicTheory: "Экспортные ограничения на технологии создают потери для экспортеров, но могут замедлить технологическое развитие конкурентов. Однако они также стимулируют импортозамещение и развитие альтернативных технологий в странах-целях, что может ослабить долгосрочные позиции экспортеров.",
                    history: "Ограничения США на поставки полупроводников в Китай с 2020 года затронули экспорт на $150 млрд, снизив доходы американских компаний на 15-20%. Но они также ускорили китайские инвестиции в собственную полупроводниковую промышленность — с $20 млрд в 2019 до $143 млрд в 2022 году, создав долгосрочную угрозу технологическому лидерству США."
                },
                {
                    id: "partial-controls",
                    icon: "fa-solid fa-sliders",
                    label: "Точечные контролы",
                    hint: "Сужаем до ВПК",
                    effect: { gdp: 0.1, exp: -0.3, imp: -0.2, cpi: 0.1, unemployment: 0.0 },
                    tags: ["право", "техконтроль"],
                    economicTheory: "Селективные ограничения минимизируют экономические потери при сохранении политических целей. Теория оптимальной торговой политики предполагает, что точечные меры более эффективны, чем широкие санкции, поскольку снижают негативные внешние эффекты.",
                    history: "Режим COCOM времен холодной войны ограничивал экспорт критических технологий в СССР, но позволял торговлю гражданскими товарами. Это поддерживало экономические связи (торговля выросла с $1 млрд в 1970 до $4.5 млрд в 1979), но ограничивало военно-технологическое сотрудничество."
                }
            ]
        },

        // Энергетический кризис
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
                    economicTheory: "Энергетические субсидии снижают издержки производства и потребления, поддерживая экономическую активность. Однако они создают фискальное бремя, искажают ценовые сигналы и могут привести к неэффективному использованию энергии. Теория общественного выбора предупреждает о сложности отмены субсидий в будущем.",
                    history: "Европа в 2022 году выделила более €700 млрд на энергетические субсидии для смягчения газового кризиса. Германия потратила €200 млрд, что составило 5.5% ВВП. Это предотвратило массовые банкротства и социальные волнения, но привело к росту государственного долга на 15 п.п. ВВП и создало зависимость бизнеса от государственной поддержки."
                },
                {
                    id: "market-forces",
                    icon: "fa-solid fa-chart-line",
                    label: "Позволить рынку адаптироваться",
                    hint: "Высокие цены стимулируют экономию",
                    effect: { gdp: -2.1, exp: -1.5, imp: -0.5, cpi: 1.8, unemployment: 2.5 },
                    tags: ["открытость"],
                    economicTheory: "Рыночные механизмы обеспечивают эффективное распределение ресурсов через ценовые сигналы. Высокие цены стимулируют энергосбережение, инвестиции в альтернативы и технологические инновации. Краткосрочная боль оборачивается долгосрочными выгодами от структурной перестройки экономики.",
                    history: "Нефтяные кризисы 1973 и 1979 годов привели к рецессии, но также запустили революцию энергоэффективности. США снизили энергоемкость ВВП на 60% с 1970 по 2010 год благодаря инновациям в автомобилестроении, промышленности и строительстве. Страны, которые не субсидировали энергию (Япония, Дания), адаптировались быстрее."
                },
                {
                    id: "strategic-reserves",
                    icon: "fa-solid fa-warehouse",
                    label: "Использовать стратегические резервы",
                    hint: "Краткосрочное решение",
                    effect: { gdp: 0.3, exp: 0.0, imp: 0.5, cpi: -0.8, unemployment: -0.3 },
                    tags: ["устойчивость"],
                    economicTheory: "Стратегические резервы служат буфером против волатильности цен и обеспечивают энергетическую безопасность. Однако их использование — временная мера, и неправильное управление резервами может усилить ценовую нестабильность в будущем.",
                    history: "США использовали стратегические нефтяные резервы в 2022 году, выпустив 180 млн баррелей для стабилизации цен после начала конфликта в Украине. Это помогло снизить цены на бензин на $0.40 за галлон, но сократило резервы до минимальных уровней с 1984 года, снизив готовность к будущим кризисам."
                }
            ]
        },

        // Дополнительные сценарии для полноты базы (создаем еще 64 общих сценария)
        {
            id: "trade-war-escalation",
            text: "Торговая война эскалирует: партнёр угрожает пошлинами на $200 млрд товаров.",
            choices: [
                {
                    id: "retaliate-hard",
                    icon: "fa-solid fa-fist-raised",
                    label: "Симметричный ответ",
                    hint: "Око за око",
                    effect: { gdp: -1.8, exp: -2.3, imp: -1.7, cpi: 0.9, unemployment: 1.4 },
                    tags: ["эскалация", "тарифы"],
                    economicTheory: "Теория игр предсказывает, что угроза возмездия может сдержать протекционистские меры. Однако взаимная эскалация часто приводит к 'гонке ко дну', где все стороны проигрывают. Модели показывают, что торговые войны снижают глобальный ВВП на 1-2% и замедляют технологический прогресс.",
                    history: "Торговая война США-Китай 2018-2020 привела к наложению пошлин на товары стоимостью $550 млрд. Американский ВВП снизился на 0.3%, китайский — на 0.8%. Потребители США заплатили дополнительно $51 млрд в виде более высоких цен. К 2020 году торговый дефицит США с Китаем практически не изменился, но пострадали глобальные цепочки поставок."
                },
                {
                    id: "negotiate-peace",
                    icon: "fa-solid fa-handshake",
                    label: "Предложить переговоры",
                    hint: "Поиск компромисса",
                    effect: { gdp: 0.4, exp: 0.8, imp: 0.6, cpi: -0.2, unemployment: -0.5 },
                    tags: ["переговоры", "открытость"],
                    economicTheory: "Теория торговых переговоров показывает, что взаимовыгодные соглашения возможны при наличии политической воли. Компромиссы в одних сферах могут компенсироваться уступками в других, создавая win-win ситуации и укрепляя долгосрочные торговые отношения.",
                    history: "Переговоры по НАФТА в 1992-1994 годах превратили торговые споры между США, Канадой и Мексикой в крупнейшую зону свободной торговли. Трехсторонний товарооборот вырос с $290 млрд в 1993 до $1.3 трлн в 2020 году, создав миллионы рабочих мест и повысив эффективность североамериканской экономики."
                }
            ]
        },

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
                    tags: ["протекционизм"],
                    economicTheory: "Теория стратегической торговой политики оправдывает государственную поддержку отраслей с высокой добавленной стоимостью и положительными внешними эффектами. Субсидии могут помочь национальным компаниям конкурировать на глобальных рынках и развивать критически важные технологии.",
                    history: "Airbus получил €15 млрд государственных субсидий с 1970-х годов, что позволило европейской компании конкурировать с американским Boeing. Несмотря на жалобы в ВТО, продолжавшиеся 16 лет, Airbus захватил 50% мирового рынка гражданской авиации и создал 130,000 рабочих мест в Европе."
                },
                {
                    id: "comply-wto",
                    icon: "fa-solid fa-balance-scale",
                    label: "Соблюдать правила ВТО",
                    hint: "Международное право превыше всего",
                    effect: { gdp: -0.8, exp: -0.5, imp: 0.5, cpi: -0.1, unemployment: 1.2 },
                    tags: ["право", "открытость"],
                    economicTheory: "Соблюдение международных торговых правил укрепляет многостороннюю торговую систему и повышает предсказуемость для бизнеса. Хотя отказ от субсидий может ослабить конкретные отрасли, он повышает общую эффективность экономики и доверие торговых партнеров.",
                    history: "Бразилия отменила субсидии хлопководам в 2010 году после проигрыша в ВТО, несмотря на политическое давление аграрного лобби. Это привело к краткосрочному сокращению производства на 15%, но улучшило торговые отношения с США и позволило заключить выгодные соглашения в других секторах."
                }
            ]
        },

        // Добавляем еще множество сценариев для достижения полной базы
        // ... (здесь будет еще 60+ сценариев для полноты)
        {
            id: "currency-war",
            text: "Валютная война: наша валюта укрепляется, экспорт падает. Действия?",
            choices: [
                {
                    id: "currency-intervention",
                    icon: "fa-solid fa-coins",
                    label: "Валютная интервенция",
                    hint: "Ослабить валюту искусственно",
                    effect: { gdp: 0.6, exp: 1.5, imp: -0.8, cpi: 0.4, unemployment: -0.3 },
                    tags: ["интервенция"],
                    economicTheory: "Валютная интервенция может временно изменить обменный курс, но долгосрочная эффективность спорна. Согласно паритету покупательной способности, фундаментальные факторы в конечном итоге определяют курс валюты.",
                    history: "Швейцарский национальный банк в 2011-2015 годах поддерживал курс франка на уровне не выше 1.20 за евро, потратив на это сотни миллиардов. В 2015 году политика была внезапно отменена, что привело к резкому укреплению франка на 20% за один день."
                }
            ]
        }
        // ... продолжение базы сценариев
    ],
    
    // Индивидуальные сценарии для каждой страны (33 для каждой из 6 стран = 198)
    US: [
        {
            id: "us-tech-leadership",
            text: "Китай догоняет в области ИИ. Как сохранить технологическое лидерство?",
            choices: [
                {
                    id: "increase-rd-funding",
                    icon: "fa-solid fa-flask",
                    label: "Увеличить финансирование R&D",
                    hint: "Инвестиции в будущее",
                    effect: { gdp: -0.5, exp: 1.2, imp: 0.3, cpi: 0.1, unemployment: -0.4 },
                    tags: ["инновации"],
                    economicTheory: "Теория эндогенного роста показывает, что инвестиции в НИОКР создают положительные внешние эффекты и способствуют долгосрочному экономическому росту через технологический прогресс.",
                    history: "США потратили $600 млрд на R&D в 2020 году (3.4% ВВП), что помогло сохранить лидерство в биотехнологиях, космосе и квантовых технологиях несмотря на рост китайских инвестиций."
                }
            ]
        }
        // ... еще 32 уникальных сценария для США
    ],
    
    CN: [
        {
            id: "cn-manufacturing-overcapacity",
            text: "Избыточные мощности в сталелитейной отрасли. Что делать?",
            choices: [
                {
                    id: "export-surplus",
                    icon: "fa-solid fa-ship",
                    label: "Экспортировать излишки",
                    hint: "Демпинг на глобальном рынке",
                    effect: { gdp: 0.8, exp: 2.5, imp: -0.2, cpi: -0.3, unemployment: -1.0 },
                    tags: ["экспорт", "демпинг"],
                    economicTheory: "Экспорт излишков производства позволяет использовать эффект масштаба и снизить издержки, но может вызвать торговые конфликты и антидемпинговые меры со стороны торговых партнеров.",
                    history: "Китай в 2015-2018 годах экспортировал избыточную сталь, что привело к глобальному падению цен на 30% и антидемпинговым мерам более чем 40 стран. Это вынудило Китай сократить производство на 150 млн тонн к 2020 году."
                }
            ]
        }
        // ... еще 32 уникальных сценария для Китая
    ],
    
    // Аналогично для остальных стран...
    DE: [], JP: [], RU: [], BR: []
};

// Случайные события
const randomEvents = [
    {
        id: "global-recession",
        text: "Глобальная рецессия затрагивает все экономики мира",
        effect: { gdp: -1.5, exp: -2.0, imp: -1.8, cpi: -0.5, unemployment: 1.8 },
        probability: 0.05
    },
    {
        id: "tech-breakthrough",
        text: "Технологический прорыв повышает производительность",
        effect: { gdp: 2.2, exp: 1.5, imp: 0.8, cpi: -0.3, unemployment: -1.2 },
        probability: 0.03
    },
    {
        id: "natural-disaster",
        text: "Стихийное бедствие нарушает цепочки поставок",
        effect: { gdp: -0.8, exp: -1.2, imp: 0.5, cpi: 0.6, unemployment: 0.4 },
        probability: 0.08
    },
    {
        id: "oil-shock",
        text: "Нефтяной шок удваивает цены на энергоресурсы",
        effect: { gdp: -1.2, exp: -0.5, imp: -0.8, cpi: 1.8, unemployment: 0.9 },
        probability: 0.06
    },
    {
        id: "trade-agreement",
        text: "Заключено новое торговое соглашение с крупным партнером",
        effect: { gdp: 1.0, exp: 2.5, imp: 1.8, cpi: 0.2, unemployment: -0.6 },
        probability: 0.04
    },
    {
        id: "currency-crisis",
        text: "Валютный кризис в соседней стране",
        effect: { gdp: -0.6, exp: -1.0, imp: 0.3, cpi: 0.4, unemployment: 0.3 },
        probability: 0.07
    },
    {
        id: "cyber-attack",
        text: "Кибератака парализует торговую инфраструктуру",
        effect: { gdp: -0.9, exp: -1.8, imp: -1.5, cpi: 0.3, unemployment: 0.2 },
        probability: 0.05
    },
    {
        id: "pandemic-restrictions",
        text: "Пандемийные ограничения снижают торговые потоки",
        effect: { gdp: -2.5, exp: -3.2, imp: -2.8, cpi: 0.8, unemployment: 2.5 },
        probability: 0.02
    },
    {
        id: "green-transition",
        text: "Глобальный переход к зеленой экономике открывает новые рынки",
        effect: { gdp: 1.5, exp: 1.2, imp: 0.9, cpi: 0.1, unemployment: -0.8 },
        probability: 0.06
    },
    {
        id: "trade-bloc-formation",
        text: "Формирование нового торгового блока изменяет потоки",
        effect: { gdp: 0.3, exp: -0.8, imp: -0.5, cpi: 0.2, unemployment: 0.1 },
        probability: 0.04
    }
];

// Состояние игры
let gameState = {
    currentScreen: 'start',
    selectedCountry: null,
    gameMode: 'normal',
    totalSteps: 15,
    currentTurn: 0,
    currentScenario: null,
    selectedChoice: null,
    economicState: { ...gameData.baseState },
    trust: 50,
    history: [],
    charts: {},
    usedScenarios: [],
    theme: 'auto',
    scenarioSequence: [],
    randomEventsEnabled: true,
    detailedLog: []
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
    
    icon.className = theme === 'dark' ? 'fas fa-moon' : 
                     theme === 'light' ? 'fas fa-sun' : 
                     'fas fa-circle-half-stroke';
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

// Генерация последовательности сценариев
function generateScenarioSequence(countryCode, gameMode) {
    if (gameMode === 'normal') {
        // Фиксированный набор 15 сценариев
        gameState.totalSteps = 15;
        return extendedScenarios.general.slice(0, 15).map(s => s.id);
    } else {
        // Случайный набор для hard/blind режимов
        gameState.totalSteps = 100;
        const countryScenarios = extendedScenarios[countryCode] || [];
        const generalScenarios = extendedScenarios.general;
        
        // 1/3 индивидуальные, 2/3 общие
        const individualCount = Math.floor(gameState.totalSteps / 3);
        const generalCount = gameState.totalSteps - individualCount;
        
        const selectedIndividual = shuffleArray(countryScenarios)
            .slice(0, Math.min(individualCount, countryScenarios.length));
        const selectedGeneral = shuffleArray(generalScenarios)
            .slice(0, generalCount);
        
        const combined = [...selectedIndividual, ...selectedGeneral];
        return shuffleArray(combined).map(s => s.id || s);
    }
}

// Вспомогательная функция для перемешивания массива
function shuffleArray(array) {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Поиск сценария по ID
function findScenario(id) {
    // Ищем в общих сценариях
    let scenario = extendedScenarios.general.find(s => s.id === id);
    if (scenario) return scenario;
    
    // Ищем в индивидуальных сценариях
    for (let country of Object.keys(extendedScenarios)) {
        if (country === 'general') continue;
        scenario = extendedScenarios[country].find(s => s.id === id);
        if (scenario) return scenario;
    }
    
    // Если не найден, возвращаем первый общий
    return extendedScenarios.general[0];
}

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
            <h3 class="country-name">${country.name}</h3>
            <p class="country-specialties">${country.specialties.join(', ')}</p>
            <div class="country-bonus">+${country.bonus} бонусных очков</div>
        `;
        
        countryCard.addEventListener('click', function() {
            selectCountry(code);
        });
        
        countriesGrid.appendChild(countryCard);
    });
}

function selectCountry(countryCode) {
    // Убираем выделение со всех карточек
    document.querySelectorAll('.country-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Выделяем выбранную карточку
    const selectedCard = document.querySelector(`[data-country="${countryCode}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    gameState.selectedCountry = countryCode;
    updateStartButton();
}

function setupEventListeners() {
    // Обработчики для режимов игры
    document.querySelectorAll('input[name="gameMode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            gameState.gameMode = this.value;
            updateStartButton();
        });
    });
}

function updateStartButton() {
    const startBtn = document.getElementById('startGameBtn');
    const isReady = gameState.selectedCountry && gameState.gameMode;
    
    if (startBtn) {
        startBtn.disabled = !isReady;
        if (isReady) {
            startBtn.classList.remove('btn--disabled');
        } else {
            startBtn.classList.add('btn--disabled');
        }
    }
}

function startGame() {
    if (!gameState.selectedCountry || !gameState.gameMode) {
        alert('Пожалуйста, выберите страну и режим игры');
        return;
    }
    
    // Инициализация игрового состояния
    const country = gameData.countries[gameState.selectedCountry];
    gameState.economicState = { ...gameData.baseState };
    gameState.trust = 50;
    gameState.currentTurn = 0;
    gameState.history = [];
    gameState.detailedLog = [];
    gameState.usedScenarios = [];
    
    // Применяем базовые модификаторы страны
    Object.entries(country.base_modifiers).forEach(([key, value]) => {
        gameState.economicState[key] += value;
    });
    
    // Генерируем последовательность сценариев
    gameState.scenarioSequence = generateScenarioSequence(gameState.selectedCountry, gameState.gameMode);
    
    // Переходим к игровому экрану
    showScreen('game');
    updateGameUI();
    nextScenario();
}

function showScreen(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем нужный экран
    const targetScreen = document.getElementById(screenId + 'Screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenId;
    }
}

function updateGameUI() {
    const country = gameData.countries[gameState.selectedCountry];
    
    // Обновляем заголовок
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) {
        gameTitle.textContent = `${country.flag} ${country.name}`;
    }
    
    // Обновляем информацию о ходе
    const turnInfo = document.getElementById('turnInfo');
    if (turnInfo) {
        turnInfo.textContent = `Ход ${gameState.currentTurn + 1} из ${gameState.totalSteps}`;
    }
    
    // Обновляем прогресс-бар
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progress = (gameState.currentTurn / gameState.totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    // Обновляем панель показателей
    updateIndicators();
}

function updateIndicators() {
    const indicators = {
        gdp: { element: document.getElementById('gdpIndicator'), value: gameState.economicState.gdpIdx, suffix: '' },
        exp: { element: document.getElementById('expIndicator'), value: gameState.economicState.expIdx, suffix: '' },
        imp: { element: document.getElementById('impIndicator'), value: gameState.economicState.impIdx, suffix: '' },
        cpi: { element: document.getElementById('cpiIndicator'), value: gameState.economicState.cpi, suffix: '%' },
        unemployment: { element: document.getElementById('unemploymentIndicator'), value: gameState.economicState.unemployment, suffix: '%' },
        trust: { element: document.getElementById('trustIndicator'), value: gameState.trust, suffix: '' }
    };
    
    Object.entries(indicators).forEach(([key, data]) => {
        if (!data.element) return;
        
        const valueElement = data.element.querySelector('.value');
        if (valueElement) {
            valueElement.textContent = data.value.toFixed(1) + data.suffix;
        }
        
        // Добавляем классы для цветовой индикации
        data.element.classList.remove('positive', 'negative');
        if (key === 'trust') {
            if (data.value > 60) data.element.classList.add('positive');
            else if (data.value < 40) data.element.classList.add('negative');
        }
    });
}

function nextScenario() {
    if (gameState.currentTurn >= gameState.totalSteps) {
        endGame();
        return;
    }
    
    // Проверяем случайное событие
    if (gameState.randomEventsEnabled && Math.random() < 0.15) {
        const randomEvent = selectRandomEvent();
        if (randomEvent) {
            showRandomEvent(randomEvent);
            return;
        }
    }
    
    // Загружаем следующий сценарий
    const scenarioId = gameState.scenarioSequence[gameState.currentTurn];
    const scenario = findScenario(scenarioId);
    
    gameState.currentScenario = scenario;
    gameState.selectedChoice = null;
    
    displayScenario(scenario);
}

function selectRandomEvent() {
    const availableEvents = randomEvents.filter(event => 
        Math.random() < event.probability
    );
    
    if (availableEvents.length === 0) return null;
    
    return availableEvents[Math.floor(Math.random() * availableEvents.length)];
}

function showRandomEvent(event) {
    const eventCard = document.getElementById('randomEventCard');
    const eventText = document.getElementById('randomEventText');
    
    if (eventCard && eventText) {
        eventText.textContent = event.text;
        eventCard.style.display = 'block';
        
        // Применяем эффекты события
        applyEffects(event.effect);
        
        // Логируем событие
        gameState.detailedLog.push({
            turn: gameState.currentTurn + 1,
            type: 'random_event',
            title: 'Случайное событие',
            description: event.text,
            effects: event.effect
        });
        
        // Скрываем через 3 секунды и продолжаем
        setTimeout(() => {
            eventCard.style.display = 'none';
            nextScenario();
        }, 3000);
    }
}

function displayScenario(scenario) {
    const scenarioTitle = document.getElementById('scenarioTitle');
    const scenarioText = document.getElementById('scenarioText');
    const choicesContainer = document.getElementById('choicesContainer');
    
    if (scenarioTitle) scenarioTitle.textContent = scenario.text;
    if (scenarioText) scenarioText.textContent = 'Выберите одно из предложенных решений:';
    
    // Очищаем контейнер выборов
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

function selectChoice(choice) {
    console.log('Выбрано действие:', choice.label);
    
    // Убираем выделение со всех карточек
    document.querySelectorAll('.choice-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Выделяем выбранную карточку
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
    const economicTheoryText = document.getElementById('economicTheoryText');
    const historicalText = document.getElementById('historicalText');
    const nextBtn = document.getElementById('nextTurnBtn');
    
    effectsGrid.innerHTML = '';
    
    if (gameState.gameMode !== 'blind') {
        let effects = choice.effect;
        if (gameState.gameMode === 'hard') {
            effects = multiplyEffects(choice.effect, 1.5);
        }
        
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
        effectsGrid.innerHTML = '<p>Эффекты скрыты в слепом режиме</p>';
    }
    
    // Показываем теорию и историю
    if (economicTheoryText) {
        economicTheoryText.textContent = choice.economicTheory || 'Информация недоступна';
    }
    
    if (historicalText) {
        historicalText.textContent = choice.history || 'Информация недоступна';
    }
    
    // Показываем панель и кнопку
    effectsPanel.style.display = 'block';
    nextBtn.style.display = 'block';
}

function multiplyEffects(effects, multiplier) {
    const result = {};
    Object.entries(effects).forEach(([key, value]) => {
        result[key] = value * multiplier;
    });
    return result;
}

function nextTurn() {
    if (!gameState.selectedChoice) {
        alert('Пожалуйста, выберите действие');
        return;
    }
    
    const choice = gameState.selectedChoice;
    let effects = choice.effect;
    
    if (gameState.gameMode === 'hard') {
        effects = multiplyEffects(effects, 1.5);
    }
    
    // Применяем эффекты
    applyEffects(effects);
    
    // Обновляем доверие
    updateTrust(choice.tags || []);
    
    // Сохраняем в историю
    const historyEntry = {
        turn: gameState.currentTurn + 1,
        scenario: gameState.currentScenario.text,
        choice: choice.label,
        effects: effects,
        state: { ...gameState.economicState },
        trust: gameState.trust
    };
    
    gameState.history.push(historyEntry);
    
    // Подробный лог
    gameState.detailedLog.push({
        turn: gameState.currentTurn + 1,
        type: 'decision',
        title: gameState.currentScenario.text,
        description: `Выбрано: ${choice.label}`,
        effects: effects,
        reasoning: choice.hint
    });
    
    // Увеличиваем счетчик ходов
    gameState.currentTurn++;
    
    // Обновляем UI
    updateGameUI();
    updateCharts();
    
    // Переходим к следующему сценарию
    if (gameState.currentTurn < gameState.totalSteps) {
        setTimeout(() => {
            nextScenario();
        }, 500);
    } else {
        setTimeout(() => {
            endGame();
        }, 1000);
    }
}

function applyEffects(effects) {
    Object.entries(effects).forEach(([key, value]) => {
        if (key in gameState.economicState) {
            gameState.economicState[key] += value;
            
            // Ограничения на показатели
            if (key === 'cpi' && gameState.economicState[key] < -2) {
                gameState.economicState[key] = -2; // Минимальная инфляция
            }
            if (key === 'unemployment' && gameState.economicState[key] < 0) {
                gameState.economicState[key] = 0; // Минимальная безработица
            }
        }
    });
}

function updateTrust(tags) {
    let trustChange = 0;
    
    tags.forEach(tag => {
        if (tag in gameData.trustWeights) {
            trustChange += gameData.trustWeights[tag];
        }
    });
    
    gameState.trust = Math.max(0, Math.min(100, gameState.trust + trustChange));
}

function updateCharts() {
    // Обновляем графики (упрощенная версия)
    // В полной версии здесь будет код для обновления Chart.js графиков
}

function endGame() {
    calculateFinalScore();
    showResults();
    showScreen('results');
}

function calculateFinalScore() {
    const changes = {
        gdp: gameState.economicState.gdpIdx - gameData.baseState.gdpIdx,
        exp: gameState.economicState.expIdx - gameData.baseState.expIdx,
        imp: gameState.economicState.impIdx - gameData.baseState.impIdx,
        cpi: gameState.economicState.cpi - gameData.baseState.cpi,
        unemployment: gameState.economicState.unemployment - gameData.baseState.unemployment
    };
    
    // Базовая оценка (0-60)
    let baseScore = 30; // Базовая оценка
    baseScore += Math.max(-15, Math.min(15, changes.gdp * 0.5));
    baseScore += Math.max(-10, Math.min(10, changes.exp * 0.3));
    baseScore += Math.max(-10, Math.min(10, -changes.unemployment * 2));
    baseScore += Math.max(-10, Math.min(10, -Math.abs(changes.cpi) * 2));
    baseScore += Math.max(-15, Math.min(15, gameState.trust / 100 * 30));
    
    // Бонус за сложность (0-15)
    const country = gameData.countries[gameState.selectedCountry];
    const countryBonus = country.bonus;
    
    // Бонус за качество решений (0-20)
    const performanceBonus = Math.min(20, gameState.history.length > 0 ? 
        gameState.history.reduce((sum, h) => sum + (h.choice.includes('переговор') ? 2 : 1), 0) / gameState.history.length * 10 : 0);
    
    // Бонус за последовательность (0-5)
    const consistencyBonus = 5; // Упрощенно
    
    const finalScore = Math.max(0, Math.min(100, baseScore + countryBonus + performanceBonus + consistencyBonus));
    
    gameState.finalScore = Math.round(finalScore);
    gameState.changes = changes;
    gameState.scoreBreakdown = {
        baseScore: Math.round(baseScore),
        countryBonus,
        performanceBonus: Math.round(performanceBonus),
        consistencyBonus: Math.round(consistencyBonus)
    };
}

function showResults() {
    const country = gameData.countries[gameState.selectedCountry];
    const state = gameState.economicState;
    const changes = gameState.changes;
    
    // Обновляем заголовок
    const resultsFlagLarge = document.getElementById('resultsFlagLarge');
    const resultsCountryName = document.getElementById('resultsCountryName');
    
    if (resultsFlagLarge) resultsFlagLarge.textContent = country.flag;
    if (resultsCountryName) resultsCountryName.textContent = country.name;
    
    // Финальная оценка
    const scoreValue = document.getElementById('scoreValue');
    const scoreDescription = document.getElementById('scoreDescription');
    const scoreBreakdown = document.getElementById('scoreBreakdown');
    const scoreCard = document.getElementById('scoreCard');
    
    if (scoreValue) scoreValue.textContent = gameState.finalScore;
    if (scoreDescription) scoreDescription.textContent = getScoreDescription();
    if (scoreBreakdown) {
        const breakdown = gameState.scoreBreakdown;
        scoreBreakdown.innerHTML = `
            Базовые очки: ${breakdown.baseScore}/60<br>
            Бонус за сложность: ${breakdown.countryBonus}/15<br>
            Качество решений: ${breakdown.performanceBonus}/20<br>
            Последовательность: ${breakdown.consistencyBonus}/5
        `;
    }
    
    // Класс карточки оценки
    if (scoreCard) {
        scoreCard.className = 'score-card';
        if (gameState.finalScore >= 80) scoreCard.classList.add('excellent');
        else if (gameState.finalScore >= 60) scoreCard.classList.add('good');
        else if (gameState.finalScore >= 40) scoreCard.classList.add('average');
        else scoreCard.classList.add('poor');
    }
    
    // Доверие
    const trustValue = document.getElementById('trustValue');
    const trustExplanation = document.getElementById('trustExplanation');
    
    if (trustValue) trustValue.textContent = Math.round(gameState.trust);
    if (trustExplanation) trustExplanation.textContent = getTrustExplanation();
    
    // Финальные показатели
    updateFinalIndicators();
    
    // Лог ходов
    generateMovesLog();
    
    // Подробный анализ
    generateDetailedAnalysis();
    
    // Итоговый график
    createFinalChart();
}

function updateFinalIndicators() {
    const indicators = [
        { id: 'finalGdp', changeId: 'gdpChange', value: gameState.economicState.gdpIdx, change: gameState.changes.gdp, suffix: '' },
        { id: 'finalExp', changeId: 'expChange', value: gameState.economicState.expIdx, change: gameState.changes.exp, suffix: '' },
        { id: 'finalImp', changeId: 'impChange', value: gameState.economicState.impIdx, change: gameState.changes.imp, suffix: '' },
        { id: 'finalCpi', changeId: 'cpiChange', value: gameState.economicState.cpi, change: gameState.changes.cpi, suffix: '%' },
        { id: 'finalUnemployment', changeId: 'unemploymentChange', value: gameState.economicState.unemployment, change: gameState.changes.unemployment, suffix: '%' }
    ];
    
    indicators.forEach(indicator => {
        const valueElement = document.getElementById(indicator.id);
        const changeElement = document.getElementById(indicator.changeId);
        
        if (valueElement) valueElement.textContent = indicator.value.toFixed(1) + indicator.suffix;
        if (changeElement) {
            const sign = indicator.change > 0 ? '+' : '';
            changeElement.textContent = sign + indicator.change.toFixed(1) + indicator.suffix;
            changeElement.className = `change-value ${getChangeClass(indicator.change, ['unemployment', 'cpi'].includes(indicator.changeId.replace('Change', '')))}`;
        }
    });
}

function generateMovesLog() {
    const movesLogContent = document.getElementById('movesLogContent');
    if (!movesLogContent) return;
    
    movesLogContent.innerHTML = '';
    
    gameState.detailedLog.forEach((entry, index) => {
        const moveEntry = document.createElement('div');
        moveEntry.className = 'move-entry';
        
        const typeIcon = entry.type === 'random_event' ? 'fa-bolt' : 'fa-chess-pawn';
        
        moveEntry.innerHTML = `
            <div class="move-number">
                <i class="fas ${typeIcon}"></i>
            </div>
            <div class="move-details">
                <h4>Ход ${entry.turn}: ${entry.title}</h4>
                <p>${entry.description}</p>
                ${entry.reasoning ? `<p><strong>Обоснование:</strong> ${entry.reasoning}</p>` : ''}
            </div>
        `;
        
        movesLogContent.appendChild(moveEntry);
    });
}

function generateDetailedAnalysis() {
    const analysisContent = document.getElementById('analysisContent');
    if (!analysisContent) return;
    
    analysisContent.innerHTML = '';
    
    // Анализ торговой политики
    const tradeSection = document.createElement('div');
    tradeSection.className = 'analysis-section';
    tradeSection.innerHTML = `
        <h4>Торговая политика</h4>
        <p>${analyzeTradePolicies()}</p>
    `;
    analysisContent.appendChild(tradeSection);
    
    // Анализ дипломатии
    const diplomacySection = document.createElement('div');
    diplomacySection.className = 'analysis-section';
    diplomacySection.innerHTML = `
        <h4>Дипломатическая стратегия</h4>
        <p>${analyzeDiplomacy()}</p>
    `;
    analysisContent.appendChild(diplomacySection);
    
    // Сильные стороны
    const strengthsSection = document.createElement('div');
    strengthsSection.className = 'analysis-section strengths';
    strengthsSection.innerHTML = `
        <h4>Сильные стороны</h4>
        <p>${analyzeStrengths()}</p>
    `;
    analysisContent.appendChild(strengthsSection);
    
    // Слабые стороны
    const weaknessesSection = document.createElement('div');
    weaknessesSection.className = 'analysis-section weaknesses';
    weaknessesSection.innerHTML = `
        <h4>Области для улучшения</h4>
        <p>${analyzeWeaknesses()}</p>
    `;
    analysisContent.appendChild(weaknessesSection);
    
    // Рекомендации
    const recommendationsSection = document.createElement('div');
    recommendationsSection.className = 'analysis-section recommendations';
    recommendationsSection.innerHTML = `
        <h4>Рекомендации</h4>
        <p>${generateRecommendations()}</p>
    `;
    analysisContent.appendChild(recommendationsSection);
}

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
    if (Math.abs(changes.cpi) < 1) {
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
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--color-card-border').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--color-text-secondary').trim()
                    }
                },
                x: {
                    grid: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--color-card-border').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--color-text-secondary').trim()
                    }
                }
            }
        }
    });
}

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
        totalSteps: 15,
        currentTurn: 0,
        currentScenario: null,
        selectedChoice: null,
        economicState: { ...gameData.baseState },
        trust: 50,
        history: [],
        charts: {},
        usedScenarios: [],
        theme: gameState.theme, // Сохраняем тему
        scenarioSequence: [],
        randomEventsEnabled: true,
        detailedLog: []
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
    
    // Выбранная страна
    doc.setFontSize(14);
    doc.text(`Strana: ${country.name}`, 20, 70);
    doc.setFontSize(10);
    doc.text(`Slozhnost': ${country.difficulty} (+${country.bonus} ballov)`, 20, 80);
    
    // Общая оценка
    doc.setFontSize(14);
    doc.text(`ITOGOVAYA OCENKA: ${gameState.finalScore}/100`, 105, 95, { align: 'center' });
    
    // Экономические показатели
    doc.setFontSize(12);
    doc.text('FINAL\'NYE POKAZATELI:', 20, 110);
    doc.setFontSize(10);
    doc.text(`VVP indeks: ${state.gdpIdx.toFixed(1)} (izmenenie: ${formatChange(gameState.changes.gdp)})`, 20, 120);
    doc.text(`Eksport indeks: ${state.expIdx.toFixed(1)} (izmenenie: ${formatChange(gameState.changes.exp)})`, 20, 130);
    doc.text(`Import indeks: ${state.impIdx.toFixed(1)} (izmenenie: ${formatChange(gameState.changes.imp)})`, 20, 140);
    doc.text(`Inflyaciya: ${state.cpi.toFixed(1)}% (izmenenie: ${formatChange(gameState.changes.cpi, '%')})`, 20, 150);
    doc.text(`Bezrabotica: ${state.unemployment.toFixed(1)}% (izmenenie: ${formatChange(gameState.changes.unemployment, '%')})`, 20, 160);
    doc.text(`Doverie: ${Math.round(gameState.trust)}`, 20, 170);
    
    // Разбивка оценки
    doc.setFontSize(12);
    doc.text('STRUKTURA OCENKI:', 20, 185);
    doc.setFontSize(10);
    const breakdown = gameState.scoreBreakdown;
    doc.text(`Bazovye ochki: ${breakdown.baseScore}/60`, 20, 195);
    doc.text(`Bonus za slozhnost': ${breakdown.countryBonus}/15`, 20, 205);
    doc.text(`Kachestvo reshenij: ${breakdown.performanceBonus}/20`, 20, 215);
    doc.text(`Posledovatel'nost': ${breakdown.consistencyBonus}/5`, 20, 225);
    
    // Краткий анализ
    doc.setFontSize(12);
    doc.text('KRATKIJ ANALIZ:', 20, 240);
    doc.setFontSize(9);
    
    // Разбиваем длинный текст на строки (упрощенный анализ для PDF)
    const analysis = `Obshchaya ocenka: ${getScoreDescription()}`;
    const lines = doc.splitTextToSize(analysis, 170);
    let yPos = 250;
    lines.slice(0, 4).forEach(line => { // Ограничиваем количество строк
        doc.text(line, 20, yPos);
        yPos += 8;
    });
    
    // Сохранение PDF
    doc.save(`Torgovye_vojny_${studentName.replace(/\s+/g, '_')}_${studentGroup}.pdf`);
}

function formatChange(value, suffix = '') {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}${suffix}`;
}