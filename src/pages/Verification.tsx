import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockStudents } from "@/data/mockData";
import { useSchool } from "@/contexts/SchoolContext";
import { Search, CheckCircle, XCircle, Shield } from "lucide-react";

export default function Verification() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<typeof mockStudents[0] | null | "not_found">(null);
  const [searched, setSearched] = useState(false);
  const { settings } = useSchool();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = mockStudents.find(
      s => s.admissionNo.toLowerCase() === query.trim().toLowerCase()
    );
    setResult(found || "not_found");
    setSearched(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Student Verification</h1>
        <p className="text-muted-foreground text-sm">Public verification portal — verify student enrollment status</p>
      </div>

      <div className="max-w-xl mx-auto">
        <Card className="p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-display font-bold text-xl mb-1">{settings.name}</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter a student's admission number to verify their enrollment status</p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. MOT-2024-001"
                value={query}
                onChange={e => { setQuery(e.target.value); setSearched(false); }}
                className="pl-9"
              />
            </div>
            <Button type="submit" className="bg-primary text-primary-foreground">Verify</Button>
          </form>
        </Card>

        {searched && result && result !== "not_found" && (
          <Card className="p-6 mt-4 border-success/30">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="font-display font-bold text-lg text-success">Verified Student</p>
                <p className="text-xs text-muted-foreground">This student is registered at {settings.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Name:</span> <strong>{result.name}</strong></div>
              <div><span className="text-muted-foreground">Adm No:</span> <strong>{result.admissionNo}</strong></div>
              <div><span className="text-muted-foreground">Grade:</span> <strong>{result.grade} {result.section}</strong></div>
              <div>
                <span className="text-muted-foreground">Status:</span>{" "}
                <Badge className={result.status === "Active" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                  {result.status}
                </Badge>
              </div>
              <div><span className="text-muted-foreground">Admitted:</span> <strong>{result.admissionDate}</strong></div>
              <div><span className="text-muted-foreground">Gender:</span> <strong>{result.gender}</strong></div>
            </div>
          </Card>
        )}

        {searched && result === "not_found" && (
          <Card className="p-6 mt-4 border-destructive/30">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="font-display font-bold text-lg text-destructive">Not Found</p>
                <p className="text-sm text-muted-foreground">No student found with admission number "{query}"</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
