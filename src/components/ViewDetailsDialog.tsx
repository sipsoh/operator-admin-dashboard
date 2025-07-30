import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, Status } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Building, User, Calendar, FileText, Clock, MessageSquare } from "lucide-react";

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

interface ViewDetailsDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewDetailsDialog = ({ submission, open, onOpenChange }: ViewDetailsDialogProps) => {
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
                  Operator & Entity
                </h3>
                <p className="text-sm text-foreground font-medium">{submission.operator}</p>
                <p className="text-sm text-muted-foreground">{submission.entity}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  Reviewer
                </h3>
                <p className="text-sm text-foreground">{submission.reviewer}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Status & Priority</h3>
                <div className="flex items-center space-x-4">
                  <StatusBadge status={submission.status} />
                  <span className={`text-xs font-medium ${
                    submission.priority === 'high' ? 'text-danger' :
                    submission.priority === 'medium' ? 'text-warning' : 'text-success'
                  }`}>
                    {submission.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Report Type</h3>
                <span className="text-sm font-medium text-primary">
                  {submission.reportType}
                </span>
              </div>
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
                <span className="text-sm text-foreground">{formatDate(submission.dueDate)}</span>
              </div>
              
              {submission.submittedDate && (
                <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Submitted</span>
                  </div>
                  <span className="text-sm text-foreground">{formatDate(submission.submittedDate)}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Notes */}
          {submission.notes && (
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                Notes
              </h3>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-foreground">{submission.notes}</p>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button>
              Edit Submission
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};