/**
 * @implements {OwlyLoader}
 * @memberof module:Owly
 */
class OwlyLoader {
  loadScript() {
    global.owly = global.owly || [];
    const { owly } = global;

    if (owly.invoked) {
      return;
    }

    owly.invoked = true;

    owly.load = (key, options) => {
      const scriptSrc = document.createElement('script');
      scriptSrc.type = 'text/javascript';
      scriptSrc.async = true;
      scriptSrc.src = 'https://chat.owly.aulasneo.com/';
      const first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(scriptSrc, first);

      owly._loadOptions = options;
    };

    owly.load();
  }
}

export default OwlyLoader;