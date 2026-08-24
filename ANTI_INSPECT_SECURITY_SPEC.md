# เอกสารข้อกำหนดระบบป้องกันการเข้าถึงฐานข้อมูลและการแอบดูซอร์สโค้ด (Anti-Inspect & Security Specification)
**โครงการ:** Smart Library Command Center (ศูนย์ควบคุมห้องสมุดอัจฉริยะ)  
**วันที่บันทึกเอกสาร:** 14 สิงหาคม 2569 (14 August 2026)  
**สถานะการติดตั้งระบบ:** ติดตั้งและเปิดใช้งานเรียบร้อยแล้ว (ENABLED & ACTIVE 🛡️)  

---

## 📌 1. บทนำและวัตถุประสงค์ (Executive Summary)
เอกสารฉบับนี้จัดทำขึ้นเพื่อสรุปมาตรการความปลอดภัยและกลไกการคุ้มครองระบบของ **Smart Library Command Center** จากการพยายามแอบดูซอร์สโค้ด (View Source), การสกัดโครงสร้างตัวแปร (DevTools Console Inspection), การเปิดเครื่องมือตรวจสอบองค์ประกอบหน้าเว็บ (Inspect Element / F12) รวมถึงการป้องกันการวางสูตรคำนวณอันตราย (Formula Injection Protection) ที่อาจส่งผลกระทบให้ฐานข้อมูล Google Sheets เสียหาย

---

## 🛡️ 2. กลไกการป้องกันความปลอดภัย 2 ชั้น (Double Shield Security Architecture)

```
+---------------------------------------------------------------------------------+
|                         CLIENT BROWSER FRONTEND SHIELD                          |
|  - Disable Right-Click (Context Menu Blocked)                                   |
|  - Block Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)     |
|  - Block View Source (Ctrl+U) & Save Page (Ctrl+S)                              |
|  - Console Log Sanitizer & Security Warning Banner                              |
+----------------------------------------+----------------------------------------+
                                         | REST API Calls Only (JSON Data)
                                         v
+---------------------------------------------------------------------------------+
|                         SERVER-SIDE GAS SECURITY ENGINE                         |
|  - Server Isolation: Google Sheet & Drive URLs are NOT exposed to Client        |
|  - Execute Permissions: Locked to "Execute as Me" (System Owner Account)        |
|  - Formula Protection Engine (sanitizeFormulaInput): Strips =, +, -, @, IMPORT  |
|  - File Whitelist Filter: Blocks .gs, .md, .env, .exe script uploads            |
|  - Concurrency Lock: LockService.getScriptLock() prevents Data Race             |
+----------------------------------------+----------------------------------------+
                                         | Secure Appending / Reading
                                         v
+---------------------------------------------------------------------------------+
|                        GOOGLE SHEETS DATABASE & DRIVE STORAGE                   |
|  - Books, Members, Circulation, IoTSensors, AuditLogs, FileStorage              |
+---------------------------------------------------------------------------------+
```

---

## 🔒 3. รายละเอียดการป้องกันการกด F12 / Inspect Element (Anti-Inspect Shield)

### 3.1 การบล็อกปุ่มทางลัดแป้นพิมพ์ (Keyboard Shortcut Shielding)
ระบบฝั่ง Frontend (`frontend/js/app.js`) ติดตั้ง Event Listener ในระดับ Global Document เพื่อดักจับและยกเลิกคำสั่งทางลัดดังต่อไปนี้:

| ปุ่มทางลัด (Keyboard Shortcut) | เครื่องมือที่ถูกบล็อก (Target Tool) | ผลลัพธ์เมื่อผู้ใช้กด |
| :--- | :--- | :--- |
| **`F12`** | Developer Tools Window | ยกเลิกคำสั่ง + แสดง Toast Alert เตือนความปลอดภัย |
| **`Ctrl + Shift + I`** | Inspect Element Window | ยกเลิกคำสั่ง + แสดง Toast Alert แจ้งเตือน |
| **`Ctrl + Shift + J`** | Console Window | ยกเลิกคำสั่ง + แสดง Toast Alert แจ้งเตือน |
| **`Ctrl + Shift + C`** | Inspect Element Selector | ยกเลิกคำสั่งทันที |
| **`Ctrl + U`** | View Page Source (ดูซอร์สโค้ด) | ยกเลิกคำสั่ง + แสดง Toast Alert แจ้งเตือน |
| **`Ctrl + S`** | Save Web Page to Disk | ยกเลิกคำสั่งบันทึกหน้าเว็บ |

