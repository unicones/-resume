"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { KeyRound, Mail, ArrowRight, AlertCircle, ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    async function checkUser() {
      const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                            process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id") ||
                            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your-anon-key-here");

      if (isPlaceholder) {
        if (sessionStorage.getItem("admin_logged_in") === "true") {
          router.push("/admin");
        }
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          router.push("/admin");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    }
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                          process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id") ||
                          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes("your-anon-key-here");

    if (isPlaceholder) {
      // Mock login check for demo purposes
      if (email === "admin@example.com" && password === "admin1234") {
        sessionStorage.setItem("admin_logged_in", "true");
        sessionStorage.setItem("mock_user_email", email);
        router.push("/admin");
        router.refresh();
        setLoading(false);
        return;
      } else {
        setError("โหมดทดสอบ: กรุณาใช้ admin@example.com และรหัสผ่าน admin1234");
        setLoading(false);
        return;
      }
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (data?.user) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#f8fafc]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md premium-card p-8 border border-slate-200 shadow-xl relative overflow-hidden"
      >
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#a88a59]" />

        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 text-[#a88a59]">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">ระบบควบคุมผู้ดูแล (Admin Portal)</h2>
          <p className="text-xs text-slate-500 max-w-xs">
            ลงชื่อเข้าใช้งานระบบหลังบ้านเพื่อจัดการข้อมูลประวัติส่วนตัวและผลงาน
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-2.5 items-start p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">อีเมลผู้ใช้งาน (Admin Email)</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#a88a59] focus:ring-1 focus:ring-[#a88a59] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block">รหัสผ่าน (Password)</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#a88a59] focus:ring-1 focus:ring-[#a88a59] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f172a] hover:bg-[#1e293b] disabled:bg-slate-700 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer group"
          >
            {loading ? "กำลังตรวจสอบข้อมูล..." : "ลงชื่อเข้าใช้งาน"}
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <a href="/" className="text-xs text-slate-500 hover:text-[#a88a59] transition-colors">
            ย้อนกลับไปหน้าหลัก Resume
          </a>
        </div>
      </motion.div>
    </div>
  );
}
