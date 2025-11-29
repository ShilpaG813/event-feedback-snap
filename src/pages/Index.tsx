import { FeedbackForm } from "@/components/FeedbackForm";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="absolute top-4 right-4">
          <NavLink to="/feedback">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              View Submissions
            </Button>
          </NavLink>
        </div>
        <div className="text-center mb-12 space-y-4 animate-in fade-in-0 slide-in-from-top-4 duration-1000">
          <h1 className="text-5xl md:text-6xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary">
            Your Voice Matters
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us create even better experiences by sharing your honest feedback
          </p>
        </div>
        
        <FeedbackForm />
        
        <footer className="text-center mt-12 text-sm text-muted-foreground animate-in fade-in-0 duration-1000 delay-300">
          <p>Your feedback is completely anonymous and helps us improve our events</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
