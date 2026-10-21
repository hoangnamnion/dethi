/* =============================================================
   FILE: script.js 
   PHIÊN BẢN: ĐÃ CẬP NHẬT TỰ ĐỘNG NEXT (AUTO NEXT 2S) HOÀN CHỈNH
   ============================================================= */

let allQuestions = [];
let originalQuestions = [];
let currentIndex = 0;
let currentFileName = '';
let isSubmitted = false;

// Biến quản lý thời gian
let totalSeconds = 0;
let timerInterval;

// Biến quản lý chế độ
let examMode = 'normal';
let questionOrder = 'normal';
let isSurvivalFailed = false;

// Biến mới cho chế độ làm lại câu sai
let firstAttemptScore = 0;
let retryCount = 0;
let wrongQuestions = [];
let isRetryMode = false;
let isReviewFilterMode = false;
let hasReportedScore = false;
let filteredQuestions = [];

// --- BIẾN MỚI CHO TÍNH NĂNG AUTO NEXT ---
let isAutoNextEnabled = true;
let autoNextTimer = null;
let currentStreak = 0; // Luôn theo dõi chuỗi câu đúng liên tiếp

// --- HỆ THỐNG CẮM CỜ PHÂN VÂN (BOOKMARK & REVIEW) ---
let currentPaletteFilter = 'all'; // 'all' | 'flagged' | 'unanswered'

function getBookmarks() {
    try {
        const raw = localStorage.getItem('bookmarks_' + currentFileName);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed.map(n => Number(n)).filter(n => !isNaN(n));
        }
        if (typeof parsed === 'object') {
            const arr = [];
            for (let k in parsed) {
                if (parsed[k]) {
                    const num = parseInt(k.replace(/\D/g, ''), 10);
                    if (!isNaN(num)) arr.push(num >= 1 ? num - 1 : num);
                }
            }
            return arr;
        }
        return [];
    } catch (e) {
        return [];
    }
}

function setBookmarks(bm) {
    try {
        localStorage.setItem('bookmarks_' + currentFileName, JSON.stringify(bm));
    } catch (e) {}
    updateBookmarkBadge();
}

function isQuestionBookmarked(q) {
    if (!q) return false;
    const bm = getBookmarks();
    const idx = Number(q.originalIndex !== undefined ? q.originalIndex : q);
    return bm.includes(idx);
}

function toggleBookmark(q) {
    if (!q) return false;
    const bm = getBookmarks();
    const targetIdx = Number(q.originalIndex !== undefined ? q.originalIndex : q);
    const pos = bm.indexOf(targetIdx);
    let bookmarked = false;
    if (pos === -1) {
        bm.push(targetIdx);
        bookmarked = true;
    } else {
        bm.splice(pos, 1);
        bookmarked = false;
    }
    setBookmarks(bm);
    return bookmarked;
}

function updateBookmarkBadge() {
    const bm = getBookmarks();
    const count = bm.length;

    // 1. Badge số câu phân vân trên icon bảng câu hỏi (Footer)
    const badge = document.getElementById('flagCounterBadge');
    if (badge) {
        if (count > 0) {
            badge.style.display = 'inline-flex';
            badge.innerHTML = `${count}`;
        } else {
            badge.style.display = 'none';
        }
    }

    // 2. Nút bấm xem nhanh câu phân vân trên Toolbar (Header) - LUÔN HIỂN THỊ RÕ RÀNG
    const toolbarBtn = document.getElementById('btnToolbarFlagged');
    const toolbarCount = document.getElementById('toolbarFlagCount');
    if (toolbarBtn) {
        toolbarBtn.style.display = 'inline-flex';
        if (toolbarCount) toolbarCount.innerText = count;
        if (count > 0) {
            toolbarBtn.style.background = '#fef08a';
            toolbarBtn.style.color = '#854d0e';
            toolbarBtn.style.borderColor = '#141414';
        } else {
            toolbarBtn.style.background = '#ffffff';
            toolbarBtn.style.color = '#64748b';
            toolbarBtn.style.borderColor = '#141414';
        }
    }

    // 3. Cập nhật số đếm trên tab modal
    if (typeof updatePaletteCounts === 'function') {
        updatePaletteCounts();
    }
}

let bookmarkToastTimer = null;
function showBookmarkToast(msg) {
    const toast = document.getElementById('bookmarkToast');
    if (!toast) return;
    toast.innerHTML = msg;
    toast.classList.add('show');
    if (bookmarkToastTimer) clearTimeout(bookmarkToastTimer);
    bookmarkToastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function handleBookmarkToggle() {
    const questionsToShow = isRetryMode ? filteredQuestions : allQuestions;
    const q = questionsToShow[currentIndex];
    if (!q) return;
    const isNowBookmarked = toggleBookmark(q);
    const btn = document.getElementById('btnBookmarkFlag');
    const indicator = document.getElementById('qFlagIndicator');
    const banner = document.getElementById('qFlagBanner');

    if (isNowBookmarked) {
        if (btn) {
            btn.classList.add('flagged');
            btn.innerHTML = `<span class="flag-icon">⭐</span><span class="flag-label">ĐÃ CẮM CỜ (BẤM ĐỂ BỎ)</span>`;
        }
        if (indicator) {
            indicator.style.display = 'inline-flex';
        }
        if (banner) {
            banner.style.display = 'flex';
        }
        showBookmarkToast(`⭐ Đã cắm cờ Câu ${currentIndex + 1} (Bấm vào bảng câu hỏi để xem lại)`);
    } else {
        if (btn) {
            btn.classList.remove('flagged');
            btn.innerHTML = `<span class="flag-icon">☆</span><span class="flag-label">CẮM CỜ PHÂN VÂN</span>`;
        }
        if (indicator) {
            indicator.style.display = 'none';
        }
        if (banner) {
            banner.style.display = 'none';
        }
        showBookmarkToast(`Đã bỏ cắm cờ Câu ${currentIndex + 1}`);
    }
}

function openFlaggedModal() {
    setPaletteFilter('flagged');
    const modal = document.getElementById('modalList');
    if (modal) modal.style.display = 'flex';
}

// --- 1. TẢI ĐỀ THI ---
function loadExam(fileName) {
    currentFileName = fileName;
    const params = new URLSearchParams(window.location.search);

    examMode = params.get('mode') || 'normal';
    questionOrder = params.get('order') || 'normal';

    // NHẬN CẤU HÌNH AUTO NEXT TỪ URL (Mặc định là true nếu không chỉ định false)
    const autoParam = params.get('auto');
    isAutoNextEnabled = (autoParam === null || autoParam === '' || autoParam === 'true');

    if (!params.get('mode')) {
        const savedMode = localStorage.getItem('exam_mode_' + fileName);
        if (savedMode) {
            try {
                const modeData = JSON.parse(savedMode);
                if (modeData && typeof modeData === 'object') {
                    if (modeData.mode) examMode = modeData.mode;
                    if (modeData.order) questionOrder = modeData.order;
                    // Nếu lưu cả cấu hình auto trong localStorage thì lấy ra ở đây
                    if (modeData.autoNext !== undefined) {
                        isAutoNextEnabled = modeData.autoNext;
                    }
                }
            } catch (e) {
                console.warn('Corrupted exam_mode in localStorage, resetting:', e);
                localStorage.removeItem('exam_mode_' + fileName);
            }
        }
    }

    let title = "Đề số " + fileName;
    const titleElement = document.getElementById('sectionTitle');

    // Cập nhật tiêu đề hiển thị trạng thái Auto Next
    let autoBadge = isAutoNextEnabled ? ' <span class="auto-badge">⚡ AUTO</span>' : '';

    if (examMode === 'survival') {
        titleElement.innerHTML = title + ' <span class="survival-badge">💀 1 MẠNG</span>' + autoBadge;
    } else if (examMode === 'scoring') {
        titleElement.innerHTML = title + ' <span class="normal-badge" style="background:#e67e22; color:white; padding:2px 8px; border-radius:10px; font-size:0.7em; font-weight:bold; margin-left:5px;">💯 TÍNH ĐIỂM</span>' + autoBadge;
    } else {
        titleElement.innerHTML = title + ' <span class="normal-badge">😊 THƯỜNG</span>' + autoBadge;
    }

    // Hiển thị thông báo nếu là làm mới
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('new') && urlParams.get('new') === 'true') {
        setTimeout(() => {
            if (examMode === 'survival') {
                alert("💀 BẮT ĐẦU LÀM MỚI - CHẾ ĐỘ SINH TỬ\nBạn chỉ có 1 mạng duy nhất!\nSai 1 câu sẽ LÀM LẠI TỪ ĐẦU!");
            } else if (examMode === 'scoring') {
                alert("💯 BẮT ĐẦU LÀM MỚI - CHẾ ĐỘ TÍNH ĐIỂM\nLàm không hiện đúng sai, khi nộp bài mới biết kết quả!");
            } else {
                alert("😊 BẮT ĐẦU LÀM MỚI - CHẾ ĐỘ THƯỜNG\nSai vẫn làm tiếp được, không sửa lại được đáp án!");
            }
        }, 500);
    }

    fetch('filethi/' + fileName + '.txt')
        .then(res => res.text())
        .then(text => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('quizArea').style.display = 'block';
            parseData(text);

            originalQuestions = JSON.parse(JSON.stringify(allQuestions));

            const saved = localStorage.getItem('quiz_data_' + currentFileName);
            if (!saved) {
                if (questionOrder === 'random') {
                    shuffleQuestions();
                    shuffleOptions();
                } else if (questionOrder === 'shuffle_options') {
                    shuffleOptions();
                }
            }

            loadProgress();
            updateBookmarkBadge();

            if (!isSubmitted) {
                startTimer();
                syncAutoNextButtonUI();
            } else {
                showResultModal();
            }
        })
        .catch(err => {
            console.error('Lỗi tải file:', err);
            document.getElementById('loading').innerHTML = `
                <div style="color:#d63031; padding:20px; text-align:center;">
                    <h3>❌ Lỗi tải đề thi</h3>
                    <p>${err.message}</p>
                    <button onclick="window.location.href='product.html?id=${fileName}'" 
                            style="background:#d63031; color:white; padding:10px 20px; border:none; border-radius:8px; margin-top:20px;">
                        Quay lại
                    </button>
                </div>
            `;
        });
}

