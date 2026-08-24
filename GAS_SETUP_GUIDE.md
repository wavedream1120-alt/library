# คู่มือขั้นตอนการติดตั้ง Google Apps Script (GAS Setup Guide)
**โครงการ:** Smart Library Command Center (ศูนย์ควบคุมห้องสมุดอัจฉริยะ)  
**ระบบป้องกันความปลอดภัย:** Formula Injection Protection & Concurrency Protection Engine  

---

## 📌 ขั้นตอนที่ 1: การนำโค้ดไปติดตั้งใน Google Apps Script Editor

1. เปิด **Google Sheet Database** ของคุณขึ้นมา
2. ไปที่เมนูหลักด้านบน: **Extensions (ส่วนขยาย)** -> **Apps Script**
3. ลบโค้ดเดิมในไฟล์ `Code.gs` ออกทั้งหมด
4. สร้างไฟล์สคริปต์ย่อยใน Apps Script ให้ครบ 4 ไฟล์ โดยกดปุ่ม **+ (เพิ่มไฟล์)** -> **Script** แล้วนำโค้ดจากโฟลเดอร์ `gas/` ไปวางดังนี้:

| ชื่อไฟล์ใน Apps Script | ซอร์สโค้ดในโปรเจกต์ | หน้าที่ของไฟล์ |
| :--- | :--- | :--- |
| `Setup.gs` | `gas/Setup.gs` | ฟังก์ชัน `setupDatabase()` เนรมิตตาราง 6 Sheets และโฟลเดอร์ Drive อัตโนมัติ |
| `Code.gs` | `gas/Code.gs` | RESTful API Router `doGet` / `doPost` มี CORS & Audit Logs |
| `SheetService.gs` | `gas/SheetService.gs` | CRUD Operations อ่าน-เขียนข้อมูล **พร้อมระบบป้องกันการพิมพ์สูตร** |
| `DriveService.gs` | `gas/DriveService.gs` | จัดการไฟล์บน Google Drive **พร้อมระบบกรองนามสกุลไฟล์ความลับ (.gs, .md, .env)** |

---

## 🛠️ ขั้นตอนที่ 2: การเนรมิตฐานข้อมูลอัตโนมัติ (Run setupDatabase)

1. ในหน้า Google Apps Script Editor ให้มองหาแถบเลือกฟังก์ชันด้านบน
2. เลือกฟังก์ชัน **`setupDatabase`** แล้วกดปุ่ม **Run (เรียกทำงาน)**
3. ในการรันครั้งแรก ระบบของ Google จะขอรับสิทธิ์เข้าถึง (Authorization Required) ให้กด **Review Permissions** -> เลือกบัญชี Google ของคุณ -> กด **Advanced** -> กด **Go to (unsafe)** -> กด **Allow**
4. ระบบจะทำการ:
   - สร้าง 6 ตารางใน Google Sheet (`Books`, `Members`, `Circulation`, `IoTSensors`, `AuditLogs`, `FileStorage`)
   - จัดฟอร์แมตตัวหนา สีหัวตาราง #0F172A และใส่ Data Validation Dropdowns
   - บังคับฟอร์แมตเซลล์ข้อมูลเป็น Plain Text `@` เพื่อ **ป้องกันการวางสูตรทำให้ฐานข้อมูลพัง**
   - สร้าง Sub-folders อัตโนมัติใน Google Drive (`/uploads/books`, `/uploads/members`, `/uploads/attachments`)

---

## 🚀 ขั้นตอนที่ 3: การตั้งค่า Deploy as Web App

1. ที่มุมขวาบนของหน้า Apps Script กดปุ่ม **Deploy (ทำให้ใช้งานได้)** -> เลือก **New deployment (การทำให้ใช้งานได้ใหม่)**
2. กดปุ่มเฟือง ⚙️ ข้างคำว่า Select type -> เลือก **Web app**
3. ตั้งค่าพารามิเตอร์ดังนี้:
   - **Description**: `Smart Library Command Center API v1.0`
   - **Execute as (สิทธิ์การรัน)**: `Me (เจ้าของบัญชี)`
   - **Who has access (ผู้มีสิทธิ์เข้าถึง)**: `Anyone (ทุกคน)` *(เพื่อให้ Web App หน้าบ้านเรียกใช้ API ได้)*
4. กดปุ่ม **Deploy**
5. คัดลอก **Web App URL** ที่ได้ (เช่น `https://script.google.com/macros/s/AKfycb.../exec`)

---

## 💻 ขั้นตอนที่ 4: การตั้งค่าฝั่ง Web Application Frontend

1. เปิดไฟล์ `frontend/js/env.template.js`
2. บันทึกเป็นไฟล์ `frontend/js/env.js`
3. นำ **Web App URL** จากขั้นตอนที่ 3 มาวางแทนค่าเดิม:

```javascript
window.CONFIG = {
  GAS_WEB_APP_URL: "นำ_Web_App_URL_ของคุณมาวางตรงนี้",
  GOOGLE_SHEET_ID: "1g8uo3oI3eEeFn3s-3KKrGMt7FisxR8h_2p4vAxVK5Xs",
  GOOGLE_DRIVE_FOLDER_ID: "1VESFkfQ3WhfJVji2itnHNyqHZ_uFbai_",
  USE_MOCK_FALLBACK: true
};
```
4. ดับเบิลคลิกเปิดไฟล์ `frontend/index.html` เพื่อเริ่มใช้งานศูนย์ควบคุมห้องสมุดอัจฉริยะได้ทันที!

---

## 🛡️ กลไกการป้องกันความปลอดภัยและการป้องกันฐานข้อมูลพัง (Technical Details)

### 1. การป้องกัน Formula Injection (`sanitizeFormulaInput`)
- หากผู้ใช้พิมพ์ข้อความที่ขึ้นต้นด้วยสัญลักษณ์สูตร เช่น `=`, `+`, `-`, `@`, `=IMPORTXML`, `=IMAGE`, `=QUERY`
- ระบบทั้งฝั่ง Frontend (`api.js`) และ Backend (`SheetService.gs`) จะทำการเติม Single Quote (`'`) นำหน้า หรือตัดสัญลักษณ์ออก เพื่อบังคับให้ Google Sheets มองเป็นข้อความ Plain Text ธรรมดาเท่านั้น ไม่ประมวลผลเป็นสูตร

### 2. การป้องกัน Concurrency / Data Race (`LockService`)
- ทุกการเขียนข้อมูล (`doPost`, `insertSheetRow`, `updateSheetRow`, `deleteSheetRow`) จะถูกครอบด้วย `LockService.getScriptLock()` เป็นเวลาสูงสุด 10 วินาที ป้องกันข้อมูลชนกันเมื่อมีผู้ใช้งานทำรายการพร้อมกันหลายคน
