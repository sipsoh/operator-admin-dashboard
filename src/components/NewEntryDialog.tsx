import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Submission } from "@/lib/data";

interface NewEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEntryCreate: (entry: Omit<Submission, 'id'>) => void;
}

interface ReportTypeConfig {
  name: string;
  reportParty: string[];
  frequency: string[];
  defaultFrequency: string;
}

const reportTypeConfigs: Record<string, ReportTypeConfig> = {
  "Operating & Capital Budgets": {
    name: "Operating & Capital Budgets",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Annual Budget"],
    defaultFrequency: "Annual Budget"
  },
  "Annual & Qtrly Financials": {
    name: "Annual & Qtrly Financials",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Annual", "Quarterly"],
    defaultFrequency: "Annual"
  },
  "Cash Flow": {
    name: "Cash Flow",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Annual", "Quarterly"],
    defaultFrequency: "Annual"
  },
  "Financial Covenant": {
    name: "Financial Covenant",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Annual", "Quarterly"],
    defaultFrequency: "Annual"
  },
  "Insurance": {
    name: "Insurance",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Annual"],
    defaultFrequency: "Annual"
  },
  "Other Financial Reports": {
    name: "Other Financial Reports",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Annual"],
    defaultFrequency: "Annual"
  },
  "Percentage Rent Calculation": {
    name: "Percentage Rent Calculation",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Annual", "Quarterly"],
    defaultFrequency: "Quarterly"
  },
  "Capital Expenditures Reports": {
    name: "Capital Expenditures Reports",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Annual"],
    defaultFrequency: "Annual"
  },
  "Competitor Rate Surveys": {
    name: "Competitor Rate Surveys",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Quarterly"],
    defaultFrequency: "Quarterly"
  },
  "Insurance Reports": {
    name: "Insurance Reports",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Annual"],
    defaultFrequency: "Annual"
  },
  "Operating Licenses": {
    name: "Operating Licenses",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Upon Expiration"],
    defaultFrequency: "Upon Expiration"
  },
  "Tax Returns": {
    name: "Tax Returns",
    reportParty: ["Borrower", "Guarantor", "Pref Equity", "Tenant"],
    frequency: ["Annual"],
    defaultFrequency: "Annual"
  }
};

const operators = [
  "ADVANCED RECOVERY SYSTEMS",
  "AGEWELL SOLVE",
  "LEGACY SYSTEMS",
  "NEW OPERATOR"
];

const properties = [
  "Avamere Court at Keizer",
  "Avamere Crestview of Portland", 
  "Avamere Health Services of Rogue Valley",
  "Avamere Rehabilitation of Newberg",
  "All"
];

