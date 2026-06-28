// File chứa cấu hình hệ thống & thông tin nhạy cảm
// Cấu hình Telegram đã được chuyển sang api-config.js để dùng chung cho toàn hệ thống

// 2. DANH SÁCH ĐỀ THI MẶC ĐỊNH (Dành cho ai không được gán đề riêng)
const DEFAULT_EXAMS = [
    { ten: 'Trang Chủ', url: 'index.html', IMG: 'img/muiten.jpg' },
    { file: 'cnxhkh1', ten: 'CNXHKH Chương I 1-20 câu' },
    { file: 'cnxhkh2', ten: 'CNXHKH Chương II 1-30 câu' },
    { file: 'cnxhkh3', ten: 'CNXHKH Chương II 31-65 câu' },
    { file: 'cnxhkh2.3', ten: 'Full Chương II CNXHKH' },
    { file: 'cnxhkh4', ten: 'CNXHKH Chương III 1-30 câu' },
    { file: 'cnxhkh5', ten: 'CNXHKH Chương III 31-50 câu' },
    { file: 'cnxhkh4.5', ten: 'Full Chương III CNXHKH' },
    { file: 'cnxhkh6', ten: 'CNXHKH Chương IV 1-30 câu' },
    { file: 'cnxhkh7', ten: 'CNXHKH Chương IV 31-50 câu' },
    { file: 'cnxhkh6.7', ten: 'Full Chương IV CNXHKH' },
    { file: 'cnxhkh8', ten: 'CNXHKH Chương V 1-30 câu' },
    { file: 'cnxhkh9', ten: 'CNXHKH Chương V 31-50 câu' },
    { file: 'cnxhkh8.9', ten: 'Full Chương V CNXHKH' },
    { file: 'cnxhkh10', ten: 'CNXHKH Chương VI 1-30 câu' },
    { file: 'cnxhkh11', ten: 'CNXHKH Chương VI 31-60 câu' },
    { file: 'cnxhkh10.11', ten: 'Full Chương VI CNXHKH' },
    { file: 'cnxhkh12', ten: 'CNXHKH Chương VII 1-30 câu' },
    { file: 'cnxhkh13', ten: 'CNXHKH Chương VII 31-55 câu' },
    { file: 'cnxhkh12.13', ten: 'Full Chương VII CNXHKH' },
    { file: 'cnxhkh', ten: 'Full VII Chương CNXHKH' },

];