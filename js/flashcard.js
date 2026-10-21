// js/flashcard.js
let flashcards = [];
let currentCardIndex = 0;
let renderTimer = null;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let isSwipingOrScrolling = false;

function loadFlashcards(fileName) {
    setupTouchEvents();
    fetch('filethi/' + fileName + '.txt')
        .then(res => res.text())
        .then(text => {
            parseFlashcardData(text);
            renderFlashcard();
        })
        .catch(err => {
            console.error('Lỗi tải file:', err);
            document.getElementById('qText').innerHTML = "❌ Lỗi tải dữ liệu đề thi.";
        });
}

function parseFlashcardData(text) {
    text = text.replace(/(\s+)(\*?[A-D]\.)/g, "\n$2");
    const lines = text.split('\n');
    let currentQ = null;
    flashcards = [];
    
    const qStartRegex = /^(Câu\s+\d+|Bài\s+\d+|Question\s+\d+)/i;
    const optRegex = /^(\*)?([A-D])\./;

    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        if (qStartRegex.test(line)) {
            if (currentQ && currentQ.answer) {
                flashcards.push(currentQ);
            }
            currentQ = { 
                question: line, 
                options: [],
                answer: "" 
            };
        } else if (optRegex.test(line) && currentQ) {
            const isCorrect = line.startsWith('*');
            const cleanLine = line.replace(/^\*/, ''); // Bỏ dấu * nếu có
            currentQ.options.push(cleanLine);
            
            if (isCorrect) {
                currentQ.answer = cleanLine;
            }
        } else if (currentQ && currentQ.options.length === 0) {
            currentQ.question += " " + line;
        }
    });
    
    if (currentQ && currentQ.answer) {
        flashcards.push(currentQ);
    }

    // Kiểm tra tham số shuffle từ URL
    const params = new URLSearchParams(window.location.search);
    const shouldShuffle = params.get('shuffle') === 'true';

    if (shouldShuffle) {
        shuffleCards();
    }
}

function shuffleCards() {
    if (flashcards.length <= 1) return;
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    currentCardIndex = 0;
    renderFlashcard();
}

function renderFlashcard() {
    const container = document.getElementById('cardContainer');
    if (!container) return;
    container.classList.remove('flipped');

    if (renderTimer) clearTimeout(renderTimer);

    if (flashcards.length === 0) {
        document.getElementById('qText').innerHTML = "Không có câu hỏi nào trong đề thi này.";
        document.getElementById('aText').innerHTML = "Chưa có đáp án.";
        document.getElementById('progressLabel').innerText = "0/0";
        return;
    }
    
    const card = flashcards[currentCardIndex];
    
    renderTimer = setTimeout(() => {
        // Hiển thị câu hỏi + các lựa chọn ở mặt trước
        let optionsHTML = '<div style="text-align: left; margin-top: 15px; width: 100%;">';
        card.options.forEach(opt => {
            optionsHTML += `<div style="padding: 8px 12px; background: #f1f5f9; border-radius: 8px; margin-bottom: 6px; font-size: 0.9em; color: #475569; font-weight: 600; border: 1px solid #e2e8f0;">${opt}</div>`;
        });
        optionsHTML += '</div>';

        document.getElementById('qText').innerHTML = `
            <div>${card.question.replace(/\[IMG:(.*?)\]/g, '<img src="$1" style="max-width:100%; border-radius:10px; margin-top:10px;">')}</div>
            ${optionsHTML}
        `;
        
        document.getElementById('aText').innerHTML = `
            <div style="font-size: 0.8em; color: #94a3b8; margin-bottom: 10px;">ĐÁP ÁN ĐÚNG LÀ:</div>
            <div style="padding: 15px; background: #dcfce7; border-radius: 12px; border: 2px solid #22c55e;">${card.answer}</div>
        `;
        
        document.getElementById('progressLabel').innerText = `${currentCardIndex + 1}/${flashcards.length}`;
    }, 150);
}

function changeCard(step) {
    if (flashcards.length === 0) return;
    currentCardIndex += step;
    
    if (currentCardIndex >= flashcards.length) {
        currentCardIndex = 0;
    } else if (currentCardIndex < 0) {
        currentCardIndex = flashcards.length - 1;
    }
    
    renderFlashcard();
}

function updateCard(step) {
    changeCard(step);
}

function flipCurrentCard() {
    const container = document.getElementById('cardContainer');
    if (container) container.classList.toggle('flipped');
}

function handleCardClick(e) {
    if (isSwipingOrScrolling) {
        isSwipingOrScrolling = false;
        return;
    }
    flipCurrentCard();
}

function setupTouchEvents() {
    const container = document.getElementById('cardContainer');
    if (!container || container.dataset.touchBound) return;
    container.dataset.touchBound = 'true';

    container.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchEndX = touchStartX;
            touchEndY = touchStartY;
            isSwipingOrScrolling = false;
        }
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length === 1) {
            touchEndX = e.touches[0].clientX;
            touchEndY = e.touches[0].clientY;
            const dist = Math.hypot(touchEndX - touchStartX, touchEndY - touchStartY);
            if (dist > 10) {
                isSwipingOrScrolling = true;
            }
        }
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        // Vuốt ngang > 50px và góc ngang áp đảo
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
            if (deltaX > 0) {
                changeCard(-1);
            } else {
                changeCard(1);
            }
        }
    }, { passive: true });
}

// Hỗ trợ phím mũi tên & Space/Enter (chống scroll trang ngoài ý muốn)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeCard(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        changeCard(1);
    } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipCurrentCard();
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTouchEvents);
} else {
    setupTouchEvents();
}
