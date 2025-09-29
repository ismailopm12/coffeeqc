import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Coffee, Calculator, Award } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const CoffeeQualityCalculator = () => {
  const [formData, setFormData] = useState({
    origin: '',
    variety: '',
    process: '',
    altitude: 0,
    moisture: 0,
    density: 0,
    screenSize: '',
    defectsPrimary: 0,
    defectsSecondary: 0,
    fragrance: 5,
    flavor: 5,
    aftertaste: 5,
    acidity: 5,
    body: 5,
    balance: 5,
    uniformity: 5,
    cleanCup: 5,
    sweetness: 5,
    overall: 5,
    notes: ''
  });

  const [result, setResult] = useState<{
    score: number;
    grade: string;
    quality: string;
    recommendations: string[];
  } | null>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }));
  };

  const calculateQuality = () => {
    // Calculate cupping score (SCA protocol)
    const cuppingScore = 
      formData.fragrance + 
      formData.flavor + 
      formData.aftertaste + 
      formData.acidity + 
      formData.body + 
      formData.balance + 
      formData.uniformity + 
      formData.cleanCup + 
      formData.sweetness + 
      formData.overall - 
      (formData.defectsPrimary * 2) - 
      (formData.defectsSecondary * 1);
    
    // Calculate green bean score
    const greenScore = 100 - (formData.defectsPrimary + formData.defectsSecondary * 0.5);
    
    // Combined score (weighted)
    const finalScore = (cuppingScore * 0.7) + (greenScore * 0.3);
    
    // Determine grade
    let grade = '';
    let quality = '';
    const recommendations: string[] = [];
    
    if (finalScore >= 90) {
      grade = 'A';
      quality = 'Exceptional';
      recommendations.push('Premium pricing recommended');
      recommendations.push('Consider specialty markets');
    } else if (finalScore >= 80) {
      grade = 'B';
      quality = 'Excellent';
      recommendations.push('High-quality market positioning');
      recommendations.push('Good for specialty roasters');
    } else if (finalScore >= 70) {
      grade = 'C';
      quality = 'Good';
      recommendations.push('Standard commercial markets');
      recommendations.push('Consider blending options');
    } else if (finalScore >= 60) {
      grade = 'D';
      quality = 'Fair';
      recommendations.push('Commercial markets with pricing considerations');
      recommendations.push('Blending recommended to improve profile');
    } else {
      grade = 'E';
      quality = 'Below Standard';
      recommendations.push('Consider alternative uses (e.g., instant coffee)');
      recommendations.push('Significant quality improvement needed');
    }
    
    // Additional recommendations based on specific attributes
    if (formData.moisture > 12) {
      recommendations.push('Moisture content high - consider additional drying');
    }
    
    if (formData.defectsPrimary > 5) {
      recommendations.push('High primary defects - sorting recommended');
    }
    
    if (formData.acidity < 4) {
      recommendations.push('Low acidity - may benefit from different processing');
    }
    
    setResult({
      score: parseFloat(finalScore.toFixed(1)),
      grade,
      quality,
      recommendations
    });
  };

  const resetForm = () => {
    setFormData({
      origin: '',
      variety: '',
      process: '',
      altitude: 0,
      moisture: 0,
      density: 0,
      screenSize: '',
      defectsPrimary: 0,
      defectsSecondary: 0,
      fragrance: 5,
      flavor: 5,
      aftertaste: 5,
      acidity: 5,
      body: 5,
      balance: 5,
      uniformity: 5,
      cleanCup: 5,
      sweetness: 5,
      overall: 5,
      notes: ''
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Professional Coffee Quality Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Green Bean Assessment */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                Green Bean Assessment
              </h3>
              
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
                <Select value={formData.variety} onValueChange={(value) => handleInputChange('variety', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select variety" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="arabica">Arabica</SelectItem>
                    <SelectItem value="robusta">Robusta</SelectItem>
                    <SelectItem value="liberica">Liberica</SelectItem>
                    <SelectItem value="excelsa">Excelsa</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label>Altitude (MASL)</Label>
                <Input 
                  type="number" 
                  value={formData.altitude} 
                  onChange={(e) => handleInputChange('altitude', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Moisture Content (%)</Label>
                <Slider 
                  value={[formData.moisture]} 
                  onValueChange={(value) => handleSliderChange('moisture', value)}
                  max={20} 
                  step={0.1}
                />
                <div className="text-sm text-muted-foreground">{formData.moisture}%</div>
              </div>
              
              <div className="space-y-2">
                <Label>Density (g/L)</Label>
                <Input 
                  type="number" 
                  value={formData.density} 
                  onChange={(e) => handleInputChange('density', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Screen Size</Label>
                <Input 
                  value={formData.screenSize} 
                  onChange={(e) => handleInputChange('screenSize', e.target.value)}
                  placeholder="e.g., 16/64, 17/64"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Primary Defects</Label>
                <Slider 
                  value={[formData.defectsPrimary]} 
                  onValueChange={(value) => handleSliderChange('defectsPrimary', value)}
                  max={20} 
                />
                <div className="text-sm text-muted-foreground">{formData.defectsPrimary} defects</div>
              </div>
              
              <div className="space-y-2">
                <Label>Secondary Defects</Label>
                <Slider 
                  value={[formData.defectsSecondary]} 
                  onValueChange={(value) => handleSliderChange('defectsSecondary', value)}
                  max={20} 
                />
                <div className="text-sm text-muted-foreground">{formData.defectsSecondary} defects</div>
              </div>
            </div>
            
            {/* Cupping Evaluation */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Cupping Evaluation (0-10 scale)</h3>
              
              {[
                { key: 'fragrance', label: 'Fragrance/Aroma' },
                { key: 'flavor', label: 'Flavor' },
                { key: 'aftertaste', label: 'Aftertaste' },
                { key: 'acidity', label: 'Acidity' },
                { key: 'body', label: 'Body' },
                { key: 'balance', label: 'Balance' },
                { key: 'uniformity', label: 'Uniformity' },
                { key: 'cleanCup', label: 'Clean Cup' },
                { key: 'sweetness', label: 'Sweetness' },
                { key: 'overall', label: 'Overall' }
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <Label>{item.label}</Label>
                  <Slider 
                    value={[formData[item.key as keyof typeof formData] as number]} 
                    onValueChange={(value) => handleSliderChange(item.key, value)}
                    max={10} 
                    step={0.1}
                  />
                  <div className="text-sm text-muted-foreground">
                    {formData[item.key as keyof typeof formData]}
                  </div>
                </div>
              ))}
              
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea 
                  value={formData.notes} 
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional observations..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button onClick={calculateQuality}>Calculate Quality</Button>
            <Button variant="outline" onClick={resetForm}>Reset</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Quality Assessment Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{result.score}</div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
              
              <div className="text-center p-4 bg-secondary rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold">{result.grade}</div>
                <div className="text-sm text-muted-foreground">Grade</div>
              </div>
              
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-accent-foreground">{result.quality}</div>
                <div className="text-sm text-muted-foreground">Quality Level</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <Badge variant="secondary">Assessment completed for {formData.origin || 'Unknown'} coffee</Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoffeeQualityCalculator;