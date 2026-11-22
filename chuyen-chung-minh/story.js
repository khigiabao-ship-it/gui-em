(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const chapterButtons = [...document.querySelectorAll('[data-goto]')];
  const progressButtons = [...document.querySelectorAll('.chapter-button')];
  progressButtons.forEach(button => button.setAttribute('aria-label', button.textContent.trim()));
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');
  const autoplay = document.querySelector('#autoplay');
  const dialog = document.querySelector('#chapters-dialog');
  const stage = document.querySelector('#story');
  const captions = [
    'Một thế giới chưa có em.',
    'Một bình luận, mở đầu một câu chuyện.',
    'Hai thế giới bắt đầu chạm nhau.',
    'Người trong màn hình, giờ ở ngay đây.',
    'Thân thiết hơn, từng chút một.',
    'Gom những điều nhỏ bé thành kỷ niệm.',
    'Và những trang tiếp theo, mình cùng viết.'
  ];
  let current = 0;
  let playing = false;
  let elapsed = 0;
  let frame = 0;
  let lastTime = 0;
  let wipeTimeout = 0;
  let wheelTotal = 0;
  let lastWheel = 0;
  let wheelLock = 0;
  let pointerStart = null;
  let resumeAfterDialog = false;

  function indexFromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    return slides.findIndex(slide => slide.id === id);
  }

  function goTo(index, {updateHash = true, announce = true, focus = false} = {}) {
    index = Math.max(0, Math.min(slides.length - 1, index));
    if (index === current && slides[index].classList.contains('is-active')) return;
    current = index;
    elapsed = 0;
    lastTime = 0;
    document.body.style.setProperty('--progress', '0');
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.classList.toggle('is-before', i < current);
      slide.inert = !active;
      slide.setAttribute('aria-hidden', String(!active));
    });
    document.body.dataset.chapter = String(current);
    chapterButtons.forEach(button => {
      const active = Number(button.dataset.goto) === current;
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      button.classList.toggle('is-current', active);
      button.classList.toggle('is-past', Number(button.dataset.goto) < current);
    });
    previous.disabled = current === 0;
    next.textContent = current === slides.length - 1 ? 'Về đầu câu chuyện' : 'Cảnh tiếp';
    document.querySelector('#scene-caption').textContent = captions[current];
    document.querySelector('#scene-position').textContent = `${current + 1} / ${slides.length}`;
    document.querySelector('.skip-link').href = `#story-title-${current}`;
    document.title = `Kể từ khi có em — ${progressButtons[current].textContent.trim()}`;
    stage.classList.remove('is-transitioning');
    void stage.offsetWidth;
    stage.classList.add('is-transitioning');
    clearTimeout(wipeTimeout);
    wipeTimeout = setTimeout(() => stage.classList.remove('is-transitioning'), 1100);
    if (updateHash) history.replaceState(null, '', `#${slides[current].id}`);
    if (announce) {
      const title = slides[current].querySelector('h1,h2').textContent.replace(/\s+/g, ' ').trim();
      document.querySelector('#announcer').textContent = `Cảnh ${current + 1} trên ${slides.length}. ${title}`;
    }
    if (focus) slides[current].querySelector('h1,h2').focus({preventScroll: true});
    if (current === slides.length - 1 && playing) setPlaying(false);
  }

  function tick(time) {
    if (!playing || document.hidden || dialog.open) return;
    if (lastTime) elapsed += Math.max(0, time - lastTime);
    lastTime = time;
    const duration = Number(slides[current].dataset.duration) || 14000;
    document.body.style.setProperty('--progress', String(Math.min(elapsed / duration, 1)));
    if (elapsed >= duration) goTo(current + 1, {announce: false});
    if (playing) frame = requestAnimationFrame(tick);
  }

  function setPlaying(value) {
    playing = value;
    autoplay.setAttribute('aria-pressed', String(value));
    autoplay.setAttribute('aria-label', value ? 'Tạm dừng phim' : 'Xem như phim');
    autoplay.querySelector('span').textContent = value ? 'Tạm dừng phim' : 'Xem như phim';
    document.body.classList.toggle('is-playing', value);
    cancelAnimationFrame(frame);
    lastTime = 0;
    if (value && !document.hidden && !dialog.open) frame = requestAnimationFrame(tick);
  }

  chapterButtons.forEach(button => button.addEventListener('click', () => {
    const isDialogButton = dialog.contains(button);
    if (isDialogButton) {
      resumeAfterDialog = false;
      dialog.close();
    }
    goTo(Number(button.dataset.goto), {focus: isDialogButton});
  }));
  document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => goTo(current + 1, {focus: true})));
  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current === slides.length - 1 ? 0 : current + 1));
  document.querySelector('#replay').addEventListener('click', () => {
    setPlaying(false);
    goTo(0, {focus: true});
  });
  autoplay.addEventListener('click', () => {
    if (!playing && current === slides.length - 1) goTo(0);
    setPlaying(!playing);
  });
  document.querySelector('.wordmark').addEventListener('click', event => {
    event.preventDefault();
    setPlaying(false);
    goTo(0);
  });

  document.querySelector('#chapters-open').addEventListener('click', () => {
    resumeAfterDialog = playing;
    setPlaying(false);
    dialog.showModal();
  });
  document.querySelector('#chapters-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (resumeAfterDialog) setPlaying(true);
    resumeAfterDialog = false;
  });

  window.addEventListener('keydown', event => {
    if (dialog.open || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      goTo(current + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(current - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(slides.length - 1);
    } else if (event.code === 'Space' && !event.target.closest('button,a')) {
      event.preventDefault();
      if (!playing && current === slides.length - 1) goTo(0);
      setPlaying(!playing);
    }
  });

  stage.addEventListener('wheel', event => {
    if (dialog.open || event.ctrlKey || event.metaKey) return;
    const now = performance.now();
    const delta = (Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (now < wheelLock) return;
    if (now - lastWheel > 180 || Math.sign(delta) !== Math.sign(wheelTotal)) wheelTotal = 0;
    lastWheel = now;
    wheelTotal += delta;
    if (Math.abs(wheelTotal) > 65) {
      goTo(current + Math.sign(wheelTotal));
      wheelTotal = 0;
      wheelLock = now + 1100;
    }
  }, {passive: true});

  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || event.target.closest('button,a')) return;
    pointerStart = {x: event.clientX, y: event.clientY, id: event.pointerId};
  }, {passive: true});
  stage.addEventListener('pointerup', event => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) goTo(current + (dx < 0 ? 1 : -1));
  }, {passive: true});
  stage.addEventListener('pointercancel', () => { pointerStart = null; }, {passive: true});

  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frame);
    lastTime = 0;
    if (!document.hidden && playing && !dialog.open) frame = requestAnimationFrame(tick);
  });
  window.addEventListener('hashchange', () => {
    const index = indexFromHash();
    if (index >= 0) goTo(index, {updateHash: false});
  });

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 22; i++) {
      const particle = document.createElement('i');
      particle.className = 'particle';
      particle.style.setProperty('--x', `${25 + (i * 37) % 75}%`);
      particle.style.setProperty('--y', `${25 + (i * 23) % 75}%`);
      particle.style.setProperty('--duration', `${14 + i % 9}s`);
      particle.style.setProperty('--delay', `${-i * 1.6}s`);
      fragment.append(particle);
    }
    document.querySelector('#particles').append(fragment);
  }
  const initial = indexFromHash();
  if (initial > 0) goTo(initial, {updateHash: false, announce: false});

  // Fit the two illustrated interfaces below the copy on short phone screens.
  // The independent scale property preserves each scene's transform animation.
  function fitArtwork() {
    const phoneLayout = matchMedia('(max-width: 760px)').matches && !matchMedia('(orientation: landscape) and (max-height: 500px)').matches;
    slides.forEach(slide => {
      const art = slide.querySelector('.stage-art');
      art.style.setProperty('--art-height', `${art.clientHeight}px`);
      const interfaceArt = art.querySelector('.phone,.post-card');
      if (interfaceArt) {
        const scale = Math.max(.3, Math.min(1, (art.clientHeight - 18) / interfaceArt.offsetHeight, (art.clientWidth - 12) / interfaceArt.offsetWidth));
        interfaceArt.style.scale = phoneLayout ? String(scale) : '';
      }
    });
  }
  const artworkObserver = new ResizeObserver(fitArtwork);
  artworkObserver.observe(stage);
  slides.forEach(slide => artworkObserver.observe(slide.querySelector('.slide-copy')));
  document.fonts.ready.then(fitArtwork);
  requestAnimationFrame(fitArtwork);
})();
