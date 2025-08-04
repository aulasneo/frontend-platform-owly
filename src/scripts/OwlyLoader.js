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

  createContainer() {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.style.width = '100%';
      container.style.height = '100vh';
      container.style.border = 'none';
      document.body.appendChild(container);
    }
  }

  embedIframe() {
    const iframe = document.createElement('iframe');
    iframe.src = this.s3BaseUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';

    const container = document.getElementById(this.containerId);
    container.appendChild(iframe);
  }
}

export default OwlyLoader;
