"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

function readId(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return id <= 2_147_483_647 ? id : null;
}

function readText(form: FormData, field: string) {
  const value = form.get(field);
  return typeof value === "string" ? value.trim() : "";
}

export async function createGroup(_previous: string, form: FormData) {
  const name = readText(form, "name");
  if (!name || name.length > 80) return "Enter a group name of 1–80 characters.";

  const group = await prisma.group.create({ data: { name } });
  revalidatePath("/");
  redirect(`/?group=${group.id}`);
}

export async function addMember(groupId: number, _previous: string, form: FormData) {
  const name = readText(form, "name");
  if (!name || name.length > 80) return "Enter a member name of 1–80 characters.";
  if (!(await prisma.group.findUnique({ where: { id: groupId } }))) {
    return "Select an existing group.";
  }

  await prisma.member.create({ data: { name, groupId } });
  revalidatePath("/");
  return "";
}

export async function recordExpense(groupId: number, _previous: string, form: FormData) {
  const description = readText(form, "description");
  if (!description || description.length > 160) {
    return "Enter an expense description of 1–160 characters.";
  }

  const amount = readText(form, "amount");
  const match = /^(\d{1,8})(?:\.(\d{1,2}))?$/.exec(amount);
  const amountCents = match
    ? Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"))
    : 0;
  if (amountCents < 1 || amountCents > 2_147_483_647) {
    return "Enter an amount from $0.01 to $21,474,836.47 with up to two decimal places.";
  }

  const payerId = readId(form.get("payer"));
  const participantIds = form.getAll("participants").map(readId);
  if (payerId === null) return "Select a valid payer from this group.";
  if (!participantIds.length) return "Select at least one participant.";
  if (participantIds.includes(null) || new Set(participantIds).size !== participantIds.length) {
    return "Select valid, distinct participants from this group.";
  }

  const members = await prisma.member.findMany({
    where: { groupId },
    orderBy: { id: "asc" },
    select: { id: true },
  });
  if (!members.some(({ id }) => id === payerId)) return "The payer must belong to this group.";

  const participants = members.filter(({ id }) => participantIds.includes(id));
  if (participants.length !== participantIds.length) {
    return "Every participant must belong to this group.";
  }

  const baseShare = Math.floor(amountCents / participants.length);
  const leftover = amountCents % participants.length;
  await prisma.expense.create({
    data: {
      groupId,
      payerId,
      description,
      amountCents,
      shares: {
        create: participants.map(({ id }, index) => ({
          memberId: id,
          amountCents: baseShare + (index < leftover ? 1 : 0),
        })),
      },
    },
  });

  revalidatePath("/");
  return "";
}
