const RECIPIENT_NAME = "someone";

const BIRTHDAY_MESSAGE =
`selamat menyambut serpihan rasa
yang telah melebur dalam fananya waktu.

kau adalah part terbaik
yang selalu kubuka dan kukenang kembali.
melihatmu dari jauh, itulah yang bisa kulakukan.
asal aku tahu dan bisa melihat senyuman itu.
karena jika kamu bahagia, aku pun begitu

untukmu, ucapan sederhana dariku.
momen ini terlalu disayangkan untuk hilang.
kali ini, tolong rasakan hadirnya.`;

const TYPING_SPEED = 32;

const MUSIC_VOLUME = 0.28;

const PLAYLIST = [
    { title: "I Will", artist: "The Beatles", src: "iwillthebeatles.flac" },
    { title: "All I Need To Hear", artist: "The 1975", src: "The 1975 - All I Need To Hear.mp3" },
    { title: "Berhasil", artist: "Perunggu", src: "Perunggu - Berhasil.mp3" },
    { title: "I'm Just a Man", artist: "Farrel Hillal", src: "Farrel Hilal - I m Just a Man.mp3" },
    { title: "Sampai Antariksa", artist: "Mirip Guntur", src: "Mirip Guntur - Sampai Antariksa.mp3" }
];

let currentTrackIndex = 0;


const bgMusic     = document.getElementById('bgMusic');
if (bgMusic && PLAYLIST.length) {
    bgMusic.src = PLAYLIST[currentTrackIndex].src;
    bgMusic.addEventListener('play',  renderPlaylist);
    bgMusic.addEventListener('pause', renderPlaylist);
}

const scenes      = document.querySelectorAll('.scene');
const yesBtn      = document.getElementById('yesBtn');
const ignoreBtn   = document.getElementById('ignoreBtn');
const hintText    = document.getElementById('hintText');
const mainFolder  = document.getElementById('mainFolder');
const folderOverlay = document.getElementById('folderOverlay');
const taskbarClock  = document.getElementById('taskbarClock');
const photoModal    = document.getElementById('photoModal');
const modalImg      = document.getElementById('modalImg');
const modalTitle    = document.getElementById('modalTitle');
const modalCaption  = document.getElementById('modalCaption');
const typingText    = document.getElementById('typingText');
const typingCursor  = document.getElementById('typingCursor');
const msgNav        = document.getElementById('msgNav');
const confettiCanvas = document.getElementById('confettiCanvas');
const hbdName       = document.getElementById('hbdName');


let currentScene = 1;
let typingInterval = null;

function goToScene(n) {
    scenes.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });

    const next = document.getElementById('scene' + n);
    if (!next) return;

    next.style.display = 'flex';
    void next.offsetWidth;
    next.classList.add('active');
    currentScene = n;

    switch (n) {
        case 2: initDesktop();   break;
        case 5: initMessageScene(); break;
        case 6: initSurpriseScene(); break;
        case 7: renderPlaylist(); break;
    }
}

function showScene(n) { goToScene(n); }


let ignoreHits = 0;
const hints = [
    "tombolnya bisa kabur, hehe",
    "ayo dong, klik MAUnya ",
    "gausah malu-malu deh",
    "okay..."
];

function moveIgnoreBtn() {
    const popup    = document.querySelector('.popup-window');
    const area     = document.getElementById('buttonArea');
    const popRect  = popup.getBoundingClientRect();
    const btnRect  = ignoreBtn.getBoundingClientRect();

    const maxDx = (popRect.width  / 2) - (btnRect.width  / 2) - 10;
    const maxDy = 28;

    const dx = (Math.random() * 2 - 1) * maxDx;
    const dy = (Math.random() * 2 - 1) * maxDy;

    ignoreBtn.style.transform  = `translate(${dx}px, ${dy}px)`;
    ignoreBtn.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';

    ignoreHits++;

    if (ignoreHits <= hints.length) {
        hintText.textContent = hints[ignoreHits - 1];
    }

    if (ignoreHits >= 3) {
        ignoreBtn.textContent = 'MAU';
        ignoreBtn.style.transform = 'translate(0,0)';

    }

    if (ignoreHits >= 4) {
        setTimeout(() => goToScene(2), 900);
    }
}

if (ignoreBtn) {
    ignoreBtn.addEventListener('mouseover', moveIgnoreBtn);
    ignoreBtn.addEventListener('click',     moveIgnoreBtn);
}

if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        playMusic();
        goToScene(2)
    });
}


function updateClock() {
    if (!taskbarClock) return;
    const now = new Date();
    const hh  = String(now.getHours()).padStart(2, '0');
    const mm  = String(now.getMinutes()).padStart(2, '0');
    taskbarClock.textContent = `${hh}:${mm}`;
}

