// js/certificate.js
// ==========================================
// CHỨC NĂNG HIỂN THỊ BẰNG KHEN (CERTIFICATE)
// ==========================================

function showCertificate(userName, examName, score, total) {
    // Xóa modal cũ nếu có
    const oldModal = document.getElementById('certificateModal');
    if (oldModal) oldModal.remove();

    const today = new Date().toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const modal = document.createElement('div');
    modal.id = 'certificateModal';
    modal.style.cssText = `
        display: flex; position: fixed; top:0; left:0; width:100%; height:100%;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(15px); z-index: 100000; 
        justify-content: center; align-items: center;
        padding: 20px; overflow-y: auto;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div id="certificateWrapper" style="width: 100%; max-width: 600px; margin: auto; animation: certPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">
            <div id="certificateContainer" style="background: white; padding: 8px; border-radius: 12px; box-shadow: 0 0 60px rgba(212, 175, 55, 0.6), 0 20px 40px rgba(0,0,0,0.3); position: relative;">
                
                <!-- Outer Border with Gradient -->
                <div style="padding: 5px; background: linear-gradient(135deg, #d4af37 0%, #f9e084 50%, #d4af37 100%); border-radius: 8px;">
                    <div style="border: 3px solid #d4af37; padding: 30px 20px; text-align: center; background: linear-gradient(180deg, #fffef7 0%, #fffcf0 100%); position: relative; border-radius: 4px; overflow: hidden;">
                        
                        <!-- Background Pattern -->
                        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.03; background-image: radial-gradient(circle, #d4af37 1px, transparent 1px); background-size: 20px 20px; pointer-events: none;"></div>

                        <!-- Decorative Corners -->
                        <div style="position: absolute; top: 15px; left: 15px; width: 30px; height: 30px; border-top: 3px solid #d4af37; border-left: 3px solid #d4af37;"></div>
                        <div style="position: absolute; top: 15px; right: 15px; width: 30px; height: 30px; border-top: 3px solid #d4af37; border-right: 3px solid #d4af37;"></div>
                        <div style="position: absolute; bottom: 15px; left: 15px; width: 30px; height: 30px; border-bottom: 3px solid #d4af37; border-left: 3px solid #d4af37;"></div>
                        <div style="position: absolute; bottom: 15px; right: 15px; width: 30px; height: 30px; border-bottom: 3px solid #d4af37; border-right: 3px solid #d4af37;"></div>

                        <!-- Header -->
                        <div style="position: relative; z-index: 1;">
                            <div style="font-family: 'Times New Roman', serif; font-size: 0.75em; font-weight: bold; color: #b8860b; letter-spacing: 2px; margin-bottom: 5px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                            <div style="font-family: 'Times New Roman', serif; font-size: 0.65em; font-weight: bold; color: #1e293b; margin-bottom: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">HỆ THỐNG THI TRẮC NGHIỆM ĐIỆN TỬ 2026</div>

                            <div style="font-family: 'Times New Roman', serif; font-size: 1.2em; font-weight: bold; color: #b8860b; letter-spacing: 1px; margin-bottom: 5px;">GIẤY CHỨNG NHẬN</div>
                            <h1 style="font-family: 'Montserrat', sans-serif; font-size: 2em; margin: 10px 0; color: #1e293b; font-weight: 800; background: linear-gradient(135deg, #d4af37, #f9e084, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">TUYÊN DƯƠNG</h1>
                            
                            <p style="font-size: 0.9em; color: #64748b; font-style: italic; margin-bottom: 5px;">Ban quản trị vinh dự chứng nhận:</p>
                            
                            <h2 style="font-family: 'Times New Roman', serif; font-size: 2.2em; color: #d63031; margin: 10px 0; font-weight: bold; text-shadow: 0 2px 4px rgba(214, 48, 49, 0.2); position: relative; display: inline-block;">
                                ${userName}
                                <div style="position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); width: 80%; height: 2px; background: linear-gradient(90deg, transparent, #d4af37, transparent);"></div>
                            </h2>
                            
                            <p style="font-size: 0.9em; color: #64748b; margin: 15px 0 5px;">Đã xuất sắc đạt điểm tuyệt đối bài thi:</p>
                            <h3 style="font-size: 1.2em; color: #1e293b; font-weight: 800; background: linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(249,224,132,0.15) 100%); padding: 10px 20px; border-radius: 50px; margin: 10px 0; display: inline-block; border: 1px solid rgba(212,175,55,0.3);">${examName}</h3>
                            
                            <div style="margin: 30px 0; display: flex; justify-content: space-around; align-items: center;">
                                <div style="text-align: center;">
                                    <div style="font-weight: 900; font-size: 2em; color: #00b894; text-shadow: 0 2px 8px rgba(0,184,148,0.3);">${score}/${total}</div>
                                    <div style="font-size: 0.75em; color: #94a3b8; font-weight: 800; letter-spacing: 1px;">KẾT QUẢ</div>
                                </div>
                                
                                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #fff 0%, #fffcf0 100%); border: 4px double #d63031; border-radius: 50%; display: flex; align-items: center; justify-content: center; transform: rotate(-15deg); box-shadow: 0 4px 15px rgba(214,48,49,0.3);">
                                    <div style="text-align: center; font-weight: bold; font-size: 0.5em; color: #d63031;">
                                        <span style="font-size: 1.4em;">✅</span><br>
                                        ĐÃ KIỂM<br>CHỨNG
                                    </div>
                                </div>

                                <div style="text-align: center;">
                                    <div style="font-weight: 800; font-size: 0.9em; color: #1e293b;">${today}</div>
                                    <div style="font-size: 0.75em; color: #94a3b8; font-weight: 800; letter-spacing: 1px;">NGÀY CẤP</div>
                                </div>
                            </div>

                            <div style="font-family: 'Times New Roman', serif; font-style: italic; color: #b8860b; font-weight: bold; font-size: 1em; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 10px;">
                                "Kiến thức là sức mạnh"
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Nút bấm cố định -->
        <div id="certButtons" style="position: fixed; bottom: 0; left: 0; width: 100%; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); padding: 15px; display: flex; gap: 10px; box-shadow: 0 -10px 30px rgba(0,0,0,0.2); z-index: 100001; border-radius: 20px 20px 0 0;">
            <button onclick="document.getElementById('certificateModal').remove()" style="flex: 1; background: #f1f5f9; color: #475569; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s;">ĐÓNG</button>
            <button onclick="handlePrintCert()" style="flex: 1; background: #1e293b; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 15px rgba(30,41,59,0.4);">🖨️ IN</button>
            <button id="btnDownloadCert" onclick="downloadCertAsImage()" style="flex: 2; background: linear-gradient(135deg, #d4af37, #b8860b); color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4); transition: all 0.2s;">🖼️ TẢI ẢNH VỀ</button>
        </div>

        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes certPop {
                0% { transform: scale(0.7) translateY(80px); opacity: 0; filter: blur(10px); }
                100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
            }
            @media print {
                body * { visibility: hidden; }
                #certificateModal, #certificateModal * { visibility: visible; }
                #certificateModal { position: fixed; left: 0; top: 0; width: 100%; height: 100%; background: white; padding: 0; align-items: center; justify-content: center; }
                #certButtons { display: none; }
            }
        </style>
    `;
    document.body.appendChild(modal);

    // Focus vào modal để ngăn scroll phía sau
    modal.focus();
}