export const NewEntryDialog = ({
  open,
  onOpenChange,
  onEntryCreate
}: NewEntryDialogProps) => {
  const [formData, setFormData] = useState({
    operator: "",
    lease: "",
    selectedProperties: [] as string[],
    selectedReportTypes: [] as string[],
    notes: ""
  });

  const [workflowTasks, setWorkflowTasks] = useState<Array<{
    reportType: string;
    reportParty: string;
    frequency: string;
    days: string;
    dueDate: Date | undefined;
    notes: string;
  }>>([]);

  const { toast } = useToast();

  const handlePropertyChange = (property: string, checked: boolean) => {
    if (property === "All") {
      setFormData(prev => ({
        ...prev,
        selectedProperties: checked ? ["All"] : []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedProperties: checked 
          ? [...prev.selectedProperties.filter(p => p !== "All"), property]
          : prev.selectedProperties.filter(p => p !== property)
      }));
    }
  };

  const handleReportTypeChange = (reportType: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        selectedReportTypes: [...prev.selectedReportTypes, reportType]
      }));
      
      // Add default workflow task for this report type
      const config = reportTypeConfigs[reportType];
      if (config) {
        setWorkflowTasks(prev => [...prev, {
          reportType,
          reportParty: config.reportParty[0],
          frequency: config.defaultFrequency,
          days: "60",
          dueDate: undefined,
          notes: ""
        }]);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        selectedReportTypes: prev.selectedReportTypes.filter(rt => rt !== reportType)
      }));
      
      // Remove workflow task for this report type
      setWorkflowTasks(prev => prev.filter(task => task.reportType !== reportType));
    }
  };

  const updateWorkflowTask = (index: number, field: string, value: any) => {
    setWorkflowTasks(prev => prev.map((task, i) => 
      i === index ? { ...task, [field]: value } : task
    ));
  };

  const handleSubmit = () => {
    if (!formData.operator || !formData.lease || formData.selectedReportTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Operator, Lease, and at least one Report Type).",
        variant: "destructive"
      });
      return;
    }

    // Create entries for each workflow task
    workflowTasks.forEach((task, index) => {
      const newEntry: Omit<Submission, 'id'> = {
        operator: formData.operator,
        category: "Budgets", // Default category - could be made dynamic
        reportType: task.reportType,
        reportParty: task.reportParty,
        frequency: task.frequency,
        dueDate: task.dueDate ? format(task.dueDate, "MM/dd/yyyy") : "",
        period: task.dueDate ? format(task.dueDate, "yyyy") : "",
        leaseName: formData.lease,
        properties: formData.selectedProperties.join(", "),
        status: "submitted",
        reviewerApprover: "Pending Assignment",
        daysUnderStatus: 0,
        comments: task.notes || formData.notes,
        assetManager: "TBD",
        invManager: "TBD", 
        leaseAdmin: "TBD",
        invAssociate: "TBD"
      };
      
      onEntryCreate(newEntry);
    });

    toast({
      title: "Workflow Created",
      description: `Successfully created ${workflowTasks.length} workflow task(s) for ${formData.operator}`,
    });

    // Reset form
    setFormData({
      operator: "",
      lease: "",
      selectedProperties: [],
      selectedReportTypes: [],
      notes: ""
    });
    setWorkflowTasks([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Workflow Entry
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="operator">Operator *</Label>
              <Select value={formData.operator} onValueChange={(value) => setFormData(prev => ({ ...prev, operator: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {operators.map(op => (
                    <SelectItem key={op} value={op}>{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lease">Lease *</Label>
              <Select value={formData.lease} onValueChange={(value) => setFormData(prev => ({ ...prev, lease: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lease" />
                </SelectTrigger>
                <SelectContent>
                  {properties.filter(p => p !== "All").map(prop => (
                    <SelectItem key={prop} value={prop}>{prop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Properties</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                {properties.map(property => (
                  <div key={property} className="flex items-center space-x-2">
                    <Checkbox
                      id={property}
                      checked={formData.selectedProperties.includes(property)}
                      onCheckedChange={(checked) => handlePropertyChange(property, checked as boolean)}
                    />
                    <Label htmlFor={property} className="text-sm">{property}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Report Types */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Report Types *</Label>
              <div className="space-y-2 max-h-80 overflow-y-auto border rounded p-3">
                {Object.keys(reportTypeConfigs).map(reportType => (
                  <div key={reportType} className="flex items-start space-x-2">
                    <Checkbox
                      id={reportType}
                      checked={formData.selectedReportTypes.includes(reportType)}
                      onCheckedChange={(checked) => handleReportTypeChange(reportType, checked as boolean)}
                    />
                    <Label htmlFor={reportType} className="text-sm leading-5">{reportType}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">General Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any general notes for this workflow..."
                rows={4}
              />
            </div>
          </div>

          {/* Right Column - Workflow Configuration */}
          <div className="space-y-4">
            <Label>Workflow Task Configuration</Label>
            {workflowTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Select report types to configure workflow tasks
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {workflowTasks.map((task, index) => (
                  <div key={index} className="border rounded p-3 space-y-3">
                    <h4 className="font-medium text-sm">{task.reportType}</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Report Party</Label>
                        <Select 
                          value={task.reportParty} 
                          onValueChange={(value) => updateWorkflowTask(index, 'reportParty', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {reportTypeConfigs[task.reportType]?.reportParty.map(party => (
                              <SelectItem key={party} value={party}>{party}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-xs">Frequency</Label>
                        <Select 
                          value={task.frequency} 
                          onValueChange={(value) => updateWorkflowTask(index, 'frequency', value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {reportTypeConfigs[task.reportType]?.frequency.map(freq => (
                              <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs"># Days</Label>
                        <Input 
                          type="number"
                          value={task.days}
                          onChange={(e) => updateWorkflowTask(index, 'days', e.target.value)}
                          className="h-8 text-xs"
                          placeholder="60"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Due Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-8 text-xs justify-start text-left font-normal",
                                !task.dueDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {task.dueDate ? format(task.dueDate, "MM/dd/yyyy") : "Pick date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={task.dueDate}
                              onSelect={(date) => updateWorkflowTask(index, 'dueDate', date)}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">Task Notes</Label>
                      <Textarea 
                        value={task.notes}
                        onChange={(e) => updateWorkflowTask(index, 'notes', e.target.value)}
                        className="text-xs"
                        rows={2}
                        placeholder="Task-specific notes..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={workflowTasks.length === 0}>
            Create Workflow ({workflowTasks.length} tasks)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};