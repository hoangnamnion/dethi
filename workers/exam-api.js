// =====================================================
// CLOUDFLARE WORKER — EXAM API
// Thay thế toàn bộ Google Apps Script
// Deploy: Paste vào Cloudflare Dashboard hoặc dùng Wrangler
// KV Binding cần tạo: DB
// =====================================================

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    try {
      let result;

      if (request.method === 'POST') {
        let body = {};
        try {
          const text = await request.text();
          body = JSON.parse(text);
        } catch (e) { }

        const postAction = body.action || action;

        switch (postAction) {
          case 'updateAccounts':
            result = await updateAccounts(env, body.data);
            break;
          case 'logActivity':
            result = await logActivity(env, body);
            break;
          case 'updateLiveStatus':
            result = await updateLiveStatus(env, body.data);
            break;
          case 'loginSession':
            result = await loginSession(env, body);
            break;
          case 'clearLeaderboard':
            result = await clearLeaderboard(env, body.examName);
            break;
          default:
            result = { error: 'Unknown POST action: ' + postAction };
        }
      } else {
        // GET requests
        // Leaderboard submit (legacy format): ?username=X&score=Y (no action)
        if (!action && url.searchParams.get('username') && url.searchParams.get('score')) {
          result = await submitScore(env, {
            username: url.searchParams.get('username'),
            examName: url.searchParams.get('examName'),
            score: url.searchParams.get('score'),
            ip: url.searchParams.get('ip'),
            device: url.searchParams.get('device')
          });
        } else {
          switch (action) {
            case 'getAccounts':
              result = await getAccounts(env);
              break;
            case 'getActivityLog':
              result = await getActivityLog(env);
              break;
            case 'getLiveMonitor':
              result = await getLiveMonitor(env);
              break;
            case 'getOnlineUsers':
              result = await getOnlineUsers(env);
              break;
            case 'syncUserStatus': {
              const username = url.searchParams.get('username');
              const deviceId = url.searchParams.get('deviceId');
              result = await syncUserStatus(env, username, deviceId);
              break;
            }
            case 'offlineUser': {
              const username = url.searchParams.get('username');
              result = await offlineUser(env, username);
              break;
            }
            case 'getLeaderboard':
              result = await getLeaderboard(env, url.searchParams.get('examName'));
              break;
            default:
              result = { status: 'ok', message: '🚀 Exam API Worker is running!' };
          }
        }
      }

      return jsonResponse(result);
    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  }
};

// =====================================================
// CORS & Response helpers
// =====================================================
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
  });
}

// =====================================================
// ACCOUNTS — Quản lý tài khoản
// =====================================================
async function getAccounts(env) {
  const data = await env.DB.get('accounts', 'json');
  return data || {};
}

async function updateAccounts(env, data) {
  if (!data) return { error: 'No data provided' };
  await env.DB.put('accounts', JSON.stringify(data));
  return { success: true, message: 'Đã lưu tài khoản lên Server!' };
}

// =====================================================
// ACTIVITY LOG — Nhật ký hoạt động
// =====================================================
async function logActivity(env, body) {
  const log = await env.DB.get('activity_log', 'json') || [];

  const entry = {
    username: body.username || 'Unknown',
    text: body.text || '',
    device: body.device || '',
    time: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
  };

  log.unshift(entry);
  if (log.length > 200) log.length = 200;

  await env.DB.put('activity_log', JSON.stringify(log));
  return { success: true };
}

async function getActivityLog(env) {
  const log = await env.DB.get('activity_log', 'json');
  return log || [];
}

// =====================================================
// LIVE MONITOR — Giám sát thi trực tuyến
// =====================================================
async function updateLiveStatus(env, data) {
  if (!data || !data.username) return { error: 'Missing username' };

  const allLive = await env.DB.get('live_students', 'json') || {};

  allLive[data.username] = {
    name: data.name || data.username,
    username: data.username,
    examName: data.examName || '',
    rawScore: data.rawScore || '0/0',
    time: data.time || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    timestamp: Date.now()
  };

  // Xóa entries hết hạn (quá 60 giây không cập nhật)
  const now = Date.now();
  for (const key of Object.keys(allLive)) {
    if (now - allLive[key].timestamp > 60000) {
      delete allLive[key];
    }
  }

  await env.DB.put('live_students', JSON.stringify(allLive));
  return { success: true };
}

async function getLiveMonitor(env) {
  const allLive = await env.DB.get('live_students', 'json') || {};

  const now = Date.now();
  const active = [];
  for (const val of Object.values(allLive)) {
    if (now - val.timestamp < 60000) {
      active.push(val);
    }
  }

  return active;
}

// =====================================================
// LEADERBOARD — Bảng xếp hạng
// =====================================================
async function submitScore(env, data) {
  if (!data.username || !data.score) return { error: 'Missing data' };

  const examKey = `leaderboard:${data.examName || 'default'}`;
  const board = await env.DB.get(examKey, 'json') || [];

  const entry = {
    name: data.username,
    rawScore: data.score,
    time: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    ip: data.ip || '',
    device: data.device || ''
  };

  // Tìm và cập nhật entry cũ, hoặc thêm mới
  const existingIdx = board.findIndex(e => e.name === data.username);
  if (existingIdx !== -1) {
    board[existingIdx] = entry;
  } else {
    board.push(entry);
  }

  if (board.length > 500) board.length = 500;

  await env.DB.put(examKey, JSON.stringify(board));
  return { success: true };
}

