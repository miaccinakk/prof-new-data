// Асинхронная загрузка Element Plus CSS после первого рендера
// Это уменьшает блокирующий CSS и улучшает LCP/FCP

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return;

  // Функция для неблокирующей загрузки CSS
  const loadCSS = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print'; // Не блокирует рендер
    link.onload = () => {
      link.media = 'all'; // Применяем после загрузки
    };
    document.head.appendChild(link);
  };

  // Загружаем CSS после первой отрисовки
  const loadAllCSS = () => {
    // Element Plus base styles
    import('element-plus/dist/index.css');
    
    // Swiper styles
    import('swiper/css');
    import('swiper/css/navigation');
    import('swiper/css/pagination');
  };

  // Загружаем после первой отрисовки контента
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadAllCSS, { timeout: 1000 });
  } else {
    // Fallback для Safari - загружаем после небольшой задержки
    setTimeout(loadAllCSS, 50);
  }
});
