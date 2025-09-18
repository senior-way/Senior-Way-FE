// src/directives/fitline.js
export default {
  mounted(el, binding) {
    const getOpts = (b) => {
      const v = (b && typeof b.value === 'object') ? b.value : {};
      return {
        max: Number(v.max) || parseFloat(getComputedStyle(el).fontSize) || 28,
        min: Number(v.min) || 14,
        step: Number(v.step) || 0.5,
      };
    };

    const wrapLines = () => {
      if (el.__fitlineWrapped) return;
      el.__fitlineOriginal = el.innerHTML;
      const html = el.innerHTML;
      const parts = html.split(/<br\s*\/?>/gi);
      const wrapped = parts
        .map(p => `<span class="__fitlineLine">${p}</span>`)
        .join('<br/>');
      el.innerHTML = wrapped;
      el.__fitlineWrapped = true;
    };

    const fit = (opts) => {
      wrapLines();
      const width = el.clientWidth || el.getBoundingClientRect().width || 0;
      const lines = el.querySelectorAll('span.__fitlineLine');
      lines.forEach((line) => {
        line.style.whiteSpace = 'nowrap';
        line.style.display = 'inline-block';
        line.style.maxWidth = '100%';

        let size = opts.max;
        line.style.fontSize = size + 'px';
        let guard = 0;
        while (line.scrollWidth > width && size > opts.min && guard < 200) {
          size -= opts.step;
          line.style.fontSize = size + 'px';
          guard++;
        }
      });
    };

    const apply = (b = binding) => fit(getOpts(b));
    apply();

    const ro = new ResizeObserver(() => apply());
    ro.observe(el);
    const onResize = () => apply();
    window.addEventListener('resize', onResize);

    el.__fitlineApply = apply;
    el.__fitlineCleanup = () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      if (el.__fitlineWrapped && el.__fitlineOriginal != null) {
        el.innerHTML = el.__fitlineOriginal;
        el.__fitlineWrapped = false;
      }
    };
  },
  updated(el, binding) {
    el.__fitlineApply && el.__fitlineApply(binding);
  },
  beforeUnmount(el) {
    el.__fitlineCleanup && el.__fitlineCleanup();
    delete el.__fitlineApply;
    delete el.__fitlineCleanup;
  },
};
