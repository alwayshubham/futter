"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DeleteTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?id=${params.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Task deleted successfully!");
        router.push("/tasks");
      } else {
        toast.error("Error deleting task");
      }
    } catch (error) {
      toast.error("Error deleting task");
      console.log("error", error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Are you sure you want to delete this task?</h3>
        </CardHeader>
        <CardBody>
          <p>This action cannot be undone.</p>
          <div className="mt-4 flex justify-end">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/tasks")}
              className="ml-2"
            >
              No, Cancel
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
