/**new code */
"use client";

import React, { useEffect, useState } from "react";
import { Task } from "@/generated/prisma"; // Prisma types

import Link from "next/link";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch tasks with pagination
  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch(`/api/tasks?page=${currentPage}&limit=10`);
        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await res.json();
        setTasks(data.tasks);
        setTotalPages(data.totalPages);
      } catch (error) {
        
        toast.error("Error loading tasks");
        console.log("error become error", error)
      }
    }

    fetchTasks();
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task List</h1>
        <Link href="/tasks/create">
          <Button>Add New Task</Button>
        </Link>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <h3 className="text-lg font-semibold">{task.title}</h3>
            </CardHeader>
            <CardBody>
              <p>{task.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span>Status: {task.status}</span>
                <span>Priority: {task.priority}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
