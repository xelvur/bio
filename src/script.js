(() => {
    const toggle = document.getElementById('themeToggle');
    const meta = document.querySelector('meta[name="theme-color"]');
    
    if (!toggle) return;

    // Вибрация
    const vibrate = (pattern) => {
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
        console.log('Vibration: ', pattern); //дебаг
      } else {
        console.log('Vibration no work');
      }
    };
  
    const setTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
        if (meta) meta.content = theme === 'dark' ? '#000' : '#fff';
        vibrate(25);
    };

    toggle.onclick = () => {
        const current = document.documentElement.dataset.theme || 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
    };

    // синхронизация вкладок
    window.onstorage = (e) => {
        if (e.key === 'theme' && e.newValue) setTheme(e.newValue);
    };

    // кастом курсор
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    document.body.appendChild(cursor);

    let hoverEl = null;

    const updateCursor = (x, y) => {
        cursor.style.setProperty('--x', x + 'px');
        cursor.style.setProperty('--y', y + 'px');
        
        const target = document.elementFromPoint(x, y)?.closest('.link');
        cursor.classList.toggle('visible', !!target);
        
        if (target !== hoverEl) {
            hoverEl?.classList.remove('hover');
            target?.classList.add('hover');

            if (target) {
              vibrate(25);
            }
          
            hoverEl = target;
        }
    };

    const hideCursor = () => {
        cursor.classList.remove('visible');
        hoverEl?.classList.remove('hover');
        hoverEl = null;
    };

    document.addEventListener('mousemove', e => updateCursor(e.clientX, e.clientY));
    document.addEventListener('mouseleave', hideCursor);
    
    // мобайл
    document.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        if (touch) {
          updateCursor(touch.clientX, touch.clientY);
          const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.link');
          if (target) vibrate(10);
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', e => {
        const touch = e.touches[0];
        if (touch) updateCursor(touch.clientX, touch.clientY);
    }, { passive: true });
    
    document.addEventListener('touchend', hideCursor, { passive: true });
    document.addEventListener('touchcancel', hideCursor, { passive: true });
})();