async function getLeaderboard(env, examName) {
  if (!examName) {
    // Trả tất cả leaderboard gộp lại
    const keys = await env.DB.list({ prefix: 'leaderboard:' });
    let all = [];
    for (const key of keys.keys) {
      const data = await env.DB.get(key.name, 'json');
      if (data) all = all.concat(data);
    }
    return all;
  }

  const board = await env.DB.get(`leaderboard:${examName}`, 'json');
  return board || [];
}

async function clearLeaderboard(env, examName) {
  if (examName) {
    await env.DB.delete(`leaderboard:${examName}`);
    return { success: true, message: `Đã xóa BXH cho đề: ${examName}` };
  } else {
    const keys = await env.DB.list({ prefix: 'leaderboard:' });
    for (const key of keys.keys) {
      await env.DB.delete(key.name);
    }
    return { success: true, message: 'Đã xóa toàn bộ bảng xếp hạng!' };
  }
}

// =====================================================
// ONLINE TRACKING & SESSION CHECK
// =====================================================
async function loginSession(env, data) {
  if (!data || !data.username || !data.deviceId) return { error: 'Missing data' };
  const activeSessions = await env.DB.get('active_sessions', 'json') || {};
  activeSessions[data.username] = data.deviceId;
  await env.DB.put('active_sessions', JSON.stringify(activeSessions));
  return { success: true };
}

async function syncUserStatus(env, username, deviceId) {
  if (!username) return { error: 'Missing username' };

  const now = Date.now();

  const activeSessions = await env.DB.get('active_sessions', 'json') || {};
  const lockedAccounts = await env.DB.get('locked_accounts', 'json') || {};

  // 1. Kiểm tra tài khoản bị khóa
  if (lockedAccounts[username] && now < lockedAccounts[username]) {
    return { valid: false, action: 'logout', message: 'Phát hiện tài khoản đăng nhập trên nhiều thiết bị cùng lúc! Tất cả đã bị khóa tạm thời 1 phút.' };
  }

  // Dọn dẹp khóa cũ
  let needsLockCleanup = false;
  for (const key of Object.keys(lockedAccounts)) {
    if (now > lockedAccounts[key]) {
      delete lockedAccounts[key];
      needsLockCleanup = true;
    }
  }
  if (needsLockCleanup) await env.DB.put('locked_accounts', JSON.stringify(lockedAccounts));

  // 2. Kiểm tra đăng nhập nhiều thiết bị
  if (deviceId && activeSessions[username] && activeSessions[username] !== deviceId) {
    lockedAccounts[username] = now + 60000;
    await env.DB.put('locked_accounts', JSON.stringify(lockedAccounts));
    return { valid: false, action: 'logout', message: 'Phát hiện tài khoản đăng nhập trên nhiều thiết bị cùng lúc! Tất cả đã bị khóa tạm thời 1 phút.' };
  }

  // 3. Nếu chưa có session, cập nhật session (chỉ ghi 1 lần khi login)
  if (deviceId && !activeSessions[username]) {
    activeSessions[username] = deviceId;
    await env.DB.put('active_sessions', JSON.stringify(activeSessions));
  }

  // =====================================================
  // ONLINE TRACKING — Dùng Cache API thay vì KV
  // Cache API KHÔNG tốn KV write quota!
  // =====================================================
  const cacheKey = new Request('https://online-tracker.internal/online_users');
  const cache = caches.default;

  let allOnline = {};
  const cached = await cache.match(cacheKey);
  if (cached) {
    try { allOnline = await cached.json(); } catch(e) {}
  }

  allOnline[username] = { username, timestamp: now };

  // Dọn user offline (quá 4 phút không ping)
  for (const key of Object.keys(allOnline)) {
    if (now - allOnline[key].timestamp > 240000) delete allOnline[key];
  }

  // Lưu vào Cache (TTL 5 phút, không tốn KV write!)
  await cache.put(cacheKey, new Response(JSON.stringify(allOnline), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=300' }
  }));

  return { success: true, valid: true };
}

async function offlineUser(env, username) {
  if (!username) return { error: 'Missing username' };

  const cacheKey = new Request('https://online-tracker.internal/online_users');
  const cache = caches.default;

  let allOnline = {};
  const cached = await cache.match(cacheKey);
  if (cached) {
    try { allOnline = await cached.json(); } catch(e) {}
  }

  delete allOnline[username];

  await cache.put(cacheKey, new Response(JSON.stringify(allOnline), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=300' }
  }));

  return { success: true };
}

async function getOnlineUsers(env) {
  const cacheKey = new Request('https://online-tracker.internal/online_users');
  const cache = caches.default;

  let allOnline = {};
  const cached = await cache.match(cacheKey);
  if (cached) {
    try { allOnline = await cached.json(); } catch(e) {}
  }

  const now = Date.now();
  const active = [];
  for (const val of Object.values(allOnline)) {
    if (now - val.timestamp < 240000) {
      active.push(val.username);
    }
  }

  return { users: active, onlineCount: active.length };
}

