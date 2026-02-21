import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Vehicles, MaintenanceLogs, Trips } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { ArrowLeft, Truck, Wrench, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicles | null>(null);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogs[]>([]);
  const [trips, setTrips] = useState<Trips[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVehicleData();
  }, [id]);

  const loadVehicleData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const [vehicleData, maintenanceData, tripsData] = await Promise.all([
        BaseCrudService.getById<Vehicles>('vehicles', id),
        BaseCrudService.getAll<MaintenanceLogs>('maintenancelogs'),
        BaseCrudService.getAll<Trips>('trips')
      ]);
      
      setVehicle(vehicleData);
      
      const vehicleMaintenance = maintenanceData.items.filter(
        log => log.vehicleLicensePlate === vehicleData?.licensePlate
      );
      setMaintenanceLogs(vehicleMaintenance);
      
      setTrips(tripsData.items);
    } catch (error) {
      console.error('Error loading vehicle data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="min-h-[600px] flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="text-center py-16">
            <Truck className="w-16 h-16 text-muted-accent mx-auto mb-4" />
            <h2 className="font-heading text-3xl text-foreground mb-2">
              Vehicle not found
            </h2>
            <p className="font-paragraph text-base text-secondary mb-6">
              The vehicle you're looking for doesn't exist
            </p>
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 font-paragraph text-base text-primary hover:text-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Vehicles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-2 font-paragraph text-base text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Vehicles
            </Link>

            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="font-heading text-6xl text-foreground mb-2">
                  {vehicle.name}
                </h1>
                <p className="font-paragraph text-xl text-secondary">
                  {vehicle.model} • {vehicle.licensePlate}
                </p>
              </div>
              <Badge className={getStatusColor(vehicle.status)}>
                {vehicle.status}
              </Badge>
            </div>
          </motion.div>
        </section>

        {/* Vehicle Details */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {vehicle.vehicleImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border-muted-accent/30 overflow-hidden">
                    <div className="w-full h-96 bg-soft-gray-section">
                      <Image
                        src={vehicle.vehicleImage}
                        alt={vehicle.name || 'Vehicle'}
                        width={800}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="border-muted-accent/30">
                  <CardHeader>
                    <CardTitle className="font-heading text-3xl text-foreground">
                      Vehicle Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">Vehicle Type</p>
                        <p className="font-paragraph text-base text-foreground font-medium">
                          {vehicle.vehicleType}
                        </p>
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">Region</p>
                        <p className="font-paragraph text-base text-foreground font-medium">
                          {vehicle.region}
                        </p>
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">Max Load Capacity</p>
                        <p className="font-paragraph text-base text-foreground font-medium">
                          {vehicle.maxLoadCapacity?.toLocaleString()} kg
                        </p>
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">Odometer</p>
                        <p className="font-paragraph text-base text-foreground font-medium">
                          {vehicle.odometer?.toLocaleString()} km
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Maintenance History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-muted-accent/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Wrench className="w-6 h-6 text-primary" />
                      <CardTitle className="font-heading text-3xl text-foreground">
                        Maintenance History
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {maintenanceLogs.length > 0 ? (
                      <div className="space-y-4">
                        {maintenanceLogs.slice(0, 5).map((log) => (
                          <Link
                            key={log._id}
                            to={`/maintenance/${log._id}`}
                            className="block p-4 bg-soft-gray-section rounded-lg hover:bg-muted-accent/20 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-paragraph text-base text-foreground font-medium">
                                {log.maintenanceType}
                              </p>
                              <p className="font-paragraph text-sm text-secondary">
                                {log.serviceDate && format(new Date(log.serviceDate), 'MMM dd, yyyy')}
                              </p>
                            </div>
                            <p className="font-paragraph text-sm text-secondary mb-2">
                              {log.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <p className="font-paragraph text-sm text-secondary">
                                Mechanic: {log.mechanicName}
                              </p>
                              <p className="font-paragraph text-sm text-foreground font-medium">
                                ${log.serviceCost?.toLocaleString()}
                              </p>
                            </div>
                          </Link>
                        ))}
                        {maintenanceLogs.length > 5 && (
                          <Link
                            to="/maintenance"
                            className="block text-center font-paragraph text-sm text-primary hover:text-secondary transition-colors pt-2"
                          >
                            View all maintenance records
                          </Link>
                        )}
                      </div>
                    ) : (
                      <p className="font-paragraph text-base text-secondary text-center py-8">
                        No maintenance records found
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-muted-accent/30">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-foreground">
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-paragraph text-sm text-secondary mb-1">Total Maintenance</p>
                      <p className="font-heading text-3xl text-foreground">
                        {maintenanceLogs.length}
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-secondary mb-1">Total Service Cost</p>
                      <p className="font-heading text-3xl text-foreground">
                        ${maintenanceLogs.reduce((sum, log) => sum + (log.serviceCost || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-secondary mb-1">Last Service</p>
                      <p className="font-paragraph text-base text-foreground">
                        {maintenanceLogs.length > 0 && maintenanceLogs[0].serviceDate
                          ? format(new Date(maintenanceLogs[0].serviceDate), 'MMM dd, yyyy')
                          : 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="border-muted-accent/30">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-foreground">
                      Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link
                      to="/trips"
                      className="block w-full text-center py-3 px-4 bg-transparent text-primary border border-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      View Trips
                    </Link>
                    <Link
                      to="/maintenance"
                      className="block w-full text-center py-3 px-4 bg-transparent text-secondary border border-muted-accent rounded-lg hover:bg-muted-accent/20 transition-all duration-300"
                    >
                      View Maintenance
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
