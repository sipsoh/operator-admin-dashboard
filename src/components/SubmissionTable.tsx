import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, Status } from "./StatusBadge";
import { MoreHorizontal, Eye, Edit, MessageSquare, Calendar, Building, User, ChevronDown, ChevronRight, Filter, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewDetailsDialog } from "./ViewDetailsDialog";
import { EditStatusDialog } from "./EditStatusDialog";
import { AddCommentDialog } from "./AddCommentDialog";
import { useToast } from "@/hooks/use-toast";
import { mockData, filterSubmissions, type Submission } from "@/lib/data";

// Using mockData from shared lib

const priorityColors = {
  high: "bg-danger/10 text-danger border-danger/30",
  medium: "bg-warning/10 text-warning border-warning/30", 
  low: "bg-success/10 text-success border-success/30"
};

interface SubmissionTableProps {
  statusFilter?: string;
  reportTypeFilter?: string;
  dateRangeFilter?: string;
  searchQuery?: string;
}

export const SubmissionTable = ({ 
  statusFilter = "all", 
  reportTypeFilter = "all", 
  dateRangeFilter = "all",
  searchQuery = ""
}: SubmissionTableProps) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();

  // Mock data with state - in real app this would come from a state management system
  const [submissions, setSubmissions] = useState<Submission[]>(mockData);

  // Column filters state
  const [columnFilters, setColumnFilters] = useState({
    operator: "all",
    category: "all",
    reportType: "all", 
    reportParty: "all",
    frequency: "all",
    period: "all",
    leaseName: "all",
    properties: "all",
    status: "all",
    reviewerApprover: "all"
  });

  // Get unique values for each column
  const getUniqueValues = (field: keyof Submission) => {
    const values = [...new Set(submissions.map(sub => sub[field] as string))];
    return values.filter(value => value && value.trim() !== "").sort();
  };

  const updateColumnFilter = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const clearAllFilters = () => {
    setColumnFilters({
      operator: "all",
      category: "all",
      reportType: "all", 
      reportParty: "all",
      frequency: "all",
      period: "all",
      leaseName: "all",
      properties: "all",
      status: "all",
      reviewerApprover: "all"
    });
  };

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
  const filteredData = filterSubmissions(submissions, {
    searchQuery,
    statusFilter,
    reportTypeFilter,
    dateRangeFilter
  }).filter((submission) => {
    // Additional column filters
    if (columnFilters.operator !== "all" && submission.operator !== columnFilters.operator) return false;
    if (columnFilters.category !== "all" && submission.category !== columnFilters.category) return false;
    if (columnFilters.reportType !== "all" && submission.reportType !== columnFilters.reportType) return false;
    if (columnFilters.reportParty !== "all" && submission.reportParty !== columnFilters.reportParty) return false;
    if (columnFilters.frequency !== "all" && submission.frequency !== columnFilters.frequency) return false;
    if (columnFilters.period !== "all" && submission.period !== columnFilters.period) return false;
    if (columnFilters.leaseName !== "all" && submission.leaseName !== columnFilters.leaseName) return false;
    if (columnFilters.properties !== "all" && submission.properties !== columnFilters.properties) return false;
    if (columnFilters.status !== "all" && submission.status !== columnFilters.status) return false;
    if (columnFilters.reviewerApprover !== "all" && submission.reviewerApprover !== columnFilters.reviewerApprover) return false;
    
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

  // Initialize expanded operators state (all expanded by default)
  const [expandedOperators, setExpandedOperators] = useState<Set<string>>(
    new Set(Object.keys(groupedData))
  );

  // Toggle expand/collapse for an operator
  const toggleOperator = (operator: string) => {
    setExpandedOperators(prev => {
      const newSet = new Set(prev);
      if (newSet.has(operator)) {
        newSet.delete(operator);
      } else {
        newSet.add(operator);
      }
      return newSet;
    });
  };

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
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 pt-6">
                </TableHead>
                <TableHead className="font-semibold min-w-[200px] pt-6">
                  <div className="space-y-1">
                    <div>Operator</div>
                    <Select value={columnFilters.operator} onValueChange={(value) => updateColumnFilter("operator", value)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueValues("operator").map(value => (
                          <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[180px] pt-6">
                  <div className="space-y-1">
                    <div>Category</div>
                    <Select value={columnFilters.category} onValueChange={(value) => updateColumnFilter("category", value)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueValues("category").map(value => (
                          <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[200px] pt-6">
                  <div className="space-y-1">
                    <div>Report Type</div>
                    <Select value={columnFilters.reportType} onValueChange={(value) => updateColumnFilter("reportType", value)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueValues("reportType").map(value => (
                          <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[120px] pt-6">
                  <div className="space-y-1">
                    <div>Report Party</div>
                    <Select value={columnFilters.reportParty} onValueChange={(value) => updateColumnFilter("reportParty", value)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueValues("reportParty").map(value => (
                          <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[140px] pt-6">
                  <div className="space-y-1">
                    <div>Frequency</div>
                    <Select value={columnFilters.frequency} onValueChange={(value) => updateColumnFilter("frequency", value)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueValues("frequency").map(value => (
                          <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[120px] pt-6">Due Date</TableHead>
                <TableHead className="font-semibold min-w-[120px] pt-6">
                  <div className="space-y-1">
                    <div>Period</div>
                    <Select value={columnFilters.period} onValueChange={(value) => updateColumnFilter("period", value)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueValues("period").map(value => (
                          <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[180px] pt-6">
                  <div className="space-y-1">
                    <div>Lease Name</div>
                    <Select value={columnFilters.leaseName} onValueChange={(value) => updateColumnFilter("leaseName", value)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueValues("leaseName").map(value => (
                          <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[140px] pt-6">
                  <div className="space-y-1">
                    <div>Properties</div>
                    <Select value={columnFilters.properties} onValueChange={(value) => updateColumnFilter("properties", value)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueValues("properties").map(value => (
                          <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[120px] pt-6">Received Date</TableHead>
                <TableHead className="font-semibold min-w-[120px] pt-6">
                  <div className="space-y-1">
                    <div>Status</div>
                    <Select value={columnFilters.status} onValueChange={(value) => updateColumnFilter("status", value)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueValues("status").map(value => (
                          <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[140px] pt-6">
                  <div className="space-y-1">
                    <div>Reviewer/Approver</div>
                    <Select value={columnFilters.reviewerApprover} onValueChange={(value) => updateColumnFilter("reviewerApprover", value)}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueValues("reviewerApprover").map(value => (
                          <SelectItem key={value} value={value}>{value}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[120px] pt-6"># of Days under Status</TableHead>
                <TableHead className="font-semibold min-w-[200px] pt-6">Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedData).map(([operator, submissions]) => (
                <>
                  {/* Operator Header Row */}
                  <TableRow 
                    key={`header-${operator}`} 
                    className="bg-muted/50 border-b-2 border-border cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => toggleOperator(operator)}
                  >
                    <TableCell colSpan={15} className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {expandedOperators.has(operator) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
                        )}
                        <div className="font-bold text-foreground text-sm uppercase tracking-wide">
                          {operator}
                        </div>
                        <div className="text-xs text-muted-foreground ml-2">
                          ({submissions.length} {submissions.length === 1 ? 'item' : 'items'})
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Operator Submissions - Only show when expanded */}
                  {expandedOperators.has(operator) && 
                    submissions.map((submission, index) => (
                      <TableRow 
                        key={submission.id} 
                        className="hover:bg-muted/30 transition-smooth cursor-pointer animate-fade-in"
                      >
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
                      </TableRow>
                    ))
                  }
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