function handlePrintCert() {
    window.print();
}

async function downloadCertAsImage() {
    const btn = document.getElementById('btnDownloadCert');
    if (!btn) return;
    
    const originalText = btn.innerText;
    btn.innerText = "⏳ ĐANG TẠO ẢNH...";
    btn.disabled = true;
    btn.style.opacity = '0.7';

    const element = document.getElementById('certificateContainer');
    if (!element) {
        alert("Không tìm thấy nội dung bằng khen.");
        resetButton(btn, originalText);
        return;
    }

    try {
        // Đảm bảo html2canvas đã được load
        if (typeof html2canvas === 'undefined') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        }

        window.scrollTo(0, 0);

        const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            logging: false,
            onclone: (clonedDoc) => {
                // Điều chỉnh style cho ảnh chụp đẹp hơn
                const clonedElement = clonedDoc.getElementById('certificateContainer');
                if (clonedElement) {
                    clonedElement.style.boxShadow = 'none';
                }
            }
        });

        const imageData = canvas.toDataURL('image/png');
        
        // Tạo preview overlay
        showImagePreview(imageData, originalText, btn);
        
        // Tự động tải về (cho desktop)
        triggerDownload(imageData);

    } catch (err) {
        console.error("Lỗi tạo ảnh:", err);
        alert("Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại hoặc chụp màn hình.");
        resetButton(btn, originalText);
    }
}

function showImagePreview(imageData, originalText, btn) {
    // Xóa preview cũ nếu có
    const oldPreview = document.getElementById('certPreviewOverlay');
    if (oldPreview) oldPreview.remove();

    const previewOverlay = document.createElement('div');
    previewOverlay.id = 'certPreviewOverlay';
    previewOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); backdrop-filter: blur(10px); z-index: 100002;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        padding: 20px; animation: fadeIn 0.3s;
    `;
    
    previewOverlay.innerHTML = `
        <div style="font-weight: 800; font-size: 1.2em; color: #f9e084; margin-bottom: 10px; text-align: center;">✅ ĐÃ TẠO XONG ẢNH</div>
        <div style="font-size: 0.85em; color: #fff; margin-bottom: 20px; text-align: center; padding: 10px 15px; background: rgba(214,48,49,0.2); border-radius: 8px; border: 1px solid rgba(214,48,49,0.5);">
            💡 <strong>Mẹo:</strong> Chạm và giữ vào ảnh bên dưới,<br>sau đó chọn <strong>"Lưu vào ảnh"</strong> hoặc <strong>"Tải về"</strong>
        </div>
        
        <img src="${imageData}" style="width: 100%; max-height: 65vh; object-fit: contain; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 2px solid rgba(212,175,55,0.5);">
        
        <button onclick="document.getElementById('certPreviewOverlay').remove()" 
                style="margin-top: 25px; background: linear-gradient(135deg, #1e293b, #334155); color: white; border: none; padding: 15px 40px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; max-width: 400px; transition: all 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.3);"
                onmouseover="this.style.transform='translateY(-2px)'" 
                onmouseout="this.style.transform='translateY(0)'">
            QUAY LẠI
        </button>
    `;
    
    document.body.appendChild(previewOverlay);
    resetButton(btn, originalText);
}

function triggerDownload(imageData) {
    try {
        const link = document.createElement('a');
        link.download = 'Bang-Khen-Online.png';
        link.href = imageData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        console.log("Tự động tải không được hỗ trợ, người dùng có thể lưu thủ công từ preview.");
    }
}

function resetButton(btn, originalText) {
    if (btn) {
        btn.innerText = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}

function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Không thể tải ${url}`));
        document.head.appendChild(script);
    });
}