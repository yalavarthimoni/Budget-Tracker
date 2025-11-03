import { Button } from "@/components/ui/button";
import { ArrowRight, PieChart, TrendingUp, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Smart Budget Tracker
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Take control of your finances with intelligent expense tracking, budget management, and insightful analytics
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/dashboard")}
            className="text-lg px-8 py-6 gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="p-6 rounded-xl border border-border bg-gradient-card shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Expenses</h3>
            <p className="text-sm text-muted-foreground">
              Record and categorize all your income and expenses effortlessly
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-gradient-card shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center mb-4">
              <PieChart className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Visual Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Beautiful charts and graphs to understand your spending patterns
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-gradient-card shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
            <p className="text-sm text-muted-foreground">
              See your transactions on a calendar for better planning
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-gradient-card shadow-md hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Budget Management</h3>
            <p className="text-sm text-muted-foreground">
              Set budgets and get alerts when you're approaching limits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