// --- 2. CÁC HÀM TIỆN ÍCH ---
function shuffleQuestions() {
    for (let i = allQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
        if (allQuestions[i].originalIndex === undefined) allQuestions[i].originalIndex = i;
        if (allQuestions[j].originalIndex === undefined) allQuestions[j].originalIndex = j;
    }
}

function shuffleOptions() {
    allQuestions.forEach((question, questionIndex) => {
        if (!question.options || question.options.length === 0) return;

        const indices = question.options.map((_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const newOptions = indices.map((originalIdx, newIdx) => {
            const originalOption = question.options[originalIdx];
            const label = String.fromCharCode(65 + newIdx);
            return {
                text: `${label}. ${originalOption.text}`,
                isCorrect: originalOption.isCorrect,
                originalIndex: originalIdx
            };
        });

        if (question.userSelected !== null) {
            question.userSelected = indices.indexOf(question.userSelected);
        }

        question.options = newOptions;
        question.shuffledOptionIndices = indices;
    });
}

function parseData(text) {
    text = text.replace(/(\s+)(\*?[A-D]\.)/g, "\n$2");
    const lines = text.split('\n');
    let currentQ = null;
    allQuestions = [];
    const qStartRegex = /^(Câu\s+\d+|Bài\s+\d+|Question\s+\d+)/i;
    const optRegex = /^(\*)?([A-D])\./;

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        if (qStartRegex.test(line)) {
            if (currentQ) allQuestions.push(currentQ);
            currentQ = {
                text: line,
                options: [],
                userSelected: null,
                originalIndex: allQuestions.length,
                firstAttemptSelected: null,
                isCorrectFirstTime: null,
                retrySelected: null,
                isRetryMode: false
            };
        } else if (optRegex.test(line) && currentQ) {
            let isCorrect = line.startsWith('*');
            const textWithoutLabel = line.replace(/^(\*)?[A-D]\.\s*/, '').trim();
            currentQ.options.push({
                text: textWithoutLabel,
                isCorrect: isCorrect
            });
        } else {
            if (currentQ && currentQ.options.length === 0) {
                currentQ.text += " " + line;
            }
        }
    });
    if (currentQ) allQuestions.push(currentQ);
}

// --- 3. QUẢN LÝ THỜI GIAN & HIỆU NĂNG NHIỆT (COOLING / ECO TIMING) ---
let timerStartTimestamp = null;

function startTimer() {
    clearInterval(timerInterval);
    timerStartTimestamp = Date.now() - (totalSeconds * 1000);

    const tick = () => {
        // Nếu người dùng đang khóa màn hình hoặc chạy ngầm tab -> KHÔNG ép reflow DOM để tiết kiệm 100% pin
        if (document.hidden) return;

        const currentSec = Math.floor((Date.now() - timerStartTimestamp) / 1000);
        if (currentSec !== totalSeconds) {
            totalSeconds = currentSec;
            updateTimerDisplay();

            // Gửi dữ liệu giám sát định kỳ 60s (chỉ khi có người dùng đăng nhập)
            if (totalSeconds % 60 === 0) {
                sendLiveTelemetry();
            }
        }
    };

    timerInterval = setInterval(tick, 1000);
    sendLiveTelemetry();
}

// Bắt sự kiện chuyển tab: Cập nhật đồng hồ tức thì khi quay lại màn hình
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && timerStartTimestamp && !isSubmitted) {
        totalSeconds = Math.floor((Date.now() - timerStartTimestamp) / 1000);
        updateTimerDisplay();
    }
});

function updateTimerDisplay() {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        let timerText = "Thời gian: " + timeStr;
        if (examMode === 'survival') {
            timerText += isSurvivalFailed ? " 💀" : " ❤️";
        }
        timerElement.innerText = timerText;
    }
    return timeStr;
}

// --- TELEMETRY GIÁM SÁT THI TRỰC TUYẾN (SIÊU TỐI ƯU BĂNG THÔNG & PIN) ---
function sendLiveTelemetry() {
    if (isSubmitted || allQuestions.length === 0) return;

    let userData = {};
    try {
        userData = JSON.parse(sessionStorage.getItem('current_user')) || {};
    } catch (e) { }

    // THOÁT NGAY LẬP TỨC nếu không có user đăng nhập -> Không tốn chu kỳ CPU và không đánh thức modem WiFi/4G
    if (!userData || !userData.username) return;

    // Tính điểm hiện tại dựa trên số câu đã làm đúng
    const totalQuestions = allQuestions.length;
    let correct = 0;
    for (let i = 0; i < totalQuestions; i++) {
        const q = allQuestions[i];
        if (q.userSelected !== null && q.options[q.userSelected] && q.options[q.userSelected].isCorrect) {
            correct++;
        }
    }
    const scale10 = parseFloat(((correct / totalQuestions) * 10).toFixed(2));
    const rawScore = `${correct}/${totalQuestions} (${scale10} Điểm - Đang làm)`;

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const telemetryData = {
        name: userData.name || userData.username,
        username: userData.username,
        examName: currentFileName,
        rawScore: rawScore,
        time: timeStr
    };

    fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateLiveStatus', data: telemetryData }),
        keepalive: true
    }).catch(() => {});
}

// --- CHẾ ĐỘ MÁT MÁY / SIÊU TIẾT KIỆM PIN (ECO COOLING MODE) ---
function initEcoMode() {
    const isEco = localStorage.getItem('neo_eco_mode') === 'true';
    if (isEco) {
        document.body.classList.add('low-graphics');
    }
    updateEcoButtonUI(isEco);
}

function toggleLowGraphics() {
    const isEco = document.body.classList.toggle('low-graphics');
    localStorage.setItem('neo_eco_mode', isEco ? 'true' : 'false');
    updateEcoButtonUI(isEco);
}

function updateEcoButtonUI(isEco) {
    const btn = document.getElementById('btnLowGraphics');
    if (btn) {
        if (isEco) {
            btn.innerHTML = '❄️ Mát máy: BẬT';
            btn.style.background = '#10b981';
            btn.style.color = '#ffffff';
            btn.style.borderColor = '#065f46';
        } else {
            btn.innerHTML = '⚡ Hiệu ứng: BẬT';
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }
    }
}


// --- CHẾ ĐỘ TẬP TRUNG ÔN / GIẢM MÀU MÈ ---
function initFocusTheme() {
    const isFocus = localStorage.getItem('neo_focus_theme') === 'true';
    if (isFocus) {
        document.body.classList.add('theme-focus');
    } else {
        document.body.classList.remove('theme-focus');
    }
    updateThemeUI(isFocus);
}

function toggleFocusTheme() {
    const isFocus = document.body.classList.toggle('theme-focus');
    localStorage.setItem('neo_focus_theme', isFocus ? 'true' : 'false');
    updateThemeUI(isFocus);
    showThemeToast(isFocus);
}

