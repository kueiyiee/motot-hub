import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSchool } from "@/contexts/SchoolContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building, Key, Shield, GraduationCap, BookOpen, Upload, Camera,
  School, Calendar, Hash, Globe, Phone, Mail, MapPin, Sparkles
} from "lucide-react";

export default function Settings() {
  const { settings, updateSettings, uploadLogo, allGrades, departmentsList } = useSchool();
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState(settings);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin = user?.role === "admin" || isSuperAdmin;

  const handleSave = () => {
    updateSettings(form);
    toast({ title: "Settings saved", description: "School settings have been updated successfully." });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Logo must be under 2MB", variant: "destructive" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload a PNG or JPG image", variant: "destructive" });
      return;
    }

    setUploading(true);
    const url = await uploadLogo(file);
    if (url) {
      setForm(prev => ({ ...prev, logo: url, logoUrl: url }));
      toast({ title: "Logo updated", description: "School logo has been changed successfully." });
    } else {
      toast({ title: "Upload failed", description: "Could not upload logo. Please try again.", variant: "destructive" });
    }
    setUploading(false);
  };

  const roles = [
    { role: "super_admin", label: "Super Admin", desc: "Full system control, manage all users/roles, system settings, audit logs", color: "bg-destructive/10 text-destructive" },
    { role: "admin", label: "Admin", desc: "Manage students, teachers, courses, school information, edit any record", color: "bg-primary/10 text-primary" },
    { role: "registrar", label: "Registrar", desc: "Register students, generate IDs, manage records, approve registrations", color: "bg-info/10 text-info" },
    { role: "teacher", label: "Teacher", desc: "Manage courses, record attendance, upload grades, post materials", color: "bg-success/10 text-success" },
    { role: "student", label: "Student", desc: "View profile, grades, attendance, register courses, download transcripts", color: "bg-accent/10 text-accent-foreground" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage school settings, roles, academic structure, and system configuration</p>
      </div>

      <Tabs defaultValue="school" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="school" className="gap-1"><Building className="h-3.5 w-3.5" /> School Info</TabsTrigger>
          <TabsTrigger value="academic" className="gap-1"><GraduationCap className="h-3.5 w-3.5" /> Academic</TabsTrigger>
          <TabsTrigger value="roles" className="gap-1"><Shield className="h-3.5 w-3.5" /> Roles</TabsTrigger>
          <TabsTrigger value="system" className="gap-1"><Key className="h-3.5 w-3.5" /> System</TabsTrigger>
        </TabsList>

        {/* ====== SCHOOL INFO TAB ====== */}
        <TabsContent value="school">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">School Information</CardTitle>
              <CardDescription>Update school name, logo, contact information, and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Section */}
              <div className="flex items-center gap-6 p-4 rounded-lg border border-dashed border-primary/30 bg-primary/5">
                <div className="relative group">
                  <img
                    src={form.logo || settings.logo}
                    alt="School Logo"
                    className="h-20 w-20 rounded-full object-cover border-2 border-primary/20"
                  />
                  {isAdmin && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-foreground/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={uploading}
                    >
                      <Camera className="h-6 w-6 text-background" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold">{form.name}</h3>
                  <p className="text-sm text-muted-foreground">{form.subtitle}</p>
                  {isAdmin && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 gap-1"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {uploading ? "Uploading..." : "Change Logo"}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP, max 2MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* School Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="flex items-center gap-1"><School className="h-3.5 w-3.5" /> School Name</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} disabled={!isAdmin} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Subtitle / Tagline</Label>
                  <Input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} disabled={!isAdmin} placeholder="e.g. Secondary & Primary School" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> School Motto</Label>
                  <Input value={form.motto} onChange={e => setForm({ ...form, motto: e.target.value })} disabled={!isAdmin} />
                </div>
                <div className="grid gap-1.5">
                  <Label className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email</Label>
                  <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} disabled={!isAdmin} />
                </div>
                <div className="grid gap-1.5">
                  <Label className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} disabled={!isAdmin} />
                </div>
                <div className="grid gap-1.5">
                  <Label className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Address</Label>
                  <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} disabled={!isAdmin} />
                </div>
              </div>

              {isAdmin && (
                <Button onClick={handleSave} className="bg-primary text-primary-foreground">Save School Info</Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====== ACADEMIC TAB ====== */}
        <TabsContent value="academic">
          <div className="space-y-4">
            {/* School Level */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">School Structure</CardTitle>
                <CardDescription>Configure whether this is a Primary, Secondary, or combined school</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label>School Level</Label>
                    <Select value={form.schoolLevel} onValueChange={v => setForm({ ...form, schoolLevel: v })} disabled={!isAdmin}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary Only</SelectItem>
                        <SelectItem value="secondary">Secondary Only</SelectItem>
                        <SelectItem value="both">Primary & Secondary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Grading System</Label>
                    <Select value={form.gradingSystem} onValueChange={v => setForm({ ...form, gradingSystem: v })} disabled={!isAdmin}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (0-100%)</SelectItem>
                        <SelectItem value="letter">Letter Grade (A-F)</SelectItem>
                        <SelectItem value="gpa">GPA (0.0-4.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(form.schoolLevel === "primary" || form.schoolLevel === "both") && (
                  <div className="p-4 rounded-lg border bg-success/5 border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-success" />
                      <Label className="font-medium text-success">Primary Section Grades</Label>
                    </div>
                    <Input
                      value={form.primaryGrades}
                      onChange={e => setForm({ ...form, primaryGrades: e.target.value })}
                      disabled={!isAdmin}
                      placeholder="Class 1,Class 2,Class 3,..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">Comma-separated grade names for primary section</p>
                  </div>
                )}

                {(form.schoolLevel === "secondary" || form.schoolLevel === "both") && (
                  <div className="p-4 rounded-lg border bg-info/5 border-info/20">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-4 w-4 text-info" />
                      <Label className="font-medium text-info">Secondary Section Grades</Label>
                    </div>
                    <Input
                      value={form.secondaryGrades}
                      onChange={e => setForm({ ...form, secondaryGrades: e.target.value })}
                      disabled={!isAdmin}
                      placeholder="Form 1,Form 2,Form 3,Form 4"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Comma-separated grade names for secondary section</p>
                  </div>
                )}

                {isAdmin && (
                  <Button onClick={handleSave} className="bg-primary text-primary-foreground">Save Academic Settings</Button>
                )}
              </CardContent>
            </Card>

            {/* Term & Year */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Academic Calendar</CardTitle>
                <CardDescription>Set current term, year, and academic period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-1.5">
                    <Label className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Current Term</Label>
                    <Select value={form.currentTerm} onValueChange={v => setForm({ ...form, currentTerm: v })} disabled={!isAdmin}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Term 1">Term 1</SelectItem>
                        <SelectItem value="Term 2">Term 2</SelectItem>
                        <SelectItem value="Term 3">Term 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Current Year</Label>
                    <Input value={form.currentYear} onChange={e => setForm({ ...form, currentYear: e.target.value })} disabled={!isAdmin} />
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="flex items-center gap-1"><Hash className="h-3.5 w-3.5" /> Student ID Format</Label>
                    <Input value={form.studentIdFormat} onChange={e => setForm({ ...form, studentIdFormat: e.target.value })} disabled={!isAdmin} />
                    <p className="text-xs text-muted-foreground">Use {"{YEAR}"} and {"{SEQ}"} as placeholders</p>
                  </div>
                </div>
                {isAdmin && (
                  <Button onClick={handleSave} className="bg-primary text-primary-foreground">Save Calendar Settings</Button>
                )}
              </CardContent>
            </Card>

            {/* Departments */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Departments</CardTitle>
                <CardDescription>Manage academic departments for course organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={form.departments}
                  onChange={e => setForm({ ...form, departments: e.target.value })}
                  disabled={!isAdmin}
                  placeholder="Sciences,Languages,Humanities,Mathematics,Technical"
                />
                <p className="text-xs text-muted-foreground">Comma-separated department names</p>
                <div className="flex flex-wrap gap-2">
                  {form.departments.split(",").map(d => d.trim()).filter(Boolean).map(dept => (
                    <Badge key={dept} variant="outline" className="bg-primary/5">{dept}</Badge>
                  ))}
                </div>
                {isAdmin && (
                  <Button onClick={handleSave} className="bg-primary text-primary-foreground">Save Departments</Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ====== ROLES TAB ====== */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Role-Based Access Control</CardTitle>
              <CardDescription>System roles and their permissions — enforced via backend security policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roles.map(r => (
                  <div key={r.role} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Badge className={r.color}>{r.label}</Badge>
                      <p className="text-sm text-muted-foreground">{r.desc}</p>
                    </div>
                    {user?.role === r.role && <Badge variant="outline" className="text-xs">Current</Badge>}
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h3 className="font-display font-semibold text-sm mb-2">Role Capabilities Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>✅ <strong>Super Admin:</strong> All features + user management + audit logs</div>
                  <div>✅ <strong>Admin:</strong> Students, teachers, courses, grades, settings</div>
                  <div>✅ <strong>Registrar:</strong> Student registration, ID generation, records</div>
                  <div>✅ <strong>Teacher:</strong> Courses, grades, attendance for assigned classes</div>
                  <div>✅ <strong>Student:</strong> View own profile, grades, attendance, courses</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====== SYSTEM TAB ====== */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">System Configuration</CardTitle>
              <CardDescription>Backend, data, and advanced system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-success/30 bg-success/5">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-success" />
                  <p className="font-medium text-sm text-success">Lovable Cloud Active</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Database, authentication, file storage, and backend functions are all active and managed automatically.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <p className="text-sm font-medium mb-1">Active Grades</p>
                  <div className="flex flex-wrap gap-1">
                    {allGrades.map(g => (
                      <Badge key={g} variant="outline" className="text-xs">{g}</Badge>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-sm font-medium mb-1">Departments</p>
                  <div className="flex flex-wrap gap-1">
                    {departmentsList.map(d => (
                      <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-muted-foreground">School Level</p>
                  <p className="font-medium capitalize">{settings.schoolLevel === "both" ? "Primary & Secondary" : settings.schoolLevel}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-muted-foreground">Grading System</p>
                  <p className="font-medium capitalize">{settings.gradingSystem}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-muted-foreground">Student ID Format</p>
                  <p className="font-medium font-mono text-xs">{settings.studentIdFormat}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
