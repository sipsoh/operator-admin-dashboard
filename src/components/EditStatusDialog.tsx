import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, Status } from "./StatusBadge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface EditStatusDialogProps {
  submissionId: string | null;
  currentStatus: Status | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (submissionId: string, newStatus: Status, reason: string) => void;
}

export const EditStatusDialog = ({ 
  submissionId, 
  currentStatus, 
  open, 
  onOpenChange, 
  onStatusUpdate 
}: EditStatusDialogProps) => {
  const [newStatus, setNewStatus] = useState<Status | "">("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const statusOptions: { value: Status; label: string }[] = [
    { value: "submitted", label: "Submitted" },
    { value: "in-review", label: "In Review" },
    { value: "approved", label: "Approved" },
    { value: "non-compliant", label: "Non-Compliant" },
    { value: "pending", label: "Pending" },
    { value: "overdue", label: "Overdue" }
  ];

  const handleSubmit = () => {
    if (!submissionId || !newStatus || !reason.trim()) {
      toast({
        title: "Error",
        description: "Please select a status and provide a reason for the change.",
        variant: "destructive"
      });
      return;
    }

    onStatusUpdate(submissionId, newStatus as Status, reason);
    
    toast({
      title: "Status Updated",
      description: `Submission status changed to ${newStatus.replace('-', ' ')}`,
    });

    // Reset form and close dialog
    setNewStatus("");
    setReason("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setNewStatus("");
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Submission Status</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {currentStatus && (
            <div>
              <Label className="text-sm font-medium">Current Status</Label>
              <div className="mt-1">
                <StatusBadge status={currentStatus} />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select value={newStatus} onValueChange={(value: Status) => setNewStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Change</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for status change..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" className="text-primary border-primary">
              Future Tasks
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};