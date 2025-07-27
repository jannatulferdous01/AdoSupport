"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { ExpertUser } from "../../page";

interface CreateExpertModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (expertData: Partial<ExpertUser>) => void;
}

export default function CreateExpertModal({
  open,
  onClose,
  onSubmit,
}: CreateExpertModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    experience: "",
    location: "",
    hourlyRate: "",
    qualifications: [] as string[],
  });

  const [newQualification, setNewQualification] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialty,
        experience: parseInt(formData.experience),
        location: formData.location,
        hourlyRate: parseFloat(formData.hourlyRate),
        qualifications: formData.qualifications,
        status: "pending" as const,
        availability: "offline" as const,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        experience: "",
        location: "",
        hourlyRate: "",
        qualifications: [],
      });
      setNewQualification("");
    } catch (error) {
      console.error("Error creating expert:", error);
    } finally {
      setLoading(false);
    }
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      setFormData((prev) => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()],
      }));
      setNewQualification("");
    }
  };

  const removeQualification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Expert Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty *</Label>
              <Select
                value={formData.specialty}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, specialty: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="psychology">Psychology</SelectItem>
                  <SelectItem value="psychiatry">Psychiatry</SelectItem>
                  <SelectItem value="counseling">Counseling</SelectItem>
                  <SelectItem value="therapy">Therapy</SelectItem>
                  <SelectItem value="social-work">Social Work</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience *</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                value={formData.experience}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hourlyRate: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="e.g., New York, NY"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Qualifications</Label>
            <div className="flex gap-2">
              <Input
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                placeholder="Add a qualification..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addQualification();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQualification}
                disabled={!newQualification.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {formData.qualifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.qualifications.map((qual, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {qual}
                    <button
                      type="button"
                      onClick={() => removeQualification(index)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                    >{""}
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Expert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