function updateThemeUI(isFocus) {
    const toolbarBtn = document.getElementById('btnFocusThemeToolbar');
    const toolbarText = document.getElementById('themeToolbarText');
    const toolbarIcon = document.getElementById('themeToolbarIcon');
    if (toolbarText) toolbarText.textContent = isFocus ? 'Màu Pop Art' : 'Giảm màu mè';
    if (toolbarIcon) toolbarIcon.textContent = isFocus ? '🎨' : '🌱';
    if (toolbarBtn) {
        toolbarBtn.style.background = isFocus ? '#e2e8f0' : '#ffffff';
        toolbarBtn.title = isFocus ? 'Chuyển về giao diện Pop Art rực rỡ' : 'Chuyển sang giao diện giảm màu mè để tập trung ôn';
    }

    const modalBtn = document.getElementById('btnToggleThemeInModal');
    const modalText = document.getElementById('themeModalText');
    const modalIcon = document.getElementById('themeModalIcon');
    if (modalText) modalText.textContent = isFocus ? 'Theme: Pop Art' : 'Theme: Giảm màu mè';
    if (modalIcon) modalIcon.textContent = isFocus ? '🎨' : '🌱';
    if (modalBtn) {
        modalBtn.style.background = isFocus ? '#e2e8f0' : '#ffffff';
    }

    const tuluanHeaderBtn = document.getElementById('btnTuluanThemeHeader');
    const tuluanHeaderIcon = document.getElementById('themeTuluanIcon');
    const tuluanHeaderText = document.getElementById('themeTuluanText');
    if (tuluanHeaderText) tuluanHeaderText.textContent = isFocus ? 'Màu Pop Art' : 'Giảm màu mè';
    if (tuluanHeaderIcon) tuluanHeaderIcon.textContent = isFocus ? '🎨' : '🌱';
    if (tuluanHeaderBtn) tuluanHeaderBtn.style.background = isFocus ? '#e2e8f0' : '#ffffff';

    const tuluanDrawerBtn = document.getElementById('btnTuluanDrawerTheme');
    if (tuluanDrawerBtn) {
        tuluanDrawerBtn.textContent = isFocus ? '🎨 Màu Pop Art' : '🌱 Giảm màu mè';
        tuluanDrawerBtn.style.background = isFocus ? '#e2e8f0' : '#ffffff';
    }
}

function showThemeToast(isFocus) {
    const toast = document.getElementById('bookmarkToast');
    if (toast) {
        toast.textContent = isFocus ? '🌱 Đã bật Theme Giảm màu mè (Tập trung ôn)' : '🎨 Đã chuyển về Theme Neo-Brutalism rực rỡ';
        toast.style.display = 'block';
        toast.style.animation = 'none';
        void toast.offsetWidth;
        toast.style.animation = 'fadeInOut 2s forwards';
        setTimeout(() => { toast.style.display = 'none'; }, 2000);
    }
}

window.initFocusTheme = initFocusTheme;
window.toggleFocusTheme = toggleFocusTheme;

// Tự động kích hoạt ngay khi load
if (typeof window !== 'undefined') {
    initFocusTheme();
    initEcoMode();
}

// --- 4. ĐỒNG BỘ NÚT AUTO NEXT TRÊN THANH CÔNG CỤ ---
function syncAutoNextButtonUI() {
    const btn = document.getElementById('btnToggleAutoNext');
    if (btn) {
        btn.innerHTML = isAutoNextEnabled ? '⚡ Auto Next: BẬT' : '⚡ Auto Next: TẮT';
        btn.style.background = isAutoNextEnabled ? '#ffd23f' : '#ffffff';
    }
}

function createAutoNextToggle() {
    // Đã hợp nhất vào nút duy nhất trên thanh công cụ
    syncAutoNextButtonUI();
}

function showAutoNextStatus() {
    const oldMsg = document.querySelector('.auto-next-status');
    if (oldMsg) oldMsg.remove();

    const msg = document.createElement('div');
    msg.className = 'auto-next-status';
    msg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isAutoNextEnabled ? '#10b981' : '#64748b'};
        color: white;
        padding: 10px 16px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 800;
        box-shadow: 3px 3px 0 #141414;
        border: 2px solid #141414;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: fadeIn 0.2s;
    `;
    msg.innerHTML = `⚡ Auto NEXT: <strong>${isAutoNextEnabled ? 'BẬT' : 'TẮT'}</strong>`;
    document.body.appendChild(msg);

    setTimeout(() => {
        if (msg.parentNode) {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-10px)';
            msg.style.transition = 'all 0.3s ease';
            setTimeout(() => msg.remove(), 300);
        }
    }, 1500);
}

function updateTitleWithAutoStatus() {
    const titleElement = document.getElementById('sectionTitle');
    if (!titleElement) return;
    let title = "Đề số " + (currentFileName || '');
    let autoBadge = isAutoNextEnabled ? ' <span class="auto-badge">⚡ AUTO</span>' : '';

    if (examMode === 'survival') {
        titleElement.innerHTML = title + ' <span class="survival-badge">💀 1 MẠNG</span>' + autoBadge;
    } else if (examMode === 'scoring') {
        titleElement.innerHTML = title + ' <span class="normal-badge" style="background:#e67e22; color:white; padding:2px 8px; border-radius:10px; font-size:0.7em; font-weight:bold; margin-left:5px;">💯 TÍNH ĐIỂM</span>' + autoBadge;
    } else {
        titleElement.innerHTML = title + ' <span class="normal-badge">😊 THƯỜNG</span>' + autoBadge;
    }
}

// --- 5. HIỂN THỊ CÂU HỎI ---
function renderQuestion(index) {
    let questionsToShow = (isRetryMode || isReviewFilterMode) ? filteredQuestions : allQuestions;

    if (index < 0 || index >= questionsToShow.length) return;
    currentIndex = index;
    const q = questionsToShow[index];
    let processedText = q.text.replace(/\[IMG:(.*?)\]/g, '<div class="q-image"><img src="$1"></div>');

    // Ẩn nút báo lỗi khi chuyển câu
    // const btnReport = document.getElementById('btnReportFloat');
    // if (btnReport) btnReport.style.display = 'none';

    let qNumberText = `Câu ${index + 1}/${questionsToShow.length}`;

    if (questionOrder === 'random') {
        qNumberText += ` (Gốc: ${q.originalIndex + 1})`;
    }

    if (isRetryMode) {
        qNumberText += ` | Câu gốc: ${(q.originalIndex !== undefined ? q.originalIndex : index) + 1}`;
    } else if (isReviewFilterMode) {
        qNumberText += ` | Câu gốc: ${(q.originalIndex !== undefined ? q.originalIndex : index) + 1}`;
    }

    const qNumberElement = document.getElementById('qNumber');
    const isBookmarked = isQuestionBookmarked(q);
    const qFlagBanner = document.getElementById('qFlagBanner');
    if (qFlagBanner) {
        qFlagBanner.style.display = isBookmarked ? 'flex' : 'none';
    }
    let retryBadge = isRetryMode ? ` <span style="background:#f39c12; color:white; padding:2px 8px; border-radius:8px; font-size:0.8em; font-weight:800;">Làm lại lần ${retryCount}</span>` : (isReviewFilterMode ? ` <span style="background:#02a9ea; color:white; padding:2px 8px; border-radius:8px; font-size:0.8em; font-weight:800;">Xem lại</span>` : '');

    qNumberElement.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; flex-wrap: wrap; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 900; font-size: 1.05rem;">${qNumberText}</span>${retryBadge}
                <span id="qFlagIndicator" class="flag-indicator-badge" style="background: #fde047; border: 1.5px solid #141414; color: #854d0e; font-size: 0.75rem; font-weight: 900; padding: 2px 8px; border-radius: 6px; box-shadow: 1.5px 1.5px 0 #141414; display: ${isBookmarked ? 'inline-flex' : 'none'};">⭐ ĐANG PHÂN VÂN</span>
            </div>
            <button class="neo-flag-btn ${isBookmarked ? 'flagged' : ''}" id="btnBookmarkFlag" onclick="handleBookmarkToggle()" title="Bấm để cắm cờ hoặc bỏ cắm cờ phân vân">
                <span class="flag-icon">${isBookmarked ? '⭐' : '☆'}</span>
                <span class="flag-label">${isBookmarked ? 'ĐÃ CẮM CỜ' : 'CẮM CỜ PHÂN VÂN'}</span>
            </button>
        </div>
    `;

    document.getElementById('qText').innerHTML = processedText;
    document.getElementById('btnPrev').disabled = (index === 0);
    document.getElementById('btnNext').disabled = (index === questionsToShow.length - 1);

    if (examMode === 'survival') {
        const hasWrongAnswer = allQuestions.some(q => q.userSelected !== null && !q.options[q.userSelected].isCorrect);
        if (hasWrongAnswer) {
            isSurvivalFailed = true;
            document.getElementById('btnPrev').disabled = true;
            document.getElementById('btnNext').disabled = true;
            if (!document.getElementById('survivalRetryOverlay')) {
                showDeathEffect();
            }
        }
    }

    const optsArea = document.getElementById('optionsArea');
    optsArea.innerHTML = '';

    const isAnswered = isRetryMode ? 
        (q.retrySelected !== null && q.options[q.retrySelected]?.isCorrect) : 
        (q.userSelected !== null);

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'option-item';

        const optionText = opt.text;
        let displayText = optionText;

        const match = optionText.match(/^([A-D])\.\s*(.*)/);

        if (match) {
            const label = match[1];
            const content = match[2];
            displayText = `<span style="font-weight:bold; margin-right:8px; color:#d63031;">${label}</span> ${content}`;
        } else {
            const label = String.fromCharCode(65 + idx);
            displayText = `<span style="font-weight:bold; margin-right:8px; color:#d63031;">${label}</span> ${optionText}`;
        }

        btn.innerHTML = displayText;

        if (examMode === 'survival' && isSurvivalFailed) {
            btn.style.pointerEvents = 'none';
        } else if (isSubmitted) {
            btn.style.pointerEvents = 'none';
            if (q.userSelected === idx) {
                if (opt.isCorrect) {
                    btn.classList.add('correct', 'user-correct');
                } else {
                    btn.classList.add('wrong', 'user-wrong');
                }
            } else if (opt.isCorrect) {
                btn.classList.add('correct');
            }
        } else if (examMode === 'scoring') {
            if (q.userSelected === idx) {
                btn.classList.add('selected');
            }
            btn.onclick = () => handleAnswer(index, idx);
        } else if (isAnswered) {
            btn.style.pointerEvents = 'none';

            if (isRetryMode) {
                if (q.retrySelected === idx) {
                    if (opt.isCorrect) {
                        btn.classList.add('correct');
                    } else {
                        btn.classList.add('wrong');
                    }
                } else if (opt.isCorrect) {
                    btn.classList.add('correct');
                }
            } else {
                if (q.userSelected === idx) {
                    if (opt.isCorrect) {
                        btn.classList.add('correct');
                    } else {
                        btn.classList.add('wrong');
                    }
                } else if (opt.isCorrect) {
                    btn.classList.add('correct');
                }
            }
        } else {
            btn.onclick = () => handleAnswer(index, idx);
        }

        optsArea.appendChild(btn);
    });
}

