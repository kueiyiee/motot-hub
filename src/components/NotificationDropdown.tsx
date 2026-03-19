import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { mockNotifications } from "@/data/mockData";

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
};

const colorMap = {
  info: "text-info",
  warning: "text-warning",
  success: "text-success",
  error: "text-destructive",
};

export function NotificationDropdown() {
  const unread = mockNotifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-md hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px]">
              {unread}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <h3 className="font-display font-semibold text-sm">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thin">
          {mockNotifications.map(n => {
            const Icon = iconMap[n.type];
            return (
              <div key={n.id} className={`px-3 py-2.5 border-b last:border-0 hover:bg-secondary/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
                <div className="flex gap-2.5">
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colorMap[n.type]}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(n.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
