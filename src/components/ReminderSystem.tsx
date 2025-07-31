import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkReminders } from "@/lib/mockBackend";
import { Bell } from "lucide-react";

export const ReminderSystem = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Simulate checking reminders on component mount (like a daily check)
    const checkForReminders = () => {
      const activeReminders = checkReminders();
      
      activeReminders.forEach(reminder => {
        toast({
          title: "📅 Reminder: Template Upload Required",
          description: `${reminder.recipient}: ${reminder.message}. Due: ${new Date(reminder.dueDate).toLocaleDateString()}`,
          duration: 10000,
        });
      });
    };

    // Check reminders immediately
    checkForReminders();

    // Set up periodic checking (every 24 hours in production, demo every 30 seconds)
    const interval = setInterval(checkForReminders, 30000);

    return () => clearInterval(interval);
  }, [toast]);

  return null; // This is a service component with no UI
};