export interface Transaction {
  id?: string;
  date: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  paymentMode: string;
  notes?: string;
}

export interface RecurringTransaction {
  id?: string;
  name: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  nextDate: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: "monthly" | "yearly";
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
}

const STORAGE_KEYS = {
  TRANSACTIONS: "budget_tracker_transactions",
  BUDGETS: "budget_tracker_budgets",
  CATEGORIES: "budget_tracker_categories",
  RECURRING: "budget_tracker_recurring",
};

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Salary", type: "income", icon: "💼" },
  { id: "2", name: "Business", type: "income", icon: "💰" },
  { id: "3", name: "Investment", type: "income", icon: "📈" },
  { id: "4", name: "Food", type: "expense", icon: "🍔" },
  { id: "5", name: "Transport", type: "expense", icon: "🚗" },
  { id: "6", name: "Shopping", type: "expense", icon: "🛍️" },
  { id: "7", name: "Bills", type: "expense", icon: "📄" },
  { id: "8", name: "Entertainment", type: "expense", icon: "🎬" },
  { id: "9", name: "Health", type: "expense", icon: "🏥" },
  { id: "10", name: "Education", type: "expense", icon: "📚" },
];

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveTransaction = (transaction: Omit<Transaction, "id">): Transaction => {
  const transactions = getTransactions();
  const newTransaction = {
    ...transaction,
    id: Date.now().toString(),
  };
  transactions.push(newTransaction);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  return newTransaction;
};

export const updateTransaction = (id: string, updates: Partial<Transaction>): void => {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }
};

export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
};

export const getBudgets = (): Budget[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
  return data ? JSON.parse(data) : [];
};

export const saveBudget = (budget: Omit<Budget, "id">): Budget => {
  const budgets = getBudgets();
  const newBudget = {
    ...budget,
    id: Date.now().toString(),
  };
  budgets.push(newBudget);
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  return newBudget;
};

export const updateBudget = (id: string, updates: Partial<Budget>): void => {
  const budgets = getBudgets();
  const index = budgets.findIndex((b) => b.id === id);
  if (index !== -1) {
    budgets[index] = { ...budgets[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }
};

export const deleteBudget = (id: string): void => {
  const budgets = getBudgets();
  const filtered = budgets.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(filtered));
};

export const getCategories = (): Category[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  return JSON.parse(data);
};

export const saveCategory = (category: Omit<Category, "id">): Category => {
  const categories = getCategories();
  const newCategory = {
    ...category,
    id: Date.now().toString(),
  };
  categories.push(newCategory);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  return newCategory;
};

export const deleteCategory = (id: string): void => {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
};

// Recurring Transactions
export const getRecurringTransactions = (): RecurringTransaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RECURRING);
  return data ? JSON.parse(data) : [];
};

export const saveRecurringTransaction = (transaction: Omit<RecurringTransaction, "id">): RecurringTransaction => {
  const transactions = getRecurringTransactions();
  const newTransaction = {
    ...transaction,
    id: Date.now().toString(),
  };
  transactions.push(newTransaction);
  localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(transactions));
  return newTransaction;
};

export const deleteRecurringTransaction = (id: string): void => {
  const transactions = getRecurringTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(filtered));
};

