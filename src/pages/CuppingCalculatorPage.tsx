import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CuppingCalculator from "@/components/CuppingCalculator";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CuppingCalculatorPage = () => {
  return (
    <div className="space-y-6 pb-28 md:pb-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cupping Calculator</h1>
          <p className="text-muted-foreground text-sm">
            Professional tool for evaluating coffee quality using SCA cupping protocols
          </p>
        </div>
      </div>
      
      <CuppingCalculator />
    </div>
  );
};

export default CuppingCalculatorPage;