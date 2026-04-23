// js/leaderboard.js
// ==========================================
// BẢNG XẾP HẠNG CAO THỦ - GIAO DIỆN PREMIUM
// ==========================================
function showLeaderboard() {
    let modal = document.getElementById('leaderboardModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'leaderboardModal';
        modal.style.cssText = `
            display: flex; position: fixed; top:0; left:0; width:100%; height:100%;
            background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(10px); z-index: 99999; justify-content: center; align-items: center;
        `;
        
        // Dữ liệu mẫu (Top 5) - Có thể kết nối API sau này
        const topUsers = [
            { name: "Idol Hưng Đẹp Zai", score: 100, time: "12:45", rank: 1, color: "#f1c40f" },
            { name: "Đặng Minh Đức", score: 98, time: "15:20", rank: 2, color: "#bdc3c7" },
            { name: "Nguyễn Thị Thủy", score: 95, time: "14:10", rank: 3, color: "#e67e22" },
            { name: "Quang Vũ", score: 92, time: "18:05", rank: 4, color: "#34495e" },
            { name: "Văn Quyến", score: 88, time: "20:30", rank: 5, color: "#34495e" }
        ];

        let listHTML = topUsers.map(user => `
            <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 12px; padding: 15px; background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 15px rgba(0,0,0,0.05)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)';">
                <div style="width: 40px; height: 40px; background: ${user.rank <= 3 ? user.color : '#f1f5f9'}; color: ${user.rank <= 3 ? 'white' : '#64748b'}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2em; box-shadow: ${user.rank <= 3 ? '0 4px 10px' + user.color + '66' : 'none'};">
                    ${user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                </div>
                <div style="flex: 1; margin-left: 5px;">
                    <div style="font-weight: 700; color: #1e293b; font-size: 1em;">${user.name}</div>
                    <div style="font-size: 0.75em; color: #94a3b8; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                        <span>⏱ ${user.time}</span>
                        <span style="color: #e2e8f0;">•</span>
                        <span>Hoàn thành</span>
                    </div>
                </div>
                <div style="text-align: right; background: #f0fdf4; padding: 5px 12px; border-radius: 12px; border: 1px solid #dcfce7;">
                    <div style="font-size: 1.1em; font-weight: 800; color: #16a34a;">${user.score}</div>
                    <div style="font-size: 0.6em; color: #16a34a; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Điểm</div>
                </div>
            </div>
        `).join('');

        modal.innerHTML = `
            <div style="background: #f8fafc; width: 90%; max-width: 420px; border-radius: 32px; padding: 25px; box-shadow: 0 30px 70px rgba(0,0,0,0.4); animation: popModal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; position: relative; overflow: hidden;">
                <!-- Decorative element -->
                <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(108, 92, 231, 0.05); border-radius: 50%;"></div>
                
                <h3 style="margin-top: 0; color: #1e293b; display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; font-weight: 800; border-bottom: 2px dashed #e2e8f0; position: relative;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.4em;">🏆</span>
                        <div style="display: flex; flex-direction: column;">
                            <span>BẢNG VÀNG</span>
                            <span style="font-size: 0.45em; color: #64748b; letter-spacing: 1px;">CAO THỦ HÀNG ĐẦU</span>
                        </div>
                    </div>
                    <span style="font-size: 0.5em; background: #6c5ce7; color: white; padding: 6px 15px; border-radius: 20px; box-shadow: 0 4px 10px rgba(108, 92, 231, 0.3);">TOP 5</span>
                </h3>
                
                <div style="max-height: 420px; overflow-y: auto; padding: 15px 5px; margin-top: 5px; scrollbar-width: thin;">
                    ${listHTML}
                    <div style="text-align: center; margin-top: 15px; padding: 15px; background: #fff; border-radius: 16px; border: 1px dashed #cbd5e1;">
                        <div style="font-size: 0.85em; color: #64748b; font-weight: 600;">Bạn chưa có trong danh sách?</div>
                        <div style="font-size: 0.75em; color: #94a3b8;">Hãy cố gắng đạt điểm tối đa nhé! 🚀</div>
                    </div>
                </div>
                
                <button onclick="document.getElementById('leaderboardModal').remove()" style="margin-top: 20px; width: 100%; background: #1e293b; border: none; padding: 18px; border-radius: 20px; font-weight: 800; color: white; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 25px rgba(30, 41, 59, 0.2); font-size: 1em;" onmouseover="this.style.background='#0f172a'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='#1e293b'; this.style.transform='translateY(0)';" onmousedown="this.style.transform='scale(0.98)'">
                    QUAY LẠI
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
                #leaderboardModal div::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            </style>
        `;
        document.body.appendChild(modal);
    }
}
