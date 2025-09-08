/**
 * @implements {OwlyLoader}
 * @memberof module:Owly
 */
class OwlyLoader {
  loadScript() {
    // 1) Evitar ejecución dentro de iframes
    if (typeof window !== 'undefined' && window.self !== window.top) {
      return;
    }

    // 2) Usar referencia segura al objeto global
    const root = (typeof window !== 'undefined') ? window : globalThis;
    root.owly = root.owly || [];
    const { owly } = root;

    // 3) Evitar doble inicialización por bandera
    if (owly.invoked) {
      return;
    }

    // 4) Evitar inyección duplicada del script si ya existe
    const existingScript = (typeof document !== 'undefined') && (
      document.querySelector('script[data-owly-embed="true"]') ||
      document.querySelector('script[src*="chat.owly.aulasneo.com/owly-chatbot-embed.min.js"]')
    );
    if (existingScript) {
      owly.invoked = true;
      return;
    }

    owly.invoked = true;

    owly.load = (key, options) => {
      const scriptSrc = document.createElement('script');
      scriptSrc.type = 'text/javascript';
      scriptSrc.async = true;
      scriptSrc.src = 'https://chat.owly.aulasneo.com/owly-chatbot-embed.min.js';
      scriptSrc.setAttribute('data-owly-embed', 'true');
      const first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(scriptSrc, first);

      owly._loadOptions = options;
    };

    owly.load();
  }
}

export default OwlyLoader;