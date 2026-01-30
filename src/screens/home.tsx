import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/contexts/auth";
import { appFirebase } from "@/contexts/auth";
import {
  collection,
  getFirestore,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NewTransactionModal } from "@/components/new-transaction-modal";
import { getMonthRange, formatMonthYear } from "@/lib/date";



import type { Category } from "@/lib/categories";


type ExpenseItem = {
  uid: string;
  userId: string;
  name: string;
  value: number;
  type: "EXPENSE" | "REVENUE";
  category: Category;
  created_at_ts: any;
};

export function Home() {
  const firestore = getFirestore(appFirebase);
  const { user, signOutUser } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const previousMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() - 1
  );

  const { start: prevStart, end: prevEnd } = getMonthRange(previousMonth);

  const previousExpensesQuery = useMemo(() => {
    if (!user) return null;

    return query(
      collection(firestore, "expenses"),
      where("userId", "==", user.id),
      where("created_at_ts", ">=", Timestamp.fromDate(prevStart)),
      where("created_at_ts", "<", Timestamp.fromDate(prevEnd))
    );
  }, [user, prevStart, prevEnd, firestore]);

  const [previousExpenses = []] =
    useCollectionData(previousExpensesQuery ?? undefined);

  const { start, end } = getMonthRange(currentMonth);

  const expensesQuery = useMemo(() => {
    if (!user) return null;

    return query(
      collection(firestore, "expenses"),
      where("userId", "==", user.id),
      where("created_at_ts", ">=", Timestamp.fromDate(start)),
      where("created_at_ts", "<", Timestamp.fromDate(end)),
      orderBy("created_at_ts", "desc")
    );
  }, [user, start, end, firestore]);

  const [expenses = [], loading] =
    useCollectionData<ExpenseItem>(expensesQuery ?? undefined);

  /* ======================
     CÁLCULOS
  ====================== */

  const totalBalance = useMemo(() => {
    return expenses.reduce(
      (acc, item) =>
        item.type === "REVENUE"
          ? acc + item.value
          : acc - item.value,
      0
    );
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return expenses
      .filter((e) => e.type === "REVENUE")
      .reduce((acc, e) => acc + e.value, 0);
  }, [expenses]);

  const totalExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.type === "EXPENSE")
      .reduce((acc, e) => acc + e.value, 0);
  }, [expenses]);

  const prevIncome = useMemo(() => {
    return previousExpenses
      .filter((e) => e.type === "REVENUE")
      .reduce((acc, e) => acc + e.value, 0);
  }, [previousExpenses]);

  const prevExpensesTotal = useMemo(() => {
    return previousExpenses
      .filter((e) => e.type === "EXPENSE")
      .reduce((acc, e) => acc + e.value, 0);
  }, [previousExpenses]);

  function getVariation(current: number, previous: number) {
    if (previous === 0) return null;

    const diff = current - previous;
    const percent = (diff / previous) * 100;

    return {
      percent: Math.abs(percent).toFixed(1),
      positive: diff >= 0,
    };
  }

  if (!user || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B1220] text-white">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-b from-[#0B1220] to-[#0E1627] text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-500 text-white">
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-xs text-white/60 uppercase">
              Good morning,
            </p>
            <p className="font-semibold text-lg text-white">
              {user.name}
            </p>
          </div>
        </div>

        <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white">
          🔔
        </div>
      </div>

      {/* MÊS */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1
              )
            )
          }
          className="text-white/60"
        >
          ◀
        </button>

        <div className="px-6 py-2 rounded-full bg-blue-500 font-medium text-white">
          {formatMonthYear(currentMonth)}
        </div>

        <button
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1
              )
            )
          }
          className="text-white/60"
        >
          ▶
        </button>
      </div>

      {/* SALDO */}
      <div className="px-5 mt-8">
        <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl text-white">
          <p className="text-sm text-white/70">
            Saldo do mês
          </p>

          <h2 className="text-4xl font-bold mt-2">
            R$ {totalBalance.toFixed(2)}
          </h2>

          {getVariation(
            totalBalance,
            prevIncome - prevExpensesTotal
          ) && (
              <span className="inline-block mt-4 px-3 py-1 text-xs rounded-full bg-white/20">
                {getVariation(
                  totalBalance,
                  prevIncome - prevExpensesTotal
                )!.positive
                  ? "+"
                  : "-"}
                {
                  getVariation(
                    totalBalance,
                    prevIncome - prevExpensesTotal
                  )!.percent
                }
                %
              </span>
            )}
        </div>
      </div>

      {/* INCOME / EXPENSES */}
      <div className="grid grid-cols-2 gap-4 px-5 mt-6">
        <div className="rounded-2xl p-4 bg-white/5 backdrop-blur border border-white/10 text-white">
          <p className="text-xs text-white/60">Entradas</p>
          <p className="text-2xl font-semibold text-green-400 mt-1">
            R$ {totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-white/5 backdrop-blur border border-white/10 text-white">
          <p className="text-xs text-white/60">Saidas</p>
          <p className="text-2xl font-semibold text-red-400 mt-1">
            R$ {totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>

      {/* LISTA */}
      <div className="px-5 mt-8 space-y-3">
        <p className="text-xs text-white/60">Transações</p>
        {expenses.map((item) => (
          <Card
            key={item.uid}
            className="bg-white/5 border border-white/10 rounded-2xl text-white"
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-white">
                  {item.name}
                </p>
                <p className="text-xs text-white/60">
                  {item.category}
                </p>
              </div>

              <p
                className={`font-semibold ${item.type === "REVENUE"
                  ? "text-green-400"
                  : "text-red-400"
                  }`}
              >
                {item.type === "REVENUE" ? "+" : "-"} R${" "}
                {item.value.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 h-14 w-14 rounded-full bg-blue-500 text-white text-3xl shadow-2xl flex items-center justify-center"
      >
        +
      </button>

      <NewTransactionModal
        open={open}
        onOpenChange={setOpen}
        userId={user.id}
      />
    </div>
  );
}
