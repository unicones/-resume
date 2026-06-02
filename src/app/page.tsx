"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Code2,
  Award,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  ExternalLink,
  ShieldCheck,
  Check,
  Loader2,
  X,
  Send,
  MessageSquare,
  BookOpen,
  Layers,
  Activity,
  Shield,
  Network,
  Server,
  Wifi,
  Cpu,
  Database,
  HardDrive,
  Cloud,
  Terminal,
  Video,
  Fingerprint,
  Languages,
  Users,
  TrendingDown,
  FileCode
} from "lucide-react";

// UI Translations
const uiTranslations: { [key: string]: any } = {
  th: {
    profile: "โปรไฟล์",
    about: "เกี่ยวกับเรา",
    projects: "ผลงาน",
    experience: "ประสบการณ์",
    skills: "ทักษะ",
    certifications: "ใบรับรอง",
    contact: "ติดต่อ",
    getInTouch: "ติดต่อเรา",
    exploreDetails: "ดูรายละเอียด",
    viewPdf: "ดูไฟล์ PDF",
    featuredProject: "ผลงานแนะนำ",
    keyAccomplishments: "ผลงานสำคัญ",
    responsibilities: "หน้าที่รับผิดชอบ",
    interactiveSkills: "ทักษะอินเตอร์แอคทีฟ",
    experienceYears: "ประสบการณ์",
    activeUsers: "ผู้ใช้งานเครือข่าย",
    costReduction: "ลดต้นทุน/ปี",
    developedSystems: "พัฒนาเอง",
    experienceYearsVal: "9+ ปี",
    activeUsersVal: "160+ คน",
    developedSystemsVal: "4 ระบบ",
    directContact: "ช่องทางติดต่อโดยตรง",
    sendMessage: "ส่งข้อความติดต่อร่วมงาน",
    nameLabel: "ชื่อของคุณ",
    emailLabel: "อีเมลติดต่อกลับ",
    messageLabel: "รายละเอียดงาน / ข้อความ",
    sendMessageBtn: "ส่งข้อความ",
    messageSentSuccess: "ส่งข้อความเรียบร้อยแล้ว",
    messageSentDesc: "ข้อความของคุณถูกส่งแล้ว เราจะติดต่อกลับโดยเร็วที่สุด",
    clickZoom: "คลิกเพื่อดูรูปใหญ่",
    noImage: "ไม่มีรูปภาพ",
    connectedToDb: "เชื่อมต่อฐานข้อมูล Supabase & Next.js 16",
    loadingDashboard: "กำลังโหลดข้อมูลแดชบอร์ด...",
    bioTitle: "ประวัติส่วนตัว",
    projectsTitle: "ผลงานและเว็บแอปพลิเคชันทั้งหมด",
    experienceTitle: "ประสบการณ์การทำงาน",
    skillsTitle: "รายละเอียดทักษะและความเชี่ยวชาญ",
    certificationsTitle: "ใบอนุญาตและใบรับรองวิชาชีพ",
    contactTitle: "ช่องทางติดต่อและฟอร์มส่งอีเมล",
    dateIssued: "ออกให้เมื่อ",
    email: "อีเมล",
    phone: "เบอร์โทรศัพท์",
    location: "ที่อยู่",
    birthdate: "วันเกิด",
    downloadCv: "ดาวน์โหลด PDF / พิมพ์"
  },
  en: {
    profile: "Profile",
    about: "About",
    projects: "Projects",
    experience: "Experience",
    skills: "Skills",
    certifications: "Certifications",
    contact: "Contact",
    getInTouch: "Get In Touch",
    exploreDetails: "Explore Details",
    viewPdf: "View PDF",
    featuredProject: "Featured Project",
    keyAccomplishments: "Key Accomplishments",
    responsibilities: "Responsibilities",
    interactiveSkills: "Interactive Skills",
    experienceYears: "Experience",
    activeUsers: "Network Users",
    costReduction: "IT Cost Saved/Yr",
    developedSystems: "Systems Built",
    experienceYearsVal: "9+ Years",
    activeUsersVal: "160+ Users",
    developedSystemsVal: "4 Systems",
    directContact: "Direct Contacts",
    sendMessage: "Send Business Message",
    nameLabel: "Your Name",
    emailLabel: "Contact Email",
    messageLabel: "Project Details / Message",
    sendMessageBtn: "Send Message",
    messageSentSuccess: "Message Sent Successfully",
    messageSentDesc: "Your message has been sent. We will get back to you as soon as possible.",
    clickZoom: "Click to zoom image",
    noImage: "No Image Available",
    connectedToDb: "Connected to Supabase DB & Next.js 16",
    loadingDashboard: "Loading Dashboard Data...",
    bioTitle: "About Me",
    projectsTitle: "All Projects & Web Applications",
    experienceTitle: "Professional Experience",
    skillsTitle: "Detailed Skills Inventory",
    certificationsTitle: "Licenses & Certifications",
    contactTitle: "Contact Panel & Email Form",
    dateIssued: "Issued date",
    email: "Email Address",
    phone: "Phone Number",
    location: "Location",
    birthdate: "Birth Date",
    downloadCv: "Download PDF / Print"
  },
  zh: {
    profile: "个人简介",
    about: "关于我",
    projects: "项目经验",
    experience: "工作经历",
    skills: "专业技能",
    certifications: "资质证书",
    contact: "联系我",
    getInTouch: "取得联系",
    exploreDetails: "探索详情",
    viewPdf: "查看 PDF",
    featuredProject: "推荐项目",
    keyAccomplishments: "核心业绩",
    responsibilities: "工作职责",
    interactiveSkills: "互动技能看板",
    experienceYears: "从业经验",
    activeUsers: "网络用户规模",
    costReduction: "年均IT降本",
    developedSystems: "自研系统数量",
    experienceYearsVal: "9 年以上",
    activeUsersVal: "160 多人",
    developedSystemsVal: "4 套系统",
    directContact: "直接联系方式",
    sendMessage: "发送合作意向信",
    nameLabel: "您的姓名",
    emailLabel: "联系邮箱",
    messageLabel: "项目详情 / 留言内容",
    sendMessageBtn: "发送留言",
    messageSentSuccess: "留言发送成功",
    messageSentDesc: "您的留言已成功发送。我们将尽快与您取得联系。",
    clickZoom: "点击查看大图",
    noImage: "暂无图片",
    connectedToDb: "已连接 Supabase 数据库 & Next.js 16",
    loadingDashboard: "正在加载仪表板数据...",
    bioTitle: "关于我",
    projectsTitle: "所有项目与 Web 应用程序",
    experienceTitle: "职业工作经历",
    skillsTitle: "专业技能清单",
    certificationsTitle: "专业资质与证书",
    contactTitle: "联系方式与留言板",
    dateIssued: "颁发日期",
    email: "电子邮箱",
    phone: "联系电话",
    location: "所在地",
    birthdate: "出生日期",
    downloadCv: "下载 PDF / 打印"
  }
};

// Mock Fallbacks representing user's real data
const mockProfile: { [key: string]: any } = {
  th: {
    name: "ปฏิวัติ มีแก้ว (Patiwat Meekaeo)",
    title: "ผู้จัดการแผนกไอที (IT Manager & Infrastructure)",
    bio: "นักบริหารระบบไอทีประสบการณ์กว่า 9 ปี ผู้เชี่ยวชาญการออกแบบและวางระบบโครงสร้างพื้นฐานเครือข่ายระดับองค์กร (Network Infrastructure, Active Directory, Windows Server), การบริหารจัดการระบบสำรองข้อมูล (Backup & Recovery ด้วย Veeam และ NAS) และระบบเฝ้าระวังเครือข่าย (Network Monitoring) ควบคู่ไปกับการดูแลระบบคลาวด์ Microsoft 365 (Email, SharePoint), ไฟร์วอลล์ (Firewall เช่น Fortigate, Sophos) และควบคุมระบบ ERP ในฐานะ Administrator (Mango ERP, Oracle ERP) นอกจากนี้ยังมีทักษะในการพัฒนาระบบเว็บแอปพลิเคชันและจัดการฐานข้อมูลภายในองค์กรโดยใช้ Python, SQL, JavaScript และ PHP เพื่อเพิ่มประสิทธิภาพการทำงานและลดต้นทุนไอทีอย่างเป็นรูปธรรม\nปัจจุบันดำรงตำแหน่งผู้จัดการแผนกไอที (Acting IT Manager & Infrastructure) ที่ S.MEC Engineering ควบคุมดูแลระบบไอทีครบวงจรเพื่อสนับสนุนผู้ใช้งานกว่า 160 คน โดยมีทักษะครอบคลุมตั้งแต่การวางระบบเครือข่ายหลัก ไปจนถึงการเขียนโปรแกรมและการจัดการข้อมูลอย่างเป็นระบบ",
    email: "patiwatmeekaeo@gmail.com",
    phone: "081-601-9666",
    address: "กรุงเทพมหานคร, ประเทศไทย",
    birthdate: "1983-01-11",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    line_id: "allfile"
  },
  en: {
    name: "Patiwat Meekaeo",
    title: "IT Manager & Infrastructure",
    bio: "IT infrastructure professional with over 9 years of experience, specializing in designing and implementing enterprise network systems (Network Infrastructure, Active Directory, Windows Server), managing backup environments (Backup & Recovery using Veeam and NAS), and system monitoring (Network Monitoring). Expertly administers Microsoft 365 cloud environments (Email, SharePoint), firewall security (Firewalls including Fortigate, Sophos), and ERP systems as an Administrator (Mango ERP, Oracle ERP). Additionally possesses strong capabilities in developing custom in-house web applications and database management using Python, SQL, JavaScript, and PHP to drive efficiency and optimize IT costs.\nCurrently serving as Acting IT Manager & Infrastructure at S.MEC Engineering, overseeing end-to-end IT operations for over 160 users, with a comprehensive skillset ranging from core network engineering to systematic software development and data management.",
    email: "patiwatmeekaeo@gmail.com",
    phone: "081-601-9666",
    address: "Bangkok, Thailand",
    birthdate: "1983-01-11",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    line_id: "allfile"
  },
  zh: {
    name: "巴迪瓦 (Patiwat Meekaeo)",
    title: "IT 部门经理 & 基础设施 (IT Manager & Infrastructure)",
    bio: "拥有超过 9 年经验的 IT 基础设施管理专家，擅长设计与部署企业级网络系统（网络基础设施、活动目录、Windows Server）、备份与灾难恢复（使用 Veeam 和 NAS）以及网络监控系统。精通 Microsoft 365 云环境（电子邮件、SharePoint）管理、防火墙安全防护（如 Fortigate、Sophos）以及以管理员身份（Administrator）运维 ERP 系统（Mango ERP、Oracle ERP）。此外，具备使用 Python、SQL、JavaScript 和 PHP 开发企业自研 Web 应用程序及数据库管理的能力，以提升组织效率并实现 IT 成本优化。\n目前担任 S.MEC Engineering 的代理 IT 部门经理（Acting IT Manager & Infrastructure），负责管理服务于 160 多名员工的端到端 IT 运营，技能范围涵盖核心网络架构、系统化软件开发以及数据管理。",
    email: "patiwatmeekaeo@gmail.com",
    phone: "081-601-9666",
    address: "曼谷, 泰国",
    birthdate: "1983-01-11",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    line_id: "allfile"
  }
};

