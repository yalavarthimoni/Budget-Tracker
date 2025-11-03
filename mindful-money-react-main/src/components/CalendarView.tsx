import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Transaction } from "@/lib/storage";

interface CalendarViewProps {
  transactions: Transaction[];
}

export const CalendarView = ({ transactions }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getTransactionsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return transactions.filter((t) => t.date === dateString);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <Card className="bg-card shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{monthName}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="p-2" />;
            }

            const date = new Date(year, month, day);
            const dayTransactions = getTransactionsForDate(date);
            const isToday =
              new Date().toDateString() === date.toDateString();

            const totalIncome = dayTransactions
              .filter((t) => t.type === "income")
              .reduce((sum, t) => sum + t.amount, 0);
            const totalExpense = dayTransactions
              .filter((t) => t.type === "expense")
              .reduce((sum, t) => sum + t.amount, 0);

            return (
              <div
                key={day}
                className={`min-h-[80px] p-2 rounded-lg border transition-all hover:shadow-md ${
                  isToday
                    ? "border-primary bg-accent"
                    : "border-border bg-card"
                }`}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday ? "text-primary" : "text-foreground"}`}>
                  {day}
                </div>
                {dayTransactions.length > 0 && (
                  <div className="space-y-1">
                    {totalIncome > 0 && (
                      <div className="text-xs text-success font-medium">
                        +₹{totalIncome}
                      </div>
                    )}
                    {totalExpense > 0 && (
                      <div className="text-xs text-destructive font-medium">
                        -₹{totalExpense}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {dayTransactions.length} {dayTransactions.length === 1 ? "transaction" : "transactions"}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
