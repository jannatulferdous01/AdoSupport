"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import FormInput from "@/components/form/FormInput";
import FormTextarea from "@/components/form/FormTextarea";
import FormSelect from "@/components/form/FormSelect";
import CustomForm from "@/components/form/CustomForm";
import { topicsList } from "../_data/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

// Schema for general post
const generalPostSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(10, "Post content must be at least 10 characters"),
  tags: z.array(z.string()).optional(),
});

// Schema for question post
const questionPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z
    .string()
    .min(10, "Question details must be at least 10 characters"),
  tags: z.array(z.string()).min(1, "Please select at least one topic"),
});

// Schema for story post
const storyPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Story must be at least 10 characters"),
  challenge: z.string().min(5, "Please describe the challenge"),
  solution: z.string().min(5, "Please describe what helped"),
  tags: z.array(z.string()).min(1, "Please select at least one topic"),
});

// Schema for resource post
const resourcePostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Description must be at least 10 characters"),
  resourceUrl: z.string().url("Please enter a valid URL").optional(),
  tags: z.array(z.string()).min(1, "Please select at least one topic"),
});

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreatePostDialog({
  open,
  onOpenChange,
}: CreatePostDialogProps) {
  const [postType, setPostType] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSchemaForType = () => {
    switch (postType) {
      case "question":
        return questionPostSchema;
      case "story":
        return storyPostSchema;
      case "resource":
        return resourcePostSchema;
      default:
        return generalPostSchema;
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // In a real app, you'd send this data to your API
      console.log("Creating post:", { type: postType, ...data });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Post created successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const topicOptions = topicsList.map((topic) => ({
    label: topic.charAt(0).toUpperCase() + topic.slice(1),
    value: topic,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Create a Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, questions, or helpful resources with the
            community.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={postType} onValueChange={setPostType} className="w-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="question">Question</TabsTrigger>
              <TabsTrigger value="story">Story</TabsTrigger>
              <TabsTrigger value="resource">Resource</TabsTrigger>
            </TabsList>
          </div>

          <div className="px-6 pb-6">
            <TabsContent value="general">
              <CustomForm
                onSubmit={handleSubmit}
                resolver={zodResolver(generalPostSchema)}
                defaultValues={{
                  title: "",
                  content: "",
                  tags: [],
                }}
                className="space-y-4"
              >
                <FormInput
                  name="title"
                  label="Title (Optional)"
                  placeholder="What's on your mind?"
                />

                <FormTextarea
                  name="content"
                  label="Content"
                  placeholder="Share your thoughts..."
                  required
                  rows={5}
                />

                <FormSelect
                  name="tags"
                  label="Topics (Optional)"
                  placeholder="Select related topics"
                  options={topicOptions}
                />

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </CustomForm>
            </TabsContent>

            <TabsContent value="question">
              <CustomForm
                onSubmit={handleSubmit}
                resolver={zodResolver(questionPostSchema)}
                defaultValues={{
                  title: "",
                  content: "",
                  tags: [],
                }}
                className="space-y-4"
              >
                <FormInput
                  name="title"
                  label="Question"
                  placeholder="What would you like to ask?"
                  required
                />

                <FormTextarea
                  name="content"
                  label="Details"
                  placeholder="Provide more context about your question..."
                  required
                  rows={5}
                />

                <FormSelect
                  name="tags"
                  label="Topics"
                  placeholder="Select related topics"
                  options={topicOptions}
                  required
                />
                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Ask Question"
                    )}
                  </Button>
                </div>
              </CustomForm>
            </TabsContent>

            <TabsContent value="story">
              <CustomForm
                onSubmit={handleSubmit}
                resolver={zodResolver(storyPostSchema)}
                defaultValues={{
                  title: "",
                  content: "",
                  challenge: "",
                  solution: "",
                  tags: [],
                }}
                className="space-y-4"
              >
                <FormInput
                  name="title"
                  label="Title"
                  placeholder="Give your success story a title"
                  required
                />

                <FormTextarea
                  name="content"
                  label="Story"
                  placeholder="Share your experience..."
                  required
                  rows={4}
                />

                <FormTextarea
                  name="challenge"
                  label="Challenge Faced"
                  placeholder="What challenge did you overcome?"
                  required
                  rows={2}
                />

                <FormTextarea
                  name="solution"
                  label="What Helped"
                  placeholder="What strategies or support helped you?"
                  required
                  rows={2}
                />

                <FormSelect
                  name="tags"
                  label="Topics"
                  placeholder="Select related topics"
                  options={topicOptions}
                  required
                />

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Share Story"
                    )}
                  </Button>
                </div>
              </CustomForm>
            </TabsContent>

            <TabsContent value="resource">
              <CustomForm
                onSubmit={handleSubmit}
                resolver={zodResolver(resourcePostSchema)}
                defaultValues={{
                  title: "",
                  content: "",
                  resourceUrl: "",
                  tags: [],
                }}
                className="space-y-4"
              >
                <FormInput
                  name="title"
                  label="Resource Title"
                  placeholder="Name of the resource"
                  required
                />

                <FormTextarea
                  name="content"
                  label="Description"
                  placeholder="Describe this resource and how it might help others..."
                  required
                  rows={4}
                />

                <FormInput
                  name="resourceUrl"
                  label="Link (Optional)"
                  placeholder="https://example.com/resource"
                />

                <FormSelect
                  name="tags"
                  label="Topics"
                  placeholder="Select related topics"
                  options={topicOptions}
                  required
                />

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Share Resource"
                    )}
                  </Button>
                </div>
              </CustomForm>
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-600"
          >
            <ImageIcon size={16} className="mr-1" />
            Add Image
          </Button>
          <p className="text-xs text-gray-500">
            Images must be less than 5MB. Supported formats: JPEG, PNG, GIF
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
