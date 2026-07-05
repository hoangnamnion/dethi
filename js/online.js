// ==========================================
// DANH SÁCH ONLINE - REAL-TIME QUA CLOUDFLARE WORKERS
// Sử dụng API_BASE từ js/api-config.js
// ==========================================
async function showOnlineStatus() {
    let modal = document.getElementById('onlineStatusModal');
    if (modal) return;

    // Tạo modal với giao diện loading
    modal = document.createElement('div');
    modal.id = 'onlineStatusModal';
    modal.style.cssText = `
        display: flex; position: fixed; top:0; left:0; width:100%; height:100%;
        background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(5px); z-index: 99999; justify-content: center; align-items: center;
    `;

    modal.innerHTML = `
        <div style="background: white; width: 90%; max-width: 420px; border-radius: 24px; padding: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); animation: popModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transform-origin: center;">
            <h3 style="margin-top: 0; color: #1e293b; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; font-weight: 800;">
                <span>📊 Trạng Thái Trực Tuyến</span>
                <span id="onlineCountBadge" style="background: #94a3b8; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.7em;">ĐANG TẢI...</span>
            </h3>
            <div id="onlineListContainer" style="max-height: 350px; overflow-y: auto; padding-right: 5px; margin-top: 15px; text-align: center;">
                <div style="padding: 20px; color: #64748b; font-weight: 600;">⏳ Đang đồng bộ dữ liệu...</div>
            </div>
            <button onclick="document.getElementById('onlineStatusModal').remove()" style="margin-top: 20px; width: 100%; background: #334155; border: none; padding: 14px; border-radius: 12px; font-weight: bold; color: white; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#1e293b'" onmouseout="this.style.background='#334155'">Trở Về</button>
        </div>
        <style>
            @keyframes popModal {
                0% { transform: scale(0.8); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .online-dot {
                position: relative; display: flex; width: 12px; height: 12px;
            }
            .online-dot::before {
                content: ''; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #22c55e; opacity: 0.75;
            }
            .online-dot::after {
                content: ''; position: relative; border-radius: 50%; width: 12px; height: 12px; background: #22c55e; box-shadow: 0 0 8px #22c55e;
            }
            @keyframes ping {
                75%, 100% { transform: scale(2); opacity: 0; }
            }
        </style>
    `;
    document.body.appendChild(modal);

    try {
        if (typeof API_BASE === 'undefined') {
            throw new Error("Chưa cấu hình API_BASE trong js/api-config.js");
        }

        // Lấy danh sách người đang online từ Cloudflare Worker
        const response = await fetch(API_BASE + "?action=getOnlineUsers&t=" + Date.now());
        const data = await response.json();

        let listHTML = '';
        const onlineUsers = Array.isArray(data) ? data : (data.users || []);
        const totalOnline = data.onlineCount || onlineUsers.length || 0;

        const currentUser = typeof getCurrentUsername === 'function' ? getCurrentUsername() : null;
        
        if (onlineUsers.length > 0) {
            listHTML = onlineUsers.map(u => {
                const displayName = (typeof u === 'object') ? (u.name || u.username || '?') : u;
                const isMe = (displayName === currentUser);
                const examInfo = (typeof u === 'object' && u.examName) ? `📝 ${u.examName}` : '';
                const scoreInfo = (typeof u === 'object' && u.rawScore) ? ` • ${u.rawScore}` : '';
                return `
                <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 12px; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: left;">
                    <span class="online-dot"></span>
                    <div style="flex: 1; min-width:0;">
                        <div style="font-weight: 700; color: #334155; font-size: 0.95em;">${displayName} ${isMe ? '<span style="color:#22c55e">(Bạn)</span>' : ''}</div>
                        ${examInfo ? `<div style="font-size:0.78em; color:#64748b; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${examInfo}${scoreInfo}</div>` : ''}
                    </div>
                    <div style="flex-shrink:0; font-size: 0.8em; font-weight: 600; color: #0984e3; background: #e0f2fe; padding: 3px 8px; border-radius: 20px;">Trực tuyến</div>
                </div>
            `}).join('');
        } else {
            listHTML = `<div style="padding: 20px; color: #64748b; font-weight: 600;">Hiện không có ai online</div>`;
        }

        document.getElementById('onlineCountBadge').innerHTML = `${totalOnline} ONLINE`;
        document.getElementById('onlineCountBadge').style.background = '#22c55e';
        document.getElementById('onlineListContainer').innerHTML = listHTML;

    } catch (e) {
        console.error("Lỗi tải danh sách online:", e);
        document.getElementById('onlineCountBadge').innerHTML = `LỖI`;
        document.getElementById('onlineCountBadge').style.background = '#ef4444';
        document.getElementById('onlineListContainer').innerHTML = `
            <div style="padding: 16px; color: #ef4444; font-weight: 600; text-align:left; font-size:0.88em; background:#fff5f5; border-radius:10px; border:1px solid #fed7d7;">
                ❌ Không thể kết nối đến máy chủ.<br>
                <span style="color:#64748b; font-weight:400; font-size:0.92em; display:block; margin-top:6px;">
                    <b>Chi tiết lỗi:</b> ${e.message || e}<br>
                    <b>API:</b> ${typeof API_BASE !== 'undefined' ? API_BASE : 'CHƯA ĐỊNH NGHĨA'}
                </span>
            </div>`;
    }
}

// ==========================================
// CƠ CHẾ THÁCH ĐẤU (PVP)
// ==========================================
let pvpPollingInterval = null;

function getCurrentUsername() {
    try {
        const ud = sessionStorage.getItem('current_user');
        if (ud) {
            const u = JSON.parse(ud);
            return u.username || u.accountId || null;
        }
    } catch(e){}
    return null;
}

function sendChallenge(targetUser) {
    const fromUser = getCurrentUsername();
    if (!fromUser) return alert("Bạn cần đăng nhập để thách đấu!");
    
    // Đổi nút thành "Đang gửi..."
    const btn = document.getElementById('btn-challenge-' + targetUser);
    if(btn) {
        btn.innerHTML = "⏳ Đang gửi...";
        btn.disabled = true;
        btn.style.background = "#94a3b8"; // xám
    }
    
    fetch(API_BASE + "?action=sendChallenge&from=" + encodeURIComponent(fromUser) + "&to=" + encodeURIComponent(targetUser))
        .then(r => r.json())
        .then(res => {
            if(res.success || res.status === 'sent') {
                if(btn) {
                    btn.innerHTML = "Đã gửi ⚔️";
                    btn.style.background = "#f59e0b"; // cam vàng
                }
                // CHUYỂN NGƯỜI GỬI VÀO PHÒNG LUÔN CHỜ SẴN
                const roomId = res.roomId || ("ROOM_FALLBACK_" + fromUser + "_" + targetUser);
                window.location.href = 'pvp.html?room=' + encodeURIComponent(roomId) + '&opponent=' + encodeURIComponent(targetUser);
            } else {
                alert("Lỗi: " + (res.error || res.message || "Không thể gửi"));
                if(btn) {
                    btn.innerHTML = "⚔️ Thách Đấu";
                    btn.disabled = false;
                    btn.style.background = "#ef4444";
                }
            }
        }).catch(e => {
            console.error(e);
            alert("Lỗi kết nối máy chủ khi gửi lời mời!");
            if(btn) {
                btn.innerHTML = "⚔️ Thách Đấu";
                btn.disabled = false;
                btn.style.background = "#ef4444";
            }
        });
}

function startChallengePolling() {
    const currentUser = getCurrentUsername();
    if (!currentUser) return; // Chỉ poll khi đã đăng nhập
    
    if (pvpPollingInterval) clearInterval(pvpPollingInterval);
    
    // Poll 4 giây 1 lần
    pvpPollingInterval = setInterval(() => {
        if (typeof API_BASE === 'undefined') return;
        
        fetch(API_BASE + "?action=checkChallenge&user=" + encodeURIComponent(currentUser))
            .then(r => r.json())
            .then(res => {
                if(res.hasChallenge && res.from) {
                    showChallengePopup(res.from, res.roomId, res.fileId, res.fileName);
                }
            }).catch(e => {
                // Im lặng khi lỗi poll
            });
    }, 4000); 
}

function showChallengePopup(fromUser, roomId, fileId, fileName) {
    if (document.getElementById('pvpChallengeModal')) return; // Đang hiện rồi
    
    const fIdParam = fileId ? encodeURIComponent(fileId) : '';
    const examText = fileName ? `<br><span style="font-size:16px; color:#fff;">Đề: 📝 ${fileName}</span>` : '';

    const div = document.createElement('div');
    div.id = 'pvpChallengeModal';
    div.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); z-index: 100000;
        display: flex; justify-content: center; align-items: center;
        animation: pvpFadeIn 0.3s;
    `;
    div.innerHTML = `
        <div style="
            background: linear-gradient(135deg, rgba(239,68,68,0.95), rgba(249,115,22,0.95));
            padding: 35px 25px; border-radius: 24px; color: white; text-align: center;
            box-shadow: 0 10px 50px rgba(239,68,68,0.5);
            border: 2px solid rgba(255,255,255,0.3);
            animation: pvpShake 0.6s cubic-bezier(.36,.07,.19,.97) both infinite;
            max-width: 90%;
            width: 400px;
        ">
            <div style="font-size: 50px; margin-bottom: 10px; line-height: 1;">⚔️</div>
            <h2 style="margin-top:0; margin-bottom: 15px; font-size: 26px; font-weight: 800; text-transform: uppercase; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); letter-spacing: 1px;">CẢNH BÁO THÁCH ĐẤU!</h2>
            <p style="font-size: 18px; font-weight: 600; line-height: 1.5; margin-bottom: 25px;">
                Đồng chí <b style="color: #fef08a; font-size: 20px;">${fromUser}</b><br>vừa gửi lời khiêu chiến tới bạn!${examText}
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="acceptChallenge('${roomId}', '${fromUser}', '${fIdParam}')" style="flex: 1; background: white; color: #ef4444; border: none; padding: 14px 20px; font-weight: 800; border-radius: 12px; cursor: pointer; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Chấp Nhận 🔥</button>
                <button onclick="rejectChallenge('${fromUser}')" style="flex: 1; background: rgba(0,0,0,0.4); color: white; border: 1px solid rgba(255,255,255,0.5); padding: 14px 20px; font-weight: 700; border-radius: 12px; cursor: pointer; font-size: 16px; transition: 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.6)'" onmouseout="this.style.background='rgba(0,0,0,0.4)'">Bỏ Chạy 🏃</button>
            </div>
        </div>
        <style>
            @keyframes pvpShake {
                0%, 100% { transform: rotate(0deg); }
                25% { transform: rotate(1deg) scale(1.02); }
                75% { transform: rotate(-1deg) scale(1.02); }
            }
            @keyframes pvpFadeIn { from {opacity: 0; transform: scale(0.9)} to {opacity: 1; transform: scale(1)} }
        </style>
    `;
    document.body.appendChild(div);
}

function acceptChallenge(roomId, fromUser, fileIdParam) {
    document.getElementById('pvpChallengeModal').remove();
    // Báo cho server đã chấp nhận (tùy chọn)
    fetch(API_BASE + "?action=acceptChallenge&room=" + encodeURIComponent(roomId) + "&user=" + encodeURIComponent(getCurrentUsername())).catch(e=>{});
    // Chuyển tới TRANG PHÒNG CHỜ (lobby.html)
    let url = 'lobby.html?room=' + encodeURIComponent(roomId);
    if (fileIdParam) url += '&file=' + fileIdParam;
    window.location.href = url;
}

function rejectChallenge(fromUser) {
    document.getElementById('pvpChallengeModal').remove();
    fetch(API_BASE + "?action=rejectChallenge&to=" + encodeURIComponent(fromUser)).catch(e=>{});
}

// Kích hoạt lắng nghe khi tải xong (đợi 2s để đảm bảo load xong user info)
setTimeout(startChallengePolling, 2000);

async function showPvPHistory() {
    let modal = document.getElementById('pvpHistoryModal');
    if (modal) return;

    modal = document.createElement('div');
    modal.id = 'pvpHistoryModal';
    modal.style.cssText = `
        display: flex; position: fixed; top:0; left:0; width:100%; height:100%;
        background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px); z-index: 99999; justify-content: center; align-items: center;
    `;

    modal.innerHTML = `
        <div style="background: white; width: 90%; max-width: 450px; border-radius: 24px; padding: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); animation: popModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
            <h3 style="margin-top: 0; color: #1e293b; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; font-weight: 800;">
                <span>⚔️ Lịch Sử So Kèo</span>
            </h3>
            <div id="pvpHistoryList" style="max-height: 400px; overflow-y: auto; padding-right: 5px; margin-top: 15px; text-align: center;">
                <div style="padding: 20px; color: #64748b; font-weight: 600;">⏳ Đang tải dữ liệu...</div>
            </div>
            <button onclick="document.getElementById('pvpHistoryModal').remove()" style="margin-top: 20px; width: 100%; background: #3b82f6; border: none; padding: 14px; border-radius: 12px; font-weight: bold; color: white; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">Đóng</button>
        </div>
    `;
    document.body.appendChild(modal);

    try {
        if (typeof API_BASE === 'undefined') throw new Error("Chưa cấu hình API_BASE");
        
        const response = await fetch(API_BASE + "?action=getPvPHistory&t=" + Date.now());
        const history = await response.json();
        
        const currentUser = getCurrentUsername();
        let listHTML = '';

        if (Array.isArray(history) && history.length > 0) {
            listHTML = history.map(item => {
                const isMeWinner = item.winner === currentUser;
                const isMeLoser = item.loser === currentUser;
                let highlight = "";
                let statusBadge = "";
                
                if (isMeWinner) {
                    highlight = "border-left: 4px solid #22c55e; background: #f0fdf4;";
                    statusBadge = `<span style="color:#22c55e; font-weight:bold; font-size: 0.8em; background:#dcfce7; padding: 3px 8px; border-radius:12px;">THẮNG</span>`;
                } else if (isMeLoser) {
                    highlight = "border-left: 4px solid #ef4444; background: #fef2f2;";
                    statusBadge = `<span style="color:#ef4444; font-weight:bold; font-size: 0.8em; background:#fee2e2; padding: 3px 8px; border-radius:12px;">THUA</span>`;
                }

                return `
                <div style="padding: 15px; margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 12px; text-align: left; ${highlight}">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
                        <span style="font-size: 0.8em; color: #64748b;">🕒 ${item.time}</span>
                        ${statusBadge}
                    </div>
                    <div style="font-weight: 800; font-size: 1.1em; color: #1e293b; display:flex; align-items:center; gap: 8px;">
                        <span style="color: #f59e0b;">👑 ${item.winner}</span> 
                        <span style="font-size:0.8em; color:#94a3b8;">vs</span> 
                        <span style="color: #ef4444;">💀 ${item.loser}</span>
                    </div>
                    ${item.desc ? `<div style="margin-top: 8px; font-size: 0.85em; color: #64748b; font-style: italic;">"${item.desc}"</div>` : ''}
                </div>
                `;
            }).join('');
        } else {
            listHTML = `<div style="padding: 20px; color: #64748b; font-weight: 600;">Chưa có trận đấu nào diễn ra.</div>`;
        }

        document.getElementById('pvpHistoryList').innerHTML = listHTML;
    } catch (e) {
        console.error(e);
        document.getElementById('pvpHistoryList').innerHTML = `<div style="color:#ef4444; padding:20px;">Lỗi khi tải lịch sử.</div>`;
    }
}

// ==========================================
// THÔNG BÁO TỪ ADMIN (GLOBAL CHAT)
// ==========================================
let lastGlobalMsgId = null;

function pollGlobalMessages() {
    if (typeof API_BASE === 'undefined') return;
    fetch(API_BASE + "?action=getGlobalMessages&t=" + Date.now())
        .then(r => r.json())
        .then(messages => {
            if (messages && messages.length > 0) {
                const latest = messages[0];
                if (lastGlobalMsgId !== latest.id) {
                    if (lastGlobalMsgId !== null) {
                        // Hiện toast/popup vì có tin nhắn MỚI
                        showGlobalMessageToast(latest);
                    }
                    lastGlobalMsgId = latest.id;
                    
                    // Cập nhật thông báo ngang banner nếu có
                    const marquee = document.querySelector('.marquee-text');
                    if (marquee) {
                        marquee.innerHTML = `[${latest.time}] ${latest.author}: ${latest.message}`;
                    }
                }
            }
        }).catch(e => {});
}

// Chạy 5s / lần
setInterval(pollGlobalMessages, 5000);
// Chạy lần đầu sau 1s
setTimeout(pollGlobalMessages, 1000);

function showGlobalMessageToast(msg) {
    let container = document.getElementById('global-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'global-toast-container';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 999999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        background: linear-gradient(135deg, #1e293b, #0f172a);
        color: white; padding: 15px 20px; border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3); border-left: 5px solid #3b82f6;
        animation: toastSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        pointer-events: auto; max-width: 300px;
    `;
    toast.innerHTML = `
        <div style="font-size: 0.8em; color: #94a3b8; font-weight: 700; margin-bottom: 5px; display: flex; align-items: center; gap: 5px;">
            <span style="font-size: 1.2em;">📢</span> THÔNG BÁO HỆ THỐNG
        </div>
        <div style="font-size: 0.95em; line-height: 1.4; margin-bottom: 5px;">
            <b style="color: #3b82f6;">${msg.author}:</b> ${msg.message}
        </div>
        <div style="font-size: 0.75em; color: #64748b; text-align: right;">
            🕒 ${msg.time}
        </div>
    `;
    
    if (!document.getElementById('toastStyles')) {
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.innerHTML = `
            @keyframes toastSlideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes toastFadeOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(120%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    container.appendChild(toast);
    
    // Tự động đóng sau 60s
    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.4s forwards';
        setTimeout(() => toast.remove(), 400);
    }, 60000);
}