const mockProjects: { [key: string]: any[] } = {
  th: [
    {
      id: "proj-1",
      title: "MEC CALIBRATION SYSTEM",
      company: "S.MEC Engineering",
      description: "ระบบบันทึกประวัติและสอบเทียบเครื่องมือวัดของไซต์งานก่อสร้างทั้ง 17 แห่ง ใช้ตรวจสอบค่าใช้จ่าย ส่งออกเอกสาร PDF และทำเรื่องขอโอนย้ายอุปกรณ์ข้ามไซต์งานโดยมี Super Admin เป็นผู้อนุมัติ",
      tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Google Drive API"],
      link: "#",
      isFeatured: true
    },
    {
      id: "proj-2",
      title: "IT PROJECT DASHBOARD",
      company: "S.MEC Engineering",
      description: "ระบบติดตามแผนงานและงบประมาณไอทีรายปี (Capex & Opex) ในรูปแบบ Gantt Chart พร้อมใช้เป็นระบบวัดผลงาน (KPI) ของเจ้าหน้าที่ไอทีในทีม",
      tags: ["Next.js", "Vercel", "Google Apps Script", "Google Sheets"],
      link: "#"
    },
    {
      id: "proj-3",
      title: "IN-HOUSE HELP DESK",
      company: "S.MEC Engineering",
      description: "ระบบแจ้งซ่อมคอมพิวเตอร์และช่วยเหลือปัญหาไอทีของพนักงาน 160 คน พร้อมระบบส่งแจ้งเตือนผ่าน LINE และอีเมลอัตโนมัติ",
      tags: ["HTML", "Vanilla JS", "PHP", "PostgreSQL", "LINE Notify API"],
      link: "#"
    },
    {
      id: "proj-4",
      title: "PRINT COST DASHBOARD",
      company: "S.MEC Engineering",
      description: "ระบบวิเคราะห์และสรุปยอดค่าใช้จ่ายการพิมพ์เอกสารแยกตามแผนก ช่วยควบคุมและลดค่าใช้จ่ายไอที (Opex) ขององค์กร",
      tags: ["Python", "Pandas", "SQL Server", "PowerBI"],
      link: "#"
    },
    {
      id: "proj-5",
      title: "LICENSE TRACKER",
      company: "S.MEC Engineering",
      description: "ระบบบริหารและจัดสรรสิทธิ์โปรแกรมลิขสิทธิ์ของบริษัท (เช่น M365, AutoCAD, ZwCAD) ช่วยประหยัดค่าใช้จ่ายได้กว่า 1.12 ล้านบาทต่อปี",
      tags: ["Next.js", "Vite", "Supabase DB", "Excel API"],
      link: "#"
    },
    {
      id: "proj-6",
      title: "MEC PROJECT COST DASHBOARD",
      company: "S.MEC Engineering",
      description: "แดชบอร์ดสรุปค่าใช้จ่ายโครงการก่อสร้างทั้ง 17 ไซต์งานแบบ Real-time เพื่อให้ผู้บริหารตรวจสอบสถานะการเงินและควบคุมงบประมาณของแต่ละโครงการได้ทันที",
      tags: ["Next.js", "Supabase", "SQL", "Python", "Vercel"],
      link: "#"
    }
  ],
  en: [
    {
      id: "proj-1",
      title: "MEC CALIBRATION SYSTEM",
      company: "S.MEC Engineering",
      description: "Calibration tracking system for 17 construction sites, allowing users to log records, check costs, export PDFs, and transfer equipment with Super Admin approval.",
      tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Google Drive API"],
      link: "#",
      isFeatured: true
    },
    {
      id: "proj-2",
      title: "IT PROJECT DASHBOARD",
      company: "S.MEC Engineering",
      description: "Annual IT project and budget planner (Capex & Opex) rendered in a Gantt chart, featuring performance reviews (KPIs) for IT team members.",
      tags: ["Next.js", "Vercel", "Google Apps Script", "Google Sheets"],
      link: "#"
    },
    {
      id: "proj-3",
      title: "IN-HOUSE HELP DESK",
      company: "S.MEC Engineering",
      description: "IT support and ticketing system assisting 160 users, with automated notifications sent via LINE and email.",
      tags: ["HTML", "Vanilla JS", "PHP", "PostgreSQL", "LINE Notify API"],
      link: "#"
    },
    {
      id: "proj-4",
      title: "PRINT COST DASHBOARD",
      company: "S.MEC Engineering",
      description: "Print cost analysis tool tracking printer expenses by department, helping control and reduce IT operating expenses (Opex).",
      tags: ["Python", "Pandas", "SQL Server", "PowerBI"],
      link: "#"
    },
    {
      id: "proj-5",
      title: "LICENSE TRACKER",
      company: "S.MEC Engineering",
      description: "Corporate software license manager (e.g., M365, AutoCAD, ZwCAD), helping save over 1.12 million Baht/year.",
      tags: ["Next.js", "Vite", "Supabase DB", "Excel API"],
      link: "#"
    },
    {
      id: "proj-6",
      title: "MEC PROJECT COST DASHBOARD",
      company: "S.MEC Engineering",
      description: "Real-time dashboard summarizing expenses across 17 construction sites, helping management monitor budgets and control project costs instantly.",
      tags: ["Next.js", "Supabase", "SQL", "Python", "Vercel"],
      link: "#"
    }
  ],
  zh: [
    {
      id: "proj-1",
      title: "MEC 仪器校验与管理系统",
      company: "S.MEC Engineering",
      description: "17个工地的仪器校验管理系统，支持校验记录登记、成本核算、PDF导出以及经超级管理员审批的设备跨工地调拨。",
      tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Google Drive API"],
      link: "#",
      isFeatured: true
    },
    {
      id: "proj-2",
      title: "IT 项目管理看板",
      company: "S.MEC Engineering",
      description: "甘特图形式的年度IT项目与预算规划系统（Capex & Opex），并包含IT团队成员的绩效考核（KPI）功能。",
      tags: ["Next.js", "Vercel", "Google Apps Script", "Google Sheets"],
      link: "#"
    },
    {
      id: "proj-3",
      title: "企业内部 IT 工单系统",
      company: "S.MEC Engineering",
      description: "服务于160名员工的IT故障报修系统，支持通过LINE和电子邮件自动发送派单与进度通知。",
      tags: ["HTML", "Vanilla JS", "PHP", "PostgreSQL", "LINE Notify API"],
      link: "#"
    },
    {
      id: "proj-4",
      title: "打印成本分析看板",
      company: "S.MEC Engineering",
      description: "按部门统计和分析打印费用的工具，帮助企业监控和降低IT运营成本（Opex）。",
      tags: ["Python", "Pandas", "SQL Server", "PowerBI"],
      link: "#"
    },
    {
      id: "proj-5",
      title: "软件授权跟踪系统",
      company: "S.MEC Engineering",
      description: "公司正版软件授权（如 M365、AutoCAD、ZwCAD）管理系统，每年为公司节省超112万泰铢。",
      tags: ["Next.js", "Vite", "Supabase DB", "Excel API"],
      link: "#"
    },
    {
      id: "proj-6",
      title: "MEC PROJECT COST DASHBOARD",
      company: "S.MEC Engineering",
      description: "17个工地的实时项目成本看板，方便管理层随时查看财务状况并即时控制各项目预算。",
      tags: ["Next.js", "Supabase", "SQL", "Python", "Vercel"],
      link: "#"
    }
  ]
};

