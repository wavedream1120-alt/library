# MASTER PROMPT สำหรับการออกแบบและพัฒนา Web Application ด้วย Google Stitch + Supabase + Google Drive + Google Apps Script (GAS)

---

# บทบาท (Role)

Act as a **Senior Software Architect, Senior Full Stack Developer, Senior UX/UI Designer, System Analyst, Database Architect, DevOps Engineer, Product Designer และ Enterprise Solution Architect**

หน้าที่ของคุณคือ

* วิเคราะห์ความต้องการของระบบ
* อ่านไฟล์ `.md` ที่แนบมาทั้งหมด
* ออกแบบ UX/UI
* ออกแบบฐานข้อมูล
* ออกแบบ API
* ออกแบบโครงสร้างระบบ
* ออกแบบ Security
* ออกแบบระบบจัดเก็บไฟล์
* ออกแบบ Dashboard
* ออกแบบ Responsive Design
* ออกแบบให้พร้อมพัฒนาจริง (Production Ready)

---

# ขั้นตอนการทำงาน (Workflow)

ก่อนเริ่มงาน ให้ทำตามลำดับดังนี้

1. อ่านไฟล์ `.md` ทุกไฟล์ที่แนบมาอย่างละเอียด
2. วิเคราะห์ Requirement ทั้งหมด
3. รวม Requirement ที่ซ้ำกัน
4. ตรวจสอบ Requirement ที่ขัดแย้งกัน
5. หากข้อมูลไม่ครบ ให้เสนอแนวทางตาม Best Practice
6. ใช้ข้อมูลในไฟล์ `.md` เป็นแหล่งข้อมูลหลัก
7. ใช้ Project Configuration ด้านล่างเป็นค่ามาตรฐานของโครงการ
8. ออกแบบระบบให้รองรับการขยายในอนาคต (Scalable Architecture)

---

# Project Configuration

## Project Information

**PROJECT_NAME** 
เช็คชื่อ

---

**PROJECT_DESCRIPTION**
1. คำอธิบายโครงการ (Project Description)
ระบบนี้ถูกสร้างขึ้นเพื่อเป็นเครื่องมือช่วยแปลงข้อมูลดิบ หรือรายการลิงก์จำนวนมากที่ผู้ใช้คัดลอกมา ให้กลายเป็นลิงก์ดาวน์โหลดโดยตรง (Direct Download) โดยตัดขั้นตอนการเปลี่ยนเส้นทาง (Redirect) ที่ไม่จำเป็นออก เพื่อความรวดเร็วและรองรับการใช้งานที่ต่อเนื่องผ่านสถาปัตยกรรม Serverless (Cloudflare Pages & Workers)
2. ผังงานการทำงาน (Flowchart)
หมายเหตุ: ด้านล่างนี้คือผังลำดับขั้นตอนการทำงานของระบบ
1.	เริ่มต้น: ผู้ใช้คัดลอกข้อความและวาง (Paste) ข้อมูลลงในหน้าเว็บ
2.	การตรวจสอบ: ระบบ Frontend ตรวจสอบความถูกต้องของข้อมูลเบื้องต้น
3.	การประมวลผล: ส่ง Request ไปยัง API Gateway เพื่อให้ Parsing Engine สกัด URL ออกมา
4.	การคัดกรอง: ตรวจสอบแหล่งที่มาของลิงก์ว่าระบบรองรับหรือไม่
5.	การเตรียมการ: ดึง Metadata ของไฟล์และสร้างลิงก์ดาวน์โหลดตรง (Direct Link)
6.	การใช้งาน: ผู้ใช้กดดาวน์โหลด ระบบจะทำการ Stream ข้อมูลส่งให้โดยตรงโดยไม่ต้องพักไฟล์ไว้ที่เซิร์ฟเวอร์
3. ผังความสัมพันธ์ของข้อมูล (ER Diagram)
หมายเหตุ: โครงสร้างความสัมพันธ์ที่สำคัญภายในระบบ
•	ผู้ใช้งาน (User): เป็นผู้สร้างงาน (Job)
•	งาน (Job): จัดเก็บรหัสงาน (Job ID), วันที่สร้าง, และสถานะการทำงาน
•	ลิงก์ไฟล์ (File Link): เก็บข้อมูลไฟล์, ลิงก์ต้นทาง (Original URL), และลิงก์สำหรับดาวน์โหลด (Direct Download URL) โดยจะเชื่อมโยงกับงานที่สร้างขึ้น
4. ซูโดโค้ด (Pseudocode)
หมายเหตุ: ตรรกะการทำงานในส่วนของ Backend
ฟังก์ชัน HandleRequest(Request):
1.	รับข้อมูลจากตัวแปร Request
2.	ใช้ฟังก์ชัน ExtractURLs เพื่อแยก URL ออกจากข้อความดิบ
3.	หากไม่พบ URL ให้แจ้งเตือนความผิดพลาด
4.	ทำการวนลูปตรวจสอบ URL ทีละรายการ
5.	เรียกฟังก์ชัน GetFileMetadata เพื่อดึงข้อมูลไฟล์
6.	ส่งคืนค่าเป็นไฟล์ JSON เพื่อแสดงผลที่หน้าเว็บ
ฟังก์ชัน DownloadStream(Request):
1.	รับค่า TargetURL จาก Query Parameter
2.	ใช้คำสั่ง Fetch เพื่อดึงไฟล์จากต้นทาง
3.	ตอบกลับด้วย NewResponse ที่กำหนด Content-Disposition เป็น attachment เพื่อให้ดาวน์โหลดทันที
5. แนวทางการพัฒนาด้วย Cloudflare
•	Frontend: ใช้ Cloudflare Pages เชื่อมต่อกับ Framework เช่น React หรือ Vue โดยเขียนคำสั่งรองรับเหตุการณ์ onPaste
•	Backend: ใช้ Cloudflare Workers เพื่อทำหน้าที่เป็น API Endpoint สำหรับการ Parsing และ Stream ข้อมูล
•	ความปลอดภัย: ติดตั้ง Anti-SSRF เพื่อป้องกันการดึงข้อมูลจากเครือข่ายภายใน และใช้ Rate Limiting เพื่อป้องกันการใช้งานหนาแน่นเกินไป
---

