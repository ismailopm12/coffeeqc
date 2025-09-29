import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Coffee, Flame, FileText, TrendingUp, Calendar, Award, ArrowRight, BarChart3, Users, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import type { EmblaCarouselType } from 'embla-carousel';

interface RecentActivityItem {
  id: string;
  type: 'green' | 'roast' | 'cupping';
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
}

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [api, setApi] = useState<EmblaCarouselType | undefined>(undefined);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [stats, setStats] = useState({
    greenCount: 0,
    roastCount: 0,
    cuppingCount: 0,
    avgScore: 0
  });
  const autoplay = Autoplay({ delay: 4000, stopOnInteraction: false });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      // Load stats
      const [greenData, roastData, cuppingData] = await Promise.all([
        supabase.from('green_assessments').select('*', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('roast_profiles').select('*', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('cupping_sessions').select('*', { count: 'exact' }).eq('user_id', user.id)
      ]);

      const greenCount = greenData.count || 0;
      const roastCount = roastData.count || 0;
      const cuppingCount = cuppingData.count || 0;

      // Calculate average score from cupping evaluations
      let avgScore = 0;
      if (cuppingData.data && cuppingData.data.length > 0) {
        const sessionIds = cuppingData.data.map(session => session.id);
        const { data: evaluations } = await supabase
          .from('cupping_evaluations')
          .select('total_score')
          .in('cupping_session_id', sessionIds);
        
        if (evaluations && evaluations.length > 0) {
          const totalScore = evaluations.reduce((sum, evalItem) => sum + (evalItem.total_score || 0), 0);
          avgScore = Math.round(totalScore / evaluations.length);
        }
      }

      setStats({
        greenCount,
        roastCount,
        cuppingCount,
        avgScore
      });

      // Load recent activity
      const allRecords = [
        ...(greenData.data || []).map(item => ({
          id: item.id,
          type: 'green' as const,
          title: `${item.origin} - ${item.lot_number}`,
          description: 'Green bean analysis completed',
          timestamp: item.created_at,
          timeAgo: timeAgo(item.created_at)
        })),
        ...(roastData.data || []).map(item => ({
          id: item.id,
          type: 'roast' as const,
          title: item.profile_name,
          description: 'Roast profile updated',
          timestamp: item.created_at,
          timeAgo: timeAgo(item.created_at)
        })),
        ...(cuppingData.data || []).map(item => ({
          id: item.id,
          type: 'cupping' as const,
          title: item.session_name,
          description: 'Cupping session created',
          timestamp: item.created_at,
          timeAgo: timeAgo(item.created_at)
        }))
      ];

      // Sort by timestamp descending and take first 5
      const sortedActivity = allRecords
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      setRecentActivity(sortedActivity);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const heroSlides = [
    {
      title: "Coffee Quality Control",
      subtitle: "Track, analyze, and optimize your coffee quality from green bean to cup.",
      buttonText: "Schedule Cupping",
      buttonIcon: Calendar,
      buttonAction: () => navigate('/cupping'),
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
    <div className="space-y-6 pb-28 md:pb-6">
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
                <p className="text-2xl font-bold text-foreground">{stats.greenCount}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.roastCount}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.cuppingCount}</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.avgScore || '0'}</p>
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
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'green' ? 'bg-coffee-green' : 
                    activity.type === 'roast' ? 'bg-coffee-roast' : 
                    'bg-accent'
                  }`}></div>
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.timeAgo}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
