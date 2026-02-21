import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { MaintenanceLogs } from '@/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Wrench, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MaintenancePage() {
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const LIMIT = 12;

  useEffect(() => {
    loadMaintenanceLogs();
  }, []);

  const loadMaintenanceLogs = async (loadMore = false) => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<MaintenanceLogs>('maintenancelogs', [], { 
        limit: LIMIT, 
        skip: loadMore ? skip : 0 
      });
      
      if (loadMore) {
        setMaintenanceLogs(prev => [...prev, ...result.items]);
      } else {
        setMaintenanceLogs(result.items);
      }
      
      setHasNext(result.hasNext);
      setSkip(result.nextSkip || 0);
    } catch (error) {
      console.error('Error loading maintenance logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredLogs = () => {
    return maintenanceLogs.filter(log => {
      const searchMatch = !searchQuery || 
        log.vehicleLicensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.maintenanceType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.mechanicName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const typeMatch = filterType === 'all' || log.maintenanceType === filterType;
      const statusMatch = filterStatus === 'all' || log.vehicleStatusAfterService === filterStatus;
      
      return searchMatch && typeMatch && statusMatch;
    });
  };

  const filteredLogs = getFilteredLogs();
  const maintenanceTypes = Array.from(new Set(maintenanceLogs.map(l => l.maintenanceType).filter(Boolean)));
  const vehicleStatuses = Array.from(new Set(maintenanceLogs.map(l => l.vehicleStatusAfterService).filter(Boolean)));

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Available':
        return 'bg-status-available text-foreground';
      case 'In Shop':
        return 'bg-status-in-shop text-foreground';
      case 'Needs Attention':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted-accent text-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16 bg-soft-gray-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Wrench className="w-12 h-12 text-primary" />
              <h1 className="font-heading text-6xl text-foreground">
                Maintenance Logs
              </h1>
            </div>
            <p className="font-paragraph text-xl text-secondary max-w-3xl mb-8">
              Track all vehicle maintenance and service records. Monitor costs, service dates, and vehicle status.
            </p>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search maintenance logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-muted-accent"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-background border-muted-accent">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {maintenanceTypes.map(type => (
                    <SelectItem key={type} value={type!}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-background border-muted-accent">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {vehicleStatuses.map(status => (
                    <SelectItem key={status} value={status!}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </section>

        {/* Maintenance Grid */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="mb-6">
            <p className="font-paragraph text-base text-secondary">
              Showing {filteredLogs.length} of {maintenanceLogs.length} maintenance records
            </p>
          </div>

          <div className="min-h-[600px]">
            {isLoading ? null : filteredLogs.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredLogs.map((log, index) => (
                    <motion.div
                      key={log._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <Link to={`/maintenance/${log._id}`}>
                        <Card className="hover:shadow-lg transition-all duration-300 border-muted-accent/30 h-full hover:border-primary">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-heading text-2xl text-foreground mb-1">
                                  {log.maintenanceType}
                                </h3>
                                <p className="font-paragraph text-sm text-secondary">
                                  {log.vehicleLicensePlate}
                                </p>
                              </div>
                              <Badge className={getStatusColor(log.vehicleStatusAfterService)}>
                                {log.vehicleStatusAfterService}
                              </Badge>
                            </div>

                            <p className="font-paragraph text-sm text-foreground mb-4 line-clamp-2">
                              {log.description}
                            </p>

                            <div className="space-y-3 mb-4">
                              {log.serviceDate && (
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="font-paragraph text-sm text-secondary">Service Date</p>
                                    <p className="font-paragraph text-sm text-foreground font-medium">
                                      {format(new Date(log.serviceDate), 'MMM dd, yyyy')}
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-primary flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="font-paragraph text-sm text-secondary">Service Cost</p>
                                  <p className="font-paragraph text-sm text-foreground font-medium">
                                    ${log.serviceCost?.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-muted-accent/30">
                              <p className="font-paragraph text-sm text-secondary">
                                Mechanic: <span className="text-foreground font-medium">{log.mechanicName}</span>
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                {hasNext && (
                  <div className="mt-12 text-center">
                    <Button
                      onClick={() => loadMaintenanceLogs(true)}
                      className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Load More Records
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Wrench className="w-16 h-16 text-muted-accent mx-auto mb-4" />
                <h3 className="font-heading text-2xl text-foreground mb-2">
                  No maintenance records found
                </h3>
                <p className="font-paragraph text-base text-secondary">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
