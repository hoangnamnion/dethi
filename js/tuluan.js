/**
 * ==============================================================================
 * SMART ESSAY STUDY MODULE — TULUAN.JS
 * Interactive Logic: Modes 1-4, Dual Navigation, Vietnamese Diacritic Folding,
 * Cloze Active Recall, Self-Test Diffing, and Resilient Storage Persistence.
 * ==============================================================================
 */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. SAFE STORAGE ENGINE (Incognito / Quota / SecurityError Resilient)
    // --------------------------------------------------------------------------
    const memoryStore = {};

    const SafeStorage = {
        getItem(key, fallback = null) {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    const val = window.localStorage.getItem(key);
                    if (val !== null) return val;
                }
            } catch (err) {
                // SecurityError in Incognito mode or disabled localStorage
            }
            return key in memoryStore ? memoryStore[key] : fallback;
        },

        setItem(key, value) {
            const strVal = String(value);
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.setItem(key, strVal);
                }
            } catch (err) {
                // Storage blocked or quota exceeded
            }
            memoryStore[key] = strVal;
        },

        removeItem(key) {
            try {
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.removeItem(key);
                }
            } catch (err) {
                // Ignore error
            }
            delete memoryStore[key];
        },

        getJSON(key, fallback = []) {
            const raw = this.getItem(key);
            if (!raw) return fallback;
            try {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed : fallback;
            } catch (err) {
                return fallback;
            }
        },

        setJSON(key, value) {
            try {
                this.setItem(key, JSON.stringify(value));
            } catch (err) {
                // Ignore error
            }
        }
    };

    // --------------------------------------------------------------------------
    // 2. VIETNAMESE DIACRITIC FOLDING & TEXT PROCESSING
    // --------------------------------------------------------------------------
    function removeVietnameseTones(text) {
        if (!text) return '';
        const norm = text.normalize('NFD');
        const noCombining = norm.replace(/[\u0300-\u036f]/g, '');
        const noD = noCombining.replace(/[đĐ]/g, function (m) {
            return m === 'đ' ? 'd' : 'D';
        });
        return noD.toLowerCase().trim();
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // --------------------------------------------------------------------------
    // 3. APPLICATION STATE
    // --------------------------------------------------------------------------
    const state = {
        examId: 'KTCQ',
        examName: 'Kiến Trúc Cảnh Quan (KTCQ)',
        questions: [],
        chapters: [],
        currentQuestionId: 1,
        currentMode: 'outline', // 'outline' | 'cloze' | 'selftest'
        activeChapterFilter: 0, // 0 = all, 1, 2, 3, or -1 = starred
        searchQuery: '',
        starredIds: new Set(),
        learnedIds: new Set(),
        revealedBlanks: new Set(), // Set of token blank keys currently revealed
        selfTestDrafts: {}, // questionId -> string draft
        drawerOpen: false,
    };

    // --------------------------------------------------------------------------
    // 4. STORAGE KEYS
    // --------------------------------------------------------------------------
    function getStarredStorageKey() {
        return 'tuluan_starred_' + state.examId;
    }

    function getLearnedStorageKey() {
        return 'tuluan_learned_' + state.examId;
    }

    function getLastViewStorageKey() {
        return 'tuluan_last_view_' + state.examId;
    }

    function getActiveModeStorageKey() {
        return 'tuluan_active_mode';
    }

    // --------------------------------------------------------------------------
    // 5. DATA INITIALIZATION & NORMALIZATION
    // --------------------------------------------------------------------------
    function initData() {
        // Parse URL Query parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('id')) {
            state.examId = urlParams.get('id').trim() || 'KTCQ';
        }
        if (urlParams.has('name')) {
            state.examName = urlParams.get('name').trim() || 'Kiến Trúc Cảnh Quan (KTCQ)';
        }

        // Set Back Link to product.html
        const btnBack = document.getElementById('btnBack');
        if (btnBack) {
            btnBack.href = `product.html?id=${encodeURIComponent(state.examId)}&name=${encodeURIComponent(state.examName)}`;
        }

        // Set Title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = `TỰ LUẬN: ${state.examName.toUpperCase()}`;
        }

        // Load Questions from TULUAN_DATA
        if (typeof window.TULUAN_DATA !== 'undefined') {
            if (Array.isArray(window.TULUAN_DATA)) {
                state.questions = window.TULUAN_DATA;
                state.chapters = window.TULUAN_DATA.chapters || [];
            } else if (window.TULUAN_DATA && Array.isArray(window.TULUAN_DATA.questions)) {
                state.questions = window.TULUAN_DATA.questions;
                state.chapters = window.TULUAN_DATA.chapters || [];
            }
        }

        // Load Starred and Learned state from SafeStorage
        const rawStarred = SafeStorage.getJSON(getStarredStorageKey(), []);
        const sanitizedStarred = rawStarred
            .map(Number)
            .filter(n => Number.isInteger(n) && n >= 1 && n <= 23);
        state.starredIds = new Set(sanitizedStarred);

        const rawLearned = SafeStorage.getJSON(getLearnedStorageKey(), []);
        const sanitizedLearned = rawLearned
            .map(Number)
            .filter(n => Number.isInteger(n) && n >= 1 && n <= 23);
        state.learnedIds = new Set(sanitizedLearned);

        // Load Active Mode
        const savedMode = SafeStorage.getItem(getActiveModeStorageKey(), 'outline');
        if (['outline', 'cloze', 'selftest'].includes(savedMode)) {
            state.currentMode = savedMode;
        }

        // Determine initial question: URL ?q=, then last viewed, fallback to 1
        let initialQ = 1;
        if (urlParams.has('q')) {
            const parsedQ = parseInt(urlParams.get('q'), 10);
            if (!isNaN(parsedQ) && parsedQ >= 1 && parsedQ <= 23) {
                initialQ = parsedQ;
            }
        } else {
            const lastView = parseInt(SafeStorage.getItem(getLastViewStorageKey(), '1'), 10);
            if (!isNaN(lastView) && lastView >= 1 && lastView <= 23) {
                initialQ = lastView;
            }
        }
        state.currentQuestionId = initialQ;
    }

    // --------------------------------------------------------------------------
    // 6. QUESTION FILTERING & SEARCH
    // --------------------------------------------------------------------------
    function filterQuestions() {
        const query = state.searchQuery.trim();
        const normQuery = removeVietnameseTones(query);
        const tokens = normQuery ? normQuery.split(/\s+/).filter(Boolean) : [];

        return state.questions.filter(q => {
            // Chapter / Star filter
            if (state.activeChapterFilter > 0) {
                if (q.chapterId !== state.activeChapterFilter) return false;
            } else if (state.activeChapterFilter === -1) {
                // Starred only
                if (!state.starredIds.has(q.id)) return false;
            }

            // If no search tokens, all matching chapter pass
            if (tokens.length === 0) return true;

            // Build full unaccented search corpus for question
            const corpusParts = [
                `câu ${q.id}`,
                `câu ${q.questionNumber}`,
                q.chapterTitle || '',
                q.title || '',
                q.coreConcept || q.coreSummary || '',
                (q.keywords || []).join(' ')
            ];

            if (Array.isArray(q.outline)) {
                q.outline.forEach(o => {
                    corpusParts.push(o.heading || '');
                    if (Array.isArray(o.details)) {
                        corpusParts.push(o.details.join(' '));
                    } else if (typeof o.details === 'string') {
                        corpusParts.push(o.details);
                    }
                    if (o.content) corpusParts.push(o.content);
                    if (Array.isArray(o.keywords)) corpusParts.push(o.keywords.join(' '));
                });
            }

            if (q.table) {
                if (Array.isArray(q.table.headers)) corpusParts.push(q.table.headers.join(' '));
                if (Array.isArray(q.table.rows)) {
                    q.table.rows.forEach(r => {
                        if (Array.isArray(r)) corpusParts.push(r.join(' '));
                    });
                }
            }

            if (q.diagram) corpusParts.push(q.diagram);

            const corpusNorm = removeVietnameseTones(corpusParts.join(' '));
            return tokens.every(tok => corpusNorm.includes(tok));
        });
    }

    // --------------------------------------------------------------------------
    // 7. RENDER NAVIGATION LISTS (Desktop Sidebar & Mobile Drawer)
    // --------------------------------------------------------------------------
    function renderQuestionLists() {
        const desktopList = document.getElementById('questionList');
        const drawerList = document.getElementById('drawerQuestionList');
        const filtered = filterQuestions();

        const buildHTML = (items) => {
            if (items.length === 0) {
                return `
                    <div style="text-align: center; padding: 24px 10px; color: #64748b; font-weight: 700; font-size: 0.88rem;">
                        <span style="font-size: 1.5rem; display: block; margin-bottom: 6px;">🔍</span>
                        Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại.
                    </div>
                `;
            }

            let html = '';
            let lastChapterId = null;

            items.forEach(q => {
                // If viewing all or starred, add chapter header divider
                if (state.activeChapterFilter <= 0 && q.chapterId !== lastChapterId) {
                    lastChapterId = q.chapterId;
                    html += `<div class="chapter-divider-label">${escapeHtml(q.chapterTitle || `Chương ${q.chapterId}`)}</div>`;
                }

                const isActive = q.id === state.currentQuestionId;
                const isStarred = state.starredIds.has(q.id);
                const isLearned = state.learnedIds.has(q.id);
                const numStr = String(q.id).padStart(2, '0');

                html += `
                    <button class="q-item-btn ${isActive ? 'active' : ''}" data-qid="${q.id}" type="button" aria-label="Xem Câu ${numStr}: ${escapeHtml(q.title)}">
                        <span class="q-item-num-badge">Câu ${numStr}</span>
                        <span class="q-item-title-text">${escapeHtml(q.title)}</span>
                        <div class="q-item-indicators">
                            <span class="indicator-star ${isStarred ? 'visible' : ''}" title="Câu trọng tâm">⭐</span>
                            <span class="indicator-learned ${isLearned ? 'visible' : ''}" title="Đã học">✓</span>
                        </div>
                    </button>
                `;
            });

            return html;
        };

        const generatedHtml = buildHTML(filtered);

        if (desktopList) {
            desktopList.innerHTML = generatedHtml;
            attachQuestionItemEvents(desktopList);
        }

        if (drawerList) {
            drawerList.innerHTML = generatedHtml;
            attachQuestionItemEvents(drawerList);
        }

        // Update Starred Chip Count
        updateFilterTabsCounts();
    }

    function attachQuestionItemEvents(container) {
        container.querySelectorAll('.q-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const qid = parseInt(btn.getAttribute('data-qid'), 10);
                if (!isNaN(qid)) {
                    selectQuestion(qid);
                    closeDrawer();
                }
            });
        });
    }

    function updateFilterTabsCounts() {
        const starCount = state.starredIds.size;
        document.querySelectorAll('.chapter-filter-chip[data-chapter="-1"]').forEach(chip => {
            chip.textContent = `⭐ Đã đánh dấu (${starCount})`;
        });
    }

    // --------------------------------------------------------------------------
    // 8. PROGRESS BADGE & GAUGES
    // --------------------------------------------------------------------------
    function updateProgressUI() {
        const total = state.questions.length || 23;
        const learned = state.learnedIds.size;
        const pct = Math.round((learned / total) * 100);

        // Header Pill Badge (#badgeProgressCount)
        const headerBadge = document.getElementById('badgeProgressCount');
        if (headerBadge) {
            headerBadge.textContent = `Đã học ${learned}/${total} câu`;
        }

        // Sidebar Progress Badge (#progressBadge)
        const progressBadge = document.getElementById('progressBadge');
        if (progressBadge) {
            progressBadge.textContent = `Đã học ${learned}/${total} câu (${pct}%)`;
        }

        // Drawer Progress Text
        const drawerText = document.getElementById('drawerProgressText');
        if (drawerText) {
            drawerText.textContent = `${pct}% (${learned}/${total} câu)`;
        }

        // Progress bar fills
        const desktopFill = document.getElementById('desktopProgressFill');
        if (desktopFill) {
            desktopFill.style.width = `${pct}%`;
        }

        const drawerFill = document.getElementById('drawerProgressFill');
        if (drawerFill) {
            drawerFill.style.width = `${pct}%`;
        }

        // Mark as Learned Toggle Button in bottom bar
        const btnLearned = document.getElementById('btnToggleLearned');
        const checkIcon = document.getElementById('learnedCheckIcon');
        const btnLabel = document.getElementById('learnedBtnLabel');
        const isCurrentLearned = state.learnedIds.has(state.currentQuestionId);

        if (btnLearned) {
            if (isCurrentLearned) {
                btnLearned.classList.add('learned');
                if (btnLabel) btnLabel.textContent = 'ĐÃ THUỘC (BẤM ĐỂ HỦY)';
            } else {
                btnLearned.classList.remove('learned');
                if (btnLabel) btnLabel.textContent = 'ĐÁNH DẤU ĐÃ HỌC';
            }
        }
    }

    // --------------------------------------------------------------------------
    // 9. QUESTION SELECTION & HEADER RENDERING
    // --------------------------------------------------------------------------
    function selectQuestion(qid) {
        state.currentQuestionId = qid;
        state.revealedBlanks.clear();

        // Save last viewed question
        SafeStorage.setItem(getLastViewStorageKey(), qid);

        const currentQ = state.questions.find(q => q.id === qid) || state.questions[0];
        if (!currentQ) return;

        // Render Question Header Card
        const chapterBadge = document.getElementById('qChapterBadge');
        if (chapterBadge) {
            const chapName = (currentQ.chapterTitle || `Chương ${currentQ.chapterId}`).split('.')[0].trim();
            const qNum = String(currentQ.questionNumber || currentQ.chapterIndex || 1).padStart(2, '0');
            chapterBadge.textContent = `${chapName.toUpperCase()} • CÂU ${qNum}`;
        }

        const globalBadge = document.getElementById('qGlobalIndexBadge');
        if (globalBadge) {
            const gNum = String(currentQ.id).padStart(2, '0');
            globalBadge.textContent = `CÂU ${gNum}/${state.questions.length || 23}`;
        }

        // Star Button UI
        updateStarButtonUI();

        // Question Title
        const titleElem = document.getElementById('qTitle');
        if (titleElem) {
            titleElem.textContent = currentQ.title;
        }

        // Core Concept
        const conceptElem = document.getElementById('qCoreConcept');
        if (conceptElem) {
            conceptElem.textContent = currentQ.coreConcept || currentQ.coreSummary || '';
        }

        // Keyword Chips
        const keywordsList = document.getElementById('qKeywordsList');
        if (keywordsList) {
            keywordsList.innerHTML = (currentQ.keywords || [])
                .map(kw => `<span class="keyword-chip">${escapeHtml(kw)}</span>`)
                .join('');
        }

        // Update Prev / Next Buttons
        const prevBtn = document.getElementById('btnPrevQuestion');
        const nextBtn = document.getElementById('btnNextQuestion');
        const currentIndex = state.questions.findIndex(q => q.id === qid);

        if (prevBtn) {
            prevBtn.disabled = currentIndex <= 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentIndex >= state.questions.length - 1;
        }

        // Update Question Lists & Active State
        renderQuestionLists();

        // Update Progress UI
        updateProgressUI();

        // Render Current Learning Mode
        renderActiveMode();
    }

    function updateStarButtonUI() {
        const starBtn = document.getElementById('btnStarCurrent');
        const starIcon = document.getElementById('btnStarIcon');
        const starLabel = document.getElementById('btnStarLabel');
        const isStarred = state.starredIds.has(state.currentQuestionId);

        if (starBtn) {
            if (isStarred) {
                starBtn.classList.add('flagged');
                if (starIcon) starIcon.textContent = '⭐';
                if (starLabel) starLabel.textContent = 'ĐÃ CẮM CỜ';
            } else {
                starBtn.classList.remove('flagged');
                if (starIcon) starIcon.textContent = '☆';
                if (starLabel) starLabel.textContent = 'TRỌNG TÂM';
            }
        }
    }

    function toggleStarCurrent() {
        const qid = state.currentQuestionId;
        if (state.starredIds.has(qid)) {
            state.starredIds.delete(qid);
        } else {
            state.starredIds.add(qid);
        }

        // Persist to SafeStorage
        const sortedIds = Array.from(state.starredIds).sort((a, b) => a - b);
        SafeStorage.setJSON(getStarredStorageKey(), sortedIds);

        updateStarButtonUI();
        renderQuestionLists();
    }

    function toggleLearnedCurrent() {
        const qid = state.currentQuestionId;
        if (state.learnedIds.has(qid)) {
            state.learnedIds.delete(qid);
        } else {
            state.learnedIds.add(qid);
        }

        // Persist to SafeStorage
        const sortedIds = Array.from(state.learnedIds).sort((a, b) => a - b);
        SafeStorage.setJSON(getLearnedStorageKey(), sortedIds);

        updateProgressUI();
        renderQuestionLists();
    }

    // --------------------------------------------------------------------------
    // 10. LEARNING MODES CONTROLLER & RENDERING
    // --------------------------------------------------------------------------
    function setLearningMode(modeName) {
        if (!['outline', 'cloze', 'selftest'].includes(modeName)) return;
        state.currentMode = modeName;
        SafeStorage.setItem(getActiveModeStorageKey(), modeName);

        // Update mode tab buttons UI
        document.querySelectorAll('.mode-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-mode') === modeName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        renderActiveMode();
    }

    function renderActiveMode() {
        const stage = document.getElementById('stageContent');
        if (!stage) return;

        const currentQ = state.questions.find(q => q.id === state.currentQuestionId);
        if (!currentQ) return;

        if (state.currentMode === 'outline') {
            renderModeOutline(stage, currentQ);
        } else if (state.currentMode === 'cloze') {
            renderModeCloze(stage, currentQ);
        } else if (state.currentMode === 'selftest') {
            renderModeSelfTest(stage, currentQ);
        }
    }

    // --------------------------------------------------------------------------
    // 10.1. MODE 1: XƯƠNG SỐNG LUẬN ĐIỂM (OUTLINE ACCORDION)
    // --------------------------------------------------------------------------
    function renderModeOutline(container, q) {
        const outlinePoints = q.outline || [];
        let html = `
            <div class="stage-toolbar">
                <div class="stage-toolbar-title">
                    <span>🦴</span> DÀN Ý &amp; PHÂN TÍCH CHI TIẾT (${outlinePoints.length} Ý CHÍNH)
                </div>
                <div class="stage-actions-group">
                    <button class="stage-btn" id="btnExpandAllOutline">➕ Mở tất cả ý</button>
                    <button class="stage-btn" id="btnCollapseAllOutline">➖ Thu gọn tất cả</button>
                </div>
            </div>

            <div class="outline-list" id="outlineAccordionList">
        `;

        outlinePoints.forEach((point, idx) => {
            const orderNum = point.order || idx + 1;
            const heading = point.heading || `Luận điểm ${orderNum}`;
            const details = Array.isArray(point.details)
                ? point.details
                : (typeof point.details === 'string' ? [point.details] : (point.content ? [point.content] : []));
            const pointKw = point.keywords || [];

            html += `
                <div class="outline-accordion-card open" data-index="${idx}">
                    <div class="outline-accordion-header">
                        <div class="outline-header-left">
                            <span class="outline-order-badge">${orderNum}</span>
                            <span class="outline-heading-title">${escapeHtml(heading)}</span>
                        </div>
                        <span class="outline-chevron">▼</span>
                    </div>
                    <div class="outline-accordion-body">
                        ${details.map(d => `<div class="outline-detail-point">${escapeHtml(d)}</div>`).join('')}
                        ${pointKw.length > 0 ? `
                            <div class="outline-point-keywords">
                                <span style="font-size: 0.72rem; font-weight: 800; color: #64748b; margin-right: 4px;">Từ khóa ý:</span>
                                ${pointKw.map(k => `<span class="outline-point-kw-chip">${escapeHtml(k)}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        html += `</div>`;

        // Comparison Table (Questions 3, 7, 9, 11)
        if (q.table && Array.isArray(q.table.headers) && Array.isArray(q.table.rows)) {
            html += `
                <div class="table-section">
                    <div class="table-section-title">
                        <span>📊</span> BẢNG SO SÁNH &amp; TIÊU CHÍ ĐỐI CHIẾU
                    </div>
                    <div class="table-responsive">
                        <table class="neo-table">
                            <thead>
                                <tr>
                                    ${q.table.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody>
                                ${q.table.rows.map(row => `
                                    <tr>
                                        ${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        // Hierarchical Tree Diagram (Question 19 = Ch3 Q3)
        if (q.diagram) {
            html += `
                <div class="diagram-section">
                    <div class="diagram-section-title">
                        <span>🌳</span> SƠ ĐỒ CẤU TRÚC PHÂN CẤP (TREE DIAGRAM)
                    </div>
                    <div class="diagram-wrapper">
                        <pre class="diagram-pre">${escapeHtml(q.diagram)}</pre>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;

        // Attach Accordion Toggle Events
        container.querySelectorAll('.outline-accordion-header').forEach(hdr => {
            hdr.addEventListener('click', () => {
                const card = hdr.closest('.outline-accordion-card');
                if (card) {
                    card.classList.toggle('open');
                }
            });
        });

        // Expand All / Collapse All Events
        const btnExpand = document.getElementById('btnExpandAllOutline');
        if (btnExpand) {
            btnExpand.addEventListener('click', () => {
                container.querySelectorAll('.outline-accordion-card').forEach(card => card.classList.add('open'));
            });
        }

        const btnCollapse = document.getElementById('btnCollapseAllOutline');
        if (btnCollapse) {
            btnCollapse.addEventListener('click', () => {
                container.querySelectorAll('.outline-accordion-card').forEach(card => card.classList.remove('open'));
            });
        }
    }

    // --------------------------------------------------------------------------
    // 10.2. MODE 2: GIẤU CHỮ TỰ NHỚ (ACTIVE RECALL CLOZE BLANKS)
    // --------------------------------------------------------------------------
    function generateClozeHtml(rawText, keywords, qid) {
        if (!rawText || !keywords || keywords.length === 0) {
            return { html: escapeHtml(rawText), totalBlanks: 0 };
        }

        // Sort keywords descending by length to prioritize longer phrases and prevent substring fragmentation
        const sortedKw = [...keywords].sort((a, b) => b.length - a.length);
        const escapedList = sortedKw.map(escapeRegExp);
        const pattern = new RegExp(`(?<![\\wÀ-ỹ])(${escapedList.join('|')})(?![\\wÀ-ỹ])`, 'gi');

        let blankCounter = 0;
        const replacedHtml = rawText.replace(pattern, (match) => {
            const blankKey = `q${qid}_blank_${blankCounter++}`;
            const isRevealed = state.revealedBlanks.has(blankKey);

            return `
                <span class="cloze-blank ${isRevealed ? 'revealed' : 'hidden'}"
                      data-blank-key="${blankKey}"
                      data-word="${escapeHtml(match)}"
                      tabindex="0"
                      role="button"
                      aria-label="Nhấn để mở từ khóa"
                      title="Chạm để mở từ khóa">
                    ${isRevealed ? escapeHtml(match) : '[ ??? ]'}
                </span>
            `;
        });

        return { html: replacedHtml, totalBlanks: blankCounter };
    }

    function renderModeCloze(container, q) {
        const keywords = q.keywords || [];
        let totalQuestionBlanks = 0;

        let html = `
            <div class="stage-toolbar">
                <div class="stage-toolbar-title">
                    <span>👁️</span> GIẤU CHỮ ACTIVE RECALL
                </div>
                <div class="stage-actions-group">
                    <button class="stage-btn stage-btn-yellow" id="btnRevealAllBlanks">👁️ Hiện tất cả</button>
                    <button class="stage-btn" id="btnHideAllBlanks">🙈 Ẩn tất cả</button>
                    <span style="font-size: 0.82rem; font-weight: 800; background: #f1f5f9; border: 2px solid #141414; padding: 4px 10px; border-radius: 999px;">
                        Đã mở: <b id="clozeRevealedCount">0</b> / <b id="clozeTotalCount">0</b>
                    </span>
                </div>
            </div>

            <div class="cloze-info-box">
                <span>💡</span> <b>Cách học</b>: Thử nhớ từ khóa bị ẩn trong các ô đen <code>[ ??? ]</code> trước khi bấm/chạm để lật mở kiểm tra!
            </div>
        `;

        // 1. Cloze for Core Concept
        if (q.coreConcept) {
            const conceptCloze = generateClozeHtml(q.coreConcept, keywords, `${q.id}_c`);
            totalQuestionBlanks += conceptCloze.totalBlanks;
            html += `
                <div class="cloze-content-card">
                    <div style="font-size: 0.8rem; font-weight: 900; color: #854d0e; margin-bottom: 8px;">💡 KHÁI NIỆM TRỌNG TÂM:</div>
                    <div style="line-height: 1.8;">${conceptCloze.html}</div>
                </div>
            `;
        }

        // 2. Cloze for Outline Points
        (q.outline || []).forEach((point, pIdx) => {
            const heading = point.heading || `Ý ${pIdx + 1}`;
            const details = Array.isArray(point.details)
                ? point.details.join(' ')
                : (point.content || '');

            const combinedKeywords = Array.from(new Set([...keywords, ...(point.keywords || [])]));
            const pointCloze = generateClozeHtml(details, combinedKeywords, `${q.id}_p${pIdx}`);
            totalQuestionBlanks += pointCloze.totalBlanks;

            html += `
                <div class="cloze-content-card">
                    <div style="font-size: 0.88rem; font-weight: 900; color: var(--neo-black); margin-bottom: 8px;">
                        📌 ${pIdx + 1}. ${escapeHtml(heading)}
                    </div>
                    <div style="line-height: 1.8;">${pointCloze.html}</div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Update counts
        updateClozeCounters(totalQuestionBlanks);

        // Attach Cloze Click Events
        container.querySelectorAll('.cloze-blank').forEach(blank => {
            const toggleFn = () => {
                const key = blank.getAttribute('data-blank-key');
                const word = blank.getAttribute('data-word');
                if (state.revealedBlanks.has(key)) {
                    state.revealedBlanks.delete(key);
                    blank.classList.remove('revealed');
                    blank.classList.add('hidden');
                    blank.textContent = '[ ??? ]';
                } else {
                    state.revealedBlanks.add(key);
                    blank.classList.remove('hidden');
                    blank.classList.add('revealed');
                    blank.textContent = word;
                }
                updateClozeCounters(totalQuestionBlanks);
            };

            blank.addEventListener('click', toggleFn);
            blank.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFn();
                }
            });
        });

        // Reveal All & Hide All Buttons
        const btnRevealAll = document.getElementById('btnRevealAllBlanks');
        if (btnRevealAll) {
            btnRevealAll.addEventListener('click', () => {
                container.querySelectorAll('.cloze-blank').forEach(blank => {
                    const key = blank.getAttribute('data-blank-key');
                    const word = blank.getAttribute('data-word');
                    state.revealedBlanks.add(key);
                    blank.classList.remove('hidden');
                    blank.classList.add('revealed');
                    blank.textContent = word;
                });
                updateClozeCounters(totalQuestionBlanks);
            });
        }

        const btnHideAll = document.getElementById('btnHideAllBlanks');
        if (btnHideAll) {
            btnHideAll.addEventListener('click', () => {
                state.revealedBlanks.clear();
                container.querySelectorAll('.cloze-blank').forEach(blank => {
                    blank.classList.remove('revealed');
                    blank.classList.add('hidden');
                    blank.textContent = '[ ??? ]';
                });
                updateClozeCounters(totalQuestionBlanks);
            });
        }
    }

    function updateClozeCounters(total) {
        const totalElem = document.getElementById('clozeTotalCount');
        const revElem = document.getElementById('clozeRevealedCount');
        if (totalElem) totalElem.textContent = total;
        if (revElem) revElem.textContent = state.revealedBlanks.size;
    }

    // --------------------------------------------------------------------------
    // 10.3. MODE 3: TỰ GÕ & SO SÁNH (SELF-TEST RECALL & DIFFING)
    // --------------------------------------------------------------------------
    function evaluateSelfTestInput(userInput, q) {
        const rawInput = userInput || '';
        const normInput = ` ${removeVietnameseTones(rawInput)} `;

        const targetKeywords = q.keywords || [];
        const matchedKw = [];
        const missingKw = [];

        targetKeywords.forEach(kw => {
            const normKw = removeVietnameseTones(kw);
            const tokens = normKw.split(/\s+/).filter(Boolean);

            let isMatched = false;
            if (normInput.includes(` ${normKw} `) || normInput.includes(normKw)) {
                isMatched = true;
            } else if (tokens.length >= 2) {
                const matchedTokens = tokens.filter(t => normInput.includes(` ${t} `) || normInput.includes(t));
                if (matchedTokens.length / tokens.length >= 0.75) {
                    isMatched = true;
                }
            }

            if (isMatched) {
                matchedKw.push(kw);
            } else {
                missingKw.push(kw);
            }
        });

        // Outline evaluation
        const outlineResults = [];
        (q.outline || []).forEach((point, idx) => {
            const pointKw = point.keywords || [];
            const pointMatched = pointKw.filter(k => normInput.includes(removeVietnameseTones(k)));

            let status = 'mastered';
            if (pointKw.length > 0) {
                const ratio = pointMatched.length / pointKw.length;
                if (ratio >= 0.5 || pointMatched.length >= 2) {
                    status = 'mastered';
                } else if (pointMatched.length > 0) {
                    status = 'partial';
                } else {
                    status = 'missing';
                }
            }

            outlineResults.push({
                heading: point.heading || `Ý ${idx + 1}`,
                status: status,
                matched: pointMatched,
                missing: pointKw.filter(k => !pointMatched.includes(k))
            });
        });

        const kwScore = targetKeywords.length > 0
            ? Math.round((matchedKw.length / targetKeywords.length) * 100)
            : 100;

        const masteredCnt = outlineResults.filter(r => r.status === 'mastered').length;
        const totalPts = outlineResults.length;
        const pointScore = totalPts > 0
            ? Math.round((masteredCnt / totalPts) * 100)
            : 100;

        // Composite total score (60% keywords + 40% outline points)
        const totalScore = Math.round(0.6 * kwScore + 0.4 * pointScore);

        return {
            totalScore: totalScore,
            kwScore: kwScore,
            pointScore: pointScore,
            matchedKeywords: matchedKw,
            missingKeywords: missingKw,
            outlineResults: outlineResults
        };
    }

    function renderModeSelfTest(container, q) {
        const savedDraft = state.selfTestDrafts[q.id] || '';

        let html = `
            <div class="stage-toolbar">
                <div class="stage-toolbar-title">
                    <span>✍️</span> TỰ GÕ &amp; ĐỐI CHIẾU DÀN Ý
                </div>
            </div>

            <div class="selftest-prompt-box">
                <span>📝</span> <b>Mẹo tự luyện</b>: Hãy tự gõ lại dàn ý, các ý phân tích và từ khóa trọng tâm bạn nhớ được mà không nhìn tài liệu. Sau đó bấm So Sánh để nhận điểm đánh giá chi tiết!
            </div>

            <textarea class="selftest-input" id="selfTestTextarea"
                placeholder="Gõ dàn ý, luận điểm và từ khóa nhớ được vào đây... (Ví dụ: 1. Khái niệm, 2. Yếu tố tự nhiên, 3. Yếu tố nhân tạo...)"
            >${escapeHtml(savedDraft)}</textarea>

            <div class="selftest-btn-row">
                <button class="btn-neo btn-yellow" id="btnCompareSelfTest">
                    <span>🚀</span> SO SÁNH VỚI ĐÁP ÁN MẪU
                </button>
                <button class="btn-neo btn-white" id="btnClearSelfTest">
                    <span>🧹</span> Xóa làm lại
                </button>
            </div>

            <!-- Comparison Result Area -->
            <div class="comparison-result-card" id="selfTestResult"></div>
        `;

        container.innerHTML = html;

        const textarea = document.getElementById('selfTestTextarea');
        if (textarea) {
            textarea.addEventListener('input', (e) => {
                state.selfTestDrafts[q.id] = e.target.value;
            });
        }

        const btnClear = document.getElementById('btnClearSelfTest');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                if (textarea) {
                    textarea.value = '';
                    state.selfTestDrafts[q.id] = '';
                }
                const resultBox = document.getElementById('selfTestResult');
                if (resultBox) resultBox.style.display = 'none';
            });
        }

        const btnCompare = document.getElementById('btnCompareSelfTest');
        if (btnCompare) {
            btnCompare.addEventListener('click', () => {
                const text = textarea ? textarea.value : '';
                const evalRes = evaluateSelfTestInput(text, q);
                renderSelfTestResults(evalRes, q);
            });
        }
    }

    function renderSelfTestResults(res, q) {
        const resultBox = document.getElementById('selfTestResult');
        if (!resultBox) return;

        resultBox.style.display = 'block';

        let badgeComment = '⚡ CẦN ÔN TẬP THÊM';
        let badgeColor = 'var(--neo-pink)';
        if (res.totalScore >= 80) {
            badgeComment = '🌟 XUẤT SẮC! NẮM RẤT VỮNG BÀI';
            badgeColor = 'var(--neo-green)';
        } else if (res.totalScore >= 60) {
            badgeComment = '👍 KHÁ TỐT! ĐÃ NẮM ĐƯỢC Ý CHÍNH';
            badgeColor = 'var(--neo-yellow)';
        }

        let html = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;">
                <div style="font-family: 'Fredoka', 'Plus Jakarta Sans', sans-serif; font-size: 1.25rem; font-weight: 800;">
                    KẾT QUẢ ĐỐI CHIẾU TỰ LUẬN
                </div>
                <div style="background: ${badgeColor}; border: 2px solid #141414; box-shadow: 2px 2px 0 #141414; padding: 4px 12px; border-radius: 999px; font-weight: 800; font-size: 0.8rem;">
                    ${badgeComment}
                </div>
            </div>

            <!-- Score Summary Grid -->
            <div class="score-summary-grid">
                <div class="score-box" style="background: #fef08a;">
                    <div class="score-box-num">${res.totalScore}%</div>
                    <div class="score-box-label">ĐIỂM TỔNG HỢP</div>
                </div>
                <div class="score-box">
                    <div class="score-box-num">${res.kwScore}%</div>
                    <div class="score-box-label">ĐỘ PHỦ TỪ KHÓA (${res.matchedKeywords.length}/${(q.keywords || []).length})</div>
                </div>
                <div class="score-box">
                    <div class="score-box-num">${res.pointScore}%</div>
                    <div class="score-box-label">LUẬN ĐIỂM ĐẠT CHUẨN</div>
                </div>
            </div>

            <!-- Keyword Matching Diff -->
            <div class="diff-column-section">
                <div style="font-size: 0.85rem; font-weight: 900; color: #065f46; display: flex; align-items: center; gap: 6px;">
                    <span>✓</span> CÁC TỪ KHÓA BẠN ĐÃ NHỚ ĐÚNG (${res.matchedKeywords.length}):
                </div>
                <div class="diff-chips-group">
                    ${res.matchedKeywords.length > 0
                        ? res.matchedKeywords.map(k => `<span class="matched-kw-chip">✓ ${escapeHtml(k)}</span>`).join('')
                        : '<span style="font-size: 0.82rem; color: #64748b; font-style: italic;">Chưa có từ khóa nào khớp.</span>'
                    }
                </div>

                <div style="font-size: 0.85rem; font-weight: 900; color: #9f1239; display: flex; align-items: center; gap: 6px;">
                    <span>⚠️</span> CÁC TỪ KHÓA QUAN TRỌNG BỊ BỎ SÓT (${res.missingKeywords.length}):
                </div>
                <div class="diff-chips-group">
                    ${res.missingKeywords.length > 0
                        ? res.missingKeywords.map(k => `<span class="missing-kw-chip">✗ ${escapeHtml(k)}</span>`).join('')
                        : '<span style="font-size: 0.82rem; color: #059669; font-weight: 800;">Tuyệt vời! Bạn không bỏ sót từ khóa nào.</span>'
                    }
                </div>
            </div>

            <!-- Outline Evaluation Breakdown -->
            <div style="margin-top: 18px;">
                <div style="font-size: 0.92rem; font-weight: 900; margin-bottom: 10px; color: var(--neo-black);">
                    📋 CHI TIẾT TỪNG LUẬN ĐIỂM DÀN Ý:
                </div>
                ${res.outlineResults.map((r, i) => {
                    let badgeClass = 'status-mastered';
                    let badgeText = '✓ ĐẠT';
                    if (r.status === 'partial') {
                        badgeClass = 'status-partial';
                        badgeText = '⚡ MỘT PHẦN';
                    } else if (r.status === 'missing') {
                        badgeClass = 'status-missing';
                        badgeText = '✕ THIẾU';
                    }
                    return `
                        <div class="outline-eval-row">
                            <div style="font-size: 0.86rem; font-weight: 800;">
                                <b>${i + 1}.</b> ${escapeHtml(r.heading)}
                            </div>
                            <span class="outline-eval-status-badge ${badgeClass}">${badgeText}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        resultBox.innerHTML = html;
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --------------------------------------------------------------------------
    // 11. NAVIGATION CONTROLS & DRAWER INTERACTION
    // --------------------------------------------------------------------------
    function openDrawer() {
        state.drawerOpen = true;
        const drawer = document.getElementById('tuluanDrawer');
        const backdrop = document.getElementById('tuluanBackdrop');
        if (drawer) drawer.classList.add('open');
        if (backdrop) backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        state.drawerOpen = false;
        const drawer = document.getElementById('tuluanDrawer');
        const backdrop = document.getElementById('tuluanBackdrop');
        if (drawer) drawer.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        document.body.style.overflow = '';
    }

    function toggleDrawer() {
        if (state.drawerOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
    }

    function goToPrevQuestion() {
        const currentIndex = state.questions.findIndex(q => q.id === state.currentQuestionId);
        if (currentIndex > 0) {
            selectQuestion(state.questions[currentIndex - 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    function goToNextQuestion() {
        const currentIndex = state.questions.findIndex(q => q.id === state.currentQuestionId);
        if (currentIndex < state.questions.length - 1) {
            selectQuestion(state.questions[currentIndex + 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // --------------------------------------------------------------------------
    // 12. EVENT BINDINGS
    // --------------------------------------------------------------------------
    function bindEvents() {
        // Star Button
        const btnStar = document.getElementById('btnStarCurrent');
        if (btnStar) {
            btnStar.addEventListener('click', toggleStarCurrent);
        }

        // Learned Button
        const btnLearned = document.getElementById('btnToggleLearned');
        if (btnLearned) {
            btnLearned.addEventListener('click', toggleLearnedCurrent);
        }

        // Prev / Next Buttons
        const btnPrev = document.getElementById('btnPrevQuestion');
        if (btnPrev) {
            btnPrev.addEventListener('click', goToPrevQuestion);
        }

        const btnNext = document.getElementById('btnNextQuestion');
        if (btnNext) {
            btnNext.addEventListener('click', goToNextQuestion);
        }

        // Drawer Toggle and Close
        const btnToggleDrawer = document.getElementById('btnToggleDrawer');
        if (btnToggleDrawer) {
            btnToggleDrawer.addEventListener('click', toggleDrawer);
        }

        const btnCloseDrawer = document.getElementById('btnCloseDrawer');
        if (btnCloseDrawer) {
            btnCloseDrawer.addEventListener('click', closeDrawer);
        }

        const backdrop = document.getElementById('tuluanBackdrop');
        if (backdrop) {
            backdrop.addEventListener('click', closeDrawer);
        }

        // Keyboard navigation (Escape to close drawer, Left/Right arrows for questions)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.drawerOpen) {
                closeDrawer();
            }
        });

        // Mode Switcher Tabs
        document.querySelectorAll('.mode-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-mode');
                setLearningMode(mode);
            });
        });

        // Search Inputs (Desktop and Drawer)
        const desktopSearch = document.getElementById('tuluanSearchInput');
        const desktopClear = document.getElementById('btnSearchClear');
        const drawerSearch = document.getElementById('drawerSearchInput');
        const drawerClear = document.getElementById('drawerSearchClear');

        function handleSearchInput(val) {
            state.searchQuery = val;
            if (desktopSearch && desktopSearch.value !== val) desktopSearch.value = val;
            if (drawerSearch && drawerSearch.value !== val) drawerSearch.value = val;

            if (desktopClear) desktopClear.style.display = val ? 'flex' : 'none';
            if (drawerClear) drawerClear.style.display = val ? 'flex' : 'none';

            renderQuestionLists();
        }

        if (desktopSearch) {
            desktopSearch.addEventListener('input', (e) => handleSearchInput(e.target.value));
        }

        if (drawerSearch) {
            drawerSearch.addEventListener('input', (e) => handleSearchInput(e.target.value));
        }

        if (desktopClear) {
            desktopClear.addEventListener('click', () => {
                handleSearchInput('');
                if (desktopSearch) desktopSearch.focus();
            });
        }

        if (drawerClear) {
            drawerClear.addEventListener('click', () => {
                handleSearchInput('');
                if (drawerSearch) drawerSearch.focus();
            });
        }

        // Chapter Filter Chips (Desktop and Drawer)
        function handleChapterFilterClick(chip) {
            const chap = parseInt(chip.getAttribute('data-chapter'), 10);
            state.activeChapterFilter = chap;

            document.querySelectorAll('.chapter-filter-chip').forEach(c => {
                if (parseInt(c.getAttribute('data-chapter'), 10) === chap) {
                    c.classList.add('active');
                } else {
                    c.classList.remove('active');
                }
            });

            renderQuestionLists();
        }

        document.querySelectorAll('.chapter-filter-chip').forEach(chip => {
            chip.addEventListener('click', () => handleChapterFilterClick(chip));
        });
    }

    // --------------------------------------------------------------------------
    // 13. DOM READY INITIALIZATION
    // --------------------------------------------------------------------------
    function init() {
        initData();
        bindEvents();
        selectQuestion(state.currentQuestionId);
        setLearningMode(state.currentMode);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for inspection / testing if needed
    window.TuluanApp = {
        state: state,
        SafeStorage: SafeStorage,
        removeVietnameseTones: removeVietnameseTones,
        selectQuestion: selectQuestion,
        setLearningMode: setLearningMode,
        toggleStarCurrent: toggleStarCurrent,
        toggleLearnedCurrent: toggleLearnedCurrent,
        evaluateSelfTestInput: evaluateSelfTestInput,
        filterQuestions: filterQuestions
    };

})();


// --- CHẾ ĐỘ TẬP TRUNG ÔN / GIẢM MÀU MÈ ---
function initFocusTheme() {
    const isFocus = localStorage.getItem('neo_focus_theme') === 'true';
    if (isFocus) {
        document.body.classList.add('theme-focus');
    } else {
        document.body.classList.remove('theme-focus');
    }
    updateTuluanThemeUI(isFocus);
}

function toggleFocusTheme() {
    const isFocus = document.body.classList.toggle('theme-focus');
    localStorage.setItem('neo_focus_theme', isFocus ? 'true' : 'false');
    updateTuluanThemeUI(isFocus);
}

function updateTuluanThemeUI(isFocus) {
    const hText = document.getElementById('themeTuluanText');
    const hIcon = document.getElementById('themeTuluanIcon');
    const hBtn = document.getElementById('btnTuluanThemeHeader');
    if (hText) hText.textContent = isFocus ? 'Màu Pop Art' : 'Giảm màu mè';
    if (hIcon) hIcon.textContent = isFocus ? '🎨' : '🌱';
    if (hBtn) hBtn.style.background = isFocus ? '#e2e8f0' : '#ffffff';

    const dText = document.getElementById('drawerThemeText');
    const dIcon = document.getElementById('drawerThemeIcon');
    const dBtn = document.getElementById('btnTuluanDrawerTheme');
    if (dText) dText.textContent = isFocus ? 'Theme: Gốc Pop Art' : 'Theme: Giảm màu mè tập trung ôn';
    if (dIcon) dIcon.textContent = isFocus ? '🎨' : '🌱';
    if (dBtn) dBtn.style.background = isFocus ? '#e2e8f0' : '#ffffff';
}

if (typeof window !== 'undefined') {
    initFocusTheme();
    window.toggleFocusTheme = toggleFocusTheme;
}
