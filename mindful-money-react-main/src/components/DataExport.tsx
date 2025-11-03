import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Transaction } from "@/lib/storage";
import { Download, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DataExportProps {
  transactions: Transaction[];
}

export const DataExport = ({ transactions }: DataExportProps) => {
  const [exportType, setExportType] = useState<"all" | "income" | "expense">("all");
  const [dateRange, setDateRange] = useState<"all" | "month" | "year">("month");

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by type
    if (exportType !== "all") {
      filtered = filtered.filter((t) => t.type === exportType);
    }

    // Filter by date range
    const now = new Date();
    if (dateRange === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter((t) => new Date(t.date) >= startOfMonth);
    } else if (dateRange === "year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      filtered = filtered.filter((t) => new Date(t.date) >= startOfYear);
    }

    return filtered;
  };

  const exportToCSV = () => {
    const filtered = filterTransactions();
    
    if (filtered.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    // CSV headers
    const headers = ["Date", "Type", "Category", "Amount", "Payment Mode", "Notes"];
    const csvContent = [
      headers.join(","),
      ...filtered.map((t) =>
        [
          t.date,
          t.type,
          t.category,
          t.amount,
          t.paymentMode,
          `"${(t.notes || "").replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${dateRange}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filtered.length} transactions to CSV`);
  };

  const filtered = filterTransactions();
  const totalAmount = filtered.reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card className="shadow-lg border-border/50 bg-gradient-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Export Data</CardTitle>
            <CardDescription className="mt-1">Download your transaction data as CSV</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Type</label>
            <Select value={exportType} onValueChange={(v: any) => setExportType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expenses Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg bg-card/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Transactions to export:</span>
            <span className="font-semibold text-foreground">{filtered.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total amount:</span>
            <span className="font-semibold text-foreground">₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <Button onClick={exportToCSV} className="w-full gap-2" disabled={filtered.length === 0}>
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </CardContent>
    </Card>
  );
};