function handleAnswer(qIndex, optIndex) {
    if (isSubmitted) return;
    if (examMode === 'survival' && isSurvivalFailed) return;

    // --- 1. XÓA TIMER CŨ (Tránh lỗi click nhanh) ---
    if (autoNextTimer) {
        clearTimeout(autoNextTimer);
        autoNextTimer = null;
    }

    const questionsToShow = isRetryMode ? filteredQuestions : allQuestions;
    const q = questionsToShow[qIndex];
    const selectedOption = q.options[optIndex];

    if (isRetryMode) {
        if (selectedOption.isCorrect) {
            q.retrySelected = optIndex;
            const wrongIndex = wrongQuestions.findIndex(item =>
                item.question === q ||
                item.index === q.originalIndex ||
                item.originalIndex === q.originalIndex ||
                item.index === qIndex
            );
            if (wrongIndex !== -1) {
                wrongQuestions.splice(wrongIndex, 1);
            }
            showCorrectEffect();
            currentStreak++; // Tăng streak ngay cả khi làm lại câu sai
            showComboFire(currentStreak);

            renderQuestion(qIndex);

            if (wrongQuestions.length === 0) {
                setTimeout(() => {
                    alert("🎉 Chúc mừng! Bạn đã làm đúng tất cả các câu sai!");
                    finishRetryMode();
                }, 500);
                return;
            }
        } else {
            showWrongEffect();
            currentStreak = 0; // Sai khi làm lại cũng reset streak
            showComboFire(0);
            q.retrySelected = null;
            const opts = document.querySelectorAll('.option-item');
            if (opts[optIndex]) {
                opts[optIndex].classList.add('wrong');
            }
        }

        saveProgress();
    }
    // CHẾ ĐỘ THƯỜNG / SINH TỬ / TÍNH ĐIỂM
    else {
        q.userSelected = optIndex;

        if (q.firstAttemptSelected === null) {
            q.firstAttemptSelected = optIndex;
            q.isCorrectFirstTime = selectedOption.isCorrect;
        } else if (examMode === 'scoring') {
            q.firstAttemptSelected = optIndex;
            q.isCorrectFirstTime = selectedOption.isCorrect;
        }

        if (examMode === 'survival') {
            if (!selectedOption.isCorrect) {
                isSurvivalFailed = true;
                renderQuestion(qIndex);
                if (!document.getElementById('survivalRetryOverlay')) {
                    showDeathEffect();
                }
                saveProgress();
                return; // Kết thúc luôn, không chạy Auto Next
            } else {
                renderQuestion(qIndex);
                showCorrectEffect();
                saveProgress();
            }
        } else if (examMode === 'scoring') {
            renderQuestion(qIndex);
            saveProgress();
        } else {
            renderQuestion(qIndex);
            if (selectedOption.isCorrect) {
                showCorrectEffect();
                currentStreak++; // Tăng chuỗi câu đúng
                showComboFire(currentStreak); // Hiển thị hiệu ứng nếu đạt mốc
                // Trigger emotion animation (local CSS-based, no CDN needed)
                spawnEmojis(['👍', '🌟', '🎉', '🔥', '✨']);
            } else {
                showWrongEffect();
                currentStreak = 0; // Reset chuỗi khi sai
                showComboFire(0);
                
                // Hiện nút báo lỗi khi sai
                // const btnReport = document.getElementById('btnReportFloat');
                // if (btnReport) btnReport.style.display = 'block';
            }
            saveProgress();
        }
    }

    // --- 2. LOGIC AUTO NEXT ---
    let shouldAutoNext = isAutoNextEnabled;

    // Nếu đang làm lại (Retry Mode), chỉ next khi chọn ĐÚNG
    if (isRetryMode && !selectedOption.isCorrect) {
        shouldAutoNext = false;
    }

    // Nếu là câu cuối cùng thì không next
    if (qIndex >= questionsToShow.length - 1) {
        shouldAutoNext = false;
    }

    if (shouldAutoNext) {
        // Tốc độ next câu: Đúng -> nhanh thêm x2 (600ms); Sai -> giữ tốc độ hiện tại (1200ms) để kịp xem lại đáp án
        const autoNextDelay = (selectedOption && selectedOption.isCorrect) ? 600 : (examMode === 'scoring' ? 600 : 1200);
        autoNextTimer = setTimeout(() => {
            // Kiểm tra lại lần nữa index (vì có thể user đã bấm nút Next thủ công)
            if (currentIndex < questionsToShow.length - 1) {
                changeQuestion(1);
            }
        }, autoNextDelay);
    }

    // --- 3. LOGIC AUTO SUBMIT (NỘP BÀI TỰ ĐỘNG) ---
    // Tự động nộp bài khi đã trả lời hết tất cả các câu
    const answeredCount = allQuestions.filter(q => q.userSelected !== null).length;
    const totalQuestions = allQuestions.length;
    const bookmarkedCount = getBookmarks().length;

    if (answeredCount === totalQuestions && !isRetryMode && !isSubmitted) {
        // Kiểm tra câu cắm cờ phân vân (bookmarked/flagged) trước khi nộp bài
        const bookmarkedCount = getBookmarks().length;
        if (autoNextTimer) { clearTimeout(autoNextTimer); autoNextTimer = null; }
        if (bookmarkedCount > 0) {
            setTimeout(() => {
                if (!isSubmitted) {
                    if (confirm(`⚠️ Bạn đã hoàn thành tất cả câu hỏi, nhưng đang có ${bookmarkedCount} câu cắm cờ phân vân (⭐) chưa kiểm tra lại!\n\nNhấn "OK" để nộp bài luôn.\nNhấn "Cancel" để xem lại các câu phân vân.`)) {
                        finishExam(true);
                    } else {
                        toggleModal();
                        setPaletteFilter('flagged');
                    }
                }
            }, 600);
        } else {
            setTimeout(() => {
                if (!isSubmitted) {
                    console.log("Hệ thống: Đã trả lời hết, tự động nộp bài...");
                    finishExam(true);
                }
            }, 800);
        }
    }
}

// Kết thúc chế độ làm lại câu sai
function finishRetryMode() {
    isRetryMode = false;
    isSubmitted = true;
    if (syncTimeout) { clearTimeout(syncTimeout); syncTimeout = null; } // Hủy sync "Đang làm"
    clearInterval(timerInterval);
    saveProgress();
    showResultModal();
}

function performSurvivalReset() {
    allQuestions.forEach(question => {
        question.userSelected = null;
    });

    if (originalQuestions.length > 0) {
        allQuestions = JSON.parse(JSON.stringify(originalQuestions));
    }

    if (questionOrder === 'random') {
        shuffleQuestions();
        shuffleOptions();
    } else if (questionOrder === 'shuffle_options') {
        shuffleOptions();
    }

    currentIndex = 0;
    isSurvivalFailed = false;

    alert("🔄 Đã reset! Bắt đầu làm lại từ đầu!");
}

