import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoastBeansCalculator from "@/components/RoastBeansCalculator";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const RoastCalculator = () => {
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
          <h1 className="text-2xl font-bold tracking-tight">Roast Beans Calculator</h1>
          <p className="text-muted-foreground text-sm">
            Professional tool for analyzing roast profiles and parameters
          </p>
        </div>
      </div>
      
      <RoastBeansCalculator />
    </div>
  );
};

export default RoastCalculator;