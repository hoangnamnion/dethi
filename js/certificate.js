// js/certificate.js
// ==========================================
// CHỨC NĂNG HIỂN THỊ BẰNG KHEN (CERTIFICATE)
// ==========================================

function showCertificate(userName, examName, score, total) {
    let modal = document.getElementById('certificateModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'certificateModal';
        modal.style.cssText = `
            display: flex; position: fixed; top:0; left:0; width:100%; height:100%;
            background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); z-index: 100000; 
            justify-content: center; align-items: flex-start;
            padding: 10px; overflow-y: auto;
        `;
        
        const today = new Date().toLocaleDateString('vi-VN');

        modal.innerHTML = `
            <div id="certificateWrapper" style="width: 100%; max-width: 500px; margin-top: 20px; margin-bottom: 100px; animation: certPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
                <div id="certificateContainer" style="background: white; padding: 5px; border-radius: 4px; box-shadow: 0 0 40px rgba(255, 215, 0, 0.5); position: relative;">
                    <div style="border: 10px double #d4af37; padding: 25px 15px; text-align: center; background: #fffcf0; position: relative; border-radius: 2px;">
                        
                        <!-- Decorative Corners -->
                        <div style="position: absolute; top: 10px; left: 10px; font-size: 1.5em; color: #d4af37;">⚜️</div>
                        <div style="position: absolute; top: 10px; right: 10px; font-size: 1.5em; color: #d4af37;">⚜️</div>
                        <div style="position: absolute; bottom: 10px; left: 10px; font-size: 1.5em; color: #d4af37;">⚜️</div>
                        <div style="position: absolute; bottom: 10px; right: 10px; font-size: 1.5em; color: #d4af37;">⚜️</div>

                        <div style="font-family: 'Times New Roman', serif; font-size: 0.8em; font-weight: bold; color: #d4af37; letter-spacing: 2px; margin-bottom: 5px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                        <div style="font-family: 'Times New Roman', serif; font-size: 0.7em; font-weight: bold; color: #1e293b; margin-bottom: 20px;">HỆ THỐNG THI TRẮC NGHIỆM ĐIỆN TỬ 2026</div>

                        <div style="font-family: 'Times New Roman', serif; font-size: 1.1em; font-weight: bold; color: #d4af37; letter-spacing: 1px;">GIẤY CHỨNG NHẬN</div>
                        <h1 style="font-family: 'Montserrat', sans-serif; font-size: 1.8em; margin: 10px 0; color: #1e293b; font-weight: 800;">TUYÊN DƯƠNG</h1>
                        
                        <p style="font-size: 0.9em; color: #64748b; font-style: italic;">Ban quản trị vinh dự chứng nhận:</p>
                        
                        <h2 style="font-family: 'Times New Roman', serif; font-size: 1.8em; color: #d63031; margin: 10px 0; border-bottom: 2px double #d4af37; display: inline-block; padding: 0 20px; font-weight: bold;">${userName}</h2>
                        
                        <p style="font-size: 0.9em; color: #64748b; margin: 10px 0;">Đã xuất sắc đạt điểm tuyệt đối bài thi:</p>
                        <h3 style="font-size: 1.1em; color: #1e293b; font-weight: 800; background: rgba(212, 175, 55, 0.1); padding: 8px; border-radius: 8px; margin: 5px 0;">${examName}</h3>
                        
                        <div style="margin: 25px 0; display: flex; justify-content: space-around; align-items: center;">
                            <div style="text-align: center;">
                                <div style="font-weight: 900; font-size: 1.5em; color: #00b894;">${score}/${total}</div>
                                <div style="font-size: 0.7em; color: #94a3b8; font-weight: 800;">KẾT QUẢ</div>
                            </div>
                            
                            <div style="width: 70px; height: 70px; border: 3px solid #d63031; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #d63031; font-weight: bold; font-size: 0.5em; transform: rotate(-15deg); border-style: double;">
                                <div style="text-align: center;">ĐÃ KIỂM CHỨNG<br>2026</div>
                            </div>

                            <div style="text-align: center;">
                                <div style="font-weight: 800; font-size: 0.9em; color: #1e293b;">${today}</div>
                                <div style="font-size: 0.7em; color: #94a3b8; font-weight: 800;">NGÀY CẤP</div>
                            </div>
                        </div>

                        <div style="font-family: 'Times New Roman', serif; font-style: italic; color: #d4af37; font-weight: bold; font-size: 0.9em;">
                            "Kiến thức là sức mạnh"
                        </div>
                    </div>
                </div>
            </div>

            <!-- Nút bấm cố định ở dưới cùng -->
            <div id="certButtons" style="position: fixed; bottom: 0; left: 0; width: 100%; background: white; padding: 15px; display: flex; gap: 10px; box-shadow: 0 -10px 30px rgba(0,0,0,0.2); z-index: 100001; border-radius: 20px 20px 0 0;">
                <button onclick="document.getElementById('certificateModal').remove()" style="flex: 1; background: #f1f5f9; color: #475569; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer;">ĐÓNG</button>
                <button id="btnDownloadCert" onclick="downloadCertAsImage()" style="flex: 2; background: #d4af37; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);">🖼️ TẢI ẢNH VỀ</button>
            </div>

            <style>
                @keyframes certPop {
                    0% { transform: scale(0.8) translateY(50px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @media print {
                    body * { visibility: hidden; }
                    #certificateContainer, #certificateContainer * { visibility: visible; }
                    #certificateContainer { position: fixed; left: 0; top: 0; width: 100%; box-shadow: none; }
                }
            </style>
        `;
        document.body.appendChild(modal);
    }
}

