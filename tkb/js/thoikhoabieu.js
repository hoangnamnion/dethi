/* ============================================================
   thoikhoabieu.js — Mobile-First Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── DOM refs ── */
    const navInner        = document.getElementById('nav-inner');
    const timelineContent = document.getElementById('timeline-content');
    const headerDate      = document.getElementById('header-date');
    const clockTime       = document.getElementById('clock-time');
    const heroDayName     = document.getElementById('hero-day-name');
    const heroFullDate    = document.getElementById('hero-full-date');
    const heroCount       = document.getElementById('hero-count');
    const mainScroll      = document.getElementById('main-scroll');

    /* ── Day labels ── */
    const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const DAY_NAMES  = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const DAY_ORDER  = DAY_NAMES; // same order used for sort

    /* ── Current time ── */
    const now              = new Date();
    const todayDayIndex    = now.getDay();          // 0 = Sun
    const todayDayName     = DAY_NAMES[todayDayIndex];
    const todayDateStr     = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    headerDate.textContent = `Hôm nay: ${todayDateStr}`;

    /* ── Live clock ── */
    function updateClock() {
        const d  = new Date();
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        clockTime.textContent = `${hh}:${mm}`;
    }
    updateClock();
    setInterval(updateClock, 15_000);

    /* ── Subject colours (fixed per subject) ── */
    const COLORS = [
        '#2563eb', '#0891b2', '#059669', '#7c3aed',
        '#db2777', '#ea580c', '#ca8a04', '#dc2626', '#0284c7'
    ];
    const colorMap = {};
    let colorIdx   = 0;
    function getColor(subject) {
        if (!colorMap[subject]) {
            colorMap[subject] = COLORS[colorIdx % COLORS.length];
            colorIdx++;
        }
        return colorMap[subject];
    }

    /* ── Subject icons ── */
    function getIcon(subject) {
        const s = subject.toLowerCase();
        if (s.includes('toán'))                                   return 'fa-calculator';
        if (s.includes('lý') || s.includes('vật lý'))            return 'fa-atom';
        if (s.includes('hóa'))                                    return 'fa-flask';
        if (s.includes('văn') || s.includes('ngữ văn'))          return 'fa-pen-nib';
        if (s.includes('anh') || s.includes('tiếng anh'))        return 'fa-language';
        if (s.includes('sử') || s.includes('lịch sử'))           return 'fa-landmark';
        if (s.includes('địa'))                                    return 'fa-earth-americas';
        if (s.includes('tin'))                                    return 'fa-computer';
        if (s.includes('thể dục') || s.includes('gdtc'))         return 'fa-person-running';
        if (s.includes('sinh') || s.includes('sinh học'))        return 'fa-dna';
        if (s.includes('gdcd'))                                   return 'fa-scale-balanced';
        return 'fa-book';
    }

    /* ── Parse time string "HH:MM" → minutes ── */
    function toMinutes(str) {
        if (!str) return null;
        const match = str.match(/(\d{1,2})[h:](\d{2})/i);
        if (!match) return null;
        return parseInt(match[1]) * 60 + parseInt(match[2]);
    }

    /* ── Is a class currently happening? ── */
    function isCurrent(item) {
        if (!item.time) return false;
        const parts = item.time.split('-').map(s => s.trim());
        if (parts.length < 2) return false;
        const start = toMinutes(parts[0]);
        const end   = toMinutes(parts[1]);
        if (start === null || end === null) return false;
        const nowMins = now.getHours() * 60 + now.getMinutes();
        return nowMins >= start && nowMins <= end;
    }

    /* ── Unique days sorted by week order ── */
    const uniqueDays = [...new Set(tkbData.map(d => d.day))]
        .sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));

    /* ── Default active day ── */
    let activeDay = uniqueDays.includes(todayDayName) ? todayDayName : uniqueDays[0];

    /* ────────────────────────
       BOTTOM NAV
    ──────────────────────── */
    function renderNav() {
        navInner.innerHTML = '';
        uniqueDays.forEach(day => {
            const dayIdx = DAY_NAMES.indexOf(day);
            const abbr   = DAY_LABELS[dayIdx] ?? day.slice(0, 2);

            const btn = document.createElement('button');
            btn.className = 'nav-day-btn'
                + (day === activeDay    ? ' active'   : '')
                + (day === todayDayName ? ' is-today' : '');
            btn.setAttribute('aria-label', day);
            btn.innerHTML = `
                <span class="nav-abbr">${abbr}</span>
                <span class="nav-num">${dayIdx === 0 ? 'CN' : `T${dayIdx + 1}`}</span>
                <span class="nav-dot"></span>
            `;
            btn.addEventListener('click', () => {
                if (day === activeDay) return;
                const prev = uniqueDays.indexOf(activeDay);
                const next = uniqueDays.indexOf(day);
                const dir  = next > prev ? 'left' : 'right';
                switchDay(day, dir);
            });
            navInner.appendChild(btn);
        });

        // Scroll active tab into view
        requestAnimationFrame(() => {
            const activeBtn = navInner.querySelector('.nav-day-btn.active');
            if (activeBtn) activeBtn.scrollIntoView({ inline: 'center', behavior: 'smooth' });
        });
    }

    /* ────────────────────────
       HERO BANNER
    ──────────────────────── */
    function updateHero(dayData) {
        const dayIdx = DAY_NAMES.indexOf(activeDay);
        heroDayName.textContent  = activeDay;
        heroCount.textContent    = dayData.length;

        if (activeDay === todayDayName) {
            heroFullDate.textContent = todayDateStr;
            document.querySelector('.today-hero-icon').textContent = '📅';
        } else {
            heroFullDate.textContent = `Tuần này`;
            document.querySelector('.today-hero-icon').textContent = '🗓️';
        }
    }

    /* ────────────────────────
       TIMELINE CARDS
    ──────────────────────── */
    function renderTimeline(dayData) {
        timelineContent.innerHTML = '';

        if (dayData.length === 0) {
            timelineContent.innerHTML = `
                <div class="no-class-state">
                    <div class="emoji">😌</div>
                    <h3>Không có tiết học</h3>
                    <p>Hôm nay không có lịch học — tranh thủ nghỉ ngơi hoặc ôn bài nhé!</p>
                </div>`;
            return;
        }

        dayData.forEach((item, idx) => {
            const color    = getColor(item.subject);
            const icon     = getIcon(item.subject);
            const current  = (activeDay === todayDayName) && isCurrent(item);

            const card = document.createElement('div');
            card.className = 'class-card' + (current ? ' is-current' : '');
            card.style.animationDelay = `${0.05 + idx * 0.07}s`;

            card.innerHTML = `
                <div class="card-period-col">
                    <div class="period-dot" style="background: ${color};">
                        ${item.period}
                    </div>
                </div>
                <div class="card-body" style="--subject-color: ${color};">
                    ${current ? '<div class="current-label">Đang học</div>' : ''}
                    <div class="card-top-row">
                        <div class="subject-name" style="color: ${color};">
                            <i class="fa-solid ${icon}"></i>
                            ${item.subject}
                        </div>
                        <div class="time-chip">
                            <i class="fa-regular fa-clock"></i>
                            ${item.time || 'N/A'}
                        </div>
                    </div>
                    <div class="card-meta-row">
                        <div class="meta-item">
                            <i class="fa-solid fa-user-tie" style="color:${color};"></i>
                            <span>${item.teacher}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fa-solid fa-location-dot" style="color:${color};"></i>
                            <span>${item.room}</span>
                        </div>
                    </div>
                </div>
            `;
            timelineContent.appendChild(card);
        });
    }

    /* ────────────────────────
       FULL RENDER
    ──────────────────────── */
    function render() {
        const dayData = tkbData
            .filter(d => d.day === activeDay)
            .sort((a, b) => a.period - b.period);

        updateHero(dayData);
        renderTimeline(dayData);
        renderNav();
    }

    /* ────────────────────────
       DAY SWITCH WITH SWIPE ANIM
    ──────────────────────── */
    let animating = false;
    function switchDay(newDay, direction = 'left') {
        if (animating) return;
        animating = true;

        const outClass = direction === 'left' ? 'swipe-out-left'  : 'swipe-out-right';
        const inClass  = direction === 'left' ? 'swipe-in-right'  : 'swipe-in-left';

        mainScroll.classList.add(outClass);

        mainScroll.addEventListener('animationend', function onOut() {
            mainScroll.removeEventListener('animationend', onOut);
            mainScroll.classList.remove(outClass);
            activeDay = newDay;
            render();

            mainScroll.classList.add(inClass);
            mainScroll.addEventListener('animationend', function onIn() {
                mainScroll.removeEventListener('animationend', onIn);
                mainScroll.classList.remove(inClass);
                animating = false;
                // scroll top
                mainScroll.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }, { once: true });
    }

    /* ────────────────────────
       SWIPE GESTURE
    ──────────────────────── */
    let touchStartX = 0;
    let touchStartY = 0;
    mainScroll.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    mainScroll.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return; // too small or vertical

        const curIdx = uniqueDays.indexOf(activeDay);
        if (dx < 0 && curIdx < uniqueDays.length - 1) {
            // swipe left → next day
            if (navigator.vibrate) navigator.vibrate(8);
            switchDay(uniqueDays[curIdx + 1], 'left');
        } else if (dx > 0 && curIdx > 0) {
            // swipe right → prev day
            if (navigator.vibrate) navigator.vibrate(8);
            switchDay(uniqueDays[curIdx - 1], 'right');
        }
    }, { passive: true });

    /* ── Desktop tabs (shown when bottom-nav hidden via CSS) ── */
    // Inject desktop tabs above the hero if screen > 900px
    function maybeInjectDesktopTabs() {
        if (window.innerWidth < 900) return;
        let wrapper = document.querySelector('.desktop-wrapper');
        if (wrapper) return; // already injected

        // Wrap main-scroll content inside desktop-wrapper
        const dw = document.createElement('div');
        dw.className = 'desktop-wrapper';

        const tabs = document.createElement('div');
        tabs.className = 'desktop-days-tabs';

        uniqueDays.forEach(day => {
            const btn = document.createElement('button');
            btn.className = 'desktop-tab-btn'
                + (day === activeDay    ? ' active'   : '')
                + (day === todayDayName ? ' is-today' : '');
            btn.textContent = day;
            btn.addEventListener('click', () => {
                if (day === activeDay) return;
                const prev = uniqueDays.indexOf(activeDay);
                const next = uniqueDays.indexOf(day);
                switchDay(day, next > prev ? 'left' : 'right');
                // update desktop tabs
                document.querySelectorAll('.desktop-tab-btn').forEach(b => {
                    b.classList.toggle('active', b.textContent === day);
                });
            });
            tabs.appendChild(btn);
        });

        const body = document.body;
        body.insertBefore(dw, mainScroll);
        dw.appendChild(tabs);
        dw.appendChild(mainScroll);
    }

    /* ────────────────────────
       INIT
    ──────────────────────── */
    if (uniqueDays.length === 0) {
        timelineContent.innerHTML = `<div class="no-class-state">
            <div class="emoji">📋</div>
            <h3>Chưa có dữ liệu</h3>
            <p>Vui lòng cập nhật file <code>datatkb.js</code> với thời khóa biểu của bạn.</p>
        </div>`;
    } else {
        render();
        maybeInjectDesktopTabs();
    }

    /* ────────────────────────
       WEEK VIEW OVERLAY
    ──────────────────────── */
    const weekOverlay    = document.getElementById('week-overlay');
    const weekOverlayBody = document.getElementById('week-overlay-body');
    const weekViewBtn    = document.getElementById('week-view-btn');
    const weekCloseBtn   = document.getElementById('week-close-btn');

    // Day accent colours (match bottom nav badge)
    const DAY_COLORS = ['#ef4444','#2563eb','#0891b2','#059669','#7c3aed','#db2777','#ea580c'];

    function renderWeekView() {
        weekOverlayBody.innerHTML = '';

        uniqueDays.forEach(day => {
            const dayIdx   = DAY_NAMES.indexOf(day);
            const dayColor = DAY_COLORS[dayIdx] ?? '#2563eb';
            const isToday  = day === todayDayName;

            const dayData = tkbData
                .filter(d => d.day === day)
                .sort((a, b) => a.period - b.period);

            const section = document.createElement('div');
            section.className = 'week-day-section';

            // Label row
            const labelRow = document.createElement('div');
            labelRow.className = 'week-day-label';
            labelRow.innerHTML = `
                <span class="week-day-badge ${isToday ? 'is-today' : ''}"
                      style="background: ${dayColor};">${day}</span>
                ${isToday ? '<span class="today-tag">Hôm nay</span>' : ''}
                <div class="week-day-label-line"></div>
            `;
            section.appendChild(labelRow);

            // Class rows
            if (dayData.length === 0) {
                section.insertAdjacentHTML('beforeend',
                    `<div class="week-day-empty"><i class="fa-regular fa-face-smile-wink"></i> Không có tiết học</div>`
                );
            } else {
                dayData.forEach(item => {
                    const isOff    = item.subject.toLowerCase().includes('nghỉ');
                    const subColor = isOff ? '#94a3b8' : getColor(item.subject);
                    const icon     = isOff ? 'fa-mug-hot' : getIcon(item.subject);

                    const row = document.createElement('div');
                    row.className = 'week-class-row' + (isOff ? ' is-off' : '');
                    row.style.setProperty('--row-color', subColor);

                    row.innerHTML = `
                        <div class="week-row-dot" style="background:${subColor};">${item.period}</div>
                        <div class="week-row-info">
                            <div class="week-row-subject" style="color:${subColor};">
                                <i class="fa-solid ${icon}"></i>
                                ${item.subject}
                            </div>
                            ${!isOff ? `
                            <div class="week-row-meta">
                                ${item.teacher ? `<span><i class="fa-solid fa-user-tie"></i>${item.teacher}</span>` : ''}
                                ${item.room    ? `<span><i class="fa-solid fa-location-dot"></i>${item.room}</span>` : ''}
                            </div>` : ''}
                        </div>
                        ${item.time ? `<div class="week-row-time">${item.time}</div>` : ''}
                    `;

                    // Tap → close overlay and switch to that day
                    row.addEventListener('click', () => {
                        closeWeekView();
                        if (!isOff && day !== activeDay) {
                            const prev = uniqueDays.indexOf(activeDay);
                            const next = uniqueDays.indexOf(day);
                            switchDay(day, next > prev ? 'left' : 'right');
                        }
                    });

                    section.appendChild(row);
                });
            }

            weekOverlayBody.appendChild(section);
        });
    }

    function openWeekView() {
        renderWeekView();
        weekOverlay.classList.add('open');
        weekOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (navigator.vibrate) navigator.vibrate(6);
    }

    function closeWeekView() {
        weekOverlay.classList.remove('open');
        weekOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    weekViewBtn.addEventListener('click', openWeekView);
    weekCloseBtn.addEventListener('click', closeWeekView);

    // Swipe down to close
    let wvTouchStartY = 0;
    weekOverlay.addEventListener('touchstart', e => {
        wvTouchStartY = e.touches[0].clientY;
    }, { passive: true });
    weekOverlay.addEventListener('touchend', e => {
        const dy = e.changedTouches[0].clientY - wvTouchStartY;
        // Only close if swiping down AND scroll is at top
        if (dy > 60 && weekOverlayBody.scrollTop <= 0) closeWeekView();
    }, { passive: true });
});

