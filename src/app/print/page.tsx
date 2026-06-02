"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  Briefcase,
  Code2,
  Layers,
  User
} from "lucide-react";

// Fallback Mock Data
const mockProfile = {
  th: {
    name: "ปฏิวัติ มีแก้ว (Patiwat Meekaeo)",
    title: "ผู้จัดการแผนกไอที (IT Manager & Infrastructure)",
    bio: "นักบริหารระบบไอทีประสบการณ์กว่า 9 ปี ผู้เชี่ยวชาญการออกแบบและวางระบบโครงสร้างพื้นฐานเครือข่ายระดับองค์กร (Network Infrastructure, Active Directory, Windows Server), การบริหารจัดการระบบสำรองข้อมูล (Backup & Recovery ด้วย Veeam และ NAS) และระบบเฝ้าระวังเครือข่าย (Network Monitoring) ควบคู่ไปกับการดูแลระบบคลาวด์ Microsoft 365 (Email, SharePoint), ไฟร์วอลล์ (Firewall เช่น Fortigate, Sophos) และควบคุมระบบ ERP ในฐานะ Administrator (Mango ERP, Oracle ERP) นอกจากนี้ยังมีทักษะในการพัฒนาระบบเว็บแอปพลิเคชันและจัดการฐานข้อมูลภายในองค์กรโดยใช้ Python, SQL, JavaScript และ PHP เพื่อเพิ่มประสิทธิภาพการทำงานและลดต้นทุนไอทีอย่างเป็นรูปธรรม\nปัจจุบันดำรงตำแหน่งผู้จัดการแผนกไอที (Acting IT Manager & Infrastructure) ที่ S.MEC Engineering ควบคุมดูแลระบบไอทีครบวงจรเพื่อสนับสนุนผู้ใช้งานกว่า 160 คน โดยมีทักษะครอบคลุมตั้งแต่การวางระบบเครือข่ายหลัก ไปจนถึงการเขียนโปรแกรมและการจัดการข้อมูลอย่างเป็นระบบ",
    email: "patiwatmeekaeo@gmail.com",
    phone: "081-601-9666",
    address: "กรุงเทพมหานคร, ประเทศไทย",
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
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    line_id: "allfile"
  }
};

