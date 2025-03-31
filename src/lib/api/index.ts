// import { appFirebase } from '@/contexts/auth';
// import { collection, getFirestore, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';



// export async function createExpense() {
//   try {
//     const expensesCollection = collection(getFirestore(appFirebase), 'expenses');
//     const response = await addDoc(expensesCollection, {
//       uid: user?.uid,
//       username: user?.displayName,
//       text: messageText,
//       photoURL: user?.photoURL,
//       created_at: serverTimestamp(),
//     })
//   } catch (error) {

//   }
// }