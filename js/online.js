// ==========================================
// DANH SÁCH ONLINE - FAKE POPUP
// ==========================================
function showOnlineStatus() {
    let modal = document.getElementById('onlineStatusModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'onlineStatusModal';
        modal.style.cssText = `
            display: flex; position: fixed; top:0; left:0; width:100%; height:100%;
            background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(5px); z-index: 99999; justify-content: center; align-items: center;
        `;
        
        // Shuffle và chọn ngẫu nhiên tên 
        const names = ["Idol Hưng Đẹp Zai", "Quang Trung", "Văn Quyến","Đặng Minh Đức Đẹp Zai","Quang Vũ","Nguyễn Thị Thủy"];
        const shuffled = names.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 3); // Hiện 3-5 tên vì danh sách hơi ngắn
        const totalOnline = Math.floor(Math.random() * 60) + 35; // 35-95 người

        let listHTML = selected.map(name => `
            <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 12px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
                <span style="position: relative; display: flex; width: 12px; height: 12px;">
                    <span style="animate: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; position: absolute; inline-flex; width: 100%; height: 100%; border-radius: 50%; background: #22c55e; opacity: 0.75;"></span>
                    <span style="position: relative; inline-flex; border-radius: 50%; width: 12px; height: 12px; background: #22c55e; box-shadow: 0 0 8px #22c55e;"></span>
                </span>
                <div style="font-weight: 700; color: #334155; font-size: 0.95em;">${name}</div>
                <div style="margin-left: auto; font-size: 0.8em; font-weight: 600; color: #0984e3; background: #e0f2fe; padding: 3px 8px; border-radius: 20px;">Đang thi...</div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div style="background: white; width: 90%; max-width: 420px; border-radius: 24px; padding: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); animation: popModal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; transform-origin: center;">
                <h3 style="margin-top: 0; color: #1e293b; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; font-weight: 800;">
                    <span>📊 Trạng Thái Trực Tuyến</span>
                    <span style="background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.7em;">${totalOnline} ONLINE</span>
                </h3>
                <div style="max-height: 350px; overflow-y: auto; padding-right: 5px; margin-top: 15px;">
                    ${listHTML}
                    <div style="text-align:center; color: #94a3b8; font-weight: 600; font-size: 0.85em; margin-top: 15px; padding: 10px; background: #f8fafc; border-radius: 12px;">Và ${totalOnline - selected.length} thí sinh khác...</div>
                </div>
                <button onclick="document.getElementById('onlineStatusModal').remove()" style="margin-top: 20px; width: 100%; background: #334155; border: none; padding: 14px; border-radius: 12px; font-weight: bold; color: white; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#1e293b'" onmouseout="this.style.background='#334155'">Trở Về</button>
            </div>
            <style>
                @keyframes popModal {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(modal);
    }
}
