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
let filteredQuestions = [];

// --- BIẾN MỚI CHO TÍNH NĂNG AUTO NEXT ---
let isAutoNextEnabled = false;
let autoNextTimer = null;

// --- 1. TẢI ĐỀ THI ---
function loadExam(fileName) {
    currentFileName = fileName;
    const params = new URLSearchParams(window.location.search);
    
    examMode = params.get('mode') || 'normal';
    questionOrder = params.get('order') || 'normal';
    
    // NHẬN CẤU HÌNH AUTO NEXT TỪ URL
    isAutoNextEnabled = params.get('auto') === 'true';
    
    if (!params.get('mode')) {
        const savedMode = localStorage.getItem('exam_mode_' + fileName);
        if (savedMode) {
            const modeData = JSON.parse(savedMode);
            examMode = modeData.mode;
            questionOrder = modeData.order;
            // Nếu lưu cả cấu hình auto trong localStorage thì lấy ra ở đây
            if (modeData.autoNext !== undefined) {
                isAutoNextEnabled = modeData.autoNext;
            }
        }
    }
    
    let title = "Đề số " + fileName;
    const titleElement = document.getElementById('sectionTitle');
    
    // Cập nhật tiêu đề hiển thị trạng thái Auto Next
    let autoBadge = isAutoNextEnabled ? ' <span class="auto-badge">⚡ AUTO</span>' : '';

    if (examMode === 'survival') {
        titleElement.innerHTML = title + ' <span class="survival-badge">💀 1 MẠNG</span>' + autoBadge;
    } else {
        titleElement.innerHTML = title + ' <span class="normal-badge">😊 THƯỜNG</span>' + autoBadge;
    }
    
    // Hiển thị thông báo nếu là làm mới
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('new') && urlParams.get('new') === 'true') {
        setTimeout(() => {
            if (examMode === 'survival') {
                alert("💀 BẮT ĐẦU LÀM MỚI - CHẾ ĐỘ SINH TỬ\nBạn chỉ có 1 mạng duy nhất!\nSai 1 câu sẽ LÀM LẠI TỪ ĐẦU!");
            } else {
                alert("😊 BẮT ĐẦU LÀM MỚI - CHẾ ĐỘ THƯỜNG\nSai vẫn làm tiếp được, không sửa lại được đáp án!");
            }
        }, 500);
    }

    fetch(fileName + '.txt')
        .then(res => res.text())
        .then(text => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('quizArea').style.display = 'block';
            parseData(text);
            
            if (questionOrder === 'random') {
                shuffleQuestions();
                shuffleOptions();
                originalQuestions = JSON.parse(JSON.stringify(allQuestions));
            }
            
            loadProgress();
            
            if (!isSubmitted) {
                startTimer();
                // Thêm nút toggle Auto Next
                createAutoNextToggle();
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
        if (!allQuestions[i].originalIndex) allQuestions[i].originalIndex = i;
        if (!allQuestions[j].originalIndex) allQuestions[j].originalIndex = j;
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

// --- 3. QUẢN LÝ THỜI GIAN ---
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        totalSeconds++;
        updateTimerDisplay();
    }, 1000);
}

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

