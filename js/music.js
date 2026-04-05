// js/music.js
(function() {
    let currentAudio = null;
    let isPlaying = false;
    let currentSongIndex = 1;
    let playBtn = null;
    let progressBar = null;
    let progressFill = null;
    let timeLabel = null;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* === MUSIC PLAYER BAR === */
        .music-player-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            margin-bottom: 6px;
            background: linear-gradient(135deg, rgba(9,132,227,0.06), rgba(116,185,255,0.1));
            border-radius: 12px;
            border: 1px solid rgba(9,132,227,0.1);
        }
        /* Nút prev/next */
        .music-player-wrapper .mc-btn {
            width: 26px;
            height: 26px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            transition: all 0.2s ease;
            background: rgba(9,132,227,0.1);
            color: #0984e3;
            flex-shrink: 0;
        }
        .music-player-wrapper .mc-btn:hover {
            background: rgba(9,132,227,0.22);
            transform: scale(1.12);
        }
        .music-player-wrapper .mc-btn:active {
            transform: scale(0.9);
        }
        .music-player-wrapper .mc-btn svg {
            width: 13px;
            height: 13px;
            fill: currentColor;
        }
        /* Nút play chính */
        .music-player-wrapper .mc-play {
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            padding: 0;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.12);
            flex-shrink: 0;
        }
        .music-player-wrapper .mc-play:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 12px rgba(9,132,227,0.3);
        }
        .music-player-wrapper .mc-play:active {
            transform: scale(0.94);
        }
        .music-player-wrapper .mc-play img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
            display: block;
        }

        /* Progress bar */
        .mc-progress-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 3px;
            min-width: 0;
        }
        .mc-progress-track {
            width: 100%;
            height: 4px;
            background: rgba(9,132,227,0.12);
            border-radius: 4px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .mc-progress-track:hover {
            height: 6px;
        }
        .mc-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #0984e3, #74b9ff);
            border-radius: 4px;
            width: 0%;
            transition: width 0.2s linear;
        }
        .mc-time {
            font-size: 10px;
            color: #636e72;
            font-weight: 600;
            font-family: 'Montserrat', monospace;
            display: flex;
            justify-content: space-between;
        }
    `;
    document.head.appendChild(styleSheet);

    function formatTime(sec) {
        if (isNaN(sec) || !isFinite(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function updatePlayBtnStyle() {
        if (!playBtn) return;
        const img = playBtn.querySelector('img');
        if (!img) return;
        if (isPlaying) {
            img.src = 'anhnen/nutdangphat.jpg';
            playBtn.classList.add('playing');
        } else {
            img.src = 'anhnen/nutdangtat.avif';
            playBtn.classList.remove('playing');
        }
    }

    function updateProgress() {
        if (!currentAudio || !progressFill || !timeLabel) return;
        const current = currentAudio.currentTime || 0;
        const duration = currentAudio.duration || 0;
        const pct = duration > 0 ? (current / duration * 100) : 0;
        progressFill.style.width = pct + '%';
        timeLabel.innerHTML = '<span>' + formatTime(current) + '</span><span>' + formatTime(duration) + '</span>';
    }

    const prevSVG = `<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>`;
    const nextSVG = `<svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zm-10 6l8.5 6V6z" transform="scale(-1,1) translate(-24,0)"/></svg>`;

    function buildPlayerUI() {
        // Wrapper chính
        const wrapper = document.createElement('div');
        wrapper.className = 'music-player-wrapper';

        // Nút Prev
        const prevBtn = document.createElement('button');
        prevBtn.className = 'mc-btn';
        prevBtn.title = 'Bài trước';
        prevBtn.innerHTML = prevSVG;
        prevBtn.onclick = (e) => { e.stopPropagation(); playPrevSong(); };

        // Nút Play
        playBtn = document.createElement('button');
        playBtn.className = 'mc-play';
        playBtn.title = 'Bật/Tắt Nhạc';
        playBtn.innerHTML = '<img src="anhnen/nutdangtat.avif" alt="Nhạc">';

        // Nút Next
        const nextBtn = document.createElement('button');
        nextBtn.className = 'mc-btn';
        nextBtn.title = 'Bài tiếp';
        nextBtn.innerHTML = nextSVG;
        nextBtn.onclick = (e) => { e.stopPropagation(); playNextSong(); };

        // Progress area
        const progressArea = document.createElement('div');
        progressArea.className = 'mc-progress-area';

        progressBar = document.createElement('div');
        progressBar.className = 'mc-progress-track';
        progressFill = document.createElement('div');
        progressFill.className = 'mc-progress-fill';
        progressBar.appendChild(progressFill);

        // Click để seek
        progressBar.onclick = (e) => {
            e.stopPropagation();
            if (!currentAudio || !currentAudio.duration) return;
            const rect = progressBar.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            currentAudio.currentTime = pct * currentAudio.duration;
        };

        timeLabel = document.createElement('div');
        timeLabel.className = 'mc-time';
        timeLabel.innerHTML = '<span>0:00</span><span>0:00</span>';

        progressArea.appendChild(progressBar);
        progressArea.appendChild(timeLabel);

        // Ghép lại: [prev] [play] [progress] [next]
        wrapper.appendChild(prevBtn);
        wrapper.appendChild(playBtn);
        wrapper.appendChild(progressArea);
        wrapper.appendChild(nextBtn);

        return wrapper;
    }

    function setupAudio() {
        currentAudio = new Audio();
        currentAudio.onended = () => playNextSong();
        currentAudio.ontimeupdate = updateProgress;
        currentAudio.onloadedmetadata = updateProgress;

        playBtn.onclick = (e) => {
            e.stopPropagation();
            if (isPlaying) {
                currentAudio.pause();
                isPlaying = false;
            } else {
                if (!currentAudio.src || currentAudio.src === "") {
                    currentAudio.src = 'nhac/' + currentSongIndex + '.mp3';
                }
                currentAudio.play().catch(e => console.log("Lỗi play nhạc:", e));
                isPlaying = true;
            }
            updatePlayBtnStyle();
        };
    }

    function initMusicPlayer() {
        const qNumber = document.getElementById('qNumber');
        if (!qNumber) {
            initFloatingPlayer();
            return;
        }

        const wrapper = buildPlayerUI();

        // Chèn wrapper TRƯỚC #qNumber (phía trên dòng "Câu X/Y")
        qNumber.parentElement.insertBefore(wrapper, qNumber);

        setupAudio();

        // Theo dõi nếu quizArea bị render lại
        const observer = new MutationObserver(() => {
            if (!qNumber.parentElement.querySelector('.music-player-wrapper')) {
                qNumber.parentElement.insertBefore(wrapper, qNumber);
            }
        });
        observer.observe(qNumber.parentElement, { childList: true });
    }

    function initFloatingPlayer() {
        const wrapper = buildPlayerUI();
        wrapper.style.cssText += `
            position: fixed;
            top: 70px;
            right: 15px;
            left: 15px;
            max-width: 350px;
            margin-left: auto;
            z-index: 9999;
            background: rgba(255,255,255,0.92);
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border: 1px solid rgba(0,0,0,0.06);
        `;
        document.body.appendChild(wrapper);
        setupAudio();
    }

    function playNextSong() {
        currentSongIndex++;
        currentAudio.src = 'nhac/' + currentSongIndex + '.mp3';
        currentAudio.play().catch(e => {
            if (currentSongIndex > 1) {
                currentSongIndex = 1;
                currentAudio.src = 'nhac/1.mp3';
                currentAudio.play().catch(err => console.log("Hết nhạc:", err));
            }
        });
        isPlaying = true;
        updatePlayBtnStyle();
    }

    function playPrevSong() {
        currentSongIndex--;
        if (currentSongIndex < 1) currentSongIndex = 1;
        currentAudio.src = 'nhac/' + currentSongIndex + '.mp3';
        currentAudio.play().catch(e => {
            currentSongIndex = 1;
            currentAudio.src = 'nhac/1.mp3';
            currentAudio.play().catch(err => console.log("Lỗi bài trước:", err));
        });
        isPlaying = true;
        updatePlayBtnStyle();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMusicPlayer);
    } else {
        initMusicPlayer();
    }
})();
