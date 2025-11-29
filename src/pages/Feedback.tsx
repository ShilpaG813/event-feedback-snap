import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "@/components/NavLink";
import { ArrowLeft, Star } from "lucide-react";
import { format } from "date-fns";

const Feedback = () => {
  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <NavLink to="/">
            <ArrowLeft className="h-5 w-5" />
          </NavLink>
          <div>
            <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-secondary">
              Feedback Submissions
            </h1>
            <p className="text-muted-foreground mt-1">View all submitted feedback entries</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Feedback</CardTitle>
            <CardDescription>
              {feedbacks ? `${feedbacks.length} total submissions` : "Loading..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading feedback...</div>
            ) : feedbacks && feedbacks.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks.map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(feedback.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="font-medium">{feedback.name}</TableCell>
                        <TableCell>{feedback.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            <span className="font-semibold">{feedback.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          {feedback.comments || (
                            <span className="text-muted-foreground italic">No comments</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No feedback submitted yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
