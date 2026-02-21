import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Drivers } from '@/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Search, Users, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Drivers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLicenseStatus, setFilterLicenseStatus] = useState<string>('all');
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const LIMIT = 12;

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async (loadMore = false) => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Drivers>('drivers', [], { 
        limit: LIMIT, 
        skip: loadMore ? skip : 0 
      });
      
      if (loadMore) {
        setDrivers(prev => [...prev, ...result.items]);
      } else {
        setDrivers(result.items);
      }
      
      setHasNext(result.hasNext);
      setSkip(result.nextSkip || 0);
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredDrivers = () => {
    return drivers.filter(driver => {
      const searchMatch = !searchQuery || 
        driver.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const statusMatch = filterStatus === 'all' || driver.dutyStatus === filterStatus;
      const licenseMatch = filterLicenseStatus === 'all' || driver.licenseStatus === filterLicenseStatus;
      
      return searchMatch && statusMatch && licenseMatch;
    });
  };

  const filteredDrivers = getFilteredDrivers();
  const dutyStatuses = Array.from(new Set(drivers.map(d => d.dutyStatus).filter(Boolean)));
  const licenseStatuses = Array.from(new Set(drivers.map(d => d.licenseStatus).filter(Boolean)));

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'On Duty':
        return 'bg-status-available text-foreground';
      case 'Off Duty':
        return 'bg-status-suspended text-foreground';
      case 'Suspended':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted-accent text-foreground';
    }
  };

  const getLicenseStatusColor = (status?: string) => {
    switch (status) {
      case 'Valid':
        return 'bg-status-available text-foreground';
      case 'Expired':
        return 'bg-destructive text-destructive-foreground';
      case 'Expiring Soon':
        return 'bg-status-in-shop text-foreground';
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
              <Users className="w-12 h-12 text-primary" />
              <h1 className="font-heading text-6xl text-foreground">
                Driver Profiles
              </h1>
            </div>
            <p className="font-paragraph text-xl text-secondary max-w-3xl mb-8">
              Manage driver records, licenses, and performance metrics. Monitor safety scores and duty status.
            </p>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search drivers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-muted-accent"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-background border-muted-accent">
                  <SelectValue placeholder="All Duty Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Duty Statuses</SelectItem>
                  {dutyStatuses.map(status => (
                    <SelectItem key={status} value={status!}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterLicenseStatus} onValueChange={setFilterLicenseStatus}>
                <SelectTrigger className="bg-background border-muted-accent">
                  <SelectValue placeholder="All License Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All License Statuses</SelectItem>
                  {licenseStatuses.map(status => (
                    <SelectItem key={status} value={status!}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </section>

        {/* Driver Grid */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="mb-6">
            <p className="font-paragraph text-base text-secondary">
              Showing {filteredDrivers.length} of {drivers.length} drivers
            </p>
          </div>

          <div className="min-h-[600px]">
            {isLoading ? null : filteredDrivers.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredDrivers.map((driver, index) => (
                    <motion.div
                      key={driver._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <Link to={`/drivers/${driver._id}`}>
                        <Card className="hover:shadow-lg transition-all duration-300 border-muted-accent/30 h-full hover:border-primary">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4 mb-4">
                              {driver.driverPhoto ? (
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-soft-gray-section flex-shrink-0">
                                  <Image
                                    src={driver.driverPhoto}
                                    alt={`${driver.firstName} ${driver.lastName}`}
                                    width={64}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-soft-gray-section flex items-center justify-center flex-shrink-0">
                                  <Users className="w-8 h-8 text-muted-accent" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="font-heading text-2xl text-foreground mb-1">
                                  {driver.firstName} {driver.lastName}
                                </h3>
                                <Badge className={getStatusColor(driver.dutyStatus)}>
                                  {driver.dutyStatus}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-3 mb-4">
                              {driver.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
                                  <p className="font-paragraph text-sm text-foreground truncate">
                                    {driver.email}
                                  </p>
                                </div>
                              )}
                              {driver.phoneNumber && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-secondary flex-shrink-0" />
                                  <p className="font-paragraph text-sm text-foreground">
                                    {driver.phoneNumber}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="pt-4 border-t border-muted-accent/30 space-y-2">
                              <div className="flex justify-between items-center">
                                <p className="font-paragraph text-sm text-secondary">License Status</p>
                                <Badge className={getLicenseStatusColor(driver.licenseStatus)}>
                                  {driver.licenseStatus}
                                </Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="font-paragraph text-sm text-secondary">Safety Score</p>
                                <p className="font-paragraph text-sm text-foreground font-medium">
                                  {driver.safetyScore}/100
                                </p>
                              </div>
                              <div className="flex justify-between items-center">
                                <p className="font-paragraph text-sm text-secondary">Completion Rate</p>
                                <p className="font-paragraph text-sm text-foreground font-medium">
                                  {driver.tripCompletionRate}%
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
                      onClick={() => loadDrivers(true)}
                      className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Load More Drivers
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-muted-accent mx-auto mb-4" />
                <h3 className="font-heading text-2xl text-foreground mb-2">
                  No drivers found
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
