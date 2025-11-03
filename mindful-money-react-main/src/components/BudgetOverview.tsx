import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { getBudgets, saveBudget, deleteBudget, getCategories, type Transaction, type Budget } from "@/lib/storage";
import { toast } from "sonner";

interface BudgetOverviewProps {
  transactions: Transaction[];
}

export const BudgetOverview = ({ transactions }: BudgetOverviewProps) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");

  const categories = getCategories().filter((c) => c.type === "expense");

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = () => {
    setBudgets(getBudgets());
  };

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    saveBudget({
      category,
      amount: parseFloat(amount),
      period,
    });

    toast.success("Budget added successfully!");
    setCategory("");
    setAmount("");
    setIsDialogOpen(false);
    loadBudgets();
  };

  const handleDeleteBudget = (id: string) => {
    deleteBudget(id);
    toast.success("Budget deleted");
    loadBudgets();
  };

  const getBudgetSpending = (budget: Budget) => {
    const now = new Date();
    const startDate = budget.period === "monthly"
      ? new Date(now.getFullYear(), now.getMonth(), 1)
      : new Date(now.getFullYear(), 0, 1);

    const spent = transactions
      .filter((t) => 
        t.type === "expense" &&
        t.category === budget.category &&
        new Date(t.date) >= startDate
      )
      .reduce((sum, t) => sum + t.amount, 0);

    return spent;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Budget Management</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Budget</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddBudget} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget-amount">Budget Amount (₹)</Label>
                    <Input
                      id="budget-amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Select value={period} onValueChange={(v: "monthly" | "yearly") => setPeriod(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Create Budget
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budgets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No budgets set</p>
                <p className="text-sm mt-1">Create your first budget to track spending</p>
              </div>
            ) : (
              budgets.map((budget) => {
                const spent = getBudgetSpending(budget);
                const percentage = (spent / budget.amount) * 100;
                const isOverBudget = spent > budget.amount;
                const isNearLimit = percentage >= 80 && !isOverBudget;

                return (
                  <div
                    key={budget.id}
                    className="p-4 rounded-lg border border-border bg-gradient-card"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{budget.category}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{budget.period} Budget</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="text-destructive hover:bg-destructive-light"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ₹{spent.toLocaleString()} of ₹{budget.amount.toLocaleString()}
                        </span>
                        <span className={isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(percentage, 100)} 
                        className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : isNearLimit ? "[&>div]:bg-yellow-500" : ""}`}
                      />
                      {isOverBudget && (
                        <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <span>Over budget by ₹{(spent - budget.amount).toLocaleString()}</span>
                        </div>
                      )}
                      {isNearLimit && !isOverBudget && (
                        <div className="flex items-center gap-2 text-sm text-yellow-600 mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <span>Approaching budget limit</span>
                        </div>
                      )}
                      {!isNearLimit && !isOverBudget && percentage > 0 && (
                        <div className="flex items-center gap-2 text-sm text-success mt-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>On track</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