const mockExperiences: { [key: string]: any[] } = {
    th: [
    {
      company: "บริษัท เอส.เอ็มอีซีซี เอ็นจิเนียริ่ง จำกัด",
      role: "รักษาการผู้จัดการฝ่ายไอที (Acting IT Manager)",
      location: "กรุงเทพมหานคร",
      start_date: "พฤศจิกายน 2566",
      end_date: "ปัจจุบัน",
      responsibilities: [
        "1. การวางแผนและบริหารแผนก IT",
        "  • วางแผนงบประมาณ IT ประจำปี (Capex & Opex)",
        "  • บริหารทีม IT Support ดูแลพนักงาน 160 คน",
        "  • เจรจาต่อรองกับ Vendor เปรียบเทียบราคาและสเปกเพื่อเลือกสิ่งที่คุ้มค่าที่สุด",
        "  • ดูแลระบบ IT ให้ผ่านการตรวจ ISO 9001:2015 ทุกปี",
        "2. ระบบเครือข่ายและโครงสร้างพื้นฐาน",
        "  • ติดตั้งระบบเครือข่ายสำนักงานใหญ่ตั้งแต่ศูนย์ ครอบคลุม TP-Link Omada (Router, OC200 Controller, Switch, WiFi AP) พร้อม VLAN Segmentation",
        "  • วางระบบ Dual ISP (AIS + TOT) แบบ Load Balancing และ WAN Failover ให้บริการได้ต่อเนื่อง 99%",
        "  • บริหาร Omada ตั้งค่า VLAN, Inter-VLAN Routing, SSID แยกตามประเภทผู้ใช้, QoS และ Port Trunk/Access",
        "  • Monitor Network ผ่าน Omada Controller ติดตาม Bandwidth, Client และ Uptime แบบ Real-time",
        "  • บริหาร Active Directory 2 Server แบบ Replication รองรับ High Availability พร้อมจัดโครงสร้าง OU, GPO, DNS, DHCP และ File Share Permission",
        "3. Security & Endpoint",
        "  • Config Fortigate 100F ครอบคลุม Firewall Policy, SSL VPN, IPSec VPN, NAT, IPS และ Web Filtering",
        "  • Monitor Traffic และ Threat ผ่าน Fortigate พร้อมตรวจสอบ Security Log, Traffic Log และ VPN Log อย่างสม่ำเสมอ",
        "  • ดูแลอุปกรณ์ปลายทาง 163 เครื่อง (Notebook 158 + PC 5 เครื่อง)",
        "  • ติดตั้งกล้อง CCTV และระบบสแกนลายนิ้วมือเชื่อมต่อ Cloud ที่ Project Site",
        "  • สำรองข้อมูลผ่าน NAS แบบรายวัน/รายสัปดาห์ พร้อมแผน Disaster Recovery",
        "4. Server & Cloud",
        "  • ดูแลระบบ Cloud Server: Humano HR (Inet Cloud)",
        "  • จัดการ Microsoft 365 ครอบคลุมผู้ใช้, Exchange, Teams และการตั้งค่า MFA",
        "  • ดูแล License ซอฟต์แวร์ที่ใช้งานในองค์กร ได้แก่ M365, AutoCAD, Revit, BIM และ SketchUp",
        "5. พัฒนาเว็บแอปพลิเคชันภายในองค์กร",
        "  • ระบบ Help Desk Ticketing — ลดเวลาแก้ปัญหาได้ 98%",
        "  • IT Project Dashboard — ติดตามงาน วัด KPI และบริหารงบประมาณของทีม IT",
        "  • Print Cost Dashboard วิเคราะห์ต้นทุนการพิมพ์แยกตามโครงการ",
        "  • ระบบทะเบียน Software License — แจ้งเตือนผ่าน Line และ Email เมื่อใกล้ถึงรอบต่ออายุ",
        "6. ERP และฐานข้อมูล",
        "  • บริหาร Mango ERP (UIH Cloud) ครอบคลุมการจัดการผู้ใช้ กำหนดสิทธิ์การเข้าถึง Module ตามนโยบายบริษัท ตั้งค่า Workflow (PR/PO/WO) และฝึกอบรมพนักงาน",
        "  • บริหารจัดการ SQL Server ครอบคลุม User Management, Backup/Restore, Basic Indexing, Error Log และคำสั่งพื้นฐาน SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY และ SUM",
        "7. การบริหารทีม",
        "  • มอบหมายงาน ติดตามความคืบหน้า และให้คำแนะนำสมาชิกในทีม",
        "  • กำหนด SLA และ KPI สำหรับการให้บริการด้าน IT",
        "  • ประเมินผลการทำงานและพัฒนาศักยภาพทีม IT อย่างต่อเนื่อง",
        "  • จัดทำ IT Policy และ Procedure ให้สอดคล้องกับมาตรฐาน ISO 9001:2015",
        "  • จัดอบรม IT ให้พนักงานในองค์กร ทั้งการใช้งานระบบและความปลอดภัยทางไซเบอร์",
        "  • สรุปผลการดำเนินงาน IT รายงานต่อผู้บริหารเป็นประจำ"
      ],
      accomplishments: [
        "ลดต้นทุน IT ขององค์กรลงกว่า 1.17 ล้านบาท/ปี (รวมประหยัดได้ 1,178,500 บาท/ปี) จากการปรับปรุงสัญญาและสิทธิ์ซอฟต์แวร์",
        "ลดค่า License CAD ลง 81% (ประหยัด ~770,000 บาท/ปี) จากการเปลี่ยนผ่านจาก AutoCAD ไปใช้ ZwCAD (70 License)",
        "ลดต้นทุนระบบ Server Virtualization ลง 52% (ประหยัด ~132,000 บาท/ปี) โดยย้ายแพลตฟอร์มจาก VMware ไป Nutanix",
        "ย้าย Cloud Server ของ Humano HR ลดค่าบริการรายเดือนลง 54% (ประหยัด ~124,000 บาท/ปี) และสเปคสตรีมมิ่งเซิร์ฟเวอร์ดีขึ้น",
        "ปรับการจัดสรร Mix License Microsoft 365 (160 User) ให้สอดคล้องกับพฤติกรรมการใช้งานจริง ประหยัดงบ ~100,000 บาท/ปี",
        "เปลี่ยนผู้ให้บริการ Antivirus จาก Comodo ไปเป็น Bitdefender (150 License) ประหยัดค่าใช้จ่ายลง 32% (ประหยัด ~52,500 บาท/ปี)",
        "ออกแบบ ติดตั้ง และส่งมอบระบบเครือข่ายและ IT Infrastructure สำหรับสำนักงานใหญ่แห่งใหม่ (HQ Bangbon 5) สำเร็จลุล่วงแบบ End-to-End",
        "บริหารจัดการโครงการย้ายระบบ Mango ERP สำเร็จใน 2 เดือน ช่วยแก้ปัญหา Bandwidth และระบบเสถียร 100% หลัง Go-Live",
        "พัฒนาเว็บแอปพลิเคชันใช้งานในองค์กรเอง 4 ระบบ ช่วยเพิ่มประสิทธิภาพและลดเวลาการแก้ไขปัญหาของ IT Support ลง 98%",
        "ติดตั้งระบบ IP Phone ด้วยตนเอง (2 lines / 10 extensions)"
      ]
    },
    {
      company: "บริษัท ไอทีเทค-คอนเนคติ้ง จำกัด (ITK-Connecting Co., Ltd.)",
      role: "วิศวกรสนับสนุนระบบเครือข่ายไอที (IT Network Support)",
      location: "กรุงเทพมหานคร",
      start_date: "ตุลาคม 2564",
      end_date: "กุมภาพันธ์ 2566",
      responsibilities: [
        "1. ออกแบบ วางแผน และสนับสนุนการขายระบบ IT",
        "  • วิเคราะห์ความต้องการของลูกค้าและออกแบบระบบครอบคลุม Network, Server, Storage, Security และ Cloud",
        "  • จัดทำ Solution Diagram และเอกสาร Quotation/Proposal",
        "  • ร่วมนำเสนอ Solution และอธิบายรายละเอียดทางเทคนิคให้ลูกค้า",
        "  • ให้คำปรึกษาและตอบข้อซักถามเพื่อสนับสนุนการตัดสินใจซื้อ",
        "2. ติดตั้งและ Config ระบบ",
        "  • ติดตั้งและ Config Server, Active Directory, Backup, NAS/SAN Storage, Virtualization (VMware/Hyper-V) และ UPS",
        "  • บริหารจัดการ Firewall หลากหลายแบรนด์ ได้แก่ Fortigate, FortiAnalyzer, Sophos และ Zyxel ครอบคลุม Policy, VPN (SSL/IPSec), IPS และ Web Filtering",
        "  • บริหารจัดการ Switch L2/L3 ได้แก่ Cisco, Aruba, HP และ Zyxel ครอบคลุม VLAN, Inter-VLAN Routing และ Port Configuration",
        "  • ออกแบบและ Config ระบบ Wireless แบบ Centralized Management",
        "  • ทดสอบและตรวจรับระบบก่อนส่งมอบให้ลูกค้า",
        "3. After-Sales Support & Maintenance",
        "  • แก้ไขปัญหาและดูแลระบบในช่วง Warranty พร้อมให้บริการ On-site Support",
        "  • ตรวจสอบอุปกรณ์ตามรอบที่กำหนด ครอบคลุม Server, Storage และ UPS",
        "  • จัดทำรายงานสถานะระบบ เช่น Network Health Check Report",
        "4. จัดทำเอกสารและฝึกอบรม",
        "  • พัฒนา User Manual และจัดอบรมการใช้งานให้ลูกค้า",
        "  • จัดทำเอกสารโครงการ เช่น UAT และ Handover Document",
        "5. พัฒนาความรู้และติดตามเทคโนโลยี",
        "  • ติดตามเทคโนโลยีใหม่ด้าน Cloud, Virtualization และ Cybersecurity",
        "  • นำความรู้มาประยุกต์ใช้ในการเสนอและติดตั้งระบบให้มีประสิทธิภาพ"
      ]
    },
    {
      company: "บริษัท โปรเฟสชันแนล ลาบอราทอรี่ แมนเนจเม้นท์ คอร์ป จำกัด (มหาชน)",
      role: "เจ้าหน้าที่สนับสนุนฝ่ายไอที (IT Support)",
      location: "กรุงเทพมหานคร",
      start_date: "พฤษภาคม 2563",
      end_date: "ตุลาคม 2564",
      responsibilities: [
        "1. บริหารจัดการ Server",
        "  • บริหาร User Account และสิทธิ์การเข้าถึงผ่าน Active Directory",
        "  • Config Security Policy ด้วย Group Policy",
        "  • จัดการ File Sharing และกำหนดสิทธิ์การเข้าถึงตาม Role",
        "2. ระบบ Cloud และความปลอดภัย",
        "  • ดูแลระบบ HIS-LIS SQL SYMPHONY",
        "  • บริหาร Nods32 Endpoint Security บน Cloud สำหรับป้องกันอุปกรณ์ปลายทาง",
        "  • บริหาร Google G-Suite ครอบคลุม User Account, Email และ Security",
        "  • บริหารจัดการ Leased Line VPN ผ่าน Fortigate 100F สำหรับเชื่อมต่อระหว่างสาขา",
        "3. วางแผนและติดตั้งโครงสร้างพื้นฐาน IT",
        "  • ออกแบบและติดตั้งระบบ Server AD, Switch, Finger Scan, CCTV, NAS และ Backup",
        "  • ติดตั้งและ Support โปรแกรม LIS ให้พนักงานในองค์กร",
        "  • ติดตั้งโครงสร้างพื้นฐาน IT สำหรับห้องแลปที่เปิดใหม่ตั้งแต่ศูนย์",
        "4. ดูแลและซัพพอร์ตระบบ",
        "  • รับและติดตาม Repair Request ผ่านระบบออนไลน์",
        "  • กำหนด SLA วิเคราะห์ข้อมูล และสำรวจความพึงพอใจเพื่อปรับปรุงบริการ",
        "  • ตรวจสอบห้อง Server และการทำงานของ Server ตามรอบที่กำหนด",
        "  • จัดทำทะเบียนทรัพย์สิน IT และแผน PM (Preventive Maintenance) ให้สอดคล้องกับมาตรฐาน ISO 9001:2015",
        "  • ฝึกอบรมทีม IT ให้รองรับเทคโนโลยีใหม่",
        "5. บริหารงบประมาณ",
        "  • จัดทำงบประมาณครอบคลุมอุปกรณ์, Maintenance, Software License และ Subscription",
        "  • ประสานงานกับ Vendor เปรียบเทียบราคาเพื่อเลือกบริการที่เหมาะสม",
        "6. ความปลอดภัยของข้อมูล",
        "  • กำหนดมาตรการรักษาความปลอดภัยข้อมูลให้สอดคล้องกับมาตรฐานองค์กร",
        "7. บริหารและพัฒนาทีม",
        "  • มอบหมายงาน ติดตามผลการทำงาน และสนับสนุนการฝึกอบรมทีม IT"
      ]
    },
    {
      company: "บริษัท นานมีอุตสาหกรรม จำกัด (Nanmee Industry Co., Ltd.)",
      role: "เจ้าหน้าที่สนับสนุนไอที (IT Support)",
      location: "สมุทรปราการ",
      start_date: "มีนาคม 2562",
      end_date: "เมษายน 2563",
      responsibilities: [
        "1. บริหาร Server และ Active Directory",
        "  • ดูแลการทำงานของ Server พร้อมบริหาร User Account, Group Policy และสิทธิ์การเข้าถึงผ่าน Active Directory",
        "2. ซ่อมและแก้ไขปัญหาอุปกรณ์ IT",
        "  • วินิจฉัยและแก้ไขปัญหาด้าน Hardware, Software, Network, Email, Internet และ ERP (Oracle) เพื่อให้ระบบทำงานได้อย่างต่อเนื่อง",
        "3. ดูแลและบำรุงรักษาระบบ IT",
        "  • ดูแล PC, Notebook, อุปกรณ์เครือข่าย และการเชื่อมต่ออินเทอร์เน็ตให้ทำงานได้อย่างมีประสิทธิภาพ",
        "4. บริหารการสำรองข้อมูล",
        "  • สำรองข้อมูล Server และ Client ตามนโยบายองค์กร พร้อมตรวจสอบ Backup เพื่อรองรับการกู้คืนฉุกเฉิน",
        "5. ให้บริการและสนับสนุนผู้ใช้งาน",
        "  • ให้คำปรึกษาและแก้ไขปัญหาด้าน IT เพื่อเพิ่มประสิทธิภาพการทำงานของผู้ใช้"
      ]
    },
    {
      company: "บริษัท บันเลือง ชินอินเตอร์ จำกัด",
      role: "เจ้าหน้าที่สนับสนุนไอที (IT Support)",
      location: "กรุงเทพมหานคร",
      start_date: "มีนาคม 2560",
      end_date: "กุมภาพันธ์ 2562",
      responsibilities: [
        "1. บริหาร Server และ Active Directory",
        "  • ดูแลการทำงานของ Server พร้อมบริหาร User Account, Group Policy และสิทธิ์การเข้าถึงผ่าน Active Directory",
        "2. ซ่อมและแก้ไขปัญหาอุปกรณ์ IT",
        "  • วินิจฉัยและแก้ไขปัญหาด้าน Hardware, Software, Network, Email, Internet และ ERP (Oracle) เพื่อให้ระบบทำงานได้อย่างต่อเนื่อง",
        "3. ดูแลและบำรุงรักษาระบบ IT",
        "  • ดูแล PC, Notebook, อุปกรณ์เครือข่าย และการเชื่อมต่ออินเทอร์เน็ตให้ทำงานได้อย่างมีประสิทธิภาพ",
        "4. บริหารการสำรองข้อมูล",
        "  • สำรองข้อมูล Server และ Client ตามนโยบายองค์กร พร้อมตรวจสอบ Backup เพื่อรองรับการกู้คืนฉุกเฉิน",
        "5. ให้บริการและสนับสนุนผู้ใช้งาน",
        "  • ให้คำปรึกษาและแก้ไขปัญหาด้าน IT เพื่อเพิ่มประสิทธิภาพการทำงานของผู้ใช้"
      ]
    }
  ],
  en: [
    {
      company: "S.MEC ENGINEERING CO., LTD.",
      role: "Acting IT Manager",
      location: "Bangkok",
      start_date: "November 2023",
      end_date: "Present",
      responsibilities: [
        "1. IT Department Planning & Management",
        "  • Plan annual IT budgets (Capex & Opex)",
        "  • Manage the IT Support team to support 160 users",
        "  • Negotiate with vendors and compare pricing/specifications to maximize cost-efficiency",
        "  • Maintain IT systems to successfully pass ISO 9001:2015 audits annually",
        "2. Network & Infrastructure",
        "  • Deploy corporate network infrastructure from scratch, covering TP-Link Omada (Router, OC200 Controller, Switch, WiFi AP) with VLAN segmentation",
        "  • Establish dual ISP (AIS + TOT) with Load Balancing and WAN Failover to ensure 99% network uptime",
        "  • Administer Omada Controller: configure VLANs, Inter-VLAN Routing, separate SSIDs by user type, QoS, and Port Trunk/Access configuration",
        "  • Monitor network traffic, tracking bandwidth, active clients, and device uptime in real-time via Omada Controller",
        "  • Administer Active Directory with 2-server replication for high availability, structuring OUs, GPOs, DNS, DHCP, and file share permissions",
        "3. Security & Endpoint",
        "  • Configure Fortigate 100F firewalls, covering security policies, SSL VPNs, IPSec VPNs, NAT, IPS, and Web Filtering",
        "  • Monitor network traffic and threats via Fortigate, regularly auditing security, traffic, and VPN connection logs",
        "  • Maintain 163 corporate endpoint devices (158 notebooks + 5 PCs)",
        "  • Deploy IP CCTV systems and cloud-based fingerprint biometric scanners at project construction sites",
        "  • Configure automated NAS backup schedules (daily/weekly) with Disaster Recovery planning",
        "4. Server & Cloud",
        "  • Maintain Cloud Server: Humano HR (Inet Cloud)",
        "  • Manage Microsoft 365 environments, configuring user accounts, Exchange, Teams, and Multi-Factor Authentication (MFA)",
        "  • Audit and manage corporate software licenses (M365, AutoCAD, Revit, BIM, and SketchUp)",
        "5. In-House Web Application Development",
        "  • Help Desk Ticketing — reduced resolution times by 98%",
        "  • IT Project Dashboard — tracked tasks, measured KPIs, and monitored IT department budget",
        "  • Print Cost Dashboard — analyzed departmental print expenses across project construction sites",
        "  • Software License Registry — integrated LINE and email alerts for upcoming subscription renewals",
        "6. ERP & Database Administration",
        "  • Administer Mango ERP on UIH Cloud: manage user permissions, workflow approval chains (PR/PO/WO), and conduct user training",
        "  • Maintain SQL Server databases, covering user management, backup/restore operations, basic indexing, error log auditing, and writing SQL statements (SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY, SUM)",
        "7. Team Leadership & Development",
        "  • Assign tasks, monitor progress, and provide guidance to IT team members",
        "  • Define SLAs and KPIs for IT service delivery",
        "  • Evaluate performance and support training for IT team members' professional development",
        "  • Draft and refine IT policies and procedures in compliance with ISO 9001:2015 standards",
        "  • Conduct IT training for internal staff regarding system usage and cybersecurity awareness",
        "  • Compile and present regular IT operational summary reports to executive management"
      ],
      accomplishments: [
        "Reduced corporate IT costs by over 1.17 Million Baht/year (totaling 1,178,500 Baht/year) through software audits and licensing restructuring.",
        "Cut CAD software licensing costs by 81% (saving ~770,000 Baht/year) by transitioning from AutoCAD to ZwCAD (70 licenses).",
        "Reduced virtualization server costs by 52% (saving ~132,000 Baht/year) by shifting from VMware platform to Nutanix.",
        "Migrated Humano HR cloud servers to reduce hosting costs by 54% (saving ~124,000 Baht/year) with upgraded hardware specs.",
        "Optimized Microsoft 365 subscription structure for 160 users by restructuring mix configurations, saving ~100,000 Baht/year.",
        "Substituted Antivirus solutions from Comodo to Bitdefender (150 licenses), achieving 32% in cost savings (~52,500 Baht/year).",
        "Designed, configured, and deployed the network and IT infrastructure for the new corporate headquarters (HQ Bangbon 5) from the ground up.",
        "Managed the ERP Mango system migration project, successfully launching it within 2 months with 100% post-migration stability.",
        "Built 4 custom in-house web applications, improving team efficiency and decreasing IT Support ticket resolution times by 98%.",
        "Self-installed corporate IP Phone system (2 lines / 10 extensions)."
      ]
    },
    {
      company: "ITK-Connecting Co., Ltd.",
      role: "IT Network Support Engineer",
      location: "Bangkok",
      start_date: "October 2021",
      end_date: "February 2023",
      responsibilities: [
        "1. IT System Design, Planning & Pre-Sales Support",
        "  • Analyzed client requirements and designed systems covering Network, Server, Storage, Security, and Cloud",
        "  • Created solution diagrams and prepared quotation/proposal documents",
        "  • Co-presented solutions and explained technical details to clients",
        "  • Provided consultancy and answered technical queries to support purchase decisions",
        "2. System Installation & Configuration",
        "  • Installed and configured Servers, Active Directory, Backup systems, NAS/SAN Storage, Virtualization (VMware/Hyper-V), and UPS",
        "  • Managed various firewall brands, including Fortigate, FortiAnalyzer, Sophos, and Zyxel, covering policies, VPN (SSL/IPSec), IPS, and Web Filtering",
        "  • Configured L2/L3 Switches from Cisco, Aruba, HP, and Zyxel, covering VLANs, Inter-VLAN Routing, and port configurations",
        "  • Designed and configured wireless systems with Centralized Management",
        "  • Conducted integration tests and system acceptance verification before project handovers",
        "3. After-Sales Support & Maintenance",
        "  • Troubleshot and maintained systems during warranty periods, providing on-site support",
        "  • Performed scheduled equipment inspections, including Servers, Storage, and UPS",
        "  • Prepared system status reports, such as Network Health Check Reports",
        "4. Documentation & Training",
        "  • Developed user manuals and conducted system usage training for clients",
        "  • Prepared project documentation, including UAT and Handover Documents",
        "5. Professional Development & Tech Trends Tracking",
        "  • Kept updated with new technologies in Cloud, Virtualization, and Cybersecurity",
        "  • Applied acquired knowledge to design and deploy highly efficient systems"
      ]
    },
    {
      company: "Professional Laboratories Management Corp Pub Co., Ltd.",
      role: "IT Support Engineer",
      location: "Bangkok",
      start_date: "May 2020",
      end_date: "October 2021",
      responsibilities: [
        "1. Server Management",
        "  • Managed user accounts and access permissions via Active Directory",
        "  • Configured security policies using Group Policy Objects (GPO)",
        "  • Managed file sharing and defined folder access permissions based on roles",
        "2. Cloud Systems & Security",
        "  • Maintained HIS-LIS SQL Symphony systems to ensure system availability",
        "  • Administered ESET NOD32 Endpoint Security cloud console to protect endpoint devices",
        "  • Administered Google G-Suite, covering user accounts, email, and security settings",
        "  • Managed Leased Line VPN connections via Fortigate 100F firewall to link branch offices",
        "3. IT Infrastructure Planning & Deployment",
        "  • Designed and installed Server AD, Switches, fingerprint scanners, CCTV, NAS, and backup systems",
        "  • Installed and supported LIS application software for internal staff",
        "  • Set up IT infrastructure for newly opened laboratory branches from scratch",
        "4. System Maintenance & Support",
        "  • Received and tracked repair requests via an online ticketing system",
        "  • Defined SLAs, analyzed support data, and conducted satisfaction surveys to improve services",
        "  • Inspected server rooms and monitored server operations regularly",
        "  • Compiled IT Asset Inventories and scheduled Preventive Maintenance (PM) plans in compliance with ISO 9001:2015",
        "  • Trained IT staff to handle new technologies",
        "5. Budget Administration",
        "  • Formulated IT budgets covering hardware, maintenance contracts, software licenses, and subscriptions",
        "  • Coordinated with vendors and compared quotations to select suitable services",
        "6. Information Security",
        "  • Established data security measures in compliance with corporate standards",
        "7. Team Leadership & Development",
        "  • Assigned tasks, monitored work performance, and supported training for IT team members"
      ]
    },
    {
      company: "Nanmee Industry Co., Ltd.",
      role: "IT Support Specialist",
      location: "Samut Prakan",
      start_date: "March 2019",
      end_date: "April 2020",
      responsibilities: [
        "1. Server & Active Directory Administration",
        "  • Maintained server operations and managed user accounts, Group Policies, and access rights via Active Directory",
        "2. IT Equipment Troubleshooting & Support",
        "  • Diagnosed and resolved issues related to hardware, software, network, email, internet, and ERP (Oracle) to ensure business continuity",
        "3. IT System Maintenance",
        "  • Maintained PCs, notebooks, network devices, and internet connections to ensure optimal performance",
        "4. Backup Management",
        "  • Backed up server and client data according to corporate policies, and verified backups to ensure successful disaster recovery",
        "5. User Helpdesk Support",
        "  • Provided IT consultancy and resolved user problems to enhance employee productivity"
      ]
    },
    {
      company: "Banleong Chin Inter Co., Ltd.",
      role: "IT Support Specialist",
      location: "Bangkok",
      start_date: "March 2017",
      end_date: "February 2019",
      responsibilities: [
        "1. Server & Active Directory Administration",
        "  • Maintained server operations and managed user accounts, Group Policies, and access rights via Active Directory",
        "2. IT Equipment Troubleshooting & Support",
        "  • Diagnosed and resolved issues related to hardware, software, network, email, internet, and ERP (Oracle) to ensure business continuity",
        "3. IT System Maintenance",
        "  • Maintained PCs, notebooks, network devices, and internet connections to ensure optimal performance",
        "4. Backup Management",
        "  • Backed up server and client data according to corporate policies, and verified backups to ensure successful disaster recovery",
        "5. User Helpdesk Support",
        "  • Provided IT consultancy and resolved user problems to enhance employee productivity"
      ]
    }
  ],
  zh: [
    {
      company: "S.MEC ENGINEERING CO., LTD. (建筑工程设计院)",
      role: "代理 IT 部门经理 (Acting IT Manager)",
      location: "曼谷",
      start_date: "2023年11月",
      end_date: "至今",
      responsibilities: [
        "1. IT 部门规划与管理",
        "  • 规划年度 IT 预算（Capex & Opex）",
        "  • 带领 IT 支持团队，服务 160 名员工",
        "  • 与供应商谈判，对比价格和规格以实现最高性价比",
        "  • 确保 IT 系统每年顺利通过 ISO 9001:2015 质量管理体系审计",
        "2. 网络与基础设施建设",
        "  • 从零开始独立部署总部全新网络架构，采用 TP-Link Omada 设备（Router, OC200, 交换机, WiFi AP）并划分 VLAN 隔离",
        "  • 部署双 ISP 负载均衡与自动容灾（AIS + TOT），保障网络可用率达 99% 以上",
        "  • 管理 Omada 控制器：配置 VLAN、跨 VLAN 路由、按用户类型分配 SSID、QoS 及端口 Trunk/Access",
        "  • 通过 Omada 控制器实时监控网络流量，跟踪带宽、在线客户端及设备 Uptime",
        "  • 管理高可用同步的双域控（Active Directory 2 Server Replication），优化 OU 结构、GPO 策略、DNS、DHCP 及共享文件夹权限",
        "3. 网络安全与终端管理",
        "  • 配置 Fortigate 100F 防火墙安全策略、SSL VPN、IPSec VPN、NAT 转换、入侵防御（IPS）及网页过滤",
        "  • 监控网络流量和威胁，定期分析 Fortigate 的安全日志、流量日志和 VPN 连接日志",
        "  • 负责维护公司 163 台终端设备（158 台笔记本 + 5 台台式机）",
        "  • 在项目工地现场安装监控摄像头和云端同步的指纹考勤系统",
        "  • 配置 NAS 实现每日及每周数据备份，并制定灾难恢复（DR）方案",
        "4. 服务器与云服务管理",
        "  • 负责部署在 Inet Cloud 上的 Humano HR 人事系统云服务器运维",
        "  • 管理公司 Microsoft 365 环境，配置用户账户、Exchange 邮件系统、Teams 协作及多因素验证（MFA）",
        "  • 审计和管理公司所有正版软件授权（M365、AutoCAD、Revit、BIM、SketchUp）",
        "5. 企业自研 Web 应用开发",
        "  • IT 工单系统（Help Desk Ticketing）— 缩短故障解决时间达 98%",
        "  • IT 项目管理看板（IT Project Dashboard）— 跟踪日常工作、评估 KPI 并监控部门预算",
        "  • 打印成本分析系统（Print Cost Dashboard）— 分析和监控各项目工地的打印支出",
        "  • 软件授权到期提醒系统 — 集成 LINE 和 Email 自动提前发送到期续签通知",
        "6. ERP 与数据库维护",
        "  • 担任 UIH Cloud 上 Mango ERP 系统管理员：管理用户权限、配置工作流审批链（PR/PO/WO）并开展员工操作培训",
        "  • 熟练进行 SQL Server 运维：用户管理、数据库备份与恢复、基础索引优化、错误日志审计及编写基础 SQL 语句（SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY）",
        "7. 团队建设与管理工作",
        "  • 分配工作任务、跟踪团队进度并为成员提供技术辅导",
        "  • 为 IT 运维服务定义 SLA 协议和 KPI 关键绩效指标",
        "  • 评估团队成员业绩，定期开展培训以提升其业务能力",
        "  • 起草和完善符合 ISO 9001:2015 质量体系要求的 IT 管理规章制度",
        "  • 定期对公司员工进行 IT 基础技能与网络安全意识培训",
        "  • 定期向公司管理层呈报 IT 部门运营状况与工作总结报告"
      ],
      accomplishments: [
        "通过优化软件授权和审计，每年为企业降低 IT 成本超 117 万泰铢（累计节省 1,178,500 泰铢/年）。",
        "通过将 AutoCAD 替换为 ZwCAD（共 70 套授权），使 CAD 软件授权成本降低 81%（每年节省约 770,000 泰铢）。",
        "将服务器虚拟化平台从 VMware 迁移至 Nutanix，使虚拟化成本降低 52%（每年节省约 132,000 泰铢）。",
        "迁移 Humano HR 云服务器，使月度托管费用降低 54%（每年节省约 124,000 泰铢），且服务器硬件配置得到全面升级。",
        "优化 160 名用户的 Microsoft 365 订阅结构，通过调整混合配置，每年节省约 100,000 泰铢。",
        "将防病毒软件从 Comodo 替换为 Bitdefender（共 150 套授权），实现 32% 的成本节省（每年节省约 52,500 泰铢）。",
        "从零开始规划、配置并部署新总部（HQ Bangbon 5）的网络与 IT 基础设施。",
        "管理 Mango ERP 系统迁移项目，在 2 个月内成功上线，且上线后系统保持 100% 的稳定性。",
        "自主开发 4 套企业内部 Web 应用程序，提升团队效率并使 IT 支持团队的故障工单解决时间缩短 98%。",
        "自主安装公司 IP 电话系统（2 条外线 / 10 个分机）。"
      ]
    },
    {
      company: "ITK-Connecting Co., Ltd. (系统集成及网络工程公司)",
      role: "网络技术支持工程师 (IT Network Support)",
      location: "曼谷",
      start_date: "2021年10月",
      end_date: "2023年2月",
      responsibilities: [
        "1. IT 系统设计、规划与售前支持",
        "  • 分析客户需求，设计涵盖网络、服务器、存储、安全和云服务的系统方案",
        "  • 绘制方案拓扑图并编写报价单/技术投标书",
        "  • 参与方案演示，向客户讲解技术细节",
        "  • 提供技术咨询，解答客户疑问以支持采购决策",
        "2. 系统安装与配置",
        "  • 安装并配置服务器、活动目录（Active Directory）、备份系统、NAS/SAN 存储、虚拟化（VMware/Hyper-V）及 UPS",
        "  • 管理 Fortigate、FortiAnalyzer、Sophos 和 Zyxel 等多品牌防火墙，包括策略、VPN（SSL/IPSec）、IPS 及网页过滤",
        "  • 配置 Cisco、Aruba & HP 等多品牌交换机以完成 VLAN 划分",
        "  • 设计并配置集中化管理的无线网络系统",
        "  • 交付前进行系统集成测试及验收验证",
        "3. 售后支持与系统维护",
        "  • 在保修期内提供故障排查和系统维护服务，包括现场技术支持",
        "  • 定期巡检服务器、存储和 UPS 等设备",
        "  • 编写系统运行状态报告，例如网络健康检查报告",
        "4. 文档编写与培训",
        "  • 编写用户操作手册并为客户提供系统使用培训",
        "  • 整理项目文档，包括用户验收测试（UAT）和交接文档",
        "5. 知识更新与技术追踪",
        "  • 持续关注云计算、虚拟化及网络安全领域的新技术",
        "  • 将新技术应用于系统规划与部署中，提升系统运行效率"
      ]
    },
    {
      company: "Professional Laboratories Management Corp (临床检测上市公司)",
      role: "IT 支持工程师 (IT Support)",
      location: "曼谷",
      start_date: "2020年5月",
      end_date: "2021年10月",
      responsibilities: [
        "1. 服务器管理",
        "  • 通过活动目录（Active Directory）管理用户账户和访问权限",
        "  • 使用组策略（GPO）配置安全策略",
        "  • 管理文件共享并根据角色定义文件夹访问权限",
        "2. 云系统与网络安全",
        "  • 维护 HIS-LIS SQL Symphony 系统，保障系统可用性",
        "  • 管理云端 ESET NOD32 终端安全控制台以保护终端设备",
        "  • 管理 Google G-Suite 办公套件，包括用户账户、电子邮件和安全设置",
        "  • 通过 Fortigate 100F 防火墙管理专线 VPN，以连接各分支机构",
        "3. IT 基础设施规划与部署",
        "  • 设计并安装域控服务器、交换机、指纹考勤机、监控摄像头、NAS 及备份系统",
        "  • 安装并维护内部员工使用的 LIS 软件系统",
        "  • 从零开始搭建新开设实验室分支机构的 IT 基础设施",
        "4. 系统维护与技术支持",
        "  • 通过在线工单系统接收并跟踪 IT 报修请求",
        "  • 制定 SLA、分析支持数据并开展满意度调查以提升服务质量",
        "  • 定期巡检服务器机房并监控服务器运行状态",
        "  • 整理 IT 资产清单并制定符合 ISO 9001:2015 标准的预防性维护（PM）计划",
        "  • 培训 IT 团队成员以掌握新技术",
        "5. 预算管理",
        "  • 编制 IT 预算，涵盖硬件设备、维护合同、软件授权和订阅费用",
        "  • 与供应商协调并对比报价，选择高性价比的服务方案",
        "6. 信息安全",
        "  • 制定符合公司标准的数据安全保护措施",
        "7. 团队建设与发展",
        "  • 分配工作任务、监控工作绩效并支持 IT 团队成员的技能培训"
      ]
    },
    {
      company: "Nanmee Industry Co., Ltd. (南美文具制造集团)",
      role: "IT 支持专员 (IT Support)",
      location: "沙没巴干",
      start_date: "2019年3月",
      end_date: "2020年4月",
      responsibilities: [
        "1. 服务器与活动目录管理",
        "  • 维护服务器稳定运行，并通过活动目录（Active Directory）管理用户账户、组策略和访问权限",
        "2. IT 设备故障排查与维护",
        "  • 诊断并解决硬件、软件、网络、电子邮件、互联网及 ERP（Oracle）系统故障，保障业务连续性",
        "3. IT 系统日常维护",
        "  • 维护台式机、笔记本电脑、网络设备及网络连接，保障其高效运行",
        "4. 备份管理",
        "  • 根据公司政策备份服务器和客户端数据，并定期验证备份以确保成功进行灾难恢复",
        "5. 用户服务台支持",
        "  • 提供 IT 咨询并解决用户遇到的技术难题，提升员工工作效率"
      ]
    },
    {
      company: "Banleong Chin Inter Co., Ltd. (电脑外设分销巨头)",
      role: "IT 支持专员 (IT Support)",
      location: "曼谷",
      start_date: "2017年3月",
      end_date: "2019年2月",
      responsibilities: [
        "1. 服务器与活动目录管理",
        "  • 维护服务器稳定运行，并通过活动目录（Active Directory）管理用户账户、组策略和访问权限",
        "2. IT 设备故障排查与维护",
        "  • 诊断并解决硬件、软件、网络、电子邮件、互联网及 ERP（Oracle）系统故障，保障业务连续性",
        "3. IT 系统日常维护",
        "  • 维护台式机、笔记本电脑、网络设备及网络连接，保障其高效运行",
        "4. 备份管理",
        "  • 根据公司政策备份服务器和客户端数据，并定期验证备份以确保成功进行灾难恢复",
        "5. 用户服务台支持",
        "  • 提供 IT 咨询并解决用户遇到的技术难题，提升员工工作效率"
      ]
    }
  ]
};

