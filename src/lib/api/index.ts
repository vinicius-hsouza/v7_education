import { appFirebase } from "@/contexts/auth";
import {
  collection,
  getFirestore,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

/**
 * Tipagem do payload recebido da Home
 */
type CreateTransactionPayload = {
  name: string;
  value: number;
  category: string;
  account: string;
};

/**
 * 🔴 Criar DESPESA
 */
export async function createExpense(
  user: any,
  payload: CreateTransactionPayload,
) {
  try {
    const db = getFirestore(appFirebase);
    const expensesCollection = collection(db, "expenses");

    const response = await addDoc(expensesCollection, {
      uid: uuidv4(),
      name: payload.name,
      value: payload.value,
      category: payload.category,
      account: payload.account,
      type: "EXPENSE",
      userId: user.id ?? user.uid,
      created_at: serverTimestamp(),
    });

    return response;
  } catch (error) {
    console.error("Erro ao criar despesa:", error);
    throw error;
  }
}

/**
 * 🟢 Criar RECEITA
 */
export async function createRevenue(
  user: any,
  payload: CreateTransactionPayload,
) {
  try {
    const db = getFirestore(appFirebase);
    const expensesCollection = collection(db, "expenses");

    const response = await addDoc(expensesCollection, {
      uid: uuidv4(),
      name: payload.name,
      value: payload.value,
      category: payload.category,
      account: payload.account,
      type: "REVENUE",
      userId: user.id ?? user.uid,
      created_at: serverTimestamp(),
    });

    return response;
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    throw error;
  }
}

/**
 * 📥 Carregar lançamentos
 * (genérico — depois a gente filtra por usuário)
 */
export async function loadExpenses() {
  try {
    const db = getFirestore(appFirebase);
    const expensesCollection = collection(db, "expenses");

    const queryExpenses = query(
      expensesCollection,
      orderBy("created_at", "desc"),
    );

    const snap = await getDocs(queryExpenses);

    const data: any[] = [];

    snap.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return data;
  } catch (error) {
    console.error("Erro ao carregar despesas:", error);
    throw error;
  }
}
