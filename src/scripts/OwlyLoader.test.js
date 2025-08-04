import OwlyLoader from './OwlyLoader';

describe('OwlyLoader', () => {
  let owlyLoader;

  beforeEach(() => {
    // Limpiar el DOM antes de cada test
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    
    // Crear nueva instancia del loader
    owlyLoader = new OwlyLoader();
    
    // Mockear console.error para detectar errores
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restaurar console.error
    console.error.mockRestore();
  });

  describe('when loading the React app', () => {
    beforeEach(() => {
      owlyLoader.load();
    });

    it('should create the React container div', () => {
      const container = document.getElementById('owly-react-container');
      expect(container).not.toBeNull();
    });

    it('should create the React root div inside container', () => {
      const rootDiv = document.querySelector('#owly-react-container #root');
      expect(rootDiv).not.toBeNull();
    });

    it('should load the main CSS file', () => {
      const cssLinks = document.head.querySelectorAll('link[rel="stylesheet"]');
      expect(cssLinks.length).toBe(1);
      expect(cssLinks[0].href).toContain('static/css/main.css');
    });

    it('should load the runtime script first', () => {
      const scripts = document.body.querySelectorAll('script');
      expect(scripts.length).toBeGreaterThanOrEqual(1);
      expect(scripts[0].src).toContain('static/js/runtime-main.js');
    });

    it('should not load the app multiple times', () => {
      const initialScriptCount = document.body.querySelectorAll('script').length;
      owlyLoader.load(); // Intentar cargar de nuevo
      expect(document.body.querySelectorAll('script').length).toBe(initialScriptCount);
    });
  });

  describe('when script loading fails', () => {
    beforeEach(() => {
      // Simular error en la carga del script
      jest.spyOn(owlyLoader, 'loadScript').mockImplementation(() => {
        throw new Error('Loading failed');
      });
      
      owlyLoader.load();
    });

    it('should log an error message', () => {
      expect(console.error).toHaveBeenCalledWith(
        'Error al cargar la aplicación React:',
        expect.any(Error)
      );
    });
  });

  describe('before loading', () => {
    it('should not have any scripts or containers', () => {
      expect(document.getElementById('owly-react-container')).toBeNull();
      expect(document.head.querySelectorAll('link[rel="stylesheet"]').length).toBe(0);
      expect(document.body.querySelectorAll('script').length).toBe(0);
    });
  });
});
