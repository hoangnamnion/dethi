/* =============================================================
   FILE: script.js 
   PHIÊN BẢN: INSTANT FEEDBACK (Báo kết quả ngay khi chọn)
   ============================================================= */

let allQuestions = [];
let currentIndex = 0;
let currentFileName = ''; 
let isSubmitted = false; // Biến kiểm tra đã chốt sổ chưa

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
        })
        .catch(err => alert("Lỗi đọc file! Hãy chắc chắn bạn đang chạy Live Server."));
}

// --- 2. XỬ LÝ DỮ LIỆU FILE TXT ---
function parseData(text) {
    // Thêm xuống dòng cho các đáp án dính nhau
    text = text.replace(/(\s+)(\*?[A-D]\.)/g, "\n$2");
    const lines = text.split('\n');
    
    let currentQ = null;
    allQuestions = []; 
    
    // Regex nhận diện câu hỏi và đáp án
    const qStartRegex = /^(Câu\s+\d+|Bài\s+\d+|Question\s+\d+)/i;
    const optRegex = /^(\*)?([A-D])\./; 

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        if (qStartRegex.test(line)) {
            if (currentQ) allQuestions.push(currentQ);
            currentQ = { text: line, options: [], userSelected: null };
        } else if (optRegex.test(line) && currentQ) {
            // Dấu * đánh dấu đáp án đúng
            let isCorrect = line.startsWith('*');
            currentQ.options.push({ text: line.replace(/^\*/, '').trim(), isCorrect: isCorrect });
        } else {
            if (currentQ && currentQ.options.length === 0) currentQ.text += " " + line;
        }
    });
    // Đẩy câu cuối cùng vào mảng
    if (currentQ) allQuestions.push(currentQ);
}

// --- 3. HIỂN THỊ CÂU HỎI (QUAN TRỌNG) ---
function renderQuestion(index) {
    if (index < 0 || index >= allQuestions.length) return;
    currentIndex = index;
    const q = allQuestions[index];

    // Xử lý ảnh [IMG:...]
    let processedText = q.text.replace(/\[IMG:(.*?)\]/g, '<div class="q-image"><img src="$1"></div>');
    
    document.getElementById('qNumber').innerText = `Câu ${index + 1}/${allQuestions.length}`;
    document.getElementById('qText').innerHTML = processedText;
    
    // Ẩn hiện nút Trước/Sau
    document.getElementById('btnPrev').disabled = (index === 0);
    document.getElementById('btnNext').disabled = (index === allQuestions.length - 1);

    const optsArea = document.getElementById('optionsArea');
    optsArea.innerHTML = '';

    // Kiểm tra câu này đã làm chưa?
    const isAnswered = (q.userSelected !== null);

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'option-item';
        btn.innerText = opt.text;
        
        // --- LOGIC MÀU SẮC (INSTANT FEEDBACK) ---
        if (isAnswered) {
            btn.style.pointerEvents = 'none'; // Khóa không cho chọn lại
            
            // 1. Luôn hiện màu XANH LÁ ở đáp án ĐÚNG
            if (opt.isCorrect) {
                btn.classList.add('correct');
            } 
            
            // 2. Nếu người dùng chọn SAI -> Tô ĐỎ đáp án đó
            if (q.userSelected === idx && !opt.isCorrect) {
                btn.classList.add('wrong');
            }
        } else {
            // Nếu chưa làm -> Gán sự kiện click
            btn.onclick = () => handleAnswer(index, idx);
        }
        
        optsArea.appendChild(btn);
    });
}

// --- 4. XỬ LÝ KHI CHỌN ĐÁP ÁN ---
function handleAnswer(qIndex, optIndex) {
    if (isSubmitted) return; 
    
    // Ghi nhận đáp án
    allQuestions[qIndex].userSelected = optIndex;
    
    // Render lại ngay để hiện màu Xanh/Đỏ
    renderQuestion(qIndex);
    
    // Lưu lại ngay lập tức
    saveProgress();
}

function changeQuestion(step) { renderQuestion(currentIndex + step); }

// --- 5. CHỨC NĂNG LÀM LẠI (RESET) ---
function resetExam() {
    if(!confirm("Bạn có chắc muốn xóa toàn bộ kết quả và làm lại từ đầu không?")) return;
    localStorage.removeItem('quiz_data_' + currentFileName);
    location.reload();
}

// --- 6. CHỨC NĂNG NỘP BÀI (CHỐT SỔ) ---
function finishExam() {
    if (isSubmitted) { showResultModal(); return; } // Nếu nộp rồi thì hiện lại bảng điểm
    
    if (!confirm("Bạn muốn nộp bài để xem tổng kết điểm chứ?")) return;

    // Tính điểm tổng kết
    let correctCount = 0;
    allQuestions.forEach(q => {
        if (q.userSelected !== null && q.options[q.userSelected].isCorrect) correctCount++;
    });

    isSubmitted = true;
    saveProgress(); 
    showResultModal(correctCount);
}

// --- 7. HIỆN BẢNG KẾT QUẢ ---
function showResultModal(c) {
    // Nếu gọi hàm mà không truyền điểm (mở lại) thì tính lại
    if (c === undefined) {
         let correct = 0;
         allQuestions.forEach(q => {
            if (q.userSelected !== null && q.options[q.userSelected].isCorrect) correct++;
         });
         c = correct;
    }
    
    let wrong = 0, skip = 0;
    allQuestions.forEach(q => {
        if (q.userSelected === null) skip++;
        else if (!q.options[q.userSelected].isCorrect) wrong++;
    });

    document.getElementById('resScore').innerText = c + "/" + allQuestions.length;
    document.getElementById('resRight').innerText = c;
    document.getElementById('resWrong').innerText = wrong;
    document.getElementById('resSkip').innerText = skip;
    document.getElementById('modalResult').style.display = 'flex';
}

// --- 8. LƯU & TẢI TIẾN ĐỘ (LOCAL STORAGE) ---
function saveProgress() {
    if(allQuestions.length === 0) return;
    
    // Tính điểm hiện tại để hiện ngoài trang chủ Product
    let tempScore = 0;
    allQuestions.forEach(q => {
        if (q.userSelected !== null && q.options[q.userSelected].isCorrect) tempScore++;
    });

    const data = { 
        currentIndex: currentIndex, 
        score: tempScore, 
        isSubmitted: isSubmitted,
        history: allQuestions.map(q => ({ userSelected: q.userSelected })) 
    };
    localStorage.setItem('quiz_data_' + currentFileName, JSON.stringify(data));
}

function loadProgress() {
    const saved = localStorage.getItem('quiz_data_' + currentFileName);
    if (saved) {
        const data = JSON.parse(saved);
        isSubmitted = data.isSubmitted || false;
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

// --- 9. MODAL DANH SÁCH CÂU HỎI ---
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
            
            // Logic màu sắc map: Làm rồi là hiện màu luôn
            if (q.userSelected !== null) {
                if (q.options[q.userSelected].isCorrect) div.classList.add('done-correct'); // Xanh
                else div.classList.add('done-wrong'); // Đỏ
            } else {
                 div.style.backgroundColor = "#b2bec3"; // Chưa làm (Xám)
            }
            
            div.onclick = () => { renderQuestion(idx); modal.style.display = 'none'; };
            grid.appendChild(div);
        });
        modal.style.display = 'flex';
    }
}