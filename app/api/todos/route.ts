import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ GET semua todo
export async function GET() {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(todos);
}

// ✅ POST todo baru
export async function POST(req: Request) {
  const { title } = await req.json();
  const newTodo = await prisma.todo.create({
    data: { title },
  });
  return NextResponse.json(newTodo, { status: 201 });
}

// ✅ PATCH (update todo berdasarkan id)
export async function PATCH(req: Request) {
  const { id, title, status } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
  }

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: {
        ...(title !== undefined && { title }),
        ...(status !== undefined && { status }),
    },
  });

  return NextResponse.json(updatedTodo);
}

// ✅ DELETE todo berdasarkan id
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
  }

  await prisma.todo.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Todo berhasil dihapus" });
}