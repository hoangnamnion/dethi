/* =============================================================
   FILE: review.js (LOGIC ÔN TẬP)
   ============================================================= */

function loadReview(fileName) {
    window.currentFileName = fileName; // Lưu fileName global để log bookmark
    document.getElementById('titleBar').innerText = "Ôn tập đề " + fileName;
    const container = document.getElementById('listContent');
    container.innerHTML = '<p style="text-align:center">Đang tải dữ liệu...</p>';

    fetch('filethi/' + fileName + '.txt')
        .then(res => res.text())
        .then(text => {
            container.innerHTML = '';
            parseAndRenderList(text);
        })
        .catch(err => container.innerHTML = "Lỗi đọc file! Chạy Live Server.");
}

let isHidden = false;
function toggleAnswers() {
    isHidden = !isHidden;
    const container = document.getElementById('listContent');
    const btn = document.getElementById('btnToggle');
    if (isHidden) {
        container.classList.add('hide-mode');
        btn.innerText = "🐵 Hiện Đáp Án";
        btn.classList.add('active');
    } else {
        container.classList.remove('hide-mode');
        btn.innerText = "👁️ Che Đáp Án";
        btn.classList.remove('active');
    }
}

function parseAndRenderList(text) {
    text = text.replace(/(\s+)(\*?[A-D]\.)/g, "\n$2");
    const lines = text.split('\n');
    let currentQ = null;
    let idx = 1;
    const container = document.getElementById('listContent');
    const qStartRegex = /^(Câu\s+\d+|Bài\s+\d+|Question\s+\d+)/i;
    const optRegex = /^(\*)?([A-D])\./; 
    const sectionRegex = /^Phần\s+\d+/i;

    const flush = (q, i) => {
        const card = document.createElement('div'); card.className = 'review-card';
        
        // --- Tính năng BOOKMARK ---
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks_' + (window.currentFileName || 'default')) || '{}');
        const qId = 'q_' + i;
        let isBookmarked = savedBookmarks[qId] || false;
        
        // Nút Bookmark
        const btnBookmark = document.createElement('button');
        btnBookmark.innerHTML = isBookmarked ? '⭐ Đã lưu' : '☆ Lưu câu khó';
        btnBookmark.className = isBookmarked ? 'btn-bookmark active' : 'btn-bookmark';
        btnBookmark.style.cssText = `
            float: right; 
            background: none; 
            border: 1px solid #f39c12; 
            color: #f39c12; 
            padding: 5px 10px; 
            border-radius: 8px; 
            cursor: pointer;
            font-size: 0.85em;
            transition: 0.3s;
        `;
        if (isBookmarked) {
            btnBookmark.style.background = '#f39c12';
            btnBookmark.style.color = '#fff';
        }
        
        btnBookmark.onclick = () => {
            isBookmarked = !isBookmarked;
            btnBookmark.innerHTML = isBookmarked ? '⭐ Đã lưu' : '☆ Lưu câu khó';
            if (isBookmarked) {
                btnBookmark.style.background = '#f39c12';
                btnBookmark.style.color = '#fff';
                savedBookmarks[qId] = true;
            } else {
                btnBookmark.style.background = 'none';
                btnBookmark.style.color = '#f39c12';
                delete savedBookmarks[qId];
            }
            localStorage.setItem('bookmarks_' + (window.currentFileName || 'default'), JSON.stringify(savedBookmarks));
        };
        
        // Xử lý ảnh [IMG:...]
        let processedText = q.text.replace(/\[IMG:(.*?)\]/g, '<div class="q-image"><img src="$1"></div>');
        
        const qHeader = document.createElement('div');
        qHeader.style.cssText = "font-weight:bold; margin-bottom:10px; color:var(--primary); overflow: hidden;";
        qHeader.innerHTML = `<span style="float:left; width:75%">Câu ${i}: ${processedText}</span>`;
        qHeader.appendChild(btnBookmark);
        
        card.appendChild(qHeader);
        
        q.options.forEach(opt => {
            const r = document.createElement('div');
            r.style.padding = "8px"; r.style.borderBottom="1px solid #eee";
            r.style.clear = "both";
            r.innerText = opt.text;
            if(opt.isCorrect) r.className = 'is-correct';
            card.appendChild(r);
        });
        container.appendChild(card);
    };

    lines.forEach(line => {
        line = line.trim();
        if(!line) return;

        if (sectionRegex.test(line)) {
            if (currentQ) { flush(currentQ, idx++); currentQ = null; }
            const header = document.createElement('h3');
            header.style.margin = '25px 0 10px 0'; header.innerText = line;
            container.appendChild(header);
        } else if (qStartRegex.test(line)) {
            if (currentQ) { flush(currentQ, idx++); }
            currentQ = { text: line.replace(/^(Câu\s+\d+|Bài\s+\d+)[\.:]?\s*/i, '').trim(), options: [] };
        } else if (optRegex.test(line) && currentQ) {
            currentQ.options.push({ text: line.replace(/^\*/, '').trim(), isCorrect: line.startsWith('*') });
        } else {
            if (currentQ && currentQ.options.length === 0) currentQ.text += " " + line;
        }
    });
    if (currentQ) flush(currentQ, idx);
}