function showDeathEffect() {
    if (document.getElementById('survivalRetryOverlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'survivalRetryOverlay';
    overlay.style.cssText = `
        background: linear-gradient(135deg, #d63031, #e17055);
        color: white;
        padding: 20px;
        border-radius: 15px;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 5px 15px rgba(214, 48, 49, 0.4);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        margin-top: 20px;
        margin-bottom: 20px;
        animation: fadeIn 0.3s;
    `;

    overlay.innerHTML = `
        <div style="font-size: 1.2em;">💀 SAI RỒI!</div>
        <div style="font-size: 0.9em; font-weight: normal;">Cố Gắng Học Thuộc Nhé Bồ Đọc Lại cho kỹ</div>
        <button id="btnRetrySurvival" style="
            background: white;
            color: #d63031;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            transition: 0.3s;
            width: 100%;
            max-width: 250px;
        ">🔄 Làm lại từ đầu</button>
    `;

    const quizArea = document.getElementById('quizArea');
    quizArea.appendChild(overlay);

    setTimeout(() => {
        overlay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    document.getElementById('btnRetrySurvival').onclick = () => {
        overlay.remove();
        performSurvivalReset();
        renderQuestion(0);
        saveProgress();
    };

    // Vô hiệu hóa nút chuyển câu
    document.getElementById('btnNext').disabled = true;
    document.getElementById('btnPrev').disabled = true;
}

function spawnEmojis(emojiList) {
    const num = 15; // Số lượng emoji
    for (let i = 0; i < num; i++) {
        const span = document.createElement('div');
        const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
        span.innerHTML = emoji;
        span.style.cssText = `
            position: fixed;
            left: ${50 + (Math.random() * 20 - 10)}%;
            bottom: 20%;
            font-size: ${Math.random() * 20 + 20}px;
            z-index: 9999;
            pointer-events: none;
            transition: transform 1.5s ease-out, opacity 1.5s ease-out;
            opacity: 1;
            transform: translate(-50%, 0) scale(1) rotate(${Math.random() * 40 - 20}deg);
        `;
        document.body.appendChild(span);

        // Buộc trình duyệt nhận diện trạng thái ban đầu trước khi add animation tới
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                span.style.transform = `translate(-50%, -${Math.random() * 200 + 150}px) scale(${Math.random() * 0.5 + 1}) rotate(${Math.random() * 100 - 50}deg)`;
                span.style.opacity = '0';
            });
        });

        setTimeout(() => span.remove(), 1500);
    }
}

function showCorrectEffect() {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4em;
        z-index: 1000;
        animation: popInOut 1s forwards;
        pointer-events: none;
    `;
    effect.innerHTML = '✅';
    document.body.appendChild(effect);

    setTimeout(() => {
        effect.remove();
    }, 1000);
}

function showWrongEffect() {
    const effect = document.createElement('div');
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4em;
        z-index: 1000;
        animation: popInOut 1s forwards;
        pointer-events: none;
    `;
    effect.innerHTML = '❌';
    document.body.appendChild(effect);

    setTimeout(() => {
        effect.remove();
    }, 1000);
}

function showComboFire(streak) {
    let comboEl = document.getElementById('comboFireBadge');
    if (!comboEl) {
        comboEl = document.createElement('div');
        comboEl.id = 'comboFireBadge';
        comboEl.style.cssText = 'position:fixed; bottom:70px; right:20px; z-index:99; font-weight:900; font-size:1rem; padding:6px 14px; background:#ffd23f; border:2.5px solid #141414; border-radius:999px; box-shadow:3px 3px 0 #141414; display:none; pointer-events:none; transition:transform 0.15s ease;';
        document.body.appendChild(comboEl);
    }
    if (streak >= 3) {
        comboEl.innerHTML = `🔥 COMBO x${streak}`;
        comboEl.style.display = 'block';
        comboEl.style.transform = 'scale(1.15)';
        setTimeout(() => { if (comboEl) comboEl.style.transform = 'scale(1)'; }, 150);
    } else {
        comboEl.style.display = 'none';
    }
}

function changeQuestion(step) {
    if (examMode === 'survival' && isSurvivalFailed) return;
    // Xóa timer nếu người dùng tự chuyển câu
    if (autoNextTimer) {
        clearTimeout(autoNextTimer);
        autoNextTimer = null;
    }

    const questionsToShow = isRetryMode ? filteredQuestions : allQuestions;
    const newIndex = currentIndex + step;
    if (newIndex >= 0 && newIndex < questionsToShow.length) {
        renderQuestion(newIndex);
    }
}

// --- 6. LÀM LẠI & NỘP BÀI ---
function resetExam() {
    if (!confirm("Bạn có chắc muốn xóa toàn bộ kết quả và làm lại từ đầu không?")) return;

    performFullReset();
}

function performFullReset() {
    closeResult();

    if (autoNextTimer) {
        clearTimeout(autoNextTimer);
        autoNextTimer = null;
    }

    const modalResult = document.getElementById('modalResult');
    if (modalResult) modalResult.style.display = 'none';

    const filterBar = document.getElementById('reviewFilterBar');
    if (filterBar) filterBar.remove();

    localStorage.removeItem('quiz_data_' + currentFileName);
    localStorage.removeItem('bookmarks_' + currentFileName);
    updateBookmarkBadge();

    if (originalQuestions.length > 0) {
        allQuestions = JSON.parse(JSON.stringify(originalQuestions));
    } else {
        allQuestions.forEach(q => {
            q.userSelected = null;
            q.firstAttemptSelected = null;
            q.isCorrectFirstTime = null;
            q.retrySelected = null;
            q.isRetryMode = false;
        });
    }

    isRetryMode = false;
    isReviewFilterMode = false;
    hasReportedScore = false;
    filteredQuestions = [];
    wrongQuestions = [];
    retryCount = 0;
    firstAttemptScore = 0;
    isSurvivalFailed = false;
    totalSeconds = 0;
    currentIndex = 0;
    isSubmitted = false;
    isAutoNextEnabled = false;
    syncAutoNextButtonUI();
    currentStreak = 0; // Reset hỏa lực
    showComboFire(0);

    if (questionOrder === 'random') {
        shuffleQuestions();
        shuffleOptions();
    }

    renderQuestion(0);
    startTimer();
    updateTimerDisplay();
    updateTitleWithAutoStatus();

    // Cập nhật toggle
    const toggleSwitch = document.querySelector('.toggle-switch');
    if (toggleSwitch) {
        toggleSwitch.classList.remove('active');
    }
}

function finishExam(skipConfirm = false) {
    if (autoNextTimer) {
        clearTimeout(autoNextTimer);
        autoNextTimer = null;
    }
    if (isSubmitted) {
        showResultModal();
        return;
    }

    const answeredCount = allQuestions.filter(q => q.userSelected !== null).length;
    const totalQuestions = allQuestions.length;
    const bookmarkedCount = getBookmarks().length;

    if (!skipConfirm) {
        if (bookmarkedCount > 0) {
            if (!confirm(`⚠️ Boss man đang có ${bookmarkedCount} câu cắm cờ phân vân (⭐) chưa kiểm tra lại!\n\nNhấn "OK" để vẫn nộp bài luôn.\nNhấn "Cancel" để mở danh sách kiểm tra lại.`)) {
                toggleModal();
                setPaletteFilter('flagged');
                return;
            }
        }
        if (answeredCount < totalQuestions) {
            if (!confirm(`Bạn mới trả lời ${answeredCount}/${totalQuestions} câu. Bạn có chắc muốn nộp bài không?`)) {
                return;
            }
        } else {
            if (!confirm("Bạn muốn nộp bài để xem tổng kết điểm chứ?")) return;
        }
    }

    isSubmitted = true;
    if (syncTimeout) { clearTimeout(syncTimeout); syncTimeout = null; } // Hủy sync "Đang làm"
    clearInterval(timerInterval);

    // Tính toán kết quả lần đầu
    let correct = 0, wrong = 0, skip = 0;
    allQuestions.forEach(q => {
        if (q.firstAttemptSelected === null) {
            skip++;
        } else if (q.isCorrectFirstTime) {
            correct++;
        } else {
            wrong++;
        }
    });

    firstAttemptScore = correct;

    // Lưu tiến độ ngay lập tức để đảm bảo trạng thái nộp bài được ghi nhận trước confirm/timeout
    saveProgress();

    // Nếu chế độ thường và có câu sai, hỏi có muốn làm lại không
    if (examMode === 'normal' && wrong > 0) {
        setTimeout(() => {
            if (confirm(`Bạn có ${wrong} câu sai. Bạn có muốn làm lại các câu sai này cho đến khi đúng hết không?\n\nLưu ý: Điểm cuối cùng vẫn tính theo lần đầu (${correct}/${totalQuestions})`)) {
                startRetryMode();
                return;
            } else {
                saveProgress();
                showResultModal();
            }
        }, 500);
    } else {
        saveProgress();
        showResultModal();
    }
}

