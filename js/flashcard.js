// js/flashcard.js
let flashcards = [];
let currentCardIndex = 0;

function loadFlashcards(fileName) {
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
        flashcards.sort(() => Math.random() - 0.5);
    }
}

function renderFlashcard() {
    if (flashcards.length === 0) return;
    
    const card = flashcards[currentCardIndex];
    const container = document.getElementById('cardContainer');
    
    container.classList.remove('flipped');
    
    setTimeout(() => {
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
    currentCardIndex += step;
    
    if (currentCardIndex >= flashcards.length) {
        currentCardIndex = 0;
    } else if (currentCardIndex < 0) {
        currentCardIndex = flashcards.length - 1;
    }
    
    renderFlashcard();
}

// Hỗ trợ phím mũi tên
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') changeCard(-1);
    if (e.key === 'ArrowRight') changeCard(1);
    if (e.key === ' ' || e.key === 'Enter') {
        document.getElementById('cardContainer').classList.toggle('flipped');
    }
});
