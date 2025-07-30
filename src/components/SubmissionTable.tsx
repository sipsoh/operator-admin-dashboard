import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, Status } from "./StatusBadge";
import { MoreHorizontal, Eye, Edit, MessageSquare, Calendar, Building, User, ChevronDown, ChevronRight, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Expand, Minimize2 } from "lucide-react";
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
    frequency: "all",
    period: "all",
    leaseName: "all",
    properties: "all",
    status: "all",
    reviewerApprover: "all"
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Submission | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

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
      frequency: "all",
      period: "all",
      leaseName: "all",
      properties: "all",
      status: "all",
      reviewerApprover: "all"
    });
  };

  const handleSort = (key: keyof Submission) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof Submission) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1 text-primary" />
      : <ArrowDown className="h-3 w-3 ml-1 text-primary" />;
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

  // Filter and sort the data
  const filteredAndSortedData = filterSubmissions(submissions, {
    searchQuery,
    statusFilter,
    reportTypeFilter,
    dateRangeFilter
  }).filter((submission) => {
    // Additional column filters
    if (columnFilters.operator !== "all" && submission.operator !== columnFilters.operator) return false;
    if (columnFilters.category !== "all" && submission.category !== columnFilters.category) return false;
    if (columnFilters.reportType !== "all" && submission.reportType !== columnFilters.reportType) return false;
    
    if (columnFilters.frequency !== "all" && submission.frequency !== columnFilters.frequency) return false;
    if (columnFilters.period !== "all" && submission.period !== columnFilters.period) return false;
    if (columnFilters.leaseName !== "all" && submission.leaseName !== columnFilters.leaseName) return false;
    if (columnFilters.properties !== "all" && submission.properties !== columnFilters.properties) return false;
    if (columnFilters.status !== "all" && submission.status !== columnFilters.status) return false;
    if (columnFilters.reviewerApprover !== "all" && submission.reviewerApprover !== columnFilters.reviewerApprover) return false;
    
    return true;
  }).sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    // Handle date sorting
    if (sortConfig.key === 'dueDate' || sortConfig.key === 'receivedDate') {
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);
      return sortConfig.direction === 'asc' 
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }
    
    // Handle numeric sorting
    if (sortConfig.key === 'daysUnderStatus') {
      return sortConfig.direction === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }
    
    // Handle string sorting
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Group the filtered and sorted data by operator
  const groupedData = filteredAndSortedData.reduce((groups, submission) => {
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

  // Expand/Collapse all operators
  const expandAllOperators = () => {
    setExpandedOperators(new Set(Object.keys(groupedData)));
  };

  const collapseAllOperators = () => {
    setExpandedOperators(new Set());
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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Submissions</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={expandAllOperators}
              className="h-8 px-3 text-xs"
            >
              <Expand className="h-3 w-3 mr-1" />
              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={collapseAllOperators}
              className="h-8 px-3 text-xs"
            >
              <Minimize2 className="h-3 w-3 mr-1" />
              Collapse All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="relative">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 pt-6 sticky left-0 bg-muted/50 z-20">
                </TableHead>
                <TableHead className="font-semibold min-w-[200px] pt-6 sticky left-12 bg-muted/50 z-20">
                  <div className="space-y-1">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('operator')}>
                      Operator
                      {getSortIcon('operator')}
                    </div>
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
                <TableHead className="font-semibold min-w-[180px] pt-6 sticky left-[212px] bg-muted/50 z-20">
                  <div className="space-y-1">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('category')}>
                      Category
                      {getSortIcon('category')}
                    </div>
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
                <TableHead className="font-semibold min-w-[200px] pt-6 sticky left-[392px] bg-muted/50 z-20">
                  <div className="space-y-1">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('reportType')}>
                      Report Type
                      {getSortIcon('reportType')}
                    </div>
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
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('status')}>
                      Status
                      {getSortIcon('status')}
                    </div>
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
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('reviewerApprover')}>
                      Reviewer/Approver
                      {getSortIcon('reviewerApprover')}
                    </div>
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
                <TableHead className="font-semibold min-w-[120px] pt-6">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('dueDate')}>
                    Due Date
                    {getSortIcon('dueDate')}
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[120px] pt-6">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('receivedDate')}>
                    Received Date
                    {getSortIcon('receivedDate')}
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[120px] pt-6">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('daysUnderStatus')}>
                    # of Days under Status
                    {getSortIcon('daysUnderStatus')}
                  </div>
                </TableHead>
                <TableHead className="font-semibold min-w-[140px] pt-6">
                  <div className="space-y-1">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('frequency')}>
                      Frequency
                      {getSortIcon('frequency')}
                    </div>
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
                <TableHead className="font-semibold min-w-[120px] pt-6">
                  <div className="space-y-1">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('period')}>
                      Period
                      {getSortIcon('period')}
                    </div>
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
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('leaseName')}>
                      Lease Name
                      {getSortIcon('leaseName')}
                    </div>
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
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('properties')}>
                      Properties
                      {getSortIcon('properties')}
                    </div>
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
                <TableHead className="font-semibold min-w-[200px] pt-6">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('comments')}>
                    Comments
                    {getSortIcon('comments')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedData).map(([operator, submissions]) => (
                <React.Fragment key={operator}>
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
                        <TableCell className="sticky left-0 bg-card z-10">
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
                        <TableCell className="sticky left-12 bg-card z-10">
                          <div className="font-medium text-foreground">{submission.operator}</div>
                        </TableCell>
                        <TableCell className="sticky left-[212px] bg-card z-10">
                          <span className="text-sm">{submission.category}</span>
                        </TableCell>
                         <TableCell className="sticky left-[392px] bg-card z-10 text-left">
                           <button
                             className="text-sm font-medium text-report-type hover:text-report-type/80 underline cursor-pointer transition-colors text-left"
                             onClick={() => handleViewDetails(submission)}
                           >
                             {submission.reportType}
                           </button>
                         </TableCell>
                         <TableCell>
                           <StatusBadge status={submission.status} />
                         </TableCell>
                         <TableCell>
                           <span className="text-sm">{submission.reviewerApprover}</span>
                         </TableCell>
                         <TableCell>
                           <div className="text-sm">
                             {submission.dueDate}
                           </div>
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
                           <span className="text-sm font-medium text-center">
                             {submission.daysUnderStatus}
                           </span>
                         </TableCell>
                         <TableCell>
                           <span className="text-sm">{submission.frequency}</span>
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
                           <div className="text-sm max-w-40 truncate">
                             {submission.comments || "-"}
                           </div>
                         </TableCell>
                      </TableRow>
                    ))
                  }
                </React.Fragment>
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