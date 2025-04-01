import { Button } from "@/components/ui/button";
import { appFirebase, AuthContext } from "@/contexts/auth"
import { createExpense, createRevenue } from "@/lib/api"
import { collection, getFirestore, orderBy, query } from "firebase/firestore";
import { useContext, useMemo } from "react"
import { useCollectionData} from 'react-firebase-hooks/firestore'
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function Home() {
  const { user, signOut } = useContext(AuthContext)
  const navigate = useNavigate()


  const expensesCollection = collection(getFirestore(appFirebase), 'expenses');
    const queryExpenses = query(expensesCollection, orderBy('created_at'))
    const [expenses] = useCollectionData(queryExpenses)

    const total = useMemo(() => { return expenses?.reduce((previusValue, currentItem) => {
      if(currentItem.type === 'REVENUE') return Number(previusValue) + Number(currentItem.value)
      if(currentItem.type === 'EXPENSE') return previusValue - currentItem.value
      return previusValue
    }, 0)}, [expenses])

  return (
<div className="flex flex-col gap-1">
  <div className="flex gap-1">
  <Avatar>
    {user?.avatarUrl && (
      <AvatarImage src={user.avatarUrl} />
    )}
  <AvatarFallback>U</AvatarFallback>
</Avatar>
    <p>Bem vindo: {user.name}</p>
    <Button variant="destructive" onClick={() =>{ signOut(); navigate('/sign-in') }} type="button">Sair</Button>
  </div>
    <p>Total: {total}</p>
    <Button onClick={() => createExpense(user)} type="button">Criar despesa</Button>
    <Button onClick={() => createRevenue(user)} type="button">Criar receita</Button>

{expenses?.map((expense)=> (<p>{expense.name}: {expense.value}</p>))}
</div>
  )
}