import { appFirebase } from '@/contexts/auth';
import { collection, getFirestore, addDoc, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { v4 } from 'uuid';



export async function createExpense(user: any) {
  try {
    const expensesCollection = collection(getFirestore(appFirebase), 'expenses');
    const response = await addDoc(expensesCollection, {
      uid: v4(),
      value: 112.34,
      user,
      created_at: serverTimestamp(),
      name: 'Despesa teste',
      category: 'ALIMENTACAO',
      type: 'EXPENSE'
    })
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

export async function createRevenue(user: any) {
  try {
    const expensesCollection = collection(getFirestore(appFirebase), 'expenses');
    const response = await addDoc(expensesCollection, {
      uid: v4(),
      value: 3000,
      user,
      created_at: serverTimestamp(),
      name: 'Pagamento de trampo',
      category: 'FRELANCERS',
      type: 'REVENUE'
    })
    console.log(response)
  } catch (error) {
    console.error(error)
  }
}

export async function loadExpenses() {
  try {
    const expensesCollection = collection(getFirestore(appFirebase), 'expenses');
  const queryExpenses = query(expensesCollection, orderBy('created_at'))
  const snap = await getDocs(queryExpenses);
  const data: any[] = []
  // biome-ignore lint/complexity/noForEach: <explanation>
  snap.forEach((doc: any) => {
    const docData = doc.data();
    data.push( docData)
  });

  return data

  } catch (error) {
    console.error(error)
  }
}