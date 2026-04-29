// js/leaderboard.js
// ==========================================
// BẢNG XẾP HẠNG CAO THỦ - GIAO DIỆN PREMIUM
// LẤY DỮ LIỆU TỰ ĐỘNG TỪ GOOGLE SHEETS
// ==========================================

// LEADERBOARD_API is now API_BASE from js/api-config.js

// ==========================================
// TẢI NGẦM DỮ LIỆU ĐỂ HIỂN THỊ TỨC THÌ
// ==========================================
window.preFetchedLeaderboard = null;
window.fetchLeaderboardBackground = function() {
    try {
        const examName = typeof currentFileName !== 'undefined' ? currentFileName : '';
        const fetchUrl = `${API_BASE}?action=getLeaderboard&examName=${examName}&t=${Date.now()}`;
        fetch(fetchUrl).then(r => r.json()).then(d => window.preFetchedLeaderboard = d).catch(e => {});
    } catch(e){}
};
setTimeout(window.fetchLeaderboardBackground, 2000);

async function showLeaderboard() {
    let modal = document.getElementById('leaderboardModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'leaderboardModal';
        modal.style.cssText = `
            display: flex; position: fixed; top:0; left:0; width:100%; height:100%;
            background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(10px); z-index: 99999; justify-content: center; align-items: center;
        `;
        document.body.appendChild(modal);
    }

    // Nếu đã có dữ liệu tải ngầm, hiển thị luôn không cần chờ
    if (window.preFetchedLeaderboard) {
        let topUsers = window.preFetchedLeaderboard;
        if (topUsers && topUsers.length > 0) {
            topUsers = topUsers.filter(u => !(u.rawScore && String(u.rawScore).includes('(Đang làm)')));
        }
        renderLeaderboardData(modal, topUsers);
        window.fetchLeaderboardBackground(); // Tải lại ngầm để cập nhật dữ liệu mới cho lần sau
        return;
    }
    
    // Giao diện Loading
    modal.innerHTML = `
        <div style="background: #f8fafc; width: 90%; max-width: 420px; border-radius: 32px; padding: 25px; box-shadow: 0 30px 70px rgba(0,0,0,0.4); text-align: center; position: relative; animation: popModal 0.3s ease-out forwards;">
            <div style="font-size: 2.5em; margin-bottom: 10px;">⏳</div>
            <h3 style="margin: 0; color: #1e293b;">Đang lấy dữ liệu...</h3>
            <p style="color: #64748b; font-size: 0.9em;">Đang kết nối tới Sever</p>
            <div class="loader-spinner" style="margin: 25px auto; width: 45px; height: 45px; border: 4px solid #f1f5f9; border-top: 4px solid #6c5ce7; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <button onclick="document.getElementById('leaderboardModal').remove()" style="margin-top: 20px; background: #e2e8f0; border: none; padding: 12px 25px; border-radius: 20px; font-weight: 700; color: #475569; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#cbd5e1'" onmouseout="this.style.background='#e2e8f0'">ĐÓNG LẠI</button>
        </div>
        <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes popModal { 0% { transform: scale(0.85) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        </style>
    `;
    
    // Gọi API
    try {
        const examName = typeof currentFileName !== 'undefined' ? currentFileName : '';
        const fetchUrl = `${API_BASE}?action=getLeaderboard&examName=${examName}&t=${Date.now()}`;
        
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        
        let topUsers = await response.json();
        
        // Lọc bỏ những người đang thi dở (chỉ hiển thị những bài Đã nộp)
        if (topUsers && topUsers.length > 0) {
            topUsers = topUsers.filter(u => !(u.rawScore && String(u.rawScore).includes('(Đang làm)')));
        }
        
        // Render Dữ liệu
        renderLeaderboardData(modal, topUsers);
        
    } catch (error) {
        console.error("Lỗi lấy dữ liệu bảng xếp hạng:", error);
        modal.innerHTML = `
            <div style="background: #f8fafc; width: 90%; max-width: 420px; border-radius: 32px; padding: 25px; box-shadow: 0 30px 70px rgba(0,0,0,0.4); text-align: center; animation: popModal 0.3s ease-out forwards;">
                <div style="font-size: 3em; margin-bottom: 10px;">❌</div>
                <h3 style="margin: 0; color: #d63031;">Lỗi kết nối</h3>
                <p style="color: #64748b; font-size: 0.9em; margin-bottom: 25px; line-height: 1.5;">Chưa lấy được dữ liệu bảng xếp hạng do mạng chậm hoặc máy chủ đang bận. Vui lòng thử lại sau.</p>
                <button onclick="document.getElementById('leaderboardModal').remove()" style="width: 100%; background: #1e293b; border: none; padding: 16px; border-radius: 20px; font-weight: 800; color: white; cursor: pointer; transition: 0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">QUAY LẠI</button>
            </div>
            <style>@keyframes popModal { 0% { transform: scale(0.85) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }</style>
        `;
    }
}

