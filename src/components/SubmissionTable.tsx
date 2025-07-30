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
  category: string;
  reportType: string;
  reportParty: string;
  frequency: string;
  dueDate: string;
  period: string;
  leaseName: string;
  properties: string;
  receivedDate?: string;
  status: Status;
  reviewerApprover: string;
  daysUnderStatus: number;
  comments?: string;
}

const mockData: Submission[] = [
  // ADVANCED RECOVERY SYSTEMS
  {
    id: "SUB-001",
    operator: "ADVANCED RECOVERY SYSTEMS",
    category: "Budgets",
    reportType: "Operating & Capital Budgets",
    reportParty: "Tenant",
    frequency: "Annual Budget",
    dueDate: "12/01/2024",
    period: "2025",
    leaseName: "L_ARS",
    properties: "All",
    receivedDate: "12/01/2024",
    status: "approved",
    reviewerApprover: "Melissa",
    daysUnderStatus: 0,
    comments: ""
  },
  {
    id: "SUB-002",
    operator: "ADVANCED RECOVERY SYSTEMS",
    category: "Budgets",
    reportType: "Operating & Capital Budgets",
    reportParty: "Tenant",
    frequency: "Annual Budget",
    dueDate: "12/01/2024",
    period: "2025",
    leaseName: "L_ARS",
    properties: "All",
    receivedDate: "12/01/2024",
    status: "approved",
    reviewerApprover: "Melissa",
    daysUnderStatus: 0,
    comments: ""
  },
  {
    id: "SUB-003",
    operator: "ADVANCED RECOVERY SYSTEMS",
    category: "Financial Reports & Calculations",
    reportType: "Annual & Qtrly Financials",
    reportParty: "Tenant",
    frequency: "Annual",
    dueDate: "05/30/2024",
    period: "2024",
    leaseName: "L_ARS",
    properties: "All",
    receivedDate: "5/29/2025",
    status: "approved",
    reviewerApprover: "Melissa",
    daysUnderStatus: 25,
    comments: ""
  },
  {
    id: "SUB-004",
    operator: "ADVANCED RECOVERY SYSTEMS",
    category: "Operational Reports",
    reportType: "Capital Expenditures Report",
    reportParty: "Tenant",
    frequency: "Annual",
    dueDate: "11/30/2024",
    period: "2023/2024",
    leaseName: "L_ARS",
    properties: "All",
    receivedDate: "11/30/2024",
    status: "pending",
    reviewerApprover: "Melissa",
    daysUnderStatus: 242,
    comments: ""
  },
  {
    id: "SUB-005",
    operator: "ADVANCED RECOVERY SYSTEMS",
    category: "Operational Reports",
    reportType: "Operating Licenses",
    reportParty: "Tenant",
    frequency: "Annual",
    dueDate: "6/15/24",
    period: "2024",
    leaseName: "L_ARS",
    properties: "All",
    receivedDate: "6/15/24",
    status: "in-review",
    reviewerApprover: "Yvonne",
    daysUnderStatus: 610,
    comments: ""
  },
  {
    id: "SUB-006",
    operator: "ADVANCED RECOVERY SYSTEMS",
    category: "Operational Reports",
    reportType: "Operating Licenses",
    reportParty: "Tenant",
    frequency: "Annual",
    dueDate: "6/15/24",
    period: "2024/2025",
    leaseName: "L_ARS",
    properties: "All",
    receivedDate: "6/15/24",
    status: "in-review",
    reviewerApprover: "Yvonne",
    daysUnderStatus: 410,
    comments: ""
  },
  // AGEWELL SOLVERE
  {
    id: "SUB-007",
    operator: "AGEWELL SOLVERE",
    category: "Operational Reports",
    reportType: "Operating Licenses",
    reportParty: "Tenant",
    frequency: "Annual",
    dueDate: "12/31/2024",
    period: "2023",
    leaseName: "L_Solvere_Lease_L_Solvere_Mgd",
    properties: "Monarch at Henderson",
    receivedDate: "12/31/24",
    status: "approved",
    reviewerApprover: "Christine",
    daysUnderStatus: 0,
    comments: ""
  },
  {
    id: "SUB-008",
    operator: "AGEWELL SOLVERE",
    category: "Operational Reports",
    reportType: "Operating Licenses",
    reportParty: "Tenant",
    frequency: "Annual",
    dueDate: "09/03/2024",
    period: "2023",
    leaseName: "L_Solvere_Mgd",
    properties: "Monarch at Cedar Park",
    receivedDate: "9/5/24",
    status: "approved",
    reviewerApprover: "Christine",
    daysUnderStatus: 0,
    comments: ""
  },
  // ANDREW RESIDENCE
  {
    id: "SUB-009",
    operator: "ANDREW RESIDENCE",
    category: "Budgets",
    reportType: "Operating & Capital Budgets",
    reportParty: "Tenant",
    frequency: "Annual Budget",
    dueDate: "12/02/2024",
    period: "2025",
    leaseName: "L_AndrewRes_LS0311",
    properties: "All",
    receivedDate: "12/1/24",
    status: "approved",
    reviewerApprover: "Debby",
    daysUnderStatus: 0,
    comments: ""
  },
  {
    id: "SUB-010",
    operator: "ANDREW RESIDENCE",
    category: "Budgets",
    reportType: "Operating & Capital Budgets",
    reportParty: "Tenant",
    frequency: "Annual Budget",
    dueDate: "12/02/2022",
    period: "2023",
    leaseName: "L_AndrewRes_LS0311",
    properties: "All",
    receivedDate: "12/1/22",
    status: "pending",
    reviewerApprover: "Debby",
    daysUnderStatus: 972,
    comments: "7/20/2023: Not approved - outstanding questions related to the"
  },
  // AVAMERE FAMILY
  {
    id: "SUB-011",
    operator: "AVAMERE FAMILY",
    category: "Budgets",
    reportType: "Operating & Capital Budgets",
    reportParty: "Tenant",
    frequency: "Annual Budget",
    dueDate: "12/17/2022",
    period: "2023",
    leaseName: "L_Avamere_LS0316",
    properties: "All",
    receivedDate: "12/17/2022",
    status: "approved",
    reviewerApprover: "Kara",
    daysUnderStatus: 0,
    comments: ""
  },
  {
    id: "SUB-012",
    operator: "AVAMERE FAMILY",
    category: "Budgets",
    reportType: "Operating & Capital Budgets",
    reportParty: "Tenant",
    frequency: "Annual Budget",
    dueDate: "12/17/2023",
    period: "2024",
    leaseName: "L_Avamere_LS0316",
    properties: "All",
    receivedDate: "12/17/2023",
    status: "approved",
    reviewerApprover: "Kara",
    daysUnderStatus: 0,
    comments: ""
  },
  {
    id: "SUB-013",
    operator: "AVAMERE FAMILY",
    category: "Financial Covenant",
    reportType: "Financial Covenant Lease",
    reportParty: "Tenant",
    frequency: "Annual",
    dueDate: "04/30/2021",
    period: "2020",
    leaseName: "L_Avamere_LS0316",
    properties: "All",
    receivedDate: "04/30/2021",
    status: "approved",
    reviewerApprover: "Eliza",
    daysUnderStatus: 0,
    comments: ""
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

  // Group the filtered data by operator
  const groupedData = filteredData.reduce((groups, submission) => {
    const operator = submission.operator;
    if (!groups[operator]) {
      groups[operator] = [];
    }
    groups[operator].push(submission);
    return groups;
  }, {} as Record<string, Submission[]>);

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
          ? { ...sub, status: newStatus, comments: sub.comments ? `${sub.comments}\n\nStatus changed to ${newStatus}: ${reason}` : `Status changed to ${newStatus}: ${reason}` }
          : sub
      )
    );
  };

  const handleCommentAdd = (submissionId: string, comment: string, commentType: string) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, comments: sub.comments ? `${sub.comments}\n\n[${commentType}] ${comment}` : `[${commentType}] ${comment}` }
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
                <TableHead className="font-semibold">Operator</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Report Type</TableHead>
                <TableHead className="font-semibold">Report Party</TableHead>
                <TableHead className="font-semibold">Frequency</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="font-semibold">Period</TableHead>
                <TableHead className="font-semibold">Lease Name</TableHead>
                <TableHead className="font-semibold">Properties</TableHead>
                <TableHead className="font-semibold">Received Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Reviewer/Approver</TableHead>
                <TableHead className="font-semibold"># of Days under Status</TableHead>
                <TableHead className="font-semibold">Comments</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedData).map(([operator, submissions]) => (
                <>
                  {/* Operator Header Row */}
                  <TableRow key={`header-${operator}`} className="bg-muted/50 border-b-2 border-border">
                    <TableCell colSpan={15} className="py-3 px-4">
                      <div className="font-bold text-foreground text-sm uppercase tracking-wide">
                        {operator}
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Operator Submissions */}
                  {submissions.map((submission, index) => (
                    <TableRow 
                      key={submission.id} 
                      className="hover:bg-muted/30 transition-smooth cursor-pointer"
                    >
                      <TableCell>
                        <div className="font-medium text-foreground">{submission.operator}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{submission.category}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-primary">
                          {submission.reportType}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{submission.reportParty}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{submission.frequency}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {submission.dueDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{submission.period}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{submission.leaseName}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{submission.properties}</span>
                      </TableCell>
                      <TableCell>
                        {submission.receivedDate ? (
                          <div className="text-sm">
                            {submission.receivedDate}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={submission.status} />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{submission.reviewerApprover}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-center">
                          {submission.daysUnderStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-40 truncate">
                          {submission.comments || "-"}
                        </div>
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
                 </>
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