// --- 4. TẠO NÚT TOGGLE AUTO NEXT ---
function createAutoNextToggle() {
    // Tìm phần tử controls hoặc tự tạo container
    let controlsContainer = document.querySelector('.controls');
    if (!controlsContainer) {
        // Tìm phần tử chứa timer để thêm toggle bên cạnh
        const timerElement = document.getElementById('timer');
        if (timerElement && timerElement.parentNode) {
            controlsContainer = timerElement.parentNode;
        } else {
            // Tạo container mới nếu không tìm thấy
            controlsContainer = document.createElement('div');
            controlsContainer.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
                padding: 10px 15px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            `;
            const quizArea = document.getElementById('quizArea');
            if (quizArea) {
                const firstChild = quizArea.firstChild;
                quizArea.insertBefore(controlsContainer, firstChild);
            }
        }
    }
    
    // Tạo toggle container
    const toggleContainer = document.createElement('div');
    toggleContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px 10px;
        background: #f8f9fa;
        border-radius: 20px;
        cursor: pointer;
        user-select: none;
        transition: 0.3s;
    `;
    
    toggleContainer.innerHTML = `
        <div style="font-size: 0.85em; color: #636e72; font-weight: 600;">AUTO</div>
        <div class="toggle-switch ${isAutoNextEnabled ? 'active' : ''}">
            <div class="toggle-slider"></div>
        </div>
    `;
    
    toggleContainer.onclick = function() {
        isAutoNextEnabled = !isAutoNextEnabled;
        const toggleSwitch = this.querySelector('.toggle-switch');
        toggleSwitch.classList.toggle('active');
        
        // Hiển thị thông báo
        showAutoNextStatus();
        saveProgress();
        
        // Cập nhật tiêu đề
        updateTitleWithAutoStatus();
    };
    
    // Thêm vào container
    controlsContainer.appendChild(toggleContainer);
    
    // Thêm CSS cho toggle
    if (!document.querySelector('#auto-next-toggle-style')) {
        const style = document.createElement('style');
        style.id = 'auto-next-toggle-style';
        style.textContent = `
            .toggle-switch {
                width: 50px;
                height: 26px;
                background: #ddd;
                border-radius: 13px;
                position: relative;
                transition: 0.3s;
            }
            .toggle-switch.active {
                background: #00b894;
            }
            .toggle-slider {
                width: 22px;
                height: 22px;
                background: white;
                border-radius: 50%;
                position: absolute;
                top: 2px;
                left: 2px;
                transition: 0.3s;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .toggle-switch.active .toggle-slider {
                left: 26px;
            }
        `;
        document.head.appendChild(style);
    }
}

function showAutoNextStatus() {
    // Xóa thông báo cũ nếu có
    const oldMsg = document.querySelector('.auto-next-status');
    if (oldMsg) oldMsg.remove();
    
    const msg = document.createElement('div');
    msg.className = 'auto-next-status';
    msg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isAutoNextEnabled ? '#00b894' : '#636e72'};
        color: white;
        padding: 12px 18px;
        border-radius: 10px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: fadeInOut 2s forwards;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    msg.innerHTML = `⚡ Auto NEXT CÂU: <strong>${isAutoNextEnabled ? 'BẬT' : 'TẮT'}</strong>`;
    document.body.appendChild(msg);
    
    setTimeout(() => {
        if (msg.parentNode) {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-10px)';
            setTimeout(() => msg.remove(), 300);
        }
    }, 1700);
}

function updateTitleWithAutoStatus() {
    const titleElement = document.getElementById('sectionTitle');
    if (titleElement) {
        let title = "Đề số " + currentFileName;
        let autoBadge = isAutoNextEnabled ? ' <span class="auto-badge">⚡ AUTO</span>' : '';
        
        if (examMode === 'survival') {
            titleElement.innerHTML = title + ' <span class="survival-badge">💀 1 MẠNG</span>' + autoBadge;
        } else {
            titleElement.innerHTML = title + ' <span class="normal-badge">😊 THƯỜNG</span>' + autoBadge;
        }
    }
}

