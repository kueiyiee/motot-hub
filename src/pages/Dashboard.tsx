import { useState, useEffect } from "react";
import { Users, GraduationCap, CalendarCheck, BookOpen, TrendingUp, Activity, Clock, FileText, Award, UserCheck } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useSchool } from "@/contexts/SchoolContext";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(224,76%,48%)", "hsl(160,84%,39%)", "hsl(48,97%,54%)", "hsl(199,89%,48%)", "hsl(350,89%,60%)", "hsl(280,70%,50%)", "hsl(30,90%,50%)", "hsl(140,60%,40%)"];

interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalTeachers: number;
  activeTeachers: number;
  totalCourses: number;
  activeCourses: number;
  recentLogs: any[];
  gradeDistribution: { name: string; students: number }[];
  genderData: { name: string; value: number }[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const { settings, allGrades } = useSchool();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0, activeStudents: 0,
    totalTeachers: 0, activeTeachers: 0,
    totalCourses: 0, activeCourses: 0,
    recentLogs: [],
    gradeDistribution: [],
    genderData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch students
      const { data: students } = await supabase.from("students").select("id, status, grade, gender");
      // Fetch teachers
      const { data: teachers } = await supabase.from("teachers").select("id, status");
      // Fetch courses
      const { data: courses } = await supabase.from("courses").select("id, status");
      // Fetch recent audit logs (super_admin only)
      let recentLogs: any[] = [];
      if (user?.role === "super_admin") {
        const { data: logs } = await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(5);
        recentLogs = logs || [];
      }

      const studentList = students || [];
      const teacherList = teachers || [];
      const courseList = courses || [];

      // Grade distribution
      const gradeDistribution = allGrades.map(grade => ({
        name: grade,
        students: studentList.filter(s => s.grade === grade).length,
      })).filter(g => g.students > 0);

      // Gender data
      const maleCount = studentList.filter(s => s.gender === "Male").length;
      const femaleCount = studentList.filter(s => s.gender === "Female").length;

      setStats({
        totalStudents: studentList.length,
        activeStudents: studentList.filter(s => s.status === "Active").length,
        totalTeachers: teacherList.length,
        activeTeachers: teacherList.filter(t => t.status === "Active").length,
        totalCourses: courseList.length,
        activeCourses: courseList.filter(c => c.status === "Active").length,
        recentLogs,
        gradeDistribution,
        genderData: [
          { name: "Male", value: maleCount },
          { name: "Female", value: femaleCount },
        ],
      });
      setLoading(false);
    };
    fetchStats();
  }, [user, allGrades]);

  const roleLabel = user?.role === "super_admin" ? "Super Admin"
    : user?.role === "admin" ? "Admin"
    : user?.role === "registrar" ? "Registrar"
    : user?.role === "teacher" ? "Teacher"
    : "Student";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ===== STUDENT DASHBOARD =====
  if (user?.role === "student") {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold">My Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome, {user.name} • Student • {settings.currentTerm} {settings.currentYear}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-display font-semibold">My Courses</h3>
            <p className="text-sm text-muted-foreground mt-1">View your enrolled courses</p>
          </Card>
          <Card className="p-6 text-center">
            <Award className="h-8 w-8 text-success mx-auto mb-2" />
            <h3 className="font-display font-semibold">My Grades</h3>
            <p className="text-sm text-muted-foreground mt-1">Check your academic performance</p>
          </Card>
          <Card className="p-6 text-center">
            <CalendarCheck className="h-8 w-8 text-info mx-auto mb-2" />
            <h3 className="font-display font-semibold">My Attendance</h3>
            <p className="text-sm text-muted-foreground mt-1">View your attendance record</p>
          </Card>
        </div>
      </div>
    );
  }

  // ===== TEACHER DASHBOARD =====
  if (user?.role === "teacher") {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome, {user.name} • Teacher • {settings.currentTerm} {settings.currentYear}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard title="My Courses" value={stats.activeCourses} icon={BookOpen} trend="Active" trendUp />
          <StatCard title="Total Students" value={stats.totalStudents} icon={Users} trend={`${stats.activeStudents} active`} trendUp />
          <StatCard title="Attendance Rate" value="—" icon={CalendarCheck} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5">
            <h2 className="font-display font-semibold text-lg mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <div className="p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer">📝 Record Attendance</div>
              <div className="p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer">📊 Upload Grades</div>
              <div className="p-3 rounded-lg border hover:bg-secondary/50 cursor-pointer">📚 Manage Course Materials</div>
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-display font-semibold text-lg mb-3">Student Distribution</h2>
            {stats.gradeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No student data yet</p>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // ===== ADMIN / SUPER ADMIN / REGISTRAR DASHBOARD =====
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Welcome back, {user?.name} • {roleLabel} • {settings.currentTerm} {settings.currentYear}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} trend={`${stats.activeStudents} active`} trendUp />
        <StatCard title="Teaching Staff" value={stats.totalTeachers} icon={GraduationCap} trend={`${stats.activeTeachers} active`} trendUp />
        <StatCard title="Active Courses" value={stats.activeCourses} icon={BookOpen} trend={`${stats.totalCourses} total`} trendUp />
        <StatCard title="School Level" value={settings.schoolLevel === "both" ? "P & S" : settings.schoolLevel === "primary" ? "Primary" : "Secondary"} icon={Activity} trend={`${allGrades.length} grades`} trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Enrollment Chart */}
        <Card className="col-span-2 p-5">
          <h2 className="font-display font-semibold text-lg mb-4">Student Distribution by Grade</h2>
          {stats.gradeDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
              No students enrolled yet. Add students to see distribution.
            </div>
          )}
        </Card>

        {/* Gender Pie */}
        <Card className="p-5">
          <h2 className="font-display font-semibold text-lg mb-4">Gender Distribution</h2>
          {stats.genderData.some(d => d.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={stats.genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {stats.genderData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {stats.genderData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span>{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
              No student data yet
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity / Audit Logs for super admin */}
      {user?.role === "super_admin" && stats.recentLogs.length > 0 && (
        <Card className="p-5">
          <h2 className="font-display font-semibold text-lg mb-4">Recent Audit Activity</h2>
          <div className="space-y-1">
            {stats.recentLogs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between py-2.5 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    log.action === "CREATE" ? "bg-success" : log.action === "DELETE" ? "bg-destructive" : "bg-info"
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{log.action} — {log.target_type}</p>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(log.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
