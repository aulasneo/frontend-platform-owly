/**
 * Loader universal para Owly: inserta un iframe en el DOM al estilo widget.
 */
class OwlyLoader {
  /**
   * Inserta el iframe de Owly en el DOM.
   * @param {Object} options - Configuración opcional.
   * @param {string} [options.s3BaseUrl] - URL del iframe.
   * @param {string} [options.containerId] - ID del contenedor.
   */
  static load(options = {}) {
    // Previene doble carga
    if (window.OwlyLoaderLoaded) return;
    window.OwlyLoaderLoaded = true;

    const s3BaseUrl = options.s3BaseUrl || 'https://chat.owly.aulasneo.com/';
    const containerId = options.containerId || 'owly-react-container';

    // Crea el contenedor si no existe
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.width = '100%';
      container.style.height = '100vh';
      container.style.border = 'none';
      document.body.appendChild(container);
    } else {
      container.innerHTML = '';
    }

    // Inserta el iframe
    const iframe = document.createElement('iframe');
    iframe.src = s3BaseUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.title = 'Owly Chat';
    container.appendChild(iframe);
  }
}

// Autoejecuta si hay configuración global
if (typeof window !== 'undefined') {
  const config = window.OwlyLoaderConfig || {};
  OwlyLoader.load(config);
}

export default OwlyLoader;