/**
 * ============================================================================
 * Smart Library Command Center - app.js
 * ============================================================================
 * Application Controller & Dynamic UI Logic
 * - ระบบป้องกันการเปิด F12 / Inspect Element (Anti-Inspect & DevTools Shield)
 * - Tab Navigation Switcher
 * - Chart.js Dynamic Initializer & Data Updater
 * - Table Rendering for Books, Members, Circulation, IoT Sensors, Drive Storage
 * - Modal Dialog Control & Form Handlers
 * - Client Formula Protection & Extension Filter Enforcement
 * 
 * @author Senior Full-Stack Developer & Lead Architect
 */

let borrowChartInstance = null;
let categoryChartInstance = null;
let currentBooksData = [];

// เมื่อโหลดหน้าเว็บเสร็จสมบูรณ์
document.addEventListener("DOMContentLoaded", () => {
  console.log("Smart Library Command Center Initialized!");
  initAntiInspectShield();
  initCharts();
  loadOverviewData();
});

/**
 * ============================================================================
 * ระบบป้องกันการเปิด F12 / Inspect Element (Anti-Inspect & DevTools Shield)
 * ============================================================================
 * 1. บล็อกการคลิกขวา (Disable Right-Click Context Menu)
 * 2. บล็อกปุ่มทางลัด F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S
 * 3. ล้าง Console Log ป้องกันการแกะพารามิเตอร์ฐานข้อมูลผ่าน DevTools Console
 */
function initAntiInspectShield() {
  // 1. บล็อกการคลิกขวาบนหน้าเว็บ
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    ApiService.showToast("⚠️ ปิดการใช้งานคลิกขวาเพื่อความปลอดภัยของระบบ", "warning");
    return false;
  });

  // 2. บล็อกปุ่มทางลัดการเปิด DevTools และ ดูซอร์สโค้ด
  document.addEventListener("keydown", (e) => {
    // บล็อก F12
    if (e.key === "F12" || e.keyCode === 123) {
      e.preventDefault();
      ApiService.showToast("🛡️ ระบบบล็อกการกด F12 เพื่อป้องกันการเข้าถึงฐานข้อมูล", "error");
      return false;
    }

    // บล็อก Ctrl + Shift + I (Inspect Element)
    if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.keyCode === 73)) {
      e.preventDefault();
      ApiService.showToast("🛡️ ไม่อนุญาตให้เปิด Inspect Element (DevTools Protected)", "error");
      return false;
    }

    // บล็อก Ctrl + Shift + J (Console Window)
    if (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j" || e.keyCode === 74)) {
      e.preventDefault();
      ApiService.showToast("🛡️ ไม่อนุญาตให้เปิด Console Window", "error");
      return false;
    }

    // บล็อก Ctrl + Shift + C (Inspect Element Selector)
    if (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c" || e.keyCode === 67)) {
      e.preventDefault();
      return false;
    }

    // บล็อก Ctrl + U (View Page Source)
    if (e.ctrlKey && (e.key === "U" || e.key === "u" || e.keyCode === 85)) {
      e.preventDefault();
      ApiService.showToast("🛡️ ไม่อนุญาตให้ดูซอร์สโค้ด (View Source Protected)", "error");
      return false;
    }

    // บล็อก Ctrl + S (Save Page)
    if (e.ctrlKey && (e.key === "S" || e.key === "s" || e.keyCode === 83)) {
      e.preventDefault();
      return false;
    }
  });

  // 3. แสดงข้อความเตือนความปลอดภัยใน Console หากมีผู้แอบเปิด DevTools สำเร็จ
  setTimeout(() => {
    console.clear();
    console.log(
      "%c🛡️ SMART LIBRARY COMMAND CENTER - SECURITY SHIELD %c\nระบบมีกลไกป้องกัน Formula Injection และ Concurrency Protection บน Google Apps Script Server-Side การดัดแปลงข้อมูลผ่านหน้าเว็บจะไม่กระทบต่อฐานข้อมูล Google Sheets หลัก",
      "background: #0F172A; color: #2FD9F4; font-size: 16px; font-weight: bold; padding: 8px 12px; border-radius: 6px;",
      "color: #94A3B8; font-size: 12px; line-height: 1.5;"
    );
  }, 1000);
}

/**
 * สลับหน้าเมนู Tab
 */
