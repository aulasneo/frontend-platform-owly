import { getConfig } from '@edx/frontend-platform';

/**
 * @implements {OwlyLoader}
 * @memberof module:Owly
 */
class OwlyLoader {
  constructor(data = {}) {
    this.data = data;
  }

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

    // 4) Evitar inyección duplicada del script
    const existingScript = (typeof document !== 'undefined') && (
      document.querySelector('script[data-owly-embed="true"]') ||
      document.querySelector('script[src*="chat.owly-dev.aulasneo.link/owly-chatbot-embed.min.js"]')
    );
    if (existingScript) {
      owly.invoked = true;
      return;
    }

    // 5) Función de inyección real (marca invoked cuando realmente inyecta)
    const inject = (loadOptions) => {
      if (owly.invoked) return;
      owly.invoked = true;

      const scriptSrc = document.createElement('script');
      scriptSrc.type = 'text/javascript';
      scriptSrc.async = true;
      scriptSrc.src = 'https://chat.owly-dev.aulasneo.link/owly-chatbot-embed.min.js';
      scriptSrc.setAttribute('data-owly-embed', 'true');
      const first = document.getElementsByTagName('script')[0];
      first?.parentNode?.insertBefore(scriptSrc, first);

      owly._loadOptions = loadOptions;
    };

    // Mantener API owly.load para compatibilidad (inyecta inmediatamente)
    owly.load = (key, loadOptions) => inject(loadOptions);

    // 6) Consultar endpoint del LMS para el waffle flag y decidir
    try {
      const { LMS_BASE_URL } = getConfig();
      const base = (LMS_BASE_URL || '').replace(/\/$/, '');
      const url = new URL(`${base}/api/v1/owly-config/enable_owly_chat/`);

      fetch(url.toString(), { 
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then((res) => {
          if (!res.ok) { throw new Error(`HTTP ${res.status}`); }
          return res.json().catch(() => ({}));
        })
        .then((data) => {
          if (data?.enabled === true && data?.user_has_permission === true) {
            inject();
          }
        })
        .catch(() => {
          // Si falla la consulta, no inyectamos el script
        });
    } catch (_e) {
      // Silencioso; no inyectar en caso de error
    }
  }
}

export default OwlyLoader;
