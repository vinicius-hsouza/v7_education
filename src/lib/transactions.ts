import { appFirebase } from "@/contexts/auth";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

type CreateTransactionInput = {
  userId: string;
  name: string;
  value: number;
  type: "EXPENSE" | "REVENUE";
  category: string;
};

export async function createTransaction({
  userId,
  name,
  value,
  type,
  category,
}: CreateTransactionInput) {
  const firestore = getFirestore(appFirebase);

  await addDoc(collection(firestore, "expenses"), {
    uid: uuidv4(),
    userId,
    name,
    value,
    type,
    category,
    created_at: serverTimestamp(),
    created_at_ts: Timestamp.fromDate(new Date()), // para filtros imediatos
  });
}
