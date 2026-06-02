"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Briefcase, 
  Award, 
  Code, 
  LogOut, 
  Save, 
  Plus, 
  Trash2, 
  Edit2, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Loader2,
  Layers
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form States
  const [profile, setProfile] = useState<any>({
    name: "", title: "", bio: "", email: "", phone: "", line_id: "", address: "", avatar_url: "", resume_url: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [certImageFile, setCertImageFile] = useState<File | null>(null);
  const [certPdfFile, setCertPdfFile] = useState<File | null>(null);

  const [experiences, setExperiences] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Editor states
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [editingProj, setEditingProj] = useState<any | null>(null);

  const router = useRouter();

  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id") ||
                        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your-anon-key-here");

  useEffect(() => {
    async function checkAuthAndLoad() {
      if (isPlaceholder) {
        const isLoggedIn = sessionStorage.getItem("admin_logged_in") === "true";
        if (!isLoggedIn) {
          router.push("/login");
          return;
        }
        setUser({ email: sessionStorage.getItem("mock_user_email") || "admin@example.com" });
        loadAllData();
        setLoading(false);
        return;
      }

      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push("/login");
          return;
        }
        setUser(authUser);
        await loadAllData();
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuthAndLoad();
  }, [router]);

  const normalizeToArray = (data: any, prefix = "item"): any[] => {
    if (!data) return [];
    let list: any[] = [];
    if (Array.isArray(data)) {
      list = data;
    } else if (data && data.th && Array.isArray(data.th)) {
      list = data.th;
    } else {
      return [];
    }
    return list.map((item: any, idx: number) => {
      if (item && typeof item === "object") {
        return {
          ...item,
          id: item.id || `${prefix}-${idx}`
        };
      }
      return item;
    });
  };

  async function loadAllData() {
    try {
      if (isPlaceholder) {
        const localProf = localStorage.getItem("mock_profile");
        if (localProf) {
          try {
            const parsed = JSON.parse(localProf);
            if (parsed && parsed.th) {
              setProfile(parsed.th);
            } else {
              setProfile(parsed || {});
            }
          } catch (e) {
            console.error("Failed to parse mock_profile:", e);
          }
        }

        const localExp = localStorage.getItem("mock_experiences");
        if (localExp) {
          try {
            const parsed = JSON.parse(localExp);
            setExperiences(normalizeToArray(parsed, "exp"));
          } catch (e) {
            setExperiences([]);
          }
        }

        const localSkill = localStorage.getItem("mock_skills");
        if (localSkill) {
          try {
            const parsed = JSON.parse(localSkill);
            setSkills(normalizeToArray(parsed, "skill"));
          } catch (e) {
            setSkills([]);
          }
        }

        const localCert = localStorage.getItem("mock_certifications");
        if (localCert) {
          try {
            const parsed = JSON.parse(localCert);
            setCerts(normalizeToArray(parsed, "cert"));
          } catch (e) {
            setCerts([]);
          }
        }

        const localProj = localStorage.getItem("mock_projects");
        if (localProj) {
          try {
            const parsed = JSON.parse(localProj);
            setProjects(normalizeToArray(parsed, "proj"));
          } catch (e) {
            setProjects([]);
          }
        }
        return;
      }

      const { data: profData } = await supabase.from("profiles").select("*").maybeSingle();
      if (profData) setProfile(profData);

      const { data: expData } = await supabase.from("experiences").select("*").order("order_index", { ascending: true });
      if (expData) setExperiences(normalizeToArray(expData, "exp"));

      const { data: skillData } = await supabase.from("skills").select("*").order("order_index", { ascending: true });
      if (skillData) setSkills(normalizeToArray(skillData, "skill"));

      const { data: certData } = await supabase.from("certifications").select("*").order("order_index", { ascending: true });
      if (certData) setCerts(normalizeToArray(certData, "cert"));

      const { data: projData } = await supabase.from("projects").select("*").order("order_index", { ascending: true });
      if (projData) setProjects(normalizeToArray(projData, "proj"));
    } catch (err) {
      console.error("Error loading admin data:", err);
    }
  }

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleLogout = async () => {
    if (isPlaceholder) {
      sessionStorage.removeItem("admin_logged_in");
      sessionStorage.removeItem("mock_user_email");
    } else {
      await supabase.auth.signOut();
    }
    router.push("/login");
  };

  // --- PROFILE SAVE ---
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isPlaceholder) {
      const originalMock = localStorage.getItem("mock_profile");
      let mockObj: any = { th: {}, en: {}, zh: {} };
      if (originalMock) {
        try {
          const parsed = JSON.parse(originalMock);
          if (parsed) {
            mockObj.th = parsed.th || {};
            mockObj.en = parsed.en || {};
            mockObj.zh = parsed.zh || {};
          }
        } catch(err){}
      }
      mockObj.th = profile;
      const nonLangFields = {
        email: profile.email,
        phone: profile.phone,
        line_id: profile.line_id,
        address: profile.address,
        birthdate: profile.birthdate,
        github: profile.github,
        linkedin: profile.linkedin,
        avatar_url: profile.avatar_url,
        resume_url: profile.resume_url
      };
      mockObj.en = { ...mockObj.en, ...nonLangFields };
      mockObj.zh = { ...mockObj.zh, ...nonLangFields };
      localStorage.setItem("mock_profile", JSON.stringify(mockObj));
      showStatus("success", "โหมดทดสอบ: บันทึกข้อมูลโปรไฟล์ลง LocalStorage สำเร็จ");
      setLoading(false);
      return;
    }

    try {
      let finalAvatarUrl = profile.avatar_url;
      let finalResumeUrl = profile.resume_url;

      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `avatar-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile, { cacheControl: "3600", upsert: true });

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
        finalAvatarUrl = publicUrlData.publicUrl;
      }

      if (resumeFile) {
        const fileExt = resumeFile.name.split(".").pop();
        const fileName = `resume-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from("resumes")
          .upload(fileName, resumeFile, { cacheControl: "3600", upsert: true });

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage.from("resumes").getPublicUrl(fileName);
        finalResumeUrl = publicUrlData.publicUrl;
      }

      const updatedProfile = {
        ...profile,
        avatar_url: finalAvatarUrl,
        resume_url: finalResumeUrl,
        updated_at: new Date().toISOString()
      };

      const { error: saveErr } = await supabase.from("profiles").upsert(updatedProfile);
      if (saveErr) throw saveErr;

      setProfile(updatedProfile);
      showStatus("success", "บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว");
      setAvatarFile(null);
      setResumeFile(null);
    } catch (err: any) {
      console.error(err);
      showStatus("error", `บันทึกไม่สำเร็จ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- EXPERIENCES CRUD ---
  const handleExpSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const respArray = editingExp.responsibilitiesRaw
      ? editingExp.responsibilitiesRaw.split("\n").filter((l: string) => l.trim() !== "")
      : [];
    const accmArray = editingExp.accomplishmentsRaw
      ? editingExp.accomplishmentsRaw.split("\n").filter((l: string) => l.trim() !== "")
      : [];

    const expData: any = {
      company: editingExp.company,
      role: editingExp.role,
      location: editingExp.location,
      start_date: editingExp.start_date,
      end_date: editingExp.end_date,
      responsibilities: respArray,
      accomplishments: accmArray,
      order_index: parseInt(editingExp.order_index) || 0
    };

    if (isPlaceholder) {
      const originalMock = localStorage.getItem("mock_experiences");
      let mockObj: any = { th: [], en: [], zh: [] };
      if (originalMock) {
        try {
          const parsed = JSON.parse(originalMock);
          if (parsed) {
            mockObj.th = parsed.th || [];
            mockObj.en = parsed.en || [];
            mockObj.zh = parsed.zh || [];
          }
        } catch(err){}
      }

      if (!editingExp.id) {
        const newId = `exp-mock-${Date.now()}`;
        expData.id = newId;
        mockObj.th = [...mockObj.th, expData];
        mockObj.en = [...mockObj.en, { ...expData, id: newId, company: `${expData.company} (EN)`, role: `${expData.role} (EN)` }];
        mockObj.zh = [...mockObj.zh, { ...expData, id: newId, company: `${expData.company} (ZH)`, role: `${expData.role} (ZH)` }];
      } else {
        expData.id = editingExp.id;
        mockObj.th = mockObj.th.map((x: any) => x.id === editingExp.id ? expData : x);
        const updateNonLang = (x: any) => {
          if (x.id === editingExp.id) {
            return {
              ...x,
              location: expData.location,
              start_date: expData.start_date,
              end_date: expData.end_date,
              order_index: expData.order_index,
              company: x.company || expData.company,
              role: x.role || expData.role
            };
          }
          return x;
        };
        mockObj.en = mockObj.en.map(updateNonLang);
        mockObj.zh = mockObj.zh.map(updateNonLang);
      }

      mockObj.th.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      mockObj.en.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      mockObj.zh.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

      localStorage.setItem("mock_experiences", JSON.stringify(mockObj));
      setExperiences(mockObj.th);
      setEditingExp(null);
      showStatus("success", "โหมดทดสอบ: บันทึกประสบการณ์เรียบร้อย");
      setLoading(false);
      return;
    }

    try {
      if (editingExp.id) {
        const { error } = await supabase.from("experiences").update(expData).eq("id", editingExp.id);
        if (error) throw error;
        showStatus("success", "อัปเดตประสบการณ์ทำงานแล้ว");
      } else {
        const { error } = await supabase.from("experiences").insert([expData]);
        if (error) throw error;
        showStatus("success", "เพิ่มประสบการณ์ทำงานเรียบร้อย");
      }

      setEditingExp(null);
      await loadAllData();
    } catch (err: any) {
      showStatus("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExpDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบข้อมูลประสบการณ์ทำงานนี้ใช่หรือไม่?")) return;
    setLoading(true);

    if (isPlaceholder) {
      const originalMock = localStorage.getItem("mock_experiences");
      let mockObj: any = { th: [], en: [], zh: [] };
      if (originalMock) {
        try {
          const parsed = JSON.parse(originalMock);
          if (parsed) {
            mockObj.th = parsed.th || [];
            mockObj.en = parsed.en || [];
            mockObj.zh = parsed.zh || [];
          }
        } catch(err){}
      }
      mockObj.th = mockObj.th.filter((x: any) => x.id !== id);
      mockObj.en = mockObj.en.filter((x: any) => x.id !== id);
      mockObj.zh = mockObj.zh.filter((x: any) => x.id !== id);

      localStorage.setItem("mock_experiences", JSON.stringify(mockObj));
      setExperiences(mockObj.th);
      showStatus("success", "โหมดทดสอบ: ลบประสบการณ์เรียบร้อย");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("experiences").delete().eq("id", id);
      if (error) throw error;
      showStatus("success", "ลบข้อมูลเรียบร้อยแล้ว");
      await loadAllData();
    } catch (err: any) {
      showStatus("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PROJECTS CRUD ---
  const handleProjSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const tagsArray = editingProj.tagsRaw
      ? editingProj.tagsRaw.split(",").map((t: string) => t.trim()).filter((t: string) => t !== "")
      : [];

    const projData: any = {
      title: editingProj.title,
      description: editingProj.description,
      tags: tagsArray,
      link: editingProj.link || "#",
      is_featured: !!editingProj.is_featured,
      order_index: parseInt(editingProj.order_index) || 0
    };

    if (isPlaceholder) {
      const originalMock = localStorage.getItem("mock_projects");
      let mockObj: any = { th: [], en: [], zh: [] };
      if (originalMock) {
        try {
          const parsed = JSON.parse(originalMock);
          if (parsed) {
            mockObj.th = parsed.th || [];
            mockObj.en = parsed.en || [];
            mockObj.zh = parsed.zh || [];
          }
        } catch(e){}
      }

      if (!editingProj.id) {
        const newId = `proj-mock-${Date.now()}`;
        projData.id = newId;
        mockObj.th = [...mockObj.th, projData];
        mockObj.en = [...mockObj.en, { ...projData, id: newId, title: `${projData.title} (EN)`, description: `${projData.description} (EN)` }];
        mockObj.zh = [...mockObj.zh, { ...projData, id: newId, title: `${projData.title} (ZH)`, description: `${projData.description} (ZH)` }];
      } else {
        projData.id = editingProj.id;
        mockObj.th = mockObj.th.map((x: any) => x.id === editingProj.id ? projData : x);
        const updateNonLang = (x: any) => {
          if (x.id === editingProj.id) {
            return {
              ...x,
              link: projData.link,
              tags: projData.tags,
              is_featured: projData.is_featured,
              isFeatured: projData.is_featured,
              order_index: projData.order_index,
              title: x.title || projData.title,
              description: x.description || projData.description
            };
          }
          return x;
        };
        mockObj.en = mockObj.en.map(updateNonLang);
        mockObj.zh = mockObj.zh.map(updateNonLang);
      }

      mockObj.th.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      mockObj.en.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      mockObj.zh.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

      localStorage.setItem("mock_projects", JSON.stringify(mockObj));
      setProjects(mockObj.th);
      setEditingProj(null);
      showStatus("success", "โหมดทดสอบ: บันทึกข้อมูลโครงการเรียบร้อย");
      setLoading(false);
      return;
    }

    try {
      if (editingProj.id) {
        const { error } = await supabase.from("projects").update(projData).eq("id", editingProj.id);
        if (error) throw error;
        showStatus("success", "อัปเดตข้อมูลโครงการเรียบร้อยแล้ว");
      } else {
        const { error } = await supabase.from("projects").insert([projData]);
        if (error) throw error;
        showStatus("success", "เพิ่มโครงการใหม่เรียบร้อยแล้ว");
      }

      setEditingProj(null);
      await loadAllData();
    } catch (err: any) {
      showStatus("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProjDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบโครงการนี้ใช่หรือไม่?")) return;
    setLoading(true);

    if (isPlaceholder) {
      const originalMock = localStorage.getItem("mock_projects");
      let mockObj: any = { th: [], en: [], zh: [] };
      if (originalMock) {
        try {
          const parsed = JSON.parse(originalMock);
          if (parsed) {
            mockObj.th = parsed.th || [];
            mockObj.en = parsed.en || [];
            mockObj.zh = parsed.zh || [];
          }
        } catch(e){}
      }
      mockObj.th = mockObj.th.filter((x: any) => x.id !== id);
      mockObj.en = mockObj.en.filter((x: any) => x.id !== id);
      mockObj.zh = mockObj.zh.filter((x: any) => x.id !== id);

      localStorage.setItem("mock_projects", JSON.stringify(mockObj));
      setProjects(mockObj.th);
      showStatus("success", "โหมดทดสอบ: ลบโครงการเรียบร้อย");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      showStatus("success", "ลบโครงการเรียบร้อยแล้ว");
      await loadAllData();
    } catch (err: any) {
      showStatus("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- SKILLS CRUD ---
  const handleSkillSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const skillData: any = {
      name: editingSkill.name,
      category: editingSkill.category,
      proficiency: editingSkill.proficiency,
      order_index: parseInt(editingSkill.order_index) || 0
    };

    if (isPlaceholder) {
      const originalMock = localStorage.getItem("mock_skills");
      let mockObj: any = { th: [], en: [], zh: [] };
      if (originalMock) {
        try {
          const parsed = JSON.parse(originalMock);
          if (parsed) {
            mockObj.th = parsed.th || [];
            mockObj.en = parsed.en || [];
            mockObj.zh = parsed.zh || [];
          }
        } catch(err){}
      }

      if (!editingSkill.id) {
        const newId = `skill-mock-${Date.now()}`;
        skillData.id = newId;
        mockObj.th = [...mockObj.th, skillData];
        mockObj.en = [...mockObj.en, { ...skillData, id: newId }];
        mockObj.zh = [...mockObj.zh, { ...skillData, id: newId }];
      } else {
        skillData.id = editingSkill.id;
        mockObj.th = mockObj.th.map((s: any) => s.id === editingSkill.id ? skillData : s);
        const updateNonLang = (s: any) => {
          if (s.id === editingSkill.id) {
            return {
              ...s,
              category: skillData.category,
              proficiency: skillData.proficiency,
              order_index: skillData.order_index,
              name: s.name || skillData.name
            };
          }
          return s;
        };
        mockObj.en = mockObj.en.map(updateNonLang);
        mockObj.zh = mockObj.zh.map(updateNonLang);
      }

      mockObj.th.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      mockObj.en.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      mockObj.zh.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

      localStorage.setItem("mock_skills", JSON.stringify(mockObj));
      setSkills(mockObj.th);
      setEditingSkill(null);
      showStatus("success", "โหมดทดสอบ: บันทึกทักษะเรียบร้อย");
      setLoading(false);
      return;
    }

    try {
      if (editingSkill.id) {
        const { error } = await supabase.from("skills").update(skillData).eq("id", editingSkill.id);
        if (error) throw error;
        showStatus("success", "อัปเดตทักษะเรียบร้อย");
      } else {
        const { error } = await supabase.from("skills").insert([skillData]);
        if (error) throw error;
        showStatus("success", "เพิ่มทักษะสำเร็จ");
      }

      setEditingSkill(null);
      await loadAllData();
    } catch (err: any) {
      showStatus("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillDelete = async (id: string) => {
    if (!confirm("ต้องการลบทักษะนี้ใช่หรือไม่?")) return;
    setLoading(true);

    if (isPlaceholder) {
      const originalMock = localStorage.getItem("mock_skills");
      let mockObj: any = { th: [], en: [], zh: [] };
      if (originalMock) {
        try {
          const parsed = JSON.parse(originalMock);
          if (parsed) {
            mockObj.th = parsed.th || [];
            mockObj.en = parsed.en || [];
            mockObj.zh = parsed.zh || [];
          }
        } catch(err){}
      }
      mockObj.th = mockObj.th.filter((s: any) => s.id !== id);
      mockObj.en = mockObj.en.filter((s: any) => s.id !== id);
      mockObj.zh = mockObj.zh.filter((s: any) => s.id !== id);

      localStorage.setItem("mock_skills", JSON.stringify(mockObj));
      setSkills(mockObj.th);
      showStatus("success", "โหมดทดสอบ: ลบทักษะเรียบร้อย");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;
      showStatus("success", "ลบทักษะสำเร็จ");
      await loadAllData();
    } catch (err: any) {
      showStatus("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- CERTIFICATIONS CRUD ---
  const handleCertSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const certData: any = {
      name: editingCert.name,
      issuer: editingCert.issuer,
      date: editingCert.date,
      image_url: editingCert.image_url || "",
      pdf_url: editingCert.pdf_url || "",
      order_index: parseInt(editingCert.order_index) || 0
    };

    if (isPlaceholder) {
      const originalMock = localStorage.getItem("mock_certifications");
      let mockObj: any = { th: [], en: [], zh: [] };
      if (originalMock) {
        try {
          const parsed = JSON.parse(originalMock);
          if (parsed) {
            mockObj.th = parsed.th || [];
            mockObj.en = parsed.en || [];
            mockObj.zh = parsed.zh || [];
          }
        } catch(err){}
      }

      if (!editingCert.id) {
        const newId = `cert-mock-${Date.now()}`;
        certData.id = newId;
        mockObj.th = [...mockObj.th, certData];
        mockObj.en = [...mockObj.en, { ...certData, id: newId }];
        mockObj.zh = [...mockObj.zh, { ...certData, id: newId }];
      } else {
        certData.id = editingCert.id;
        mockObj.th = mockObj.th.map((c: any) => c.id === editingCert.id ? certData : c);
        const updateNonLang = (c: any) => {
          if (c.id === editingCert.id) {
            return {
              ...c,
              issuer: certData.issuer,
              date: certData.date,
              image_url: certData.image_url,
              pdf_url: certData.pdf_url,
              order_index: certData.order_index,
              name: c.name || certData.name
            };
          }
          return c;
        };
        mockObj.en = mockObj.en.map(updateNonLang);
        mockObj.zh = mockObj.zh.map(updateNonLang);
      }

      mockObj.th.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      mockObj.en.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));
      mockObj.zh.sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

      localStorage.setItem("mock_certifications", JSON.stringify(mockObj));
      setCerts(mockObj.th);
      setEditingCert(null);
      setCertImageFile(null);
      setCertPdfFile(null);
      showStatus("success", "โหมดทดสอบ: บันทึกใบรับรองเรียบร้อย");
      setLoading(false);
      return;
    }

    try {
      let finalImageUrl = editingCert.image_url || "";
      let finalPdfUrl = editingCert.pdf_url || "";

      if (certImageFile) {
        const fileExt = certImageFile.name.split(".").pop();
        const fileName = `cert-img-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from("resumes")
          .upload(fileName, certImageFile, { cacheControl: "3600", upsert: true });

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage.from("resumes").getPublicUrl(fileName);
        finalImageUrl = publicUrlData.publicUrl;
      }

      if (certPdfFile) {
        const fileExt = certPdfFile.name.split(".").pop();
        const fileName = `cert-pdf-${Date.now()}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from("resumes")
          .upload(fileName, certPdfFile, { cacheControl: "3600", upsert: true });

        if (uploadErr) throw uploadErr;

        const { data: publicUrlData } = supabase.storage.from("resumes").getPublicUrl(fileName);
        finalPdfUrl = publicUrlData.publicUrl;
      }

      const dbCertData = {
        ...certData,
        image_url: finalImageUrl,
        pdf_url: finalPdfUrl
      };

      if (editingCert.id) {
        const { error } = await supabase.from("certifications").update(dbCertData).eq("id", editingCert.id);
        if (error) throw error;
        showStatus("success", "อัปเดตใบรับรองเรียบร้อย");
      } else {
        const { error } = await supabase.from("certifications").insert([dbCertData]);
        if (error) throw error;
        showStatus("success", "เพิ่มใบรับรองสำเร็จ");
      }

      setEditingCert(null);
      setCertImageFile(null);
      setCertPdfFile(null);
      await loadAllData();
    } catch (err: any) {
      showStatus("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCertDelete = async (id: string) => {
    if (!confirm("ต้องการลบใบรับรองนี้ใช่หรือไม่?")) return;
    setLoading(true);

    if (isPlaceholder) {
      const originalMock = localStorage.getItem("mock_certifications");
      let mockObj: any = { th: [], en: [], zh: [] };
      if (originalMock) {
        try {
          const parsed = JSON.parse(originalMock);
          if (parsed) {
            mockObj.th = parsed.th || [];
            mockObj.en = parsed.en || [];
            mockObj.zh = parsed.zh || [];
          }
        } catch(err){}
      }
      mockObj.th = mockObj.th.filter((c: any) => c.id !== id);
      mockObj.en = mockObj.en.filter((c: any) => c.id !== id);
      mockObj.zh = mockObj.zh.filter((c: any) => c.id !== id);

      localStorage.setItem("mock_certifications", JSON.stringify(mockObj));
      
      setCerts(mockObj.th);
      showStatus("success", "โหมดทดสอบ: ลบใบรับรองเรียบร้อย");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("certifications").delete().eq("id", id);
      if (error) throw error;
      showStatus("success", "ลบใบรับรองสำเร็จ");
      await loadAllData();
    } catch (err: any) {
      showStatus("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#a88a59]" size={32} />
          <span className="text-slate-500 text-sm">กำลังโหลดหน้าจัดการระบบ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex flex-col md:flex-row">
      
      {/* Sidebar - Dark Navy for contrast */}
      <aside className="w-full md:w-64 bg-[#0f172a] p-6 flex flex-col justify-between shrink-0 text-slate-300">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#a88a59] flex items-center justify-center font-bold text-[#0f172a]">
              A
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide leading-none text-white font-heading">แผงควบคุมแอดมิน</h1>
              <span className="text-[10px] text-slate-400 leading-none">Resume Controller</span>
            </div>
          </div>

          <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: "profile", label: "ข้อมูลส่วนตัว", icon: User },
              { id: "experience", label: "ประสบการณ์", icon: Briefcase },
              { id: "projects", label: "โครงการ/ผลงาน", icon: Layers },
              { id: "skills", label: "ทักษะ/ความสามารถ", icon: Code },
              { id: "certifications", label: "ใบรับรองอบรม", icon: Award }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeSection === tab.id
                    ? "bg-[#a88a59] text-[#0f172a]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6 flex justify-between items-center">
          <div className="flex flex-col text-[11px] text-slate-400 truncate max-w-[120px]">
            <span className="font-bold truncate text-white">{user?.email}</span>
            <span>สถานะ: ผู้ดูแล</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
            title="ออกจากระบบ"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full relative">
        {/* Status Toast */}
        <AnimatePresence>
          {statusMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -20, x: "-50%" }}
              className={`fixed top-6 left-1/2 z-50 flex gap-2 items-center px-4 py-3 rounded-2xl border text-xs md:text-sm shadow-lg ${
                statusMsg.type === "success" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              {statusMsg.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{statusMsg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROFILE SECTION */}
        {activeSection === "profile" && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">ข้อมูลส่วนตัวและลิงก์ติดต่อ</h2>
              <p className="text-xs text-slate-500 mt-1">อัปเดตข้อมูลที่จะแสดงบนหน้าประวัติย่อแบบสาธารณะ</p>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    value={profile.name || ""}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#a88a59] focus:ring-1 focus:ring-[#a88a59]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">ตำแหน่งงาน</label>
                  <input
                    type="text"
                    value={profile.title || ""}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#a88a59]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">คำแนะนำตัวย่อ (Bio)</label>
                <textarea
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#a88a59]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">อีเมลติดต่อ</label>
                  <input
                    type="email"
                    value={profile.email || ""}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#a88a59]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#a88a59]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Line ID</label>
                  <input
                    type="text"
                    value={profile.line_id || ""}
                    onChange={(e) => setProfile({ ...profile, line_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#a88a59]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">ที่อยู่ติดต่อ</label>
                  <input
                    type="text"
                    value={profile.address || ""}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#a88a59]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">วันเกิด (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={profile.birthdate || ""}
                    onChange={(e) => setProfile({ ...profile, birthdate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-[#a88a59]"
                  />
                </div>
              </div>

              {/* Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div className="premium-card p-5 space-y-3">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Upload size={14} className="text-[#a88a59]" />
                    รูปโปรไฟล์ส่วนตัว (Avatar Photo)
                  </span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => e.target.files && setAvatarFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                  {profile.avatar_url && (
                    <span className="text-[10px] text-[#a88a59] block truncate">ลิงก์ปัจจุบัน: {profile.avatar_url}</span>
                  )}
                </div>

                <div className="premium-card p-5 space-y-3">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} className="text-[#a88a59]" />
                    ดาวน์โหลด Resume PDF (Resume File)
                  </span>
                  <input 
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => e.target.files && setResumeFile(e.target.files[0])}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                  {profile.resume_url && (
                    <span className="text-[10px] text-[#a88a59] block truncate">ลิงก์ปัจจุบัน: {profile.resume_url}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold py-3 px-6 rounded-2xl shadow-md transition-all text-xs md:text-sm cursor-pointer"
                >
                  <Save size={16} />
                  บันทึกข้อมูลส่วนตัว
                </button>
              </div>
            </form>
          </div>
        )}

        {/* EXPERIENCE SECTION */}
        {activeSection === "experience" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">ประสบการณ์ทำงาน (Experiences)</h2>
                <p className="text-xs text-slate-500 mt-1">เพิ่มหรือแก้ไขประวัติและหน้าที่ความรับผิดชอบในการทำงาน</p>
              </div>
              <button
                onClick={() => setEditingExp({
                  company: "", role: "", location: "", start_date: "", end_date: "", responsibilitiesRaw: "", accomplishmentsRaw: "", order_index: experiences.length + 1
                })}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-md cursor-pointer"
              >
                <Plus size={14} />
                เพิ่มประสบการณ์
              </button>
            </div>

            {/* Editor Area */}
            {editingExp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="premium-card p-6 border-[#a88a59]/30 bg-[#fbfaf8] space-y-4"
              >
                <h3 className="text-sm font-bold text-[#a88a59] uppercase tracking-wider">{editingExp.id ? "แก้ไขประสบการณ์" : "เพิ่มประสบการณ์ใหม่"}</h3>
                <form onSubmit={handleExpSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="บริษัท (เช่น S.MEC ENGINEERING CO., LTD.)"
                      required
                      value={editingExp.company}
                      onChange={e => setEditingExp({...editingExp, company: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="บทบาท / ตำแหน่งงาน"
                      required
                      value={editingExp.role}
                      onChange={e => setEditingExp({...editingExp, role: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="ที่ตั้ง / จังหวัด"
                      value={editingExp.location || ""}
                      onChange={e => setEditingExp({...editingExp, location: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="วันที่เริ่มงาน (เช่น พฤศจิกายน 2566)"
                      required
                      value={editingExp.start_date}
                      onChange={e => setEditingExp({...editingExp, start_date: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="วันที่สิ้นสุด (เช่น ปัจจุบัน / ก.พ. 2566)"
                      required
                      value={editingExp.end_date}
                      onChange={e => setEditingExp({...editingExp, end_date: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="ลำดับการแสดงผล"
                      required
                      value={editingExp.order_index}
                      onChange={e => setEditingExp({...editingExp, order_index: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold block">หน้าที่ความรับผิดชอบ (เขียนทีละบรรทัดสำหรับแสดงผลเป็นข้อๆ)</label>
                    <textarea
                      placeholder="หน้าที่ความรับผิดชอบข้อที่ 1&#10;หน้าที่ความรับผิดชอบข้อที่ 2"
                      rows={4}
                      value={editingExp.responsibilitiesRaw || ""}
                      onChange={e => setEditingExp({...editingExp, responsibilitiesRaw: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold block">ผลงานที่โดดเด่น / ความสำเร็จหลัก (เขียนทีละบรรทัด)</label>
                    <textarea
                      placeholder="ความสำเร็จข้อที่ 1&#10;ความสำเร็จข้อที่ 2"
                      rows={3}
                      value={editingExp.accomplishmentsRaw || ""}
                      onChange={e => setEditingExp({...editingExp, accomplishmentsRaw: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingExp(null)}
                      className="py-2 px-4 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-350 transition"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 rounded-xl bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] transition flex items-center gap-1.5"
                    >
                      <Save size={14} />
                      บันทึก
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Experiences list */}
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div key={exp.id} className="premium-card p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-sm md:text-base text-slate-900 font-heading leading-snug">{exp.company}</h4>
                    <p className="text-xs text-[#a88a59] font-semibold">{exp.role}</p>
                    <span className="text-[10px] text-slate-500 block mt-1">{exp.start_date} - {exp.end_date} | ลำดับ: {exp.order_index}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingExp({
                        ...exp,
                        responsibilitiesRaw: exp.responsibilities?.join("\n") || "",
                        accomplishmentsRaw: exp.accomplishments?.join("\n") || ""
                      })}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#a88a59]/30 hover:bg-[#f5efe6] text-[#a88a59] transition cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleExpDelete(exp.id)}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS SECTION */}
        {activeSection === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">โครงการและเว็บแอปพลิเคชัน (Projects)</h2>
                <p className="text-xs text-slate-550 mt-1">เพิ่ม แก้ไข หรือลบผลงานระบบเว็บแอปพลิเคชันที่ใช้แสดงผลต่อผู้ใช้</p>
              </div>
              <button
                onClick={() => setEditingProj({
                  title: "", description: "", tagsRaw: "", link: "#", is_featured: false, order_index: projects.length + 1
                })}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-md cursor-pointer"
              >
                <Plus size={14} />
                เพิ่มโครงการ
              </button>
            </div>

            {/* Project Form Editor */}
            {editingProj && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="premium-card p-6 border-[#a88a59]/30 bg-[#fbfaf8] space-y-4"
              >
                <h3 className="text-sm font-bold text-[#a88a59] uppercase tracking-wider">{editingProj.id ? "แก้ไขโครงการ" : "เพิ่มโครงการใหม่"}</h3>
                <form onSubmit={handleProjSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ชื่อโครงการ (Project Title)</label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น MEC CALIBRATION SYSTEM"
                        value={editingProj.title}
                        onChange={e => setEditingProj({...editingProj, title: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ลิงก์โครงการ / URL</label>
                      <input
                        type="text"
                        placeholder="เช่น # หรือ https://..."
                        value={editingProj.link}
                        onChange={e => setEditingProj({...editingProj, link: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">รายละเอียดโครงการ (Description)</label>
                    <textarea
                      required
                      placeholder="อธิบายการทำงานและประโยชน์ของระบบ..."
                      rows={3}
                      value={editingProj.description}
                      onChange={e => setEditingProj({...editingProj, description: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">แท็กเทคโนโลยี (Tags คั่นด้วยเครื่องหมายจุลภาค ',')</label>
                      <input
                        type="text"
                        placeholder="เช่น React, TypeScript, Tailwind CSS, Supabase"
                        value={editingProj.tagsRaw || ""}
                        onChange={e => setEditingProj({...editingProj, tagsRaw: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ลำดับจัดเรียง</label>
                        <input
                          type="number"
                          required
                          value={editingProj.order_index}
                          onChange={e => setEditingProj({...editingProj, order_index: e.target.value})}
                          className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2 flex flex-col justify-end pb-3 pl-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                          <input
                            type="checkbox"
                            checked={!!editingProj.is_featured}
                            onChange={e => setEditingProj({...editingProj, is_featured: e.target.checked})}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          ผลงานแนะนำ
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingProj(null)}
                      className="py-2.5 px-4 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 transition"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-4 rounded-xl bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] transition flex items-center gap-1.5"
                    >
                      <Save size={14} />
                      บันทึกโครงการ
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Projects List */}
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="premium-card p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm md:text-base text-slate-900 font-heading leading-snug">{proj.title}</h4>
                      {proj.is_featured && (
                        <span className="text-[8px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          แนะนำ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-550 line-clamp-2 max-w-2xl">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.tags?.map((t: string, i: number) => (
                        <span key={i} className="text-[8px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingProj({
                        ...proj,
                        tagsRaw: proj.tags?.join(", ") || ""
                      })}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#a88a59]/30 hover:bg-[#f5efe6] text-[#a88a59] transition cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleProjDelete(proj.id)}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS SECTION */}
        {activeSection === "skills" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">ทักษะ / ความสามารถ (Skills)</h2>
                <p className="text-xs text-slate-500 mt-1">ระบุทักษะทางเทคนิคต่างๆ ที่มีความชำนาญเพื่อนำมาจัดกลุ่มในหน้าหลัก</p>
              </div>
              <button
                onClick={() => setEditingSkill({
                  name: "", category: "Network", proficiency: "Advanced", order_index: skills.length + 1
                })}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-md cursor-pointer"
              >
                <Plus size={14} />
                เพิ่มทักษะ
              </button>
            </div>

            {/* Skill Form Editor */}
            {editingSkill && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="premium-card p-5 border-[#a88a59]/30 bg-[#fbfaf8] space-y-4"
              >
                <h3 className="text-sm font-bold text-[#a88a59] uppercase tracking-wider">{editingSkill.id ? "แก้ไขทักษะ" : "เพิ่มทักษะใหม่"}</h3>
                <form onSubmit={handleSkillSave} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ชื่อทักษะ (Skill Name)</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น Firewall, Python"
                      value={editingSkill.name}
                      onChange={e => setEditingSkill({...editingSkill, name: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">หมวดหมู่กลุ่มทักษะ</label>
                    <select
                      value={editingSkill.category}
                      onChange={e => setEditingSkill({...editingSkill, category: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none cursor-pointer"
                    >
                      <option value="Network">Network & Infrastructure</option>
                      <option value="Server">Server & Cloud</option>
                      <option value="Development">Software & Development</option>
                      <option value="Languages">Languages</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ระดับความเชี่ยวชาญ</label>
                    <select
                      value={editingSkill.proficiency}
                      onChange={e => setEditingSkill({...editingSkill, proficiency: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none cursor-pointer"
                    >
                      <option value="Advanced">เชี่ยวชาญ (Advanced / Native)</option>
                      <option value="Intermediate">ปานกลาง (Intermediate / Good)</option>
                      <option value="Beginner">เบื้องต้น (Beginner)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ลำดับการจัดเรียง</label>
                    <input
                      type="number"
                      required
                      value={editingSkill.order_index}
                      onChange={e => setEditingSkill({...editingSkill, order_index: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-4 flex gap-2 justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => setEditingSkill(null)}
                      className="py-2.5 px-4 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 transition"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-4 rounded-xl bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] transition flex items-center gap-1"
                    >
                      <Save size={14} />
                      บันทึกทักษะ
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Skills list table/layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="premium-card p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 font-heading">{skill.name}</h4>
                    <span className="text-[10px] text-slate-500 block uppercase tracking-wide">{skill.category} • {skill.proficiency}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditingSkill(skill)}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#a88a59]/30 text-[#a88a59] text-xs cursor-pointer"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleSkillDelete(skill.id)}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-200 text-rose-600 text-xs cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS SECTION */}
        {activeSection === "certifications" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-heading">ใบรับรองการอบรม (Certifications)</h2>
                <p className="text-xs text-slate-500 mt-1">จัดการใบรับรองระดับสากลหรือสัมมนาต่าง ๆ</p>
              </div>
              <button
                onClick={() => setEditingCert({
                  name: "", issuer: "", date: "", order_index: certs.length + 1
                })}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-md cursor-pointer"
              >
                <Plus size={14} />
                เพิ่มใบรับรอง
              </button>
            </div>

            {/* Cert Form Editor */}
            {editingCert && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="premium-card p-5 border-[#a88a59]/30 bg-[#fbfaf8] space-y-4"
              >
                <h3 className="text-sm font-bold text-[#a88a59] uppercase tracking-wider">{editingCert.id ? "แก้ไขใบรับรอง" : "เพิ่มใบรับรองใหม่"}</h3>
                <form onSubmit={handleCertSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block">ชื่อใบรับรอง/หลักสูตร (Cert Name)</label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น Fortinet NSE 3 Network Security"
                        value={editingCert.name}
                        onChange={e => setEditingCert({...editingCert, name: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block">สถาบัน / ผู้มอบ</label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น Fortinet, Cisco"
                        value={editingCert.issuer}
                        onChange={e => setEditingCert({...editingCert, issuer: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold block">ช่วงวันที่/ปีที่ได้รับ</label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น พ.ค. 2566"
                        value={editingCert.date}
                        onChange={e => setEditingCert({...editingCert, date: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 p-4 bg-white rounded-2xl border border-slate-150">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">รูปภาพใบรับรอง (Image File)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => e.target.files && setCertImageFile(e.target.files[0])}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                      />
                      {editingCert.image_url && (
                        <span className="text-[9px] text-[#a88a59] block truncate mt-1">รูปปัจจุบัน: {editingCert.image_url}</span>
                      )}
                    </div>
                    <div className="space-y-1.5 p-4 bg-white rounded-2xl border border-slate-150">
                      <label className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">ไฟล์เอกสาร PDF (PDF File)</label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={e => e.target.files && setCertPdfFile(e.target.files[0])}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                      />
                      {editingCert.pdf_url && (
                        <span className="text-[9px] text-[#a88a59] block truncate mt-1">PDF ปัจจุบัน: {editingCert.pdf_url}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-[10px] text-slate-500 font-bold block">ลำดับการแสดงผล</label>
                      <input
                        type="number"
                        required
                        value={editingCert.order_index || 0}
                        onChange={e => setEditingCert({...editingCert, order_index: e.target.value})}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3 flex gap-2 justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCert(null);
                          setCertImageFile(null);
                          setCertPdfFile(null);
                        }}
                        className="py-2.5 px-4 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-350 transition"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="py-2.5 px-4 rounded-xl bg-[#0f172a] text-white text-xs font-semibold hover:bg-[#1e293b] transition flex items-center gap-1"
                      >
                        <Save size={14} />
                        บันทึกใบรับรอง
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Certifications list */}
            <div className="space-y-3">
              {certs.map((cert) => (
                <div key={cert.id} className="premium-card p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 font-heading leading-snug">{cert.name}</h4>
                    <span className="text-[10px] text-slate-500 block">{cert.issuer} • {cert.date}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setEditingCert(cert)}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#a88a59]/30 text-[#a88a59] text-xs cursor-pointer"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleCertDelete(cert.id)}
                      className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-200 text-rose-600 text-xs cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
