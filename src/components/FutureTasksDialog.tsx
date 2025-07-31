import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { addFutureTask, getFutureTasksForSubmission, type FutureTask } from "@/lib/mockBackend";

interface FutureTasksDialogProps {
  submissionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FutureTasksDialog = ({ 
  submissionId, 
  open, 
  onOpenChange 
}: FutureTasksDialogProps) => {
  const [tasks, setTasks] = useState<FutureTask[]>([]);
  const [newTask, setNewTask] = useState({
    task: "",
    assignee: "",
    dueDate: "",
    priority: "medium" as const
  });
  const { toast } = useToast();

  // Load existing tasks when dialog opens
  React.useEffect(() => {
    if (open && submissionId) {
      const existingTasks = getFutureTasksForSubmission(submissionId);
      setTasks(existingTasks);
    }
  }, [open, submissionId]);

  const handleAddTask = () => {
    if (!submissionId || !newTask.task.trim() || !newTask.assignee.trim() || !newTask.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const createdTask = addFutureTask({
      submissionId,
      task: newTask.task,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      status: "pending"
    });

    setTasks(prev => [...prev, createdTask]);
    setNewTask({
      task: "",
      assignee: "",
      dueDate: "",
      priority: "medium"
    });

    toast({
      title: "Task Added",
      description: "Future task has been created successfully.",
    });
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast({
      title: "Task Removed",
      description: "Future task has been removed.",
    });
  };

  const priorityColors = {
    high: "text-red-600",
    medium: "text-yellow-600", 
    low: "text-green-600"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Future Tasks
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Existing Tasks */}
          {tasks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Current Future Tasks</h3>
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.task}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>Assignee: {task.assignee}</span>
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span className={priorityColors[task.priority]}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTask(task.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Task */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-medium text-sm">Add New Future Task</h3>
            
            <div className="space-y-2">
              <Label htmlFor="task">Task Description</Label>
              <Textarea
                id="task"
                value={newTask.task}
                onChange={(e) => setNewTask(prev => ({ ...prev, task: e.target.value }))}
                placeholder="Describe the future task..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                  placeholder="Who should handle this task?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAddTask} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Future Task
            </Button>
          </div>
          
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