const mockExperiences = {
  th: [
    {
      company: "บริษัท เอส.เอ็มอีซีซี เอ็นจิเนียริ่ง จำกัด",
      role: "รักษาการผู้จัดการฝ่ายไอที (Acting IT Manager)",
      location: "กรุงเทพมหานคร",
      start_date: "พฤศจิกายน 2566",
      end_date: "ปัจจุบัน",
      responsibilities: [
        "1. การวางแผนและบริหารแผนก IT: วางแผนงบประมาณ IT ประจำปี (Capex & Opex) ดูแลพนักงาน 160 คน ดูแลระบบ IT ผ่านการตรวจ ISO 9001:2015 ทุกปี",
        "2. ระบบเครือข่าย: ติดตั้งเครือข่ายสำนักงานใหญ่ TP-Link Omada (Router, Controller, Switch, AP) พร้อม VLAN Segmentation, Dual ISP Load Balancing ให้บริการได้ต่อเนื่อง 99%",
        "3. Active Directory: บริหาร AD 2 Server Replication (High Availability) จัดโครงสร้าง OU, GPO, DNS, DHCP",
        "4. Security: Config Fortigate 100F (Firewall Policy, SSL/IPSec VPN, IPS, Web Filtering), สำรองข้อมูลผ่าน NAS (Daily/Weekly) แผน DR",
        "5. ERP: บริหาร Mango ERP (UIH Cloud) กำหนดสิทธิ์ และตั้งค่า Workflow (PR/PO/WO)",
        "6. Dev: พัฒนาเว็บแอปในองค์กร (Help Desk, IT Dashboard, Print Cost Dashboard, License Tracker)"
      ],
      accomplishments: [
        "ลดต้นทุน IT ลงกว่า 1.17 ล้านบาท/ปี จากการเจรจาสัญญาซอฟต์แวร์และย้ายระบบ Server Virtualization จาก VMware ไป Nutanix (ประหยัด 52%)",
        "ออกแบบและติดตั้ง IT Infrastructure สำนักงานใหญ่แห่งใหม่สำเร็จแบบ End-to-End"
      ]
    },
    {
      company: "บริษัท ไอทีเทค-คอนเนคติ้ง จำกัด",
      role: "วิศวกรสนับสนุนระบบเครือข่ายไอที (IT Network Support)",
      location: "กรุงเทพมหานคร",
      start_date: "ตุลาคม 2564",
      end_date: "กุมภาพันธ์ 2566",
      responsibilities: [
        "ออกแบบและติดตั้งระบบเครือข่าย, Server Active Directory, Fortigate Firewall, Aruba/Cisco Switches ให้ลูกค้ากว่า 10 โครงการ",
        "จัดทำ Solution Diagram และเอกสารข้อเสนอเทคนิค (Proposal) เพื่อสนับสนุนทีมขาย"
      ],
      accomplishments: [
        "ติดตั้งระบบ Infrastructure สำเร็จลุล่วง มูลค่างานสูงสุดกว่า 800,000 บาท"
      ]
    },
    {
      company: "บริษัท โปรเฟสชันแนล ลาบอราทอรี่ แมนเนจเม้นท์ คอร์ป จำกัด (มหาชน)",
      role: "เจ้าหน้าที่สนับสนุนฝ่ายไอที (IT Support)",
      location: "กรุงเทพมหานคร",
      start_date: "พฤษภาคม 2563",
      end_date: "ตุลาคม 2564",
      responsibilities: [
        "บริหารจัดการสิทธิ์และ Group Policy ผ่าน Active Directory, ดูแลระบบ HIS-LIS (SQL Symphony)",
        "ดูแลความปลอดภัยปลายทางผ่าน Cloud Antivirus (ESET) และระบบ G-Suite / Fortigate VPN ระหว่างสาขา"
      ],
      accomplishments: [
        "ร่วมทีมย้ายระบบฐานข้อมูล HIS ขึ้นคลาวด์ได้สำเร็จ 100% ไม่มีข้อมูลสูญหาย"
      ]
    },
    {
      company: "บริษัท นานมีอุตสาหกรรม จำกัด",
      role: "เจ้าหน้าที่สนับสนุนไอที (IT Support)",
      location: "สมุทรปราการ",
      start_date: "มีนาคม 2562",
      end_date: "เมษายน 2563",
      responsibilities: [
        "ซ่อมฮาร์ดแวร์ ซอฟต์แวร์ ระบบเครือข่าย และระบบ ERP (Oracle) ของโรงงาน",
        "ออกแบบและติดตั้งระบบกล้องวงจรปิด IP CCTV กว่า 150 ตัว เชื่อมต่อด้วย Fiber Optic ทั่วโรงงาน"
      ],
      accomplishments: [
        "ติดตั้งโครงข่าย Fiber CCTV ครอบคลุมพื้นที่โรงงานและคลังสินค้าสำเร็จ 100%"
      ]
    },
    {
      company: "บริษัท บันเลือง ชินอินเตอร์ จำกัด",
      role: "เจ้าหน้าที่สนับสนุนไอที (IT Support)",
      location: "กรุงเทพมหานคร",
      start_date: "มีนาคม 2560",
      end_date: "กุมภาพันธ์ 2562",
      responsibilities: [
        "ซ่อมบำรุงคอมพิวเตอร์ อุปกรณ์ไอที และระบบเครือข่ายส่วนกลางรวมกว่า 100 เครื่อง",
        "บริหารสิทธิ์แชร์โฟลเดอร์ผ่าน Active Directory และระบบสำรองข้อมูลป้องกันข้อมูลสูญหาย"
      ],
      accomplishments: [
        "ลด Downtime ของอุปกรณ์ไอทีในองค์กรและลดค่าใช้จ่ายการส่งซ่อมภายนอก"
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
        "1. IT Management: Plan budgets (Capex & Opex) for 160 users, maintain systems for ISO 9001:2015 audits.",
        "2. Network: Deployed TP-Link Omada network (Router, Switch, AP) with VLAN, Dual ISP Load Balancing (99% uptime).",
        "3. Active Directory: Administer 2-server Replication for High Availability, GPOs, DNS, DHCP.",
        "4. Security: Configure Fortigate 100F (Firewall, VPNs, IPS, Filtering), automated NAS backups.",
        "5. ERP: Administer Mango ERP on UIH Cloud: manage permissions, workflow approvals (PR/PO/WO).",
        "6. Dev: Developed 4 custom in-house web systems (Help Desk, KPI Dashboard, Print Cost Dashboard, License Tracker)."
      ],
      accomplishments: [
        "Saved 1.17M Baht/year by optimizing licenses and migrating Virtualization from VMware to Nutanix (52% cost cut).",
        "Designed and successfully deployed new HQ network infrastructure from the ground up."
      ]
    },
    {
      company: "ITK-Connecting Co., Ltd.",
      role: "IT Network Support Engineer",
      location: "Bangkok",
      start_date: "October 2021",
      end_date: "February 2023",
      responsibilities: [
        "Designed and implemented Network, Server AD, Fortigate Firewall, and Cisco/Aruba switches for clients.",
        "Created technical solution diagrams and proposal documentation to assist the sales team."
      ],
      accomplishments: [
        "Successfully deployed IT infrastructure for over 10 client projects, with values up to 800k Baht."
      ]
    },
    {
      company: "Professional Laboratories Management Corp (Public)",
      role: "IT Support",
      location: "Bangkok",
      start_date: "May 2020",
      end_date: "October 2021",
      responsibilities: [
        "Managed user directory and Group Policies via AD; maintained LIS SQL databases.",
        "Managed endpoint security (ESET Cloud) and branch-to-branch Leased Line VPN."
      ],
      accomplishments: [
        "Successfully migrated core laboratory database to Cloud Infrastructure with zero data loss."
      ]
    },
    {
      company: "Nanmee Industry Co., Ltd.",
      role: "IT Support",
      location: "Samut Prakan",
      start_date: "March 2019",
      end_date: "April 2020",
      responsibilities: [
        "Maintained factory hardware, software, network connections, and Oracle ERP environment.",
        "Designed and deployed 150+ IP CCTV camera network utilizing Fiber Optic backbones."
      ],
      accomplishments: [
        "Completed full-scale fiber CCTV integration across all factory and warehouse zones."
      ]
    },
    {
      company: "Banleong Chin Inter Co., Ltd.",
      role: "IT Support",
      location: "Bangkok",
      start_date: "March 2017",
      end_date: "February 2019",
      responsibilities: [
        "Provided helpdesk and desktop hardware support for over 100 client workstations.",
        "Managed user shared folder access rights via Active Directory and standard backup schedules."
      ],
      accomplishments: [
        "Significantly reduced office device downtime and external maintenance expenditures."
      ]
    }
  ],
  zh: [
    {
      company: "S.MEC ENGINEERING CO., LTD. (建筑工程)",
      role: "代理 IT 部门经理 (Acting IT Manager)",
      location: "曼谷",
      start_date: "2023年11月",
      end_date: "至今",
      responsibilities: [
        "1. IT管理：规划160名员工的年度IT预算 (Capex & Opex)，确保通过 ISO 9001:2015 质量体系审计。",
        "2. 网络：独立部署总部 TP-Link Omada 网络（路由器、交换机、AP）并配置 VLAN、双 ISP 负载均衡（99% 可用性）。",
        "3. 活动目录：管理高可用双域控同步（AD 2 Server Replication），配置 OU、GPO、DNS、DHCP。",
        "4. 安全：配置 Fortigate 100F 防火墙安全策略（SSL/IPSec VPN、IPS、过滤）及 NAS 自动备份。",
        "5. ERP：担任 Mango ERP 系统管理员，配置工作流审批权限 (PR/PO/WO)。",
        "6. 开发：开发4套企业内研 Web 系统（故障工单、KPI 看板、打印成本分析、软件授权到期提醒）。"
      ],
      accomplishments: [
        "优化正版授权和虚拟化平台迁移（VMware 至 Nutanix），每年为公司降本超 117 万泰铢。",
        "从零开始独立规划并部署新总部大楼的网络与 IT 基础设施。"
      ]
    },
    {
      company: "ITK-Connecting Co., Ltd. (网络系统集成商)",
      role: "网络技术支持工程师 (IT Network Support)",
      location: "曼谷",
      start_date: "2021年10月",
      end_date: "2023年2月",
      responsibilities: [
        "为客户设计并实施网络、活动目录、Fortigate 防火墙及 Cisco/Aruba 交换机等基础设施项目。",
        "绘制系统方案拓扑图并编写售前技术方案及报价单。"
      ],
      accomplishments: [
        "成功实施并交付 10 多个客户网络工程项目，项目价值最高达 80 万泰铢。"
      ]
    },
    {
      company: "Professional Laboratories Management Corp (临床检测上市公司)",
      role: "IT 支持工程师 (IT Support)",
      location: "曼谷",
      start_date: "2020年5月",
      end_date: "2021年10月",
      responsibilities: [
        "通过活动目录管理用户权限和组策略，保障 HIS-LIS (SQL Symphony) 系统的稳定可用性。",
        "运维云端端点防护系统 (ESET Cloud) 及分支机构间 Fortigate VPN 专线。"
      ],
      accomplishments: [
        "主导将 HIS 实验室核心数据库顺利迁移至云服务器，保障零数据丢失。"
      ]
    },
    {
      company: "Nanmee Industry Co., Ltd. (南美文具制造集团)",
      role: "IT 支持专员 (IT Support)",
      location: "沙没巴干",
      start_date: "2019年3月",
      end_date: "2020年4月",
      responsibilities: [
        "日常维护工厂硬件、软件、网络设备以及 Oracle ERP 系统运行。",
        "规划并部署工厂和仓库区域的 IP 监控摄像头系统，铺设光纤网络（Fiber Optic）传输。"
      ],
      accomplishments: [
        "成功布线并连接 150 多个监控摄像头，实现全厂监控实时高清互联。"
      ]
    },
    {
      company: "Banleong Chin Inter Co., Ltd. (电脑外设分销商)",
      role: "IT 支持专员 (IT Support)",
      location: "曼谷",
      start_date: "2017年3月",
      end_date: "2019年2月",
      responsibilities: [
        "为公司 100 多台员工电脑和外设提供故障排除、系统重装和维护支持。",
        "通过 Active Directory 分配共享文件夹的读取与写入权限，并执行数据备份。"
      ],
      accomplishments: [
        "显著降低公司办公设备故障率，降低外部送修维护费用。"
      ]
    }
  ]
};

