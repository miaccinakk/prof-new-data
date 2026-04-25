// Асинхронная загрузка Element Plus CSS после первого рендера
// Это уменьшает блокирующий CSS и улучшает LCP/FCP

export default defineNuxtPlugin(() => {
  // Загружаем Element Plus CSS после интерактивности страницы
  if (typeof window !== 'undefined') {
    // Используем requestIdleCallback для загрузки в свободное время
    const loadElementCSS = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/_nuxt/element-plus.css';
      link.media = 'print'; // Не блокирует рендер
      link.onload = () => {
        link.media = 'all'; // Применяем после загрузки
      };
      document.head.appendChild(link);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadElementCSS, { timeout: 2000 });
    } else {
      // Fallback для Safari
      setTimeout(loadElementCSS, 100);
    }
  }
});
