import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { MaintenanceLogs } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Wrench, Calendar, DollarSign, User, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MaintenanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<MaintenanceLogs | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMaintenanceData();
  }, [id]);

  const loadMaintenanceData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const logData = await BaseCrudService.getById<MaintenanceLogs>('maintenancelogs', id);
      setLog(logData);
    } catch (error) {
      console.error('Error loading maintenance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!log) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="text-center py-16">
            <Wrench className="w-16 h-16 text-muted-accent mx-auto mb-4" />
            <h2 className="font-heading text-3xl text-foreground mb-2">
              Maintenance record not found
            </h2>
            <p className="font-paragraph text-base text-secondary mb-6">
              The maintenance record you're looking for doesn't exist
            </p>
            <Link
              to="/maintenance"
              className="inline-flex items-center gap-2 font-paragraph text-base text-primary hover:text-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Maintenance
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
              to="/maintenance"
              className="inline-flex items-center gap-2 font-paragraph text-base text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Maintenance
            </Link>

            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="font-heading text-6xl text-foreground mb-2">
                  {log.maintenanceType}
                </h1>
                <p className="font-paragraph text-xl text-secondary">
                  Vehicle: {log.vehicleLicensePlate}
                </p>
              </div>
              <Badge className={getStatusColor(log.vehicleStatusAfterService)}>
                {log.vehicleStatusAfterService}
              </Badge>
            </div>
          </motion.div>
        </section>

        {/* Maintenance Details */}
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
                      <FileText className="w-6 h-6 text-primary" />
                      <CardTitle className="font-heading text-3xl text-foreground">
                        Service Description
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-paragraph text-base text-foreground leading-relaxed">
                      {log.description}
                    </p>
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
                        Service Information
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-2">Service Date</p>
                        <p className="font-paragraph text-base text-foreground font-medium">
                          {log.serviceDate 
                            ? format(new Date(log.serviceDate), 'MMMM dd, yyyy')
                            : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-2">Maintenance Type</p>
                        <p className="font-paragraph text-base text-foreground font-medium">
                          {log.maintenanceType}
                        </p>
                      </div>
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
                      <User className="w-6 h-6 text-primary" />
                      <CardTitle className="font-heading text-3xl text-foreground">
                        Mechanic Details
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p className="font-paragraph text-sm text-secondary mb-2">Mechanic Name</p>
                      <p className="font-paragraph text-lg text-foreground font-medium">
                        {log.mechanicName}
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
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-primary" />
                      <CardTitle className="font-heading text-2xl text-foreground">
                        Service Cost
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-heading text-5xl text-foreground">
                      ${log.serviceCost?.toLocaleString()}
                    </p>
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
                      Vehicle Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={`${getStatusColor(log.vehicleStatusAfterService)} text-lg px-4 py-2`}>
                      {log.vehicleStatusAfterService}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-muted-accent/30">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-foreground">
                      Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link
                      to="/maintenance"
                      className="block w-full text-center py-3 px-4 bg-transparent text-primary border border-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      View All Records
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
