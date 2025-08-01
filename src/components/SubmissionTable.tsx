import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, Status } from "./StatusBadge";
import { MoreHorizontal, Eye, Edit, MessageSquare, Calendar, Building, User, ChevronDown, ChevronRight, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, Expand, Minimize2, Archive, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ViewDetailsDialog } from "./ViewDetailsDialog";
import { EditStatusDialog } from "./EditStatusDialog";
import { AddCommentDialog } from "./AddCommentDialog";

import { useToast } from "@/hooks/use-toast";
import { mockData, filterSubmissions, type Submission } from "@/lib/data";
import { simulateBPCRefresh } from "@/lib/mockBackend";

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
  isArchivedView?: boolean;
}

export const SubmissionTable = ({ 
  statusFilter = "all", 
  reportTypeFilter = "all", 
  dateRangeFilter = "all",
  searchQuery = "",
  isArchivedView = false
}: SubmissionTableProps) => {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editStatusOpen, setEditStatusOpen] = useState(false);
  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();

  // Mock data with state - in real app this would come from a state management system
  const [submissions, setSubmissions] = useState<Submission[]>(
    isArchivedView ? [] : mockData
  );

  // Load appropriate data based on view type
  useEffect(() => {
    if (isArchivedView) {
      import("@/lib/mockBackend").then(({ mockArchivedWorkflows }) => {
        setSubmissions(mockArchivedWorkflows);
      });
    } else {
      const refreshedData = simulateBPCRefresh([...mockData]);
      setSubmissions(refreshedData);
    }
  }, [isArchivedView]);

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
    reviewerApprover: "all",
    assetManager: "all",
    invManager: "all",
    leaseAdmin: "all",
    invAssociate: "all",
    dueDateYear: "all",
    dueDateMonth: "all",
    submittedDateYear: "all",
    submittedDateMonth: "all"
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

  // Get unique years and months from dates
  const getUniqueYears = (dateField: 'dueDate' | 'receivedDate') => {
    const years = [...new Set(submissions
      .map(sub => sub[dateField])
      .filter(date => date && date.trim() !== "")
      .map(date => new Date(date).getFullYear().toString())
    )];
    return years.sort();
  };

  const getUniqueMonths = (dateField: 'dueDate' | 'receivedDate', year?: string) => {
    const months = [...new Set(submissions
      .map(sub => sub[dateField])
      .filter(date => date && date.trim() !== "")
      .filter(date => !year || new Date(date).getFullYear().toString() === year)
      .map(date => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short' });
      })
    )];
    return months.sort();
  };

  // Get dynamic period options based on frequency
  const getDynamicPeriodOptions = () => {
    const selectedFrequency = columnFilters.frequency;
    
    if (selectedFrequency === "all") {
      return getUniqueValues("period");
    }
    
    if (selectedFrequency === "Annual") {
      return ["2025", "2024", "2023", "2022", "2021"];
    }
    
    if (selectedFrequency === "Quarterly") {
      const currentYear = new Date().getFullYear();
      const years = [currentYear, currentYear - 1, currentYear - 2];
      const quarters = ["Q1", "Q2", "Q3", "Q4"];
      return years.flatMap(year => quarters.map(q => `${year} ${q}`));
    }
    
    if (selectedFrequency === "Monthly") {
      const currentYear = new Date().getFullYear();
      const years = [currentYear, currentYear - 1];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return years.flatMap(year => months.map(month => `${year} ${month}`));
    }
    
    return getUniqueValues("period");
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
      reviewerApprover: "all",
      assetManager: "all",
      invManager: "all",
      leaseAdmin: "all",
      invAssociate: "all",
      dueDateYear: "all",
      dueDateMonth: "all",
      submittedDateYear: "all",
      submittedDateMonth: "all"
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

  const getSortIconWhite = (key: keyof Submission) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="h-3 w-3 ml-1 text-white/70" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1 text-white" />
      : <ArrowDown className="h-3 w-3 ml-1 text-white" />;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
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
    if (columnFilters.reportParty !== "all" && (submission as any).reportParty !== columnFilters.reportParty) return false;
    
    if (columnFilters.frequency !== "all" && submission.frequency !== columnFilters.frequency) return false;
    if (columnFilters.period !== "all" && submission.period !== columnFilters.period) return false;
    if (columnFilters.leaseName !== "all" && submission.leaseName !== columnFilters.leaseName) return false;
    if (columnFilters.properties !== "all" && submission.properties !== columnFilters.properties) return false;
    if (columnFilters.status !== "all" && submission.status !== columnFilters.status) return false;
    if (columnFilters.reviewerApprover !== "all" && submission.reviewerApprover !== columnFilters.reviewerApprover) return false;
    if (columnFilters.assetManager !== "all" && submission.assetManager !== columnFilters.assetManager) return false;
    if (columnFilters.invManager !== "all" && submission.invManager !== columnFilters.invManager) return false;
    if (columnFilters.leaseAdmin !== "all" && submission.leaseAdmin !== columnFilters.leaseAdmin) return false;
    if (columnFilters.invAssociate !== "all" && submission.invAssociate !== columnFilters.invAssociate) return false;
    
    // Date filters
    if (columnFilters.dueDateYear !== "all" || columnFilters.dueDateMonth !== "all") {
      const dueDate = new Date(submission.dueDate);
      if (columnFilters.dueDateYear !== "all" && dueDate.getFullYear().toString() !== columnFilters.dueDateYear) return false;
      if (columnFilters.dueDateMonth !== "all" && dueDate.toLocaleDateString('en-US', { month: 'short' }) !== columnFilters.dueDateMonth) return false;
    }
    
    if (columnFilters.submittedDateYear !== "all" || columnFilters.submittedDateMonth !== "all") {
      if (!submission.receivedDate) return false;
      const submittedDate = new Date(submission.receivedDate);
      if (columnFilters.submittedDateYear !== "all" && submittedDate.getFullYear().toString() !== columnFilters.submittedDateYear) return false;
      if (columnFilters.submittedDateMonth !== "all" && submittedDate.toLocaleDateString('en-US', { month: 'short' }) !== columnFilters.submittedDateMonth) return false;
    }
    
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
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-semibold">Submissions</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-3 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All Filters
              </Button>
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
          {!isArchivedView && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/archived-workflows')}
                className="h-8 px-3 text-xs text-primary border-primary"
              >
                <Archive className="h-3 w-3 mr-1" />
                Archived Workflows
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="relative">
            <TableHeader>
              {/* Column Headers Row - Blue Background */}
              <TableRow className="bg-blue-600 hover:bg-blue-600">
                <TableHead className="w-12 sticky left-0 bg-blue-600 z-30 border-r border-blue-500 text-white font-semibold">
                </TableHead>
                <TableHead className="min-w-[200px] sticky left-12 bg-blue-600 z-30 border-r border-blue-500 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('operator')}>
                    Operator
                    {getSortIconWhite('operator')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[180px] sticky left-[212px] bg-blue-600 z-30 border-r border-blue-500 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('category')}>
                    Category
                    {getSortIconWhite('category')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[200px] sticky left-[392px] bg-blue-600 z-30 border-r border-blue-500 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('reportType')}>
                    Report Type
                    {getSortIconWhite('reportType')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[180px] sticky left-[592px] bg-blue-600 z-30 border-r border-blue-500 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('reportParty')}>
                    Report Party
                    {getSortIconWhite('reportParty')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('status')}>
                    Status
                    {getSortIconWhite('status')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[140px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('reviewerApprover')}>
                    Reviewer/Approver
                    {getSortIconWhite('reviewerApprover')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('dueDate')}>
                    Due Date
                    {getSortIconWhite('dueDate')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('receivedDate')}>
                    Submitted Date
                    {getSortIconWhite('receivedDate')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('daysUnderStatus')}>
                    # of Days under Status
                    {getSortIconWhite('daysUnderStatus')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[140px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('frequency')}>
                    Frequency
                    {getSortIconWhite('frequency')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('period')}>
                    Period
                    {getSortIconWhite('period')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[180px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('leaseName')}>
                    Lease Name
                    {getSortIconWhite('leaseName')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[140px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('properties')}>
                    Properties
                    {getSortIconWhite('properties')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[140px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('assetManager')}>
                    Asset Manager
                    {getSortIconWhite('assetManager')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[140px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('invManager')}>
                    Investment Manager
                    {getSortIconWhite('invManager')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[140px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('leaseAdmin')}>
                    Lease Admin
                    {getSortIconWhite('leaseAdmin')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[140px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('invAssociate')}>
                    Investment Associate
                    {getSortIconWhite('invAssociate')}
                  </div>
                </TableHead>
                <TableHead className="min-w-[200px] bg-blue-600 text-white font-semibold">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('comments')}>
                    Comments
                    {getSortIconWhite('comments')}
                  </div>
                </TableHead>
              </TableRow>
              
              {/* Filters Row - Below Headers */}
              <TableRow className="bg-muted/30">
                <TableHead className="w-12 py-2 sticky left-0 bg-muted/30 z-30 border-r border-border">
                </TableHead>
                <TableHead className="min-w-[200px] py-2 sticky left-12 bg-muted/30 z-30 border-r border-border">
                  <Select value={columnFilters.operator} onValueChange={(value) => updateColumnFilter("operator", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("operator").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[180px] py-2 sticky left-[212px] bg-muted/30 z-30 border-r border-border">
                  <Select value={columnFilters.category} onValueChange={(value) => updateColumnFilter("category", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("category").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[200px] py-2 sticky left-[392px] bg-muted/30 z-30 border-r border-border">
                  <Select value={columnFilters.reportType} onValueChange={(value) => updateColumnFilter("reportType", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("reportType").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[180px] py-2 sticky left-[592px] bg-muted/30 z-30 border-r border-border">
                  <Select value={columnFilters.reportParty || "all"} onValueChange={(value) => updateColumnFilter("reportParty", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("reportParty").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                 </TableHead>
                 <TableHead className="min-w-[120px] py-2">
                   <Select value={columnFilters.status} onValueChange={(value) => updateColumnFilter("status", value)}>
                     <SelectTrigger className="h-7 text-xs">
                       <SelectValue placeholder="All" />
                     </SelectTrigger>
                     <SelectContent className="bg-background border border-border z-50">
                       <SelectItem value="all">All</SelectItem>
                       {getUniqueValues("status").map(value => (
                         <SelectItem key={value} value={value}>{value}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </TableHead>
                <TableHead className="min-w-[140px] py-2">
                  <Select value={columnFilters.reviewerApprover} onValueChange={(value) => updateColumnFilter("reviewerApprover", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("reviewerApprover").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[120px] py-2">
                  <div className="flex gap-1">
                    <Select value={columnFilters.dueDateYear} onValueChange={(value) => updateColumnFilter("dueDateYear", value)}>
                      <SelectTrigger className="h-6 text-xs flex-1">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        <SelectItem value="all">All Years</SelectItem>
                        {getUniqueYears("dueDate").map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={columnFilters.dueDateMonth} onValueChange={(value) => updateColumnFilter("dueDateMonth", value)}>
                      <SelectTrigger className="h-6 text-xs flex-1">
                        <SelectValue placeholder="Mon" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueMonths("dueDate", columnFilters.dueDateYear !== "all" ? columnFilters.dueDateYear : undefined).map(month => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px] py-2">
                  <div className="flex gap-1">
                    <Select value={columnFilters.submittedDateYear} onValueChange={(value) => updateColumnFilter("submittedDateYear", value)}>
                      <SelectTrigger className="h-6 text-xs flex-1">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        <SelectItem value="all">All Years</SelectItem>
                        {getUniqueYears("receivedDate").map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={columnFilters.submittedDateMonth} onValueChange={(value) => updateColumnFilter("submittedDateMonth", value)}>
                      <SelectTrigger className="h-6 text-xs flex-1">
                        <SelectValue placeholder="Mon" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-50">
                        <SelectItem value="all">All</SelectItem>
                        {getUniqueMonths("receivedDate", columnFilters.submittedDateYear !== "all" ? columnFilters.submittedDateYear : undefined).map(month => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px] py-2">
                  {/* No filter for Days under Status */}
                </TableHead>
                <TableHead className="min-w-[140px] py-2">
                  <Select value={columnFilters.frequency} onValueChange={(value) => updateColumnFilter("frequency", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("frequency").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[120px] py-2">
                  <Select value={columnFilters.period} onValueChange={(value) => updateColumnFilter("period", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getDynamicPeriodOptions().map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[180px] py-2">
                  <Select value={columnFilters.leaseName} onValueChange={(value) => updateColumnFilter("leaseName", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("leaseName").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[140px] py-2">
                  <Select value={columnFilters.properties} onValueChange={(value) => updateColumnFilter("properties", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("properties").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[140px] py-2">
                  <Select value={columnFilters.assetManager} onValueChange={(value) => updateColumnFilter("assetManager", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("assetManager").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[140px] py-2">
                  <Select value={columnFilters.invManager} onValueChange={(value) => updateColumnFilter("invManager", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("invManager").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[140px] py-2">
                  <Select value={columnFilters.leaseAdmin} onValueChange={(value) => updateColumnFilter("leaseAdmin", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("leaseAdmin").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[140px] py-2">
                  <Select value={columnFilters.invAssociate} onValueChange={(value) => updateColumnFilter("invAssociate", value)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="all">All</SelectItem>
                      {getUniqueValues("invAssociate").map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="min-w-[200px] py-2">
                  {/* No filter for Comments */}
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
                    <TableCell colSpan={20} className="py-3 px-4">
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
                        <TableCell className="sticky left-0 bg-card z-20 border-r border-border">
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
                        <TableCell className="sticky left-12 bg-card z-20 border-r border-border">
                          <div className="font-medium text-foreground">{submission.operator}</div>
                        </TableCell>
                        <TableCell className="sticky left-[212px] bg-card z-20 border-r border-border">
                          <span className="text-sm">{submission.category}</span>
                        </TableCell>
                         <TableCell className="sticky left-[392px] bg-card z-20 text-left border-r border-border">
                           <button
                             className="text-sm font-medium text-report-type hover:text-report-type/80 underline cursor-pointer transition-colors text-left"
                             onClick={() => handleViewDetails(submission)}
                           >
                             {submission.reportType}
                           </button>
                          </TableCell>
                          <TableCell className="sticky left-[592px] bg-card z-20 border-r border-border">
                            <span className="text-sm">{(submission as any).reportParty || "-"}</span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={submission.status} />
                          </TableCell>
                         <TableCell>
                           <span className="text-sm">{submission.reviewerApprover}</span>
                         </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(submission.dueDate)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {submission.receivedDate ? (
                              <div className="text-sm">
                                {formatDate(submission.receivedDate)}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={`text-sm font-medium text-center ${submission.daysUnderStatus > 14 ? 'text-danger' : ''}`}>
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
                            <span className="text-sm">{submission.assetManager}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{submission.invManager}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{submission.leaseAdmin}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{submission.invAssociate}</span>
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