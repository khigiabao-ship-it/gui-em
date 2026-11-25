(() => {
  'use strict';
  const audio = document.querySelector('#story-music');
  const toggle = document.querySelector('#music-toggle');
  const status = document.querySelector('#music-status');
  const slides = [...document.querySelectorAll('.slide')];
  if (!audio || !toggle || !status) return;

  const tracks = {
    'truoc-khi': {
      title: 'Ngày dài vắng em',
      src: './assets/audio/ngay-dai-vang-em-chorus-v29.mp3'
    },
    'threads': {
      title: 'Tìm thấy nhau',
      src: './assets/audio/tim-thay-nhau-chorus-v30.mp3'
    },
    'tin-nhan': {
      title: 'Yêu em qua dòng tin nhắn',
      src: './assets/audio/yeu-em-qua-dong-tin-nhan-chorus-v29.mp3'
    },
    'thu-vien': {
      title: 'Thích em hơi nhiều',
      src: './assets/audio/thich-em-hoi-nhieu-chorus-v30.mp3'
    },
    'gap-nhau': {
      title: 'Nắm lấy tay anh',
      src: './assets/audio/nam-lay-tay-anh-chorus-v30.mp3'
    },
    'gan-hon': {
      title: 'Nơi này có anh',
      src: './assets/audio/noi-nay-co-anh-chorus-v30.mp3'
    },
    'nghe-anh-hat': {
      title: 'Nép vào anh và nghe anh hát',
      src: './assets/audio/nep-vao-anh-va-nghe-anh-hat-chorus-v30.mp3'
    },
    'stay-please': {
      title: 'Stay, please',
      src: './assets/audio/stay-please-chorus-v30.mp3'
    },
    'co-mau': {
      title: 'Ánh nắng của anh',
      src: './assets/audio/anh-nang-cua-anh-chorus-v30.mp3'
    },
    'chung-minh': {
      title: 'Hơn cả yêu',
      src: './assets/audio/hon-ca-yeu-chorus-v30.mp3'
    }
  };
  let enabled = false;
  let chapter = '';
  let track = null;
  let generation = 0;
  let resumeOnReturn = false;
  audio.volume = 0.65;
  audio.loop = false;

  function render(state) {
    toggle.dataset.state = state;
    toggle.setAttribute('aria-pressed', String(enabled));
    const label = enabled ? 'Tắt nhạc' : 'Bật nhạc';
    toggle.setAttribute('aria-label', label);
    toggle.querySelector('span').textContent = label;
    const messages = {
      off: 'Nhạc đang tắt. Bấm Bật nhạc để nghe điệp khúc của cảnh.',
      ready: 'Nhạc đang tạm dừng.',
      loading: track ? 'Đang tải nhạc: ' + track.title + '.' : '',
      playing: track ? 'Đang phát điệp khúc: ' + track.title + '.' : '',
      ended: 'Đã hết điệp khúc. Chuyển cảnh để nghe bài tiếp theo.',
      unavailable: 'Cảnh này chưa có nhạc.',
      blocked: 'Bấm Bật nhạc một lần nữa để trình duyệt cho phép phát âm thanh.',
      error: 'Chưa tải được nhạc. Bấm Bật nhạc để thử lại.'
    };
    const message = messages[state] || '';
    status.textContent = message;
    toggle.title = label + (state === 'unavailable' ? ' — cảnh này chưa có bài' : '');
  }

  async function playSelected() {
    if (!enabled) return;
    if (!track) {
      render('unavailable');
      return;
    }
    if (document.hidden) {
      resumeOnReturn = true;
      render('ready');
      return;
    }
    const attempt = generation;
    if (audio.ended) audio.currentTime = 0;
    render('loading');
    try {
      await audio.play();
      if (attempt !== generation || !enabled) return;
      render(audio.paused ? 'ready' : 'playing');
    } catch (error) {
      if (attempt !== generation || !enabled || error.name === 'AbortError') return;
      enabled = false;
      resumeOnReturn = false;
      audio.pause();
      render(error.name === 'NotAllowedError' ? 'blocked' : 'error');
    }
  }

  function selectChapter() {
    const nextChapter = slides[Number(document.body.dataset.chapter)]?.id || slides[0]?.id;
    if (nextChapter === chapter) return;
    chapter = nextChapter;
    generation++;
    // A single audio element guarantees the old song stops before the next one.
    audio.pause();
    resumeOnReturn = false;
    track = tracks[chapter] || null;
    if (track) {
      audio.src = track.src;
      audio.load();
    } else if (audio.hasAttribute('src')) {
      audio.removeAttribute('src');
      audio.load();
    }
    if (enabled) void playSelected();
    else render('off');
  }

  toggle.addEventListener('click', () => {
    generation++;
    enabled = !enabled;
    resumeOnReturn = false;
    if (!enabled) {
      audio.pause();
      render('off');
      return;
    }
    if (audio.error && track) {
      audio.src = track.src;
      audio.load();
    }
    void playSelected();
  });
  audio.addEventListener('ended', () => {
    if (!audio.ended || !enabled) return;
    resumeOnReturn = false;
    render('ended');
  });
  audio.addEventListener('error', () => {
    if (!track || !enabled || !audio.error) return;
    generation++;
    enabled = false;
    resumeOnReturn = false;
    render('error');
  });
  audio.addEventListener('playing', () => {
    if (enabled && track) render('playing');
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      resumeOnReturn = enabled && !audio.paused && !audio.ended;
      generation++;
      audio.pause();
      if (resumeOnReturn) render('ready');
    } else if (resumeOnReturn && enabled) {
      resumeOnReturn = false;
      void playSelected();
    }
  });
  window.addEventListener('pagehide', () => audio.pause());
  new MutationObserver(selectChapter).observe(document.body, {
    attributes: true,
    attributeFilter: ['data-chapter']
  });
  selectChapter();
})();
