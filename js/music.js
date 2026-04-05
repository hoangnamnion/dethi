// js/music.js
(function() {
    let availableSongs = [];
    let currentAudio = null;
    let isPlaying = false;

    // Tự động quét xem trong thư mục nhac/ đang có bài nào (Quét từ 1.mp3, 2.mp3...)
    async function scanAvailableSongs() {
        for (let i = 1; i <= 20; i++) {
            try {
                // Gửi request siêu nhẹ (HEAD) chỉ để check file có tồn tại không
                const res = await fetch('nhac/' + i + '.mp3', { method: 'HEAD', cache: 'no-store' });
                if (res.ok) {
                    availableSongs.push(i + '.mp3');
                } else {
                    // Trượt số thì dừng (vd có 1.mp3, 2.mp3, ko có 3.mp3 thì chốt 2 bài)
                    break; 
                }
            } catch (e) {
                break;
            }
        }
        
        // Nếu quét không thấy hoặc lỗi, gán mặc định tên file là 1.mp3
        if (availableSongs.length === 0) {
            availableSongs.push('1.mp3');
        }
    }

    function initMusicPlayer() {
        const btn = document.createElement('button');
        btn.id = 'floating-music-btn';
        // Chỉ dùng Icon cho gọn, không dùng chữ dài
        btn.innerHTML = '🎵';
        btn.title = 'Bật/Tắt Nhạc';
        
        btn.style.cssText = `
            position: fixed;
            bottom: 90px; /* Cách xa thanh Footer bên dưới */
            right: 20px;
            width: 45px;
            height: 45px;
            background: rgba(255, 255, 255, 0.9);
            color: #636e72;
            border: 2px solid #b2bec3;
            backdrop-filter: blur(5px);
            border-radius: 50%; /* Tròn xoe */
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            z-index: 9999;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        btn.onmouseover = () => {
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = '0 6px 20px rgba(9, 132, 227, 0.3)';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        };

        currentAudio = new Audio();
        
        currentAudio.onended = () => {
            playRandomSong();
        };

        btn.onclick = () => {
            if (isPlaying) {
                currentAudio.pause();
                isPlaying = false;
                btn.innerHTML = '🎵';
                btn.style.background = 'rgba(255, 255, 255, 0.9)';
                btn.style.color = '#636e72';
                btn.style.borderColor = '#b2bec3';
            } else {
                if (!currentAudio.src) {
                    playRandomSong();
                } else {
                    currentAudio.play().catch(e => console.log("Lỗi play nhạc:", e));
                }
                isPlaying = true;
                btn.innerHTML = '⏸️'; // Icon Tạm dừng khi đang phát
                btn.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
                btn.style.color = 'white';
                btn.style.borderColor = 'transparent';
            }
        };

        document.body.appendChild(btn);
    }
    
    function playRandomSong() {
        // Random 1 bài trong những bài ĐÃ QUÉT THẤY
        const randomSong = availableSongs[Math.floor(Math.random() * availableSongs.length)];
        currentAudio.src = 'nhac/' + randomSong;
        currentAudio.play().catch(e => {
            console.log("Lỗi Load Nhạc:", e);
        });
    }

    // Tiến hành quét ngầm rồi mới hiện UI
    scanAvailableSongs().then(() => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMusicPlayer);
        } else {
            initMusicPlayer();
        }
    });

})();