// --- 5. HIỂN THỊ CÂU HỎI ---
function renderQuestion(index) {
    let questionsToShow = isRetryMode ? filteredQuestions : allQuestions;
    
    if (index < 0 || index >= questionsToShow.length) return;
    currentIndex = index;
    const q = questionsToShow[index];
    let processedText = q.text.replace(/\[IMG:(.*?)\]/g, '<div class="q-image"><img src="$1"></div>');
    
    let qNumberText = `Câu ${index + 1}/${questionsToShow.length}`;
    
    if (questionOrder === 'random') {
        qNumberText += ` (Gốc: ${q.originalIndex + 1})`;
    }
    
    if (isRetryMode) {
        qNumberText += ` | Câu gốc: ${q.originalIndex + 1}`;
    }
    
    const qNumberElement = document.getElementById('qNumber');
    let qNumberHTML = qNumberText;
    
    if (isRetryMode) {
        qNumberHTML += ` <span style="background:#f39c12; color:white; padding:2px 6px; border-radius:8px; font-size:0.8em;">Làm lại lần ${retryCount}</span>`;
    }
    
    qNumberElement.innerHTML = qNumberHTML;
    
    document.getElementById('qText').innerHTML = processedText;
    document.getElementById('btnPrev').disabled = (index === 0);
    document.getElementById('btnNext').disabled = (index === questionsToShow.length - 1);

    const optsArea = document.getElementById('optionsArea');
    optsArea.innerHTML = '';
    
    const isAnswered = isRetryMode ? (q.retrySelected !== null) : (q.userSelected !== null);
    
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'option-item';
        
        const optionText = opt.text;
        let displayText = optionText;
        
        const match = optionText.match(/^([A-D])\.\s*(.*)/);
        
        if (match) {
            const label = match[1];
            const content = match[2];
            displayText = `<span style="font-weight:bold; margin-right:8px; color:#d63031;">${label}.</span> ${content}`;
        } else {
            const label = String.fromCharCode(65 + idx);
            displayText = `<span style="font-weight:bold; margin-right:8px; color:#d63031;">${label}.</span> ${optionText}`;
        }
        
        btn.innerHTML = displayText;
        
        if (isAnswered) {
            btn.style.pointerEvents = 'none';
            
            let statusText = '';
            let statusColor = '';
            
            if (isRetryMode) {
                if (q.retrySelected === idx) {
                    if (opt.isCorrect) {
                        btn.classList.add('correct');
                        statusText = '✓ Làm lại đúng';
                        statusColor = '#00b894';
                    } else {
                        btn.classList.add('wrong');
                        statusText = '✗ Làm lại sai';
                        statusColor = '#d63031';
                    }
                } else if (opt.isCorrect) {
                    btn.classList.add('correct');
                    statusText = '✓ Đáp án đúng';
                    statusColor = '#00b894';
                }
            } else {
                if (q.userSelected === idx) {
                    if (opt.isCorrect) {
                        btn.classList.add('correct');
                        statusText = '✓ Bạn chọn đúng';
                        statusColor = '#00b894';
                    } else {
                        btn.classList.add('wrong');
                        statusText = '✗ Bạn chọn sai';
                        statusColor = '#d63031';
                    }
                } else if (opt.isCorrect) {
                    btn.classList.add('correct');
                    statusText = '✓ Đáp án đúng';
                    statusColor = '#00b894';
                }
            }
            
            if (statusText) {
                btn.innerHTML += ` <span style="color:${statusColor}; margin-left:10px; font-weight:bold;">${statusText}</span>`;
            }
        } else {
            btn.onclick = () => handleAnswer(index, idx);
        }
        
        optsArea.appendChild(btn);
    });
}

function handleAnswer(qIndex, optIndex) {
    if (isSubmitted) return;
    
    // --- 1. XÓA TIMER CŨ (Tránh lỗi click nhanh) ---
    if (autoNextTimer) {
        clearTimeout(autoNextTimer);
        autoNextTimer = null;
    }

    const questionsToShow = isRetryMode ? filteredQuestions : allQuestions;
    const q = questionsToShow[qIndex];
    const selectedOption = q.options[optIndex];
    
    if (isRetryMode) {
        q.retrySelected = optIndex;
        
        if (selectedOption.isCorrect) {
            const wrongIndex = wrongQuestions.findIndex(item => item.index === q.originalIndex);
            if (wrongIndex !== -1) {
                wrongQuestions.splice(wrongIndex, 1);
            }
            showCorrectEffect();
            updateFilteredQuestions();
            
            if (filteredQuestions.length === 0) {
                setTimeout(() => {
                    alert("🎉 Chúc mừng! Bạn đã làm đúng tất cả các câu sai!");
                    finishRetryMode();
                }, 500);
                return;
            } else {
                renderQuestion(qIndex);
            }
        } else {
            showWrongEffect();
            renderQuestion(qIndex);
        }
        
        saveProgress();
    } 
    // CHẾ ĐỘ THƯỜNG / SINH TỬ
    else {
        q.userSelected = optIndex;
        
        if (q.firstAttemptSelected === null) {
            q.firstAttemptSelected = optIndex;
            q.isCorrectFirstTime = selectedOption.isCorrect;
        }
        
        if (examMode === 'survival') {
            if (!selectedOption.isCorrect) {
                showDeathEffect();
                
                setTimeout(() => {
                    performSurvivalReset();
                    renderQuestion(0);
                    saveProgress();
                }, 2000);
                
                return; // Kết thúc luôn, không chạy Auto Next
            } else {
                renderQuestion(qIndex);
                showCorrectEffect();
                saveProgress();
            }
        } else {
            renderQuestion(qIndex);
            if (selectedOption.isCorrect) {
                showCorrectEffect();
            } else {
                showWrongEffect();
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
        autoNextTimer = setTimeout(() => {
            // Kiểm tra lại lần nữa index (vì có thể user đã bấm nút Next thủ công)
            if (currentIndex < questionsToShow.length - 1) {
                changeQuestion(1);
            }
        }, 500); // 2 giây
    }
}

// Kết thúc chế độ làm lại câu sai
function finishRetryMode() {
    isRetryMode = false;
    isSubmitted = true;
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
    }
    
    currentIndex = 0;
    isSurvivalFailed = false;
    
    alert("🔄 Đã reset! Bắt đầu làm lại từ đầu!");
}

function showDeathEffect() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const deathMessage = document.createElement('div');
    deathMessage.style.cssText = `
        background: linear-gradient(135deg, #d63031, #e17055);
        color: white;
        padding: 30px 40px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 1.5em;
        text-align: center;
        z-index: 9999;
        animation: deathPulse 0.5s infinite alternate;
        box-shadow: 0 15px 40px rgba(0,0,0,0.5);
        max-width: 80%;
    `;
    
    deathMessage.innerHTML = '💀 SAI RỒI!<br>LÀM LẠI TỪ ĐẦU!';
    
    overlay.appendChild(deathMessage);
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.remove();
    }, 2000);
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

function changeQuestion(step) { 
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
    if(!confirm("Bạn có chắc muốn xóa toàn bộ kết quả và làm lại từ đầu không?")) return;
    
    performFullReset();
}

function performFullReset() {
    localStorage.removeItem('quiz_data_' + currentFileName);
    
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
    filteredQuestions = [];
    wrongQuestions = [];
    retryCount = 0;
    firstAttemptScore = 0;
    isSurvivalFailed = false;
    totalSeconds = 0;
    currentIndex = 0;
    isSubmitted = false;
    isAutoNextEnabled = false;
    
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

function finishExam() {
    if (isSubmitted) { 
        showResultModal(); 
        return; 
    }
    
    const answeredCount = allQuestions.filter(q => q.userSelected !== null).length;
    const totalQuestions = allQuestions.length;
    
    if (answeredCount < totalQuestions) {
        if (!confirm(`Bạn mới trả lời ${answeredCount}/${totalQuestions} câu. Bạn có chắc muốn nộp bài không?`)) {
            return;
        }
    } else {
        if (!confirm("Bạn muốn nộp bài để xem tổng kết điểm chứ?")) return;
    }

    isSubmitted = true;
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
                index: index, 
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
    
    totalSeconds = 0;
    startTimer();
}

// Cập nhật filteredQuestions (chỉ câu sai chưa làm đúng)
function updateFilteredQuestions() {
    filteredQuestions = allQuestions.filter(q => 
        !q.isCorrectFirstTime && 
        q.firstAttemptSelected !== null && 
        q.retrySelected === null  // Chỉ lấy câu chưa làm lại đúng
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

    document.getElementById('resScore').innerHTML = `<span style="font-size:1em">${correct}</span><span style="font-size:0.6em; color:#636e72">/${allQuestions.length}</span>`;
    document.getElementById('resRight').innerText = correct;
    document.getElementById('resWrong').innerText = wrong;
    document.getElementById('resSkip').innerText = skip;
    document.getElementById('resTime').innerText = `Tổng thời gian: ${mins} phút ${secs} giây`;
    
    const modeInfo = document.createElement('div');
    modeInfo.style.cssText = `
        margin-bottom: 15px;
        padding: 12px;
        background: #e3f2fd;
        border-radius: 10px;
        font-size: 0.9em;
        text-align: center;
        border: 2px solid #2196f3;
    `;
    
    let modeText = `<div style="font-weight:bold; margin-bottom:5px;">📊 THÔNG TIN KẾT QUẢ</div>`;
    modeText += `<div>🎮 Chế độ: <strong>${examMode === 'survival' ? '💀 Sinh tử' : '😊 Thường'}</strong></div>`;
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
    
    const resultBox = document.querySelector('.result-box');
    const timeElement = document.getElementById('resTime');
    resultBox.insertBefore(modeInfo, timeElement);
    
    const oldRetryButton = resultBox.querySelector('.retry-button');
    if (oldRetryButton) {
        oldRetryButton.remove();
    }
    
    if (examMode === 'normal' && wrong > 0 && !isRetryMode) {
        const retryButton = document.createElement('button');
        retryButton.className = 'btn-close-res retry-button';
        retryButton.style.background = '#f39c12';
        retryButton.style.marginTop = '10px';
        retryButton.style.width = '100%';
        retryButton.innerText = '🔄 Làm lại câu sai';
        retryButton.onclick = function() {
            closeResult();
            setTimeout(() => {
                startRetryMode();
            }, 300);
        };
        
        const buttonContainer = resultBox.querySelector('div[style*="display:flex; gap:10px"]');
        if (buttonContainer) {
            buttonContainer.parentNode.insertBefore(retryButton, buttonContainer.nextSibling);
        }
    }
    
    document.getElementById('modalResult').style.display = 'flex';
}

// --- 7. LƯU & TẢI TIẾN ĐỘ ---
function saveProgress() {
    if(allQuestions.length === 0) return;
    
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
}

function loadProgress() {
    const saved = localStorage.getItem('quiz_data_' + currentFileName);
    if (saved) {
        const data = JSON.parse(saved);
        isSubmitted = data.isSubmitted || false;
        totalSeconds = data.totalSeconds || 0;
        examMode = data.examMode || examMode;
        questionOrder = data.questionOrder || questionOrder;
        isSurvivalFailed = data.isSurvivalFailed || false;
        isRetryMode = data.isRetryMode || false;
        retryCount = data.retryCount || 0;
        firstAttemptScore = data.firstAttemptScore || 0;
        
        if (data.autoNext !== undefined) isAutoNextEnabled = data.autoNext;
        
        if (data.wrongQuestions) {
            wrongQuestions = data.wrongQuestions.map(index => ({
                index,
                question: allQuestions[index]
            }));
        }
        
        if (examMode === 'survival' && isSurvivalFailed && !isSubmitted) {
            performSurvivalReset();
        }
        
        updateTimerDisplay();
        
        if (data.history) {
            data.history.forEach((h, i) => {
                if (allQuestions[i]) {
                    allQuestions[i].userSelected = h.userSelected;
                    allQuestions[i].firstAttemptSelected = h.firstAttemptSelected;
                    allQuestions[i].isCorrectFirstTime = h.isCorrectFirstTime;
                    allQuestions[i].retrySelected = h.retrySelected;
                    allQuestions[i].isRetryMode = h.isRetryMode;
                    allQuestions[i].originalIndex = h.originalIndex || i;
                    allQuestions[i].shuffledOptionIndices = h.shuffledOptionIndices;
                    
                    if (h.shuffledOptionIndices && questionOrder === 'random') {
                        const newOptions = h.shuffledOptionIndices.map(idx => allQuestions[i].options[idx]);
                        allQuestions[i].options = newOptions;
                    }
                }
            });
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
}

// --- 8. MODAL DANH SÁCH ---
function toggleModal() {
    const modal = document.getElementById('modalList');
    if (modal.style.display === 'flex') { 
        modal.style.display = 'none'; 
    } else {
        const grid = document.getElementById('gridMap');
        grid.innerHTML = '';
        
        const questionsToShow = isRetryMode ? filteredQuestions : allQuestions;
        
        questionsToShow.forEach((q, idx) => {
            const div = document.createElement('div');
            div.className = 'grid-item'; 
            div.innerText = idx + 1;
            
            if (questionOrder === 'random') {
                div.title = `Câu gốc: ${q.originalIndex + 1}`;
            }
            
            if(idx === currentIndex) div.classList.add('current');
            
            if (isRetryMode) {
                if (q.retrySelected !== null) {
                    div.classList.add(q.options[q.retrySelected]?.isCorrect ? 'done-correct' : 'done-wrong');
                }
            } else {
                if (q.userSelected !== null) {
                    if (q.options[q.userSelected]?.isCorrect) div.classList.add('done-correct');
                    else div.classList.add('done-wrong');
                }
            }
            
            div.onclick = () => { 
                renderQuestion(idx); 
                modal.style.display = 'none'; 
            };
            grid.appendChild(div);
        });
        modal.style.display = 'flex';
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
`;
document.head.appendChild(style);

// --- 10. ĐIỀU KHIỂN BÀN PHÍM ---
document.addEventListener('keydown', (event) => {
    const modalList = document.getElementById('modalList');
    const modalResult = document.getElementById('modalResult');
    if ((modalList && modalList.style.display === 'flex') || 
        (modalResult && modalResult.style.display === 'flex')) {
        return;
    }

    if (event.key === 'ArrowRight') {
        changeQuestion(1);
    } else if (event.key === 'ArrowLeft') {
        changeQuestion(-1);
    }
});

// --- 11. HÀM ĐÓNG KẾT QUẢ ---
function closeResult() {
    document.getElementById('modalResult').style.display = 'none';
}