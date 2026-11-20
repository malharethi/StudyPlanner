"use client";

import { useActionState, type ReactNode } from "react";
import { addMember, createGroup, recordExpense } from "./actions";

function ActionForm({
  action,
  children,
  label,
  inline = false,
}: {
  action: (state: string, form: FormData) => Promise<string>;
  children: ReactNode;
  label: string;
  inline?: boolean;
}) {
  const [error, submit, pending] = useActionState(action, "");

  return (
    <form action={submit} className={inline ? "inline-form" : "stack-form"}>
      {children}
      <button disabled={pending}>{pending ? "Saving…" : label}</button>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  );
}

export function GroupForm() {
  return (
    <ActionForm action={createGroup} label="Create group" inline>
      <input aria-label="Group name" name="name" placeholder="e.g. Weekend trip" required maxLength={80} />
    </ActionForm>
  );
}

export function MemberForm({ groupId }: { groupId: number }) {
  return (
    <ActionForm action={addMember.bind(null, groupId)} label="Add member" inline>
      <input aria-label="Member name" name="name" placeholder="Member name" required maxLength={80} />
    </ActionForm>
  );
}

export function ExpenseForm({
  groupId,
  members,
}: {
  groupId: number;
  members: { id: number; name: string }[];
}) {
  return (
    <ActionForm action={recordExpense.bind(null, groupId)} label="Record expense">
      <label>
        Description
        <input name="description" placeholder="e.g. Dinner" required maxLength={160} />
      </label>
      <div className="expense-fields">
        <label>
          Amount (USD)
          <input name="amount" inputMode="decimal" placeholder="0.00" required />
        </label>
        <label>
          Paid by
          <select name="payer" defaultValue="" required>
            <option value="" disabled>Select payer</option>
            {members.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Split equally among</legend>
        <div className="participants">
          {members.map(({ id, name }) => (
            <label key={id}><input type="checkbox" name="participants" value={id} />{name}</label>
          ))}
        </div>
      </fieldset>
    </ActionForm>
  );
}
