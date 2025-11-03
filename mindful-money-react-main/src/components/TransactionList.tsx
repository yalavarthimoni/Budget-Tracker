import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Search, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { deleteTransaction, type Transaction } from "@/lib/storage";
import { toast } from "sonner";

interface TransactionListProps {
  transactions: Transaction[];
  onUpdate: () => void;
}

export const TransactionList = ({ transactions, onUpdate }: TransactionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast.success("Transaction deleted successfully");
    onUpdate();
  };

  return (
    <Card className="bg-card shadow-md">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No transactions found</p>
              <p className="text-sm mt-1">Add your first transaction to get started</p>
            </div>
          ) : (
            filteredTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-gradient-card hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "income" ? "bg-success-light" : "bg-destructive-light"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpCircle className="h-5 w-5 text-success" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{transaction.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()} • {transaction.paymentMode}
                      </p>
                      {transaction.notes && (
                        <p className="text-sm text-muted-foreground mt-1">{transaction.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === "income" ? "text-success" : "text-destructive"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(transaction.id)}
                    className="ml-2 text-destructive hover:bg-destructive-light"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
