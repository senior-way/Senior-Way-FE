// 한 줄에 꼭 맞게 폰트 크기 자동 축소
export default {
  mounted(el, binding) {
    const opts = typeof binding.value === 'object' ? binding.value : {};
    const max = Number(opts.max) || parseFloat(getComputedStyle(el).fontSize) || 28;
    const min = Number(opts.min) || 14;
    const step = Number(opts.step) || 0.5;

    const apply = () => {
      el.style.whiteSpace = 'nowrap';
      el.style.display = 'block';
      let size = max;
      el.style.fontSize = size + 'px';

      let guard = 0;
      while (el.scrollWidth > el.clientWidth && size > min && guard < 200) {
        size -= step;
        el.style.fontSize = size + 'px';
        guard++;
      }
    };

    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener('resize', apply);

    el.__fitlineCleanup = () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
    };

    queueMicrotask(apply);
  },
  beforeUnmount(el) {
    el.__fitlineCleanup && el.__fitlineCleanup();
    delete el.__fitlineCleanup;
  },
};
