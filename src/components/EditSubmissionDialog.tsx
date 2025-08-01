import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, Status } from "./StatusBadge";
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

interface EditSubmissionDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmissionUpdate: (updatedSubmission: Submission) => void;
}

export const EditSubmissionDialog = ({ 
  submission, 
  open, 
  onOpenChange, 
  onSubmissionUpdate 
}: EditSubmissionDialogProps) => {
  const [formData, setFormData] = useState<Submission | null>(null);
  const [applyToFutureTasks, setApplyToFutureTasks] = useState(false);
  const { toast } = useToast();

  // Initialize form data when submission changes
  useEffect(() => {
    if (submission) {
      setFormData({ ...submission });
    }
  }, [submission]);

  if (!submission || !formData) return null;

  const statusOptions: { value: Status; label: string }[] = [
    { value: "submitted", label: "Submitted" },
    { value: "in-review", label: "In Review" },
    { value: "approved", label: "Approved" },
    { value: "non-compliant", label: "Non-Compliant" },
    { value: "pending", label: "Pending" },
    { value: "overdue", label: "Overdue" }
  ];

  const categoryOptions = [
    "Budgets", "Environmental", "Safety", "Financial", "Operations", "Compliance"
  ];

  const reportTypeOptions = [
    "Operating & Capital Budgets", "Environmental Impact Report", "Safety Report",
    "Financial Statement", "Production Report", "Compliance Report"
  ];

  const frequencyOptions = [
    "Annual Budget", "Monthly", "Quarterly", "Semi-Annual", "Annual"
  ];

  const handleInputChange = (field: keyof Submission, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = () => {
    if (!formData) return;

    // Basic validation
    if (!formData.operator.trim() || !formData.leaseName.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSubmissionUpdate(formData);
    
    toast({
      title: "Submission Updated",
      description: `Submission ${formData.id} has been updated successfully.`,
    });

    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData(submission ? { ...submission } : null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="operator">Operator *</Label>
              <Input
                id="operator"
                value={formData.operator}
                onChange={(e) => handleInputChange("operator", e.target.value)}
                placeholder="Enter operator name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="properties">Properties</Label>
              <Input
                id="properties"
                value={formData.properties}
                onChange={(e) => handleInputChange("properties", e.target.value)}
                placeholder="Enter properties"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={formData.reportType} onValueChange={(value) => handleInputChange("reportType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportParty">Report Party</Label>
              <Input
                id="reportParty"
                value={formData.reportParty}
                onChange={(e) => handleInputChange("reportParty", e.target.value)}
                placeholder="Enter report party"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewerApprover">Reviewer/Approver</Label>
              <Input
                id="reviewerApprover"
                value={formData.reviewerApprover}
                onChange={(e) => handleInputChange("reviewerApprover", e.target.value)}
                placeholder="Enter reviewer/approver"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) => handleInputChange("period", e.target.value)}
                placeholder="Enter period"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
              />
            </div>


            <div className="space-y-2">
              <Label htmlFor="leaseName">Lease Name *</Label>
              <Input
                id="leaseName"
                value={formData.leaseName}
                onChange={(e) => handleInputChange("leaseName", e.target.value)}
                placeholder="Enter lease name"
              />
            </div>
          </div>
        </div>

        {/* Apply to Future Tasks Checkbox */}
        <div className="flex items-center space-x-2 pt-4">
          <Checkbox 
            id="applyToFuture" 
            checked={applyToFutureTasks}
            onCheckedChange={(checked) => setApplyToFutureTasks(checked as boolean)}
          />
          <Label 
            htmlFor="applyToFuture" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Make the update applicable for all future tasks
          </Label>
        </div>


        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};