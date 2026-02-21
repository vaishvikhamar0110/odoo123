import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Trips } from '@/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Package, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trips[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const LIMIT = 12;

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async (loadMore = false) => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Trips>('trips', [], { 
        limit: LIMIT, 
        skip: loadMore ? skip : 0 
      });
      
      if (loadMore) {
        setTrips(prev => [...prev, ...result.items]);
      } else {
        setTrips(result.items);
      }
      
      setHasNext(result.hasNext);
      setSkip(result.nextSkip || 0);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredTrips = () => {
    return trips.filter(trip => {
      const searchMatch = !searchQuery || 
        trip.tripNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.startLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.endLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.cargoDetails?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const statusMatch = filterStatus === 'all' || trip.tripStatus === filterStatus;
      
      return searchMatch && statusMatch;
    });
  };

  const filteredTrips = getFilteredTrips();
  const tripStatuses = Array.from(new Set(trips.map(t => t.tripStatus).filter(Boolean)));

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-status-suspended text-foreground';
      case 'Dispatched':
        return 'bg-status-on-trip text-foreground';
      case 'Completed':
        return 'bg-status-available text-foreground';
      case 'Cancelled':
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
              <Package className="w-12 h-12 text-primary" />
              <h1 className="font-heading text-6xl text-foreground">
                Trip Management
              </h1>
            </div>
            <p className="font-paragraph text-xl text-secondary max-w-3xl mb-8">
              Track and manage all logistics operations. Monitor trip status, cargo details, and delivery schedules.
            </p>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search trips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-muted-accent"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-background border-muted-accent">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {tripStatuses.map(status => (
                    <SelectItem key={status} value={status!}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </section>

        {/* Trip Grid */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="mb-6">
            <p className="font-paragraph text-base text-secondary">
              Showing {filteredTrips.length} of {trips.length} trips
            </p>
          </div>

          <div className="min-h-[600px]">
            {isLoading ? null : filteredTrips.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredTrips.map((trip, index) => (
                    <motion.div
                      key={trip._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <Link to={`/trips/${trip._id}`}>
                        <Card className="hover:shadow-lg transition-all duration-300 border-muted-accent/30 h-full hover:border-primary">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-heading text-2xl text-foreground mb-1">
                                  {trip.tripNumber}
                                </h3>
                                <p className="font-paragraph text-sm text-secondary">
                                  {trip.cargoDetails}
                                </p>
                              </div>
                              <Badge className={getStatusColor(trip.tripStatus)}>
                                {trip.tripStatus}
                              </Badge>
                            </div>

                            <div className="space-y-3 mb-4">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="font-paragraph text-sm text-secondary">From</p>
                                  <p className="font-paragraph text-sm text-foreground font-medium">
                                    {trip.startLocation}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="font-paragraph text-sm text-secondary">To</p>
                                  <p className="font-paragraph text-sm text-foreground font-medium">
                                    {trip.endLocation}
                                  </p>
                                </div>
                              </div>

                              {trip.scheduledStartTime && (
                                <div className="flex items-start gap-2">
                                  <Calendar className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="font-paragraph text-sm text-secondary">Scheduled Start</p>
                                    <p className="font-paragraph text-sm text-foreground font-medium">
                                      {format(new Date(trip.scheduledStartTime), 'MMM dd, yyyy HH:mm')}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="pt-4 border-t border-muted-accent/30">
                              <div className="flex justify-between items-center">
                                <p className="font-paragraph text-sm text-secondary">
                                  Cargo Weight
                                </p>
                                <p className="font-paragraph text-sm text-foreground font-medium">
                                  {trip.cargoWeight?.toLocaleString()} kg
                                </p>
                              </div>
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
                      onClick={() => loadTrips(true)}
                      className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Load More Trips
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-muted-accent mx-auto mb-4" />
                <h3 className="font-heading text-2xl text-foreground mb-2">
                  No trips found
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
