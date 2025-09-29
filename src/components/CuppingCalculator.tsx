import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FileText, Coffee, Users, Calendar } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const CuppingCalculator = () => {
  const [formData, setFormData] = useState({
    sessionName: '',
    cupperName: '',
    date: new Date().toISOString().split('T')[0],
    sampleName: '',
    origin: '',
    variety: '',
    process: '',
    roastLevel: '',
    roastDate: '',
    fragrance: 5,
    aroma: 5,
    flavor: 5,
    aftertaste: 5,
    acidity: 5,
    body: 5,
    balance: 5,
    uniformity: 5,
    cleanCup: 5,
    sweetness: 5,
    overall: 5,
    defects: 0,
    notes: ''
  });

  const [result, setResult] = useState<{
    totalScore: number;
    qualityGrade: string;
    flavorProfile: string;
    recommendations: string[];
  } | null>(null);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }));
  };

  const calculateCuppingScore = () => {
    // Calculate total score according to SCA cupping protocol
    const totalScore = 
      formData.fragrance + 
      formData.aroma + 
      formData.flavor + 
      formData.aftertaste + 
      formData.acidity + 
      formData.body + 
      formData.balance + 
      formData.uniformity + 
      formData.cleanCup + 
      formData.sweetness + 
      formData.overall - 
      (formData.defects * 2);
    
    // Determine quality grade
    let qualityGrade = '';
    let flavorProfile = '';
    const recommendations: string[] = [];
    
    if (totalScore >= 90) {
      qualityGrade = 'Outstanding';
      flavorProfile = 'Exceptional complexity and character';
      recommendations.push('Premium pricing recommended');
      recommendations.push('Consider specialty markets');
    } else if (totalScore >= 85) {
      qualityGrade = 'Excellent';
      flavorProfile = 'High quality with distinct characteristics';
      recommendations.push('High-quality market positioning');
      recommendations.push('Good for specialty roasters');
    } else if (totalScore >= 80) {
      qualityGrade = 'Good';
      flavorProfile = 'Above average with notable qualities';
      recommendations.push('Standard commercial markets');
      recommendations.push('May benefit from blending');
    } else if (totalScore >= 75) {
      qualityGrade = 'Fair';
      flavorProfile = 'Acceptable with some positive attributes';
      recommendations.push('Commercial markets with pricing considerations');
      recommendations.push('Blending recommended to improve profile');
    } else {
      qualityGrade = 'Below Standard';
      flavorProfile = 'Defective or below commercial standards';
      recommendations.push('Consider alternative uses (e.g., instant coffee)');
      recommendations.push('Significant quality improvement needed');
    }
    
    // Additional recommendations based on specific attributes
    if (formData.acidity < 4) {
      recommendations.push('Low acidity - may benefit from different processing');
    }
    
    if (formData.body < 4) {
      recommendations.push('Light body - consider roast profile adjustments');
    }
    
    if (formData.flavor < 5) {
      recommendations.push('Flavor development could be improved');
    }
    
    if (formData.defects > 3) {
      recommendations.push('High defect count - sorting recommended');
    }
    
    setResult({
      totalScore: parseFloat(totalScore.toFixed(1)),
      qualityGrade,
      flavorProfile,
      recommendations
    });
  };

  const resetForm = () => {
    setFormData({
      sessionName: '',
      cupperName: '',
      date: new Date().toISOString().split('T')[0],
      sampleName: '',
      origin: '',
      variety: '',
      process: '',
      roastLevel: '',
      roastDate: '',
      fragrance: 5,
      aroma: 5,
      flavor: 5,
      aftertaste: 5,
      acidity: 5,
      body: 5,
      balance: 5,
      uniformity: 5,
      cleanCup: 5,
      sweetness: 5,
      overall: 5,
      defects: 0,
      notes: ''
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Professional Cupping Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Session Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Session Information
              </h3>
              
              <div className="space-y-2">
                <Label>Session Name</Label>
                <Input 
                  value={formData.sessionName} 
                  onChange={(e) => handleInputChange('sessionName', e.target.value)}
                  placeholder="e.g., Weekly Quality Assessment"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Cupper Name</Label>
                <Input 
                  value={formData.cupperName} 
                  onChange={(e) => handleInputChange('cupperName', e.target.value)}
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Sample Name</Label>
                <Input 
                  value={formData.sampleName} 
                  onChange={(e) => handleInputChange('sampleName', e.target.value)}
                  placeholder="e.g., Ethiopia Yirgacheffe"
                />
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
            </div>
            
            {/* Sample Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                Sample Information
              </h3>
              
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
              
              <div className="space-y-2">
                <Label>Roast Date</Label>
                <Input 
                  type="date" 
                  value={formData.roastDate} 
                  onChange={(e) => handleInputChange('roastDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Defects</Label>
                <Slider 
                  value={[formData.defects]} 
                  onValueChange={(value) => handleSliderChange('defects', value)}
                  max={10} 
                />
                <div className="text-sm text-muted-foreground">{formData.defects} defects</div>
              </div>
              
              <h4 className="font-medium mt-4">Cupping Evaluation (0-10 scale)</h4>
              
              {[
                { key: 'fragrance', label: 'Fragrance' },
                { key: 'aroma', label: 'Aroma' },
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
            <Button onClick={calculateCuppingScore}>Calculate Cupping Score</Button>
            <Button variant="outline" onClick={resetForm}>Reset</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cupping Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold text-primary">{result.totalScore}</div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              
              <div className="text-center p-4 bg-secondary rounded-lg">
                <div className="text-2xl sm:text-3xl font-bold">{result.qualityGrade}</div>
                <div className="text-sm text-muted-foreground">Quality Grade</div>
              </div>
              
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-base sm:text-lg font-bold text-accent-foreground">{result.flavorProfile}</div>
                <div className="text-sm text-muted-foreground">Flavor Profile</div>
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
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Session Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Session:</div>
                  <div className="font-medium">{formData.sessionName || 'Unnamed session'}</div>
                  <div>Cupper:</div>
                  <div className="font-medium">{formData.cupperName || 'Unknown'}</div>
                  <div>Date:</div>
                  <div className="font-medium">{formData.date}</div>
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Sample Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Sample:</div>
                  <div className="font-medium">{formData.sampleName || 'Unnamed sample'}</div>
                  <div>Origin:</div>
                  <div className="font-medium">{formData.origin || 'Unknown'}</div>
                  <div>Roast:</div>
                  <div className="font-medium">{formData.roastLevel || 'Not specified'}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Badge variant="secondary">
                Cupping session completed for {formData.sampleName || 'Unknown'} sample
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CuppingCalculator;