import { Status } from "@/components/StatusBadge";

export interface Submission {
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
  assetManager: string;
  invManager: string;
  leaseAdmin: string;
  invAssociate: string;
}

export const mockData: Submission[] = [
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
    comments: "",
    assetManager: "Melissa",
    invManager: "Lauren",
    leaseAdmin: "Yvonne",
    invAssociate: "Larson Pfeil"
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
    comments: "",
    assetManager: "Melissa",
    invManager: "Lauren",
    leaseAdmin: "Yvonne",
    invAssociate: "Larson Pfeil"
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
    comments: "",
    assetManager: "Melissa",
    invManager: "Lauren",
    leaseAdmin: "Yvonne",
    invAssociate: "Larson Pfeil"
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
    comments: "",
    assetManager: "Melissa",
    invManager: "Barr",
    leaseAdmin: "Yvonne",
    invAssociate: "Larson Pfeil"
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
    comments: "",
    assetManager: "Melissa",
    invManager: "Lauren",
    leaseAdmin: "Yvonne",
    invAssociate: "Larson Pfeil"
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
    comments: "",
    assetManager: "Melissa",
    invManager: "Lauren",
    leaseAdmin: "Yvonne",
    invAssociate: "Larson Pfeil"
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
    comments: "",
    assetManager: "Melissa",
    invManager: "Lauren",
    leaseAdmin: "Christine",
    invAssociate: "Ifrana Tursun"
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
    comments: "",
    assetManager: "Melissa",
    invManager: "Barr",
    leaseAdmin: "Christine",
    invAssociate: "Ifrana Tursun"
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
    comments: "",
    assetManager: "Debby",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Tony Chen"
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
    comments: "7/20/2023: Not approved - outstanding questions related to the",
    assetManager: "Debby",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Tony Chen"
  },
  {
    id: "SUB-011",
    operator: "ANDREW RESIDENCE",
    category: "Budgets",
    reportType: "Operating & Capital Budgets",
    reportParty: "Tenant",
    frequency: "Annual Budget",
    dueDate: "12/02/2023",
    period: "2024",
    leaseName: "L_AndrewRes_LS0311",
    properties: "All",
    receivedDate: "12/02/2023",
    status: "approved",
    reviewerApprover: "Kara",
    daysUnderStatus: 0,
    comments: "",
    assetManager: "Debby",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Tony Chen"
  },
  {
    id: "SUB-012",
    operator: "ANDREW RESIDENCE",
    category: "Budgets",
    reportType: "Operating & Capital Budgets",
    reportParty: "Tenant",
    frequency: "Annual Budget",
    dueDate: "12/02/2021",
    period: "2022",
    leaseName: "L_AndrewRes_LS0311",
    properties: "All",
    receivedDate: "12/02/2021",
    status: "approved",
    reviewerApprover: "Kara",
    daysUnderStatus: 0,
    comments: "",
    assetManager: "Debby",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Tony Chen"
  },
  {
    id: "SUB-013",
    operator: "ANDREW RESIDENCE",
    category: "Budgets",
    reportType: "Operating & Capital Budgets",
    reportParty: "Tenant",
    frequency: "Annual Budget",
    dueDate: "12/02/2020",
    period: "2021",
    leaseName: "L_AndrewRes_LS0311",
    properties: "All",
    receivedDate: "12/02/2020",
    status: "approved",
    reviewerApprover: "Kara",
    daysUnderStatus: 0,
    comments: "",
    assetManager: "Debby",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Tony Chen"
  },
  // AVAMERE FAMILY - Additional entries
  {
    id: "SUB-014",
    operator: "AVAMERE FAMILY",
    category: "Budgets",
    reportType: "Operating & Capital Budgets",
    reportParty: "Tenant",
    frequency: "Annual Budget",
    dueDate: "12/17/2024",
    period: "2025",
    leaseName: "L_Avamere_LS0316",
    properties: "All",
    receivedDate: "12/17/2024",
    status: "approved",
    reviewerApprover: "Kara",
    daysUnderStatus: 0,
    comments: "",
    assetManager: "Kara",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Larson Pfeil"
  },
  {
    id: "SUB-015",
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
    comments: "",
    assetManager: "Kara",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Larson Pfeil"
  },
  {
    id: "SUB-016",
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
    comments: "",
    assetManager: "Kara",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Larson Pfeil"
  },
  {
    id: "SUB-017",
    operator: "AVAMERE FAMILY",
    category: "Budgets",
    reportType: "Operating & Capital Budgets",
    reportParty: "Tenant",
    frequency: "Annual Budget",
    dueDate: "12/17/2021",
    period: "2022",
    leaseName: "L_Avamere_LS0316",
    properties: "All",
    receivedDate: "12/17/2021",
    status: "approved",
    reviewerApprover: "Kara",
    daysUnderStatus: 0,
    comments: "",
    assetManager: "Kara",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Larson Pfeil"
  },
  {
    id: "SUB-018",
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
    comments: "",
    assetManager: "Kara",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Larson Pfeil"
  },
  {
    id: "SUB-019",
    operator: "AVAMERE FAMILY",
    category: "Operational Reports",
    reportType: "Capital Expenditures Report",
    reportParty: "Tenant",
    frequency: "Annual",
    dueDate: "02/14/2022",
    period: "2021",
    leaseName: "L_Avamere_LS0316",
    properties: "All",
    receivedDate: "02/14/2022",
    status: "submitted",
    reviewerApprover: "Kara",
    daysUnderStatus: 0,
    comments: "",
    assetManager: "Kara",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Larson Pfeil"
  },
  {
    id: "SUB-020",
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
    status: "submitted",
    reviewerApprover: "Eliza",
    daysUnderStatus: 0,
    comments: "",
    assetManager: "Kara",
    invManager: "Eliza",
    leaseAdmin: "Christine",
    invAssociate: "Larson Pfeil"
  }
];

