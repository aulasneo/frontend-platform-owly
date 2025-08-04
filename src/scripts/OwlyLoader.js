class OwlyLoader {
  constructor() {
    this.s3BaseUrl = 'https://chat.owly.aulasneo.com/';
    this.containerId = 'owly-react-container';
    this.loaded = false;
  }

  load() {
    if (this.loaded) {
      console.warn('La aplicación ya fue cargada');
      return;
    }

    try {
      this.createContainer();
      this.embedIframe();
      this.loaded = true;
    } catch (error) {
      console.error('Error al cargar la aplicación:', error);
    }
  }

  embedIframe(options = {}) {
    // Crear el iframe
    const iframe = document.createElement('iframe');
    iframe.src = this.s3BaseUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';

    // Permitir opciones adicionales (por ejemplo, estilos extra)
    if (options.style && typeof options.style === 'object') {
      Object.assign(iframe.style, options.style);
    }

    // Crear el contenedor si no existe
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.style.width = '100%';
      container.style.height = '100vh';
      container.style.border = 'none';
    }

    // Insertar el iframe en el contenedor
    container.appendChild(iframe);

    // Insertar el contenedor antes del primer <script> (como GoogleAnalyticsLoader)
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && container.parentNode !== document.body) {
      firstScript.parentNode.insertBefore(container, firstScript);
    } else if (!container.parentNode) {
      document.body.appendChild(container);
    }

    // Guardar opciones de carga
    this._loadOptions = options;
  }

  load(options = {}) {
    if (this.loaded) {
      console.warn('La aplicación ya fue cargada');
      return;
    }

    try {
      this.embedIframe(options);
      this.loaded = true;
    } catch (error) {
      console.error('Error al cargar la aplicación:', error);
    }
  }
}

export default OwlyLoader;
