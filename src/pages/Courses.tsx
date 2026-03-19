import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockCourses as initial, mockTeachers, Course } from "@/data/mockData";
import { Plus, Search, BookOpen, Users, Clock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>(initial);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Course | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.teacherName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const teacherId = form.get("teacherId") as string;
    const teacher = mockTeachers.find(t => t.id === teacherId);
    const c: Course = {
      id: `c${courses.length + 1}`,
      code: form.get("code") as string,
      name: form.get("name") as string,
      description: form.get("description") as string,
      grade: form.get("grade") as string,
      teacherId,
      teacherName: teacher?.name || "TBA",
      credits: Number(form.get("credits")) || 3,
      enrolledCount: 0,
      schedule: form.get("schedule") as string,
      status: "Active",
    };
    setCourses([...courses, c]);
    setShowAdd(false);
    toast({ title: "Course created", description: `${c.code} — ${c.name}` });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Courses</h1>
          <p className="text-muted-foreground text-sm">{courses.length} courses • {courses.filter(c => c.status === "Active").length} active</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground gap-2" size="sm">
              <Plus className="h-4 w-4" /> Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle className="font-display">Create New Course</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="grid gap-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5"><Label>Course Code</Label><Input name="code" required placeholder="e.g. MAT-301" /></div>
                <div className="grid gap-1.5"><Label>Course Name</Label><Input name="name" required placeholder="e.g. Mathematics" /></div>
              </div>
              <div className="grid gap-1.5"><Label>Description</Label><Input name="description" placeholder="Brief description" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5"><Label>Grade</Label><Input name="grade" required placeholder="e.g. Form 3" /></div>
                <div className="grid gap-1.5"><Label>Credits</Label><Input name="credits" type="number" defaultValue={3} min={1} max={6} /></div>
              </div>
              <div className="grid gap-1.5">
                <Label>Instructor</Label>
                <Select name="teacherId">
                  <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                  <SelectContent>
                    {mockTeachers.filter(t => t.status === "Active").map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name} — {t.subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5"><Label>Schedule</Label><Input name="schedule" placeholder="e.g. Mon, Wed 8:00-9:00" /></div>
              <Button type="submit" className="mt-2 bg-primary text-primary-foreground">Create Course</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses by name, code, or instructor..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>Code</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead className="hidden md:table-cell">Grade</TableHead>
              <TableHead className="hidden lg:table-cell">Instructor</TableHead>
              <TableHead className="hidden lg:table-cell text-center">Enrolled</TableHead>
              <TableHead className="hidden md:table-cell">Schedule</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => setSelected(c)}>
                <TableCell className="font-mono text-sm">{c.code}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="hidden md:table-cell">{c.grade}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{c.teacherName}</TableCell>
                <TableCell className="hidden lg:table-cell text-center">{c.enrolledCount}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{c.schedule}</TableCell>
                <TableCell>
                  <Badge className={c.status === "Active" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell><Eye className="h-4 w-4 text-muted-foreground" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Course Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground">{selected.code} • {selected.grade}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-muted-foreground" /><span>{selected.enrolledCount} enrolled</span></div>
                <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-muted-foreground" /><span>{selected.schedule}</span></div>
                <div><span className="text-muted-foreground">Instructor:</span> {selected.teacherName}</div>
                <div><span className="text-muted-foreground">Credits:</span> {selected.credits}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