// Bắt đầu chế độ làm lại câu sai
function startRetryMode() {
    closeResult();

    isSubmitted = false;
    isRetryMode = true;
    retryCount++;

    // Reset tất cả retrySelected để có thể làm lại
    allQuestions.forEach(q => {
        q.retrySelected = null;
    });

    // Tìm các câu sai từ lần đầu
    wrongQuestions = [];
    allQuestions.forEach((q, index) => {
        if (!q.isCorrectFirstTime && q.firstAttemptSelected !== null) {
            q.isRetryMode = true;
            wrongQuestions.push({
                index: q.originalIndex !== undefined ? q.originalIndex : index,
                originalIndex: q.originalIndex !== undefined ? q.originalIndex : index,
                question: q
            });
        } else {
            q.isRetryMode = false;
        }
    });

    if (wrongQuestions.length === 0) {
        isSubmitted = true;
        showResultModal();
        return;
    }

    updateFilteredQuestions();

    setTimeout(() => {
        alert(`📝 BẮT ĐẦU LÀM LẠI ${filteredQuestions.length} CÂU SAI\nLàm đúng hết để hoàn thành!\n\nĐiểm lần đầu: ${firstAttemptScore}/${allQuestions.length}`);
    }, 300);

    if (filteredQuestions.length > 0) {
        currentIndex = 0;
        renderQuestion(currentIndex);
    }

    document.getElementById('sectionTitle').innerHTML =
        `LÀM LẠI CÂU SAI | Đề ${currentFileName} <span class="normal-badge" style="background:#f39c12">🔄 Lần ${retryCount}</span>`;

    startTimer();
}

// Cập nhật filteredQuestions (chỉ câu sai chưa làm đúng)
function updateFilteredQuestions() {
    filteredQuestions = allQuestions.filter(q =>
        !q.isCorrectFirstTime &&
        q.firstAttemptSelected !== null &&
        !(q.retrySelected !== null && q.options[q.retrySelected]?.isCorrect)  // Chỉ loại bỏ câu đã làm lại ĐÚNG
    );

    filteredQuestions.forEach((q, idx) => {
        q.filteredIndex = idx;
    });
}

function showResultModal() {
    // Tính điểm theo lần đầu
    let correct = firstAttemptScore;
    let wrong = 0;
    let skip = 0;

    allQuestions.forEach(q => {
        if (q.firstAttemptSelected === null) {
            skip++;
        } else if (!q.isCorrectFirstTime) {
            wrong++;
        }
    });

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    const scale10 = parseFloat(((correct / allQuestions.length) * 10).toFixed(2));
    document.getElementById('resScore').innerHTML = `
        <div style="font-size:1.2em; color:#e74c3c; font-weight:bold">${scale10} <span style="font-size:0.5em; color:#636e72">Điểm</span></div>
        <div style="font-size:0.5em; color:#636e72; margin-top:5px;">(Đúng ${correct}/${allQuestions.length} câu)</div>
    `;
    document.getElementById('resRight').innerText = correct;
    document.getElementById('resWrong').innerText = wrong;
    document.getElementById('resSkip').innerText = skip;
    document.getElementById('resTime').innerText = `Tổng thời gian: ${mins} phút ${secs} giây`;

    const resultBox = document.querySelector('.result-box');
    const oldModeInfo = resultBox.querySelector('.mode-info-card');
    if (oldModeInfo) {
        oldModeInfo.remove();
    }

    const modeInfo = document.createElement('div');
    modeInfo.className = 'mode-info-card';
    modeInfo.style.cssText = `
        margin-bottom: 15px;
        padding: 12px;
        background: #e3f2fd;
        border-radius: 10px;
        font-size: 0.9em;
        text-align: center;
        border: 2px solid #2196f3;
    `;

    const modeLabel = examMode === 'survival' ? '💀 Sinh tử' : (examMode === 'scoring' ? '💯 Tính điểm' : '😊 Thường');
    let modeText = `<div style="font-weight:bold; margin-bottom:5px;">📊 THÔNG TIN KẾT QUẢ</div>`;
    modeText += `<div>🎮 Chế độ: <strong>${modeLabel}</strong></div>`;
    modeText += `<div>🔀 Thứ tự: <strong>${questionOrder === 'random' ? 'Đảo lộn' : 'Nguyên bản'}</strong></div>`;
    modeText += `<div>⚡ Auto Next: <strong>${isAutoNextEnabled ? 'BẬT' : 'TẮT'}</strong></div>`;
    modeText += `<div>🏆 Điểm lần đầu: <strong>${firstAttemptScore}/${allQuestions.length}</strong></div>`;

    if (retryCount > 0) {
        modeText += `<div>🔄 Số lần làm lại: <strong>${retryCount}</strong></div>`;
        const retryCorrect = allQuestions.filter(q =>
            !q.isCorrectFirstTime && q.firstAttemptSelected !== null && q.retrySelected !== null
        ).length;
        modeText += `<div>✅ Câu sai đã sửa: <strong>${retryCorrect}/${wrong}</strong></div>`;
    }

    modeInfo.innerHTML = modeText;

    const timeElement = document.getElementById('resTime');
    resultBox.insertBefore(modeInfo, timeElement);

    const oldRetryButton = resultBox.querySelector('.retry-button');
    if (oldRetryButton) {
        oldRetryButton.remove();
    }

    if (examMode === 'normal' && wrong > 0 && !isRetryMode) {
        const retryButton = document.createElement('button');
        retryButton.className = 'result-btn retry-button';
        retryButton.style.cssText = 'background: #02a9ea !important; color: #ffffff !important; width: 100%; flex-basis: 100%; margin-top: 10px; cursor: pointer;';
        retryButton.innerText = '🔄 Làm lại câu sai';
        retryButton.onclick = function (e) {
            closeResult();
            setTimeout(() => {
                startRetryMode();
            }, 300);
        };

        const actionsContainer = resultBox.querySelector('.result-actions');
        if (actionsContainer) {
            actionsContainer.appendChild(retryButton);
        }
    }

    document.getElementById('modalResult').style.display = 'flex';

    // --- GỬI ĐIỂM VỀ TELEGRAM & HIỆU ỨNG PHÁO HOA ---
    if (!hasReportedScore) {
        hasReportedScore = true;
        reportScoreAndFirework(correct, wrong, skip);
    }
}

