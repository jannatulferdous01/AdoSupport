"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface EditExpertModalProps {
  open: boolean;
  expert: ExpertUser | null;
  onClose: () => void;
  onSubmit: (expertData: Partial<ExpertUser>) => void;
}

export default function EditExpertModal({
  open,
  expert,
  onClose,
  onSubmit,
}: EditExpertModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    experience: "",
    location: "",
    hourlyRate: "",
    status: "",
    availability: "",
    qualifications: [] as string[],
  });

  const [newQualification, setNewQualification] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form when expert changes
  useEffect(() => {
    if (expert) {
      setFormData({
        name: expert.name,
        email: expert.email,
        phone: expert.phone,
        specialty: expert.specialty,
        experience: expert.experience.toString(),
        location: expert.location,
        hourlyRate: expert.hourlyRate.toString(),
        status: expert.status,
        availability: expert.availability,
        qualifications: [...expert.qualifications],
      });
    }
  }, [expert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expert) return;

    setLoading(true);
    try {
      await onSubmit({
        id: expert.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialty,
        experience: parseInt(formData.experience),
        location: formData.location,
        hourlyRate: parseFloat(formData.hourlyRate),
        status: formData.status as "active" | "suspended" | "pending",
        availability: formData.availability as "available" | "busy" | "offline",
        qualifications: formData.qualifications,
      });
      onClose();
    } catch (error) {
      console.error("Error updating expert:", error);
    } finally {
      setLoading(false);
    }
  };

  const addQualification = () => {
    if (
      newQualification.trim() &&
      !formData.qualifications.includes(newQualification.trim())
    ) {
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
          <DialogTitle>Edit Expert Account</DialogTitle>
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
                  <SelectValue />
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

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability *</Label>
              <Select
                value={formData.availability}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, availability: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
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
                    >
                      {""}
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
              {loading ? "Updating..." : "Update Expert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
