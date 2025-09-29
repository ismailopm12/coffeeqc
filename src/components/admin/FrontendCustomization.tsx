import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Palette, Type, Image, Save, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorSetting {
  name: string;
  value: string;
  description: string;
}

interface FontSetting {
  name: string;
  value: string;
  description: string;
}

interface CustomizationSettings {
  colors: ColorSetting[];
  fonts: FontSetting[];
  logoUrl: string;
  faviconUrl: string;
}

const CUSTOMIZATION_KEY = 'coffee_customization_settings';

export default function FrontendCustomization() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Color settings
  const [colors, setColors] = useState<ColorSetting[]>([
    { name: "Primary", value: "#3E2723", description: "Main brand color" },
    { name: "Secondary", value: "#D7CCC8", description: "Secondary color" },
    { name: "Accent", value: "#FFB74D", description: "Accent color" },
    { name: "Background", value: "#FFF8E1", description: "Background color" },
    { name: "Coffee Green", value: "#4CAF50", description: "Green coffee color" },
    { name: "Coffee Roast", value: "#5D4037", description: "Roasted coffee color" },
  ]);
  
  // Font settings
  const [fonts, setFonts] = useState<FontSetting[]>([
    { name: "Heading Font", value: "Inter, sans-serif", description: "Font for headings" },
    { name: "Body Font", value: "Inter, sans-serif", description: "Font for body text" },
    { name: "Monospace Font", value: "JetBrains Mono, monospace", description: "Font for code" },
  ]);
  
  // Logo settings
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");

  useEffect(() => {
    fetchCustomizationSettings();
  }, []);

  const fetchCustomizationSettings = async () => {
    setFetching(true);
    try {
      // Try to fetch existing customization settings from localStorage
      const storedSettings = localStorage.getItem(CUSTOMIZATION_KEY);
      
      if (storedSettings) {
        const settings: CustomizationSettings = JSON.parse(storedSettings);
        setColors(settings.colors || colors);
        setFonts(settings.fonts || fonts);
        setLogoUrl(settings.logoUrl || logoUrl);
        setFaviconUrl(settings.faviconUrl || faviconUrl);
      }
    } catch (error) {
      console.error('Error fetching customization settings:', error);
      toast({
        title: "Error",
        description: "Failed to load customization settings",
        variant: "destructive",
      });
    } finally {
      setFetching(false);
    }
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index].value = value;
    setColors(newColors);
  };

  const handleFontChange = (index: number, value: string) => {
    const newFonts = [...fonts];
    newFonts[index].value = value;
    setFonts(newFonts);
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Save to localStorage
      const settings: CustomizationSettings = {
        colors,
        fonts,
        logoUrl,
        faviconUrl
      };
      
      localStorage.setItem(CUSTOMIZATION_KEY, JSON.stringify(settings));

      toast({
        title: "Success",
        description: "Frontend customization saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save customization: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Frontend Customization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Frontend Customization
          </span>
          <Button variant="outline" onClick={fetchCustomizationSettings}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="fonts" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Fonts
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colors.map((color, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`color-${index}`}>
                    {color.name}
                    <span className="text-muted-foreground text-sm block">{color.description}</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`color-${index}`}
                      type="color"
                      value={color.value}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={color.value}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fonts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fonts.map((font, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`font-${index}`}>
                    {font.name}
                    <span className="text-muted-foreground text-sm block">{font.description}</span>
                  </Label>
                  <Input
                    id={`font-${index}`}
                    value={font.value}
                    onChange={(e) => handleFontChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label>Font Preview</Label>
              <div className="p-4 border rounded-lg space-y-2">
                <h3 className="text-2xl font-bold" style={{ fontFamily: fonts[0].value }}>
                  Heading Text Example
                </h3>
                <p className="text-base" style={{ fontFamily: fonts[1].value }}>
                  This is body text using the selected font. You can see how it looks here.
                </p>
                <code className="text-sm" style={{ fontFamily: fonts[2].value }}>
                  console.log("This is monospace text");
                </code>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
                {logoUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">Logo Preview:</p>
                    <img src={logoUrl} alt="Logo preview" className="h-16" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input
                  id="favicon"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                />
                {faviconUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-1">Favicon Preview:</p>
                    <img src={faviconUrl} alt="Favicon preview" className="h-8 w-8" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Upload New Images</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop images here, or click to select files
                </p>
                <Button variant="outline" className="mt-2">
                  Select Files
                </Button>
              </div>
            </div>
          </TabsContent>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Customization"}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}