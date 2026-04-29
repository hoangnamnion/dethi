// =====================================================
// GOOGLE APPS SCRIPT — ONLINE TRACKING
// Deploy: Extensions > Apps Script > Deploy > Web App
// Ai có thể truy cập: Everyone (Anonymous)
// =====================================================
// Sheet cần tạo: "Online" với 2 cột: username | timestamp
// =====================================================

const SHEET_NAME = "Online";

function doGet(e) {
  const action = e.parameter.action;
  const username = e.parameter.username;

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    let result;
    if (action === "ping" && username) {
      result = handlePing(username);
    } else if (action === "offline" && username) {
      result = handleOffline(username);
    } else if (action === "get_online") {
      result = handleGetOnline();
    } else {
      result = { status: "ok", message: "Online Tracking API running" };
    }
    output.setContent(JSON.stringify(result));
  } catch (err) {
    output.setContent(JSON.stringify({ error: err.message }));
  }

  return output;
}

// Ghi/cập nhật timestamp của user
function handlePing(username) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const now = Date.now();

  // Tìm row của user nếu đã có
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === username) {
      sheet.getRange(i + 1, 2).setValue(now);
      return { success: true, action: "updated" };
    }
  }

  // Chưa có thì thêm mới
  sheet.appendRow([username, now]);
  return { success: true, action: "added" };
}

// Xóa user khỏi sheet khi offline
function handleOffline(username) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === username) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: true, action: "not_found" };
}

// Lấy danh sách user online trong 20 giây gần nhất
function handleGetOnline() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const now = Date.now();
  const TIMEOUT = 20000; // 20 giây

  const onlineUsers = [];
  const rowsToDelete = [];

  for (let i = 1; i < data.length; i++) {
    const username = data[i][0];
    const timestamp = Number(data[i][1]);
    if (!username) continue;

    if (now - timestamp <= TIMEOUT) {
      onlineUsers.push(username);
    } else {
      // Đánh dấu xóa (offline quá lâu)
      rowsToDelete.push(i + 1);
    }
  }

  // Xóa từ dưới lên để không lệch index
  for (let i = rowsToDelete.length - 1; i >= 0; i--) {
    sheet.deleteRow(rowsToDelete[i]);
  }

  return {
    users: onlineUsers,
    onlineCount: onlineUsers.length
  };
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  // Tự tạo sheet nếu chưa có
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, 2).setValues([["username", "timestamp"]]);
    sheet.getRange(1, 1, 1, 2).setFontWeight("bold");
  }
  return sheet;
}
