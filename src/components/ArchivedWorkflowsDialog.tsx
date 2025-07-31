import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { Archive, Eye } from "lucide-react";
import { mockArchivedWorkflows } from "@/lib/mockBackend";

interface ArchivedWorkflowsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ArchivedWorkflowsDialog = ({ 
  open, 
  onOpenChange 
}: ArchivedWorkflowsDialogProps) => {
  const archivedWorkflows = mockArchivedWorkflows;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archived Workflows
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            View historical workflows and completed submissions from previous periods.
          </p>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Operator</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Report Type</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Reviewer/Approver</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold">Submitted Date</TableHead>
                  <TableHead className="font-semibold">Period</TableHead>
                  <TableHead className="font-semibold">Comments</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archivedWorkflows.map((workflow) => (
                  <TableRow key={workflow.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{workflow.operator}</TableCell>
                    <TableCell>{workflow.category}</TableCell>
                    <TableCell>{workflow.reportType}</TableCell>
                    <TableCell>
                      <StatusBadge status={workflow.status} />
                    </TableCell>
                    <TableCell>{workflow.reviewerApprover}</TableCell>
                    <TableCell>{workflow.dueDate}</TableCell>
                    <TableCell>{workflow.receivedDate}</TableCell>
                    <TableCell>{workflow.period}</TableCell>
                    <TableCell>
                      <div className="max-w-40 truncate text-sm">
                        {workflow.comments || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {archivedWorkflows.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No archived workflows found.</p>
            </div>
          )}
          
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};