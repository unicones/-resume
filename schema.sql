-- SQL Schema for Web Resume & Admin Panel

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    resume_url TEXT,
    email TEXT,
    phone TEXT,
    line_id TEXT,
    github TEXT,
    linkedin TEXT,
    address TEXT,
    birthdate DATE,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT,
    start_date TEXT NOT NULL, -- e.g., "พฤศจิกายน 2566" หรือ "Nov 2023"
    end_date TEXT NOT NULL,   -- e.g., "ปัจจุบัน" หรือ "Feb 2023"
    responsibilities TEXT[] DEFAULT '{}'::TEXT[],
    accomplishments TEXT[] DEFAULT '{}'::TEXT[],
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    link TEXT,
    github_link TEXT,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    is_featured BOOLEAN DEFAULT false,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL, -- e.g., "Network & Infrastructure", "Server & Cloud", "Software & Dev", "Languages"
    name TEXT NOT NULL,
    proficiency TEXT,      -- e.g., "Advanced", "Intermediate", "Beginner"
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,   -- e.g., "Fortinet", "Cisco", "Microsoft"
    date TEXT,              -- e.g., "พ.ค. 2569" หรือ "May 2023"
    image_url TEXT,
    pdf_url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Allow anyone to read the data
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access on certifications" ON public.certifications FOR SELECT USING (true);

-- Allow authenticated users (Admin) to manage everything (Insert, Update, Delete)
CREATE POLICY "Allow authenticated users to manage profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert Initial Mock Data from PDF
INSERT INTO public.profiles (name, title, bio, email, phone, line_id, address, birthdate)
VALUES (
    'ปฏิวัติ มีแก้ว (Patiwat Meekaeo)',
    'ผู้จัดการแผนกไอที (IT Manager & Infrastructure)',
    'ผู้เชี่ยวชาญด้านระบบโครงสร้างพื้นฐานไอที (IT Infrastructure & Network Engineer) ที่มีทักษะในการพัฒนาซอฟต์แวร์ (SQL, JavaScript, Python, PHP) ประสบการณ์กว่า 9 ปีในการบริหารจัดการระบบคอมพิวเตอร์และเครือข่ายในองค์กร ปัจจุบันดูแลระบบไอทีสำหรับผู้ใช้งานกว่า 160 คน ควบคุมดูแลระบบความปลอดภัยผ่าน Fortigate 100F และ Multi-WAN load-balancing มุ่งเน้นการใช้ทักษะทางโปรแกรมมิ่งเพื่อสร้าง In-House Web Applications ช่วยเพิ่มประสิทธิภาพการทำงานและลดต้นทุนด้านไอที (IT cost reduction) พร้อมเติบโตไปกับองค์กรอย่างมั่นคง',
    'patiwatmeekaeo@gmail.com',
    '081-601-9666',
    'allfile',
    'กรุงเทพมหานคร, ประเทศไทย',
    '1983-01-11'
);

