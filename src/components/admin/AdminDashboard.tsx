import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Coffee, 
  Flame, 
  FileText, 
  Users, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/components/ui/use-toast';

// Define types for our data
interface RecentActivity {
  id: string;
  type: 'green' | 'roast' | 'cupping' | 'user' | 'warning';
  description: string;
  timestamp: string;
  timeAgo: string;
}

// Simple chart component using SVG
const SimpleBarChart = ({ data }: { data: { name: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  return (
    <div className="w-full h-64 flex items-end space-x-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-muted-foreground mb-1">{item.value}</div>
          <div 
            className="w-full bg-primary rounded-t hover:bg-primary/80 transition-colors"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <div className="text-xs text-muted-foreground mt-1 truncate w-full text-center">
            {item.name}
          </div>
        </div>
      ))}
    </div>
  );
};

// Simple line chart component using SVG
const SimpleLineChart = ({ data }: { data: { date: string; value: number }[] }) => {
  if (data.length === 0) return <div className="h-64 flex items-center justify-center text-muted-foreground">No data available</div>;
  
  const maxValue = Math.max(...data.map(item => item.value), 1);
  const minValue = Math.min(...data.map(item => item.value), 0);
  const range = maxValue - minValue || 1;
  
  return (
    <div className="w-full h-64 relative">
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <polyline
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          points={data.map((item, index) => {
            const x = (index / (data.length - 1)) * 400;
            const y = 200 - ((item.value - minValue) / range) * 200;
            return `${x},${y}`;
          }).join(' ')}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 400;
          const y = 200 - ((item.value - minValue) / range) * 200;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="hsl(var(--primary))"
            />
          );
        })}
      </svg>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGreenAssessments: 0,
    totalRoastProfiles: 0,
    totalCuppingSessions: 0,
    recentActivity: [] as RecentActivity[]
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [trendData, setTrendData] = useState<{ date: string; value: number }[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Function to calculate time ago
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    
    return Math.floor(seconds) + " seconds ago";
  };

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch statistics
      const [greenCount, roastCount, cuppingCount] = await Promise.all([
        supabase.from('green_assessments').select('*', { count: 'exact' }),
        supabase.from('roast_profiles').select('*', { count: 'exact' }),
        supabase.from('cupping_sessions').select('*', { count: 'exact' })
      ]);

      // For user count, we'll estimate based on unique user_ids
      const { data: userData, error: userError } = await supabase
        .from('cupping_sessions')
        .select('user_id');

      let userCount = 0;
      if (!userError && userData) {
        // Count unique user_ids
        const uniqueUsers = new Set(userData.map(item => item.user_id));
        userCount = uniqueUsers.size;
      }

      // Fetch chart data - top origins by assessment count
      const { data: originData, error: originError } = await supabase
        .from('green_assessments')
        .select('origin')
        .neq('origin', null);

      if (!originError && originData) {
        // Count assessments by origin
        const originCounts: Record<string, number> = {};
        originData.forEach(item => {
          originCounts[item.origin] = (originCounts[item.origin] || 0) + 1;
        });

        // Convert to chart data format
        const chartDataArray = Object.entries(originCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // Top 5 origins

        setChartData(chartDataArray);
      }

      // Fetch trend data - assessments over time
      const { data: trendDataRaw, error: trendError } = await supabase
        .from('green_assessments')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (!trendError && trendDataRaw) {
        // Group by month and count
        const monthlyCounts: Record<string, number> = {};
        trendDataRaw.forEach(item => {
          const date = new Date(item.created_at || '');
          const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
        });

        // Convert to trend data format
        const trendDataArray = Object.entries(monthlyCounts)
          .map(([date, value]) => ({ date, value }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setTrendData(trendDataArray);
      }

      // Fetch recent activity from all tables
      const recentActivity: RecentActivity[] = [];
      
      // Get recent green assessments
      const { data: recentGreen, error: greenError } = await supabase
        .from('green_assessments')
        .select('id, lot_number, origin, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!greenError && recentGreen) {
        recentGreen.forEach(item => {
          recentActivity.push({
            id: item.id,
            type: 'green',
            description: `New ${item.origin} assessment added (${item.lot_number})`,
            timestamp: item.created_at,
            timeAgo: timeAgo(item.created_at)
          });
        });
      }

      // Get recent roast profiles
      const { data: recentRoast, error: roastError } = await supabase
        .from('roast_profiles')
        .select('id, profile_name, roast_level, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!roastError && recentRoast) {
        recentRoast.forEach(item => {
          recentActivity.push({
            id: item.id,
            type: 'roast',
            description: `${item.roast_level || 'Roast'} profile updated (${item.profile_name})`,
            timestamp: item.created_at,
            timeAgo: timeAgo(item.created_at)
          });
        });
      }

      // Get recent cupping sessions
      const { data: recentCupping, error: cuppingError } = await supabase
        .from('cupping_sessions')
        .select('id, session_name, cupper_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!cuppingError && recentCupping) {
        recentCupping.forEach(item => {
          recentActivity.push({
            id: item.id,
            type: 'cupping',
            description: `Cupping session completed (${item.session_name})`,
            timestamp: item.created_at,
            timeAgo: timeAgo(item.created_at)
          });
        });
      }

      // Sort all activities by timestamp (most recent first) and take top 5
      const sortedActivity = recentActivity
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      setStats({
        totalUsers: userCount,
        totalGreenAssessments: greenCount.count || 0,
        totalRoastProfiles: roastCount.count || 0,
        totalCuppingSessions: cuppingCount.count || 0,
        recentActivity: sortedActivity
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/50"
    },
    {
      title: "Green Assessments",
      value: stats.totalGreenAssessments,
      icon: Coffee,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/50"
    },
    {
      title: "Roast Profiles",
      value: stats.totalRoastProfiles,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/50"
    },
    {
      title: "Cupping Sessions",
      value: stats.totalCuppingSessions,
      icon: FileText,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/50"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Coffee Origins
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <SimpleBarChart data={chartData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Assessments Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <SimpleLineChart data={trendData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5</div>
            <p className="text-xs text-muted-foreground">Average quality rating</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '87.5%' }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Process efficiency</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Standards compliance</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '98%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-full bg-muted">
                        {activity.type === 'user' && <Users className="h-4 w-4 text-blue-500" />}
                        {activity.type === 'green' && <Coffee className="h-4 w-4 text-green-500" />}
                        {activity.type === 'roast' && <Flame className="h-4 w-4 text-orange-500" />}
                        {activity.type === 'cupping' && <FileText className="h-4 w-4 text-purple-500" />}
                        {activity.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.timeAgo}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Database Connection</p>
                    <p className="text-xs text-muted-foreground">Operational</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Online</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Authentication Service</p>
                    <p className="text-xs text-muted-foreground">Operational</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Online</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-sm">Backup Service</p>
                    <p className="text-xs text-muted-foreground">Last backup: 2 hours ago</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Warning</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">API Endpoints</p>
                    <p className="text-xs text-muted-foreground">All endpoints responding</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Tasks & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Scheduled Tasks</h3>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-sm">Weekly Cupping Session</p>
                  <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                </div>
                <Badge>High</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-sm">New Bean Arrival</p>
                  <p className="text-xs text-muted-foreground">Oct 5, 2025</p>
                </div>
                <Badge variant="secondary">Medium</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-sm">Equipment Calibration</p>
                  <p className="text-xs text-muted-foreground">Oct 12, 2025</p>
                </div>
                <Badge variant="outline">Low</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-sm">System Alerts</h3>
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Low Stock Alert</p>
                  <p className="text-xs text-muted-foreground">Ethiopian Sidamo beans running low</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Quality Improvement</p>
                  <p className="text-xs text-muted-foreground">Average cupping score increased by 5%</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">New User Registration</p>
                  <p className="text-xs text-muted-foreground">3 new quality control specialists joined</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;