import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/lib/transactions";
import { CATEGORIES, Category } from "@/lib/categories";


type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
};

export function NewTransactionModal({
  open,
  onOpenChange,
  userId,
}: Props) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<"EXPENSE" | "REVENUE">(
    "EXPENSE"
  );
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | "">("");


  async function handleSubmit() {
    if (!name || !value || !category) return;

    try {
      setLoading(true);

      await createTransaction({
        userId,
        name,
        value: Number(value),
        type,
        category,
      });

      // reset + close
      setName("");
      setValue("");
      setCategory("");
      setType("EXPENSE");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar transação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input
              placeholder="Ex: Aluguel"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Valor</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div>
            <Label>Tipo</Label>
            <Select
              value={type}
              onValueChange={(v) =>
                setType(v as "EXPENSE" | "REVENUE")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">
                  Despesa
                </SelectItem>
                <SelectItem value="REVENUE">
                  Receita
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Categoria</Label>
            <Select
              value={category}
              onValueChange={(v) =>
                setCategory(v as Category)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem
                    key={cat.value}
                    value={cat.value}
                  >
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
