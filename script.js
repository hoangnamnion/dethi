// ==========================================
// ⚙️ CẤU HÌNH DANH SÁCH FILE Ở ĐÂY
// ==========================================
const danhSachDeThi = ['1', '2']; 
// ==========================================

let allQuestions = [];
let currentIndex = 0;
let score = 0;
let currentFileName = ''; 

// --- 1. KHỞI TẠO MENU ---
document.addEventListener("DOMContentLoaded", () => {
    renderMenu();
});

function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';
    
    danhSachDeThi.forEach(name => {
        const btn = document.createElement('button');
        btn.className = 'menu-btn';
        
        // Check LocalStorage
        const savedData = localStorage.getItem('quiz_data_' + name);
        let badge = '';
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if(parsed.score > 0 || (parsed.history && parsed.history.some(h => h.answered))) {
                badge = `<div class="badge-progress">Đang làm dở</div>`;
            }
        }

        btn.innerHTML = `${name} <span>.txt</span> ${badge}`;
        btn.onclick = () => loadExam(name);
        menuGrid.appendChild(btn);
    });
}

// --- 2. TẢI ĐỀ THI ---
function loadExam(fileName) {
    currentFileName = fileName;
    document.getElementById('menuScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'flex';
    
    document.getElementById('loading').style.display = 'block';
    document.getElementById('quizArea').style.display = 'none';
    document.getElementById('sectionTitle').innerText = fileName;

    fetch(fileName + '.txt')
        .then(res => {
            if (!res.ok) throw new Error("Không tìm thấy file " + fileName + ".txt");
            return res.text();
        })
        .then(text => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('quizArea').style.display = 'block';
            parseData(text);
            loadProgressAndRender(); 
        })
        .catch(err => {
            document.getElementById('loading').style.display = 'block';
            document.getElementById('loading').innerHTML = `<span style="color:red">Lỗi: ${err.message}<br>⚠️ Muốn Khôi Phục Liên Hệ Cho CAO VĂN NAM <b>ZALO : 0378787154 </b>!</span>`;
        });
}

function backToMenu() {
    saveProgress();
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('menuScreen').style.display = 'block';
    renderMenu(); 
}

// --- 3. XỬ LÝ DỮ LIỆU ---
function parseData(text) {
    text = text.replace(/(\s+)(\*?[A-D]\.)/g, "\n$2");
    const lines = text.split('\n');
    
    let currentSection = "Phần Chung";
    let currentQ = null;
    allQuestions = []; 

    const sectionRegex = /^Phần\s+\d+/i;
    const qStartRegex = /^(Câu\s+\d+|Bài\s+\d+)/i;
    const optRegex = /^(\*)?([A-D])\./; 

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;

        if (sectionRegex.test(line)) {
            if (currentQ) allQuestions.push(currentQ);
            currentSection = line;
            currentQ = null;
        } else if (qStartRegex.test(line)) {
            if (currentQ) allQuestions.push(currentQ);
            currentQ = {
                section: currentSection,
                text: line,
                options: [],
                userSelected: null,
                answered: false,
                isCorrectlyAnswered: false
            };
        } else if (optRegex.test(line) && currentQ) {
            let isCorrect = line.startsWith('*');
            let cleanText = line.replace(/^\*/, '').trim();
            currentQ.options.push({ text: cleanText, isCorrect: isCorrect });
        } else {
            if (currentQ && currentQ.options.length === 0) {
                currentQ.text += " " + line;
            }
        }
    });
    if (currentQ) allQuestions.push(currentQ);
}

// --- 4. LƯU & KHÔI PHỤC ---
function saveProgress() {
    if(allQuestions.length === 0) return;
    
    const dataToSave = {
        currentIndex: currentIndex,
        score: score,
        history: allQuestions.map(q => ({
            answered: q.answered,
            userSelected: q.userSelected,
            isCorrectlyAnswered: q.isCorrectlyAnswered
        }))
    };
    localStorage.setItem('quiz_data_' + currentFileName, JSON.stringify(dataToSave));
}

function loadProgressAndRender() {
    const savedData = localStorage.getItem('quiz_data_' + currentFileName);
    
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            score = parsed.score || 0;
            document.getElementById('scoreBadge').innerText = `${score}`;
            
            parsed.history.forEach((h, index) => {
                if (allQuestions[index]) {
                    allQuestions[index].answered = h.answered;
                    allQuestions[index].userSelected = h.userSelected;
                    allQuestions[index].isCorrectlyAnswered = h.isCorrectlyAnswered;
                }
            });

            let indexToLoad = parsed.currentIndex;
            if (indexToLoad >= allQuestions.length) indexToLoad = 0;
            renderQuestion(indexToLoad);
        } catch (e) {
            console.error("Lỗi file save, reset lại.", e);
            renderQuestion(0);
        }
    } else {
        score = 0;
        document.getElementById('scoreBadge').innerText = `0`;
        renderQuestion(0);
    }
}

function resetExam() {
    if(confirm("Bạn có chắc muốn làm lại từ đầu? Mọi kết quả của đề này sẽ bị xóa.")) {
        localStorage.removeItem('quiz_data_' + currentFileName);
        loadExam(currentFileName); 
    }
}

// --- 5. HIỂN THỊ CÂU HỎI ---
function renderQuestion(index) {
    if (index < 0 || index >= allQuestions.length) return;
    currentIndex = index;
    const q = allQuestions[index];

    document.getElementById('sectionTitle').innerText = q.section;
    document.getElementById('qNumber').innerText = `Câu ${index + 1}/${allQuestions.length}`;
    document.getElementById('qText').innerText = q.text;
    document.getElementById('btnPrev').disabled = (index === 0);
    document.getElementById('btnNext').disabled = (index === allQuestions.length - 1);

    const optsArea = document.getElementById('optionsArea');
    optsArea.innerHTML = '';

    q.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'option-item';
        btn.innerText = opt.text;

        if (q.answered) {
            btn.classList.add('disabled');
            if (opt.isCorrect) btn.classList.add('correct');
            if (idx === q.userSelected && !opt.isCorrect) btn.classList.add('wrong');
        } else {
            btn.onclick = () => handleAnswer(index, idx, opt.isCorrect);
        }
        optsArea.appendChild(btn);
    });
    
    saveProgress();
}

function handleAnswer(qIndex, optIndex, isCorrect) {
    const q = allQuestions[qIndex];
    q.answered = true;
    q.userSelected = optIndex;
    q.isCorrectlyAnswered = isCorrect;
    
    if (isCorrect) score++;
    document.getElementById('scoreBadge').innerText = `${score}`;
    
    renderQuestion(qIndex); 
}

function changeQuestion(step) {
    renderQuestion(currentIndex + step);
}

// --- 6. MODAL DANH SÁCH ---
function toggleModal() {
    const modal = document.getElementById('modalList');
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        const grid = document.getElementById('gridMap');
        grid.innerHTML = '';
        allQuestions.forEach((q, idx) => {
            const item = document.createElement('div');
            item.className = 'grid-item';
            item.innerText = idx + 1;
            
            if (idx === currentIndex) item.classList.add('current');
            if (q.answered) {
                item.classList.add(q.isCorrectlyAnswered ? 'done-correct' : 'done-wrong');
            }
            
            item.onclick = () => {
                renderQuestion(idx);
                modal.style.display = 'none';
            };
            grid.appendChild(item);
        });
        modal.style.display = 'flex';
    }
}