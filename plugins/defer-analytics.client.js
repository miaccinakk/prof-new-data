// Отложенная инициализация аналитики для улучшения TBT
export default defineNuxtPlugin(() => {
  // Откладываем выполнение аналитики до idle time
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Аналитика уже загружена через модули, 
      // этот плагин просто обеспечивает отложенную инициализацию
    }, { timeout: 3000 });
  }
});
