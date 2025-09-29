import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CoffeeQualityCalculator from "@/components/CoffeeQualityCalculator";

const CoffeeCalculator = () => {
  return (
    <div className="space-y-6 pb-28 md:pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coffee Quality Calculator</h1>
        <p className="text-muted-foreground">
          Professional tool for assessing coffee quality using SCA protocols
        </p>
      </div>
      
      <CoffeeQualityCalculator />
    </div>
  );
};

export default CoffeeCalculator;