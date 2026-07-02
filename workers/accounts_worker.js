// ==========================================
// CLOUDFLARE WORKER - REVERSE PROXY (TRUNG GIAN)
// Biến HTTP (không bảo mật) thành HTTPS (Bảo mật)
// Không cần dùng đến KV!
// ==========================================

// Điền địa chỉ Server Pikamc của bạn vào đây:
const PIKAMC_URL = "http://arc.pikamc.vn:25635";

export default {
  async fetch(request) {
    // 1. Cấu hình CORS chống nghẽn từ Netlify
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    
    // Gắn đường dẫn (/api/accounts) vào đuôi link của Pikamc
    const targetUrl = PIKAMC_URL + url.pathname + url.search;

    try {
      // 2. Bọc lại request gửi từ Netlify
      const init = {
        method: request.method,
        headers: request.headers,
      };

      // Chỉ móc ruột (body) nếu là POST
      if (request.method !== "GET" && request.method !== "HEAD") {
        init.body = await request.clone().arrayBuffer();
      }

      // 3. Cloudflare âm thầm gọi xuống Pikamc Server (HTTP)
      const response = await fetch(targetUrl, init);

      // 4. Lấy kết quả từ Pikamc trả ngược lại cho Netlify (bọc thêm CORS)
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      
      return newResponse;
      
    } catch (error) {
      return new Response(JSON.stringify({ error: "Cloudflare không thể kết nối tới Server Pikamc: " + error.message }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
};
