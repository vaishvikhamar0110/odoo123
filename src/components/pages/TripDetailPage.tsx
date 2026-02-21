import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Trips } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, MapPin, Calendar, Weight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trips | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTripData();
  }, [id]);

  const loadTripData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const tripData = await BaseCrudService.getById<Trips>('trips', id);
      setTrip(tripData);
    } catch (error) {
      console.error('Error loading trip data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-accent mx-auto mb-4" />
            <h2 className="font-heading text-3xl text-foreground mb-2">
              Trip not found
            </h2>
            <p className="font-paragraph text-base text-secondary mb-6">
              The trip you're looking for doesn't exist
            </p>
            <Link
              to="/trips"
              className="inline-flex items-center gap-2 font-paragraph text-base text-primary hover:text-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Trips
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
              to="/trips"
              className="inline-flex items-center gap-2 font-paragraph text-base text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Trips
            </Link>

            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="font-heading text-6xl text-foreground mb-2">
                  {trip.tripNumber}
                </h1>
                <p className="font-paragraph text-xl text-secondary">
                  {trip.cargoDetails}
                </p>
              </div>
              <Badge className={getStatusColor(trip.tripStatus)}>
                {trip.tripStatus}
              </Badge>
            </div>
          </motion.div>
        </section>

        {/* Trip Details */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-muted-accent/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-primary" />
                      <CardTitle className="font-heading text-3xl text-foreground">
                        Route Information
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="font-paragraph text-sm text-secondary mb-2">Start Location</p>
                      <p className="font-paragraph text-lg text-foreground font-medium">
                        {trip.startLocation}
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-secondary mb-2">End Location</p>
                      <p className="font-paragraph text-lg text-foreground font-medium">
                        {trip.endLocation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="border-muted-accent/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-primary" />
                      <CardTitle className="font-heading text-3xl text-foreground">
                        Schedule
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-2">Scheduled Start</p>
                        <p className="font-paragraph text-base text-foreground font-medium">
                          {trip.scheduledStartTime 
                            ? format(new Date(trip.scheduledStartTime), 'MMM dd, yyyy HH:mm')
                            : 'Not scheduled'}
                        </p>
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-2">Scheduled End</p>
                        <p className="font-paragraph text-base text-foreground font-medium">
                          {trip.scheduledEndTime 
                            ? format(new Date(trip.scheduledEndTime), 'MMM dd, yyyy HH:mm')
                            : 'Not scheduled'}
                        </p>
                      </div>
                      {trip.actualStartTime && (
                        <div>
                          <p className="font-paragraph text-sm text-secondary mb-2">Actual Start</p>
                          <p className="font-paragraph text-base text-foreground font-medium">
                            {format(new Date(trip.actualStartTime), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      )}
                      {trip.actualEndTime && (
                        <div>
                          <p className="font-paragraph text-sm text-secondary mb-2">Actual End</p>
                          <p className="font-paragraph text-base text-foreground font-medium">
                            {format(new Date(trip.actualEndTime), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-muted-accent/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Weight className="w-6 h-6 text-primary" />
                      <CardTitle className="font-heading text-3xl text-foreground">
                        Cargo Details
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-paragraph text-sm text-secondary mb-2">Description</p>
                      <p className="font-paragraph text-base text-foreground">
                        {trip.cargoDetails}
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-sm text-secondary mb-2">Weight</p>
                      <p className="font-paragraph text-lg text-foreground font-medium">
                        {trip.cargoWeight?.toLocaleString()} kg
                      </p>
                    </div>
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
                      Trip Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={`${getStatusColor(trip.tripStatus)} text-lg px-4 py-2`}>
                      {trip.tripStatus}
                    </Badge>
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
                      View All Trips
                    </Link>
                    <Link
                      to="/vehicles"
                      className="block w-full text-center py-3 px-4 bg-transparent text-secondary border border-muted-accent rounded-lg hover:bg-muted-accent/20 transition-all duration-300"
                    >
                      View Vehicles
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