const mockSkills: { [key: string]: any[] } = {
  th: [
    { category: "IT Infrastructure (หลัก)", name: "Fortigate / Sophos / Zyxel", proficiency: "Advanced" },
    { category: "IT Infrastructure (หลัก)", name: "Cisco / Aruba / HP Switch", proficiency: "Advanced" },
    { category: "IT Infrastructure (หลัก)", name: "TP-Link Omada", proficiency: "Advanced" },
    { category: "IT Infrastructure (หลัก)", name: "Active Directory / GPO", proficiency: "Advanced" },
    { category: "IT Infrastructure (หลัก)", name: "Microsoft 365", proficiency: "Advanced" },
    { category: "IT Infrastructure (หลัก)", name: "VMware / Hyper-V", proficiency: "Advanced" },
    { category: "IT Infrastructure (หลัก)", name: "NAS / Backup", proficiency: "Advanced" },
    { category: "Development (เสริม)", name: "React / Next.js", proficiency: "Intermediate" },
    { category: "Development (เสริม)", name: "JavaScript / PHP", proficiency: "Intermediate" },
    { category: "Development (เสริม)", name: "SQL", proficiency: "Intermediate" },
    { category: "Development (เสริม)", name: "HTML/CSS", proficiency: "Advanced" },
    { category: "Development (เสริม)", name: "Python", proficiency: "Intermediate" },
    { category: "Languages", name: "Thai", proficiency: "Native" },
    { category: "Languages", name: "English", proficiency: "Beginner" }
  ],
  en: [
    { category: "IT Infrastructure (Primary)", name: "Fortigate / Sophos / Zyxel", proficiency: "Advanced" },
    { category: "IT Infrastructure (Primary)", name: "Cisco / Aruba / HP Switch", proficiency: "Advanced" },
    { category: "IT Infrastructure (Primary)", name: "TP-Link Omada", proficiency: "Advanced" },
    { category: "IT Infrastructure (Primary)", name: "Active Directory / GPO", proficiency: "Advanced" },
    { category: "IT Infrastructure (Primary)", name: "Microsoft 365", proficiency: "Advanced" },
    { category: "IT Infrastructure (Primary)", name: "VMware / Hyper-V", proficiency: "Advanced" },
    { category: "IT Infrastructure (Primary)", name: "NAS / Backup", proficiency: "Advanced" },
    { category: "Development (Secondary)", name: "React / Next.js", proficiency: "Intermediate" },
    { category: "Development (Secondary)", name: "JavaScript / PHP", proficiency: "Intermediate" },
    { category: "Development (Secondary)", name: "SQL", proficiency: "Intermediate" },
    { category: "Development (Secondary)", name: "HTML/CSS", proficiency: "Advanced" },
    { category: "Development (Secondary)", name: "Python", proficiency: "Intermediate" },
    { category: "Languages", name: "Thai", proficiency: "Native" },
    { category: "Languages", name: "English", proficiency: "Beginner" }
  ],
  zh: [
    { category: "IT 基础设施 (核心)", name: "Fortigate / Sophos / Zyxel 防火墙", proficiency: "精通 (Advanced)" },
    { category: "IT 基础设施 (核心)", name: "Cisco / Aruba / HP 交换机", proficiency: "精通 (Advanced)" },
    { category: "IT 基础设施 (核心)", name: "TP-Link Omada 智能网络", proficiency: "精通 (Advanced)" },
    { category: "IT 基础设施 (核心)", name: "活动目录 (Active Directory) / 组策略 (GPO)", proficiency: "精通 (Advanced)" },
    { category: "IT 基础设施 (核心)", name: "Microsoft 365 办公套件", proficiency: "精通 (Advanced)" },
    { category: "IT 基础设施 (核心)", name: "VMware / Hyper-V 虚拟化", proficiency: "精通 (Advanced)" },
    { category: "IT 基础设施 (核心)", name: "NAS 存储 / 数据备份", proficiency: "精通 (Advanced)" },
    { category: "软件开发 (辅助)", name: "React / Next.js 框架", proficiency: "良好 (Intermediate)" },
    { category: "软件开发 (辅助)", name: "JavaScript / PHP 编程", proficiency: "良好 (Intermediate)" },
    { category: "软件开发 (辅助)", name: "SQL 数据库", proficiency: "良好 (Intermediate)" },
    { category: "软件开发 (辅助)", name: "HTML/CSS 网页设计", proficiency: "精通 (Advanced)" },
    { category: "软件开发 (辅助)", name: "Python 编程", proficiency: "良好 (Intermediate)" },
    { category: "语言能力", name: "泰语 (Thai)", proficiency: "母语 (Native)" },
    { category: "语言能力", name: "英语 (English)", proficiency: "初级 (Beginner)" }
  ]
};

