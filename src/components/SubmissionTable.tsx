import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, Status } from "./StatusBadge";
import { MoreHorizontal, Eye, Edit, MessageSquare, Calendar, Building, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ViewDetailsDialog } from "./ViewDetailsDialog";
import { EditStatusDialog } from "./EditStatusDialog";
import { AddCommentDialog } from "./AddCommentDialog";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  operator: string;
  entity: string;
  reportType: string;
  status: Status;
  dueDate: string;
  submittedDate?: string;
  reviewer: string;
  priority: "high" | "medium" | "low";
  notes?: string;
}

const mockData: Submission[] = [
  {
    id: "SUB-001",
    operator: "Metro Properties LLC",
    entity: "Building A Complex",
    reportType: "Monthly Financial",
    status: "approved",
    dueDate: "2024-01-15",
    submittedDate: "2024-01-12",
    reviewer: "Sarah Johnson",
    priority: "high"
  },
  {
    id: "SUB-002",
    operator: "Eastside Management",
    entity: "Retail Plaza East",
    reportType: "Rent Schedule",
    status: "pending",
    dueDate: "2024-01-20",
    submittedDate: "2024-01-18",
    reviewer: "Mike Chen",
    priority: "medium"
  },
  {
    id: "SUB-003",
    operator: "Harbor Point Group",
    entity: "Waterfront Tower",
    reportType: "Lease Agreement",
    status: "non-compliant",
    dueDate: "2024-01-10",
    submittedDate: "2024-01-15",
    reviewer: "Lisa Wong",
    priority: "high",
    notes: "Missing required signatures"
  },
  {
    id: "SUB-004",
    operator: "Northgate Associates",
    entity: "Office Complex North",
    reportType: "Quarterly Review",
    status: "overdue",
    dueDate: "2024-01-05",
    reviewer: "David Park",
    priority: "high"
  },
  {
    id: "SUB-005",
    operator: "Sunset Commercial",
    entity: "Shopping Center West",
    reportType: "Monthly Financial",
    status: "in-review",
    dueDate: "2024-01-25",
    submittedDate: "2024-01-23",
    reviewer: "Anna Rodriguez",
    priority: "low"
  },
  {
    id: "SUB-006",
    operator: "Central Business Park",
    entity: "Corporate Campus",
    reportType: "Insurance Documents",
    status: "submitted",
    dueDate: "2024-01-30",
    submittedDate: "2024-01-28",
    reviewer: "Tom Wilson",
    priority: "medium"
  }
];

const priorityColors = {
  high: "bg-danger/10 text-danger border-danger/30",
  medium: "bg-warning/10 text-warning border-warning/30", 
  low: "bg-success/10 text-success border-success/30"
};

interface SubmissionTableProps {
  statusFilter?: string;
  reportTypeFilter?: string;
  dateRangeFilter?: string;
}

export const SubmissionTable = ({ 
  statusFilter = "all", 
  reportTypeFilter = "all", 
  dateRangeFilter = "all" 
}: SubmissionTableProps) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();

  // Mock data with state - in real app this would come from a state management system
  const [submissions, setSubmissions] = useState<Submission[]>(mockData);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Filter the data based on the active filters  
  const filteredData = submissions.filter((submission) => {
    // Status filter
    if (statusFilter !== "all" && statusFilter !== "operators") {
      if (submission.status !== statusFilter) return false;
    }
    
    // Report type filter
    if (reportTypeFilter !== "all") {
      const reportTypeKey = submission.reportType.toLowerCase().replace(/\s+/g, '-');
      if (reportTypeKey !== reportTypeFilter) return false;
    }
    
    // Date range filter would go here (currently just showing all data)
    // This would typically filter by submission date or due date based on dateRangeFilter
    
    return true;
  });

  // Dialog handlers
  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setViewDetailsOpen(true);
  };

  const handleEditStatus = (submission: Submission) => {
    setSelectedSubmission(submission);
    setEditStatusOpen(true);
  };

  const handleAddComment = (submission: Submission) => {
    setSelectedSubmission(submission);
    setAddCommentOpen(true);
  };

  const handleStatusUpdate = (submissionId: string, newStatus: Status, reason: string) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: newStatus, notes: sub.notes ? `${sub.notes}\n\nStatus changed to ${newStatus}: ${reason}` : `Status changed to ${newStatus}: ${reason}` }
          : sub
      )
    );
  };

  const handleCommentAdd = (submissionId: string, comment: string, commentType: string) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, notes: sub.notes ? `${sub.notes}\n\n[${commentType}] ${comment}` : `[${commentType}] ${comment}` }
          : sub
      )
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Building className="h-5 w-5 mr-2 text-primary" />
            Operator Submissions Tracking
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {filteredData.length} Total Entries
            </Badge>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              This Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Operator / Entity</TableHead>
                <TableHead className="font-semibold">Report Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="font-semibold">Submitted</TableHead>
                <TableHead className="font-semibold">Reviewer</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((submission) => (
                <TableRow 
                  key={submission.id} 
                  className="hover:bg-muted/30 transition-smooth cursor-pointer"
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{submission.operator}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {submission.entity}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {submission.reportType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={submission.status} />
                      {submission.status === "overdue" && (
                        <span className="text-xs text-danger font-medium">
                          {getDaysOverdue(submission.dueDate)}d overdue
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(submission.dueDate)}
                      {submission.status === "overdue" && (
                        <div className="text-xs text-danger mt-1">
                          Past due
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {submission.submittedDate ? (
                      <div className="text-sm">
                        {formatDate(submission.submittedDate)}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{submission.reviewer}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs font-medium ${priorityColors[submission.priority]}`}
                    >
                      {submission.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                       <DropdownMenuContent align="end">
                         <DropdownMenuItem onClick={() => handleViewDetails(submission)}>
                           <Eye className="h-4 w-4 mr-2" />
                           View Details
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleEditStatus(submission)}>
                           <Edit className="h-4 w-4 mr-2" />
                           Edit Status
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleAddComment(submission)}>
                           <MessageSquare className="h-4 w-4 mr-2" />
                           Add Comment
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </div>
       </CardContent>

       {/* Dialog Components */}
       <ViewDetailsDialog
         submission={selectedSubmission}
         open={viewDetailsOpen}
         onOpenChange={setViewDetailsOpen}
       />
       
       <EditStatusDialog
         submissionId={selectedSubmission?.id || null}
         currentStatus={selectedSubmission?.status || null}
         open={editStatusOpen}
         onOpenChange={setEditStatusOpen}
         onStatusUpdate={handleStatusUpdate}
       />
       
       <AddCommentDialog
         submissionId={selectedSubmission?.id || null}
         operatorName={selectedSubmission?.operator || null}
         open={addCommentOpen}
         onOpenChange={setAddCommentOpen}
         onCommentAdd={handleCommentAdd}
       />
     </Card>
   );
 };