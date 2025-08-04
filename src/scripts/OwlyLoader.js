/**
 * Cargador para la aplicación React de Owly
 * @memberof module:Owly
 */
class OwlyLoader {
  constructor() {
    this.s3BaseUrl = 'https://chat.owly.aulasneo.com';
    this.containerId = 'owly-react-container';
    this.loaded = false;
  }

  /**
   * Inicia la carga de la aplicación React
   */
  load() {
    if (this.loaded) {
      console.warn('La aplicación React ya fue cargada');
      return;
    }

    try {
      this.createContainer();
      this.loadAssets();
      this.loaded = true;
    } catch (error) {
      console.error('Error al cargar la aplicación React:', error);
    }
  }

  /**
   * Crea el contenedor para la aplicación React
   */
  createContainer() {
    // Crear contenedor principal si no existe
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      document.body.appendChild(container);
    }
    
    // Crear root de React
    const reactRoot = document.createElement('div');
    reactRoot.id = 'root';
    container.appendChild(reactRoot);
  }

  /**
   * Carga los assets (CSS y JS) de la aplicación
   */
  loadAssets() {
    // Cargar CSS principal
    this.loadCSS('static/css/main.css');
    
    // Cargar scripts en el orden correcto
    this.loadScript('static/js/runtime-main.js', () => {
      this.loadScript('static/js/2.chunk.js', () => {
        this.loadScript('static/js/main.chunk.js', () => {
          console.log('Aplicación React cargada correctamente');
        });
      });
    });
  }

  /**
   * Carga un archivo CSS
   * @param {string} filePath - Ruta del archivo CSS en S3
   */
  loadCSS(filePath) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = this.s3BaseUrl + filePath;
    document.head.appendChild(link);
  }

  /**
   * Carga un script
   * @param {string} filePath - Ruta del archivo JS en S3
   * @param {function} callback - Función a ejecutar después de cargar
   */
  loadScript(filePath, callback) {
    const script = document.createElement('script');
    script.src = this.s3BaseUrl + filePath;
    script.onload = callback;
    script.onerror = () => console.error(`Error cargando ${filePath}`);
    document.body.appendChild(script);
  }
}

export default OwlyLoader;