async function reportScoreAndFirework(correct, wrong, skip) {
    const total = allQuestions.length;

    // 1. Nếu đạt 100% điểm -> Bắn pháo hoa & Hiện bằng khen
    if (correct === total && total > 0) {
        createFireworks();
        setTimeout(() => {
            const userDataStr = sessionStorage.getItem('current_user') || localStorage.getItem('current_user');
            let uName = "Học Viên";
            if (userDataStr) {
                const ud = JSON.parse(userDataStr);
                uName = ud.username || ud.accountId || "Học Viên";
            }
            if (typeof showCertificate === 'function') {
                showCertificate(uName, currentFileName, correct, total);
            }
        }, 1500);
    }

    const userDataStr = sessionStorage.getItem('current_user') || localStorage.getItem('current_user') || localStorage.getItem('currentUser');
    if (!userDataStr) return;
    const userData = JSON.parse(userDataStr);

    // --- 2. GỬI ĐIỂM LÊN LEADERBOARD (luôn chạy, không phụ thuộc Telegram) ---
    try {
        let examDisplayName = currentFileName;
        try {
            let found = false;
            if (userData.exams && Array.isArray(userData.exams)) {
                const matched = userData.exams.find(e => e.file === currentFileName);
                if (matched) { examDisplayName = matched.ten; found = true; }
            }
            if (!found && typeof DEFAULT_EXAMS !== 'undefined') {
                const matched = DEFAULT_EXAMS.find(e => e.file === currentFileName);
                if (matched) examDisplayName = matched.ten;
            }
        } catch (e) { }

        const sheetParams = new URLSearchParams({
            username: `${userData.username || 'Khách'} - ${examDisplayName}`,
            examName: currentFileName,
            score: `${correct}/${total} (${parseFloat(((correct / total) * 10).toFixed(2))} Điểm)`,
            ip: 'N/A',
            device: navigator.userAgent || 'N/A'
        });

        fetch(`${API_BASE}?${sheetParams.toString()}`, { method: 'GET' });
        console.log("Đã gửi điểm lên Leaderboard:", `${correct}/${total}`);

        // Reload leaderboard nếu đang mở
        if (typeof window.fetchLeaderboardBackground === 'function') {
            setTimeout(() => window.fetchLeaderboardBackground(), 1000);
        }
    } catch (sheetErr) {
        console.error("Lỗi gửi Leaderboard:", sheetErr);
    }

    // --- 3. GỬI VỀ TELEGRAM (tùy chọn, không ảnh hưởng leaderboard) ---
    try {
        if (typeof getTelegramBotToken !== 'undefined') {
            let ipData = { ip: 'N/A', city: 'N/A', region: 'N/A', latitude: 0, longitude: 0 };
            try {
                const ipRes = await Promise.race([
                    fetch('https://get.geojs.io/v1/ip/geo.json'),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('IP Timeout')), 3000))
                ]);
                ipData = await ipRes.json();
            } catch (e) {
                console.log("Không thể fetch IP:", e);
            }

            const mapLink = `https://www.google.com/maps/search/?api=1&query=${ipData.latitude},${ipData.longitude}`;
            const device = navigator.userAgent;
            const msg = `📝 <b>NỘP BÀI THI</b>\n👤 Tài khoản: <code>${userData.accountId || userData.username || 'Unknown'}</code>\nĐề: ${currentFileName}\n🏆 Điểm: <b>${correct}/${total}</b>\n✅ Đúng: ${correct} | ❌ Sai: ${wrong} | ⏳ Bỏ qua: ${skip}\n🌐 IP: ${ipData.ip}\n📍 Vị trí: <a href="${mapLink}">${ipData.city || 'N/A'}, ${ipData.region || 'N/A'}</a>\n📱 Thiết bị: <code>${device}</code>\n⏱ T.Gian: ${new Date().toLocaleString('vi-VN')}`;

            await Promise.race([
                fetch(`https://api.telegram.org/bot${getTelegramBotToken()}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: getTelegramChatId(), text: msg, parse_mode: 'HTML' })
                }),
                new Promise(r => setTimeout(r, 2000))
            ]);
        }
    } catch (e) { console.error("Lỗi gửi Telegram:", e); }
}


// Hàm Mini-Animation: Pháo Hoa Mờ Mờ
function createFireworks() {
    const fwContainer = document.createElement('div');
    fwContainer.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9999;";
    document.body.appendChild(fwContainer);

    for (let i = 0; i < 40; i++) {
        const dot = document.createElement('div');
        const color = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe'][Math.floor(Math.random() * 5)];
        dot.style.cssText = `
            position:absolute; width:10px; height:10px; background:${color}; border-radius:50%; 
            top:50%; left:50%;
            transition: all 1.5s cubic-bezier(0.25, 1, 0.5, 1);
            opacity: 1; transform: translate(-50%, -50%) scale(1);
        `;
        fwContainer.appendChild(dot);

        setTimeout(() => {
            const angle = Math.random() * Math.PI * 2;
            const velocity = 100 + Math.random() * 300;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity + 150; // Trọng lực nhẹ

            dot.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
            dot.style.opacity = 0;
        }, 10);
    }

    setTimeout(() => { fwContainer.remove(); }, 2000);
}

// Hàm Mini-Animation: Nút bấm Gợn Sóng (Ripple Effect)
function createRipple(event, button) {
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-anim');

    const rippleList = button.getElementsByClassName('ripple-anim');
    while (rippleList.length > 0) rippleList[0].remove();

    button.appendChild(circle);
}

// Gắn sự kiện ripple cho các button hiện tại
document.addEventListener('click', (e) => {
    if (e.target && (e.target.tagName === 'BUTTON' || e.target.classList.contains('option-item'))) {
        createRipple(e, e.target);
    }
});

// --- 7. LƯU & TẢI TIẾN ĐỘ ---
function saveProgress() {
    if (allQuestions.length === 0) return;

    let tempScore = 0;
    allQuestions.forEach(q => {
        const selected = isRetryMode ? q.retrySelected : q.userSelected;
        if (selected !== null && q.options[selected]?.isCorrect) tempScore++;
    });

    const data = {
        currentIndex: currentIndex,
        score: tempScore,
        isSubmitted: isSubmitted,
        totalSeconds: totalSeconds,
        examMode: examMode,
        questionOrder: questionOrder,
        isSurvivalFailed: isSurvivalFailed,
        isRetryMode: isRetryMode,
        retryCount: retryCount,
        firstAttemptScore: firstAttemptScore,
        autoNext: isAutoNextEnabled, // Lưu trạng thái Auto Next
        currentStreak: currentStreak, // Lưu trạng thái Combo Hỏa lực
        wrongQuestions: wrongQuestions.map(item => item.index),
        history: allQuestions.map(q => ({
            userSelected: q.userSelected,
            firstAttemptSelected: q.firstAttemptSelected,
            isCorrectFirstTime: q.isCorrectFirstTime,
            retrySelected: q.retrySelected,
            isRetryMode: q.isRetryMode,
            originalIndex: q.originalIndex,
            shuffledOptionIndices: q.shuffledOptionIndices
        }))
    };
    localStorage.setItem('quiz_data_' + currentFileName, JSON.stringify(data));

    // Gọi đồng bộ tiến độ thời gian thực
    syncLiveProgress();
}

let syncTimeout = null;
function syncLiveProgress() {
    // Không đồng bộ nếu đã nộp bài hoặc chưa có câu hỏi
    if (isSubmitted || allQuestions.length === 0) return;

    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
        // Kiểm tra lại lần nữa trong setTimeout (phòng trường hợp nộp bài trong lúc chờ)
        if (isSubmitted) return;

        try {
            const uStr = sessionStorage.getItem('current_user') || localStorage.getItem('current_user');
            if (!uStr) return;
            const userData = JSON.parse(uStr);

            const total = allQuestions.length;
            const answered = allQuestions.filter(q => q.userSelected !== null).length;

            let examDisplayName = currentFileName;
            let found = false;
            if (userData.exams && Array.isArray(userData.exams)) {
                const matched = userData.exams.find(e => e.file === currentFileName);
                if (matched) { examDisplayName = matched.ten; found = true; }
            }
            if (!found && typeof DEFAULT_EXAMS !== 'undefined') {
                const matched = DEFAULT_EXAMS.find(e => e.file === currentFileName);
                if (matched) examDisplayName = matched.ten;
            }

            const sheetParams = new URLSearchParams({
                username: `${userData.username || 'Khách'} - ${examDisplayName}`,
                examName: currentFileName,
                score: `${answered}/${total} (Đang làm)`,
                ip: 'Đang làm...',
                device: navigator.userAgent
            });

            fetch(`${API_BASE}?${sheetParams.toString()}`, {
                method: 'GET'
            });
        } catch (e) { }
    }, 4000);
}

function loadProgress() {
    const saved = localStorage.getItem('quiz_data_' + currentFileName);
    if (saved) {
        let data = null;
        try {
            data = JSON.parse(saved);
        } catch (e) {
            console.warn('Corrupted quiz_data JSON in localStorage, resetting:', e);
            localStorage.removeItem('quiz_data_' + currentFileName);
            renderQuestion(0);
            return;
        }

        if (!data || typeof data !== 'object') {
            console.warn('Malformed quiz_data in localStorage (not an object), resetting');
            localStorage.removeItem('quiz_data_' + currentFileName);
            renderQuestion(0);
            return;
        }

        isSubmitted = Boolean(data.isSubmitted);
        totalSeconds = typeof data.totalSeconds === 'number' && !isNaN(data.totalSeconds) ? data.totalSeconds : 0;
        examMode = data.examMode || examMode;
        questionOrder = data.questionOrder || questionOrder;
        isSurvivalFailed = Boolean(data.isSurvivalFailed);
        isRetryMode = Boolean(data.isRetryMode);
        retryCount = typeof data.retryCount === 'number' ? data.retryCount : 0;
        firstAttemptScore = typeof data.firstAttemptScore === 'number' ? data.firstAttemptScore : 0;
        currentStreak = typeof data.currentStreak === 'number' ? data.currentStreak : 0; // Phục hồi Combo Hỏa lực

        if (data.autoNext !== undefined) isAutoNextEnabled = Boolean(data.autoNext);

        if (Array.isArray(data.wrongQuestions)) {
            wrongQuestions = data.wrongQuestions.map(idx => ({
                index: idx,
                originalIndex: idx,
                question: allQuestions.find(q => q.originalIndex === idx) || allQuestions[idx]
            })).filter(item => item.question);
        } else {
            wrongQuestions = [];
        }

        if (examMode === 'survival' && isSurvivalFailed && !isSubmitted) {
            performSurvivalReset();
            saveProgress();
            renderQuestion(0);
            return;
        }

        updateTimerDisplay();

        if (Array.isArray(data.history)) {
            const originalParsed = JSON.parse(JSON.stringify(allQuestions));
            const restoredQuestions = [];

            data.history.forEach((h, i) => {
                if (!h || typeof h !== 'object') return;
                let q = originalParsed[h.originalIndex !== undefined ? h.originalIndex : i];
                if (q) {
                    q = JSON.parse(JSON.stringify(q));
                    if (Array.isArray(h.shuffledOptionIndices)) {
                        q.options = h.shuffledOptionIndices.map(idx => q.options[idx]).filter(Boolean);
                    }

                    q.userSelected = (typeof h.userSelected === 'number') ? h.userSelected : null;
                    q.firstAttemptSelected = (typeof h.firstAttemptSelected === 'number') ? h.firstAttemptSelected : null;
                    q.isCorrectFirstTime = (typeof h.isCorrectFirstTime === 'boolean') ? h.isCorrectFirstTime : null;
                    q.retrySelected = (typeof h.retrySelected === 'number') ? h.retrySelected : null;
                    q.isRetryMode = Boolean(h.isRetryMode);
                    q.originalIndex = h.originalIndex !== undefined ? h.originalIndex : i;
                    q.shuffledOptionIndices = h.shuffledOptionIndices;
                    
                    restoredQuestions.push(q);
                }
            });
            if (restoredQuestions.length > 0) {
                allQuestions = restoredQuestions;
            }
        } else if (data.history !== undefined && !Array.isArray(data.history)) {
            console.warn('Corrupted data.history in quiz_data (not an array), resetting stored corrupted data');
            localStorage.removeItem('quiz_data_' + currentFileName);
        }

        if (isRetryMode) {
            updateFilteredQuestions();
            document.getElementById('sectionTitle').innerHTML =
                `LÀM LẠI CÂU SAI | Đề ${currentFileName} <span class="normal-badge" style="background:#f39c12">🔄 Lần ${retryCount}</span>`;

            if (filteredQuestions.length > 0) {
                currentIndex = Math.min(data.currentIndex || 0, filteredQuestions.length - 1);
                renderQuestion(currentIndex);
            } else {
                renderQuestion(data.currentIndex || 0);
            }
        } else {
            renderQuestion(data.currentIndex || 0);
        }
    } else {
        renderQuestion(0);
    }

    // Khôi phục hiển thị Combo Badge
    if (currentStreak >= 5) {
        showComboFire(currentStreak);
    }
}

// --- 8. MODAL DANH SÁCH & BỘ LỌC PALETTE (ALL / FLAGGED / UNANSWERED) ---
function toggleModal() {
    const modal = document.getElementById('modalList');
    if (!modal) return;
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        updatePaletteCounts();
        renderPaletteGrid();
        modal.style.display = 'flex';
    }
}

function setPaletteFilter(filterType) {
    currentPaletteFilter = filterType || 'all';

    ['palTabAll', 'palTabFlagged', 'palTabUnanswered'].forEach(id => {
        const tab = document.getElementById(id);
        if (tab) tab.classList.remove('active');
    });

    if (currentPaletteFilter === 'flagged') {
        const tab = document.getElementById('palTabFlagged');
        if (tab) tab.classList.add('active');
    } else if (currentPaletteFilter === 'unanswered') {
        const tab = document.getElementById('palTabUnanswered');
        if (tab) tab.classList.add('active');
    } else {
        const tab = document.getElementById('palTabAll');
        if (tab) tab.classList.add('active');
    }

    updatePaletteCounts();
    renderPaletteGrid();
}

function updatePaletteCounts() {
    const questionsToShow = (isRetryMode || isReviewFilterMode) ? filteredQuestions : allQuestions;
    const total = questionsToShow.length;
    const flagged = questionsToShow.filter(q => isQuestionBookmarked(q)).length;
    const unanswered = questionsToShow.filter(q => {
        return isRetryMode ? (q.retrySelected === null) : (q.userSelected === null);
    }).length;

    const elAll = document.getElementById('palCountAll');
    const elFlag = document.getElementById('palCountFlagged');
    const elUn = document.getElementById('palCountUnanswered');

    if (elAll) elAll.innerText = total;
    if (elFlag) elFlag.innerText = flagged;
    if (elUn) elUn.innerText = unanswered;
}

function renderPaletteGrid() {
    const grid = document.getElementById('gridMap');
    if (!grid) return;
    grid.innerHTML = '';

    const questionsToShow = (isRetryMode || isReviewFilterMode) ? filteredQuestions : allQuestions;
    let visibleCount = 0;

    questionsToShow.forEach((q, idx) => {
        const isBm = isQuestionBookmarked(q);
        const isAnswered = isRetryMode ? (q.retrySelected !== null) : (q.userSelected !== null);

        // Lọc theo tab
        if (currentPaletteFilter === 'flagged' && !isBm) return;
        if (currentPaletteFilter === 'unanswered' && isAnswered) return;

        visibleCount++;

        const div = document.createElement('div');
        div.className = 'grid-item';
        div.style.position = 'relative';
        div.innerHTML = `<span class="q-num" style="font-weight:900; font-size:0.88rem;">${idx + 1}</span>${isBm ? '<span class="q-star-badge" style="position:absolute; top:-6px; right:-5px; font-size:13px; line-height:1; filter:drop-shadow(1px 1px 0 #141414); pointer-events:none; z-index:5;">⭐</span>' : ''}`;

        let titleStr = `Câu ${idx + 1}`;
        if (questionOrder === 'random') {
            titleStr += ` (Gốc: ${q.originalIndex + 1})`;
        }
        if (isBm) {
            titleStr += ` • ⭐ Đang phân vân`;
            div.classList.add('bookmarked');
            div.style.borderColor = '#eab308';
            div.style.borderWidth = '2.5px';
            div.style.borderStyle = 'solid';
            if (!isAnswered) {
                div.style.background = '#fef08a';
                div.style.color = '#854d0e';
                div.style.fontWeight = '900';
            }
        }
        div.title = titleStr;

        if (idx === currentIndex) div.classList.add('current');

        if (isRetryMode) {
            if (q.retrySelected !== null) {
                div.classList.add(q.options[q.retrySelected]?.isCorrect ? 'done-correct' : 'done-wrong');
            }
        } else {
            if (q.userSelected !== null) {
                if (examMode === 'scoring' && !isSubmitted) {
                    div.classList.add('done-answered'); // Chế độ tính điểm: hiện đã làm
                } else if (q.options[q.userSelected]?.isCorrect) {
                    div.classList.add('done-correct');
                } else {
                    div.classList.add('done-wrong');
                }
            }
        }

        div.onclick = () => {
            renderQuestion(idx);
            const modal = document.getElementById('modalList');
            if (modal) modal.style.display = 'none';
        };
        grid.appendChild(div);
    });

    if (visibleCount === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.cssText = 'grid-column: 1/-1; padding: 32px 16px; text-align: center; color: #64748b; font-weight: 800; font-size: 0.95rem; line-height: 1.6;';
        if (currentPaletteFilter === 'flagged') {
            emptyMsg.innerHTML = '⭐ Chưa có câu nào được cắm cờ phân vân!<br><span style="font-size:0.82rem; font-weight:600; color:#94a3b8;">Bấm nút "CẮM CỜ PHÂN VÂN" ở trên câu hỏi để gom các câu cần xem lại vào đây.</span>';
        } else if (currentPaletteFilter === 'unanswered') {
            emptyMsg.innerHTML = '🎉 Tuyệt vời! Bạn đã trả lời hết toàn bộ các câu hỏi!';
        } else {
            emptyMsg.innerHTML = 'Không có câu hỏi nào để hiển thị.';
        }
        grid.appendChild(emptyMsg);
    }
}

// --- 9. ANIMATIONS CSS ---
const style = document.createElement('style');
style.textContent = `
    @keyframes deathPulse {
        0% { transform: scale(1); }
        100% { transform: scale(1.1); }
    }
    
    @keyframes popInOut {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
    
    .survival-badge {
        display: inline-block;
        background: #d63031;
        color: white;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.7em;
        font-weight: bold;
        margin-left: 5px;
        animation: pulse-badge 1.5s infinite;
    }
    
    .normal-badge {
        display: inline-block;
        background: #00b894;
        color: white;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.7em;
        font-weight: bold;
        margin-left: 5px;
    }

    .auto-badge {
        display: inline-block;
        background: #0984e3;
        color: white;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.7em;
        font-weight: bold;
        margin-left: 5px;
    }
    
    @keyframes pulse-badge {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    button { position: relative; overflow: hidden; }
    .option-item { position: relative; overflow: hidden; }
    .ripple-anim {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        background-color: rgba(255, 255, 255, 0.4);
        pointer-events: none;
    }
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(style);

// --- 10. ĐIỀU KHIỂN BÀN PHÍM SIÊU TỐC ---
document.addEventListener('keydown', (event) => {
    // Bỏ qua nếu đang gõ input hoặc mở modal
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
    if (examMode === 'survival' && isSurvivalFailed) return;

    const modalList = document.getElementById('modalList');
    const modalResult = document.getElementById('modalResult');
    if ((modalList && modalList.style.display === 'flex') ||
        (modalResult && modalResult.style.display === 'flex')) {
        return;
    }

    if (event.key === 'ArrowRight' || event.key === ' ') {
        if (event.key === ' ') event.preventDefault();
        changeQuestion(1);
    } else if (event.key === 'ArrowLeft') {
        changeQuestion(-1);
    } else if (['1', 'a', 'A'].includes(event.key)) {
        const opts = document.querySelectorAll('.option-item');
        if (opts[0]) opts[0].click();
    } else if (['2', 'b', 'B'].includes(event.key)) {
        const opts = document.querySelectorAll('.option-item');
        if (opts[1]) opts[1].click();
    } else if (['3', 'c', 'C'].includes(event.key)) {
        const opts = document.querySelectorAll('.option-item');
        if (opts[2]) opts[2].click();
    } else if (['4', 'd', 'D'].includes(event.key)) {
        const opts = document.querySelectorAll('.option-item');
        if (opts[3]) opts[3].click();
    }
});

// --- 11. HÀM ĐÓNG KẾT QUẢ ---
function closeResult() {
    const modal = document.getElementById('modalResult');
    if (modal) modal.style.display = 'none';
    if (typeof showReviewFilterBar === 'function' && isSubmitted) {
        showReviewFilterBar();
    }
}
