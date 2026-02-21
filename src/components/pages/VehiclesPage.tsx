import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Vehicles } from '@/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Search, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const LIMIT = 12;

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async (loadMore = false) => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Vehicles>('vehicles', [], { 
        limit: LIMIT, 
        skip: loadMore ? skip : 0 
      });
      
      if (loadMore) {
        setVehicles(prev => [...prev, ...result.items]);
      } else {
        setVehicles(result.items);
      }
      
      setHasNext(result.hasNext);
      setSkip(result.nextSkip || 0);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredVehicles = () => {
    return vehicles.filter(vehicle => {
      const searchMatch = !searchQuery || 
        vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const typeMatch = filterType === 'all' || vehicle.vehicleType === filterType;
      const statusMatch = filterStatus === 'all' || vehicle.status === filterStatus;
      const regionMatch = filterRegion === 'all' || vehicle.region === filterRegion;
      
      return searchMatch && typeMatch && statusMatch && regionMatch;
    });
  };

  const filteredVehicles = getFilteredVehicles();
  const vehicleTypes = Array.from(new Set(vehicles.map(v => v.vehicleType).filter(Boolean)));
  const vehicleStatuses = Array.from(new Set(vehicles.map(v => v.status).filter(Boolean)));
  const regions = Array.from(new Set(vehicles.map(v => v.region).filter(Boolean)));

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Available':
        return 'bg-status-available text-foreground';
      case 'On Trip':
        return 'bg-status-on-trip text-foreground';
      case 'In Shop':
        return 'bg-status-in-shop text-foreground';
      case 'Suspended':
        return 'bg-status-suspended text-foreground';
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
              <Truck className="w-12 h-12 text-primary" />
              <h1 className="font-heading text-6xl text-foreground">
                Vehicle Registry
              </h1>
            </div>
            <p className="font-paragraph text-xl text-secondary max-w-3xl mb-8">
              Comprehensive fleet asset management. Monitor vehicle status, capacity, and operational metrics.
            </p>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search vehicles..."
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
                  {vehicleTypes.map(type => (
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

              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="bg-background border-muted-accent">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region!}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </section>

        {/* Vehicle Grid */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="mb-6">
            <p className="font-paragraph text-base text-secondary">
              Showing {filteredVehicles.length} of {vehicles.length} vehicles
            </p>
          </div>

          <div className="min-h-[600px]">
            {isLoading ? null : filteredVehicles.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredVehicles.map((vehicle, index) => (
                    <motion.div
                      key={vehicle._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <Link to={`/vehicles/${vehicle._id}`}>
                        <Card className="hover:shadow-lg transition-all duration-300 border-muted-accent/30 h-full hover:border-primary overflow-hidden">
                          {vehicle.vehicleImage && (
                            <div className="w-full h-48 overflow-hidden bg-soft-gray-section">
                              <Image
                                src={vehicle.vehicleImage}
                                alt={vehicle.name || 'Vehicle'}
                                width={400}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-heading text-2xl text-foreground mb-1">
                                  {vehicle.name}
                                </h3>
                                <p className="font-paragraph text-sm text-secondary">
                                  {vehicle.model}
                                </p>
                              </div>
                              <Badge className={getStatusColor(vehicle.status)}>
                                {vehicle.status}
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between font-paragraph text-sm">
                                <span className="text-secondary">License Plate:</span>
                                <span className="text-foreground font-medium">{vehicle.licensePlate}</span>
                              </div>
                              <div className="flex justify-between font-paragraph text-sm">
                                <span className="text-secondary">Type:</span>
                                <span className="text-foreground">{vehicle.vehicleType}</span>
                              </div>
                              <div className="flex justify-between font-paragraph text-sm">
                                <span className="text-secondary">Capacity:</span>
                                <span className="text-foreground">{vehicle.maxLoadCapacity} kg</span>
                              </div>
                              <div className="flex justify-between font-paragraph text-sm">
                                <span className="text-secondary">Region:</span>
                                <span className="text-foreground">{vehicle.region}</span>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-muted-accent/30">
                              <p className="font-paragraph text-sm text-secondary">
                                Odometer: {vehicle.odometer?.toLocaleString()} km
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
                      onClick={() => loadVehicles(true)}
                      className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Load More Vehicles
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Truck className="w-16 h-16 text-muted-accent mx-auto mb-4" />
                <h3 className="font-heading text-2xl text-foreground mb-2">
                  No vehicles found
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
