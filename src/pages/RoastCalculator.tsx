import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoastBeansCalculator from "@/components/RoastBeansCalculator";

const RoastCalculator = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roast Beans Calculator</h1>
        <p className="text-muted-foreground">
          Professional tool for analyzing roast profiles and parameters
        </p>
      </div>
      
      <RoastBeansCalculator />
    </div>
  );
};

export default RoastCalculator;