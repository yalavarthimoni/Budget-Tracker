import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Transaction } from "@/lib/storage";
import { TrendingDown, TrendingUp, AlertCircle, Lightbulb, Target } from "lucide-react";

interface SpendingInsightsProps {
  transactions: Transaction[];
}

export const SpendingInsights = ({ transactions }: SpendingInsightsProps) => {
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  });

  const expenses = currentMonthTransactions.filter((t) => t.type === "expense");
  const income = currentMonthTransactions.filter((t) => t.type === "income");

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  // Category analysis
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);
  const topCategory = sortedCategories[0];
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const insights = [];

  // Savings rate insight
  if (savingsRate < 20) {
    insights.push({
      type: "warning",
      icon: AlertCircle,
      title: "Low Savings Rate",
      description: `You're saving only ${savingsRate.toFixed(1)}% of your income. Aim for at least 20% savings.`,
    });
  } else if (savingsRate >= 20 && savingsRate < 50) {
    insights.push({
      type: "success",
      icon: Target,
      title: "Good Savings Rate",
      description: `Great! You're saving ${savingsRate.toFixed(1)}% of your income. Keep it up!`,
    });
  } else {
    insights.push({
      type: "success",
      icon: TrendingUp,
      title: "Excellent Savings Rate",
      description: `Outstanding! You're saving ${savingsRate.toFixed(1)}% of your income.`,
    });
  }

  // Top spending category
  if (topCategory && totalExpenses > 0) {
    const percentage = ((topCategory[1] / totalExpenses) * 100).toFixed(1);
    insights.push({
      type: "info",
      icon: Lightbulb,
      title: "Top Spending Category",
      description: `${topCategory[0]} accounts for ${percentage}% (₹${topCategory[1].toLocaleString()}) of your expenses.`,
    });
  }

  // Spending vs income
  if (totalExpenses > totalIncome) {
    insights.push({
      type: "warning",
      icon: TrendingDown,
      title: "Spending Exceeds Income",
      description: `You're spending ₹${(totalExpenses - totalIncome).toLocaleString()} more than you earn this month.`,
    });
  }

  // Daily average
  const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
  const avgDailyExpense = totalExpenses / daysInMonth;
  insights.push({
    type: "info",
    icon: Lightbulb,
    title: "Daily Average",
    description: `Your average daily spending is ₹${avgDailyExpense.toFixed(0)}. Plan accordingly!`,
  });

  // Recommendations
  const recommendations = [];
  if (savingsRate < 20) {
    recommendations.push("Try the 50-30-20 rule: 50% needs, 30% wants, 20% savings");
  }
  if (topCategory && (topCategory[1] / totalExpenses) * 100 > 40) {
    recommendations.push(`Consider reducing spending on ${topCategory[0]} category`);
  }
  recommendations.push("Track daily expenses to identify spending patterns");
  recommendations.push("Set category-wise budgets to control expenses");

  const typeColor = {
    warning: "border-warning/30 bg-warning-light",
    success: "border-success/30 bg-success-light",
    info: "border-accent/30 bg-accent-light",
  };

  const badgeColor = {
    warning: "bg-warning text-warning-foreground",
    success: "bg-success text-success-foreground",
    info: "bg-accent text-accent-foreground",
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-border/50 bg-gradient-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Spending Insights</CardTitle>
              <CardDescription className="mt-1">AI-powered analysis of your financial habits</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <div key={idx} className={`p-4 border rounded-lg ${typeColor[insight.type as keyof typeof typeColor]}`}>
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{insight.title}</h4>
                      <Badge className={badgeColor[insight.type as keyof typeof badgeColor]} variant="secondary">
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="shadow-lg border-border/50 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="text-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
