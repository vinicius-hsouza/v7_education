import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appFirebase, AuthContext } from "@/contexts/auth";
import { addDoc, collection, getFirestore, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useContext, useState } from "react";
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { v4 } from "uuid";

export function Category() {
  const { user } = useContext(AuthContext)
  const [name, setName] = useState('')

  const expensesCollection = collection(getFirestore(appFirebase), 'categories');
  const categoryQuery = query(expensesCollection, orderBy('created_at'))
  const [categories] = useCollectionData(categoryQuery)

  async function handleSubmit() {
    try {
      const expensesCollection = collection(getFirestore(appFirebase), 'categories');
      const response = await addDoc(expensesCollection, {
        uid: v4(),
        user_id: user.id,
        name,
        user,
        created_at: serverTimestamp(),
      })
      setName('')
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1>Minhas Categorias</h1>
      <div className="flex gap-1">
        <Input placeholder="digite o nome da categoria" onChange={(event) => setName(event.target.value)} value={name} />
        <Button disabled={!name} onClick={handleSubmit}>Cadastrar</Button>
      </div>
      {categories?.map(category => (
        <p>{category.name}</p>
      ))}
    </div>
  )
}