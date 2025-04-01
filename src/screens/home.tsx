import { Button } from "@/components/ui/button";
import { appFirebase, AuthContext } from "@/contexts/auth"
import { addDoc, collection, getFirestore, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useContext, useMemo, useState } from "react"
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { v4 } from "uuid";


export function Home() {
  const { user, signOut } = useContext(AuthContext)
  const navigate = useNavigate()


  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [type, setType] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const expensesCollection = collection(getFirestore(appFirebase), 'expenses');
  const queryExpenses = query(expensesCollection, orderBy('created_at'))
  const [expenses] = useCollectionData(queryExpenses)

  const categoryCollection = collection(getFirestore(appFirebase), 'categories');
  const categoryQuery = query(categoryCollection, orderBy('created_at'))
  const [categories] = useCollectionData(categoryQuery)

  const total = useMemo(() => {
    return expenses?.reduce((previusValue, currentItem) => {
      if (currentItem.type === 'REVENUE') return Number(previusValue) + Number(currentItem.value)
      if (currentItem.type === 'EXPENSE') return previusValue - currentItem.value
      return previusValue
    }, 0)
  }, [expenses])

  const totalRevenue = useMemo(() => {
    return expenses?.reduce((previusValue, currentItem) => {
      if (currentItem.type === 'REVENUE') return Number(previusValue) + Number(currentItem.value)
      return previusValue
    }, 0)
  }, [expenses])

  const totalExpense = useMemo(() => {
    return expenses?.reduce((previusValue, currentItem) => {
      if (currentItem.type === 'EXPENSE') return previusValue + currentItem.value
      return previusValue
    }, 0)
  }, [expenses])


  async function handleSubmit() {
    try {
      const expensesCollection = collection(getFirestore(appFirebase), 'expenses');
      const response = await addDoc(expensesCollection, {
        uid: v4(),
        value,
        user,
        created_at: serverTimestamp(),
        name,
        categoryId,
        type,
      })
      setName('')
      setType('')
      setValue('')
      setCategoryId('')
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }

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
        <Button variant="destructive" onClick={() => { signOut(); navigate('/sign-in') }} type="button">Sair</Button>
      </div>
      <p>Total: {total}</p>
      <p>Entradas: {totalRevenue}</p>
      <p>Saidas: {totalExpense}</p>
      <p>Saldo: {Number(totalRevenue) - Number(totalExpense)}</p>

      <div className="flex gap-1">
        <Input placeholder="Nome" onChange={(event) => setName(event.target.value)} value={name} />
        <Input placeholder="Valor" onChange={(event) => setValue(event.target.value)} value={value} />
        <Select onValueChange={setCategoryId} value={categoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map(
              category => (
                <SelectItem key={category.uid} value={category.uid}>{category.name}</SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Select onValueChange={setType} value={type}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="REVENUE">Receita</SelectItem>
            <SelectItem value="EXPENSE">Saida</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit} type="button" disabled={!name || !type || !value || !categoryId}>Cadastrar</Button>
      </div>

      {/* <Button onClick={() => createExpense(user)} type="button">Criar despesa</Button>
      <Button onClick={() => createRevenue(user)} type="button">Criar receita</Button> */}

      {expenses?.map((expense) => (<p>{expense.name}: {expense.value}</p>))}
    </div>
  )
}