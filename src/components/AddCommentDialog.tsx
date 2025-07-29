import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, User } from "lucide-react";

interface AddCommentDialogProps {
  submissionId: string | null;
  operatorName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommentAdd: (submissionId: string, comment: string, commentType: string) => void;
}

export const AddCommentDialog = ({ 
  submissionId, 
  operatorName, 
  open, 
  onOpenChange, 
  onCommentAdd 
}: AddCommentDialogProps) => {
  const [comment, setComment] = useState("");
  const [commentType, setCommentType] = useState("general");
  const { toast } = useToast();

  const commentTypes = [
    { value: "general", label: "General Comment" },
    { value: "feedback", label: "Feedback" },
    { value: "correction", label: "Correction Required" },
    { value: "approval", label: "Approval Note" },
    { value: "follow-up", label: "Follow-up Required" }
  ];

  const handleSubmit = () => {
    if (!submissionId || !comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment before submitting.",
        variant: "destructive"
      });
      return;
    }

    onCommentAdd(submissionId, comment, commentType);
    
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the submission.",
    });

    // Reset form and close dialog
    setComment("");
    setCommentType("general");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setComment("");
    setCommentType("general");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>Add Comment</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {operatorName && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">For: {operatorName}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="comment-type">Comment Type</Label>
            <Select value={commentType} onValueChange={setCommentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {commentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment..."
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add Comment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};