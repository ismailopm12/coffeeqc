import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Coffee, Flame, FileText, TrendingUp, Calendar, Award, ArrowRight, BarChart3, Users } from "lucide-react";
import { useState } from "react";
import Autoplay from "embla-carousel-autoplay";

const Index = () => {
  const [api, setApi] = useState<any>();
  const autoplay = Autoplay({ delay: 4000, stopOnInteraction: false });

  const heroSlides = [
    {
      title: "Coffee Quality Control",
      subtitle: "Track, analyze, and optimize your coffee quality from green bean to cup.",
      buttonText: "Schedule Cupping",
      buttonIcon: Calendar,
      buttonAction: () => console.log("Schedule cupping clicked"),
      bgGradient: "from-coffee-cream via-secondary to-background"
    },
    {
      title: "Advanced Analytics",
      subtitle: "Get deep insights into your coffee quality metrics and trends.",
      buttonText: "View Analytics",
      buttonIcon: BarChart3,
      buttonAction: () => console.log("View analytics clicked"),
      bgGradient: "from-coffee-roast/10 via-primary/5 to-background"
    },
    {
      title: "Team Collaboration",
      subtitle: "Work together with your team to achieve perfect coffee quality.",
      buttonText: "Manage Team",
      buttonIcon: Users,
      buttonAction: () => console.log("Manage team clicked"),
      bgGradient: "from-accent/20 via-coffee-gold/10 to-background"
    }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Hero Slider Section */}
      <div className="relative">
        <Carousel
          setApi={setApi}
          className="w-full"
          plugins={[autoplay]}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index}>
                <div className={`bg-gradient-to-br ${slide.bgGradient} rounded-lg p-6 md:p-8 shadow-warm transition-all duration-500`}>
                  <div className="max-w-2xl">
                    <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
                      {slide.title}
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-lg mb-6 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <Button 
                      onClick={slide.buttonAction}
                      className="bg-gradient-to-r from-primary to-coffee-roast hover:shadow-coffee transition-all duration-300 hover:scale-105"
                    >
                      <slide.buttonIcon className="mr-2 h-4 w-4" />
                      {slide.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300" />
          <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300" />
        </Carousel>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-coffee-green/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Coffee className="h-5 w-5 text-coffee-green" />
              <div>
                <p className="text-sm font-medium text-coffee-green">Green Beans</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-coffee-roast/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-coffee-roast" />
              <div>
                <p className="text-sm font-medium text-coffee-roast">Roast Profiles</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-accent">Cupping Sessions</p>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-primary">Avg Score</p>
                <p className="text-2xl font-bold text-foreground">87.5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-coffee-green rounded-full"></div>
              <div>
                <p className="font-medium text-sm">Ethiopian Sidamo - New Batch</p>
                <p className="text-xs text-muted-foreground">Green bean analysis completed</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">2 hrs ago</Badge>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-coffee-roast rounded-full"></div>
              <div>
                <p className="font-medium text-sm">Medium Roast Profile #12</p>
                <p className="text-xs text-muted-foreground">Roast profile updated</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">4 hrs ago</Badge>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <div>
                <p className="font-medium text-sm">Weekly Cupping Session</p>
                <p className="text-xs text-muted-foreground">Scored 3 new samples</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">1 day ago</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
