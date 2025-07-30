// Mock data for the dashboard
const mockSubmissions = [
  {
    id: "SUB-001",
    operator: "Downtown Properties LLC",
    category: "Financial",
    reportType: "Monthly Financial",
    dueDate: "2024-01-15",
    receivedDate: "2024-01-12",
    status: "approved",
    comments: [
      { id: 1, type: "review", text: "Financial documents reviewed and approved", timestamp: "2024-01-12T10:30:00Z" },
      { id: 2, type: "approval", text: "All requirements met", timestamp: "2024-01-12T14:15:00Z" }
    ]
  },
  {
    id: "SUB-002",
    operator: "Riverside Management Co",
    category: "Compliance",
    reportType: "Rent Schedule",
    dueDate: "2024-01-20",
    receivedDate: null,
    status: "overdue",
    comments: [
      { id: 3, type: "follow-up", text: "Reminder sent to operator", timestamp: "2024-01-18T09:00:00Z" }
    ]
  },
  {
    id: "SUB-003",
    operator: "Metro Housing Solutions",
    category: "Legal",
    reportType: "Lease Agreement",
    dueDate: "2024-01-25",
    receivedDate: "2024-01-23",
    status: "in-review",
    comments: [
      { id: 4, type: "review", text: "Under legal review for compliance", timestamp: "2024-01-23T11:45:00Z" }
    ]
  },
  {
    id: "SUB-004",
    operator: "Eastside Realty Group",
    category: "Financial",
    reportType: "Quarterly Review",
    dueDate: "2024-02-01",
    receivedDate: "2024-01-28",
    status: "pending",
    comments: []
  },
  {
    id: "SUB-005",
    operator: "Westend Property Mgmt",
    category: "Insurance",
    reportType: "Insurance Documents",
    dueDate: "2024-02-05",
    receivedDate: "2024-02-03",
    status: "non-compliant",
    comments: [
      { id: 5, type: "compliance", text: "Missing required coverage documentation", timestamp: "2024-02-03T16:20:00Z" }
    ]
  },
  {
    id: "SUB-006",
    operator: "Northtown Apartments",
    category: "Compliance",
    reportType: "Compliance Report",
    dueDate: "2024-02-10",
    receivedDate: "2024-02-08",
    status: "submitted",
    comments: []
  }
];

// Dashboard state
let currentFilter = "all";
let currentSort = { column: null, direction: "asc" };
let currentReportTypeFilter = "all";
let currentDateRangeFilter = "month";
let selectedSubmission = null;

// Statistics configuration
const statsConfig = [
  { title: "Total Submissions", filterType: "all", color: "primary" },
  { title: "Open", filterType: "open", color: "primary" },
  { title: "Under Review", filterType: "under-review", color: "warning" },
  { title: "Pending Approval", filterType: "pending-approval", color: "warning" },
  { title: "Approved", filterType: "approved", color: "success" },
  { title: "Compliant", filterType: "compliant", color: "success" },
  { title: "Non-Compliant", filterType: "non-compliant", color: "danger" },
  { title: "Rejected", filterType: "rejected", color: "danger" }
];

// Status configuration
const statusConfig = {
  "approved": { label: "Approved", class: "status-approved" },
  "pending": { label: "Pending", class: "status-pending" },
  "non-compliant": { label: "Non-Compliant", class: "status-non-compliant" },
  "overdue": { label: "Overdue", class: "status-overdue" },
  "in-review": { label: "In Review", class: "status-in-review" },
  "submitted": { label: "Submitted", class: "status-submitted" }
};

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
  renderDashboardStats();
  renderSubmissionTable();
  attachEventListeners();
});

// Event listeners
function attachEventListeners() {
  // Filter dropdowns
  document.getElementById('reportTypeFilter').addEventListener('change', function(e) {
    currentReportTypeFilter = e.target.value;
    renderSubmissionTable();
  });

  document.getElementById('dateRangeFilter').addEventListener('change', function(e) {
    currentDateRangeFilter = e.target.value;
    renderSubmissionTable();
  });

  // Table sorting
  document.querySelectorAll('.sortable').forEach(header => {
    header.addEventListener('click', function() {
      const column = this.dataset.column;
      handleSort(column);
    });
  });

  // Modal event listeners
  document.getElementById('updateStatusBtn').addEventListener('click', handleStatusUpdate);
  document.getElementById('addCommentBtn').addEventListener('click', handleAddComment);
}