const mockSkills: { [key: string]: any[] } = {
  th: [
    { category: "IT Infrastructure (หลัก)", name: "Fortigate / Sophos / Zyxel", proficiency: "Advanced" },
    { category: "IT Infrastructure (หลัก)", name: "Switch L3,L2 Cisco / Aruba / HP", proficiency: "Advanced" },
    { category: "IT Infrastructure (หลัก)", name: "TP-Link Omada", proficiency: "Advanced" },
    { category: "IT Infrastructure (หลัก)", name: "Active Directory / GPO", proficiency: "Advanced" },
    { category: "IT Infrastructure (หลัก)", name: "Microsoft 365 SharePoint", proficiency: "Advanced" },
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
    { category: "IT Infrastructure (Primary)", name: "Switch L3,L2 Cisco / Aruba / HP", proficiency: "Advanced" },
    { category: "IT Infrastructure (Primary)", name: "TP-Link Omada", proficiency: "Advanced" },
    { category: "IT Infrastructure (Primary)", name: "Active Directory / GPO", proficiency: "Advanced" },
    { category: "IT Infrastructure (Primary)", name: "Microsoft 365 SharePoint", proficiency: "Advanced" },
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
    { category: "IT 基础设施 (核心)", name: "Switch L3,L2 Cisco / Aruba / HP 交换机", proficiency: "精通 (Advanced)" },
    { category: "IT 基础设施 (核心)", name: "TP-Link Omada 智能网络", proficiency: "精通 (Advanced)" },
    { category: "IT 基础设施 (核心)", name: "活动目录 (Active Directory) / 组策略 (GPO)", proficiency: "精通 (Advanced)" },
    { category: "IT 基础设施 (核心)", name: "Microsoft 365 SharePoint 办公套件", proficiency: "精通 (Advanced)" },
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

const mockProjects = {
  th: [
    { title: "MEC CALIBRATION SYSTEM", description: "ระบบบันทึกประวัติและสอบเทียบเครื่องมือวัดของไซต์งานก่อสร้างทั้ง 17 แห่ง ใช้ตรวจสอบค่าใช้จ่าย ส่งออกเอกสาร PDF และทำเรื่องขอโอนย้ายอุปกรณ์ข้ามไซต์งานโดยมี Super Admin เป็นผู้อนุมัติ" },
    { title: "IT PROJECT DASHBOARD", description: "ระบบติดตามแผนงานและงบประมาณไอทีรายปี (Capex & Opex) ในรูปแบบ Gantt Chart พร้อมใช้เป็นระบบวัดผลงาน (KPI) ของเจ้าหน้าที่ไอทีในทีม" },
    { title: "IN-HOUSE HELP DESK", description: "ระบบแจ้งซ่อมคอมพิวเตอร์และช่วยเหลือปัญหาไอทีของพนักงาน 160 คน พร้อมระบบส่งแจ้งเตือนผ่าน LINE และอีเมลอัตโนมัติ" },
    { title: "PRINT COST DASHBOARD", description: "ระบบวิเคราะห์และสรุปยอดค่าใช้จ่ายการพิมพ์เอกสารแยกตามแผนก ช่วยควบคุมและลดค่าใช้จ่ายไอที (Opex) ขององค์กร" },
    { title: "LICENSE TRACKER", description: "ระบบบริหารและจัดสรรสิทธิ์โปรแกรมลิขสิทธิ์ของบริษัท (เช่น M365, AutoCAD, ZwCAD) ช่วยประหยัดค่าใช้จ่ายได้กว่า 1.12 ล้านบาทต่อปี" },
    { title: "MEC PROJECT COST DASHBOARD", description: "แดชบอร์ดสรุปค่าใช้จ่ายโครงการก่อสร้างทั้ง 17 ไซต์งานแบบ Real-time เพื่อให้ผู้บริหารตรวจสอบสถานะการเงินและควบคุมงบประมาณของแต่ละโครงการได้ทันที" }
  ],
  en: [
    { title: "MEC CALIBRATION SYSTEM", description: "Calibration tracking system for 17 construction sites, allowing users to log records, check costs, export PDFs, and transfer equipment with Super Admin approval." },
    { title: "IT PROJECT DASHBOARD", description: "Annual IT project and budget planner (Capex & Opex) rendered in a Gantt chart, featuring performance reviews (KPIs) for IT team members." },
    { title: "IN-HOUSE HELP DESK", description: "IT support and ticketing system assisting 160 users, with automated notifications sent via LINE and email." },
    { title: "PRINT COST DASHBOARD", description: "Print cost analysis tool tracking printer expenses by department, helping control and reduce IT operating expenses (Opex)." },
    { title: "LICENSE TRACKER", description: "Corporate software license manager (e.g., M365, AutoCAD, ZwCAD), helping save over 1.12 million Baht/year." },
    { title: "MEC PROJECT COST DASHBOARD", description: "Real-time dashboard summarizing expenses across 17 construction sites, helping management monitor budgets and control project costs instantly." }
  ],
  zh: [
    { title: "MEC 仪器校验与管理系统", description: "17个工地的仪器校验管理系统，支持校验记录登记、成本核算、PDF导出以及经超级管理员审批的设备跨工地调拨。" },
    { title: "IT 项目管理看板", description: "甘特图形式的年度IT项目与预算规划系统（Capex & Opex），并包含IT团队成员的绩效考核（KPI）功能。" },
    { title: "企业内部 IT 工单系统", description: "服务于160名员工的IT故障报修系统，支持通过LINE和电子邮件自动发送派单与进度通知。" },
    { title: "打印成本分析看板", description: "按部门统计和分析打印费用的工具，帮助企业监控和降低IT运营成本（Opex）。" },
    { title: "软件授权跟踪系统", description: "公司正版软件授权（如 M365、AutoCAD、ZwCAD）管理系统，每年为公司节省超112万泰铢。" },
    { title: "MEC PROJECT COST DASHBOARD", description: "17个工地的实时项目成本看板，方便管理层随时查看财务状况并即时控制各项目预算。" }
  ]
};

const mockCertifications = {
  th: [
    { name: "Fortinet Certified Associate (NSE 3)", issuer: "Fortinet Training Institute", date: "2568" },
    { name: "Fortinet Certified Associate (NSE 2)", issuer: "Fortinet Training Institute", date: "2568" },
    { name: "Fortinet Certified Associate (NSE 1)", issuer: "Fortinet Training Institute", date: "2568" },
    { name: "Cisco Certified Network Associate (CCNA)", issuer: "Cisco / Jodoi", date: "2567" },
    { name: "Configuring & Troubleshooting AD (AD001)", issuer: "elife systems", date: "2566" },
    { name: "Advanced Troubleshooting AD (AD002)", issuer: "elife systems", date: "2566" },
    { name: "Python 1: Programming & Networking", issuer: "Cisco Academy", date: "2566" },
    { name: "Python 2: Advanced Programming", issuer: "Cisco Academy", date: "2566" }
  ],
  en: [
    { name: "Fortinet Certified Associate (NSE 3)", issuer: "Fortinet Training Institute", date: "2025" },
    { name: "Fortinet Certified Associate (NSE 2)", issuer: "Fortinet Training Institute", date: "2025" },
    { name: "Fortinet Certified Associate (NSE 1)", issuer: "Fortinet Training Institute", date: "2025" },
    { name: "Cisco Certified Network Associate (CCNA)", issuer: "Cisco / Jodoi", date: "2024" },
    { name: "Configuring & Troubleshooting AD (AD001)", issuer: "elife systems", date: "2023" },
    { name: "Advanced Troubleshooting AD (AD002)", issuer: "elife systems", date: "2023" },
    { name: "Python 1: Programming & Networking", issuer: "Cisco Academy", date: "2023" },
    { name: "Python 2: Advanced Programming", issuer: "Cisco Academy", date: "2023" }
  ],
  zh: [
    { name: "飞塔认证助理工程师 (NSE 3)", issuer: "Fortinet Training Institute", date: "2025年" },
    { name: "飞塔认证助理工程师 (NSE 2)", issuer: "Fortinet Training Institute", date: "2025年" },
    { name: "飞塔认证助理工程师 (NSE 1)", issuer: "Fortinet Training Institute", date: "2025年" },
    { name: "思科认证网络工程师 (CCNA)", issuer: "Cisco / Jodoi", date: "2024年" },
    { name: "域服务 Active Directory 配置与排错 (AD001)", issuer: "elife systems", date: "2023年" },
    { name: "域服务 Active Directory 高级排错 (AD002)", issuer: "elife systems", date: "2023年" },
    { name: "Python 1: 编程与网络基础", issuer: "Cisco Academy", date: "2023年" },
    { name: "Python 2: 高级 Python 编程", issuer: "Cisco Academy", date: "2023年" }
  ]
};

const translations = {
  th: {
    personalInfo: "ข้อมูลติดต่อ",
    experience: "ประวัติการทำงาน",
    skills: "ทักษะความสามารถ",
    projects: "ผลงานพัฒนาแอปพลิเคชัน",
    certifications: "ใบรับรองและคุณวุฒิ",
    accomplishmentTitle: "ผลงานเด่น",
    preparingPrint: "กำลังจัดเตรียมหน้าสำหรับพิมพ์ PDF..."
  },
  en: {
    personalInfo: "Contact Information",
    experience: "Work Experience",
    skills: "Professional Skills",
    projects: "Projects & Applications",
    certifications: "Certifications",
    accomplishmentTitle: "Key Accomplishments",
    preparingPrint: "Preparing layout for PDF printing..."
  },
  zh: {
    personalInfo: "联系方式",
    experience: "工作经历",
    skills: "专业技能",
    projects: "项目经验",
    certifications: "资质证书",
    accomplishmentTitle: "核心业绩",
    preparingPrint: "正在生成 PDF 打印布局..."
  }
};

function PrintPageContent() {
  const searchParams = useSearchParams();
  const rawLang = searchParams.get("lang") || "th";
  const language = (rawLang === "en" || rawLang === "zh") ? rawLang : "th";

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(mockProfile[language]);
  const [experiences, setExperiences] = useState<any>(mockExperiences[language]);
  const [skills, setSkills] = useState<any>(mockSkills[language]);
  const [projects, setProjects] = useState<any>(mockProjects[language]);
  const [certifications, setCertifications] = useState<any>(mockCertifications[language]);

  const t = translations[language];

  useEffect(() => {
    async function loadData() {
      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                            process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id") ||
                            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your-anon-key-here");

      if (isPlaceholder) {
        setLoading(false);
        // Automatically trigger print after elements render
        setTimeout(() => {
          window.print();
        }, 1000);
        return;
      }

      try {
        // Fetch Profile
        const { data: profData } = await supabase.from("profiles").select("*").maybeSingle();
        if (profData) {
          setProfile({
            ...mockProfile[language],
            ...profData,
            bio: language === "th" ? (profData.bio || mockProfile.th.bio) : mockProfile[language].bio
          });
        }

        // Fetch Experiences
        const { data: expData } = await supabase.from("experiences").select("*").order("order_index", { ascending: true });
        if (expData && expData.length > 0) {
          // If language is th, use DB. Otherwise fallback to mock translation
          if (language === "th") {
            setExperiences(expData);
          }
        }

        // Fetch Skills
        const { data: skillData } = await supabase.from("skills").select("*").order("order_index", { ascending: true });
        if (skillData && skillData.length > 0) {
          if (language === "th") {
            setSkills(skillData);
          }
        }

        // Fetch Certifications
        const { data: certData } = await supabase.from("certifications").select("*").order("order_index", { ascending: true });
        if (certData && certData.length > 0) {
          if (language === "th") {
            setCertifications(certData);
          }
        }

        // Fetch Projects
        const { data: projData } = await supabase.from("projects").select("*").order("order_index", { ascending: true });
        if (projData && projData.length > 0) {
          // If DB projects are array, map them to EN/ZH local translation
          if (language === "th") {
            setProjects(projData);
          } else {
            const mapped = projData.map((p: any, idx: number) => {
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
            setProjects(mapped);
          }
        }
      } catch (err) {
        console.error("Error loading print data from Supabase, using mock fallback:", err);
      } finally {
        setLoading(false);
        // Automatically trigger print after elements render
        setTimeout(() => {
          window.print();
        }, 1000);
      }
    }
    loadData();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-800 font-sans p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-semibold text-lg text-slate-600">{t.preparingPrint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="print-container font-sans text-slate-900 bg-white leading-relaxed antialiased">
      {/* Stylesheet specifically designed for premium A4 printing */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;850&family=Sarabun:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', 'Sarabun', sans-serif !important;
          background: #ffffff !important;
          color: #0f172a !important;
          font-size: 11px !important;
          line-height: 1.4 !important;
          margin: 0 !important;
          padding: 0 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        @page {
          size: A4 portrait;
          margin: 0;
        }

        .print-page {
          width: 210mm;
          height: 297mm;
          padding: 15mm 15mm;
          box-sizing: border-box;
          page-break-after: always;
          position: relative;
          overflow: hidden;
          background: #ffffff;
        }

        /* Prevent page breaks inside logical units */
        .avoid-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        /* Force page structure on screens for easy preview */
        @media screen {
          body {
            background: #e2e8f0 !important;
            padding: 20px 0;
          }
          .print-page {
            margin: 10px auto;
            box-shadow: 0 4px 15px rgba(15, 23, 42, 0.1);
          }
        }
      `}</style>

      {/* ================= PAGE 1 ================= */}
      <section className="print-page flex flex-col justify-between">
        <div>
          {/* Header Area */}
          <div className="border-b-2 border-blue-600 pb-3 flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-wide text-slate-900 font-heading uppercase leading-none">
                {profile.name}
              </h1>
              <p className="text-xs font-bold text-blue-600 uppercase font-heading">
                {profile.title}
              </p>
            </div>
            
            {/* Contact Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9.5px] text-slate-700 font-medium">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-blue-600 shrink-0" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-blue-600 shrink-0" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                <span>{profile.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-blue-600 shrink-0" />
                <span>Line: {profile.line_id}</span>
              </div>
            </div>
          </div>

          {/* Profile Bio / Summary */}
          <div className="mt-4">
            <p className="text-slate-700 text-left text-[10px] leading-relaxed font-medium whitespace-pre-line">
              {profile.bio}
            </p>
          </div>

          {/* Core Skills section */}
          <div className="mt-5">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-2 mb-2 font-heading">
              <Code2 className="w-4 h-4 text-blue-600" />
              {t.skills}
            </h2>
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              {/* Left column: Infrastructure */}
              <div className="space-y-1">
                <h3 className="font-bold text-blue-600 text-[10px] uppercase font-heading">Infrastructure & Network</h3>
                <div className="flex flex-wrap gap-1">
                  {skills.filter((s: any) => s.category?.toLowerCase().includes("net") || s.category?.toLowerCase().includes("infra")).map((s: any, idx: number) => (
                    <span key={idx} className="bg-slate-100/80 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[9px] font-bold">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Right column: Servers & Dev */}
              <div className="space-y-1">
                <h3 className="font-bold text-indigo-600 text-[10px] uppercase font-heading">Server & Software Development</h3>
                <div className="flex flex-wrap gap-1">
                  {skills.filter((s: any) => s.category?.toLowerCase().includes("server") || s.category?.toLowerCase().includes("dev") || s.category?.toLowerCase().includes("cloud")).map((s: any, idx: number) => (
                    <span key={idx} className="bg-slate-100/80 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[9px] font-bold">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Experience Part 1 (Most Recent: S.MEC Engineering & ITK-Connecting) */}
          <div className="mt-5">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-2 mb-2 font-heading">
              <Briefcase className="w-4 h-4 text-blue-600" />
              {t.experience}
            </h2>
            
            <div className="space-y-4">
              {/* S.MEC Engineering */}
              {experiences[0] && (
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-extrabold text-[11px] text-slate-900 font-heading uppercase">
                      {experiences[0].company}
                    </h3>
                    <span className="text-[9.5px] font-bold text-slate-500 font-heading">
                      {experiences[0].start_date} - {experiences[0].end_date}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-blue-600">
                    <span>{experiences[0].role}</span>
                    <span className="text-slate-500 font-medium">{experiences[0].location}</span>
                  </div>
                  <ul className="space-y-0.5 leading-relaxed font-medium text-[9.5px] text-slate-700">
                    {experiences[0].responsibilities.map((r: string, rIdx: number) => {
                      const isHeader = /^\s*\d+\.\s+/.test(r);
                      const cleanedText = r.replace(/^\s*[•\-\*]\s*/, '').trim();
                      if (isHeader) {
                        return (
                          <li key={rIdx} className="list-none font-bold text-slate-900 mt-1.5 first:mt-0 text-[9.5px]">
                            {cleanedText}
                          </li>
                        );
                      }
                      return (
                        <li key={rIdx} className="list-disc list-outside pl-0.5 ml-3.5">
                          {cleanedText}
                        </li>
                      );
                    })}
                  </ul>
                  {experiences[0].accomplishments && experiences[0].accomplishments.length > 0 && (
                    <div className="mt-1 bg-slate-50/70 border border-slate-200/80 p-2 rounded-xl">
                      <span className="font-bold text-[9px] text-emerald-650 uppercase tracking-wider block mb-0.5">{t.accomplishmentTitle}</span>
                      <ul className="list-disc list-outside pl-4 text-[9px] text-slate-600 space-y-0.5 leading-normal font-semibold">
                        {experiences[0].accomplishments.map((ac: string, acIdx: number) => (
                          <li key={acIdx}>{ac}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* ITK-Connecting */}
              {experiences[1] && (
                <div className="space-y-1 avoid-break">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-extrabold text-[11px] text-slate-900 font-heading uppercase">
                      {experiences[1].company}
                    </h3>
                    <span className="text-[9.5px] font-bold text-slate-500 font-heading">
                      {experiences[1].start_date} - {experiences[1].end_date}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-blue-600">
                    <span>{experiences[1].role}</span>
                    <span className="text-slate-500 font-medium">{experiences[1].location}</span>
                  </div>
                  <ul className="space-y-0.5 leading-relaxed font-medium text-[9.5px] text-slate-700">
                    {experiences[1].responsibilities.map((r: string, rIdx: number) => {
                      const isHeader = /^\s*\d+\.\s+/.test(r);
                      const cleanedText = r.replace(/^\s*[•\-\*]\s*/, '').trim();
                      if (isHeader) {
                        return (
                          <li key={rIdx} className="list-none font-bold text-slate-900 mt-1.5 first:mt-0 text-[9.5px]">
                            {cleanedText}
                          </li>
                        );
                      }
                      return (
                        <li key={rIdx} className="list-disc list-outside pl-0.5 ml-3.5">
                          {cleanedText}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info page 1 */}
        <div className="text-center text-[8.5px] text-slate-450 border-t border-slate-100 pt-1 font-heading">
          Page 1 of 2
        </div>
      </section>

      {/* ================= PAGE 2 ================= */}
      <section className="print-page flex flex-col justify-between">
        <div>
          {/* Experience Part 2 (Older roles: PLMC, Nanmee, Banleong) */}
          <div className="space-y-3.5">
            {experiences.slice(2).map((exp: any, idx: number) => (
              <div key={idx} className="space-y-1 avoid-break">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-extrabold text-[10.5px] text-slate-900 font-heading uppercase">
                    {exp.company}
                  </h3>
                  <span className="text-[9.5px] font-bold text-slate-500 font-heading">
                    {exp.start_date} - {exp.end_date}
                  </span>
                </div>
                <div className="flex justify-between text-[9.5px] font-bold text-blue-600">
                  <span>{exp.role}</span>
                  <span className="text-slate-500 font-medium">{exp.location}</span>
                </div>
                <ul className="space-y-0.5 leading-relaxed font-medium text-[9.5px] text-slate-700">
                  {exp.responsibilities.map((r: string, rIdx: number) => {
                    const isHeader = /^\s*\d+\.\s+/.test(r);
                    const cleanedText = r.replace(/^\s*[•\-\*]\s*/, '').trim();
                    if (isHeader) {
                      return (
                        <li key={rIdx} className="list-none font-bold text-slate-900 mt-1.5 first:mt-0 text-[9.5px]">
                          {cleanedText}
                        </li>
                      );
                    }
                    return (
                      <li key={rIdx} className="list-disc list-outside pl-0.5 ml-3.5">
                        {cleanedText}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects & Web Applications Section */}
          <div className="mt-5 avoid-break">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-2 mb-2 font-heading">
              <Layers className="w-4 h-4 text-blue-600" />
              {t.projects}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {projects.map((proj: any, idx: number) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-200/80 p-2 rounded-xl space-y-0.5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[9.5px] text-slate-950 uppercase font-heading">{proj.title}</h3>
                    <p className="text-[8.5px] text-slate-600 leading-relaxed font-medium mt-0.5">{proj.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="mt-5 avoid-break">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-2 mb-2 font-heading">
              <Award className="w-4 h-4 text-blue-600" />
              {t.certifications}
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[9.5px]">
              {certifications.map((cert: any, idx: number) => (
                <div key={idx} className="flex justify-between items-baseline font-medium">
                  <span className="text-slate-800 font-semibold">{cert.name}</span>
                  <span className="text-slate-450 font-bold shrink-0 font-heading">({cert.issuer} - {cert.date})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info page 2 */}
        <div className="text-center text-[8.5px] text-slate-450 border-t border-slate-100 pt-1 font-heading">
          Page 2 of 2
        </div>
      </section>
    </div>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-800 font-sans p-6">
        <p className="font-semibold text-lg">Loading print component...</p>
      </div>
    }>
      <PrintPageContent />
    </Suspense>
  );
}
