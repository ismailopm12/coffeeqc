import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CuppingCalculator from "@/components/CuppingCalculator";

const CuppingCalculatorPage = () => {
  return (
    <div className="space-y-6 pb-28 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cupping Calculator</h1>
        <p className="text-muted-foreground">
          Professional tool for evaluating coffee quality using SCA cupping protocols
        </p>
      </div>
      
      <CuppingCalculator />
    </div>
  );
};

export default CuppingCalculatorPage;