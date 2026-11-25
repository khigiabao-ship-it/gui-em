(() => {
  'use strict';
  const tracks = {
    'truoc-khi': {url: 'https://zingmp3.vn/embed/song/L3puMjr3Kqfg?start=false', title: 'Ngày dài vắng em'}
  };
  const slides = [...document.querySelectorAll('.slide')];
  const caption = document.querySelector('#scene-caption');
  const panel = document.querySelector('.music-trial');
  const container = document.querySelector('#music-trial-player');
  const status = document.querySelector('#music-trial-status');
  const title = document.querySelector('#music-trial-title');
  const body = document.querySelector('#music-trial-body');
  const toggle = document.querySelector('#music-trial-toggle');
  const start = document.querySelector('#music-trial-start');
  const stop = document.querySelector('#music-trial-stop');
  const previous = document.querySelector('#music-trial-prev');
  const next = document.querySelector('#music-trial-next');
  let expanded = true;
  let activeScene = null;
  function clearPlayer() {
    container.replaceChildren();
    panel.removeAttribute('data-track');
  }
  function render({autoplay = false} = {}) {
    clearPlayer();
    const index = Number(document.body.dataset.chapter) || 0;
    const scene = slides[index];
    activeScene = scene.id;
    title.textContent = caption.textContent;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    const track = tracks[scene.id];
    start.disabled = !track;
    stop.disabled = !track || !expanded;
    if (!expanded) return;
    if (!track) {
      const empty = document.createElement('p');
      empty.className = 'music-trial-empty';
      empty.textContent = 'Cảnh này chưa có link nhạc. Chọn “Ngày dài vắng em” để nghe thử.';
      container.append(empty);
      status.textContent = 'Khung nhạc của cảnh trước đã được đóng.';
      return;
    }
    const url = new URL(track.url);
    url.searchParams.set('start', String(autoplay));
    const frame = document.createElement('iframe');
    frame.src = url.toString();
    frame.title = 'Trình phát Zing MP3 — ' + track.title;
    frame.width = '640';
    frame.height = '220';
    frame.allow = 'autoplay; encrypted-media';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.setAttribute('scrolling', 'no');
    container.append(frame);
    panel.dataset.track = scene.id;
    status.textContent = autoplay
      ? 'Đang thử yêu cầu Zing tự phát. Nếu có nút phát trong khung, bạn có thể bấm trực tiếp.'
      : 'Bạn có thể bấm phát trong khung Zing nếu trình phát hiển thị nút phát.';
  }
  start.addEventListener('click', () => {
    expanded = true;
    body.hidden = false;
    toggle.textContent = 'Thu gọn';
    toggle.setAttribute('aria-expanded', 'true');
    render({autoplay: true});
  });
  stop.addEventListener('click', () => {
    clearPlayer();
    stop.disabled = true;
    status.textContent = 'Đã đóng trình phát và dừng nhạc.';
  });
  toggle.addEventListener('click', () => {
    expanded = !expanded;
    toggle.textContent = expanded ? 'Thu gọn' : 'Mở khung nhạc';
    toggle.setAttribute('aria-expanded', String(expanded));
    body.hidden = !expanded;
    if (expanded) render();
    else clearPlayer();
  });
  previous.addEventListener('click', () => document.querySelector('#previous').click());
  next.addEventListener('click', () => document.querySelector('#next').click());
  new MutationObserver(() => {
    const index = Number(document.body.dataset.chapter) || 0;
    if (slides[index].id !== activeScene) render();
  }).observe(document.body, {attributes: true, attributeFilter: ['data-chapter']});
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearPlayer();
      stop.disabled = true;
      status.textContent = 'Đã dừng khi rời trang. Bấm “Thử tự phát” để mở lại.';
    }
  });
  render();
})();
