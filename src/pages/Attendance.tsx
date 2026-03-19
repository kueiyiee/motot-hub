import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockStudents } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { StatCard } from "@/components/StatCard";
import { CalendarCheck, UserX, Clock, Search } from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";

export default function Attendance() {
  const activeStudents = mockStudents.filter(s => s.status === "Active");
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(activeStudents.map(s => [s.id, "Present"]))
  );
  const [gradeFilter, setGradeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const grades = [...new Set(activeStudents.map(s => s.grade))];
  const filtered = activeStudents.filter(s => {
    const matchGrade = gradeFilter === "all" || s.grade === gradeFilter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchGrade && matchSearch;
  });

  const toggle = (id: string) => {
    setAttendance(prev => {
      const order: AttendanceStatus[] = ["Present", "Absent", "Late", "Excused"];
      const current = order.indexOf(prev[id]);
      return { ...prev, [id]: order[(current + 1) % 4] };
    });
  };

  const statusStyle = (status: AttendanceStatus) => {
    if (status === "Present") return "bg-success text-success-foreground";
    if (status === "Absent") return "bg-destructive text-destructive-foreground";
    if (status === "Late") return "bg-warning text-warning-foreground";
    return "bg-info text-info-foreground";
  };

  const present = Object.values(attendance).filter(v => v === "Present").length;
  const absent = Object.values(attendance).filter(v => v === "Absent").length;
  const late = Object.values(attendance).filter(v => v === "Late").length;
  const excused = Object.values(attendance).filter(v => v === "Excused").length;
  const rate = Math.round((present / activeStudents.length) * 100);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Attendance</h1>
          <p className="text-muted-foreground text-sm">{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <Button
          className="bg-primary text-primary-foreground"
          onClick={() => toast({ title: "Attendance saved", description: `${present} present, ${absent} absent, ${late} late, ${excused} excused` })}
        >
          Save Attendance
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <StatCard title="Present" value={present} icon={CalendarCheck} trend={`${rate}%`} trendUp />
        <StatCard title="Absent" value={absent} icon={UserX} trendUp={false} />
        <StatCard title="Late" value={late} icon={Clock} />
        <StatCard title="Excused" value={excused} icon={CalendarCheck} />
      </div>

      {/* Filters */}
      <Card className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Grade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setAttendance(Object.fromEntries(filtered.map(s => [s.id, "Present"])))}>All Present</Button>
            <Button variant="outline" size="sm" onClick={() => setAttendance(Object.fromEntries(filtered.map(s => [s.id, "Absent"])))}>All Absent</Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>Adm. No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Grade</TableHead>
              <TableHead className="hidden lg:table-cell">Gender</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((student) => (
              <TableRow key={student.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => toggle(student.id)}>
                <TableCell className="font-mono text-sm">{student.admissionNo}</TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="hidden md:table-cell">{student.grade} {student.section}</TableCell>
                <TableCell className="hidden lg:table-cell">{student.gender}</TableCell>
                <TableCell>
                  <Badge className={`cursor-pointer ${statusStyle(attendance[student.id])}`}>
                    {attendance[student.id]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
