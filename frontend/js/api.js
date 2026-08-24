/**
 * ============================================================================
 * Smart Library Command Center - api.js
 * ============================================================================
 * Client-side API Service Engine
 * - ระบบป้องกัน Formula Injection ฝั่ง Frontend (Sanitize Input)
 * - ระบบกรองส่วนขยายไฟล์ห้ามอัปโหลด (.gs, .md, .env)
 * - Retry Mechanism (Exponential Backoff 3 ครั้ง)
 * - Toast Notification Alert & Loading Spinner Engine
 * - Mock Data Fallback เมื่อ Google APIs เกิด Latency/Error
 * 
 * @author Senior Full-Stack Developer & Lead Architect
 */

const ApiService = (function () {
  // อ่านคอนฟิกจาก env.js
  const config = window.CONFIG || {
    GAS_WEB_APP_URL: "",
    USE_MOCK_FALLBACK: true,
    API_TIMEOUT_MS: 12000,
    MAX_RETRIES: 3
  };

  /**
   * ระบบป้องกัน Formula Injection ฝั่ง Frontend
   * ล้างค่าข้อความ ป้องกันการส่งสัญลักษณ์สูตรไปพัง Google Sheets
   */
  function sanitizeInput(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") {
      let trimmed = value.trim();
      const formulaTriggers = ["=", "+", "-", "@", "\t", "\r"];
      if (formulaTriggers.includes(trimmed.charAt(0))) {
        // ลบสัญลักษณ์สูตรด้านหน้าออก หรือแปลงเป็น Plain Text
        return "'" + value;
      }
      // ตรวจสอบฟังก์ชันอันตราย
      if (/^\s*=?\s*(IMPORTXML|IMPORTDATA|IMPORTRANGE|QUERY|CELL|HYPERLINK|IMAGE)/i.test(trimmed)) {
        return "'" + value;
      }
    }
    return value;
  }

  /**
   * ล้างข้อมูลวัตถุทั้งชุด (Sanitize Payload Object)
   */
  function sanitizePayload(payload) {
    if (!payload || typeof payload !== "object") return payload;
    const cleanObj = Array.isArray(payload) ? [] : {};
    for (let key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        if (typeof payload[key] === "object" && payload[key] !== null) {
          cleanObj[key] = sanitizePayload(payload[key]);
        } else {
          cleanObj[key] = sanitizeInput(payload[key]);
        }
      }
    }
    return cleanObj;
  }

  /**
   * ตรวจสอบความปลอดภัยนามสกุลไฟล์ก่อนอัปโหลด
   */
  function validateFileExtension(fileName) {
    if (!fileName) return { valid: false, error: "กรุณาเลือกไฟล์" };
    const prohibited = ["gs", "md", "env", "exe", "bat", "sh", "js", "html", "php", "py"];
    const allowed = ["jpg", "jpeg", "png", "webp", "pdf", "docx", "xlsx", "pptx", "txt"];
    
    const parts = fileName.split(".");
    if (parts.length > 1) {
      const ext = parts[parts.length - 1].toLowerCase().trim();
      if (prohibited.includes(ext)) {
        return { 
          valid: false, 
          error: `ไม่อนุญาตให้อัปโหลดไฟล์ความลับหรือสคริปต์ (ห้ามอัปโหลด .${ext})` 
        };
      }
      if (!allowed.includes(ext)) {
        return {
          valid: false,
          error: `อนุญาตเฉพาะไฟล์สื่อและเอกสารการทำงานเท่านั้น (${allowed.join(", ")})`
        };
      }
    }
    return { valid: true };
  }

  /**
   * แสดง UI Toast Alert
   */
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) {
      console.log(`[Toast ${type.toUpperCase()}]: ${message}`);
      return;
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} animate-slide-in`;
    
    let icon = "info";
    if (type === "success") icon = "check_circle";
    if (type === "error" || type === "warning") icon = "warning";

    toast.innerHTML = `
      <span class="material-symbols-outlined text-xl">${icon}</span>
      <div class="flex-1 text-sm font-medium">${message}</div>
      <button class="text-slate-400 hover:text-white" onclick="this.parentElement.remove()">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("animate-fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /**
   * ควบคุมการแสดงผล Loading Overlay
   */
  function setLoading(show, text = "กำลังประมวลผล...") {
    const overlay = document.getElementById("loadingOverlay");
    const label = document.getElementById("loadingText");
    if (overlay) {
      if (show) {
        if (label) label.innerText = text;
        overlay.classList.remove("hidden");
        overlay.classList.add("flex");
      } else {
        overlay.classList.add("hidden");
        overlay.classList.remove("flex");
      }
    }
  }

  /**
   * ฟังก์ชันเรียกใช้ API พร้อม Retry Engine (Exponential Backoff)
   */
  async function callApi(action, method = "GET", payload = null, retries = config.MAX_RETRIES) {
    // 1. Sanitize Payload ฝั่ง Client ป้องกัน Formula Injection
    const cleanPayload = sanitizePayload(payload);
    
    const baseUrl = config.GAS_WEB_APP_URL;
    let url = `${baseUrl}?action=${encodeURIComponent(action)}`;
    
    let options = {
      method: method,
      headers: { "Content-Type": "text/plain;charset=utf-8" }
    };

    if (method === "POST" && cleanPayload) {
      options.body = JSON.stringify({ action: action, data: cleanPayload });
    }

    let attempt = 0;
    let backoffDelay = 1000;

    while (attempt < retries) {
      attempt++;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.API_TIMEOUT_MS);
        options.signal = controller.signal;

        console.log(`[API Request] Attempt ${attempt}/${retries} -> ${action}`);
        const response = await fetch(url, options);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data && data.success === false) {
          throw new Error(data.error || "GAS API returned failure response");
        }

        return data;
      } catch (err) {
        console.warn(`[API Warn] Attempt ${attempt} failed for action '${action}':`, err.message);
        if (attempt >= retries) {
          // หากเกินจำนวน Retry และเปิดใช้ Mock Fallback
          if (config.USE_MOCK_FALLBACK) {
            showToast(`ใช้ระบบข้อมูลสำรอง (Mock Mode) เนื่องจาก Latency หรือ API Connection Timeout`, "warning");
            return getMockData(action, cleanPayload);
          }
          showToast(`เกิดข้อผิดพลาดในการเชื่อมต่อ API: ${err.message}`, "error");
          throw err;
        }
        // รอเวลาแบบ Exponential Backoff ก่อนลองใหม่ (1s, 2s, 4s)
        await new Promise(res => setTimeout(res, backoffDelay));
        backoffDelay *= 2;
      }
    }
  }

  /**
   * ข้อมูล Mock Data สำรองเพื่อความเสถียรของ UX
   */
  function getMockData(action, payload) {
    console.log(`[Mock Fallback Activated]: ${action}`);
    switch (action) {
      case "getOverviewStats":
        return {
          success: true,
          data: {
            totalBooks: 1250,
            availableBooks: 980,
            borrowedBooks: 270,
            totalMembers: 450,
            activeMembers: 412,
            activeBorrows: 85,
            overdueCount: 4,
            totalFines: 350,
            totalSensors: 8,
            normalSensors: 8,
            updatedAt: new Date().toISOString()
          }
        };
      case "getBooks":
        return {
          success: true,
          data: [
            { book_id: "BK-2026-001", title: "ระบบสารสนเทศห้องสมุดอัจฉริยะ (Smart Library OS)", author: "ดร.พัชรพล", isbn: "978-616-0001-01", rfid_tag: "RFID-BK-001", category: "เทคโนโลยีสารสนเทศ", shelf_location: "Zone A - Shelf 01", status: "Available", cover_url: "https://picsum.photos/200/300?random=1", total_copies: 5, available_copies: 4 },
            { book_id: "BK-2026-002", title: "การพัฒนา Clean Architecture ด้วย GAS & Drive", author: "ทีมพัฒนา AI", isbn: "978-616-0002-02", rfid_tag: "RFID-BK-002", category: "วิศวกรรมซอฟต์แวร์", shelf_location: "Zone B - Shelf 03", status: "Available", cover_url: "https://picsum.photos/200/300?random=2", total_copies: 3, available_copies: 2 },
            { book_id: "BK-2026-003", title: "ความมั่นคงปลอดภัยและการป้องกัน Formula Injection", author: "Lead Architect", isbn: "978-616-0003-03", rfid_tag: "RFID-BK-003", category: "ไซเบอร์ซีเคียวริตี้", shelf_location: "Zone C - Shelf 02", status: "Borrowed", cover_url: "https://picsum.photos/200/300?random=3", total_copies: 2, available_copies: 0 }
          ]
        };
      case "getMembers":
        return {
          success: true,
          data: [
            { member_id: "MEM-2026-001", full_name: "นายสมชาย ใจดี", email: "somchai@example.com", phone: "081-234-5678", member_type: "Student", status: "Active", avatar_url: "https://i.pravatar.cc/150?img=11", borrowed_count: 1, max_borrow_limit: 5 },
            { member_id: "MEM-2026-002", full_name: "ดร.กานดา รักเรียน", email: "kanda@example.com", phone: "089-876-5432", member_type: "Teacher", status: "Active", avatar_url: "https://i.pravatar.cc/150?img=32", borrowed_count: 0, max_borrow_limit: 10 }
          ]
        };
      case "getCirculation":
        return {
          success: true,
          data: [
            { transaction_id: "TX-2026-001", book_id: "BK-2026-003", book_title: "ความมั่นคงปลอดภัยและการป้องกัน Formula Injection", member_id: "MEM-2026-001", member_name: "นายสมชาย ใจดี", borrow_date: "2026-08-01T10:00:00Z", due_date: "2026-08-08T10:00:00Z", return_date: "", status: "Borrowed", fine_amount: 30, notes: "เกินกำหนดส่ง" }
          ]
        };
      case "getIoTSensors":
        return {
          success: true,
          data: [
            { sensor_id: "SN-GATE-01", sensor_name: "RFID Main Gate Scan", location: "ประตูทางเข้าหลัก", sensor_type: "RFID Security Gate", last_value: "ACTIVE", unit: "Status", status: "Normal", last_ping: new Date().toISOString() },
            { sensor_id: "SN-ENV-01", sensor_name: "Temperature & Humidity Sensor", location: "ห้องโถงอ่านหนังสือ", sensor_type: "Environment Telemetry", last_value: "24.5", unit: "°C", status: "Normal", last_ping: new Date().toISOString() }
          ]
        };
      case "getFileStorage":
        return {
          success: true,
          data: [
            { file_id: "FILE-MOCK-01", file_name: "sample_cover_book1.jpg", file_type: "image/jpeg", folder_path: "/uploads/books", drive_url: "#", direct_link: "https://picsum.photos/200/300?random=1", file_size: 245000, uploaded_by: "System Admin", uploaded_at: new Date().toISOString() }
          ]
        };
      case "setupDatabase":
        return {
          success: true,
          message: "จำลองการสร้างฐานข้อมูลและโฟลเดอร์เรียบร้อยแล้ว (Mock Mode)"
        };
      default:
        return { success: true, message: "Mock Operation Completed Successfully", data: payload };
    }
  }

  // Public Interface
  return {
    sanitizeInput: sanitizeInput,
    validateFileExtension: validateFileExtension,
    showToast: showToast,
    setLoading: setLoading,
    getOverviewStats: () => callApi("getOverviewStats"),
    getBooks: () => callApi("getBooks"),
    createBook: (data) => callApi("createBook", "POST", data),
    updateBook: (data) => callApi("updateBook", "POST", data),
    deleteBook: (bookId) => callApi("deleteBook", "POST", { book_id: bookId }),
    getMembers: () => callApi("getMembers"),
    createMember: (data) => callApi("createMember", "POST", data),
    updateMember: (data) => callApi("updateMember", "POST", data),
    deleteMember: (memberId) => callApi("deleteMember", "POST", { member_id: memberId }),
    getCirculation: () => callApi("getCirculation"),
    borrowBook: (data) => callApi("borrowBook", "POST", data),
    returnBook: (txId) => callApi("returnBook", "POST", { transaction_id: txId }),
    getIoTSensors: () => callApi("getIoTSensors"),
    updateSensor: (data) => callApi("updateSensor", "POST", data),
    getFileStorage: () => callApi("getFileStorage"),
    uploadFile: (data) => callApi("uploadFile", "POST", data),
    deleteFile: (fileId) => callApi("deleteFile", "POST", { fileId: fileId }),
    setupDatabase: () => callApi("setupDatabase", "POST", {})
  };
})();
