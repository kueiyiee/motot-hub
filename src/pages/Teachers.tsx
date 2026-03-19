import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Mail, Phone, BookOpen, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Teacher = Tables<"teachers">;

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Teacher | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const { toast } = useToast();

  const fetchTeachers = async () => {
    const { data } = await supabase.from("teachers").select("*").order("created_at", { ascending: false });
    if (data) setTeachers(data);
    setLoading(false);
  };

  useEffect(() => { fetchTeachers(); }, []);

  const filtered = teachers.filter(t =>
    t.full_name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.employee_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const { data, error } = await supabase.from("teachers").insert({
      employee_id: `EMP-${String(teachers.length + 1).padStart(3, "0")}`,
      full_name: form.get("name") as string,
      email: form.get("email") as string,
      phone: form.get("phone") as string,
      subject: form.get("subject") as string,
      classes: form.get("classes") as string,
      qualification: form.get("qualification") as string,
    }).select().single();

    if (data) {
      setTeachers([data, ...teachers]);
      setShowAdd(false);
      toast({ title: "Teacher added", description: `${data.full_name} — ${data.employee_id}` });
    }
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Teachers</h1>
          <p className="text-muted-foreground text-sm">{teachers.length} staff members • {teachers.filter(t => t.status === "Active").length} active</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground gap-2" size="sm"><Plus className="h-4 w-4" /> Add Teacher</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle className="font-display">Add New Teacher</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="grid gap-3 mt-2">
              <div className="grid gap-1.5"><Label>Full Name</Label><Input name="name" required placeholder="e.g. Mr. John Doe" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5"><Label>Email</Label><Input name="email" type="email" required placeholder="teacher@motot.ac.ke" /></div>
                <div className="grid gap-1.5"><Label>Phone</Label><Input name="phone" required placeholder="07XXXXXXXX" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5"><Label>Subject</Label><Input name="subject" required placeholder="e.g. Mathematics" /></div>
                <div className="grid gap-1.5"><Label>Classes</Label><Input name="classes" required placeholder="e.g. Form 3, Form 4" /></div>
              </div>
              <div className="grid gap-1.5"><Label>Qualification</Label><Input name="qualification" required placeholder="e.g. B.Ed Mathematics" /></div>
              <Button type="submit" className="mt-2 bg-primary text-primary-foreground">Add Teacher</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, subject, or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Subject</TableHead>
              <TableHead className="hidden lg:table-cell">Classes</TableHead>
              <TableHead className="hidden lg:table-cell">Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(t => (
              <TableRow key={t.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => setSelected(t)}>
                <TableCell className="font-mono text-sm">{t.employee_id}</TableCell>
                <TableCell className="font-medium">{t.full_name}</TableCell>
                <TableCell className="hidden md:table-cell">{t.subject}</TableCell>
                <TableCell className="hidden lg:table-cell">{t.classes}</TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">{t.email}</TableCell>
                <TableCell>
                  <Badge className={t.status === "Active" ? "bg-success text-success-foreground" : "bg-accent text-accent-foreground"}>{t.status}</Badge>
                </TableCell>
                <TableCell><Eye className="h-4 w-4 text-muted-foreground" /></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                {teachers.length === 0 ? "No teachers yet. Click 'Add Teacher' to start." : "No match."}
              </TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Teacher Profile</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display text-xl font-bold">
                  {selected.full_name.split(" ").filter(n => n.length > 2).map(n => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">{selected.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{selected.employee_id}</p>
                  <Badge className={selected.status === "Active" ? "bg-success text-success-foreground" : "bg-accent text-accent-foreground"}>{selected.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-muted-foreground" /><span>{selected.subject}</span></div>
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /><span>{selected.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /><span>{selected.phone}</span></div>
                <div><span className="text-muted-foreground">Classes:</span> {selected.classes}</div>
                <div><span className="text-muted-foreground">Qualification:</span> {selected.qualification}</div>
                <div><span className="text-muted-foreground">Joined:</span> {selected.join_date}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
