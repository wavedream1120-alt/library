/**
 * Smart Library Command Center - Environment Configuration Template
 * 
 * คัดลอกไฟล์นี้เป็น env.js และใส่ URL ของ Google Apps Script Web App Deployment ของคุณ
 * (ไฟล์นี้ปลอดภัย ปราศจากข้อมูล Secret/Key ความลับ)
 */

window.CONFIG = {
  // URL สำหรับเรียกใช้งาน Google Apps Script Web App API
  GAS_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbzMX07yiOOPBtMg4OUxUrlh-Qfuxbm_6BdN_t-MMXoDo5JbN10PXMjh-0JcjJf9J2VO/exec",
  
  // URL หรือ ID ของ Google Sheet Database
  GOOGLE_SHEET_ID: "1g8uo3oI3eEeFn3s-3KKrGMt7FisxR8h_2p4vAxVK5Xs",
  
  // Folder ID สำหรับ Google Drive
  GOOGLE_DRIVE_FOLDER_ID: "1VESFkfQ3WhfJVji2itnHNyqHZ_uFbai_",
  
  // เปิดใช้ Mock Data Fallback กรณีไม่สามารถเชื่อมต่อ GAS API ได้
  USE_MOCK_FALLBACK: true,
  
  // เวลาการส่งข้อมูลซ้ำสูงสุดเมื่อเกิด Timeout (มิลลิวินาที)
  API_TIMEOUT_MS: 12000,
  
  // จำนวนการลองใหม่เมื่อ API ไม่ตอบสนอง
  MAX_RETRIES: 3
};
