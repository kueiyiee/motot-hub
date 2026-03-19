import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Filter, Eye, Download, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSchool } from "@/contexts/SchoolContext";
import { useToast } from "@/hooks/use-toast";
import { generateStudentId } from "@/data/mockData";
import type { Tables } from "@/integrations/supabase/types";

type Student = Tables<"students">;

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { settings } = useSchool();
  const { toast } = useToast();

  const fetchStudents = async () => {
    const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false });
    if (data) setStudents(data);
    if (error) console.error("Error fetching students:", error);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = students.filter((s) => {
    const matchesSearch = s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_no.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = gradeFilter === "all" || s.grade === gradeFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const grades = [...new Set(students.map(s => s.grade))];

  const statusColor = (status: string) => {
    if (status === "Active") return "bg-success text-success-foreground";
    if (status === "Inactive") return "bg-muted text-muted-foreground";
    if (status === "Graduated") return "bg-info text-info-foreground";
    return "bg-accent text-accent-foreground";
  };

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const admNo = generateStudentId(settings.studentIdFormat, settings.currentYear, students.length + 1);

    const { data, error } = await supabase.from("students").insert({
      admission_no: admNo,
      full_name: form.get("name") as string,
      grade: form.get("grade") as string,
      section: form.get("section") as string,
      gender: form.get("gender") as string,
      parent_name: form.get("parentName") as string,
      parent_phone: form.get("phone") as string,
      parent_email: form.get("email") as string || null,
      date_of_birth: form.get("dob") as string,
      address: form.get("address") as string || null,
    }).select().single();

    if (data) {
      setStudents([data, ...students]);
      setShowAddDialog(false);
      toast({ title: "Student enrolled", description: `${data.full_name} — ${data.admission_no}` });
    }
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (!error) {
      setStudents(students.filter(s => s.id !== id));
      setSelectedStudent(null);
      toast({ title: "Student removed" });
    }
  };

  const activeCount = students.filter(s => s.status === "Active").length;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Students</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} of {students.length} students • {activeCount} active</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1"><Download className="h-4 w-4" /> Export</Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground gap-2" size="sm"><Plus className="h-4 w-4" /> Add Student</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle className="font-display">Enroll New Student</DialogTitle></DialogHeader>
              <form onSubmit={handleAddStudent} className="grid gap-3 mt-2">
                <div className="grid gap-1.5"><Label>Full Name</Label><Input name="name" required placeholder="Enter student name" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5"><Label>Grade</Label><Input name="grade" required placeholder="e.g. Form 1" /></div>
                  <div className="grid gap-1.5"><Label>Section</Label><Input name="section" required placeholder="e.g. East" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label>Gender</Label>
                    <select name="gender" required className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="grid gap-1.5"><Label>Date of Birth</Label><Input name="dob" type="date" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5"><Label>Parent/Guardian</Label><Input name="parentName" required placeholder="Parent name" /></div>
                  <div className="grid gap-1.5"><Label>Phone</Label><Input name="phone" required placeholder="07XXXXXXXX" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5"><Label>Email (optional)</Label><Input name="email" type="email" placeholder="email@example.com" /></div>
                  <div className="grid gap-1.5"><Label>Address (optional)</Label><Input name="address" placeholder="Home address" /></div>
                </div>
                <p className="text-xs text-muted-foreground">Student ID auto-generated: {settings.studentIdFormat.replace("{YEAR}", settings.currentYear).replace("{SEQ}", "XXX")}</p>
                <Button type="submit" className="mt-2 bg-primary text-primary-foreground">Enroll Student</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or admission number..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-40"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Grade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {grades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Transferred">Transferred</SelectItem>
              <SelectItem value="Graduated">Graduated</SelectItem>
            </SelectContent>
          </Select>
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
              <TableHead className="hidden lg:table-cell">Parent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((student) => (
              <TableRow key={student.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => setSelectedStudent(student)}>
                <TableCell className="font-mono text-sm">{student.admission_no}</TableCell>
                <TableCell className="font-medium">{student.full_name}</TableCell>
                <TableCell className="hidden md:table-cell">{student.grade} {student.section}</TableCell>
                <TableCell className="hidden lg:table-cell">{student.gender}</TableCell>
                <TableCell className="hidden lg:table-cell">{student.parent_name}</TableCell>
                <TableCell><Badge className={statusColor(student.status)}>{student.status}</Badge></TableCell>
                <TableCell><Eye className="h-4 w-4 text-muted-foreground" /></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                {students.length === 0 ? "No students yet. Click 'Add Student' to enroll." : "No students match your filters."}
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-display">Student Profile</DialogTitle></DialogHeader>
          {selectedStudent && (
            <Tabs defaultValue="info">
              <TabsList className="w-full"><TabsTrigger value="info" className="flex-1">Information</TabsTrigger><TabsTrigger value="academic" className="flex-1">Academic</TabsTrigger></TabsList>
              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display text-xl font-bold">
                    {selectedStudent.full_name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">{selectedStudent.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStudent.admission_no}</p>
                    <Badge className={statusColor(selectedStudent.status)}>{selectedStudent.status}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Grade:</span> <strong>{selectedStudent.grade}</strong></div>
                  <div><span className="text-muted-foreground">Section:</span> <strong>{selectedStudent.section || "—"}</strong></div>
                  <div><span className="text-muted-foreground">Gender:</span> <strong>{selectedStudent.gender || "—"}</strong></div>
                  <div><span className="text-muted-foreground">DOB:</span> <strong>{selectedStudent.date_of_birth || "—"}</strong></div>
                  <div><span className="text-muted-foreground">Parent:</span> <strong>{selectedStudent.parent_name || "—"}</strong></div>
                  <div><span className="text-muted-foreground">Phone:</span> <strong>{selectedStudent.parent_phone || "—"}</strong></div>
                  {selectedStudent.address && <div className="col-span-2"><span className="text-muted-foreground">Address:</span> <strong>{selectedStudent.address}</strong></div>}
                  <div className="col-span-2"><span className="text-muted-foreground">Admitted:</span> <strong>{selectedStudent.admission_date}</strong></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-1"><Edit className="h-3 w-3" /> Edit</Button>
                  <Button variant="outline" size="sm" className="gap-1 text-destructive" onClick={() => handleDeleteStudent(selectedStudent.id)}>
                    <Trash2 className="h-3 w-3" /> Remove
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="academic" className="mt-4">
                <p className="text-sm text-muted-foreground">Grade records and attendance history will appear here.</p>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
