/* ================================================================
   BIRTHDAY WEBSITE — script.js
   Mengontrol semua scene, animasi, dan interaksi

   ✏️ BAGIAN YANG PERLU KAMU GANTI ADA DI ATAS
================================================================ */


/* ================================================================
   ✏️ KONFIGURASI — EDIT DI SINI
================================================================ */

/**
 * Nama penerima (tampil di Scene 6 Surprise)
 * Ganti "[ Nama Kamu ]" dengan nama asli.
 */
const RECIPIENT_NAME = "AMBA ❤️";

/**
 * Pesan ulang tahun (Scene 5)
 * Gunakan \n untuk baris baru.
 * Ganti semua teks di antara backtick (`) ini.
 */
const BIRTHDAY_MESSAGE =
`Selamat ulang tahun, ambaku... 🌸

Di hari yang spesial ini, aku ingin kamu tahu bahwa setiap momen bersamamu adalah hadiah paling berharga yang pernah aku terima.

Kamu adalah alasan di balik setiap senyumku, setiap tawa, dan setiap hari yang terasa lebih berwarna dan bermakna.

Teruslah bersinar seperti bintang yang paling terang — karena dunia ini jauh lebih indah dengan kehadiranmu.

Semoga semua impianmu terwujud, semua doamu dikabulkan, dan semua cintamu dikembalikan berlipat ganda. 💫

I love you more than words can ever say... ❤️`;

/**
 * Kecepatan mengetik (ms per karakter)
 * Kecilkan angka → lebih cepat
 * Besarkan angka → lebih lambat
 */
const TYPING_SPEED = 32;

/**
 * Volume musik latar (0.0 – 1.0)
 */
const MUSIC_VOLUME = 0.28;


/* ================================================================
   ELEMENT REFERENCES
================================================================ */
const bgMusic     = document.getElementById('bgMusic');
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


/* ================================================================
   SCENE MANAGER
================================================================ */
let currentScene = 1;
let typingInterval = null;  // referensi interval typing

/**
 * Pindah ke scene tertentu (1–6)
 */
function goToScene(n) {
    // Sembunyikan semua scene
    scenes.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });

    const next = document.getElementById('scene' + n);
    if (!next) return;

    next.style.display = 'flex';
    // Paksa reflow agar animasi restart
    void next.offsetWidth;
    next.classList.add('active');
    currentScene = n;

    // Aksi khusus per scene
    switch (n) {
        case 2: initDesktop();   break;
        case 5: initMessageScene(); break;
        case 6: initSurpriseScene(); break;
    }
}

// Alias agar bisa dipanggil dari HTML
function showScene(n) { goToScene(n); }


/* ================================================================
   SCENE 1 — OPENING: TOMBOL IGNORE KABUR
================================================================ */
let ignoreHits = 0;     // berapa kali tombol disentuh
const hints = [
    "Nggak bisa kabur 😏",
    "Ayolah, klik Yesnya~ 🥺",
    "Udah deh, pencet Yes ❤️",
    "Oke baik... *buka sendiri* 😄"
];

/**
 * Gerakkan tombol Ignore ke posisi random di dalam popup
 */
function moveIgnoreBtn() {
    const popup    = document.querySelector('.popup-window');
    const area     = document.getElementById('buttonArea');
    const popRect  = popup.getBoundingClientRect();
    const btnRect  = ignoreBtn.getBoundingClientRect();

    /* Batas gerak (agar tidak keluar jendela popup) */
    const maxDx = (popRect.width  / 2) - (btnRect.width  / 2) - 10;
    const maxDy = 28;

    const dx = (Math.random() * 2 - 1) * maxDx;
    const dy = (Math.random() * 2 - 1) * maxDy;

    ignoreBtn.style.transform  = `translate(${dx}px, ${dy}px)`;
    ignoreBtn.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';

    ignoreHits++;

    /* Tampilkan hint teks */
    if (ignoreHits <= hints.length) {
        hintText.textContent = hints[ignoreHits - 1];
    }

    /* Setelah 4 kali → lanjut otomatis (easter egg kecil) */
    if (ignoreHits >= 4) {
        ignoreBtn.textContent = '... oke 😅';
        ignoreBtn.style.transform = 'translate(0,0)';
        setTimeout(() => goToScene(2), 900);
    }
}

if (ignoreBtn) {
    ignoreBtn.addEventListener('mouseover', moveIgnoreBtn);  // kabur saat hover
    ignoreBtn.addEventListener('click',     moveIgnoreBtn);  // dan saat diklik
}

if (yesBtn) {
    yesBtn.addEventListener('click', () => goToScene(2));
}


/* ================================================================
   SCENE 2 — DESKTOP
================================================================ */

/** Jam digital di taskbar */
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

/** Animasi folder terbuka → pindah ke scene 3 */
if (mainFolder) {
    mainFolder.addEventListener('click', function () {
        /* Tandai ikon sebagai selected */
        document.querySelectorAll('.desktop-icon').forEach(ic => ic.classList.remove('selected'));
        mainFolder.classList.add('selected');

        /* Tampilkan overlay animasi */
        folderOverlay.style.display = 'flex';

        setTimeout(() => {
            folderOverlay.style.display = 'none';
            mainFolder.classList.remove('selected');
            goToScene(3);
        }, 950);
    });
}

