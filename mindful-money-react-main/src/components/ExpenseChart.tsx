import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { type Transaction } from "@/lib/storage";

interface ExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = ["#0ea5e9", "#22c55e", "#f97316", "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];

export const ExpenseChart = ({ transactions }: ExpenseChartProps) => {
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  // Monthly trend data
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }
    if (transaction.type === "income") {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expense += transaction.amount;
    }
    return acc;
  }, {} as Record<string, { month: string; income: number; expense: number }>);

  const lineData = Object.values(monthlyData).sort((a, b) => {
    return new Date(a.month).getTime() - new Date(b.month).getTime();
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-card shadow-md">
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <p>No expense data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md">
        <CardHeader>
          <CardTitle>Income vs Expenses Trend</CardTitle>
        </CardHeader>
        <CardContent>
          {lineData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              <p>No data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="hsl(var(--success))" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" strokeWidth={2} name="Expenses" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-card shadow-md">
        <CardHeader>
          <CardTitle>Category Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pieData.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <p>No categories to display</p>
              </div>
            ) : (
              pieData
                .sort((a, b) => b.value - a.value)
                .map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-gradient-card"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-destructive">₹{item.value.toLocaleString()}</span>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