function initDesktop() {
    updateClock();
    clearInterval(window._clockInterval);
    window._clockInterval = setInterval(updateClock, 30_000);
}

if (mainFolder) {
    mainFolder.addEventListener('click', function () {
        document.querySelectorAll('.desktop-icon').forEach(ic => ic.classList.remove('selected'));
        mainFolder.classList.add('selected');

        folderOverlay.style.display = 'flex';

        setTimeout(() => {
            folderOverlay.style.display = 'none';
            mainFolder.classList.remove('selected');
            goToScene(3);
        }, 950);
    });
}

function openDesktopIcon(icon) {
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');

    const targetScene = icon.dataset.targetScene;

    if (targetScene) {
        folderOverlay.style.display = 'flex';

        setTimeout(() => {
            folderOverlay.style.display = 'none';
            icon.classList.remove('selected');
            goToScene(Number(targetScene));
        }, 700);
        return;
    }

    setTimeout(() => icon.classList.remove('selected'), 1200);
}

document.querySelectorAll('.deco-icon').forEach(ic => {
    ic.addEventListener('click', () => openDesktopIcon(ic));
});



function openModal(src, caption) {
    modalImg.src = src;
    modalTitle.textContent   = caption;
    modalCaption.textContent = caption;
    photoModal.classList.add('open');

    modalImg.onerror = function () {
        this.src = '';
        this.alt = '📷 foto' + caption;
        this.style.display = 'none';
        document.querySelector('.modal-img-wrap').innerHTML =
            `<div style="padding:40px;font-size:30px;text-align:center;background:#f0e0f8">
                📷<br>
                <span style="font-family:var(--font-px);font-size:8px;display:block;margin-top:12px">
                    ${caption}
                </span>
             </div>`;
    };
}

function closeModal() {
    photoModal.classList.remove('open');
    modalImg.src = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});



function initMessageScene() {
    if (hbdName) hbdName.textContent = RECIPIENT_NAME;

    playMusic();

    if (!typingText || !typingCursor || !msgNav) return;
    typingText.textContent = '';
    typingCursor.style.display = 'inline';
    msgNav.style.display = 'none';

    clearInterval(typingInterval);

    let idx = 0;
    const text = BIRTHDAY_MESSAGE;

    typingInterval = setInterval(() => {
        if (idx < text.length) {
            typingText.textContent += text[idx];
            idx++;
            const box = typingText.parentElement;
            box.scrollTop = box.scrollHeight;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;

            typingCursor.style.display = 'none';
            msgNav.style.display = 'block';
            msgNav.style.animation = 'fadeInUp 0.5s ease both';
        }
    }, TYPING_SPEED);
}

function renderPlaylist() {
    const list = document.getElementById('playlistList');
    if (!list) return;

    list.innerHTML = '';

    PLAYLIST.forEach((song, i) => {
        const isPlaying = i === currentTrackIndex && bgMusic && !bgMusic.paused;

        const row = document.createElement('div');
        row.className = 'playlist-row' + (isPlaying ? ' is-playing' : '');

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'playlist-toggle';
        toggle.setAttribute('aria-label', (isPlaying ? 'Jeda ' : 'Putar ') + song.title);
        toggle.textContent = isPlaying ? '⏸' : '▶';
        toggle.addEventListener('click', () => togglePlaylistTrack(i));

        const num = document.createElement('span');
        num.className = 'playlist-num';
        num.textContent = String(i + 1).padStart(2, '0');

        const title = document.createElement('span');
        title.className = 'playlist-title';
        title.textContent = song.title;

        const artist = document.createElement('span');
        artist.className = 'playlist-artist';
        artist.textContent = song.artist;

        const meta = document.createElement('div');
        meta.className = 'playlist-meta';
        meta.appendChild(title);
        meta.appendChild(artist);

        row.appendChild(toggle);
        row.appendChild(num);
        row.appendChild(meta);
        list.appendChild(row);
    });
}

function loadTrack(index, autoplay) {
    if (!bgMusic || !PLAYLIST[index]) return;
    currentTrackIndex = index;
    bgMusic.src = PLAYLIST[index].src;
    if (autoplay) playMusic();
    renderPlaylist();
}

function togglePlaylistTrack(index) {
    if (!bgMusic || !PLAYLIST[index]) return;

    if (index === currentTrackIndex) {
        if (bgMusic.paused) playMusic();
        else bgMusic.pause();
    } else {
        loadTrack(index, true);
    }
}


function playMusic() {
    if (!bgMusic) return;
    bgMusic.volume = MUSIC_VOLUME;
    const p = bgMusic.play();
    if (p && p.catch) {
        p.catch(() => {
            document.addEventListener('click', () => bgMusic.play(), { once: true });
        });
    }
}

function stopMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    bgMusic.currentTime = 0;
}


let confettiAnim = null;

function initSurpriseScene() {
    if (hbdName) hbdName.textContent = RECIPIENT_NAME;

    playMusic();

    startConfetti();
}

function startConfetti() {
    if (!confettiCanvas) return;

    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const ctx = confettiCanvas.getContext('2d');

    const palette = [
        '#ff6ba8', '#ff9ec8', '#ffb3d9',
        '#6b9eff', '#b3d0ff',
        '#ffd700', '#ffe766',
        '#c4a0ff', '#e8c8ff',
        '#90ee90', '#c0ffd0',
        '#ffffff'
    ];

    const shapes = ['rect', 'circle', 'star'];

    const NUM_PARTICLES = 180;
    const particles = Array.from({ length: NUM_PARTICLES }, () => makeParticle(confettiCanvas, palette, shapes, true));

    function makeParticle(canvas, palette, shapes, fromTop) {
        return {
            x:        Math.random() * canvas.width,
            y:        fromTop ? (-20 - Math.random() * canvas.height * 0.5) : (Math.random() * canvas.height),
            w:        6 + Math.random() * 10,
            h:        5 + Math.random() * 8,
            color:    palette[Math.floor(Math.random() * palette.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.14,
            vx:       (Math.random() - 0.5) * 2.5,
            vy:       1.8 + Math.random() * 3.2,
            opacity:  0.75 + Math.random() * 0.25,
            shape:    shapes[Math.floor(Math.random() * shapes.length)]
        };
    }

    function drawStar(ctx, r) {
        const spikes = 5;
        const outer  = r;
        const inner  = r * 0.45;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outer : inner;
            const angle  = (i * Math.PI) / spikes - Math.PI / 2;
            ctx[i === 0 ? 'moveTo' : 'lineTo'](
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            );
        }
        ctx.closePath();
        ctx.fill();
    }

    cancelAnimationFrame(confettiAnim);

    function loop() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        particles.forEach(p => {
            p.x  += p.vx;
            p.y  += p.vy;
            p.rotation += p.rotSpeed;

            if (p.y > confettiCanvas.height + 20) {
                p.y  = -20;
                p.x  = Math.random() * confettiCanvas.width;
                p.vx = (Math.random() - 0.5) * 2.5;
                p.vy = 1.8 + Math.random() * 3;
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;

            switch (p.shape) {
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'star':
                    drawStar(ctx, p.w / 2);
                    break;
                default:
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            }

            ctx.restore();
        });

        confettiAnim = requestAnimationFrame(loop);
    }

    loop();
}

function stopConfetti() {
    cancelAnimationFrame(confettiAnim);
    confettiAnim = null;
    if (confettiCanvas) {
        const ctx = confettiCanvas.getContext('2d');
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}


function replayFromStart() {
    stopConfetti();
    stopMusic();
    clearInterval(typingInterval);
    typingInterval = null;

    ignoreHits = 0;
    if (ignoreBtn) {
        ignoreBtn.style.transform  = '';
        ignoreBtn.style.transition = '';
        ignoreBtn.textContent      = '✗ Ignore';
    }
    if (hintText) hintText.textContent = '';

    goToScene(1);
}


function spawnBird() {
    const sky = document.querySelector('.scene.active .pixel-sky');
    if (!sky) return;

    const goingRight = Math.random() < 0.5;
    const wrapper = document.createElement('div');
    wrapper.className = 'bird-fly ' + (goingRight ? 'fly-lr' : 'fly-rl');

    const top      = 8 + Math.random() * 34;
    const duration = 9 + Math.random() * 6;
    const bob      = Math.round(Math.random() * 30 - 15) + 'px';

    wrapper.style.top = top + '%';
    wrapper.style.animationDuration = duration + 's';
    wrapper.style.setProperty('--bob', bob);

    const bird = document.createElement('div');
    bird.className = 'pixel-bird';
    wrapper.appendChild(bird);

    sky.appendChild(wrapper);

    setTimeout(() => wrapper.remove(), duration * 1000 + 300);
}

function spawnBirdWave() {
    if (Math.random() < 0.25) return;

    const count = Math.random() < 0.7 ? 1 : 2;
    for (let i = 0; i < count; i++) {
        setTimeout(spawnBird, i * (350 + Math.random() * 500));
    }
}

setTimeout(spawnBirdWave, 2500);
setInterval(spawnBirdWave, 10000);


window.addEventListener('resize', () => {
    if (confettiCanvas && currentScene === 6) {
        confettiCanvas.width  = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
});


document.addEventListener('DOMContentLoaded', () => {
    if (hbdName) hbdName.textContent = RECIPIENT_NAME;
    
    goToScene(1);
});