function switchTab(tabId) {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-tab") === tabId) {
      btn.classList.add("active");
    }
  });

  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.add("hidden");
  });

  const activeSection = document.getElementById(`tab-${tabId}`);
  if (activeSection) {
    activeSection.classList.remove("hidden");
  }

  switch (tabId) {
    case "overview": loadOverviewData(); break;
    case "books": loadBooksData(); break;
    case "circulation": loadCirculationData(); break;
    case "members": loadMembersData(); break;
    case "iot": loadIoTSensorsData(); break;
    case "drive": loadDriveFilesData(); break;
  }
}

/**
 * เริ่มต้นฟังก์ชัน Chart.js
 */
function initCharts() {
  const borrowCtx = document.getElementById("borrowChart");
  if (borrowCtx) {
    borrowChartInstance = new Chart(borrowCtx, {
      type: "bar",
      data: {
        labels: ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"],
        datasets: [
          {
            label: "จำนวนยืม (เล่ม)",
            data: [42, 58, 65, 78, 90, 110, 45],
            backgroundColor: "rgba(47, 217, 244, 0.6)",
            borderColor: "#2fd9f4",
            borderWidth: 1,
            borderRadius: 6
          },
          {
            label: "จำนวนคืน (เล่ม)",
            data: [35, 50, 60, 70, 85, 100, 40],
            backgroundColor: "rgba(16, 185, 129, 0.6)",
            borderColor: "#10b981",
            borderWidth: 1,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#94a3b8", font: { family: "Kanit" } } }
        },
        scales: {
          x: { ticks: { color: "#64748b" }, grid: { color: "rgba(255,255,255,0.05)" } },
          y: { ticks: { color: "#64748b" }, grid: { color: "rgba(255,255,255,0.05)" } }
        }
      }
    });
  }

  const catCtx = document.getElementById("categoryChart");
  if (catCtx) {
    categoryChartInstance = new Chart(catCtx, {
      type: "doughnut",
      data: {
        labels: ["เทคโนโลยีสารสนเทศ", "วิศวกรรมซอฟต์แวร์", "ไซเบอร์ซีเคียวริตี้"],
        datasets: [{
          data: [45, 30, 25],
          backgroundColor: ["#2fd9f4", "#3b82f6", "#10b981"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: "#94a3b8", font: { family: "Kanit" } } }
        }
      }
    });
  }
}

/**
 * โหลดข้อมูลหน้า Overview Dashboard
 */
async function loadOverviewData() {
  ApiService.setLoading(true, "กำลังดึงข้อมูลสถิติ...");
  try {
    const res = await ApiService.getOverviewStats();
    if (res && res.data) {
      const stats = res.data;
      document.getElementById("kpiTotalBooks").innerText = stats.totalBooks || 0;
      document.getElementById("kpiAvailableBooks").innerText = `${stats.availableBooks || 0} เล่มพร้อมยืม`;
      document.getElementById("kpiTotalMembers").innerText = stats.totalMembers || 0;
      document.getElementById("kpiActiveMembers").innerText = `${stats.activeMembers || 0} สมาชิกปกติ`;
      document.getElementById("kpiActiveBorrows").innerText = stats.activeBorrows || 0;
      document.getElementById("kpiOverdueCount").innerText = `${stats.overdueCount || 0} เกินกำหนดส่ง`;
      document.getElementById("kpiNormalSensors").innerText = `${stats.normalSensors || 0} / ${stats.totalSensors || 0}`;
    }
  } catch (err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

/**
 * โหลดและแสดงข้อมูลคลังหนังสือ
 */
async function loadBooksData() {
  ApiService.setLoading(true, "กำลังดึงรายการหนังสือ...");
  try {
    const res = await ApiService.getBooks();
    if (res && res.data) {
      currentBooksData = res.data;
      renderBooksTable(currentBooksData);
    }
  } catch (err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

function renderBooksTable(books) {
  const tbody = document.getElementById("booksTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (books.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-500">ไม่พบรายการหนังสือ</td></tr>`;
    return;
  }

  books.forEach(b => {
    const tr = document.createElement("tr");
    
    let statusBadge = `<span class="badge badge-success">พร้อมยืม</span>`;
    if (b.status === "Borrowed") statusBadge = `<span class="badge badge-warning">ถูกยืม</span>`;
    if (b.status === "Reserved") statusBadge = `<span class="badge badge-info">จองแล้ว</span>`;

    const coverImg = b.cover_url || "https://picsum.photos/200/300?random=1";

    tr.innerHTML = `
      <td>
        <img src="${coverImg}" alt="${b.title}" class="w-10 h-14 object-cover rounded shadow border border-slate-700">
      </td>
      <td>
        <div class="font-bold text-white">${b.book_id}</div>
        <div class="text-xs text-cyan-400 font-mono">${b.rfid_tag || "-"}</div>
      </td>
      <td>
        <div class="font-semibold text-white">${b.title}</div>
      </td>
      <td>
        <div class="text-slate-300">${b.author}</div>
        <div class="text-xs text-slate-500">${b.isbn || "-"}</div>
      </td>
      <td>
        <div class="text-slate-300">${b.shelf_location || "-"}</div>
        <div class="text-xs text-slate-500">${b.category || "-"}</div>
      </td>
      <td>${statusBadge}</td>
      <td class="font-bold text-cyan-400">${b.available_copies} / ${b.total_copies}</td>
      <td>
        <button onclick="deleteBookItem('${b.book_id}')" class="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterBooks() {
  const search = document.getElementById("searchBookInput").value.toLowerCase();
  const cat = document.getElementById("filterCategorySelect").value;

  const filtered = currentBooksData.filter(b => {
    const matchSearch = (b.title && b.title.toLowerCase().includes(search)) ||
                        (b.author && b.author.toLowerCase().includes(search)) ||
                        (b.book_id && b.book_id.toLowerCase().includes(search)) ||
                        (b.rfid_tag && b.rfid_tag.toLowerCase().includes(search));
    const matchCat = !cat || b.category === cat;
    return matchSearch && matchCat;
  });

  renderBooksTable(filtered);
}

/**
 * บันทึกหนังสือใหม่
 */
async function saveBook(e) {
  e.preventDefault();
  
  const title = document.getElementById("modalBookTitle").value;
  const author = document.getElementById("modalBookAuthor").value;
  const isbn = document.getElementById("modalBookIsbn").value;
  const rfid = document.getElementById("modalBookRfid").value;
  const cat = document.getElementById("modalBookCategory").value;
  const shelf = document.getElementById("modalBookShelf").value;
  const total = document.getElementById("modalBookTotal").value;

  const newBook = {
    book_id: `BK-${Date.now()}`,
    title: ApiService.sanitizeInput(title),
    author: ApiService.sanitizeInput(author),
    isbn: ApiService.sanitizeInput(isbn),
    rfid_tag: ApiService.sanitizeInput(rfid),
    category: cat,
    shelf_location: ApiService.sanitizeInput(shelf),
    status: "Available",
    cover_url: `https://picsum.photos/200/300?random=${Math.floor(Math.random()*100)}`,
    total_copies: Number(total),
    available_copies: Number(total)
  };

  ApiService.setLoading(true, "กำลังบันทึกหนังสือ...");
  try {
    const res = await ApiService.createBook(newBook);
    if (res && res.success) {
      ApiService.showToast("บันทึกหนังสือสำเร็จ! (Formula Sanitized 🛡️)", "success");
      closeBookModal();
      loadBooksData();
    }
  } catch (err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

async function deleteBookItem(bookId) {
  if (!confirm(`คุณต้องการลบหนังสือ ID '${bookId}' ใช่หรือไม่?`)) return;
  ApiService.setLoading(true, "กำลังลบหนังสือ...");
  try {
    const res = await ApiService.deleteBook(bookId);
    if (res && res.success) {
      ApiService.showToast("ลบหนังสือสำเร็จ", "success");
      loadBooksData();
    }
  } catch(err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

/**
 * โหลดข้อมูลรายการยืม-คืน
 */
async function loadCirculationData() {
  ApiService.setLoading(true, "กำลังดึงรายการยืม-คืน...");
  try {
    const res = await ApiService.getCirculation();
    if (res && res.data) {
      renderCirculationList(res.data);
    }
  } catch (err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

function renderCirculationList(list) {
  const container = document.getElementById("activeBorrowsList");
  if (!container) return;
  container.innerHTML = "";

  const activeItems = list.filter(i => i.status === "Borrowed");

  if (activeItems.length === 0) {
    container.innerHTML = `<p class="text-sm text-slate-500 text-center py-4">ไม่มีรายการที่ยืมค้างอยู่</p>`;
    return;
  }

  activeItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3";
    
    div.innerHTML = `
      <div>
        <div class="font-bold text-white text-sm">${item.book_title}</div>
        <div class="text-xs text-slate-400">ผู้ยืม: ${item.member_name} (${item.member_id})</div>
        <div class="text-[11px] text-cyan-400 mt-1">กำหนดส่ง: ${new Date(item.due_date).toLocaleDateString("th-TH")}</div>
      </div>
      <button onclick="handleReturn('${item.transaction_id}')" class="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1 transition">
        <span class="material-symbols-outlined text-sm">assignment_turned_in</span>
        <span>คืนหนังสือ</span>
      </button>
    `;
    container.appendChild(div);
  });
}

async function handleBorrow(e) {
  e.preventDefault();
  const memberId = document.getElementById("borrowMemberId").value;
  const bookId = document.getElementById("borrowBookId").value;
  const notes = document.getElementById("borrowNotes").value;

  ApiService.setLoading(true, "กำลังประมวลผลการยืม...");
  try {
    const res = await ApiService.borrowBook({
      member_id: ApiService.sanitizeInput(memberId),
      book_id: ApiService.sanitizeInput(bookId),
      notes: ApiService.sanitizeInput(notes)
    });
    if (res && res.success) {
      ApiService.showToast("ทำรายการยืมหนังสือสำเร็จ!", "success");
      document.getElementById("borrowForm").reset();
      loadCirculationData();
    }
  } catch(err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

async function handleReturn(txId) {
  ApiService.setLoading(true, "กำลังคืนหนังสือ...");
  try {
    const res = await ApiService.returnBook(txId);
    if (res && res.success) {
      let msg = "ทำรายการคืนหนังสือสำเร็จ";
      if (res.fineAmount > 0) msg += ` (มีค่าปรับ ${res.fineAmount} บาท)`;
      ApiService.showToast(msg, "success");
      loadCirculationData();
    }
  } catch(err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

/**
 * โหลดข้อมูลสมาชิก
 */
async function loadMembersData() {
  ApiService.setLoading(true, "กำลังดึงรายชื่อสมาชิก...");
  try {
    const res = await ApiService.getMembers();
    if (res && res.data) {
      renderMembersTable(res.data);
    }
  } catch (err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

function renderMembersTable(members) {
  const tbody = document.getElementById("membersTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  members.forEach(m => {
    const tr = document.createElement("tr");
    const avatar = m.avatar_url || "https://i.pravatar.cc/150?img=11";
    
    tr.innerHTML = `
      <td><img src="${avatar}" class="w-9 h-9 rounded-full object-cover border border-slate-700"></td>
      <td class="font-bold text-white">${m.member_id}</td>
      <td class="font-semibold text-white">${m.full_name}</td>
      <td>
        <div class="text-slate-300 text-xs">${m.email || "-"}</div>
        <div class="text-slate-500 text-xs">${m.phone || "-"}</div>
      </td>
      <td><span class="badge badge-info">${m.member_type}</span></td>
      <td><span class="badge badge-success">${m.status}</span></td>
      <td class="font-bold text-cyan-400">${m.borrowed_count} / ${m.max_borrow_limit} เล่ม</td>
      <td>
        <button onclick="deleteMemberItem('${m.member_id}')" class="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteMemberItem(memberId) {
  if (!confirm(`ต้องการลบสมาชิก ID '${memberId}' ใช่หรือไม่?`)) return;
  ApiService.setLoading(true, "กำลังลบสมาชิก...");
  try {
    const res = await ApiService.deleteMember(memberId);
    if (res && res.success) {
      ApiService.showToast("ลบสมาชิกเรียบร้อยแล้ว", "success");
      loadMembersData();
    }
  } catch(err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

/**
 * โหลดข้อมูลเซ็นเซอร์ IoT
 */
async function loadIoTSensorsData() {
  ApiService.setLoading(true, "กำลังตรวจเช็คเซ็นเซอร์...");
  try {
    const res = await ApiService.getIoTSensors();
    if (res && res.data) {
      renderSensorsGrid(res.data);
    }
  } catch(err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

function renderSensorsGrid(sensors) {
  const container = document.getElementById("sensorsGrid");
  if (!container) return;
  container.innerHTML = "";

  sensors.forEach(s => {
    const card = document.createElement("div");
    card.className = "glass-card p-5 space-y-3";
    
    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-bold text-white">${s.sensor_name}</h4>
          <p class="text-xs text-slate-400">${s.location} (${s.sensor_id})</p>
        </div>
        <span class="badge badge-success">${s.status}</span>
      </div>
      
      <div class="flex items-baseline gap-2 pt-2">
        <span class="text-3xl font-bold text-cyan-400">${s.last_value}</span>
        <span class="text-xs text-slate-400">${s.unit}</span>
      </div>

      <div class="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
        <span>ประเภท: ${s.sensor_type}</span>
        <span>Ping: ออนไลน์</span>
      </div>
    `;
    container.appendChild(card);
  });
}

/**
 * โหลดดัชนีไฟล์ Google Drive
 */
async function loadDriveFilesData() {
  ApiService.setLoading(true, "กำลังดึงรายการไฟล์...");
  try {
    const res = await ApiService.getFileStorage();
    if (res && res.data) {
      renderDriveTable(res.data);
    }
  } catch(err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

function renderDriveTable(files) {
  const tbody = document.getElementById("driveTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  files.forEach(f => {
    const tr = document.createElement("tr");
    const sizeKb = (Number(f.file_size || 0) / 1024).toFixed(1);

    tr.innerHTML = `
      <td class="font-semibold text-white">${f.file_name}</td>
      <td><span class="badge badge-info">${f.folder_path}</span></td>
      <td class="text-slate-400 text-xs">${sizeKb} KB</td>
      <td class="text-slate-300 text-xs">${f.uploaded_by || "-"}</td>
      <td class="text-slate-500 text-xs">${new Date(f.uploaded_at).toLocaleDateString("th-TH")}</td>
      <td>
        <a href="${f.direct_link}" target="_blank" class="text-cyan-400 hover:underline text-xs flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">open_in_new</span>
          <span>เปิดไฟล์ Direct Link</span>
        </a>
      </td>
      <td>
        <button onclick="deleteFileItem('${f.file_id}')" class="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition">
          <span class="material-symbols-outlined text-sm">delete</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * จัดการอัปโหลดไฟล์
 */
async function handleUploadFile(e) {
  e.preventDefault();
  const folderType = document.getElementById("uploadFolderType").value;
  const fileInput = document.getElementById("uploadFileInput");

  if (!fileInput.files || fileInput.files.length === 0) {
    ApiService.showToast("กรุณาเลือกไฟล์ที่ต้องการอัปโหลด", "warning");
    return;
  }

  const file = fileInput.files[0];

  const validation = ApiService.validateFileExtension(file.name);
  if (!validation.valid) {
    ApiService.showToast(validation.error, "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function() {
    const base64 = reader.result;
    ApiService.setLoading(true, "กำลังอัปโหลดไฟล์ไปยัง Google Drive...");
    try {
      const res = await ApiService.uploadFile({
        base64: base64,
        fileName: file.name,
        mimeType: file.type,
        subFolderType: folderType,
        uploadedBy: "Admin Command Center"
      });

      if (res && res.success) {
        ApiService.showToast("อัปโหลดไฟล์ไป Google Drive สำเร็จ!", "success");
        closeUploadModal();
        loadDriveFilesData();
      }
    } catch(err) {
      console.error(err);
    } finally {
      ApiService.setLoading(false);
    }
  };

  reader.readAsDataURL(file);
}

async function deleteFileItem(fileId) {
  if (!confirm("ต้องการลบไฟล์นี้ออกจาก Google Drive ใช่หรือไม่?")) return;
  ApiService.setLoading(true, "กำลังลบไฟล์...");
  try {
    const res = await ApiService.deleteFile(fileId);
    if (res && res.success) {
      ApiService.showToast("ลบไฟล์ออกจาก Google Drive สำเร็จ", "success");
      loadDriveFilesData();
    }
  } catch(err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

/**
 * รันระบบ Auto Database Setup
 */
async function triggerSetupDatabase() {
  if (!confirm("คุณต้องการรัน setupDatabase() เพื่อเตรียมโครงสร้าง 6 ตาราง และ 3 โฟลเดอร์ใช่หรือไม่?")) return;
  
  ApiService.setLoading(true, "กำลังเตรียมโครงสร้างตารางและโฟลเดอร์ใน Google Ecosystem...");
  try {
    const res = await ApiService.setupDatabase();
    if (res && res.success) {
      ApiService.showToast("เนรมิตตารางและโฟลเดอร์สำเร็จ! (Formula Protection Active 🛡️)", "success");
    }
  } catch(err) {
    console.error(err);
  } finally {
    ApiService.setLoading(false);
  }
}

// Modal Toggle Helpers
function openBookModal() { document.getElementById("bookModal").classList.remove("hidden"); }
function closeBookModal() { document.getElementById("bookModal").classList.add("hidden"); }
function openUploadModal() { document.getElementById("uploadModal").classList.remove("hidden"); }
function closeUploadModal() { document.getElementById("uploadModal").classList.add("hidden"); }