-- Insert Experience Data
INSERT INTO public.experiences (company, role, location, start_date, end_date, responsibilities, accomplishments, order_index)
VALUES 
(
    'บริษัท เอส.เอ็มอีซีซี เอ็นจิเนียริ่ง จำกัด',
    'รักษาการผู้จัดการฝ่ายไอที (Acting IT Manager)',
    'กรุงเทพมหานคร',
    'พฤศจิกายน 2566',
    'ปัจจุบัน',
    ARRAY[
        '1. การวางแผนและบริหารแผนก IT',
        '  • วางแผนงบประมาณ IT ประจำปี (Capex & Opex)',
        '  • บริหารทีม IT Support ดูแลพนักงาน 160 คน',
        '  • เจรจาต่อรองกับ Vendor เปรียบเทียบราคาและสเปกเพื่อเลือกสิ่งที่คุ้มค่าที่สุด',
        '  • ดูแลระบบ IT ให้ผ่านการตรวจ ISO 9001:2015 ทุกปี',
        '2. ระบบเครือข่ายและโครงสร้างพื้นฐาน',
        '  • ติดตั้งระบบเครือข่ายสำนักงานใหญ่ตั้งแต่ศูนย์ ครอบคลุม TP-Link Omada (Router, OC200 Controller, Switch, WiFi AP) พร้อม VLAN Segmentation',
        '  • วางระบบ Dual ISP (AIS + TOT) แบบ Load Balancing และ WAN Failover ให้บริการได้ต่อเนื่อง 99%',
        '  • บริหาร Omada ตั้งค่า VLAN, Inter-VLAN Routing, SSID แยกตามประเภทผู้ใช้, QoS และ Port Trunk/Access',
        '  • Monitor Network ผ่าน Omada Controller ติดตาม Bandwidth, Client และ Uptime แบบ Real-time',
        '  • บริหาร Active Directory 2 Server แบบ Replication รองรับ High Availability พร้อมจัดโครงสร้าง OU, GPO, DNS, DHCP และ File Share Permission',
        '3. Security & Endpoint',
        '  • Config Fortigate 100F ครอบคลุม Firewall Policy, SSL VPN, IPSec VPN, NAT, IPS และ Web Filtering',
        '  • Monitor Traffic และ Threat ผ่าน Fortigate พร้อมตรวจสอบ Security Log, Traffic Log และ VPN Log อย่างสม่ำเสมอ',
        '  • ดูแลอุปกรณ์ปลายทาง 163 เครื่อง (Notebook 158 + PC 5 เครื่อง)',
        '  • ติดตั้งกล้อง CCTV และระบบสแกนลายนิ้วมือเชื่อมต่อ Cloud ที่ Project Site',
        '  • สำรองข้อมูลผ่าน NAS แบบรายวัน/รายสัปดาห์ พร้อมแผน Disaster Recovery',
        '4. Server & Cloud',
        '  • ดูแลระบบ Cloud Server: Humano HR (Inet Cloud)',
        '  • จัดการ Microsoft 365 ครอบคลุมผู้ใช้, Exchange, Teams และการตั้งค่า MFA',
        '  • ดูแล License ซอฟต์แวร์ที่ใช้งานในองค์กร ได้แก่ M365, AutoCAD, Revit, BIM และ SketchUp',
        '5. พัฒนาเว็บแอปพลิเคชันภายในองค์กร',
        '  • ระบบ Help Desk Ticketing — ลดเวลาแก้ปัญหาได้ 98%',
        '  • IT Project Dashboard — ติดตามงาน วัด KPI และบริหารงบประมาณของทีม IT',
        '  • Print Cost Dashboard วิเคราะห์ต้นทุนการพิมพ์แยกตามโครงการ',
        '  • ระบบทะเบียน Software License — แจ้งเตือนผ่าน Line และ Email เมื่อใกล้ถึงรอบต่ออายุ',
        '6. ERP และฐานข้อมูล',
        '  • บริหาร Mango ERP (UIH Cloud) ครอบคลุมการจัดการผู้ใช้ กำหนดสิทธิ์การเข้าถึง Module ตามนโยบายบริษัท ตั้งค่า Workflow (PR/PO/WO) และฝึกอบรมพนักงาน',
        '  • บริหารจัดการ SQL Server ครอบคลุม User Management, Backup/Restore, Basic Indexing, Error Log และคำสั่งพื้นฐาน SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY และ SUM',
        '7. การบริหารทีม',
        '  • มอบหมายงาน ติดตามความคืบหน้า และให้คำแนะนำสมาชิกในทีม',
        '  • กำหนด SLA และ KPI สำหรับการให้บริการด้าน IT',
        '  • ประเมินผลการทำงานและพัฒนาศักยภาพทีม IT อย่างต่อเนื่อง',
        '  • จัดทำ IT Policy และ Procedure ให้สอดคล้องกับมาตรฐาน ISO 9001:2015',
        '  • จัดอบรม IT ให้พนักงานในองค์กร ทั้งการใช้งานระบบและความปลอดภัยทางไซเบอร์',
        '  • สรุปผลการดำเนินงาน IT รายงานต่อผู้บริหารเป็นประจำ'
    ]::TEXT[],
    ARRAY[
        'ลดต้นทุน IT ขององค์กรลงกว่า 1.17 ล้านบาท/ปี (รวมประหยัดได้ 1,178,500 บาท/ปี) จากการปรับปรุงสัญญาและสิทธิ์ซอฟต์แวร์',
        'ลดค่า License CAD ลง 81% (ประหยัด ~770,000 บาท/ปี) จากการเปลี่ยนผ่านจาก AutoCAD ไปใช้ ZwCAD (70 License)',
        'ลดต้นทุนระบบ Server Virtualization ลง 52% (ประหยัด ~132,000 บาท/ปี) โดยย้ายแพลตฟอร์มจาก VMware ไป Nutanix',
        'ย้าย Cloud Server ของ Humano HR ลดค่าบริการรายเดือนลง 54% (ประหยัด ~124,000 บาท/ปี) และสเปคสตรีมมิ่งเซิร์ฟเวอร์ดีขึ้น',
        'ปรับการจัดสรร Mix License Microsoft 365 (160 User) ให้สอดคล้องกับพฤติกรรมการใช้งานจริง ประหยัดงบ ~100,000 บาท/ปี',
        'เปลี่ยนผู้ให้บริการ Antivirus จาก Comodo ไปเป็น Bitdefender (150 License) ประหยัดค่าใช้จ่ายลง 32% (ประหยัด ~52,500 บาท/ปี)',
        'ออกแบบ ติดตั้ง และส่งมอบระบบเครือข่ายและ IT Infrastructure สำหรับสำนักงานใหญ่แห่งใหม่ (HQ Bangbon 5) สำเร็จลุล่วงแบบ End-to-End',
        'บริหารจัดการโครงการย้ายระบบ Mango ERP สำเร็จใน 2 เดือน ช่วยแก้ปัญหา Bandwidth และระบบเสถียร 100% หลัง Go-Live',
        'พัฒนาเว็บแอปพลิเคชันใช้งานในองค์กรเอง 4 ระบบ ช่วยเพิ่มประสิทธิภาพและลดเวลาการแก้ไขปัญหาของ IT Support ลง 98%',
        'ติดตั้งระบบ IP Phone ด้วยตนเอง (2 lines / 10 extensions)'
    ]::TEXT[],
    1
),
(
    'บริษัท ไอทีเทค-คอนเนคติ้ง จำกัด (ITK-Connecting Co., Ltd.)',
    'วิศวกรสนับสนุนระบบเครือข่ายไอที (IT Network Support)',
    'กรุงเทพมหานคร',
    'ตุลาคม 2564',
    'กุมภาพันธ์ 2566',
    ARRAY[
        'วิเคราะห์ความต้องการของลูกค้า ออกแบบและนำเสนอโซลูชันระบบไอที (Network, Server, Storage, Security, Cloud)',
        'เขียน Network Solution Diagram และจัดทำเอกสารเสนอราคาเชิงเทคนิคเพื่อสนับสนุนงานขาย',
        'ติดตั้งและตั้งค่าระบบเซิร์ฟเวอร์ Active Directory (ติดตั้ง Server AD, โครงสร้าง OU/Policy), อุปกรณ์เครือข่าย และระบบสำรองข้อมูล (Firewall, L3/L2 Switch, Router, NAS Backup)',
        'ทดสอบการทำงานของระบบแบบบูรณาการ (Integration Test) และแก้ไขปัญหาเทคนิคก่อนส่งมอบงานแก่ลูกค้า',
        'ดูแลระบบหลังการขายและตรวจสุขภาพเครือข่ายประจำเดือน (Network Health Check) ตามสัญญาบริการบำรุงรักษา (MA)'
    ]::TEXT[],
    ARRAY[
        'ออกแบบและติดตั้งระบบเครือข่าย (Network Infrastructure) ให้ลูกค้ามากกว่า 10 โครงการ มูลค่างานสูงสุดกว่า 800,000 บาท',
        'ออกแบบและเชื่อมต่อระบบ VPN Site-to-Site ระหว่างสำนักงานใหญ่และสาขา of ลูกค้าเพื่อการสื่อสารที่ปลอดภัย',
        'ช่วยเหลือทีมขายในการทำ Solution Diagram และอธิบายด้านเทคนิค ช่วยปิดการขายโครงการได้สำเร็จ'
    ]::TEXT[],
    2
),
(
    'บริษัท โปรเฟสชันแนล ลาบอราทอรี่ แมนเนจเม้นท์ คอร์ป จำกัด (มหาชน)',
    'เจ้าหน้าที่สนับสนุนฝ่ายไอที (IT Support)',
    'กรุงเทพมหานคร',
    'พฤษภาคม 2563',
    'ตุลาคม 2564',
    ARRAY[
        'บริหารสิทธิ์การใช้งาน บัญชีผู้ใช้ และ GPO ผ่าน Active Directory',
        'ดูแลระบบ HIS-LIS (SQL Symphony) ให้ทำงานได้อย่างต่อเนื่อง 24 ชั่วโมง',
        'จัดการความปลอดภัยปลายทางผ่านคลาวด์ (ESET NOD32) และบัญชีอีเมล Google G-Suite',
        'ติดตั้งและดูแลอุปกรณ์ไอที ได้แก่ Windows Server, Switches, Biometric, CCTV และ NAS Backup',
        'จัดทำและดูแลทะเบียนทรัพย์สินไอที (IT Asset Management) พร้อมตรวจสอบสถานะการทำงานอย่างสม่ำเสมอ',
        'วางแผนและตรวจสอบบำรุงรักษาเชิงป้องกัน (Preventive Maintenance) ประจำปีของระบบเซิร์ฟเวอร์',
        'ร่วมทีมย้ายระบบฐานข้อมูล HIS จากเซิร์ฟเวอร์ในองค์กร (On-Premise) ขึ้นสู่ระบบคลาวด์ (Cloud Infrastructure)'
    ]::TEXT[],
    ARRAY[
        'ย้ายฐานข้อมูล HIS ขึ้นคลาวด์ได้สำเร็จ 100% ไม่มีข้อมูลสูญหาย พร้อมระบบสำรองและทดสอบกู้คืนครบถ้วน ช่วยลดภาระการบำรุงรักษาเซิร์ฟเวอร์แบบกายภาพ',
        'รับหน้าที่รักษาการผู้จัดการฝ่าย IT บริหารโครงการติดตั้งระบบ IT โครงสร้างพื้นฐานแบบครบวงจรให้สาขาใหม่ภายใน 1 เดือน ภายใต้งบประมาณ 2,700,000 บาท (Server HA, Storage, Backup, LIS) ได้สำเร็จตามเป้าหมาย'
    ]::TEXT[],
    3
),
(
    'บริษัท นานมีอุตสาหกรรม จำกัด (Nanmee Industry Co., Ltd.)',
    'เจ้าหน้าที่สนับสนุนไอที (IT Support)',
    'กรุงเทพมหานคร',
    'มีนาคม 2562',
    'เมษายน 2563',
    ARRAY[
        'ควบคุมดูแลความเสถียรของเซิร์ฟเวอร์หลัก บริหารจัดการบัญชีผู้ใช้งาน และกำหนดนโยบาย GPO ผ่าน Active Directory',
        'สนับสนุนและแก้ไขปัญหาด้านฮาร์ดแวร์ ซอฟต์แวร์ ระบบเครือข่าย อีเมล และระบบ ERP (Oracle) สำหรับพนักงานภายในองค์กร',
        'บริหารจัดการระบบสำรองข้อมูลส่วนกลาง (Data Backup) ให้สอดคล้องกับนโยบายความมั่นคงปลอดภัยสารสนเทศ',
        'ออกแบบและวางระบบกล้องวงจรปิด (IP CCTV) พร้อมติดตั้งโครงข่ายเชื่อมโยงด้วยสัญญาณ Fiber Optic ทั่วพื้นที่โรงงานและคลังสินค้า',
        'จัดทำเอกสารระบบบริหารงานคุณภาพตามมาตรฐาน ISO และทะเบียนทรัพย์สินไอที (IT Asset Management)',
        'วางแผนและตรวจสอบบำรุงรักษาเชิงป้องกัน (Preventive Maintenance) ของระบบเซิร์ฟเวอร์ กล้องวงจรปิด และเครื่องสแกนลายนิ้วมือตามรอบ'
    ]::TEXT[],
    ARRAY[
        'ร่วมเป็นทีมงานติดตั้งและวางระบบ (Implement) ERP Oracle ในส่วนโมดูล MMS (Material Management) และ WS (Warehouse)',
        'ออกแบบและติดตั้งระบบกล้องวงจรปิด (CCTV) จำนวน 152 ตัว พร้อมเดินสายไฟเบอร์ออปติก เชื่อมโยงโครงข่ายทั่วพื้นที่โรงงานและคลังสินค้า ช่วยให้ตรวจเช็คความปลอดภัยแบบเรียลไทม์ได้อย่างมีเสถียรภาพ'
    ]::TEXT[],
    4
),
(
    'บริษัท บันเลือง ชินอินเตอร์ จำกัด',
    'เจ้าหน้าที่สนับสนุนไอที (IT Support)',
    'กรุงเทพมหานคร',
    'มีนาคม 2560',
    'กุมภาพันธ์ 2562',
    ARRAY[
        'จัดการบัญชีผู้ใช้ กำหนดสิทธิ์ และบริหารจัดการโฟลเดอร์แบ่งปัน (Shared Folder) ผ่าน Active Directory',
        'ซ่อมบำรุงและแก้ไขปัญหาฮาร์ดแวร์คอมพิวเตอร์ โน้ตบุ๊ก ระบบเครือข่าย และอุปกรณ์ต่อพ่วงในสำนักงาน',
        'บริหารจัดการระบบสำรองข้อมูล (Data Backup) ของเซิร์ฟเวอร์และเครื่องผู้ใช้งานอย่างเป็นระบบเพื่อป้องกันข้อมูลสูญหาย',
        'ให้บริการ Helpdesk และ Desktop Support แก้ไขปัญหาการใช้งานระบบไอทีและซอฟต์แวร์ทั่วไปแก่พนักงาน'
    ]::TEXT[],
    ARRAY[
        'ดูแลและบำรุงรักษาอุปกรณ์ไอทีของพนักงานและส่วนกลางรวมกว่า 100 เครื่อง ช่วยลดอัตราเครื่องเสีย (Downtime) และประหยัดค่าใช้จ่ายการส่งซ่อมภายนอก',
        'วางระบบสำรองข้อมูลและกู้คืนไฟล์งานสำคัญ of ฝ่ายขายและคลังสินค้า ช่วยป้องกันความเสียหายจากข้อมูลสูญหายได้ 100%'
    ]::TEXT[],
    5
)
;

