# แผนการพัฒนาและสถาปัตยกรรมระบบ Smart Library Command Center

พัฒนา Web Application ระบบศูนย์ควบคุมห้องสมุดอัจฉริยะ (Smart Library Command Center) พร้อม backend บน Google Apps Script (GAS), Google Sheets เป็น Database และ Google Drive เป็น File Storage ตามข้อกำหนดในไฟล์ออกแบบระบบ

---

## 🛑 นโยบายความปลอดภัยและการคุ้มครองระบบ (Strict Security Policy)

> [!CAUTION]
> **1. ระบบป้องกันการเปิด DevTools / Inspect Element (Anti-Inspect Shield)**
> - **บล็อกการกดปุ่มทางลัด F12**: ระบบห้ามการกดปุ่ม `F12`, `Ctrl+Shift+I` (Inspect), `Ctrl+Shift+J` (Console), `Ctrl+Shift+C` (Selector), `Ctrl+U` (View Source) และบล็อกการคลิกขวา
> - **Server-Side Isolation**: ฐานข้อมูล Google Sheets ถูกเก็บซ่อนไว้บน Server ฝั่ง Google Apps Script หน้าเว็บ Client ทำงานผ่าน REST API เท่านั้น แม้ผู้ใช้จะเปิด Inspect ในระดับเบราว์เซอร์ก็ไม่สามารถสกัด URL หรือแก้ไขโครงสร้าง Google Sheets ได้
> 
> **2. การห้ามอัปโหลดและเผยแพร่ไฟล์ละเอียดอ่อน (Sensitive File Prohibition)**
> - **ห้ามอัปโหลดไฟล์สคริปต์และข้อกำหนดระบบ**: ห้ามอัปโหลด `.gs`, `.md`, `.env`
> 
> **3. การป้องกัน Formula Injection (การวางสูตรใน Google Sheets)**
> - **ล้างค่าสัญลักษณ์สูตร (Sanitize Sheet Input)**: ตัดสัญลักษณ์สูตร (`=`, `+`, `-`, `@`, `=IMPORTXML`, `=IMAGE`) ป้องกันความเสียหายในตารางข้อมูล

---

## 📌 ทรัพยากรและการตั้งค่าเริ่มต้น (Security & Config Placeholders)
* **Google Sheet URL (Database)**: `<YOUR_GOOGLE_SHEET_URL>`
* **Google Drive Folder URL (Storage)**: `<YOUR_GOOGLE_DRIVE_FOLDER_URL>` *(Folder ID: `<YOUR_GOOGLE_DRIVE_FOLDER_ID>`)*
* **GAS Web App Endpoint**: `<YOUR_GAS_WEB_APP_URL>`

---

## 🏗️ สถาปัตยกรรมระบบ (System Architecture)

```
+-----------------------------------------------------------------------+
|                    Smart Library Command Center Frontend              |
|   - SPA Interface (Dark Glassmorphic UI, Responsive Mobile/Desktop)   |
|   - Anti-Inspect Shield (F12, Right Click, Ctrl+Shift+I Blocked)      |
|   - Dashboard KPIs, Book Catalog, Circulation Desk, Member & IoT      |
|   - State Manager, Loading Spinner, Toast Notifications, Retry Logic  |
|   - Input Sanitizer (Formula & Sensitive File Filter)                 |
+-----------------------------------+-----------------------------------+
                                    | REST API Calls (doGet / doPost)
                                    v
+-----------------------------------------------------------------------+
|                     Google Apps Script (GAS Engine)                   |
|   - Action Router & CORS Filter (Code.gs)                            |
|   - Database Setup & Maintenance (Setup.gs)                           |
|   - Sheets CRUD, Formula Sanitizer & Lock (SheetService.gs)           |
|   - Drive Storage & File Extension Whitelist (DriveService.gs)        |
+-----------------+---------------------------------+-------------------+
                  |                                 |
                  v                                 v
+----------------------------------+ +----------------------------------+
|  Google Sheets (Database Engine) | | Google Drive (File Storage)      |
|  - Books, Members, Circulation   | | - /uploads/books (Images/PDF)    |
|  - IoTSensors, AuditLogs         | | - /uploads/members (Avatars)     |
|  - FileStorage Index             | | - /uploads/attachments (Docs)    |
+----------------------------------+ +----------------------------------+
```
