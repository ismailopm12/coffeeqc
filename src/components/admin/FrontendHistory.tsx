import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter,
  Download,
  RefreshCw,
  Calendar,
  User,
  Coffee,
  Flame,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

interface FrontendHistoryItem {
  id: string;
  user_id: string;
  action_type: string;
  table_name: string;
  record_id: string;
  record_data: Database['public']['Tables']['green_assessments']['Row'] | 
               Database['public']['Tables']['roast_profiles']['Row'] | 
               Database['public']['Tables']['cupping_sessions']['Row'] | null;
  created_at: string;
  user_email?: string;
}

const FrontendHistory = () => {
  const { toast } = useToast();
  const [historyItems, setHistoryItems] = useState<FrontendHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      // For now, we'll simulate frontend history by fetching all records
      // In a real implementation, you would have a dedicated history table
      const [greenData, roastData, cuppingData] = await Promise.all([
        supabase.from('green_assessments').select('*').order('created_at', { ascending: false }),
        supabase.from('roast_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('cupping_sessions').select('*').order('created_at', { ascending: false })
      ]);

      // Combine all data into a history format
      const allHistory: FrontendHistoryItem[] = [
        ...(greenData.data || []).map(item => ({
          id: item.id,
          user_id: item.user_id,
          action_type: 'created',
          table_name: 'green_assessments',
          record_id: item.id,
          record_data: item,
          created_at: item.created_at || new Date().toISOString()
        })),
        ...(roastData.data || []).map(item => ({
          id: item.id,
          user_id: item.user_id,
          action_type: 'created',
          table_name: 'roast_profiles',
          record_id: item.id,
          record_data: item,
          created_at: item.created_at || new Date().toISOString()
        })),
        ...(cuppingData.data || []).map(item => ({
          id: item.id,
          user_id: item.user_id,
          action_type: 'created',
          table_name: 'cupping_sessions',
          record_id: item.id,
          record_data: item,
          created_at: item.created_at || new Date().toISOString()
        }))
      ];

      // Sort by created_at descending
      allHistory.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setHistoryItems(allHistory);
    } catch (error) {
      console.error('Error fetching history data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch frontend history data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    // Create CSV content
    const headers = ['ID', 'User ID', 'Action Type', 'Table Name', 'Record ID', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...historyItems.map(item => [
        item.id,
        item.user_id,
        item.action_type,
        item.table_name,
        item.record_id,
        item.created_at
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `frontend_history_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadGoogleSheets = () => {
    // In a real implementation, you would integrate with Google Sheets API
    // For now, we'll just show a toast message
    toast({
      title: "Google Sheets Integration",
      description: "In a full implementation, this would export data to Google Sheets. For now, use the CSV download.",
    });
  };

  const filteredHistory = historyItems.filter(item => {
    const matchesSearch = searchTerm === "" || 
      item.record_data?.lot_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.record_data?.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.record_data?.profile_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.record_data?.session_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || item.table_name === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getActionIcon = (tableName: string) => {
    switch (tableName) {
      case 'green_assessments':
        return <Coffee className="h-4 w-4 text-coffee-green" />;
      case 'roast_profiles':
        return <Flame className="h-4 w-4 text-coffee-roast" />;
      case 'cupping_sessions':
        return <FileText className="h-4 w-4 text-accent" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getTableName = (tableName: string) => {
    switch (tableName) {
      case 'green_assessments':
        return 'Green Assessment';
      case 'roast_profiles':
        return 'Roast Profile';
      case 'cupping_sessions':
        return 'Cupping Session';
      default:
        return tableName;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span>Frontend Activity History</span>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search history..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={fetchHistoryData}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex gap-2">
            <Button 
              variant={filterType === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterType("all")}
            >
              All
            </Button>
            <Button 
              variant={filterType === "green_assessments" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterType("green_assessments")}
            >
              Green
            </Button>
            <Button 
              variant={filterType === "roast_profiles" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterType("roast_profiles")}
            >
              Roast
            </Button>
            <Button 
              variant={filterType === "cupping_sessions" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterType("cupping_sessions")}
            >
              Cupping
            </Button>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadGoogleSheets}>
              <Download className="h-4 w-4 mr-2" />
              Google Sheets
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Record Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(item.table_name)}
                        <span className="capitalize">{item.action_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {getTableName(item.table_name)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {item.table_name === 'green_assessments' && (
                          <div>
                            <div className="font-medium">{item.record_data?.lot_number}</div>
                            <div className="text-muted-foreground">{item.record_data?.origin}</div>
                          </div>
                        )}
                        {item.table_name === 'roast_profiles' && (
                          <div>
                            <div className="font-medium">{item.record_data?.profile_name}</div>
                            <div className="text-muted-foreground">
                              {item.record_data?.roast_level || 'N/A'}
                            </div>
                          </div>
                        )}
                        {item.table_name === 'cupping_sessions' && (
                          <div>
                            <div className="font-medium">{item.record_data?.session_name}</div>
                            <div className="text-muted-foreground">
                              {item.record_data?.cupper_name || 'N/A'}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {item.user_id?.substring(0, 8)}...
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {format(new Date(item.created_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FrontendHistory;