/* Klik ikon dekorasi: visual saja */
document.querySelectorAll('.deco-icon').forEach(ic => {
    ic.addEventListener('click', function () {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
        ic.classList.add('selected');
        setTimeout(() => ic.classList.remove('selected'), 1500);
    });
});


/* ================================================================
   SCENE 4 — GALERI: MODAL FOTO
================================================================ */

/**
 * Buka modal preview foto
 * @param {string} src    - path file foto
 * @param {string} caption - teks judul/caption
 */
function openModal(src, caption) {
    modalImg.src = src;
    modalTitle.textContent   = caption;
    modalCaption.textContent = caption;
    photoModal.classList.add('open');

    /* Jika foto tidak ditemukan → tampilkan placeholder */
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

/** Tutup modal */
function closeModal() {
    photoModal.classList.remove('open');
    modalImg.src = '';
}

/* Tutup dengan ESC */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});


/* ================================================================
   SCENE 5 — PESAN PERSONAL: TYPING EFFECT + MUSIK
================================================================ */

function initMessageScene() {
    /* Isi nama penerima */
    if (hbdName) hbdName.textContent = RECIPIENT_NAME;

    /* Mulai musik latar */
    playMusic();

    /* Reset typing area */
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
            /* Scroll ke bawah secara otomatis */
            const box = typingText.parentElement;
            box.scrollTop = box.scrollHeight;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;

            /* Sembunyikan cursor, tampilkan tombol next */
            typingCursor.style.display = 'none';
            msgNav.style.display = 'block';
            msgNav.style.animation = 'fadeInUp 0.5s ease both';
        }
    }, TYPING_SPEED);
}

/** Coba mainkan musik (handle autoplay policy browser) */
function playMusic() {
    if (!bgMusic) return;
    bgMusic.volume = MUSIC_VOLUME;
    const p = bgMusic.play();
    if (p && p.catch) {
        p.catch(() => {
            /* Autoplay diblokir browser — tunggu interaksi user */
            document.addEventListener('click', () => bgMusic.play(), { once: true });
        });
    }
}

/** Hentikan musik & reset */
function stopMusic() {
    if (!bgMusic) return;
    bgMusic.pause();
    bgMusic.currentTime = 0;
}


/* ================================================================
   SCENE 6 — SURPRISE ENDING: CONFETTI
================================================================ */

let confettiAnim = null;  // requestAnimationFrame handle

function initSurpriseScene() {
    /* Isi nama */
    if (hbdName) hbdName.textContent = RECIPIENT_NAME;

    /* Lanjutkan atau mulai musik */
    playMusic();

    /* Jalankan confetti */
    startConfetti();
}

/**
 * Mesin confetti berbasis Canvas
 */
function startConfetti() {
    if (!confettiCanvas) return;

    /* Ukuran canvas = layar penuh */
    confettiCanvas.width  = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const ctx = confettiCanvas.getContext('2d');

    /* Warna palet confetti */
    const palette = [
        '#ff6ba8', '#ff9ec8', '#ffb3d9',
        '#6b9eff', '#b3d0ff',
        '#ffd700', '#ffe766',
        '#c4a0ff', '#e8c8ff',
        '#90ee90', '#c0ffd0',
        '#ffffff'
    ];

    /* Bentuk confetti */
    const shapes = ['rect', 'circle', 'star'];

    /* Buat partikel */
    const NUM_PARTICLES = 180;
    const particles = Array.from({ length: NUM_PARTICLES }, () => makeParticle(confettiCanvas, palette, shapes, true));

    /** Buat satu partikel */
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

    /** Gambar satu bintang kecil */
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
            /* Update posisi */
            p.x  += p.vx;
            p.y  += p.vy;
            p.rotation += p.rotSpeed;

            /* Reset saat keluar bawah layar */
            if (p.y > confettiCanvas.height + 20) {
                p.y  = -20;
                p.x  = Math.random() * confettiCanvas.width;
                p.vx = (Math.random() - 0.5) * 2.5;
                p.vy = 1.8 + Math.random() * 3;
            }

            /* Gambar */
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
                default: /* rect */
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            }

            ctx.restore();
        });

        confettiAnim = requestAnimationFrame(loop);
    }

    loop();
}

/** Hentikan confetti */
function stopConfetti() {
    cancelAnimationFrame(confettiAnim);
    confettiAnim = null;
    if (confettiCanvas) {
        const ctx = confettiCanvas.getContext('2d');
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}


/* ================================================================
   REPLAY — KEMBALI KE AWAL
================================================================ */
function replayFromStart() {
    /* Bersihkan semua state */
    stopConfetti();
    stopMusic();
    clearInterval(typingInterval);
    typingInterval = null;

    /* Reset tombol ignore */
    ignoreHits = 0;
    if (ignoreBtn) {
        ignoreBtn.style.transform  = '';
        ignoreBtn.style.transition = '';
        ignoreBtn.textContent      = '✗ Ignore';
    }
    if (hintText) hintText.textContent = '';

    /* Kembali ke scene 1 */
    goToScene(1);
}


/* ================================================================
   WINDOW RESIZE — update canvas confetti
================================================================ */
window.addEventListener('resize', () => {
    if (confettiCanvas && currentScene === 6) {
        confettiCanvas.width  = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
});


/* ================================================================
   INIT — jalankan saat halaman pertama kali dimuat
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
    /* Set nama penerima */
    if (hbdName) hbdName.textContent = RECIPIENT_NAME;

    /* Tampilkan scene pertama */
    goToScene(1);
});