export const filterSubmissions = (
  submissions: Submission[],
  filters: {
    searchQuery?: string;
    statusFilter?: string;
    reportTypeFilter?: string;
    dateRangeFilter?: string;
  }
) => {
  const { searchQuery = "", statusFilter = "all", reportTypeFilter = "all", dateRangeFilter = "all" } = filters;
  
  return submissions.filter((submission) => {
    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const searchableText = [
        submission.operator,
        submission.category,
        submission.reportType,
        submission.reportParty,
        submission.frequency,
        submission.period,
        submission.leaseName,
        submission.properties,
        submission.reviewerApprover,
        submission.status,
        submission.comments || ""
      ].join(" ").toLowerCase();
      
      if (!searchableText.includes(query)) return false;
    }

    // Status filter
    if (statusFilter !== "all" && statusFilter !== "operators") {
      if (submission.status !== statusFilter) return false;
    }
    
    // Report type filter
    if (reportTypeFilter !== "all") {
      const reportTypeKey = submission.reportType.toLowerCase().replace(/\s+/g, '-');
      if (reportTypeKey !== reportTypeFilter) return false;
    }
    
    return true;
  });
};

export const calculateStats = (submissions: Submission[], filters: {
  searchQuery?: string;
  reportTypeFilter?: string;
  dateRangeFilter?: string;
}) => {
  const filteredSubmissions = filterSubmissions(submissions, filters);
  
  const total = filteredSubmissions.length;
  const approved = filteredSubmissions.filter(s => s.status === "approved").length;
  const pending = filteredSubmissions.filter(s => s.status === "pending").length;
  const inReview = filteredSubmissions.filter(s => s.status === "in-review").length;
  const submitted = filteredSubmissions.filter(s => s.status === "submitted").length;
  const nonCompliant = filteredSubmissions.filter(s => s.status === "non-compliant").length;
  const overdue = filteredSubmissions.filter(s => s.status === "overdue").length;
  
  return {
    total,
    approved,
    pending,
    inReview,
    submitted,
    nonCompliant,
    overdue
  };
};