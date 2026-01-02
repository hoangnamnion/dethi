/* =============================================================
   FILE: script.js 
   PHIÊN BẢN: HOÀN CHỈNH - TÍCH HỢP RESUME/LÀM MỚI + CHẾ ĐỘ LÀM LẠI CÂU SAI
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
let firstAttemptScore = 0; // Điểm lần đầu tiên
let retryCount = 0; // Số lần làm lại
let wrongQuestions = []; // Danh sách câu sai cần làm lại
let isRetryMode = false; // Đang ở chế độ làm lại câu sai

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
    
    // SỬA: Dùng innerHTML để hiển thị badge đúng cách
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
            
            // Áp dụng thứ tự câu hỏi và đảo đáp án nếu cần
            if (questionOrder === 'random') {
                shuffleQuestions();
                shuffleOptions(); // Thêm: Đảo đáp án
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

// Hàm mới: Đảo thứ tự đáp án
function shuffleOptions() {
    allQuestions.forEach((question, questionIndex) => {
        // Tạo mảng chỉ số của các đáp án
        const optionIndices = question.options.map((_, idx) => idx);
        
        // Trộn mảng chỉ số
        for (let i = optionIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionIndices[i], optionIndices[j]] = [optionIndices[j], optionIndices[i]];
        }
        
        // Áp dụng thứ tự mới cho options
        const newOptions = optionIndices.map(idx => question.options[idx]);
        
        // Cập nhật lại đáp án đúng (theo thứ tự mới)
        const correctIndexInOriginal = question.options.findIndex(opt => opt.isCorrect);
        const newCorrectIndex = optionIndices.indexOf(correctIndexInOriginal);
        
        // Cập nhật lại đáp án đã chọn của người dùng (nếu có)
        if (question.userSelected !== null) {
            // Tìm vị trí mới của đáp án đã chọn
            question.userSelected = optionIndices.indexOf(question.userSelected);
        }
        
        // Cập nhật câu hỏi
        allQuestions[questionIndex].options = newOptions;
        
        // Lưu lại thông tin về thứ tự đảo để có thể khôi phục
        allQuestions[questionIndex].shuffledOptionIndices = optionIndices;
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
                firstAttemptSelected: null, // Lưu lựa chọn lần đầu
                isCorrectFirstTime: null, // Đúng/sai lần đầu
                retrySelected: null, // Lựa chọn khi làm lại (chế độ làm lại câu sai)
                isRetryMode: false // Đang ở chế độ làm lại
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
    
    // SỬA LẠI PHẦN NÀY: Dùng innerHTML thay vì innerText
    const qNumberElement = document.getElementById('qNumber');
    
    // Xây dựng nội dung HTML
    let qNumberHTML = `Câu ${index + 1}/${allQuestions.length}`;
    
    if (questionOrder === 'random') {
        qNumberHTML += ` <span style="color:#636e72; font-size:0.8em;">(Gốc: ${q.originalIndex + 1})</span>`;
    }
    
    // Hiển thị trạng thái làm lại nếu đang ở chế độ làm lại câu sai
    if (isRetryMode && q.isRetryMode) {
        qNumberHTML += ` <span style="background:#f39c12; color:white; padding:2px 6px; border-radius:8px; font-size:0.8em;">Làm lại</span>`;
    }
    
    // Sử dụng innerHTML để hiển thị đúng HTML
    qNumberElement.innerHTML = qNumberHTML;
    
    document.getElementById('qText').innerHTML = processedText;
    document.getElementById('btnPrev').disabled = (index === 0);
    document.getElementById('btnNext').disabled = (index === allQuestions.length - 1);

    const optsArea = document.getElementById('optionsArea');
    optsArea.innerHTML = '';
    
    // Kiểm tra đã trả lời chưa
    const isAnswered = (q.userSelected !== null);
    
// Trong hàm renderQuestion, sửa phần hiển thị đáp án:
q.options.forEach((opt, idx) => {
    const btn = document.createElement('div');
    btn.className = 'option-item';
    
    // Hiển thị đáp án với định dạng đẹp
    const optionText = opt.text;
    btn.innerHTML = `<span style="font-weight:bold; margin-right:8px; color:#d63031;">${String.fromCharCode(65 + idx)}.</span> ${optionText.replace(/^[A-D]\.\s*/, '')}`;
    
    if (isAnswered) {
        btn.style.pointerEvents = 'none';
        
        // Hiển thị màu sắc tùy theo trạng thái
        if (isRetryMode && q.isRetryMode) {
            // Trong chế độ làm lại, chỉ hiển thị đáp án đúng
            if (opt.isCorrect) {
                btn.classList.add('correct');
            }
            if (q.retrySelected === idx) {
                // Đáp án người dùng chọn trong lần làm lại
                btn.classList.add(opt.isCorrect ? 'correct' : 'wrong');
            }
        } else {
            // Chế độ bình thường
            if (opt.isCorrect) {
                btn.classList.add('correct');
            }
            if (q.userSelected === idx && !opt.isCorrect) {
                btn.classList.add('wrong');
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
    
    const q = allQuestions[qIndex];
    const selectedOption = q.options[optIndex];
    
    if (isRetryMode && q.isRetryMode) {
        // Trong chế độ làm lại câu sai
        q.retrySelected = optIndex;
        q.userSelected = optIndex; // Cập nhật cho đồng bộ
        
        if (selectedOption.isCorrect) {
            // Đúng -> xóa khỏi danh sách cần làm lại
            const wrongIndex = wrongQuestions.findIndex(item => item.index === qIndex);
            if (wrongIndex !== -1) {
                wrongQuestions.splice(wrongIndex, 1);
            }
            showCorrectEffect();
            
            // Kiểm tra còn câu nào sai không
            if (wrongQuestions.length === 0) {
                // Đã làm đúng hết -> nộp bài
                setTimeout(() => {
                    alert("🎉 Chúc mừng! Bạn đã làm đúng tất cả các câu sai!");
                    finishRetryMode();
                }, 500);
            }
        } else {
            // Sai -> vẫn giữ trong danh sách
            showWrongEffect();
        }
        
        renderQuestion(qIndex);
        saveProgress();
        return;
    }
    
    // Chế độ bình thường hoặc sinh tử
    q.userSelected = optIndex;
    
    // Lưu lựa chọn lần đầu và kết quả
    if (q.firstAttemptSelected === null) {
        q.firstAttemptSelected = optIndex;
        q.isCorrectFirstTime = selectedOption.isCorrect;
    }
    
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

// Kết thúc chế độ làm lại câu sai
function finishRetryMode() {
    isRetryMode = false;
    isSubmitted = true;
    clearInterval(timerInterval);
    saveProgress();
    showResultModal();
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
        shuffleOptions();
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
            q.firstAttemptSelected = null;
            q.isCorrectFirstTime = null;
            q.retrySelected = null;
            q.isRetryMode = false;
        });
    }
    
    isRetryMode = false;
    wrongQuestions = [];
    retryCount = 0;
    firstAttemptScore = 0;
    isSurvivalFailed = false;
    totalSeconds = 0;
    currentIndex = 0;
    isSubmitted = false;
    
    if (questionOrder === 'random') {
        shuffleQuestions();
        shuffleOptions();
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
    
    // Tính toán kết quả lần đầu
    let correct = 0, wrong = 0, skip = 0;
    allQuestions.forEach(q => {
        if (q.firstAttemptSelected === null) skip++;
        else if (q.isCorrectFirstTime) correct++;
        else wrong++;
    });
    
    firstAttemptScore = correct;
    
    // Nếu chế độ thường và có câu sai, hỏi có muốn làm lại không
    if (examMode === 'normal' && wrong > 0) {
        setTimeout(() => {
            if (confirm(`Bạn có ${wrong} câu sai. Bạn có muốn làm lại các câu sai này cho đến khi đúng hết không?`)) {
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
    isSubmitted = false;
    isRetryMode = true;
    retryCount++;
    
    // Tìm các câu sai
    wrongQuestions = [];
    allQuestions.forEach((q, index) => {
        if (!q.isCorrectFirstTime && q.firstAttemptSelected !== null) {
            q.isRetryMode = true;
            q.userSelected = null; // Reset để làm lại
            q.retrySelected = null;
            wrongQuestions.push({ index, question: q });
        } else {
            q.isRetryMode = false;
        }
    });
    
    // Nếu không có câu sai nào (trường hợp hiếm)
    if (wrongQuestions.length === 0) {
        isSubmitted = true;
        showResultModal();
        return;
    }
    
    // Hiển thị thông báo
    alert(`📝 BẮT ĐẦU LÀM LẠI ${wrongQuestions.length} CÂU SAI\nLàm đúng hết để hoàn thành!`);
    
    // Chuyển đến câu sai đầu tiên
    if (wrongQuestions.length > 0) {
        currentIndex = wrongQuestions[0].index;
        renderQuestion(currentIndex);
    }
    
    // SỬA: Cập nhật tiêu đề (dùng innerHTML)
    document.getElementById('sectionTitle').innerHTML = 
        `Đề số ${currentFileName} <span class="normal-badge" style="background:#f39c12">🔄 LÀM LẠI LẦN ${retryCount}</span>`;
    
    // Bắt đầu lại timer
    startTimer();
}

function showResultModal() {
    let correct = 0, wrong = 0, skip = 0;
    
    if (isRetryMode) {
        // Trong chế độ làm lại, tính theo lần đầu
        allQuestions.forEach(q => {
            if (q.firstAttemptSelected === null) skip++;
            else if (q.isCorrectFirstTime) correct++;
            else wrong++;
        });
    } else {
        // Tính theo lần làm hiện tại
        allQuestions.forEach(q => {
            const selected = isRetryMode ? q.retrySelected : q.userSelected;
            if (selected === null) skip++;
            else if (q.options[selected]?.isCorrect) correct++;
            else wrong++;
        });
    }

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    // SỬA: Dùng innerHTML cho phần điểm số
    document.getElementById('resScore').innerHTML = `<span style="font-size:1em">${correct}</span><span style="font-size:0.6em; color:#636e72">/${allQuestions.length}</span>`;
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
    
    // Hiển thị điểm lần đầu và số lần làm lại nếu có
    if (examMode === 'normal' && firstAttemptScore > 0) {
        modeText += `<div>🏆 Điểm lần đầu: <strong>${firstAttemptScore}/${allQuestions.length}</strong></div>`;
    }
    
    if (retryCount > 0) {
        modeText += `<div>🔄 Số lần làm lại: <strong>${retryCount}</strong></div>`;
    }
    
    modeInfo.innerHTML = modeText;
    
    const resultBox = document.querySelector('.result-box');
    const timeElement = document.getElementById('resTime');
    resultBox.insertBefore(modeInfo, timeElement);
    
    // Thêm nút làm lại câu sai nếu chưa ở chế độ làm lại
    if (examMode === 'normal' && wrong > 0 && !isRetryMode) {
        const retryButton = document.createElement('button');
        retryButton.className = 'btn-close-res';
        retryButton.style.background = '#f39c12';
        retryButton.style.marginTop = '10px';
        retryButton.style.width = '100%';
        retryButton.innerText = '🔄 Làm lại câu sai';
        retryButton.onclick = function() {
            closeResult();
            setTimeout(() => {
                isSubmitted = false;
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

// --- 6. LƯU & TẢI TIẾN ĐỘ ---
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
        
        // Khôi phục danh sách câu sai
        if (data.wrongQuestions) {
            wrongQuestions = data.wrongQuestions.map(index => ({
                index,
                question: allQuestions[index]
            }));
        }
        
        // Nếu đang ở chế độ sinh tử và đã sai, reset để làm lại
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
                    
                    // Nếu có thông tin đảo đáp án, áp dụng lại
                    if (h.shuffledOptionIndices && questionOrder === 'random') {
                        // Tạo options mới theo thứ tự đã đảo
                        const newOptions = h.shuffledOptionIndices.map(idx => allQuestions[i].options[idx]);
                        allQuestions[i].options = newOptions;
                    }
                }
            });
        }
        renderQuestion(data.currentIndex || 0);
        
        // SỬA: Cập nhật tiêu đề nếu đang ở chế độ làm lại (dùng innerHTML)
        if (isRetryMode) {
            document.getElementById('sectionTitle').innerHTML = 
                `Đề số ${currentFileName} <span class="normal-badge" style="background:#f39c12">🔄 LÀM LẠI LẦN ${retryCount}</span>`;
        }
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
            
            // Xác định trạng thái hiển thị
            if (isRetryMode && q.isRetryMode) {
                // Trong chế độ làm lại
                if (q.retrySelected !== null) {
                    div.classList.add(q.options[q.retrySelected]?.isCorrect ? 'done-correct' : 'done-wrong');
                }
            } else {
                // Chế độ bình thường
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
    
    /* Thêm style cho chế độ làm lại */
    .retry-badge {
        display: inline-block;
        background: #f39c12;
        color: white;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.7em;
        font-weight: bold;
        margin-left: 5px;
        animation: pulse-badge 1.5s infinite;
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
// Hàm mới: Đảo thứ tự đáp án nhưng giữ nhãn A, B, C, D
function shuffleOptions() {
    allQuestions.forEach((question, questionIndex) => {
        // Tạo mảng chỉ số của các đáp án
        const optionIndices = question.options.map((_, idx) => idx);
        
        // Trộn mảng chỉ số
        for (let i = optionIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [optionIndices[i], optionIndices[j]] = [optionIndices[j], optionIndices[i]];
        }
        
        // Tạo options mới theo thứ tự đã đảo
        const shuffledOptions = optionIndices.map(idx => ({
            text: question.options[idx].text,
            isCorrect: question.options[idx].isCorrect
        }));
        
        // Thêm nhãn A, B, C, D vào đầu mỗi đáp án
        const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F']; // Có thể mở rộng nếu cần
        shuffledOptions.forEach((opt, idx) => {
            // Chỉ thêm nhãn nếu chưa có
            if (!opt.text.startsWith(optionLabels[idx] + '.')) {
                opt.text = optionLabels[idx] + '. ' + opt.text;
            }
        });
        
        // Cập nhật lại đáp án đúng (theo thứ tự mới)
        const correctIndexInOriginal = question.options.findIndex(opt => opt.isCorrect);
        const newCorrectIndex = optionIndices.indexOf(correctIndexInOriginal);
        
        // Cập nhật lại đáp án đã chọn của người dùng (nếu có)
        if (question.userSelected !== null) {
            // Tìm vị trí mới của đáp án đã chọn
            question.userSelected = optionIndices.indexOf(question.userSelected);
        }
        
        // Cập nhật câu hỏi
        allQuestions[questionIndex].options = shuffledOptions;
        
        // Lưu lại thông tin về thứ tự đảo để có thể khôi phục
        allQuestions[questionIndex].shuffledOptionIndices = optionIndices;
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
                firstAttemptSelected: null, // Lưu lựa chọn lần đầu
                isCorrectFirstTime: null, // Đúng/sai lần đầu
                retrySelected: null, // Lựa chọn khi làm lại (chế độ làm lại câu sai)
                isRetryMode: false // Đang ở chế độ làm lại
            };
        } else if (optRegex.test(line) && currentQ) {
            let isCorrect = line.startsWith('*');
            // Lưu đáp án kèm nhãn A, B, C, D
            const label = line.match(/^(\*)?([A-D])\./)[2];
            const textWithoutLabel = line.replace(/^(\*)?[A-D]\.\s*/, '').trim();
            currentQ.options.push({ 
                text: `${label}. ${textWithoutLabel}`, // Đảm bảo có nhãn
                isCorrect: isCorrect,
                originalLabel: label // Lưu nhãn gốc
            });
        } else {
            if (currentQ && currentQ.options.length === 0) {
                currentQ.text += " " + line;
            }
        }
    });
    if (currentQ) allQuestions.push(currentQ);
}
// Thêm vào phần biến toàn cục
let autoSubmitTimeout = null;

// Hàm kiểm tra xem đã trả lời hết câu chưa
function checkAllAnswered() {
    // Trong chế độ làm lại câu sai, chỉ kiểm tra các câu đang làm lại
    if (isRetryMode) {
        const allRetryAnswered = wrongQuestions.every(item => 
            allQuestions[item.index].retrySelected !== null
        );
        return allRetryAnswered;
    }
    
    // Chế độ bình thường: kiểm tra tất cả câu
    const allAnswered = allQuestions.every(q => q.userSelected !== null);
    return allAnswered;
}

// Hàm kích hoạt tự động nộp bài
function activateAutoSubmit() {
    // Hủy timeout cũ nếu có
    if (autoSubmitTimeout) {
        clearTimeout(autoSubmitTimeout);
    }
    
    // Kiểm tra xem đã trả lời hết chưa
    if (checkAllAnswered() && !isSubmitted) {
        // Tự động nộp bài sau 2 giây
        autoSubmitTimeout = setTimeout(() => {
            if (confirm("🎉 Bạn đã hoàn thành tất cả câu hỏi! Tự động nộp bài sau 2 giây...\n\nNhấn OK để nộp bài ngay, hoặc Cancel để hủy tự động nộp.")) {
                finishExam();
            } else {
                // Nếu hủy, hiển thị nút nộp bài rõ ràng hơn
                const submitBtn = document.querySelector('.submit-btn');
                if (submitBtn) {
                    submitBtn.style.animation = 'pulse-red 1s infinite';
                    submitBtn.innerHTML = '✨ NỘP BÀI NGAY';
                    
                    // Thêm thông báo
                    const timerElement = document.getElementById('timer');
                    if (timerElement) {
                        timerElement.innerHTML += ' <span style="color:#d63031">⏰ Chưa nộp</span>';
                    }
                }
            }
        }, 2000);
        
        // Hiển thị thông báo đếm ngược
        showAutoSubmitCountdown();
    }
}

// Hiển thị đếm ngược tự động nộp bài
function showAutoSubmitCountdown() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    
    // Thêm thông báo đếm ngược
    let countdown = 2;
    const originalText = timerElement.innerHTML;
    
    const countdownInterval = setInterval(() => {
        if (!checkAllAnswered() || isSubmitted) {
            clearInterval(countdownInterval);
            timerElement.innerHTML = originalText;
            return;
        }
        
        timerElement.innerHTML = `⏰ Tự động nộp sau: ${countdown}s | ` + originalText;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(countdownInterval);
            timerElement.innerHTML = originalText;
        }
    }, 1000);
}

// Hàm kiểm tra và cập nhật trạng thái nút nộp bài
function updateSubmitButtonState() {
    const submitBtn = document.querySelector('.submit-btn');
    if (!submitBtn) return;
    
    if (checkAllAnswered() && !isSubmitted) {
        // Đã trả lời hết -> nút sáng và có hiệu ứng
        submitBtn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
        submitBtn.style.boxShadow = '0 0 20px rgba(0, 184, 148, 0.5)';
        submitBtn.innerHTML = '🎯 NỘP BÀI NGAY';
        
        // Kích hoạt tự động nộp
        activateAutoSubmit();
    } else {
        // Chưa trả lời hết -> nút bình thường
        submitBtn.style.background = 'linear-gradient(135deg, #d63031, #e17055)';
        submitBtn.style.boxShadow = '0 4px 10px rgba(0, 184, 148, 0.3)';
        submitBtn.innerHTML = '✨ Nộp bài';
    }
}