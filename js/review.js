/* =============================================================
   FILE: review.js (LOGIC ÔN TẬP)
   ============================================================= */

// --- CONTRACT 1: BOOKMARK STANDARDIZATION ---
function getBookmarks(fileName) {
    try {
        const key = 'bookmarks_' + (fileName || window.currentFileName || 'default');
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed.map(n => Number(n)).filter(n => !isNaN(n));
        }
        if (typeof parsed === 'object' && parsed !== null) {
            const arr = [];
            for (let k in parsed) {
                if (parsed[k]) {
                    const num = parseInt(k.replace(/\D/g, ''), 10);
                    if (!isNaN(num)) arr.push(num >= 1 ? num - 1 : num);
                }
            }
            // Auto-migrate object format to array of indices
            localStorage.setItem(key, JSON.stringify(arr));
            return arr;
        }
        return [];
    } catch (e) {
        return [];
    }
}

function setBookmarks(fileName, arr) {
    try {
        const key = 'bookmarks_' + (fileName || window.currentFileName || 'default');
        localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {}
}

function toggleBookmark(fileName, originalIndex) {
    const fn = fileName || window.currentFileName || 'default';
    const list = getBookmarks(fn);
    const idx = Number(originalIndex);
    const pos = list.indexOf(idx);
    if (pos > -1) {
        list.splice(pos, 1);
    } else {
        list.push(idx);
        list.sort((a, b) => a - b);
    }
    setBookmarks(fn, list);
    return list.includes(idx);
}

function loadReview(fileName) {
    window.currentFileName = fileName; // Lưu fileName global để log bookmark
    const titleEl = document.getElementById('titleBar');
    if (titleEl && (!titleEl.innerText || titleEl.innerText === 'Đang tải đề...')) {
        titleEl.innerText = "Ôn tập đề " + fileName;
    }
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
    const fragment = document.createDocumentFragment();
    const qStartRegex = /^(Câu\s+\d+|Bài\s+\d+|Question\s+\d+)/i;
    const optRegex = /^(\*)?([A-D])\./; 
    const sectionRegex = /^(Phần|Chương)\s+\d+/i;

    // Tải bookmarks theo chuẩn Contract 1 (mảng số nguyên index 0-based)
    let savedBookmarks = getBookmarks(window.currentFileName || 'default');

    const flush = (q, i) => {
        const card = document.createElement('div'); card.className = 'review-card';
        
        // --- Tính năng BOOKMARK (0-based originalIndex) ---
        const originalIndex = i - 1;
        let isBookmarked = savedBookmarks.includes(originalIndex);
        
        // Nút Bookmark
        const btnBookmark = document.createElement('button');
        btnBookmark.innerHTML = isBookmarked ? '⭐ Đã lưu' : '☆ Lưu câu khó';
        btnBookmark.className = isBookmarked ? 'btn-bookmark active' : 'btn-bookmark';
        btnBookmark.style.cssText = `
            flex-shrink: 0;
            background: none; 
            border: 1px solid #f39c12; 
            color: #f39c12; 
            padding: 5px 10px; 
            border-radius: 8px; 
            cursor: pointer;
            font-size: 0.85em;
            transition: 0.15s;
        `;
        if (isBookmarked) {
            btnBookmark.style.background = '#f39c12';
            btnBookmark.style.color = '#fff';
        }
        
        btnBookmark.onclick = () => {
            const isNowBookmarked = toggleBookmark(window.currentFileName || 'default', originalIndex);
            isBookmarked = isNowBookmarked;
            savedBookmarks = getBookmarks(window.currentFileName || 'default');
            btnBookmark.innerHTML = isBookmarked ? '⭐ Đã lưu' : '☆ Lưu câu khó';
            btnBookmark.className = isBookmarked ? 'btn-bookmark active' : 'btn-bookmark';
            if (isBookmarked) {
                btnBookmark.style.background = '#f39c12';
                btnBookmark.style.color = '#fff';
            } else {
                btnBookmark.style.background = 'none';
                btnBookmark.style.color = '#f39c12';
            }
        };
        
        // Xử lý ảnh [IMG:...]
        let processedText = q.text.replace(/\[IMG:(.*?)\]/g, '<div class="q-image"><img src="$1" loading="lazy"></div>');
        
        const qHeader = document.createElement('div');
        qHeader.style.cssText = "display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; font-weight: bold; margin-bottom: 10px; color: var(--neo-black, #111827);";
        qHeader.innerHTML = `<div style="flex: 1; word-break: break-word;">Câu ${i}: ${processedText}</div>`;
        qHeader.appendChild(btnBookmark);
        
        card.appendChild(qHeader);
        
        q.options.forEach(opt => {
            const r = document.createElement('div');
            r.style.padding = "8px"; r.style.borderBottom="1px solid #eee";
            r.innerText = opt.text;
            if(opt.isCorrect) {
                r.className = 'is-correct';
                r.onclick = () => {
                    if (container.classList.contains('hide-mode')) {
                        r.classList.toggle('revealed');
                    }
                };
            }
            card.appendChild(r);
        });
        fragment.appendChild(card);
    };

    lines.forEach(line => {
        line = line.trim();
        if(!line) return;

        if (sectionRegex.test(line)) {
            if (currentQ) { flush(currentQ, idx++); currentQ = null; }
            const header = document.createElement('h3');
            header.style.margin = '25px 0 10px 0'; header.innerText = line;
            fragment.appendChild(header);
        } else if (qStartRegex.test(line)) {
            if (currentQ) { flush(currentQ, idx++); }
            currentQ = { text: line.replace(/^(Câu\s+\d+|Bài\s+\d+|Question\s+\d+)[\.:]?\s*/i, '').trim(), options: [] };
        } else if (optRegex.test(line) && currentQ) {
            currentQ.options.push({ text: line.replace(/^\*/, '').trim(), isCorrect: line.startsWith('*') });
        } else {
            if (currentQ && currentQ.options.length === 0) currentQ.text += " " + line;
        }
    });
    if (currentQ) flush(currentQ, idx);

    // Chèn 1 lần duy nhất: giảm 99% DOM reflow, tiết kiệm tối đa CPU & Pin
    container.appendChild(fragment);
}