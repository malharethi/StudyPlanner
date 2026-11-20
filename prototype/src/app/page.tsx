import Link from "next/link";
import { prisma } from "@/lib/db";
import { ExpenseForm, GroupForm, MemberForm } from "./forms";

export const dynamic = "force-dynamic";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const money = (cents: number) => usd.format(cents / 100);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ group?: string | string[] }>;
}) {
  const { group: selected } = await searchParams;
  const groups = await prisma.group.findMany({ orderBy: { id: "asc" } });
  const active = groups.find(({ id }) => String(id) === selected) ?? groups[0];
  const group = active && await prisma.group.findUnique({
    where: { id: active.id },
    include: {
      members: { orderBy: { id: "asc" } },
      expenses: {
        orderBy: { id: "desc" },
        include: { payer: true, shares: { orderBy: { memberId: "asc" }, include: { member: true } } },
      },
    },
  });

  const balances = new Map(group?.members.map(({ id }) => [id, 0]));
  for (const expense of group?.expenses ?? []) {
    balances.set(expense.payerId, (balances.get(expense.payerId) ?? 0) + expense.amountCents);
    for (const share of expense.shares) {
      balances.set(share.memberId, (balances.get(share.memberId) ?? 0) - share.amountCents);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="shell brand"><span aria-hidden="true">$</span> SplitSmart</div>
      </header>
      <main className="shell workspace">
        <aside>
          <section className="card">
            <h2>Groups</h2>
            {groups.length > 0 && (
              <nav aria-label="Groups">
                {groups.map(({ id, name }) => (
                  <Link key={id} href={`/?group=${id}`} aria-current={group?.id === id ? "page" : undefined}>
                    {name}
                  </Link>
                ))}
              </nav>
            )}
            <GroupForm />
          </section>
        </aside>
        {group ? (
          <div className="dashboard" key={group.id}>
            <h1>{group.name}</h1>
            <div className="overview">
              <section className="card">
                <h2>Members</h2>
                {group.members.length ? (
                  <ul className="members">
                    {group.members.map(({ id, name }) => <li key={id}>{name}</li>)}
                  </ul>
                ) : <p className="muted">Add your first member to get started.</p>}
                <MemberForm groupId={group.id} />
              </section>
              <section className="card">
                <h2>Net balances</h2>
                {group.members.length ? (
                  <>
                    <p className="muted">Positive balances receive money. Negative balances owe money.</p>
                    <ul className="balances">
                      {group.members.map(({ id, name }) => {
                        const balance = balances.get(id) ?? 0;
                        return (
                          <li key={id}>
                            <span>{name}</span>
                            <strong className={balance > 0 ? "positive" : balance < 0 ? "negative" : ""}>
                              {balance > 0 && "+"}{money(balance)}
                            </strong>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : <p className="muted">Balances appear after you add members.</p>}
              </section>
            </div>
            <section className="card">
              <h2>Record an expense</h2>
              {group.members.length ? (
                <ExpenseForm groupId={group.id} members={group.members} />
              ) : <p className="muted">Add a member before recording an expense.</p>}
            </section>
            <section className="card">
              <h2>Expense history</h2>
              {group.expenses.length ? (
                <ul className="history">
                  {group.expenses.map((expense) => (
                    <li key={expense.id}>
                      <div className="history-heading">
                        <h3>{expense.description}</h3>
                        <strong>{money(expense.amountCents)}</strong>
                      </div>
                      <p className="muted">Paid by {expense.payer.name}</p>
                      <ul className="shares" aria-label="Participant shares">
                        {expense.shares.map(({ member, amountCents }) => (
                          <li key={member.id}>{member.name} · {money(amountCents)}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : <p className="muted">No expenses recorded yet.</p>}
            </section>
          </div>
        ) : (
          <section className="card empty">
            <h1>Start splitting expenses</h1>
            <p className="muted">Create a group, add members, and record your first shared expense.</p>
          </section>
        )}
      </main>
    </>
  );
}
