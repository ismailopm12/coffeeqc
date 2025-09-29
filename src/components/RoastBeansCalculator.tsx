import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Flame, Weight, Timer, Thermometer, Coffee } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const RoastBeansCalculator = () => {
  const [formData, setFormData] = useState({
    beanType: '',
    origin: '',
    variety: '',
    process: '',
    moistureContent: 0,
    batchSize: 0,
    preheatTemp: 180,
    chargeTemp: 190,
    firstCrackTime: 0,
    firstCrackTemp: 0,
    developmentTime: 0,
    dropTemp: 0,
    totalTime: 0,
    roastLevel: '',
    notes: ''
  });

  const [result, setResult] = useState<{
    roastProfile: string;
    developmentRatio: number;
    qualityIndicators: string[];
    recommendations: string[];
  } | null>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }));
  };

  const calculateRoastProfile = () => {
    // Calculate development ratio (Development Time / First Crack Time)
    const developmentRatio = formData.firstCrackTime > 0 
      ? parseFloat((formData.developmentTime / formData.firstCrackTime).toFixed(2)) 
      : 0;
    
    // Determine roast profile based on parameters
    let roastProfile = '';
    const qualityIndicators: string[] = [];
    const recommendations: string[] = [];
    
    // Roast level determination
    if (formData.dropTemp >= 230) {
      roastProfile = 'Dark Roast';
      qualityIndicators.push('Bold, smoky flavors');
      qualityIndicators.push('Low acidity');
      qualityIndicators.push('Heavy body');
    } else if (formData.dropTemp >= 210) {
      roastProfile = 'Medium-Dark Roast';
      qualityIndicators.push('Balanced flavors');
      qualityIndicators.push('Moderate acidity');
      qualityIndicators.push('Medium body');
    } else if (formData.dropTemp >= 190) {
      roastProfile = 'Medium Roast';
      qualityIndicators.push('Origin characteristics preserved');
      qualityIndicators.push('Bright acidity');
      qualityIndicators.push('Medium body');
    } else {
      roastProfile = 'Light Roast';
      qualityIndicators.push('Complex flavors');
      qualityIndicators.push('High acidity');
      qualityIndicators.push('Light body');
    }
    
    // Development ratio analysis
    if (developmentRatio >= 0.3 && developmentRatio <= 0.4) {
      qualityIndicators.push('Optimal development ratio');
    } else if (developmentRatio < 0.3) {
      recommendations.push('Increase development time for better flavor development');
    } else {
      recommendations.push('Reduce development time to prevent over-roasting');
    }
    
    // Temperature analysis
    if (formData.chargeTemp > 220) {
      recommendations.push('Charge temperature is high - risk of scorching');
    } else if (formData.chargeTemp < 170) {
      recommendations.push('Charge temperature is low - may extend roast time');
    }
    
    // First crack timing analysis
    if (formData.firstCrackTime < 120) {
      recommendations.push('First crack occurred early - monitor heat application');
    } else if (formData.firstCrackTime > 240) {
      recommendations.push('First crack occurred late - consider heat application adjustments');
    }
    
    // Batch size efficiency
    if (formData.batchSize > 500) {
      qualityIndicators.push('Large batch - efficient roasting');
    } else if (formData.batchSize < 100) {
      recommendations.push('Small batch - consider efficiency improvements');
    }
    
    setResult({
      roastProfile,
      developmentRatio,
      qualityIndicators,
      recommendations
    });
  };

  const resetForm = () => {
    setFormData({
      beanType: '',
      origin: '',
      variety: '',
      process: '',
      moistureContent: 0,
      batchSize: 0,
      preheatTemp: 180,
      chargeTemp: 190,
      firstCrackTime: 0,
      firstCrackTemp: 0,
      developmentTime: 0,
      dropTemp: 0,
      totalTime: 0,
      roastLevel: '',
      notes: ''
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Professional Roast Beans Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bean Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                Bean Information
              </h3>
              
              <div className="space-y-2">
                <Label>Bean Type</Label>
                <Select value={formData.beanType} onValueChange={(value) => handleInputChange('beanType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bean type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arabica">Arabica</SelectItem>
                    <SelectItem value="robusta">Robusta</SelectItem>
                    <SelectItem value="blend">Blend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Origin</Label>
                <Input 
                  value={formData.origin} 
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  placeholder="e.g., Ethiopia, Colombia"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Variety</Label>
                <Input 
                  value={formData.variety} 
                  onChange={(e) => handleInputChange('variety', e.target.value)}
                  placeholder="e.g., Bourbon, Typica"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Processing Method</Label>
                <Select value={formData.process} onValueChange={(value) => handleInputChange('process', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select process" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="washed">Washed</SelectItem>
                    <SelectItem value="natural">Natural</SelectItem>
                    <SelectItem value="honey">Honey</SelectItem>
                    <SelectItem value="semi-washed">Semi-Washed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Moisture Content (%)</Label>
                <Slider 
                  value={[formData.moistureContent]} 
                  onValueChange={(value) => handleSliderChange('moistureContent', value)}
                  max={20} 
                  step={0.1}
                />
                <div className="text-sm text-muted-foreground">{formData.moistureContent}%</div>
              </div>
              
              <div className="space-y-2">
                <Label>Batch Size (grams)</Label>
                <Input 
                  type="number" 
                  value={formData.batchSize} 
                  onChange={(e) => handleInputChange('batchSize', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            {/* Roasting Parameters */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Roasting Parameters
              </h3>
              
              <div className="space-y-2">
                <Label>Preheat Temperature (°C)</Label>
                <Slider 
                  value={[formData.preheatTemp]} 
                  onValueChange={(value) => handleSliderChange('preheatTemp', value)}
                  min={150}
                  max={250} 
                />
                <div className="text-sm text-muted-foreground">{formData.preheatTemp}°C</div>
              </div>
              
              <div className="space-y-2">
                <Label>Charge Temperature (°C)</Label>
                <Slider 
                  value={[formData.chargeTemp]} 
                  onValueChange={(value) => handleSliderChange('chargeTemp', value)}
                  min={150}
                  max={250} 
                />
                <div className="text-sm text-muted-foreground">{formData.chargeTemp}°C</div>
              </div>
              
              <div className="space-y-2">
                <Label>First Crack Time (seconds)</Label>
                <Input 
                  type="number" 
                  value={formData.firstCrackTime} 
                  onChange={(e) => handleInputChange('firstCrackTime', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>First Crack Temperature (°C)</Label>
                <Input 
                  type="number" 
                  value={formData.firstCrackTemp} 
                  onChange={(e) => handleInputChange('firstCrackTemp', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Development Time (seconds)</Label>
                <Input 
                  type="number" 
                  value={formData.developmentTime} 
                  onChange={(e) => handleInputChange('developmentTime', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Drop Temperature (°C)</Label>
                <Slider 
                  value={[formData.dropTemp]} 
                  onValueChange={(value) => handleSliderChange('dropTemp', value)}
                  min={150}
                  max={250} 
                />
                <div className="text-sm text-muted-foreground">{formData.dropTemp}°C</div>
              </div>
              
              <div className="space-y-2">
                <Label>Total Roast Time (seconds)</Label>
                <Input 
                  type="number" 
                  value={formData.totalTime} 
                  onChange={(e) => handleInputChange('totalTime', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Roast Level</Label>
                <Select value={formData.roastLevel} onValueChange={(value) => handleInputChange('roastLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select roast level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium-light">Medium-Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="medium-dark">Medium-Dark</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label>Notes</Label>
            <Textarea 
              value={formData.notes} 
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional observations..."
              rows={3}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button onClick={calculateRoastProfile}>Calculate Roast Profile</Button>
            <Button variant="outline" onClick={resetForm}>Reset</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Roast Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-medium mb-2">Roast Profile</h4>
                  <div className="text-xl sm:text-2xl font-bold text-primary">{result.roastProfile}</div>
                </div>
                
                <div className="p-4 bg-secondary rounded-lg">
                  <h4 className="font-medium mb-2">Development Ratio</h4>
                  <div className="text-xl sm:text-2xl font-bold">{result.developmentRatio}</div>
                  <div className="text-sm text-muted-foreground">
                    (Development Time / First Crack Time)
                  </div>
                </div>
                
                <div className="p-4 bg-accent rounded-lg">
                  <h4 className="font-medium mb-2">Quality Indicators</h4>
                  <ul className="space-y-1">
                    {result.qualityIndicators.map((indicator, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 w-2 h-2 bg-accent-foreground rounded-full flex-shrink-0"></span>
                        <span>{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 w-2 h-2 bg-warning rounded-full flex-shrink-0"></span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Batch Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Bean Type:</div>
                    <div className="font-medium">{formData.beanType || 'Not specified'}</div>
                    <div>Origin:</div>
                    <div className="font-medium">{formData.origin || 'Not specified'}</div>
                    <div>Batch Size:</div>
                    <div className="font-medium">{formData.batchSize}g</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Badge variant="secondary">
                Roast analysis completed for {formData.origin || 'Unknown'} beans
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoastBeansCalculator;