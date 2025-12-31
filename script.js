/* =============================================================
   FILE: script.js 
   PHIÊN BẢN: HOÀN CHỈNH - TÍCH HỢP RESUME/LÀM MỚI
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

// --- 1. TẢI ĐỀ THI ---
function loadExam(fileName) {
    currentFileName = fileName;
    const params = new URLSearchParams(window.location.search);
    
    // Ưu tiên chế độ từ URL, nếu không có thì từ localStorage
    examMode = params.get('mode') || 'normal';
    questionOrder = params.get('order') || 'normal';
    
    // Nếu URL không có mode/order, thử lấy từ localStorage
    if (!params.get('mode')) {
        const savedMode = localStorage.getItem('exam_mode_' + fileName);
        if (savedMode) {
            const modeData = JSON.parse(savedMode);
            examMode = modeData.mode;
            questionOrder = modeData.order;
        }
    }
    
    let title = "Đề số " + fileName;
    const titleElement = document.getElementById('sectionTitle');
    if (examMode === 'survival') {
        titleElement.innerHTML = title + ' <span class="survival-badge">💀 1 MẠNG</span>';
    } else {
        titleElement.innerHTML = title + ' <span class="normal-badge">😊 THƯỜNG</span>';
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
            
            // Áp dụng thứ tự câu hỏi
            if (questionOrder === 'random') {
                shuffleQuestions();
                // Lưu lại bản gốc
                originalQuestions = JSON.parse(JSON.stringify(allQuestions));
            }
            
            // Load tiến độ từ localStorage
            loadProgress(); 
            
            if (!isSubmitted) {
                startTimer();
            }
        })
        .catch(err => alert("Lỗi đọc file! Hãy chắc chắn bạn đang chạy Live Server."));
}

// --- 2. CÁC HÀM TIỆN ÍCH ---
function shuffleQuestions() {
    for (let i = allQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
        // Cập nhật originalIndex để theo dõi
        if (!allQuestions[i].originalIndex) allQuestions[i].originalIndex = i;
        if (!allQuestions[j].originalIndex) allQuestions[j].originalIndex = j;
    }
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
                originalIndex: allQuestions.length
            };
        } else if (optRegex.test(line) && currentQ) {
            let isCorrect = line.startsWith('*');
            currentQ.options.push({ 
                text: line.replace(/^\*/, '').trim(), 
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

// --- 4. HIỂN THỊ CÂU HỎI ---
function renderQuestion(index) {
    if (index < 0 || index >= allQuestions.length) return;
    currentIndex = index;
    const q = allQuestions[index];
    let processedText = q.text.replace(/\[IMG:(.*?)\]/g, '<div class="q-image"><img src="$1"></div>');
    
    let qNumberText = `Câu ${index + 1}/${allQuestions.length}`;
    if (questionOrder === 'random') {
        qNumberText += ` (Gốc: ${q.originalIndex + 1})`;
    }
    
    document.getElementById('qNumber').innerText = qNumberText;
    document.getElementById('qText').innerHTML = processedText;
    document.getElementById('btnPrev').disabled = (index === 0);
    document.getElementById('btnNext').disabled = (index === allQuestions.length - 1);

    const optsArea = document.getElementById('optionsArea');
    optsArea.innerHTML = '';
    
    // Kiểm tra đã trả lời chưa
    const isAnswered = (q.userSelected !== null);
    
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'option-item';
        btn.innerText = opt.text;
        
        if (isAnswered) {
            btn.style.pointerEvents = 'none';
            if (opt.isCorrect) {
                btn.classList.add('correct');
            }
            if (q.userSelected === idx && !opt.isCorrect) {
                btn.classList.add('wrong');
            }
        } else {
            btn.onclick = () => handleAnswer(index, idx);
        }
        optsArea.appendChild(btn);
    });
}

function handleAnswer(qIndex, optIndex) {
    if (isSubmitted) return;
    
    const q = allQuestions[qIndex];
    const selectedOption = q.options[optIndex];
    
    // Ghi nhận lựa chọn
    q.userSelected = optIndex;
    
    if (examMode === 'survival') {
        if (!selectedOption.isCorrect) {
            // SAI -> LÀM LẠI TỪ ĐẦU
            showDeathEffect();
            
            // Reset tất cả câu hỏi
            setTimeout(() => {
                performSurvivalReset();
                renderQuestion(0);
                saveProgress();
            }, 2000);
            
        } else {
            // ĐÚNG -> tiếp tục
            renderQuestion(qIndex);
            showCorrectEffect();
            saveProgress();
        }
    } else {
        // Chế độ thường
        renderQuestion(qIndex);
        if (selectedOption.isCorrect) {
            showCorrectEffect();
        } else {
            showWrongEffect();
        }
        saveProgress();
    }
}

function performSurvivalReset() {
    // Reset tất cả câu hỏi
    allQuestions.forEach(question => {
        question.userSelected = null;
    });
    
    // Reset về bản gốc (nếu có)
    if (originalQuestions.length > 0) {
        allQuestions = JSON.parse(JSON.stringify(originalQuestions));
    }
    
    // Đảo lộn lại nếu cần
    if (questionOrder === 'random') {
        shuffleQuestions();
    }
    
    // Reset về câu 1
    currentIndex = 0;
    isSurvivalFailed = false;
    
    // Thông báo đã reset
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
    const newIndex = currentIndex + step;
    if (newIndex >= 0 && newIndex < allQuestions.length) {
        renderQuestion(newIndex);
    }
}

// --- 5. LÀM LẠI & NỘP BÀI ---
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
        });
    }
    
    isSurvivalFailed = false;
    totalSeconds = 0;
    currentIndex = 0;
    isSubmitted = false;
    
    if (questionOrder === 'random') {
        shuffleQuestions();
    }
    
    renderQuestion(0);
    startTimer();
    updateTimerDisplay();
}

function finishExam() {
    if (isSubmitted) { 
        showResultModal(); 
        return; 
    } 
    
    if (!confirm("Bạn muốn nộp bài để xem tổng kết điểm chứ?")) return;

    isSubmitted = true;
    clearInterval(timerInterval);
    saveProgress(); 
    showResultModal();
}

function showResultModal() {
    let correct = 0, wrong = 0, skip = 0;
    allQuestions.forEach(q => {
        if (q.userSelected === null) skip++;
        else if (q.options[q.userSelected].isCorrect) correct++;
        else wrong++;
    });

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    document.getElementById('resScore').innerText = correct + "/" + allQuestions.length;
    document.getElementById('resRight').innerText = correct;
    document.getElementById('resWrong').innerText = wrong;
    document.getElementById('resSkip').innerText = skip;
    document.getElementById('resTime').innerText = `Tổng thời gian: ${mins} phút ${secs} giây`;
    
    // Hiển thị thông tin chế độ
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
    
    let modeText = `<div style="font-weight:bold; margin-bottom:5px;">📊 THÔNG TIN CHẾ ĐỘ</div>`;
    modeText += `<div>🎮 Chế độ: <strong>${examMode === 'survival' ? '💀 Sinh tử' : '😊 Thường'}</strong></div>`;
    modeText += `<div>🔀 Thứ tự: <strong>${questionOrder === 'random' ? 'Đảo lộn' : 'Nguyên bản'}</strong></div>`;
    
    modeInfo.innerHTML = modeText;
    
    const resultBox = document.querySelector('.result-box');
    const timeElement = document.getElementById('resTime');
    resultBox.insertBefore(modeInfo, timeElement);
    
    document.getElementById('modalResult').style.display = 'flex';
}

// --- 6. LƯU & TẢI TIẾN ĐỘ ---
function saveProgress() {
    if(allQuestions.length === 0) return;
    let tempScore = 0;
    allQuestions.forEach(q => {
        if (q.userSelected !== null && q.options[q.userSelected].isCorrect) tempScore++;
    });

    const data = { 
        currentIndex: currentIndex, 
        score: tempScore, 
        isSubmitted: isSubmitted,
        totalSeconds: totalSeconds,
        examMode: examMode,
        questionOrder: questionOrder,
        isSurvivalFailed: isSurvivalFailed,
        history: allQuestions.map(q => ({ 
            userSelected: q.userSelected,
            originalIndex: q.originalIndex 
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
        
        // Nếu đang ở chế độ sinh tử và đã sai, reset để làm lại
        if (examMode === 'survival' && isSurvivalFailed && !isSubmitted) {
            performSurvivalReset();
        }
        
        updateTimerDisplay();
        
        if (data.history) {
            data.history.forEach((h, i) => {
                if (allQuestions[i]) {
                    allQuestions[i].userSelected = h.userSelected;
                    allQuestions[i].originalIndex = h.originalIndex || i;
                }
            });
        }
        renderQuestion(data.currentIndex || 0);
    } else {
        renderQuestion(0);
    }
}

// --- 7. MODAL DANH SÁCH ---
function toggleModal() {
    const modal = document.getElementById('modalList');
    if (modal.style.display === 'flex') { 
        modal.style.display = 'none'; 
    } else {
        const grid = document.getElementById('gridMap');
        grid.innerHTML = '';
        allQuestions.forEach((q, idx) => {
            const div = document.createElement('div');
            div.className = 'grid-item'; 
            div.innerText = idx + 1;
            
            if (questionOrder === 'random') {
                div.title = `Câu gốc: ${q.originalIndex + 1}`;
            }
            
            if(idx === currentIndex) div.classList.add('current');
            if (q.userSelected !== null) {
                if (q.options[q.userSelected].isCorrect) div.classList.add('done-correct');
                else div.classList.add('done-wrong');
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

// --- 8. ANIMATIONS CSS ---
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
    
    @keyframes pulse-badge {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;

document.head.appendChild(style);
// Thêm sự kiện điều khiển bằng bàn phím
document.addEventListener('keydown', (event) => {
    // Nếu đang mở Modal (danh sách câu hỏi hoặc kết quả) thì không thực hiện
    const modalList = document.getElementById('modalList');
    const modalResult = document.getElementById('modalResult');
    if ((modalList && modalList.style.display === 'flex') || 
        (modalResult && modalResult.style.display === 'flex')) {
        return;
    }

    if (event.key === 'ArrowRight') {
        // Phím mũi tên sang phải -> Câu tiếp theo
        changeQuestion(1);
    } else if (event.key === 'ArrowLeft') {
        // Phím mũi tên sang trái -> Câu trước đó
        changeQuestion(-1);
    }
});
