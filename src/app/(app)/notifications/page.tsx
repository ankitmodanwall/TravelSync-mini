import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2 animate-fade-in-up animation-delay-200">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">
          Notifications
        </h1>
        <p className="text-muted-foreground">
          Your latest updates and alerts will appear here.
        </p>
      </div>
      <div className="animate-scale-in animation-delay-200 smooth-transition hover:-translate-y-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell />
              All Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                You have no new notifications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
