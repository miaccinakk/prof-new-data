/**
 * Плагин для отложенной загрузки некритических CSS
 * Критические Bulma стили уже инлайнены в main.scss
 * Полный Bulma загружается асинхронно для дополнительных утилит
 */
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return;

  // Функция для неблокирующей загрузки CSS
  const loadCSSAsync = (href) => {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      // Используем media="print" trick для неблокирующей загрузки
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
        resolve();
      };
      link.onerror = resolve;
      document.head.appendChild(link);
    });
  };

  // Загружаем дополнительные стили после интерактивности страницы
  const loadDeferredStyles = async () => {
    // Загружаем Bulma для дополнительных утилит (кнопки, формы и т.д.)
    await loadCSSAsync('https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css');
  };

  // Используем requestIdleCallback для загрузки в свободное время браузера
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loadDeferredStyles(), { timeout: 2000 });
  } else {
    // Fallback для Safari - загружаем после интерактивности
    setTimeout(loadDeferredStyles, 100);
  }
});
