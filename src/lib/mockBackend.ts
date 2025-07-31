// Mock Backend Services for Demo Functionality

import { Submission } from './data';

// Mock BPC Admin data - simulates nightly refresh from external system
export const mockBPCData = {
  relationshipMappings: {
    'ADVANCED RECOVERY SYSTEMS': {
      assetManager: 'Melissa Johnson',
      leaseAdmin: 'Yvonne Smith', 
      invManager: 'Lauren Davis',
      invAssociate: 'Larson Pfeil'
    },
    'AGEWELL SOLVE': {
      assetManager: 'Michael Chen',
      leaseAdmin: 'Sarah Wilson',
      invManager: 'David Brown',
      invAssociate: 'Emma Thompson'
    }
  },
  reviewerApproverMappings: {
    'Operating & Capital Budgets': 'Melissa',
    'Annual & Qtrly Financials': 'Melissa', 
    'Capital Expenditures Report': 'Melissa',
    'Operating Licenses': 'Yvonne'
  }
};

// Mock reminder system
export interface Reminder {
  id: string;
  type: 'capital-expenditures-template';
  recipientRole: 'lease-admin';
  recipient: string;
  message: string;
  dueDate: string;
  isActive: boolean;
  createdAt: string;
}

export const mockReminders: Reminder[] = [
  {
    id: '1',
    type: 'capital-expenditures-template',
    recipientRole: 'lease-admin',
    recipient: 'Yvonne Smith',
    message: 'Annual Capital Expenditures Report template upload is due',
    dueDate: '2024-12-31',
    isActive: true,
    createdAt: '2024-01-01'
  }
];

// Mock BPC refresh service
export const simulateBPCRefresh = (submissions: Submission[]): Submission[] => {
  return submissions.map(submission => {
    const operatorMapping = mockBPCData.relationshipMappings[submission.operator];
    const reviewerMapping = mockBPCData.reviewerApproverMappings[submission.reportType];
    
    if (operatorMapping) {
      // Update relationship columns for all workflows
      submission.assetManager = operatorMapping.assetManager;
      submission.leaseAdmin = operatorMapping.leaseAdmin;
      submission.invManager = operatorMapping.invManager;
      submission.invAssociate = operatorMapping.invAssociate;
    }
    
    // Only update reviewer/approver for non-completed workflows
    if (reviewerMapping && !['approved', 'non-compliant'].includes(submission.status)) {
      submission.reviewerApprover = reviewerMapping;
    }
    
    return submission;
  });
};

// Mock reminder check service
export const checkReminders = (): Reminder[] => {
  const today = new Date();
  const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return mockReminders.filter(reminder => {
    const dueDate = new Date(reminder.dueDate);
    return reminder.isActive && dueDate <= oneWeekFromNow;
  });
};

// Mock archived workflows
export const mockArchivedWorkflows: Submission[] = [
  {
    id: 'arch-1',
    operator: 'LEGACY SYSTEMS',
    category: 'Budgets',
    reportType: 'Annual Budget Report',
    reportParty: 'Tenant',
    status: 'approved',
    reviewerApprover: 'Historical Admin',
    dueDate: '12/31/2022',
    receivedDate: '12/15/2022',
    daysUnderStatus: 365,
    frequency: 'Annual',
    period: '2022',
    leaseName: 'Legacy Property',
    properties: 'Old Building',
    assetManager: 'Former Manager',
    invManager: 'Past Manager',
    leaseAdmin: 'Previous Admin',
    invAssociate: 'Old Associate',
    comments: 'Archived workflow from previous year'
  },
  {
    id: 'arch-2', 
    operator: 'RETIRED OPERATOR',
    category: 'Financial Reports',
    reportType: 'Final Financial Report',
    reportParty: 'Landlord',
    status: 'approved',
    reviewerApprover: 'Archive Admin',
    dueDate: '06/30/2023',
    receivedDate: '06/25/2023',
    daysUnderStatus: 180,
    frequency: 'One-time',
    period: '2023',
    leaseName: 'Closed Facility',
    properties: 'Decommissioned',
    assetManager: 'Transfer Manager',
    invManager: 'Final Manager',
    leaseAdmin: 'Closure Admin',
    invAssociate: 'Final Associate',
    comments: 'Final submission before operator retirement'
  }
];

// Future Tasks functionality
export interface FutureTask {
  id: string;
  submissionId: string;
  task: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

export const mockFutureTasks: FutureTask[] = [];

export const addFutureTask = (task: Omit<FutureTask, 'id'>): FutureTask => {
  const newTask: FutureTask = {
    ...task,
    id: Date.now().toString()
  };
  mockFutureTasks.push(newTask);
  return newTask;
};

export const getFutureTasksForSubmission = (submissionId: string): FutureTask[] => {
  return mockFutureTasks.filter(task => task.submissionId === submissionId);
};