// Render dashboard statistics
function renderDashboardStats() {
  const statsContainer = document.getElementById('dashboard-stats');
  
  const stats = calculateStats();
  
  statsContainer.innerHTML = statsConfig.map(config => {
    const value = stats[config.filterType] || 0;
    const isActive = currentFilter === config.filterType;
    
    return `
      <div class="col-xl-3 col-lg-4 col-md-6">
        <div class="card stat-card ${isActive ? 'active' : ''}" onclick="handleFilterChange('${config.filterType}')">
          <div class="card-body text-center p-4">
            <p class="stat-title mb-2">${config.title}</p>
            <p class="stat-value text-${config.color} mb-0">${value}</p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Calculate statistics
function calculateStats() {
  return {
    "all": mockSubmissions.length,
    "open": mockSubmissions.filter(s => ['pending', 'submitted', 'in-review'].includes(s.status)).length,
    "under-review": mockSubmissions.filter(s => s.status === 'in-review').length,
    "pending-approval": mockSubmissions.filter(s => s.status === 'pending').length,
    "approved": mockSubmissions.filter(s => s.status === 'approved').length,
    "compliant": mockSubmissions.filter(s => s.status === 'approved').length,
    "non-compliant": mockSubmissions.filter(s => s.status === 'non-compliant').length,
    "rejected": mockSubmissions.filter(s => s.status === 'non-compliant').length
  };
}

// Handle filter changes
function handleFilterChange(filterType) {
  currentFilter = filterType;
  renderDashboardStats();
  renderSubmissionTable();
}

// Handle table sorting
function handleSort(column) {
  if (currentSort.column === column) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.column = column;
    currentSort.direction = 'asc';
  }
  
  // Update sort indicators
  document.querySelectorAll('.sortable').forEach(header => {
    header.classList.remove('sort-asc', 'sort-desc');
    if (header.dataset.column === column) {
      header.classList.add(`sort-${currentSort.direction}`);
    }
  });
  
  renderSubmissionTable();
}

// Render submission table
function renderSubmissionTable() {
  const tbody = document.getElementById('submissionTableBody');
  let filteredSubmissions = getFilteredSubmissions();
  
  // Apply sorting
  if (currentSort.column) {
    filteredSubmissions.sort((a, b) => {
      let aVal = a[currentSort.column];
      let bVal = b[currentSort.column];
      
      if (currentSort.column === 'dueDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  tbody.innerHTML = filteredSubmissions.map(submission => `
    <tr>
      <td>${submission.operator}</td>
      <td>${submission.category}</td>
      <td>${submission.reportType}</td>
      <td>${formatDate(submission.dueDate)}</td>
      <td>
        <span class="status-badge ${statusConfig[submission.status].class}">
          ${statusConfig[submission.status].label}
        </span>
      </td>
      <td>
        <div class="dropdown">
          <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            Actions
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" onclick="showViewDetails('${submission.id}')">
              <i class="bi bi-eye me-2"></i>View Details
            </a></li>
            <li><a class="dropdown-item" href="#" onclick="showEditStatus('${submission.id}')">
              <i class="bi bi-pencil me-2"></i>Edit Status
            </a></li>
            <li><a class="dropdown-item" href="#" onclick="showAddComment('${submission.id}')">
              <i class="bi bi-chat me-2"></i>Add Comment
            </a></li>
          </ul>
        </div>
      </td>
    </tr>
  `).join('');
}

// Get filtered submissions
function getFilteredSubmissions() {
  return mockSubmissions.filter(submission => {
    // Status filter
    let statusMatch = true;
    if (currentFilter !== 'all') {
      switch (currentFilter) {
        case 'open':
          statusMatch = ['pending', 'submitted', 'in-review'].includes(submission.status);
          break;
        case 'under-review':
          statusMatch = submission.status === 'in-review';
          break;
        case 'pending-approval':
          statusMatch = submission.status === 'pending';
          break;
        case 'approved':
        case 'compliant':
          statusMatch = submission.status === 'approved';
          break;
        case 'non-compliant':
        case 'rejected':
          statusMatch = submission.status === 'non-compliant';
          break;
      }
    }
    
    // Report type filter
    const reportTypeMatch = currentReportTypeFilter === 'all' || 
      submission.reportType.toLowerCase().replace(/\s+/g, '-') === currentReportTypeFilter;
    
    return statusMatch && reportTypeMatch;
  });
}

// Modal functions
function showViewDetails(submissionId) {
  selectedSubmission = mockSubmissions.find(s => s.id === submissionId);
  if (!selectedSubmission) return;
  
  const modal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
  const content = document.getElementById('viewDetailsContent');
  
  content.innerHTML = `
    <div class="row">
      <div class="col-md-6">
        <h6 class="fw-bold mb-3">Header Info</h6>
        <div class="mb-3">
          <strong>Submission ID:</strong>
          <div class="text-muted">${selectedSubmission.id}</div>
        </div>
        <div class="mb-3">
          <strong>Operator:</strong>
          <div class="text-muted">${selectedSubmission.operator}</div>
        </div>
        <div class="mb-3">
          <strong>Category:</strong>
          <div class="text-muted">${selectedSubmission.category}</div>
        </div>
        <div class="mb-3">
          <strong>Report Type:</strong>
          <div class="text-muted">${selectedSubmission.reportType}</div>
        </div>
      </div>
      <div class="col-md-6">
        <h6 class="fw-bold mb-3">Timeline</h6>
        <div class="mb-3">
          <strong>Due Date:</strong>
          <div class="text-muted">${formatDate(selectedSubmission.dueDate)}</div>
        </div>
        <div class="mb-3">
          <strong>Received Date:</strong>
          <div class="text-muted">${selectedSubmission.receivedDate ? formatDate(selectedSubmission.receivedDate) : 'Not received'}</div>
        </div>
        <div class="mb-3">
          <strong>Status:</strong>
          <div class="mt-1">
            <span class="status-badge ${statusConfig[selectedSubmission.status].class}">
              ${statusConfig[selectedSubmission.status].label}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <hr class="my-4">
    
    <h6 class="fw-bold mb-3">Comments (${selectedSubmission.comments.length})</h6>
    ${selectedSubmission.comments.length > 0 ? 
      selectedSubmission.comments.map(comment => `
        <div class="border rounded p-3 mb-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge bg-secondary">${comment.type}</span>
            <small class="text-muted">${formatDateTime(comment.timestamp)}</small>
          </div>
          <p class="mb-0">${comment.text}</p>
        </div>
      `).join('') : 
      '<p class="text-muted">No comments yet.</p>'
    }
  `;
  
  modal.show();
}

function showEditStatus(submissionId) {
  selectedSubmission = mockSubmissions.find(s => s.id === submissionId);
  if (!selectedSubmission) return;
  
  const modal = new bootstrap.Modal(document.getElementById('editStatusModal'));
  const currentStatusDisplay = document.getElementById('currentStatusDisplay');
  
  currentStatusDisplay.innerHTML = `
    <span class="status-badge ${statusConfig[selectedSubmission.status].class}">
      ${statusConfig[selectedSubmission.status].label}
    </span>
  `;
  
  // Reset form
  document.getElementById('editStatusForm').reset();
  
  modal.show();
}

function showAddComment(submissionId) {
  selectedSubmission = mockSubmissions.find(s => s.id === submissionId);
  if (!selectedSubmission) return;
  
  const modal = new bootstrap.Modal(document.getElementById('addCommentModal'));
  const operatorDisplay = document.getElementById('commentOperatorDisplay');
  
  operatorDisplay.textContent = selectedSubmission.operator;
  
  // Reset form
  document.getElementById('addCommentForm').reset();
  
  modal.show();
}

// Handle status update
function handleStatusUpdate() {
  const newStatus = document.getElementById('newStatus').value;
  const reason = document.getElementById('statusReason').value;
  
  if (!newStatus || !reason) {
    showAlert('Please fill in all required fields.', 'danger');
    return;
  }
  
  if (!selectedSubmission) return;
  
  // Update the submission
  selectedSubmission.status = newStatus;
  selectedSubmission.comments.push({
    id: Date.now(),
    type: 'general',
    text: `Status changed to ${statusConfig[newStatus].label}. Reason: ${reason}`,
    timestamp: new Date().toISOString()
  });
  
  // Close modal and refresh
  bootstrap.Modal.getInstance(document.getElementById('editStatusModal')).hide();
  renderSubmissionTable();
  renderDashboardStats();
  
  showAlert('Status updated successfully!', 'success');
}

// Handle add comment
function handleAddComment() {
  const commentType = document.getElementById('commentType').value;
  const commentText = document.getElementById('commentText').value;
  
  if (!commentType || !commentText) {
    showAlert('Please fill in all required fields.', 'danger');
    return;
  }
  
  if (!selectedSubmission) return;
  
  // Add the comment
  selectedSubmission.comments.push({
    id: Date.now(),
    type: commentType,
    text: commentText,
    timestamp: new Date().toISOString()
  });
  
  // Close modal and refresh
  bootstrap.Modal.getInstance(document.getElementById('addCommentModal')).hide();
  
  showAlert('Comment added successfully!', 'success');
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function showAlert(message, type) {
  const alertHtml = `
    <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
         style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;" 
         role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  
  // Remove existing alerts
  document.querySelectorAll('.alert.position-fixed').forEach(alert => alert.remove());
  
  // Add new alert
  document.body.insertAdjacentHTML('beforeend', alertHtml);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    const alert = document.querySelector('.alert.position-fixed');
    if (alert) {
      alert.remove();
    }
  }, 5000);
}