-- Insert Projects Data
INSERT INTO public.projects (title, description, tags, link, is_featured, order_index)
VALUES
(
    'MEC CALIBRATION SYSTEM',
    'ระบบจัดการและสอบเทียบเครื่องมือวัดสำหรับ 17 ไซต์งานก่อสร้าง รองรับการบันทึกประวัติการสอบเทียบ ตรวจสอบต้นทุน ส่งออก PDF และการอนุมัติโอนย้ายอุปกรณ์โดย Super Admin',
    ARRAY['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Google Drive API']::TEXT[],
    '#',
    true,
    1
),
(
    'IT PROJECT DASHBOARD',
    'ระบบติดตามแผนงานและควบคุมงบประมาณแผนกไอทีประจำปี (Capex & Opex) แสดงผลในรูปแบบ Gantt Chart พร้อมใช้เป็นระบบตัวชี้วัด (KPI) เพื่อติดตามงานและประเมินผลการปฏิบัติงานของเจ้าหน้าที่ไอทีในทีม',
    ARRAY['Next.js', 'Vercel', 'Google Apps Script', 'Google Sheets']::TEXT[],
    '#',
    false,
    2
),
(
    'IN-HOUSE HELP DESK',
    'ระบบรับแจ้งซ่อมและช่วยเหลือไอทีสนับสนุนผู้ใช้กว่า 160 คน พร้อมระบบแจ้งเตือนผ่าน LINE และ Email อัตโนมัติ',
    ARRAY['HTML', 'Vanilla JS', 'PHP', 'PostgreSQL', 'LINE Notify API']::TEXT[],
    '#',
    false,
    3
),
(
    'PRINT COST DASHBOARD',
    'ระบบวิเคราะห์และตรวจสอบค่าใช้จ่ายในการพิมพ์เอกสารรายแผนก เพื่อเพิ่มความคุ้มค่าและลด Opex',
    ARRAY['Python', 'Pandas', 'SQL Server', 'PowerBI']::TEXT[],
    '#',
    false,
    4
),
(
    'LICENSE TRACKER',
    'ระบบจัดการและจัดสรรซอฟต์แวร์ลิขสิทธิ์ของบริษัท (M365, AutoCAD, ZwCAD) ช่วยประหยัดงบได้กว่า 1.12 ล้านบาท/ปี',
    ARRAY['Next.js', 'Vite', 'Supabase DB', 'Excel API']::TEXT[],
    '#',
    false,
    5
);