### 3.2 การบล็อกการคลิกขวา (Disable Right-Click Context Menu)
- ระบบดักจับเหตุการณ์ `contextmenu` บนหน้าเว็บทั้งหมด เพื่อป้องกันไม่ให้ผู้ใช้งานเปิดเมนูป๊อปอัปสำหรับเลือก `Inspect` หรือ `View Page Source`

### 3.3 การคุ้มครอง Console Window (Console Log Protection)
- หากผู้ใช้พยายามแอบเปิด DevTools สำเร็จ ระบบจะทำการซ่อนและล้าง Log (`console.clear()`) พร้อมแสดงป้ายเตือนความปลอดภัยระดับสูงเพื่อแจ้งเตือนสิทธิ์การใช้งาน

---

## ⚙️ 4. สถาปัตยกรรมซ่อนฐานข้อมูลฝั่ง Server (Server-Side Isolation)

1. **การซ่อนโครงสร้างฐานข้อมูล (Database URL Hiding)**:
   - ผู้ใช้หน้าเว็บเบราว์เซอร์จะไม่สามารถมองเห็น URL หรือ ID ของ Google Sheets และ Google Drive ได้ เนื่องจากระบบส่งข้อมูลผ่าน **Google Apps Script REST API Gateway**
2. **การกำกับสิทธิ์แบบ Execute as Me**:
   - การอ่านและเขียนข้อมูลบน Google Sheet ถูกดำเนินการภายใต้บัญชีสิทธิ์ของเจ้าของระบบผ่าน GAS ฝั่ง Server แม้ผู้ใช้จะแอบเปิด Inspect บนเบราว์เซอร์ก็ไม่สามารถเข้าถึงหน้าตารางชีตโดยตรงได้

---

## 🛡️ 5. ระบบป้องกันการวางสูตรคำนวณ (Formula Protection Engine)

1. **ฟังก์ชัน `sanitizeFormulaInput` (ฝั่ง `SheetService.gs`)**:
   - ตรวจสอบข้อมูลข้อความก่อนบันทึกลงตาราง หากขึ้นต้นด้วยสัญลักษณ์สูตร (`=`, `+`, `-`, `@`, `\t`, `\r`) หรือฟังก์ชันคำนวณ (`=IMPORTXML`, `=IMAGE`, `=QUERY`, `=CELL`) ระบบจะเติม Single Quote (`'`) นำหน้าเพื่อบังคับเป็น Plain Text เสมอ
2. **การบังคับฟอร์แมต Plain Text (`Setup.gs`)**:
   - ตารางทั้ง 6 ชีตถูกตั้งค่าฟอร์แมตเซลล์เป็น Plain Text (`@`) พร้อมตั้งค่า Data Validation Dropdowns ล็อกชนิดข้อมูลในคอลัมน์สำคัญ

---

## 📁 6. รายการไฟล์ในเครื่องคอมพิวเตอร์ของคุณ

ไฟล์เอกสารและซอร์สโค้ดทั้งหมดในโฟลเดอร์ `d:\พัชรพล\stitch_smart_library_command_center\`:

1. 📄 **[`ANTI_INSPECT_SECURITY_SPEC.md`](file:///d:/พัชรพล/stitch_smart_library_command_center/ANTI_INSPECT_SECURITY_SPEC.md)** *(เอกสารสเปกระบบป้องกัน F12 & Database Protection ฉบับนี้)*
2. 📄 **[`SYSTEM_DESIGN_SPEC.md`](file:///d:/พัชรพล/stitch_smart_library_command_center/SYSTEM_DESIGN_SPEC.md)** *(เอกสารข้อกำหนดและการออกแบบระบบ)*
3. 📄 **[`IMPLEMENTATION_PLAN.md`](file:///d:/พัชรพล/stitch_smart_library_command_center/IMPLEMENTATION_PLAN.md)** *(ไฟล์แผนการพัฒนาสถาปัตยกรรมระบบ)*
4. 📄 **[`GAS_SETUP_GUIDE.md`](file:///d:/พัชรพล/stitch_smart_library_command_center/GAS_SETUP_GUIDE.md)** *(คู่มือภาษาไทยสำหรับติดตั้ง Google Apps Script)*
5. 📄 **[`DAILY_WORK_LOG_2026-08-10.md`](file:///d:/พัชรพล/stitch_smart_library_command_center/DAILY_WORK_LOG_2026-08-10.md)** *(บันทึกสรุปการทำงานประจำวัน)*
