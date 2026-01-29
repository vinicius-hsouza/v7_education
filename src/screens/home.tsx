import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { appFirebase, AuthContext } from "@/contexts/auth";
import { createExpense, createRevenue } from "@/lib/api";
import { formatBRL, parseBRL } from "@/lib/money";
import { CATEGORIES } from "@/lib/categories";
import { ACCOUNTS } from "@/lib/accounts";

import {
  collection,
  getFirestore,
  orderBy,
  query,
  Timestamp,
  Query,
  DocumentData,
} from "firebase/firestore";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* =======================
   TYPES
======================= */
type ExpenseItem = {
  id: string;
  name: string;
  value: number;
  type: "REVENUE" | "EXPENSE";
  category?: string;
  account?: string;
  created_at?: Timestamp | null;
};

export function Home() {
  const { user, signOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const db = getFirestore(appFirebase);

  /* =======================
     FIRESTORE QUERY (TIPADA)
  ======================= */
  const expensesCollection = collection(db, "expenses");

  const queryExpenses = query(
    expensesCollection,
    orderBy("created_at", "desc")
  ) as Query<DocumentData>;

  const [expenses] = useCollectionData<ExpenseItem>(queryExpenses as any);

  /* =======================
     SALDO TOTAL
  ======================= */
  const total = useMemo(() => {
    return (
      expenses?.reduce((acc, item) => {
        if (item.type === "REVENUE") return acc + item.value;
        if (item.type === "EXPENSE") return acc - item.value;
        return acc;
      }, 0) ?? 0
    );
  }, [expenses]);

  /* =======================
     SALDO POR CONTA
  ======================= */
  const balanceByAccount = useMemo(() => {
    const balances: Record<string, number> = {};

    ACCOUNTS.forEach((acc) => {
      balances[acc.id] = 0;
    });

    expenses?.forEach((item) => {
      const account = item.account ?? "CHECKING";

      if (item.type === "REVENUE") {
        balances[account] += item.value;
      }

      if (item.type === "EXPENSE") {
        balances[account] -= item.value;
      }
    });

    return balances;
  }, [expenses]);

  /* =======================
     AGRUPAMENTO POR DIA
     (SAFE PARA created_at NULL)
  ======================= */
  const groupedExpenses = useMemo(() => {
    if (!expenses) return [];

    const groups: Record<string, ExpenseItem[]> = {};

    expenses.forEach((item) => {
      const date = item.created_at
        ? item.created_at.toDate()
        : new Date();

      const key = date.toLocaleDateString("pt-BR");

      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    return Object.entries(groups);
  }, [expenses]);

  /* =======================
     MODAL STATE
  ======================= */
  const [open, setOpen] = useState<null | "REVENUE" | "EXPENSE">(null);
  const [name, setName] = useState("");
  const [rawValue, setRawValue] = useState("");
  const [category, setCategory] = useState("OTHER");
  const [account, setAccount] = useState("CHECKING");

  function handleSave() {
    if (!name || !rawValue || !user) return;

    const value = parseBRL(rawValue);

    const payload = {
      name,
      value,
      category,
      account,
    };

    if (open === "REVENUE") {
      createRevenue(user, payload);
    }

    if (open === "EXPENSE") {
      createExpense(user, payload);
    }

    setName("");
    setRawValue("");
    setCategory("OTHER");
    setAccount("CHECKING");
    setOpen(null);
  }

  function getCategoryLabel(id?: string) {
    return (
      CATEGORIES.find((c) => c.id === id)?.label ??
      "📦 Outros"
    );
  }

  function getAccountLabel(id?: string) {
    return (
      ACCOUNTS.find((a) => a.id === id)?.label ??
      "💳 Conta Corrente"
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            {/* {user?.avatarUrl && (
              <AvatarImage src={user.avatarUrl} />
            )} */}
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <span className="text-sm font-medium">
            Olá, {user?.email}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            signOutUser();
            navigate("/sign-in");
          }}
        >
          Sair
        </Button>
      </div>

      {/* SALDO TOTAL */}
      <div className="mx-4 rounded-xl bg-zinc-900 p-4 text-white">
        <p className="text-sm opacity-80">Saldo total</p>
        <p className="text-2xl font-bold">
          {formatBRL(total)}
        </p>
      </div>

      {/* SALDO POR CONTA */}
      <div className="mx-4 mt-4 space-y-2">
        {ACCOUNTS.map((acc) => (
          <div
            key={acc.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
          >
            <span>{acc.label}</span>
            <span
              className={
                balanceByAccount[acc.id] < 0
                  ? "font-medium text-red-600"
                  : "font-medium text-green-600"
              }
            >
              {formatBRL(balanceByAccount[acc.id] ?? 0)}
            </span>
          </div>
        ))}
      </div>

      {/* AÇÕES */}
      <div className="flex gap-2 p-4">
        <Button className="flex-1" onClick={() => setOpen("REVENUE")}>
          + Receita
        </Button>

        <Button
          className="flex-1"
          variant="destructive"
          onClick={() => setOpen("EXPENSE")}
        >
          - Despesa
        </Button>
      </div>

      {/* LISTA */}
      <div className="flex-1 px-4">
        {groupedExpenses.map(([date, items]) => (
          <div key={date} className="mb-4">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {date}
            </p>

            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-3 text-sm"
              >
                <div className="flex flex-col">
                  <span className="truncate">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {getCategoryLabel(item.category)} •{" "}
                    {getAccountLabel(item.account)}
                  </span>
                </div>

                <span
                  className={
                    item.type === "REVENUE"
                      ? "font-medium text-green-600"
                      : "font-medium text-red-600"
                  }
                >
                  {item.type === "REVENUE" ? "+" : "-"}{" "}
                  {formatBRL(item.value)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {open === "REVENUE"
                ? "Nova receita"
                : "Nova despesa"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="Descrição"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Valor"
              inputMode="numeric"
              value={rawValue}
              onChange={(e) =>
                setRawValue(
                  formatBRL(parseBRL(e.target.value))
                )
              }
            />

            <select
              className="rounded-md border px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              className="rounded-md border px-3 py-2 text-sm"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            >
              {ACCOUNTS.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.label}
                </option>
              ))}
            </select>

            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
