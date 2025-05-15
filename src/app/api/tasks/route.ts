import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

import { prisma } from "@/lib/prisma"; // or wherever your prisma client is exported

// const prisma = new PrismaClient();

// GET: Fetch all tasks
// export async function GET() {
//   try {
//     const tasks = await prisma.task.findMany();
//     return NextResponse.json(tasks);
//   } catch (error) {
//     return NextResponse.error();
//   }
// }



export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const tasks = await prisma.task.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalCount = await prisma.task.count();

    return NextResponse.json({
      tasks,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching tasks" }, { status: 500 });
  }
}





// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, status, priority } = body;

    if (!title || !description || !status || !priority) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// PUT: Update an existing task
export async function PUT(req: Request) {
  const { id, title, description, status, priority } = await req.json();

  if (!id || !title || !description || !status || !priority) {
    return NextResponse.json({ error: 'Missing fields or ID' }, { status: 400 });
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, status, priority },
    });
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.error();
    console.log(error);
  }
}

// DELETE: Delete a task by ID
// export async function DELETE(req: Request) {
//   const { id } = await req.json();

//   if (!id) {
//     return NextResponse.json({ error: 'ID is required' }, { status: 400 });
//   }

//   try {
//     await prisma.task.delete({ where: { id } });
//     return NextResponse.json({ message: 'Task deleted' });
//   } catch (error) {
//     return NextResponse.error();
//   }
// }


export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (!id || typeof id !== "string") {
    return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
  }

  try {
    const task = await prisma.task.delete({
      where: { id },
    });
    
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ message: "Error deleting task" }, { status: 500 });
    console.log(error);
  }
}