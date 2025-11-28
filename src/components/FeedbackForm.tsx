import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

const feedbackSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z.string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  rating: z.number()
    .int()
    .min(1, { message: "Please select a rating" })
    .max(5, { message: "Rating must be between 1 and 5" }),
  comments: z.string()
    .trim()
    .max(1000, { message: "Comments must be less than 1000 characters" })
    .optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export const FeedbackForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("feedbacks").insert([
        {
          name: data.name,
          email: data.email,
          rating: data.rating,
          comments: data.comments || null,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      reset();
      setSelectedRating(null);
      
      toast.success("Thank you for your feedback!", {
        description: "Your response has been recorded.",
      });

      // Reset success state after animation
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating, { shouldValidate: true });
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl shadow-lg border-0 bg-card animate-in fade-in-0 zoom-in-95 duration-500">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6">
          <div className="rounded-full bg-primary/10 p-6 mb-6 animate-in zoom-in-50 duration-700">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-3xl font-display font-bold text-card-foreground mb-3">
            Thank You!
          </h2>
          <p className="text-muted-foreground text-center max-w-md text-lg">
            Your feedback has been successfully submitted. We appreciate you taking the time to share your thoughts.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl shadow-lg border-0 bg-card animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <CardHeader className="space-y-3 pb-8">
        <CardTitle className="text-4xl font-display font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Event Feedback
        </CardTitle>
        <CardDescription className="text-center text-base">
          We'd love to hear about your experience! Your feedback helps us improve future events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="John Doe"
              className="h-12 text-base"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="john@example.com"
              className="h-12 text-base"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">
              Rating <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-3 flex-wrap">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingClick(rating)}
                  disabled={isSubmitting}
                  className={`
                    flex-1 min-w-[60px] h-16 rounded-xl font-display font-semibold text-lg
                    transition-all duration-300 transform
                    ${
                      selectedRating === rating
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground scale-105 shadow-lg"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground hover:scale-105"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {rating}
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments" className="text-base font-medium">
              Comments <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Textarea
              id="comments"
              {...register("comments")}
              placeholder="Share your thoughts about the event..."
              className="min-h-[120px] text-base resize-none"
              disabled={isSubmitting}
            />
            {errors.comments && (
              <p className="text-sm text-destructive">{errors.comments.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 text-lg font-display font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
