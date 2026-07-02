import os
import json
import time
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Cho phép request từ frontend

# Thư mục chứa database JSON
DATA_DIR = 'data'
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# ==========================================
# CÁC HÀM HỖ TRỢ ĐỌC/GHI JSON
# ==========================================
def get_filepath(filename):
    return os.path.join(DATA_DIR, filename)

def load_json(filename, default_value):
    filepath = get_filepath(filename)
    if not os.path.exists(filepath):
        return default_value
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return default_value

def save_json(filename, data):
    filepath = get_filepath(filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def get_vietnam_time():
    vn_time = datetime.utcnow() + timedelta(hours=7)
    return vn_time.strftime("%H:%M:%S %d/%m/%Y")

def get_vietnam_time_short():
    vn_time = datetime.utcnow() + timedelta(hours=7)
    return vn_time.strftime("%H:%M")

# ==========================================
# DATABASE TRÊN RAM (TỐC ĐỘ BÀN THỜ - XÓA KHI RESTART)
# Thay thế cho Cache API
# ==========================================
live_students = {}
online_users = {}

# ==========================================
# API ĐĂNG KÝ / ĐĂNG NHẬP GIAO DIỆN MỚI TẠO BẰNG PYTHON
# ==========================================
@app.route('/api/accounts', methods=['GET', 'POST'])
def handle_accounts_modern():
    if request.method == 'GET':
        accounts_dict = load_json('accounts.json', {})
        accounts_list = [{"id": "-", "username": k, "name": v.get("name", "")} for k, v in accounts_dict.items()]
        return jsonify({'accounts': accounts_list})
        
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Thiếu username hoặc password'}), 400
        
        accounts = load_json('accounts.json', {})
        if data['username'] in accounts:
            return jsonify({'error': 'Username đã tồn tại'}), 409
            
        accounts[data['username']] = {"pass": data['password'], "name": data.get('name', '')}
        save_json('accounts.json', accounts)
        return jsonify({'message': 'Lưu tài khoản thành công!'}), 201

@app.route('/api/login', methods=['POST'])
def handle_login_modern():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Thiếu thông tin đăng nhập!'}), 400
        
    accounts = load_json('accounts.json', {})
    if data['username'] not in accounts:
        return jsonify({'error': 'Tài khoản không tồn tại!'}), 404
        
    if accounts[data['username']]['pass'] != data['password']:
        return jsonify({'error': 'Sai mật khẩu!'}), 401
        
    name = accounts[data['username']].get("name", data['username'])
    return jsonify({'message': f'Đăng nhập thành công! Xin chào {name} 🎉'}), 200

# ==========================================
# SUPER API - THAY THẾ TOÀN BỘ EXAM-API.JS (CLOUDFLARE)
# ==========================================
@app.route('/', methods=['GET', 'POST'])
def exam_api():
    action = request.args.get('action')
    
    # ------------------ XỬ LÝ POST ------------------
    if request.method == 'POST':
        # Hàm sendBeacon() của trình duyệt hay gửi dưới dạng text/plain thay vì application/json
        try:
            body = request.get_json(force=True)
            if body is None:
                body = json.loads(request.data.decode('utf-8'))
        except:
            try:
                body = json.loads(request.data.decode('utf-8'))
            except:
                body = {}
                
        post_action = body.get('action') or action
        
        # 1. Update Accounts
        if post_action == 'updateAccounts':
            save_json('accounts.json', body.get('data', {}))
            return jsonify({'success': True, 'message': 'Đã lưu tài khoản lên Server Python!'})
            
        # 2. Log Activity
        elif post_action == 'logActivity':
            log = load_json('activity_log.json', [])
            log.insert(0, {
                'username': body.get('username', 'Unknown'),
                'text': body.get('text', ''),
                'device': body.get('device', ''),
                'time': get_vietnam_time()
            })
            if len(log) > 200: log = log[:200]
            save_json('activity_log.json', log)
            return jsonify({'success': True})
            
        # 3. Update Live Status (Thi trực tuyến)
        elif post_action == 'updateLiveStatus':
            data = body.get('data', {})
            username = data.get('username')
            if username:
                live_students[username] = {
                    'name': data.get('name', username),
                    'username': username,
                    'examName': data.get('examName', ''),
                    'rawScore': data.get('rawScore', '0/0'),
                    'time': get_vietnam_time_short(),
                    'timestamp': time.time()
                }
            return jsonify({'success': True})
            
        # 4. Login Session
        elif post_action == 'loginSession':
            return jsonify({'success': True})
            
        # 5. Clear Leaderboard
        elif post_action == 'clearLeaderboard':
            examName = body.get('examName')
            board_data = load_json('leaderboard.json', {})
            if examName and examName in board_data:
                del board_data[examName]
            elif not examName:
                board_data = {}
            save_json('leaderboard.json', board_data)
            return jsonify({'success': True, 'message': 'Đã xóa BXH!'})
            
        return jsonify({'error': 'Unknown POST action: ' + str(post_action)})

    # ------------------ XỬ LÝ GET ------------------
    else:
        # Legacy Leaderboard Submit (?username=X&score=Y)
        if not action and request.args.get('username') and request.args.get('score'):
            username = request.args.get('username')
            examName = request.args.get('examName', 'default')
            board_data = load_json('leaderboard.json', {})
            if examName not in board_data: 
                board_data[examName] = []
                
            entry = {
                'name': username,
                'rawScore': request.args.get('score'),
                'time': get_vietnam_time(),
                'ip': request.args.get('ip', ''),
                'device': request.args.get('device', '')
            }
            
            idx = next((i for i, e in enumerate(board_data[examName]) if e['name'] == username), -1)
            if idx != -1: 
                board_data[examName][idx] = entry
            else: 
                board_data[examName].append(entry)
                
            save_json('leaderboard.json', board_data)
            return jsonify({'success': True})

        # Xử lý các action GET
        if action == 'getAccounts':
            return jsonify(load_json('accounts.json', {}))
            
        elif action == 'getActivityLog':
            return jsonify(load_json('activity_log.json', []))
            
        elif action == 'getLiveMonitor':
            now = time.time()
            active = [v for v in live_students.values() if now - v['timestamp'] < 60]
            return jsonify(active)
            
        elif action == 'getOnlineUsers':
            now = time.time()
            active = [k for k, v in online_users.items() if now - v < 240]
            return jsonify({'users': active, 'onlineCount': len(active)})
            
        elif action == 'syncUserStatus' or action == 'pingOnline':
            username = request.args.get('username')
            if username:
                online_users[username] = time.time()
            return jsonify({'success': True, 'valid': True})
            
        elif action == 'offlineUser':
            username = request.args.get('username')
            if username in online_users:
                del online_users[username]
            return jsonify({'success': True})
            
        elif action == 'getLeaderboard':
            examName = request.args.get('examName')
            board_data = load_json('leaderboard.json', {})
            if examName:
                return jsonify(board_data.get(examName, []))
            else:
                all_boards = []
                for lst in board_data.values():
                    all_boards.extend(lst)
                return jsonify(all_boards)
                
        # Default
        return jsonify({'status': 'ok', 'message': '🚀 Python Exam API Worker is running!'})

if __name__ == '__main__':
    # Tạo sẵn file nếu chưa có
    load_json('accounts.json', {"admin": {"pass": "hoangnam123", "name": "Cao Văn Nam"}})
    
    port = int(os.environ.get('SERVER_PORT', 25635))
    print(f"[*] Server FULL API dang chay tai cong {port}...")
    app.run(host='0.0.0.0', port=port)
