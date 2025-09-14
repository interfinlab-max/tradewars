const I18N = {
  ru: {
    'game.title': 'Торговая война',
    'start.subtitle': 'Ты — экономический советник',
    'rules.title': 'Правила игры',
    'rules.item1': '12 статичных карточек на Normal, 15 ходов всего.',
    'rules.item2': 'Hard/Blind: 12 общих из 90 + 1–3 индивидуальных из 5.',
    'rules.item3': 'Предэффекты видны на Normal/Hard; скрыты на Blind.',
    'rules.item4': '6 показателей; графики и аналитика по итогам.',
    'difficulty.normal': 'Normal',
    'difficulty.hard': 'Hard',
    'difficulty.blind': 'Blind',
    'start.startBtn': 'Начать игру',
    'start.selectCountryFirst': 'Сначала выберите страну',
    'game.turn': 'Ход',
    'game.preEffectsExample': 'Предэффекты: пример влияния показателей.',
    'scenario.placeholderTitle': 'Сценарий (заглушка)',
    'scenario.placeholderText': 'Тут будет подробное описание сценария с контекстом.',
    'scenario.choiceA': 'Вариант A',
    'scenario.choiceB': 'Вариант B',
    'scenario.choiceC': 'Вариант C',
    'results.total': 'Итоговый балл',
    'results.analysis': 'Аналитика',
    'results.exportExcel': 'Скачать лог (Excel)',
    'results.exportPDF': 'Скачать PDF (A4)',
  },
  en: {
    'game.title': 'Trade War',
    'start.subtitle': 'You are the economic advisor',
    'rules.title': 'Rules',
    'rules.item1': '12 static cards on Normal, 15 turns total.',
    'rules.item2': 'Hard/Blind: 12 common out of 90 + 1–3 country-specific out of 5.',
    'rules.item3': 'Pre-effects visible on Normal/Hard; hidden on Blind.',
    'rules.item4': '6 metrics; charts and analytics at the end.',
    'difficulty.normal': 'Normal',
    'difficulty.hard': 'Hard',
    'difficulty.blind': 'Blind',
    'start.startBtn': 'Start game',
    'start.selectCountryFirst': 'Pick a country first',
    'game.turn': 'Turn',
    'game.preEffectsExample': 'Pre-effects: example impact preview.',
    'scenario.placeholderTitle': 'Scenario (placeholder)',
    'scenario.placeholderText': 'Detailed scenario description will be here.',
    'scenario.choiceA': 'Option A',
    'scenario.choiceB': 'Option B',
    'scenario.choiceC': 'Option C',
    'results.total': 'Total score',
    'results.analysis': 'Analysis',
    'results.exportExcel': 'Download log (Excel)',
    'results.exportPDF': 'Download PDF (A4)',
  },
  zh: {
    'game.title': '贸易战',
    'start.subtitle': '你是经济顾问',
    'rules.title': '规则',
    'rules.item1': '普通模式 12 张固定卡，共 15 回合。',
    'rules.item2': '困难/盲打：90 张通用中选 12 张 + 1–3 张国家特有。',
    'rules.item3': '普通/困难显示预效应；盲打隐藏。',
    'rules.item4': '6 项指标；结尾有图表与分析。',
    'difficulty.normal': '普通',
    'difficulty.hard': '困难',
    'difficulty.blind': '盲打',
    'start.startBtn': '开始游戏',
    'start.selectCountryFirst': '请先选择国家',
    'game.turn': '回合',
    'game.preEffectsExample': '预效应：示例影响预览。',
    'scenario.placeholderTitle': '情景（占位）',
    'scenario.placeholderText': '这里将有详细情景说明。',
    'scenario.choiceA': '选项 A',
    'scenario.choiceB': '选项 B',
    'scenario.choiceC': '选项 C',
    'results.total': '总分',
    'results.analysis': '分析',
    'results.exportExcel': '下载日志（Excel）',
    'results.exportPDF': '下载 PDF（A4）',
  },
};

function i18n_t(key, lang = 'ru') {
  return (I18N[lang] && I18N[lang][key]) || I18N['ru'][key] || key;
}

function i18n_apply(lang = 'ru') {
  document.documentElement.lang = lang === 'zh' ? 'zh' : (lang === 'en' ? 'en' : 'ru');
  const map = I18N[lang] || I18N.ru;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && map[key]) el.textContent = map[key];
  });
  document.querySelectorAll('[data-i18n-suffix]').forEach((el) => {
    const suffix = el.getAttribute('data-i18n-suffix') || '';
    el.textContent = (el.getAttribute('data-i18n') ? map[el.getAttribute('data-i18n')] + suffix : el.textContent);
  });
}

