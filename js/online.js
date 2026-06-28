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
        const response = await fetch(API_BASE + "?action=getLiveMonitor&t=" + Date.now());
        const data = await response.json();

        let listHTML = '';
        const onlineUsers = Array.isArray(data) ? data : (data.users || []);
        const totalOnline = data.onlineCount || onlineUsers.length || 0;

        if (onlineUsers.length > 0) {
            listHTML = onlineUsers.map(u => {
                const displayName = (typeof u === 'object') ? (u.name || u.username || '?') : u;
                const examInfo = (typeof u === 'object' && u.examName) ? `📝 ${u.examName}` : '';
                const scoreInfo = (typeof u === 'object' && u.rawScore) ? ` • ${u.rawScore}` : '';
                return `
                <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 12px; padding: 12px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: left;">
                    <span class="online-dot"></span>
                    <div style="flex: 1; min-width:0;">
                        <div style="font-weight: 700; color: #334155; font-size: 0.95em;">${displayName}</div>
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