-- Insert Skills Data
INSERT INTO public.skills (category, name, proficiency, order_index)
VALUES
('Network & Infrastructure', 'Firewall (Fortigate 100F)', 'Advanced', 1),
('Network & Infrastructure', 'LAN / WAN & VLAN', 'Advanced', 2),
('Network & Infrastructure', 'Router & Switch Configuration', 'Advanced', 3),
('Network & Infrastructure', 'TCP/IP Networking', 'Advanced', 4),
('Network & Infrastructure', 'TP-Link Omada Controller', 'Advanced', 5),
('Network & Infrastructure', 'Active Directory & GPO', 'Advanced', 6),
('Network & Infrastructure', 'Network Security', 'Advanced', 7),
('Server & Cloud', 'Microsoft Azure (Entra ID)', 'Advanced', 8),
('Server & Cloud', 'Microsoft 365 Admin & SharePoint', 'Advanced', 9),
('Server & Cloud', 'VMware ESXi', 'Advanced', 10),
('Server & Cloud', 'Nutanix (AHV)', 'Intermediate', 11),
('Server & Cloud', 'Synology NAS Backup & DR', 'Advanced', 12),
('Software & Dev', 'Next.js (App Router)', 'Intermediate', 13),
('Software & Dev', 'React', 'Intermediate', 14),
('Software & Dev', 'TypeScript', 'Intermediate', 15),
('Software & Dev', 'Tailwind CSS v4', 'Advanced', 16),
('Software & Dev', 'HTML5 & Vanilla CSS', 'Advanced', 17),
('Software & Dev', 'Google Apps Script', 'Advanced', 18),
('Software & Dev', 'Supabase Functions & PostgreSQL', 'Intermediate', 19),
('Software & Dev', 'SQL Server Basic', 'Intermediate', 20),
('Software & Dev', 'Google Sheets API', 'Advanced', 21),
('Office & Systems', 'IP Phone Setup', 'Advanced', 22),
('Office & Systems', 'CCTV Integration (IP & Fiber)', 'Advanced', 23),
('Office & Systems', 'Finger Scan Centralization', 'Advanced', 24),
('Office & Systems', 'AutoCAD Electrical', 'Intermediate', 25),
('Languages', 'Thai', 'Native', 26),
('Languages', 'English', 'Beginner', 27);

