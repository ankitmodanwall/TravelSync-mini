import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2 animate-fade-in-up animation-delay-200">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">
          Help & Support
        </h1>
        <p className="text-muted-foreground">
          Find answers to your questions and get support.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">

        <div className="animate-scale-in smooth-transition hover:-translate-y-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The help center is currently under construction.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="animate-scale-in animation-delay-200 smooth-transition hover:-translate-y-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code />
                Developer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This application was developed by Ankit Modanwal.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
