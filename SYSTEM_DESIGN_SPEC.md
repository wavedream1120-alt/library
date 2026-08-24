# เอกสารข้อกำหนดและการออกแบบระบบ (System Design Specification)
**โครงการ:** Smart Library Command Center (ศูนย์ควบคุมห้องสมุดอัจฉริยะ)  
**สถาปัตยกรรม:** Serverless Web Application (Google Apps Script REST API + Google Sheets DB + Google Drive File Storage)  
**มาตรฐานการออกแบบ UI/UX:** Google Stitch Inspired, Material Design 3, Dark Glassmorphism, WCAG Accessible, Mobile-First Responsive  
**ระบบป้องกันความปลอดภัยเพิ่มเติม (DevTools & Database Protection):** 
- **Anti-Inspect Shield**: บล็อกการกด F12, Inspect Element (Ctrl+Shift+I), Console (Ctrl+Shift+J), Selector (Ctrl+Shift+C), View Source (Ctrl+U) และการคลิกขวา
- **Database Server Isolation**: ฐานข้อมูล Google Sheets ถูกแยกอิสระอยู่ฝั่ง Server โค้ดฝั่ง Client ไม่สามารถสกัด URL หรือสิทธิ์ของ Sheet ได้โดยตรง
- **Formula Injection Protection**: ป้องกันการส่งสัญลักษณ์สูตร (`=`, `+`, `-`, `@`, `=IMPORTXML`, `=IMAGE`) จากฝั่งผู้ใช้

---

## 1. บทนำและวัตถุประสงค์ (Executive Summary)
ระบบ Smart Library Command Center ถูกออกแบบมาเพื่อเป็นศูนย์กลางการบริหารจัดการห้องสมุดอัจฉริยะแบบครบวงจร รองรับทั้งการตรวจสอบสถิติเชิงลึก (KPI Analytics Dashboard), การจัดการคลังหนังสือและแท็ก RFID (Book & RFID Inventory), ระบบโต๊ะบริการยืม-คืน (Circulation Desk), ระบบบริหารจัดการสมาชิก (Member Management), ระบบตรวจจับและติดตามเซ็นเซอร์ IoT (IoT Security Sensors & Telemetry), และระบบจัดเก็บไฟล์สื่อเอกสารบน Google Drive ผ่านสถาปัตยกรรม Clean Architecture บน Google Apps Script

---

## 2. ทรัพยากรและคลังข้อมูลระบบ (System Resources Configuration)
* **Google Sheet Database**: `<YOUR_GOOGLE_SHEET_URL>`
* **Google Drive Target Folder**: `<YOUR_GOOGLE_DRIVE_FOLDER_URL>` *(Folder ID: `<YOUR_GOOGLE_DRIVE_FOLDER_ID>`)*
* **GAS Web App Endpoint URL**: `<YOUR_GAS_WEB_APP_URL>`

---

## 3. ฟังก์ชันหลักของระบบ (Functional Requirements)

### 3.1 ระบบ Anti-Inspect & DevTools Protection (ป้องกัน F12)
- บล็อกการกดปุ่ม `F12` เพื่อป้องกันการเปิด Developer Tools บนเบราว์เซอร์
- บล็อกปุ่มทางลัด `Ctrl + Shift + I`, `Ctrl + Shift + J`, `Ctrl + Shift + C`, `Ctrl + U`
- บล็อกการคลิกขวา (Context Menu) ทั้งหน้าเว็บ
- ซ่อนและล้าง Log Console เพื่อไม่ให้แกะโครงสร้างการส่ง Request API

### 3.2 ระบบ Dashboard & Real-Time KPIs
- แสดงการ์ด KPI รวม: จำนวนหนังสือทั้งหมด, จำนวนสมาชิกคงเหลือ, รายการยืมอยู่ปัจจุบัน, รายการเกินกำหนดชำระค่าปรับ
- แสดง Chart กราฟสถิติต่างๆ (สถิติการยืม-คืน, สัดส่วนหมวดหมู่หนังสือ)

### 3.3 ระบบบริหารคลังหนังสือ & RFID (Book Catalog & RFID Management)
- เพิ่ม/แก้ไข/ลบ ข้อมูลหนังสือ (CRUD Operations)
- รองรับการค้นหา (Search), การกรอง (Filter), การจัดเรียง (Sort) และการแบ่งหน้า (Pagination)
- การบันทึกและจับคู่แท็ก RFID กับหนังสือแต่ละเล่ม

### 3.4 ระบบบริการยืม-คืน (Circulation Borrow & Return Desk)
- ทำรายการยืมหนังสือ (Borrow Transaction): ระบุรหัสสมาชิก + รหัสหนังสือ
- ตรวจสอบสิทธิ์การยืมของสมาชิกและจำนวนหนังสือคงเหลือแบบ Real-time
- คำนวณวันเกินกำหนด (Overdue Days) และคำนวณค่าปรับอัตโนมัติ

### 3.5 ระบบจัดเก็บและจัดการไฟล์บน Google Drive (Drive File Storage Manager)
- อัปโหลดไฟล์จาก Web App ไปยัง Google Drive อัตโนมัติ (Base64 Binary Conversion)
- จัดเก็บแยกเป็น Sub-folders ชัดเจน (`/uploads/books`, `/uploads/members`, `/uploads/attachments`)
- มีระบบ **Extension Whitelist Filter** ปฏิเสธไฟล์ประเภทซอร์สโค้ด `.gs`, ไฟล์เอกสารระบบ `.md`, และไฟล์คอนฟิก `.env` โดยเด็ดขาด

---

## 4. ข้อกำหนดสถาปัตยกรรมและความปลอดภัย (Non-Functional & Security Requirements)

### 4.1 Client Anti-Inspect & Server-Side Security Isolation
- **Client Shield**: การกด F12 หรือการ Inspect บนหน้าเว็บฝั่งผู้ใช้ไม่สามารถดึงข้อมูลตรงจาก Google Sheets ได้ เนื่องจากเบราว์เซอร์ติดต่อเฉพาะกับ Web App API เท่านั้น
- **Backend Isolation**: สิทธิ์การเขียน อ่าน ลบ ตาราง Google Sheets อยู่ภายใต้บัญชีเจ้าของระบบ (`Execute as Me`) ฝั่ง GAS ผู้ใช้ภายนอกไม่สามารถเข้าถึงหน้าชีตโดยตรงได้

### 4.2 Data Race & Concurrency Protection
- ฝั่ง Google Apps Script ใช้ `LockService.getScriptLock()` ครอบการเขียนข้อมูล (`doPost` / Write Operations) ทุกครั้ง เพื่อป้องกันปัญหาข้อมูลตีกันเมื่อมีผู้ใช้งานพร้อมกัน

### 4.3 Anti-Formula Injection & File Upload Security
- ระบบทำการตัดสัญลักษณ์สูตร (`=`, `+`, `-`, `@`, `=IMPORTXML`, `=IMAGE`) ออกจากข้อมูลอินพุตผู้ใช้ ป้องกันความเสียหายใน Google Sheets