const mockCertifications: { [key: string]: any[] } = {
  th: [
    { name: "Fortinet Certified Associate (FCA) - NSE 3 Network Security Associate", issuer: "Fortinet Training Institute", date: "พ.ค. 2566", image_url: "/certs/NSE_3.jpg", pdf_url: "/certs/NSE_3_Certificate.pdf" },
    { name: "Fortinet Certified Associate (FCA) - NSE 2 Network Security Associate", issuer: "Fortinet Training Institute", date: "พ.ย. 2565", image_url: "/certs/NSE_2.jpg", pdf_url: "/certs/NSE_2_Certification.pdf" },
    { name: "Fortinet Certified Associate (FCA) - NSE 1 Network Security Associate", issuer: "Fortinet Training Institute", date: "ต.ค. 2565", image_url: "/certs/NSE_1.jpg", pdf_url: "/certs/NSE_1_Certification.pdf" },
    { name: "Cisco Certified Network Associate (CCNA)", issuer: "Jodoi IT & Service Co., Ltd. / Cisco", date: "มิ.ย. 2565", image_url: "/certs/CCNA.jpg", pdf_url: "" },
    { name: "Configuring and Troubleshooting Windows Server 2019 Active Directory Domain Services (AD001)", issuer: "elife systems Co., Ltd.", date: "ส.ค. 2563", image_url: "/certs/AD001.jpg", pdf_url: "" },
    { name: "Advanced Troubleshooting Windows Server Active Directory (AD002)", issuer: "elife systems Co., Ltd.", date: "ก.ย. 2563", image_url: "/certs/AD002.jpg", pdf_url: "" },
    { name: "Python Programming & IT Networking Essentials (Python 1)", issuer: "Cisco Networking Academy", date: "พ.ค. 2569", image_url: "/certs/Python1.png", pdf_url: "/certs/Python1.pdf" },
    { name: "Advanced Python Programming (Python 2)", issuer: "Cisco Networking Academy", date: "พ.ค. 2569", image_url: "/certs/Python2.jpg", pdf_url: "/certs/Python2.pdf" },
    { name: "Essential SQL For Everyone", issuer: "BORNTODEV", date: "ก.พ. 2569", image_url: "/certs/SQL.jpg", pdf_url: "/certs/SQL.pdf" },
    { name: "หลักสูตร Basic Cybersecurity (1.30 ชม.)", issuer: "กรมพัฒนาฝีมือแรงงาน กระทรวงแรงงาน", date: "30 ส.ค. 2566", image_url: "/certs/basic-cybersecurity.png", pdf_url: "/certs/basic-cybersecurity.pdf" },
    { name: "หลักสูตร Basic Network สำหรับมือใหม่สาย IT (1.40 ชม.)", issuer: "กรมพัฒนาฝีมือแรงงาน ร่วมกับ สมาคมส่งเสริมนวัตกรรมเทคโนโลยีไซเบอร์ (CIPAT)", date: "30 ส.ค. 2566", image_url: "/certs/basic-network.png", pdf_url: "/certs/basic-network.pdf" }
  ],
  en: [
    { name: "Fortinet Certified Associate (FCA) - NSE 3 Network Security Associate", issuer: "Fortinet Training Institute", date: "May 2023", image_url: "/certs/NSE_3.jpg", pdf_url: "/certs/NSE_3_Certificate.pdf" },
    { name: "Fortinet Certified Associate (FCA) - NSE 2 Network Security Associate", issuer: "Fortinet Training Institute", date: "Nov 2022", image_url: "/certs/NSE_2.jpg", pdf_url: "/certs/NSE_2_Certification.pdf" },
    { name: "Fortinet Certified Associate (FCA) - NSE 1 Network Security Associate", issuer: "Fortinet Training Institute", date: "Oct 2022", image_url: "/certs/NSE_1.jpg", pdf_url: "/certs/NSE_1_Certification.pdf" },
    { name: "Cisco Certified Network Associate (CCNA)", issuer: "Jodoi IT & Service Co., Ltd. / Cisco", date: "Jun 2022", image_url: "/certs/CCNA.jpg", pdf_url: "" },
    { name: "Configuring and Troubleshooting Windows Server 2019 Active Directory Domain Services (AD001)", issuer: "elife systems Co., Ltd.", date: "Aug 2020", image_url: "/certs/AD001.jpg", pdf_url: "" },
    { name: "Advanced Troubleshooting Windows Server Active Directory (AD002)", issuer: "elife systems Co., Ltd.", date: "Sep 2020", image_url: "/certs/AD002.jpg", pdf_url: "" },
    { name: "Python Programming & IT Networking Essentials (Python 1)", issuer: "Cisco Networking Academy", date: "May 2023", image_url: "/certs/Python1.png", pdf_url: "/certs/Python1.pdf" },
    { name: "Advanced Python Programming (Python 2)", issuer: "Cisco Networking Academy", date: "May 2023", image_url: "/certs/Python2.jpg", pdf_url: "/certs/Python2.pdf" },
    { name: "Essential SQL For Everyone", issuer: "BORNTODEV", date: "Feb 2026", image_url: "/certs/SQL.jpg", pdf_url: "/certs/SQL.pdf" },
    { name: "Basic Cybersecurity Course (1.30 hrs)", issuer: "Department of Skill Development, Ministry of Labour", date: "30 Aug 2023", image_url: "/certs/basic-cybersecurity.png", pdf_url: "/certs/basic-cybersecurity.pdf" },
    { name: "Basic Network Course for IT Beginners (1.40 hrs)", issuer: "Department of Skill Development & Cyber Innovation Promotion Association (CIPAT)", date: "30 Aug 2023", image_url: "/certs/basic-network.png", pdf_url: "/certs/basic-network.pdf" }
  ],
  zh: [
    { name: "飞塔网络安全认证 (FCA) - NSE 3 助理网络安全工程师", issuer: "Fortinet Training Institute", date: "2023年5月", image_url: "/certs/NSE_3.jpg", pdf_url: "/certs/NSE_3_Certificate.pdf" },
    { name: "飞塔网络安全认证 (FCA) - NSE 2 助理网络安全工程师", issuer: "Fortinet Training Institute", date: "2022年11月", image_url: "/certs/NSE_2.jpg", pdf_url: "/certs/NSE_2_Certification.pdf" },
    { name: "飞塔网络安全认证 (FCA) - NSE 1 助理网络安全工程师", issuer: "Fortinet Training Institute", date: "2022年10月", image_url: "/certs/NSE_1.jpg", pdf_url: "/certs/NSE_1_Certification.pdf" },
    { name: "思科认证网络工程师 (Cisco CCNA)", issuer: "Jodoi IT & Service Co., Ltd. / Cisco", date: "2022年6月", image_url: "/certs/CCNA.jpg", pdf_url: "" },
    { name: "Windows Server 2019 活动目录服务配置与排错 (AD001)", issuer: "elife systems Co., Ltd.", date: "2020年8月", image_url: "/certs/AD001.jpg", pdf_url: "" },
    { name: "Windows Server 活动目录高级排错 (AD002)", issuer: "elife systems Co., Ltd.", date: "2020年9月", image_url: "/certs/AD002.jpg", pdf_url: "" },
    { name: "Python 编程与 IT 网络基础 (Python 1)", issuer: "Cisco Networking Academy", date: "2023年5月", image_url: "/certs/Python1.png", pdf_url: "/certs/Python1.pdf" },
    { name: "高级 Python 编程开发 (Python 2)", issuer: "Cisco Networking Academy", date: "2023年5月", image_url: "/certs/Python2.jpg", pdf_url: "/certs/Python2.pdf" },
    { name: "全民必备 SQL 基础课程", issuer: "BORNTODEV", date: "2026年2月", image_url: "/certs/SQL.jpg", pdf_url: "/certs/SQL.pdf" },
    { name: "基础网络安全课程 (1.30 小时)", issuer: "泰国劳工部技能发展厅", date: "2023年8月30日", image_url: "/certs/basic-cybersecurity.png", pdf_url: "/certs/basic-cybersecurity.pdf" },
    { name: "面向 IT 新手的网络基础课程 (1.40 小时)", issuer: "泰国劳工部技能发展厅 联合 网络技术创新推广协会 (CIPAT)", date: "2023年8月30日", image_url: "/certs/basic-network.png", pdf_url: "/certs/basic-network.pdf" }
  ]
};

const getSkillDetailIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("fortigate") || n.includes("sophos") || n.includes("zyxel") || n.includes("firewall") || n.includes("security") || n.includes("安全")) {
    return <Shield className="w-4 h-4 text-purple-600 shrink-0" />;
  }
  if (n.includes("lan / wan") || n.includes("tcp/ip") || n.includes("networking") || n.includes("网络")) {
    return <Network className="w-4 h-4 text-blue-600 shrink-0" />;
  }
  if (n.includes("cisco") || n.includes("aruba") || n.includes("hp") || n.includes("switch") || n.includes("router") || n.includes("nutanix") || n.includes("esxi") || n.includes("vmware") || n.includes("hyper-v") || n.includes("路由器") || n.includes("交换机") || n.includes("虚拟化")) {
    return <Server className="w-4 h-4 text-blue-600 shrink-0" />;
  }
  if (n.includes("omada") || n.includes("wifi") || n.includes("控制器")) {
    return <Wifi className="w-4 h-4 text-sky-600 shrink-0" />;
  }
  if (n.includes("active directory") || n.includes("gpo") || n.includes("entra") || n.includes("活动目录") || n.includes("组策略")) {
    return <Users className="w-4 h-4 text-blue-600 shrink-0" />;
  }
  if (n.includes("azure") || n.includes("cloud") || n.includes("365") || n.includes("云")) {
    return <Cloud className="w-4 h-4 text-sky-600 shrink-0" />;
  }
  if (n.includes("nas") || n.includes("backup") || n.includes("备份") || n.includes("灾备")) {
    return <HardDrive className="w-4 h-4 text-slate-600 shrink-0" />;
  }
  if (n.includes("supabase") || n.includes("postgresql") || n.includes("sql") || n.includes("数据库")) {
    return <Database className="w-4 h-4 text-purple-600 shrink-0" />;
  }
  if (n.includes("next.js") || n.includes("react") || n.includes("javascript") || n.includes("php") || n.includes("typescript") || n.includes("html") || n.includes("css") || n.includes("原生") || n.includes("开发")) {
    return <Code2 className="w-4 h-4 text-sky-600 shrink-0" />;
  }
  if (n.includes("script") || n.includes("python") || n.includes("api") || n.includes("编程")) {
    return <Terminal className="w-4 h-4 text-slate-600 shrink-0" />;
  }
  if (n.includes("phone") || n.includes("电话")) {
    return <Phone className="w-4 h-4 text-slate-500 shrink-0" />;
  }
  if (n.includes("cctv") || n.includes("video") || n.includes("监控")) {
    return <Video className="w-4 h-4 text-slate-500 shrink-0" />;
  }
  if (n.includes("finger") || n.includes("指纹") || n.includes("门禁")) {
    return <Fingerprint className="w-4 h-4 text-slate-600 shrink-0" />;
  }
  if (n.includes("thai") || n.includes("lao") || n.includes("khmer") || n.includes("english") || n.includes("languages") || n.includes("泰语") || n.includes("英语") || n.includes("语言能力")) {
    return <Languages className="w-4 h-4 text-slate-600 shrink-0" />;
  }
  return <Cpu className="w-4 h-4 text-slate-400 shrink-0" />;
};

const getCertAssets = (name: string, dbImage: string | null, dbPdf: string | null) => {
  const n = name.toLowerCase();
  let image_url = dbImage || "";
  let pdf_url = dbPdf || "";

  if (!image_url || !image_url.startsWith("/certs/")) {
    if (n.includes("nse 3") || n.includes("nse3")) {
      image_url = "/certs/NSE_3.jpg";
      pdf_url = pdf_url || "/certs/NSE_3_Certificate.pdf";
    } else if (n.includes("nse 2") || n.includes("nse2")) {
      image_url = "/certs/NSE_2.jpg";
      pdf_url = pdf_url || "/certs/NSE_2_Certification.pdf";
    } else if (n.includes("nse 1") || n.includes("nse1")) {
      image_url = "/certs/NSE_1.jpg";
      pdf_url = pdf_url || "/certs/NSE_1_Certification.pdf";
    } else if (n.includes("ccna")) {
      image_url = "/certs/CCNA.jpg";
    } else if (n.includes("ad001") || (n.includes("configuring") && n.includes("active directory"))) {
      image_url = "/certs/AD001.jpg";
    } else if (n.includes("ad002") || (n.includes("troubleshooting") && n.includes("active directory"))) {
      image_url = "/certs/AD002.jpg";
    } else if (n.includes("python 1") || n.includes("python programming") || n.includes("python pi") || n.includes("python 编程")) {
      image_url = "/certs/Python1.png";
      pdf_url = pdf_url || "/certs/Python1.pdf";
    } else if (n.includes("python 2") || n.includes("advanced python")) {
      image_url = "/certs/Python2.jpg";
      pdf_url = pdf_url || "/certs/Python2.pdf";
    } else if (n.includes("sql")) {
      image_url = "/certs/SQL.jpg";
      pdf_url = pdf_url || "/certs/SQL.pdf";
    } else if (n.includes("cybersecurity") || n.includes("cyber security") || n.includes("网络安全")) {
      image_url = "/certs/basic-cybersecurity.png";
      pdf_url = pdf_url || "/certs/basic-cybersecurity.pdf";
    } else if (n.includes("basic network") || n.includes("basic-network") || (n.includes("network") && n.includes("มือใหม่")) || n.includes("网络基础")) {
      image_url = "/certs/basic-network.png";
      pdf_url = pdf_url || "/certs/basic-network.pdf";
    }
  }

  return { image_url, pdf_url };
};