function downloadCertAsImage() {
    const btn = document.getElementById('btnDownloadCert');
    const originalText = btn.innerText;
    btn.innerText = "⏳ ĐANG TẠO ẢNH...";
    btn.disabled = true;

    const element = document.getElementById('certificateContainer');
    
    // Đảm bảo ảnh hiển thị đầy đủ trước khi chụp
    window.scrollTo(0, 0);

    html2canvas(element, {
        scale: 3, // Tăng chất lượng ảnh cực nét
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false
    }).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        
        // Tạo một vùng hiển thị ảnh mới để người dùng nhấn giữ lưu
        const previewOverlay = document.createElement('div');
        previewOverlay.id = 'certPreviewOverlay';
        previewOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: white; z-index: 100002; display: flex; flex-direction: column;
            align-items: center; justify-content: center; padding: 20px;
            animation: fadeIn 0.3s;
        `;
        
        previewOverlay.innerHTML = `
            <div style="font-weight: 800; color: #1e293b; margin-bottom: 10px; text-align: center;">✅ ĐÃ TẠO XONG ẢNH</div>
            <div style="font-size: 0.85em; color: #d63031; margin-bottom: 15px; text-align: center; font-weight: bold;">
                Mẹo: CHẠM VÀ GIỮ VÀO ẢNH DƯỚI ĐÂY <br> RỒI CHỌN "LƯU VÀO ẢNH" HOẶC "TẢI VỀ"
            </div>
            
            <img src="${imageData}" style="width: 100%; max-height: 70vh; object-fit: contain; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border-radius: 8px;">
            
            <button onclick="document.getElementById('certPreviewOverlay').remove()" style="margin-top: 25px; background: #1e293b; color: white; border: none; padding: 15px 40px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%;">
                QUAY LẠI
            </button>
        `;
        
        document.body.appendChild(previewOverlay);
        
        btn.innerText = originalText;
        btn.disabled = false;

        // Cố gắng tự động tải nếu trình duyệt hỗ trợ (PC)
        const link = document.createElement('a');
        link.download = 'Bằng-Khen-Online.png';
        link.href = imageData;
        link.click();

    }).catch(err => {
        console.error("Lỗi tạo ảnh:", err);
        alert("Có lỗi xảy ra khi tạo ảnh. Bạn hãy chụp màn hình nhé!");
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

function handleCaptureCert() {
    window.print();
}
