// =====================================================
// CLOUDFLARE WORKER — ONLINE TRACKER RIÊNG BIỆT
// Dùng để khắc phục lỗi 0 Online khi có nhiều người dùng.
// Không dùng mảng chung để tránh bị ghi đè dữ liệu.
// =====================================================

// Hàm hỗ trợ trả về JSON
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// Bắt đầu xử lý Request
export default {
  async fetch(request, env) {
    // 1. Xử lý CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    try {
      const url = new URL(request.url);
      const action = url.searchParams.get('action');

      if (request.method === 'GET') {
        if (action === 'pingOnline') {
          const username = url.searchParams.get('username');
          if (!username) return jsonResponse({ error: 'Missing username' }, 400);

          // Cập nhật KV của riêng user đó, tự động xóa sau 3 phút (180 giây)
          // KV expirationTtl giúp ta không cần phải có vòng lặp xóa user offline!
          await env.DB.put(`online:${username}`, JSON.stringify({ timestamp: Date.now() }), { expirationTtl: 180 });
          
          return jsonResponse({ success: true, valid: true });
        }
        
        if (action === 'offlineUser') {
          const username = url.searchParams.get('username');
          if (username) {
            await env.DB.delete(`online:${username}`);
          }
          return jsonResponse({ success: true });
        }

        if (action === 'getOnlineUsers') {
          // Lấy tất cả các keys có tiền tố 'online:'
          const keys = await env.DB.list({ prefix: 'online:' });
          const active = [];
          
          for (const key of keys.keys) {
            // Tên user là phần đằng sau 'online:'
            const username = key.name.substring(7);
            if (username) {
              active.push(username);
            }
          }

          return jsonResponse({ users: active, onlineCount: active.length });
        }
      }

      return jsonResponse({ error: 'Endpoint not found' }, 404);

    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  }
};