const getAccomplishmentMeta = (index: number) => {
  const iconProps = { className: "w-3 h-3", strokeWidth: 3 };
  switch (index) {
    case 0:
      return {
        icon: <TrendingDown {...iconProps} />,
        bgClass: "bg-blue-50 text-blue-600 border border-blue-100"
      };
    case 1:
      return {
        icon: <FileCode {...iconProps} />,
        bgClass: "bg-sky-50 text-sky-600 border border-sky-100"
      };
    case 2:
      return {
        icon: <Server {...iconProps} />,
        bgClass: "bg-purple-50 text-purple-600 border border-purple-100"
      };
    case 3:
      return {
        icon: <Cloud {...iconProps} />,
        bgClass: "bg-slate-50 text-slate-600 border border-slate-200"
      };
    case 4:
      return {
        icon: <Users {...iconProps} />,
        bgClass: "bg-blue-50 text-blue-600 border border-blue-100"
      };
    case 5:
      return {
        icon: <Shield {...iconProps} />,
        bgClass: "bg-sky-50 text-sky-600 border border-sky-100"
      };
    case 6:
      return {
        icon: <Network {...iconProps} />,
        bgClass: "bg-purple-50 text-purple-600 border border-purple-100"
      };
    case 7:
      return {
        icon: <Activity {...iconProps} />,
        bgClass: "bg-slate-50 text-slate-600 border border-slate-200"
      };
    case 8:
      return {
        icon: <Code2 {...iconProps} />,
        bgClass: "bg-blue-50 text-blue-600 border border-blue-100"
      };
    case 9:
      return {
        icon: <Phone {...iconProps} />,
        bgClass: "bg-sky-50 text-sky-600 border border-sky-100"
      };
    default:
      return {
        icon: <Check {...iconProps} />,
        bgClass: "bg-slate-50 text-slate-600 border border-slate-200"
      };
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("profile"); // profile (dashboard), about, projects, experience, skills, contact
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(mockProfile);
  const [experiences, setExperiences] = useState<any>(mockExperiences);
  const [skills, setSkills] = useState<any>(mockSkills);
  const [certifications, setCertifications] = useState<any>(mockCertifications);
  const [projects, setProjects] = useState<any>(mockProjects);
  const [language, setLanguage] = useState<"th" | "en" | "zh">("th");

  // Resolve language data
  const currentProfile = useMemo(() => {
    if (language === "th") {
      if (profile && !profile.th) {
        return profile;
      }
      return profile.th || mockProfile.th;
    }
    return mockProfile[language] || mockProfile.th;
  }, [profile, language]);

  const currentProjects = useMemo((): any[] => {
    let list: any[] = [];
    if (language === "th") {
      if (Array.isArray(projects)) {
        list = projects;
      } else {
        list = projects.th || mockProjects.th || [];
      }
    } else {
      if (projects && projects[language]) {
        list = projects[language];
      } else if (Array.isArray(projects)) {
        list = projects.map((p: any, idx: number) => {
          const titleKey = p.title?.toUpperCase();
          const titleToIndex: { [key: string]: number } = {
            "MEC CALIBRATION SYSTEM": 0,
            "IT PROJECT DASHBOARD": 1,
            "IN-HOUSE HELP DESK": 2,
            "PRINT COST DASHBOARD": 3,
            "LICENSE TRACKER": 4,
            "MEC PROJECT COST DASHBOARD": 5
          };
          const matchIdx = titleKey in titleToIndex ? titleToIndex[titleKey] : idx;
          const match = mockProjects[language]?.[matchIdx];
          return {
            ...p,
            title: match ? match.title : p.title,
            description: match ? match.description : p.description
          };
        });
      } else {
        list = mockProjects[language] || mockProjects.th || [];
      }
    }

    return list.map((p: any) => {
      const isMecCalibration = p.title?.toUpperCase().includes("CALIBRATION");
      return {
        ...p,
        isFeatured: p.isFeatured || p.is_featured || isMecCalibration,
        is_featured: p.isFeatured || p.is_featured || isMecCalibration
      };
    });
  }, [projects, language]);

  const currentExperiences = useMemo((): any[] => {
    if (language === "th") {
      if (Array.isArray(experiences)) {
        return experiences;
      }
      return experiences.th || mockExperiences.th || [];
    }
    return mockExperiences[language] || mockExperiences.th || [];
  }, [experiences, language]);

  const currentSkills = useMemo((): any[] => {
    if (language === "th") {
      if (Array.isArray(skills)) {
        return skills;
      }
      return skills.th || mockSkills.th || [];
    }
    return mockSkills[language] || mockSkills.th || [];
  }, [skills, language]);

  const currentCertifications = useMemo((): any[] => {
    if (language === "th") {
      if (Array.isArray(certifications)) {
        return certifications;
      }
      return certifications.th || mockCertifications.th || [];
    }
    return mockCertifications[language] || mockCertifications.th || [];
  }, [certifications, language]);

  // Preview Cert Modal States
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>("");

  // Contact Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    async function loadData() {
      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                            process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id") ||
                            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your-anon-key-here");

      if (isPlaceholder) {
        console.warn("Supabase is using placeholder credentials, bypassing DB fetch and using local mock data.");
        
        let storedProfile = localStorage.getItem("mock_profile");
        if (!storedProfile) {
          localStorage.setItem("mock_profile", JSON.stringify(mockProfile));
          storedProfile = JSON.stringify(mockProfile);
        }
        try { setProfile(JSON.parse(storedProfile)); } catch(e) { setProfile(mockProfile); }

        let storedExp = localStorage.getItem("mock_experiences");
        if (!storedExp) {
          localStorage.setItem("mock_experiences", JSON.stringify(mockExperiences));
          storedExp = JSON.stringify(mockExperiences);
        }
        try { setExperiences(JSON.parse(storedExp)); } catch(e) { setExperiences(mockExperiences); }

        let storedSkills = localStorage.getItem("mock_skills");
        if (!storedSkills) {
          localStorage.setItem("mock_skills", JSON.stringify(mockSkills));
          storedSkills = JSON.stringify(mockSkills);
        }
        try { setSkills(JSON.parse(storedSkills)); } catch(e) { setSkills(mockSkills); }

        let storedProjects = localStorage.getItem("mock_projects");
        if (!storedProjects) {
          localStorage.setItem("mock_projects", JSON.stringify(mockProjects));
          storedProjects = JSON.stringify(mockProjects);
        }
        try { setProjects(JSON.parse(storedProjects)); } catch(e) { setProjects(mockProjects); }

        let storedCerts = localStorage.getItem("mock_certifications");
        if (!storedCerts) {
          localStorage.setItem("mock_certifications", JSON.stringify(mockCertifications));
          storedCerts = JSON.stringify(mockCertifications);
        }
        try { setCertifications(JSON.parse(storedCerts)); } catch(e) { setCertifications(mockCertifications); }

        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const fetchPromise = async () => {
          // Fetch Profile
          const { data: profData } = await supabase.from("profiles").select("*").maybeSingle();
          if (profData) setProfile({ ...mockProfile, ...profData });

          // Fetch Experiences
          const { data: expData } = await supabase.from("experiences").select("*").order("order_index", { ascending: true });
          if (expData && expData.length > 0) setExperiences(expData);

          // Fetch Skills
          const { data: skillData } = await supabase.from("skills").select("*").order("order_index", { ascending: true });
          if (skillData && skillData.length > 0) setSkills(skillData);

          // Fetch Certifications
          const { data: certData } = await supabase.from("certifications").select("*").order("order_index", { ascending: true });
          if (certData && certData.length > 0) setCertifications(certData);

          // Fetch Projects
          const { data: projData } = await supabase.from("projects").select("*").order("order_index", { ascending: true });
          if (projData && projData.length > 0) setProjects(projData);
        };

        // Limit Supabase connection attempts to 1.5 seconds.
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Supabase connection timeout")), 1500)
        );

        await Promise.race([fetchPromise(), timeoutPromise]);

      } catch (err) {
        console.error("Error loading data from Supabase, falling back to mock data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  // Group skills by category for display
  const groupedSkills = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    currentSkills.forEach(s => {
      const cat = s.category || (language === "th" ? "อื่นๆ" : language === "zh" ? "其他" : "Others");
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });
    return groups;
  }, [currentSkills, language]);

  // Featured and regular projects split
  const { featuredProject, regularProjects } = useMemo(() => {
    const feat = currentProjects.find(p => p.isFeatured || p.is_featured) || currentProjects[0];
    const regs = currentProjects.filter(p => p.id !== feat?.id);
    return { featuredProject: feat, regularProjects: regs };
  }, [currentProjects]);

  // Interactive circle progress values matching mockup layout style
  const circularSkills = useMemo(() => {
    return [
      { name: "JavaScript", short: "JS", percent: 85, color: "stroke-[#ca8a04]" },
      { name: "React", short: "React", percent: 80, color: "stroke-[#0284c7]" },
      { name: "Node.js", short: "Node.js", percent: 75, color: "stroke-[#16a34a]" },
      { name: "Python", short: "Python", percent: 70, color: "stroke-[#2563eb]" },
      { name: "AWS", short: "AWS", percent: 80, color: "stroke-[#ea580c]" },
      { name: "SQL DB", short: "SQL", percent: 85, color: "stroke-[#475569]" },
      { name: "Fortigate FW", short: "FW", percent: 90, color: "stroke-[#dc2626]" },
      { name: "Active Directory", short: "AD", percent: 90, color: "stroke-[#2563eb]" },
      { name: "TP-Link Omada", short: "Omada", percent: 90, color: "stroke-[#0284c7]" }
    ];
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-blue-600">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <span className="text-sm font-semibold tracking-wider uppercase font-heading text-slate-800">
            {uiTranslations[language].loadingDashboard}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex relative overflow-hidden">
      
      {/* Floating Language Switcher */}
      <div className="fixed top-4 right-4 z-40 flex gap-1 p-1 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-full shadow-lg">
        {[
          { code: "th", label: "TH" },
          { code: "en", label: "EN" },
          { code: "zh", label: "中" }
        ].map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              language === lang.code
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      

      <div className="flex-1 max-w-[1400px] mx-auto flex flex-col md:flex-row relative z-10 p-4 md:p-6 gap-6 md:h-screen md:overflow-hidden min-h-screen">
        
        {/* ================= SIDEBAR ================= */}
        <aside className="w-full md:w-[300px] shrink-0 neon-card rounded-3xl p-5 md:p-6 flex flex-col justify-between overflow-y-auto scrollbar-hide border border-slate-200 bg-white">
          
          {/* Top: Sidebar Menu */}
          <div className="space-y-5">
            
            {/* Navigation links matching mockup exactly */}
            <nav className="space-y-1">
              {[
                { id: "profile", label: uiTranslations[language].profile, icon: LayoutDashboard },
                { id: "projects", label: uiTranslations[language].projects, icon: Layers },
                { id: "experience", label: uiTranslations[language].experience, icon: Briefcase },
                { id: "skills", label: uiTranslations[language].skills, icon: Code2 },
                { id: "certifications", label: uiTranslations[language].certifications, icon: Award },
                { id: "contact", label: uiTranslations[language].contact, icon: Mail }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all font-heading text-sm font-semibold relative group ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 border border-blue-100/60 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <item.icon className={`w-5 h-5 icon-wiggle ${activeTab === item.id ? "text-blue-600 scale-110" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                  {activeTab === item.id && (
                    <span className="absolute right-3 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom: Profile card matching mockup exactly */}
          <div className="mt-6 pt-5 border-t border-slate-200 space-y-3.5 flex flex-col items-center">
            
            {/* Profile circular avatar with thick neon border */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full p-1 bg-blue-600 shadow-sm">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <Image
                      src={currentProfile.avatar_url || "/profile.jpg"}
                      alt={currentProfile.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
              </div>
            </div>

            {/* Large Bold Capitalized Username */}
            <div className="text-center">
              <h3 className="font-black text-xl tracking-[0.1em] text-slate-800 font-heading uppercase">
                {currentProfile.name ? currentProfile.name.split(" ")[0] : "PATIWAT"}
              </h3>
              <p className="text-[14px] text-slate-600 font-semibold mt-1.5 font-heading">
                {currentProfile.title || "IT Manager & Infrastructure"}
              </p>
            </div>

            {/* Get in touch button pill */}
            <button
              onClick={() => setActiveTab("contact")}
              className="w-full py-2.5 rounded-full font-heading text-xs font-black uppercase bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all hover:scale-102 duration-300"
            >
              {uiTranslations[language].getInTouch}
            </button>

            {/* Download PDF button */}
            <a
              href={`/print?lang=${language}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-full font-heading text-xs font-black uppercase bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:scale-102 duration-300 text-center block"
            >
              {uiTranslations[language].downloadCv || "Download PDF"}
            </a>

            {/* Social Icons row */}
            <div className="flex gap-4 pt-1.5">
              <a href={currentProfile.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors border border-slate-200">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href={currentProfile.github || "#"} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors border border-slate-200">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href={`mailto:${currentProfile.email}`} className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors border border-slate-200">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#contact" onClick={() => setActiveTab("contact")} className="p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors border border-slate-200">
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pr-2 scrollbar-hide space-y-6">
          
          {/* ================= TAB: PROFILE (DASHBOARD) ================= */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              
              {/* Top Block: Profile Bio & Quick Stats */}
              <div className="neon-card p-6 md:p-8 space-y-6 border border-slate-200 bg-white shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                <div className="space-y-4">
                  <h4 className="text-2xl font-black text-slate-800 font-heading leading-tight uppercase tracking-tight">
                    {currentProfile.name}
                  </h4>
                  <span className="text-sm font-bold text-blue-600 font-heading block">
                    {currentProfile.title}
                  </span>
                  <p className="text-slate-600 text-base leading-relaxed font-medium text-left whitespace-pre-line">
                    {currentProfile.bio}
                  </p>
                </div>

                {/* Quick stats highlights */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/60 text-center flex flex-col items-center justify-center space-y-2 group hover:bg-white hover:shadow-md hover:border-blue-300 transition-all duration-300">
                    <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
                      <Briefcase className="w-5 h-5 icon-bounce-hover" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-sky-600 font-heading leading-none">{uiTranslations[language].experienceYearsVal}</div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-2">{uiTranslations[language].experienceYears}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/60 text-center flex flex-col items-center justify-center space-y-2 group hover:bg-white hover:shadow-md hover:border-blue-300 transition-all duration-300">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                      <Users className="w-5 h-5 icon-wiggle" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-indigo-600 font-heading leading-none">{uiTranslations[language].activeUsersVal}</div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-2">{uiTranslations[language].activeUsers}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/60 text-center flex flex-col items-center justify-center space-y-2 group hover:bg-white hover:shadow-md hover:border-blue-300 transition-all duration-300">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                      <Activity className="w-5 h-5 icon-pulse-hover" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-purple-600 font-heading leading-none">1.17M</div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-2">{uiTranslations[language].costReduction}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/60 text-center flex flex-col items-center justify-center space-y-2 group hover:bg-white hover:shadow-md hover:border-blue-300 transition-all duration-300">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                      <Code2 className="w-5 h-5 icon-spin-hover" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-emerald-600 font-heading leading-none">{uiTranslations[language].developedSystemsVal}</div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-2">{uiTranslations[language].developedSystems}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom split: FEATURED PROJECT vs INTERACTIVE SKILLS */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Left: FEATURED PROJECT column (col-span-7) */}
                <div className="xl:col-span-7 space-y-4">
                  <h3 className="font-extrabold text-sm uppercase tracking-[0.2em] text-slate-500 font-heading pl-1">
                    {uiTranslations[language].featuredProject}
                  </h3>

                  {featuredProject && (
                    <div className="neon-card overflow-hidden flex flex-col border border-slate-200 relative group shadow-sm bg-white p-6 justify-between min-h-[300px]">
                      <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-blue-500 to-indigo-500" />
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black tracking-widest text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase">
                            {uiTranslations[language].featuredProject}
                            {featuredProject.company && ` • ${featuredProject.company}`}
                          </span>
                        </div>
                        <h4 className="text-lg font-extrabold text-slate-800 font-heading uppercase group-hover:text-blue-600 transition-colors">
                          {featuredProject.title}
                        </h4>
                        <p className="text-[13px] text-slate-600 leading-relaxed font-medium line-clamp-3">
                          {featuredProject.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1.5">
                          {featuredProject.tags?.map((tag: string, idx: number) => (
                            <span key={idx} className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => setActiveTab("projects")}
                          className="inline-flex items-center gap-1 text-[12px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          <span>{uiTranslations[language].exploreDetails}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: INTERACTIVE SKILLS gauges (col-span-5) */}
                <div className="xl:col-span-5 space-y-4">
                  <h3 className="font-extrabold text-sm uppercase tracking-[0.2em] text-slate-500 font-heading pl-1">
                    {uiTranslations[language].interactiveSkills}
                  </h3>

                  <div className="neon-card p-6 grid grid-cols-3 gap-6 items-center justify-center border border-slate-100 bg-white shadow-sm min-h-[300px]">
                    {circularSkills.map((s, idx) => {
                      const radius = 28;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDashoffset = circumference - (s.percent / 100) * circumference;

                      // Helper to render high-fidelity custom SVG/text icons inside center of progress circles
                      const getSkillIcon = (shortName: string) => {
                        switch (shortName) {
                          case "JS":
                            return <span className="text-[#ca8a04] font-extrabold text-xs tracking-tight">JS</span>;
                          case "React":
                            return (
                              <svg className="w-6.5 h-6.5 text-[#0284c7] animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <ellipse cx="12" cy="12" rx="10.5" ry="4" transform="rotate(30 12 12)" />
                                <ellipse cx="12" cy="12" rx="10.5" ry="4" transform="rotate(90 12 12)" />
                                <ellipse cx="12" cy="12" rx="10.5" ry="4" transform="rotate(150 12 12)" />
                                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                              </svg>
                            );
                          case "Node.js":
                            return <span className="text-[#16a34a] font-black text-[9px] tracking-tighter">NODE</span>;
                          case "Python":
                            return (
                              <svg className="w-5.5 h-5.5 text-[#2563eb]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2c-.6 0-1.1.1-1.5.3L6.3 4.6c-.8.4-1.3 1.2-1.3 2v4.8h6.4V12.4H5v1.2c0 .8.5 1.6 1.3 2l4.2 2.3c.4.2.9.3 1.5.3.6 0 1.1-.1 1.5-.3l4.2-2.3c.8-.4 1.3-1.2 1.3-2v-4.8H12.6V8.6H19V7.4c0-.8-.5-1.6-1.3-2l-4.2-2.3C13.1 2.1 12.6 2 12 2z" fill="currentColor" />
                              </svg>
                            );
                          case "AWS":
                            return <span className="text-[#ea580c] font-extrabold text-[10px] tracking-tighter uppercase">AWS</span>;
                          case "SQL":
                            return (
                              <svg className="w-5 h-5 text-[#475569]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <ellipse cx="12" cy="5" rx="7" ry="2.2" />
                                <path d="M5 5v5c0 1.2 3.1 2.2 7 2.2s7-1 7-2.2V5" />
                                <path d="M5 10v5c0 1.2 3.1 2.2 7 2.2s7-1 7-2.2v-5" />
                              </svg>
                            );
                          case "FW":
                            return (
                              <svg className="w-5 h-5 text-[#dc2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18M3 15h18M9 3v6M15 3v6M6 9v6M12 9v6M18 9v6" />
                              </svg>
                            );
                          case "AD":
                            return (
                              <svg className="w-5 h-5 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <rect x="9" y="2" width="6" height="5" rx="1" />
                                <rect x="2" y="17" width="6" height="5" rx="1" />
                                <rect x="16" y="17" width="6" height="5" rx="1" />
                                <path d="M6 17v-6h12v6M12 11V7" />
                              </svg>
                            );
                          case "Omada":
                            return (
                              <svg className="w-5 h-5 text-[#0284c7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <circle cx="12" cy="18" r="1" fill="currentColor" />
                                <path d="M5 12a10 10 0 0 1 14 0" />
                                <path d="M8.5 15.5a5 5 0 0 1 7 0" />
                              </svg>
                            );
                          default:
                            return <span className="text-slate-800 font-extrabold text-[9px] uppercase">{shortName}</span>;
                        }
                      };

                      return (
                        <div key={idx} className="flex flex-col items-center text-center group cursor-pointer" title={`${s.name} - ${s.percent}%`}>
                          
                          {/* Larger Circular progress with icon inside */}
                          <div className="relative w-20 h-20 flex items-center justify-center mb-1">
                            <svg className="w-full h-full" viewBox="0 0 80 80">
                              <circle
                                cx="40"
                                cy="40"
                                r={radius}
                                className="stroke-[#e2e8f0] fill-[#f8fafc]"
                                strokeWidth="4"
                                transform="rotate(-90 40 40)"
                              />
                              <circle
                                cx="40"
                                cy="40"
                                r={radius}
                                className={`fill-none transition-all duration-1000 ${s.color}`}
                                strokeWidth="4"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                transform="rotate(-90 40 40)"
                              />
                            </svg>
                            <div className="absolute flex items-center justify-center">
                              {getSkillIcon(s.short)}
                            </div>
                          </div>

                          <span className="text-[12px] font-bold text-[#475569] group-hover:text-slate-800 transition-colors mt-1.5 text-center leading-tight">
                            {s.name === "Active Directory" ? "Active Directory" : s.name.split(" ")[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}



          {/* ================= TAB: PROJECTS LIST ================= */}
          {activeTab === "projects" && (() => {
            const smecExp = currentExperiences.find((e: any) => {
              const comp = e.company ? e.company.toLowerCase() : "";
              return comp.includes("s.mec") || comp.includes("smec") || comp.includes("เอส.เอ็มอีซีซี");
            });
            const accomplishmentsList = smecExp?.accomplishments || [];
            
            return (
              <div className="space-y-8">
                <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-sm uppercase tracking-[0.2em] text-slate-800 dark:text-slate-100 font-heading">
                    {uiTranslations[language].projectsTitle}
                  </h3>
                </div>

                {/* 3-Year Key Achievements Summary Card (ย้ายมาจากหน้าประสบการณ์) */}
                {accomplishmentsList && accomplishmentsList.length > 0 && (
                  <div className="neon-card p-6 border border-emerald-100 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/10 dark:from-emerald-950/10 dark:via-slate-900 dark:to-slate-900/60 shadow-md rounded-2xl space-y-6 relative overflow-hidden">
                    <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-emerald-400/5 dark:bg-emerald-500/5 blur-3xl pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-emerald-100/50 dark:border-emerald-900/30 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-450">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-heading">
                            {language === "th" ? "สรุปผลงานความสำเร็จและผลงานลดต้นทุน IT (สะสม 3 ปี)" : language === "zh" ? "3年期核心业绩与IT降本成果汇总" : "3-Year Key Achievements & IT Cost Reduction"}
                          </h4>
                          <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-0.5">
                            S.MEC Engineering Co., Ltd.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-450 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1 rounded-full shrink-0 self-start sm:self-center">
                        {language === "th" ? "ประหยัด 1.17M / ปี" : language === "zh" ? "降本 117万/年" : "Saved 1.17M / Yr"}
                      </span>
                    </div>

                    {/* Section 1: Accomplishments list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {accomplishmentsList.map((ach: string, aIdx: number) => {
                        const meta = getAccomplishmentMeta(aIdx);
                        return (
                          <div key={aIdx} className="p-3.5 rounded-xl border border-slate-100/70 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/30 hover:bg-white/80 dark:hover:bg-slate-900/60 hover:shadow-sm transition-all duration-300 flex items-start gap-3">
                            <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${meta.bgClass}`}>
                              {meta.icon}
                            </div>
                            <span className="text-xs text-slate-700 dark:text-slate-400 font-semibold leading-relaxed">
                              {ach}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Section 2: Projects detail nested inside the card with custom heading */}
                    <div className="border-t border-emerald-100/50 dark:border-emerald-900/30 pt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 font-heading">
                          {language === "th" ? "ระบบภายในและเว็บแอปพลิเคชันที่พัฒนา" : language === "zh" ? "自研系统与 Web 应用详情" : "Developed Systems & Web Applications"}
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentProjects.map((p, idx) => (
                          <div
                            key={p.id || idx}
                            className="p-5 border border-slate-100 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900/80 hover:shadow-md transition-all duration-350 rounded-xl flex flex-col justify-between space-y-4 group"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start gap-2">
                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                                  (p.isFeatured || p.is_featured)
                                    ? "bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900/30 dark:text-blue-400" 
                                    : "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900/40 dark:border-slate-800/40 dark:text-slate-400"
                                }`}>
                                  {(p.isFeatured || p.is_featured)
                                    ? uiTranslations[language].featuredProject 
                                    : (language === "th" ? "ระบบภายใน" : language === "zh" ? "内部自研系统" : "In-House System")}
                                </span>
                              </div>
                              <h4 className="text-[18px] font-extrabold text-slate-900 dark:text-slate-300 font-heading uppercase group-hover:text-blue-600 dark:group-hover:text-blue-450 transition-colors">
                                {p.title}
                              </h4>
                              <p className="text-[17px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {p.description}
                              </p>
                            </div>

                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-1.5">
                                {p.tags?.map((tag: string, tIdx: number) => (
                                  <span key={tIdx} className="text-[15px] font-bold text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200/80 dark:border-slate-800/80 px-2 py-0.5 rounded animate-pulse-subtle">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              {p.link && p.link !== "#" && (
                                <a
                                  href={p.link}
                                  className="inline-flex items-center gap-1 text-[12px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                >
                                  <span>{uiTranslations[language].exploreDetails}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })()}

          {/* ================= TAB: EXPERIENCE ================= */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm uppercase tracking-[0.2em] text-slate-800 font-heading">
                  {uiTranslations[language].experienceTitle}
                </h3>
              </div>

              {currentExperiences.length > 0 ? (
                <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-10 py-2">
                  {currentExperiences.map((exp, index) => (
                    <div key={index} className="relative group">
                      
                      {/* Timeline Dot */}
                      <span className="absolute -left-[32px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center group-hover:border-blue-800 transition-colors shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:bg-blue-800" />
                      </span>

                      {/* Content card */}
                      <div className="neon-card p-6 border border-slate-100 bg-white shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <div>
                            <h4 className="text-base font-extrabold text-slate-800 font-heading uppercase tracking-wide leading-tight">
                              {exp.company}
                            </h4>
                            <span className="text-xs text-blue-600 font-bold tracking-wide mt-1 block">
                              {exp.role} {exp.location ? `(${exp.location})` : ""}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-1 rounded-full self-start sm:self-center">
                            {exp.start_date} - {exp.end_date}
                          </span>
                        </div>

                        {/* Responsibilities list */}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <div className="space-y-1.5 text-[16px] text-slate-600 leading-relaxed font-medium">
                            <h5 className="text-[13px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1">
                              {uiTranslations[language].responsibilities}
                            </h5>
                            <ul className="list-disc list-outside pl-4 space-y-1">
                              {exp.responsibilities.map((desc: string, dIdx: number) => (
                                <li key={dIdx}>{desc}</li>
                              ))}
                            </ul>
                          </div>
                        )}



                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm font-medium">
                  {language === "th" ? "ไม่พบข้อมูลประวัติการทำงานในระบบ" : language === "zh" ? "未找到工作经历" : "No professional experience records found."}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: SKILLS DETAILS ================= */}
          {activeTab === "skills" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                    <Code2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm uppercase tracking-[0.2em] text-slate-800 dark:text-slate-100 font-heading">
                      {uiTranslations[language].skillsTitle}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === "th" ? "ระดับทักษะความชำนาญและเทคโนโลยีที่เชี่ยวชาญ" : language === "zh" ? "专业技能水平与核心应用工具清单" : "Detailed breakdown of technical skills & proficiencies"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(groupedSkills).map(([category, items], gIdx) => (
                  <div key={gIdx} className="group relative rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden">
                    {/* Background accent glow */}
                    <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-blue-400/5 dark:bg-blue-500/5 blur-3xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
                    
                    <div className="space-y-5">
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 font-heading tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2.5">
                        <span className="w-2.5 h-4.5 bg-gradient-to-b from-blue-500 to-indigo-650 rounded-sm block" />
                        {category}
                      </h4>
                      
                      <div className="flex flex-col gap-3">
                        {items.map((skill, index) => {
                          // Define progress width and colors based on proficiency
                          let percent = 50;
                          let barColorClass = "from-blue-500 to-indigo-500";
                          let badgeBgClass = "bg-blue-50/60 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-100/50 dark:border-blue-900/30";
                          
                          const prof = (skill.proficiency || "").toLowerCase();
                          if (prof.includes("advanced") || prof.includes("精通") || prof.includes("native") || prof.includes("母语")) {
                            percent = 90;
                            barColorClass = "from-emerald-500 to-teal-500";
                            badgeBgClass = "bg-emerald-50/60 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30";
                          } else if (prof.includes("intermediate") || prof.includes("良好")) {
                            percent = 70;
                            barColorClass = "from-blue-500 to-indigo-500";
                            badgeBgClass = "bg-blue-50/60 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-100/50 dark:border-blue-900/30";
                          } else if (prof.includes("beginner") || prof.includes("初级")) {
                            percent = 40;
                            barColorClass = "from-slate-400 to-slate-500";
                            badgeBgClass = "bg-slate-50/60 text-slate-600 dark:bg-slate-950/40 dark:text-slate-400 border-slate-200/50 dark:border-slate-900/30";
                          }

                          return (
                            <div key={index} className="p-3 rounded-xl border border-slate-100/50 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-900/10 hover:bg-slate-50/80 dark:hover:bg-slate-900/40 hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-300 flex flex-col gap-2 group/item">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover/item:scale-110 transition-transform duration-300">
                                    {getSkillDetailIcon(skill.name)}
                                  </div>
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                    {skill.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {skill.proficiency && (
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeBgClass}`}>
                                      {skill.proficiency}
                                    </span>
                                  )}
                                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 min-w-[28px] text-right">
                                    {percent}%
                                  </span>
                                </div>
                              </div>
                              
                              {/* Custom Progress Bar Indicator */}
                              <div className="pl-11 pr-1.5 w-full">
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full bg-gradient-to-r ${barColorClass} rounded-full group-hover/item:opacity-90 transition-all duration-500`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB: CERTIFICATIONS ================= */}
          {activeTab === "certifications" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm uppercase tracking-[0.2em] text-slate-800 font-heading">
                  {uiTranslations[language].certificationsTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentCertifications.map((cert, index) => {
                  const assets = getCertAssets(cert.name, cert.image_url, cert.pdf_url);
                  return (
                    <div key={index} className="neon-card border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between group hover:border-blue-300 transition-all duration-300">
                      
                      {/* Image Preview Container */}
                      <div className="relative h-44 bg-slate-50 border-b border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer"
                           onClick={() => {
                             if (assets.image_url) {
                               setPreviewUrl(assets.image_url);
                               setPreviewName(cert.name);
                             }
                           }}>
                        {assets.image_url ? (
                          <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-500">
                            <Image
                              src={assets.image_url}
                              alt={cert.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                {uiTranslations[language].clickZoom}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <Award className="w-10 h-10" />
                            <span className="text-xs">{uiTranslations[language].noImage}</span>
                          </div>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {cert.issuer}
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-800 font-heading leading-snug group-hover:text-blue-600 transition-colors uppercase">
                            {cert.name}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                          <span className="text-[10px] font-bold text-slate-500">
                            {uiTranslations[language].dateIssued}: {cert.date}
                          </span>
                          {assets.pdf_url && (
                            <a
                              href={assets.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-black text-blue-650 uppercase tracking-widest hover:text-blue-800 transition-colors"
                            >
                              <span>{uiTranslations[language].viewPdf}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB: CONTACT ================= */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-sm uppercase tracking-[0.2em] text-slate-800 font-heading">
                  {uiTranslations[language].contactTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Contact Quick info cards (col-span-5) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="neon-card p-6 border border-slate-100 bg-white shadow-sm space-y-6">
                    <h4 className="font-bold text-base text-slate-800 font-heading tracking-wide">
                      {uiTranslations[language].directContact}
                    </h4>

                    <div className="space-y-4">
                      {[
                        { icon: Mail, label: uiTranslations[language].email || "Email", val: currentProfile.email, href: `mailto:${currentProfile.email}` },
                        { icon: Phone, label: uiTranslations[language].phone || "Phone", val: currentProfile.phone, href: `tel:${currentProfile.phone}` },
                        { icon: MapPin, label: uiTranslations[language].location || "Location", val: currentProfile.address },
                        { icon: Calendar, label: uiTranslations[language].birthdate || "Birthdate", val: currentProfile.birthdate ? new Date(currentProfile.birthdate).toLocaleDateString(language === "zh" ? "zh-CN" : language === "en" ? "en-US" : "th-TH", { day: "numeric", month: "long", year: "numeric" }) : null }
                      ].map((item, idx) => {
                        if (!item.val) return null;
                        return (
                          <div key={idx} className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-200">
                              <item.icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col min-w-0 pt-0.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {item.label}
                              </span>
                              {item.href ? (
                                <a href={item.href} className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors break-all mt-0.5">
                                  {item.val}
                                </a>
                              ) : (
                                <span className="text-sm font-bold text-slate-700 mt-0.5">
                                  {item.val}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Side: Message form (col-span-7) */}
                <div className="lg:col-span-7">
                  <div className="neon-card p-6 border border-slate-100 bg-white shadow-sm space-y-4">
                    <h4 className="font-bold text-base text-slate-800 font-heading tracking-wide">
                      {uiTranslations[language].sendMessage}
                    </h4>

                    {formSubmitted ? (
                      <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-100 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 mx-auto flex items-center justify-center text-emerald-700">
                          <Check className="w-6 h-6" strokeWidth={3} />
                        </div>
                        <h5 className="font-bold text-emerald-800 text-base font-heading">
                          {uiTranslations[language].messageSentSuccess}
                        </h5>
                        <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed font-medium">
                          {language === "th" 
                            ? `ข้อความของคุณถูกส่งไปยัง ${currentProfile.email} แล้ว เราจะติดต่อกลับโดยเร็วที่สุด` 
                            : language === "zh" 
                              ? `您的留言已发送至 ${currentProfile.email}。我们将尽快回复您。` 
                              : `Your message has been sent to ${currentProfile.email}. We will get back to you as soon as possible.`}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                              {uiTranslations[language].nameLabel}
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Name"
                              className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500/60 focus:bg-white rounded-xl p-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                              {uiTranslations[language].emailLabel}
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                              placeholder="Email Address"
                              className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500/60 focus:bg-white rounded-xl p-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            {uiTranslations[language].messageLabel}
                          </label>
                          <textarea
                            required
                            rows={4}
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Type your message here..."
                            className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500/60 focus:bg-white rounded-xl p-3 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition-all resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl font-heading text-xs font-black uppercase bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>{uiTranslations[language].sendMessageBtn}</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Page Footer */}
          <footer className="mt-auto pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-600 font-medium shrink-0">
            <span>&copy; {new Date().getFullYear()} Patiwat Meekaeo. All Rights Reserved.</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{uiTranslations[language].connectedToDb || "Connected to Supabase DB & Next.js 16"}</span>
            </span>
          </footer>

        </main>
      </div>

      {/* Certification Image Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative border border-slate-200 flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h4 className="text-sm font-extrabold text-slate-800 font-heading uppercase tracking-wide truncate max-w-[80%]">
                {previewName}
              </h4>
              <button
                onClick={() => setPreviewUrl(null)}
                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-4 bg-slate-50 flex items-center justify-center overflow-auto min-h-[300px]">
              <div className="relative w-full aspect-[4/3] max-h-[70vh]">
                <Image
                  src={previewUrl}
                  alt={previewName}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
