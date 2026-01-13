import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge, ComplaintStatus } from "./StatusBadge";
import { Calendar, MapPin, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComplaintCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: ComplaintStatus;
  date: string;
  studentName?: string;
  onClick?: () => void;
  className?: string;
}

export function ComplaintCard({
  title,
  description,
  category,
  location,
  status,
  date,
  studentName,
  onClick,
  className,
}: ComplaintCardProps) {
  return (
    <Card
      className={cn(
        "card-hover cursor-pointer group border-border/50 hover:border-primary/30",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md">
                {category}
              </span>
              <StatusBadge status={status} />
            </div>
            <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
          {studentName && (
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{studentName}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