**PROJECT_VERSION**
 1.0

**DOMAIN**

---

**TIMEZONE**

utc+7

**LANGUAGE**

thai / english

---

# Google Stitch

ใช้สำหรับออกแบบ UX/UI

[https://stitch.withgoogle.com/](https://stitch.withgoogle.com/)

ออกแบบให้เป็น

* Modern
* Professional
* ai Style
* Material Design 3
* Responsive
* Mobile First
* Enterprise UI
* Clean Design
* Consistent Design System
* Accessible (WCAG)

---

# Supabase Configuration

password database is root@KANTIDA28

**SUPABASE_URL**
https://ewqzqwmarlmetuvndcxe.supabase.co

---

**SUPABASE_ANON_KEY**
sb_publishable_Rw8uQspCcyQP5BmPkC3SGQ_KdaN523e
---

**SUPABASE_SERVICE_ROLE_KEY**
YOUR_SUPABASE_SERVICE_ROLE_KEY

---

**SUPABASE_PROJECT_ID**
ewqzqwmarlmetuvndcxe
---

**SUPABASE_DATABASE_NAME**
postgres
---

**SUPABASE_SCHEMA**

Public
SUPABASE_TABLE_NAME
---

# Google Apps Script Configuration ช่วยป้องการการวางสูตรใน google sheet เพื่อป้องกัน ทำให้ฐานข้อมูลเสียหาย และ วางแผนป้องกัน การเข้าถึงฐานข้อมูล ด้วยโหมดนักพัฒนาหน้าเว็บผู้ใช้โดยการกด f12 inspect

**GAS_PROJECT_URL**

---

**GAS_PROJECT_ID**
---

**GAS_DEPLOYMENT_ID**

---

**GAS_WEB_APP_URL**

---

**GAS_EXECUTION_API**

---

---

# Google Drive Configuration

**GOOGLE_DRIVE_FOLDER_NAME**
GAS_File ปวช.2 68
---

**GOOGLE_DRIVE_FOLDER_URL**
https://drive.google.com/drive/folders/1VPgv0QCycqXqcyK8eiXXFAaxXG6aarw6?dmr=1&ec=wgc-drive-%5Bmodule%5D-goto
https://script.google.com/macros/s/AKfycbzN5ag9TCneBZaNtzfk1L71jrbp8mDWrpt50KlOCffxbPKq1FYqgrrvofsoQGNxTpKp/exec


---

**GOOGLE_DRIVE_FOLDER_ID**
1VPgv0QCycqXqcyK8eiXXFAaxXG6aarw6?dmr=1&ec=wgc-drive-%5Bmodule%5D-goto
AKfycbzN5ag9TCneBZaNtzfk1L71jrbp8mDWrpt50KlOCffxbPKq1FYqgrrvofsoQGNxTpKp

---

**GOOGLE_SHARED_DRIVE**

---

---

# Git Repository

**GITHUB_REPOSITORY**

---

**GITHUB_BRANCH**

---

**GITHUB_PAGES_URL**

---

---

# Authentication

รองรับ

☐ Email or username / Password

☐ Google Login



Role

* Super Admin
* Admin
* Manager
* Staff
* User
* Viewer

ใช้หลัก

* Role Based Access Control (RBAC)
* Row Level Security (RLS)

---

# Technology Stack

## Frontend

* HTML5
* CSS3
* Tailwind CSS
* JavaScript ES6+
* Material Design 3
* Google Font (Kanit)
* Font Awesome
* Chart.js

## Backend

Google Apps Script (GAS)

## Database

Supabase PostgreSQL

## Storage

Google Drive

---

# File Storage

ใช้ Google Drive สำหรับจัดเก็บ และจัดเรียงให้เป็นระบบ

* Images
* PDF
* Word
* Excel
* PowerPoint
* ZIP
* Videos
* Attachments

รองรับ

* Upload
* Multi Upload
* Drag & Drop
* Preview
* Download
* Delete
* Folder Management
* Version Control
* File Permission
* Public URL
* Thumbnail

Google Apps Script เป็นตัวกลางเชื่อมต่อ Google Drive

---

# Dashboard

ออกแบบ Dashboard ระดับ Enterprise

ประกอบด้วย

* KPI Cards
* Summary Cards
* Statistics
* Charts
* Graph
* Calendar
* Recent Activity
* Notifications
* Quick Actions

Responsive ทุกอุปกรณ์

---

# Responsive Design

รองรับ

* Desktop
* Notebook
* Tablet
* Mobile

ใช้ Mobile First

---

# UI Design

ใช้แนวทาง

* Modern
* Minimal
* Professional
* Enterprise
* AI Style
* Material Design 3

Theme

Primary Color

Blue

Secondary

White

Accent

Gradient

รองรับ

* Light Mode
* Dark Mode

---

# Components

ออกแบบ Component ทั้งระบบ

เช่น

* Button
* Card
* Table
* Modal
* Dialog
* Toast
* Snackbar
* Sidebar
* Navbar
* Breadcrumb
* Tabs
* Accordion
* Timeline
* Badge
* Avatar
* Pagination
* Search
* Filter
* Charts

---

# Data Table

รองรับ

* Search
* Filter
* Sort
* Pagination
* Export Excel
* Export CSV
* Export PDF
* Print
* Responsive

---

# Reports

รองรับ

* Dashboard Analytics
* PDF
* Excel
* CSV
* Printable Report

---

# Notification

รองรับ

* Toast
* Snackbar
* Email
* System Notification
* Activity Log

---

# Logging

ออกแบบ

* Audit Log
* Login Log
* File Log
* API Log
* Error Log

---

# Security

ออกแบบ

* Authentication
* Authorization
* RLS
* SQL Injection Protection
* XSS Protection
* CSRF Protection
* Input Validation
* Rate Limiting
* API Security
* HTTPS
* Secure Headers

---

# Performance

รองรับข้อมูลจำนวนมาก

* Lazy Loading
* Pagination
* Optimized SQL
* Cache
* CDN Ready

---

# Database Design

ใช้

Supabase PostgreSQL

ออกแบบ

* Database Schema
* ER Diagram
* Relationships
* Primary Key
* Foreign Key
* Constraints
* Index
* Trigger
* Views
* Functions

รองรับการขยายในอนาคต

---

# API Design

ออกแบบ REST API

พร้อม

* Request
* Response
* Status Code
* Validation
* Authentication
* Error Response

---

# Folder Structure

ออกแบบโครงสร้าง

Frontend

Backend

Assets

Components

Pages

Services

Utils

Config

Database

Documentation

---

# AI Output Requirements

เมื่ออ่านไฟล์ `.md` แล้ว ให้สร้างผลลัพธ์ดังต่อไปนี้

1. วิเคราะห์ระบบ (System Analysis)
2. Functional Requirements
3. Non-Functional Requirements
4. User Personas
5. Stakeholders
6. User Journey
7. User Flow
8. Information Architecture
9. Site Map
10. Use Case Diagram
11. Activity Diagram
12. Sequence Diagram
13. ER Diagram
14. Database Schema
15. Table Structure
16. API Design
17. API Documentation
18. Folder Structure
19. Wireframe
20. High Fidelity UI
21. Design System
22. Color Palette
23. Typography
24. Component Library
25. Dashboard Design
26. CRUD Pages
27. Report Pages
28. Authentication Flow
29. Authorization Design
30. Google Drive Integration
31. Google Apps Script Architecture
32. Supabase Architecture
33. Deployment Architecture
34. Security Design
35. Backup Strategy
36. Performance Optimization
37. Responsive Design
38. Testing Plan
39. Future Scalability
40. Best Practice Recommendations

---

# Coding Standards

ปฏิบัติตามมาตรฐานดังนี้

* Clean Architecture
* SOLID Principles
* DRY
* KISS
* RESTful API
* Secure Coding
* Responsive First
* Mobile First
* Reusable Components
* Modular Structure
* Naming Convention
* Enterprise Coding Standards

---

# ข้อกำหนดเพิ่มเติม

* ใช้ข้อมูลจากไฟล์ `.md` เป็นแหล่งข้อมูลหลัก
* หากพบข้อมูลไม่ครบ ให้เสนอแนวทางเพิ่มเติมตามหลัก Best Practice
* ไม่สร้างข้อมูลที่ขัดแย้งกับไฟล์ `.md`
* ออกแบบให้พร้อมใช้งานจริง (Production Ready)
* รองรับผู้ใช้งานจำนวนมาก
* รองรับการเพิ่มโมดูลในอนาคต
* รองรับการเชื่อมต่อ API ภายนอก
* รองรับการนำ AI เข้ามาใช้งานในอนาคต
* ใช้มาตรฐาน Enterprise Software
* ให้เหตุผลประกอบการออกแบบทุกส่วนที่สำคัญ

---

# เป้าหมายของระบบ

สร้าง Web Application ที่มีคุณสมบัติดังนี้

* UX/UI ระดับมืออาชีพ
* ใช้งานง่าย
* รวดเร็ว
* ปลอดภัย
* รองรับ Responsive
* ขยายระบบได้ง่าย
* บำรุงรักษาง่าย
* เชื่อมต่อ Supabase ได้อย่างสมบูรณ์
* เชื่อมต่อ Google Drive ผ่าน Google Apps Script ได้อย่างสมบูรณ์
* พร้อมสำหรับการพัฒนาและใช้งานจริงในระดับ Production

Prompt นี้สามารถใช้เป็น **Template หลัก** สำหรับทุกโปรเจกต์ของคุณได้ เพียงกรอกข้อมูลในส่วน **Project Configuration** และแนบไฟล์ `.md` ของโครงการ จากนั้น AI จะใช้ไฟล์ดังกล่าวเป็นข้อมูลอ้างอิงหลัก พร้อมออกแบบระบบโดยยึด **Google Stitch** สำหรับ UX/UI, **Supabase** สำหรับฐานข้อมูล และ **Google Drive + Google Apps Script (GAS)** สำหรับการจัดเก็บไฟล์และ Backend ตามมาตรฐานเดียวกันทุกครั้ง.
