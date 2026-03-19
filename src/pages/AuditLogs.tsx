import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockAuditLogs } from "@/data/mockData";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";

const actionIcon = (action: string) => {
  if (action === "CREATE") return <Plus className="h-3.5 w-3.5 text-success" />;
  if (action === "UPDATE") return <Edit className="h-3.5 w-3.5 text-info" />;
  if (action === "DELETE") return <Trash2 className="h-3.5 w-3.5 text-destructive" />;
  return <FileText className="h-3.5 w-3.5 text-muted-foreground" />;
};

const actionColor = (action: string) => {
  if (action === "CREATE") return "bg-success/10 text-success border-success/20";
  if (action === "UPDATE") return "bg-info/10 text-info border-info/20";
  if (action === "DELETE") return "bg-destructive/10 text-destructive border-destructive/20";
  return "bg-muted text-muted-foreground";
};

export default function AuditLogs() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Audit Logs</h1>
        <p className="text-muted-foreground text-sm">Track all system activity and changes</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Target</TableHead>
              <TableHead className="hidden md:table-cell">Details</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLogs.map(log => (
              <TableRow key={log.id} className="hover:bg-secondary/30">
                <TableCell>
                  <div className="flex items-center gap-2">
                    {actionIcon(log.action)}
                    <Badge variant="outline" className={actionColor(log.action)}>{log.action}</Badge>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{log.userName}</TableCell>
                <TableCell><Badge variant="outline">{log.target}</Badge></TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-xs truncate">{log.details}</TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
