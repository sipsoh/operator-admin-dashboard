import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, Status } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Building, User, Calendar, FileText, Clock, MessageSquare } from "lucide-react";
import { EditSubmissionDialog } from "./EditSubmissionDialog";

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

interface ViewDetailsDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmissionUpdate?: (updatedSubmission: Submission) => void;
}

export const ViewDetailsDialog = ({ submission, open, onOpenChange, onSubmissionUpdate }: ViewDetailsDialogProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  if (!submission) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const priorityColors = {
    high: "bg-danger/10 text-danger border-danger/30",
    medium: "bg-warning/10 text-warning border-warning/30", 
    low: "bg-success/10 text-success border-success/30"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Submission Details - {submission.id}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center">
                  <Building className="h-4 w-4 mr-2 text-primary" />
                  Operator & Properties
                </h3>
                <p className="text-sm text-foreground font-medium">{submission.operator}</p>
                <p className="text-sm text-muted-foreground">{submission.properties}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Category</h3>
                <p className="text-sm text-foreground">{submission.category}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Report Party</h3>
                <p className="text-sm text-foreground">{submission.reportParty}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  Reviewer/Approver
                </h3>
                <p className="text-sm text-foreground">{submission.reviewerApprover}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Status</h3>
                <StatusBadge status={submission.status} />
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Report Type</h3>
                <span className="text-sm font-medium text-report-type">
                  {submission.reportType}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Frequency</h3>
                <p className="text-sm text-foreground">{submission.frequency}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Period</h3>
                <p className="text-sm text-foreground">{submission.period}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Days under Status</h3>
                <p className="text-sm text-foreground font-medium">{submission.daysUnderStatus}</p>
              </div>
            </div>
          </div>

          {/* Lease Information */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Lease Information</h3>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-foreground font-medium">{submission.leaseName}</p>
            </div>
          </div>
          
          {/* Timeline */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Due Date</span>
                </div>
                <span className="text-sm text-foreground">{submission.dueDate}</span>
              </div>
              
              {submission.receivedDate && (
                <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Received</span>
                  </div>
                  <span className="text-sm text-foreground">{submission.receivedDate}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Comments */}
          {submission.comments && (
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                Comments
              </h3>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-foreground whitespace-pre-wrap">{submission.comments}</p>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => setEditDialogOpen(true)}>
              Edit Submission
            </Button>
          </div>
        </div>

        {/* Edit Submission Dialog */}
        <EditSubmissionDialog
          submission={submission}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmissionUpdate={(updatedSubmission) => {
            onSubmissionUpdate?.(updatedSubmission);
            setEditDialogOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};