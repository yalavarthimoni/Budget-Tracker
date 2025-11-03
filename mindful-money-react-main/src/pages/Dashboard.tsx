import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Wallet, PieChart, Calendar, Plus, Repeat, Download, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionList } from "@/components/TransactionList";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { BudgetOverview } from "@/components/BudgetOverview";
import { ExpenseChart } from "@/components/ExpenseChart";
import { CalendarView } from "@/components/CalendarView";
import { RecurringTransactions } from "@/components/RecurringTransactions";
import { DataExport } from "@/components/DataExport";
import { SpendingInsights } from "@/components/SpendingInsights";
import { getTransactions, type Transaction } from "@/lib/storage";

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const data = getTransactions();
    setTransactions(data);
  };

  const handleTransactionAdded = () => {
    loadTransactions();
    setIsAddDialogOpen(false);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Smart financial management at your fingertips</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 shadow-md hover:shadow-lg transition-all">
            <Plus className="h-5 w-5" />
            Add Transaction
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-gradient-card border-border/50 shadow-lg hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              <div className="p-2 rounded-full bg-success-light">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">₹{totalIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-lg hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <div className="p-2 rounded-full bg-destructive-light">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">₹{totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All time spending</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-primary border-0 shadow-lg hover:shadow-glow transition-all duration-300 text-primary-foreground">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Current Balance</CardTitle>
              <div className="p-2 rounded-full bg-white/20">
                <Wallet className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{balance.toLocaleString()}</div>
              <p className="text-xs opacity-80 mt-1">Available funds</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="bg-card border border-border shadow-sm">
            <TabsTrigger value="transactions" className="gap-2">
              <Wallet className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <PieChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="budget" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Budget
            </TabsTrigger>
            <TabsTrigger value="recurring" className="gap-2">
              <Repeat className="h-4 w-4" />
              Recurring
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="export" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <TransactionList transactions={transactions} onUpdate={loadTransactions} />
          </TabsContent>

          <TabsContent value="analytics">
            <ExpenseChart transactions={transactions} />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetOverview transactions={transactions} />
          </TabsContent>

          <TabsContent value="recurring">
            <RecurringTransactions onTransactionCreated={loadTransactions} />
          </TabsContent>

          <TabsContent value="insights">
            <SpendingInsights transactions={transactions} />
          </TabsContent>

          <TabsContent value="export">
            <DataExport transactions={transactions} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView transactions={transactions} />
          </TabsContent>
        </Tabs>

        <AddTransactionDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccess={handleTransactionAdded}
        />
      </div>
    </div>
  );
};

export default Dashboard;