-- Insert Certifications Data
INSERT INTO public.certifications (name, issuer, date, order_index, image_url)
VALUES
('Fortinet Certified Associate (FCA) - NSE 3 Network Security Associate', 'Fortinet Training Institute', '2568', 1, 'FCA-NSE3'),
('Fortinet Certified Associate (FCA) - NSE 2 Network Security Associate', 'Fortinet Training Institute', '2568', 2, 'FCA-NSE2'),
('Fortinet Certified Associate (FCA) - NSE 1 Network Security Associate', 'Fortinet Training Institute', '2568', 3, 'FCA-NSE1'),
('Cisco Certified Network Associate (CCNA)', 'Jodoi IT & Service Co., Ltd. / Cisco', '2567', 4, 'CCNA-Jodoi'),
('Configuring and Troubleshooting Windows Server 2019 Active Directory Domain Services (AD001)', 'elife systems Co., Ltd.', '2566', 5, 'AD001'),
('Advanced Troubleshooting Windows Server Active Directory (AD002)', 'elife systems Co., Ltd.', '2566', 6, 'AD002'),
('Python Programming & IT Networking Essentials (Python 1)', 'Cisco Networking Academy', '2566', 7, 'Python1'),
('Advanced Python Programming (Python 2)', 'Cisco Networking Academy', '2566', 8, 'Python2');
