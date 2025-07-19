import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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