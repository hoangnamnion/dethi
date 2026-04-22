import os
from PIL import Image

# ---------------------------------------------------------
# HƯỚNG DẪN DÙNG CHO CÁC DỰ ÁN WEB KHÁC:
# 1. Bỏ file này vào cùng chỗ với thư mục chứa ảnh của bạn.
# 2. Đổi 'img' thành tên thư mục ảnh của bạn ở biến dưới đayy.
# 3. Yêu cầu cài thư viện Pillow trước khi chạy (pip install Pillow).
# 4. Mở Terminal / PowerShell và chạy: python compress.py
# ---------------------------------------------------------

img_dir = 'anhnen' # <--- Thay tên thư mục ảnh vào đây!

def compress_images():
    if not os.path.exists(img_dir):
        print(f"Khong tim thay thu muc: {img_dir}")
        return

    # Lọc tất cả các file trong thư mục
    for filename in os.listdir(img_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg',)):
            filepath = os.path.join(img_dir, filename)
            filesize = os.path.getsize(filepath)
            
            # Lọc: Chỉ nén những ảnh mập mạp > 500KB 
            if filesize > 500 * 1024:
                try:
                    img = Image.open(filepath)
                    
                    # Giới hạn kích thước cực đại là 1200 pixel.
                    # Nét vô địch cho Web (Màn Full HD cũng chỉ cần 1920)
                    max_dim = 1200
                    if img.width > max_dim or img.height > max_dim:
                        ratio = min(max_dim / img.width, max_dim / img.height)
                        new_size = (int(img.width * ratio), int(img.height * ratio))
                        img = img.resize(new_size, Image.Resampling.LANCZOS)
                    
                    # Lưu chép đè lại đúng cái tên cũ
                    if filename.lower().endswith('.png'):
                        img.save(filepath, format="PNG", optimize=True)
                    else:
                        # JPG không hỗ trợ nền trong suốt nên lưu chuẩn Web 85%
                        img = img.convert('RGB')
                        img.save(filepath, format="JPEG", quality=85, optimize=True)
                        
                    new_size = os.path.getsize(filepath)
                    
                    print(f"[OK] Da nen thanh cong: {filename} ({filesize//1024}KB -> {new_size//1024}KB)")
                except Exception as e:
                    print(f"[ERROR] Loi file {filename}: {e}")

if __name__ == '__main__':
    print(f"Dang quet thu muc '{img_dir}'...")
    compress_images()
    print("Xong!")