function renderLeaderboardData(modal, topUsers) {
    if (!topUsers || topUsers.length === 0) {
        modal.innerHTML = `
            <div style="background: #f8fafc; width: 90%; max-width: 420px; border-radius: 32px; padding: 25px; box-shadow: 0 30px 70px rgba(0,0,0,0.4); text-align: center; animation: popModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
                <div style="font-size: 3.5em; margin-bottom: 15px;">🏆</div>
                <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 1.4em;">BẢNG VÀNG</h3>
                <p style="color: #64748b; font-size: 0.95em; margin-bottom: 25px; line-height: 1.5;">Chưa có ai hoàn thành xuất sắc đề thi này.<br>Hãy trở thành người đầu tiên!</p>
                <button onclick="document.getElementById('leaderboardModal').remove()" style="width: 100%; background: #1e293b; border: none; padding: 18px; border-radius: 20px; font-weight: 800; color: white; cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='#0f172a'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='#1e293b'; this.style.transform='translateY(0)';">QUAY LẠI</button>
            </div>
            <style>@keyframes popModal { 0% { transform: scale(0.85) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }</style>
        `;
        return;
    }

    let examDisplayName = typeof currentFileName !== 'undefined' && currentFileName ? currentFileName : '';
    let isSpecificExam = false;
    if (examDisplayName) {
        let found = false;
        try {
            const uStr = sessionStorage.getItem('current_user');
            if (uStr) {
                const uData = JSON.parse(uStr);
                if (uData.exams && Array.isArray(uData.exams)) {
                    const matched = uData.exams.find(e => e.file === examDisplayName);
                    if (matched) { examDisplayName = matched.ten; found = true; }
                }
            }
        } catch(e){}
        
        if (!found && typeof DEFAULT_EXAMS !== 'undefined') {
            const matched = DEFAULT_EXAMS.find(e => e.file === examDisplayName);
            if (matched) examDisplayName = matched.ten;
        }
        if (examDisplayName !== currentFileName || typeof currentFileName !== 'undefined') {
            isSpecificExam = !!currentFileName;
        }
    }

    // 1. GOM NHÓM THEO TÊN NGƯỜI & LỌC THEO MÔN HỌC
    const userMap = new Map();
    topUsers.forEach(user => {
        let displayUserName = user.name || "";
        if (displayUserName.includes('(')) {
            displayUserName = displayUserName.replace(/\s*\([^)]*\)$/, '').trim();
        }
        
        let realName = displayUserName;
        let subjectName = "";
        if (displayUserName.includes(' - ')) {
            const parts = displayUserName.split(' - ');
            realName = parts[0].trim();
            subjectName = parts.slice(1).join(' - ').trim();
        }
        
        // Nếu đang xem Xếp hạng của 1 môn cụ thể, bỏ qua các môn khác
        if (isSpecificExam && subjectName && subjectName !== examDisplayName) {
            return;
        }

        let rawScore = user.rawScore || "0";
        let scoreValue = 0;
        let baseScoreStr = rawScore.replace('(Đang làm)', '').trim();
        if (baseScoreStr.includes('/')) {
            scoreValue = parseInt(baseScoreStr.split('/')[0]) || 0;
        } else {
            scoreValue = parseInt(baseScoreStr) || 0;
        }

        const existing = userMap.get(realName);
        if (!existing) {
            userMap.set(realName, { ...user, scoreValue, realName, subjectName });
        } else {
            if (scoreValue > existing.scoreValue) {
                userMap.set(realName, { ...user, scoreValue, realName, subjectName });
            }
        }
    });

    // 2. Chuyển Map thành mảng và sắp xếp lại theo điểm
    topUsers = Array.from(userMap.values()).sort((a, b) => b.scoreValue - a.scoreValue);

    // Cắt lấy Top 50
    if (topUsers.length > 50) topUsers = topUsers.slice(0, 50);

    // 3. Gắn màu sắc theo thứ hạng
    topUsers.forEach((user, index) => {
        user.rank = index + 1;
        if (user.rank === 1) user.color = "#f1c40f"; // Vàng
        else if (user.rank === 2) user.color = "#95a5a6"; // Bạc
        else if (user.rank === 3) user.color = "#d35400"; // Đồng
        else user.color = "#34495e"; 
    });

    let listHTML = topUsers.map(user => {
        let realName = user.realName || user.name;
        let subjectName = user.subjectName || "";

        return `
        <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 12px; padding: 15px; background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 15px rgba(0,0,0,0.05)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)';">
            <div style="width: 42px; height: 42px; background: ${user.rank <= 3 ? user.color : '#f1f5f9'}; color: ${user.rank <= 3 ? 'white' : '#64748b'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2em; box-shadow: ${user.rank <= 3 ? '0 4px 10px ' + user.color + '66' : 'none'};">
                ${user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
            </div>
            <div style="flex: 1; margin-left: 5px; overflow: hidden;">
                <div style="font-weight: 700; color: #1e293b; font-size: 1.05em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px;">${realName}</div>
                <div style="font-size: 0.75em; color: #94a3b8; font-weight: 600; display: flex; align-items: center; gap: 5px;">
                    <span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #64748b;">⏱ ${user.time || 'Vừa xong'}</span>
                    <span style="color: #10b981;">• Đã Nộp</span>
                </div>
                ${subjectName ? `<div style="font-size: 0.7em; color: #64748b; margin-top: 4px; display: flex; align-items: center; gap: 4px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><span style="color: #8b5cf6;">📘</span> Môn: ${subjectName}</div>` : ''}
            </div>
            <div style="text-align: right; background: #f0fdf4; padding: 8px 14px; border-radius: 12px; border: 1px solid #dcfce7; min-width: 65px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div style="font-size: 1.15em; font-weight: 800; color: #16a34a; line-height: 1;">${user.rawScore}</div>
                <div style="font-size: 0.6em; color: #16a34a; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">Câu</div>
            </div>
        </div>
        `;
    }).join('');

    const titlePrefix = examDisplayName ? `ĐỀ: ${examDisplayName.toUpperCase()}` : 'BẢNG VÀNG';

    modal.innerHTML = `
        <div style="background: #f8fafc; width: 90%; max-width: 440px; border-radius: 32px; padding: 25px; box-shadow: 0 30px 70px rgba(0,0,0,0.4); animation: popModal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; position: relative; overflow: hidden;">
            <!-- Decorative element -->
            <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(108, 92, 231, 0.05); border-radius: 50%; pointer-events: none;"></div>
            <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(16, 185, 129, 0.05); border-radius: 50%; pointer-events: none;"></div>
            
            <h3 style="margin-top: 0; color: #1e293b; display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; font-weight: 800; border-bottom: 2px dashed #e2e8f0; position: relative;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 1.6em; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">🏆</span>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-size: 0.85em;">${titlePrefix}</span>
                        <span style="font-size: 0.45em; color: #64748b; letter-spacing: 1px; margin-top: 2px;">TOP NHỮNG NGƯỜI XUẤT SẮC</span>
                    </div>
                </div>
                <span style="font-size: 0.5em; background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; padding: 6px 15px; border-radius: 20px; box-shadow: 0 4px 10px rgba(108, 92, 231, 0.3); font-weight: 700; letter-spacing: 0.5px;">LIVE 🔴</span>
            </h3>
            
            <div style="max-height: 420px; overflow-y: auto; padding: 15px 5px; margin-top: 5px; scrollbar-width: thin; position: relative; z-index: 10;">
                ${listHTML}
                <div style="text-align: center; margin-top: 15px; padding: 15px; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1;">
                    <div style="font-size: 0.85em; color: #64748b; font-weight: 600;">Hệ thống tự động cập nhật điểm</div>
                    <div style="font-size: 0.75em; color: #94a3b8; margin-top: 3px;">Dữ liệu được đồng bộ trực tiếp từ Sever 🚀</div>
                </div>
            </div>
            
            <button onclick="document.getElementById('leaderboardModal').remove()" style="margin-top: 20px; width: 100%; background: #1e293b; border: none; padding: 18px; border-radius: 20px; font-weight: 800; color: white; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 25px rgba(30, 41, 59, 0.2); font-size: 1em; position: relative; z-index: 10;" onmouseover="this.style.background='#0f172a'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='#1e293b'; this.style.transform='translateY(0)';" onmousedown="this.style.transform='scale(0.98)'">
                ĐÓNG BẢNG XẾP HẠNG
            </button>
        </div>
        <style>
            @keyframes popModal {
                0% { transform: scale(0.85) translateY(20px); opacity: 0; }
                100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            /* Tùy chỉnh thanh cuộn cho đẹp */
            #leaderboardModal div::-webkit-scrollbar { width: 5px; }
            #leaderboardModal div::-webkit-scrollbar-track { background: transparent; }
            #leaderboardModal div::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            #leaderboardModal div::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        </style>
    `;
}

