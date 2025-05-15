"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface edit{
  description: string,
  priority: string,
  title: string,
}

export default function EditTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [task, setTask] = useState<edit>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("in-progress");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    async function fetchTask() {
      const res = await fetch(`/api/tasks?id=${params.id}`);
      const data = await res.json();
      setTask(data);
      setTitle(data.title);
      setDescription(data.description);
      setStatus(data.status);
      setPriority(data.priority);
    }
    fetchTask();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTask = { id: params.id, title, description, status, priority };

    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (res.ok) {
        toast.success("Task updated successfully!");
        router.push("/tasks");
      } else {
        toast.error("Error updating task");
      }
    } catch (error) {
      console.log("error got", error);
      toast.error("Error updating task");
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="block w-full p-2 border rounded"
          >
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="block w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <Button type="submit">Update Task</Button>
      </form>
    </div>
  );
}
