/**
 * Плагин для асинхронной загрузки некритических CSS
 * Помогает избежать render-blocking стилей
 */
export default defineNuxtPlugin(() => {
  // Функция для асинхронной загрузки CSS
  const loadStyleAsync = (href) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.media = 'print'
    link.onload = () => {
      link.media = 'all'
    }
    document.head.appendChild(link)
  }

  // Если нужно загрузить дополнительные стили асинхронно
  // Например, стили для компонентов, которые появляются только после взаимодействия
  
  // Preload для критичных шрифтов уже настроен в nuxt.config через google-fonts модуль
})
