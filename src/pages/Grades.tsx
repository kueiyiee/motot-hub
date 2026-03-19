import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockGrades, mockStudents, scoreToGrade, scoreToGPA } from "@/data/mockData";
import { useSchool } from "@/contexts/SchoolContext";
import { Search, Download, FileText } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ClipboardList, TrendingUp, Award } from "lucide-react";

export default function Grades() {
  const [search, setSearch] = useState("");
  const [termFilter, setTermFilter] = useState("all");
  const { settings } = useSchool();

  const filtered = mockGrades.filter(g => {
    const matchSearch = g.studentName.toLowerCase().includes(search.toLowerCase()) ||
      g.courseName.toLowerCase().includes(search.toLowerCase());
    const matchTerm = termFilter === "all" || g.term === termFilter;
    return matchSearch && matchTerm;
  });

  const avgScore = filtered.length > 0 ? Math.round(filtered.reduce((a, g) => a + g.score, 0) / filtered.length) : 0;
  const avgGPA = filtered.length > 0 ? (filtered.reduce((a, g) => a + scoreToGPA(g.score), 0) / filtered.length).toFixed(2) : "0.00";
  const topScorer = filtered.length > 0 ? filtered.reduce((a, b) => a.score > b.score ? a : b) : null;

  const gradeColor = (score: number) => {
    if (score >= 80) return "text-success font-semibold";
    if (score >= 60) return "text-foreground";
    return "text-destructive font-semibold";
  };

  // Group by student for transcript view
  const studentGrades = filtered.reduce((acc, g) => {
    if (!acc[g.studentId]) acc[g.studentId] = { name: g.studentName, grades: [] };
    acc[g.studentId].grades.push(g);
    return acc;
  }, {} as Record<string, { name: string; grades: typeof mockGrades }>);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Grades & Transcripts</h1>
          <p className="text-muted-foreground text-sm">{settings.currentTerm} {settings.currentYear} Academic Results</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1"><Download className="h-4 w-4" /> Export Results</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Records" value={filtered.length} icon={ClipboardList} />
        <StatCard title="Average Score" value={`${avgScore}%`} icon={TrendingUp} trend={`GPA: ${avgGPA}`} trendUp={Number(avgGPA) >= 3.0} />
        <StatCard title="Top Score" value={topScorer ? `${topScorer.score}%` : "N/A"} icon={Award} trend={topScorer?.studentName} trendUp />
      </div>

      {/* Filters */}
      <Card className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by student or course name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={termFilter} onValueChange={setTermFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Term" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Terms</SelectItem>
              <SelectItem value="Term 1">Term 1</SelectItem>
              <SelectItem value="Term 2">Term 2</SelectItem>
              <SelectItem value="Term 3">Term 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Results Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="hidden md:table-cell">Grade Level</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead className="text-center">Letter</TableHead>
              <TableHead className="text-center">GPA</TableHead>
              <TableHead className="hidden md:table-cell">Term</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(g => (
              <TableRow key={g.id} className="hover:bg-secondary/30">
                <TableCell className="font-medium">{g.studentName}</TableCell>
                <TableCell>{g.courseName}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{g.grade}</TableCell>
                <TableCell className={`text-center ${gradeColor(g.score)}`}>{g.score}/{g.maxScore}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={gradeColor(g.score)}>{scoreToGrade(g.score)}</Badge>
                </TableCell>
                <TableCell className={`text-center font-display font-bold ${gradeColor(g.score)}`}>{scoreToGPA(g.score).toFixed(1)}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{g.term} {g.year}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No grade records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Student GPA Summary */}
      <div className="mt-6">
        <h2 className="font-display font-semibold text-lg mb-4">Student GPA Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(studentGrades).map(([id, data]) => {
            const avg = data.grades.reduce((a, g) => a + scoreToGPA(g.score), 0) / data.grades.length;
            const avgPct = Math.round(data.grades.reduce((a, g) => a + g.score, 0) / data.grades.length);
            return (
              <Card key={id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{data.name}</h3>
                  <Badge className={avg >= 3.0 ? "bg-success text-success-foreground" : avg >= 2.0 ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"}>
                    GPA: {avg.toFixed(2)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${avgPct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{avgPct}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{data.grades.length} courses</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
