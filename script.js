/* =============================================================
   FILE: script.js 
   PHIÊN BẢN: ĐẾM GIỜ + INSTANT FEEDBACK
   ============================================================= */

let allQuestions = [];
let currentIndex = 0;
let currentFileName = ''; 
let isSubmitted = false; 

// Biến quản lý thời gian
let totalSeconds = 0;
let timerInterval;

// --- 1. TẢI ĐỀ THI ---
function loadExam(fileName) {
    currentFileName = fileName;
    document.getElementById('sectionTitle').innerText = "Đề số " + fileName;

    fetch(fileName + '.txt')
        .then(res => res.text())
        .then(text => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('quizArea').style.display = 'block';
            parseData(text);
            loadProgress(); 
            
            // Bắt đầu đếm giờ nếu chưa nộp bài
            if (!isSubmitted) {
                startTimer();
            }
        })
        .catch(err => alert("Lỗi đọc file! Hãy chắc chắn bạn đang chạy Live Server."));
}

// --- 2. XỬ LÝ DỮ LIỆU FILE TXT ---
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
            currentQ = { text: line, options: [], userSelected: null };
        } else if (optRegex.test(line) && currentQ) {
            let isCorrect = line.startsWith('*');
            currentQ.options.push({ text: line.replace(/^\*/, '').trim(), isCorrect: isCorrect });
        } else {
            if (currentQ && currentQ.options.length === 0) currentQ.text += " " + line;
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
    if (timerElement) timerElement.innerText = "Thời gian: " + timeStr;
    return timeStr;
}

// --- 4. HIỂN THỊ CÂU HỎI ---
function renderQuestion(index) {
    if (index < 0 || index >= allQuestions.length) return;
    currentIndex = index;
    const q = allQuestions[index];
    let processedText = q.text.replace(/\[IMG:(.*?)\]/g, '<div class="q-image"><img src="$1"></div>');
    
    document.getElementById('qNumber').innerText = `Câu ${index + 1}/${allQuestions.length}`;
    document.getElementById('qText').innerHTML = processedText;
    document.getElementById('btnPrev').disabled = (index === 0);
    document.getElementById('btnNext').disabled = (index === allQuestions.length - 1);

    const optsArea = document.getElementById('optionsArea');
    optsArea.innerHTML = '';
    const isAnswered = (q.userSelected !== null);

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'option-item';
        btn.innerText = opt.text;
        if (isAnswered) {
            btn.style.pointerEvents = 'none';
            if (opt.isCorrect) btn.classList.add('correct');
            if (q.userSelected === idx && !opt.isCorrect) btn.classList.add('wrong');
        } else {
            btn.onclick = () => handleAnswer(index, idx);
        }
        optsArea.appendChild(btn);
    });
}

function handleAnswer(qIndex, optIndex) {
    if (isSubmitted) return; 
    allQuestions[qIndex].userSelected = optIndex;
    renderQuestion(qIndex);
    saveProgress();
}

function changeQuestion(step) { renderQuestion(currentIndex + step); }

// --- 5. LÀM LẠI & NỘP BÀI ---
function resetExam() {
    if(!confirm("Bạn có chắc muốn xóa toàn bộ kết quả và làm lại từ đầu không?")) return;
    localStorage.removeItem('quiz_data_' + currentFileName);
    location.reload();
}

function finishExam() {
    if (isSubmitted) { showResultModal(); return; } 
    if (!confirm("Bạn muốn nộp bài để xem tổng kết điểm chứ?")) return;

    isSubmitted = true;
    clearInterval(timerInterval); // Dừng đồng hồ
    saveProgress(); 
    showResultModal();
}

function showResultModal(c) {
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
        history: allQuestions.map(q => ({ userSelected: q.userSelected })) 
    };
    localStorage.setItem('quiz_data_' + currentFileName, JSON.stringify(data));
}

function loadProgress() {
    const saved = localStorage.getItem('quiz_data_' + currentFileName);
    if (saved) {
        const data = JSON.parse(saved);
        isSubmitted = data.isSubmitted || false;
        totalSeconds = data.totalSeconds || 0;
        updateTimerDisplay();
        if (data.history) {
            data.history.forEach((h, i) => {
                if (allQuestions[i]) allQuestions[i].userSelected = h.userSelected;
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
    if (modal.style.display === 'flex') { modal.style.display = 'none'; } 
    else {
        const grid = document.getElementById('gridMap');
        grid.innerHTML = '';
        allQuestions.forEach((q, idx) => {
            const div = document.createElement('div');
            div.className = 'grid-item'; div.innerText = idx + 1;
            if(idx === currentIndex) div.classList.add('current');
            if (q.userSelected !== null) {
                if (q.options[q.userSelected].isCorrect) div.classList.add('done-correct');
                else div.classList.add('done-wrong');
            }
            div.onclick = () => { renderQuestion(idx); modal.style.display = 'none'; };
            grid.appendChild(div);
        });
        modal.style.display = 'flex';
    }
}