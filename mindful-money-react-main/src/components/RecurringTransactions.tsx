import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getRecurringTransactions, saveRecurringTransaction, deleteRecurringTransaction, type RecurringTransaction } from "@/lib/storage";
import { Repeat, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface RecurringTransactionsProps {
  onTransactionCreated: () => void;
}

export const RecurringTransactions = ({ onTransactionCreated }: RecurringTransactionsProps) => {
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
    frequency: "monthly" as "daily" | "weekly" | "monthly" | "yearly",
  });

  useEffect(() => {
    loadRecurring();
  }, []);

  const loadRecurring = () => {
    setRecurring(getRecurringTransactions());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    saveRecurringTransaction({
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      frequency: formData.frequency,
      nextDate: new Date().toISOString().split("T")[0],
    });

    toast.success("Recurring transaction added!");
    setFormData({ name: "", amount: "", category: "", type: "expense", frequency: "monthly" });
    setShowForm(false);
    loadRecurring();
    onTransactionCreated();
  };

  const handleDelete = (id: string) => {
    deleteRecurringTransaction(id);
    toast.success("Recurring transaction deleted");
    loadRecurring();
  };

  const frequencyBadgeColor = {
    daily: "bg-accent",
    weekly: "bg-primary",
    monthly: "bg-success",
    yearly: "bg-warning",
  };

  return (
    <Card className="shadow-lg border-border/50 bg-gradient-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Recurring Transactions</CardTitle>
              <CardDescription className="mt-1">Automate your regular income and expenses</CardDescription>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {showForm ? "Cancel" : "Add"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Monthly Rent"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v: "income" | "expense") => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={formData.frequency} onValueChange={(v: any) => setFormData({ ...formData, frequency: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Rent, Salary"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full">Add Recurring Transaction</Button>
          </form>
        )}

        <div className="space-y-3">
          {recurring.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No recurring transactions yet. Add one to get started!</p>
          ) : (
            recurring.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:shadow-md transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                    <Badge className={frequencyBadgeColor[item.frequency]}>{item.frequency}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.category} • Next: {new Date(item.nextDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-bold ${item.type === "income" ? "text-success" : "text-destructive"}`}>
                    {item.type === "income" ? "+" : "-"}₹{item.amount.toLocaleString()}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id!)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
