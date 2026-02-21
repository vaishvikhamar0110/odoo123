import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Drivers } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { ArrowLeft, Users, Mail, Phone, CreditCard, Calendar, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<Drivers | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDriverData();
  }, [id]);

  const loadDriverData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const driverData = await BaseCrudService.getById<Drivers>('drivers', id);
      setDriver(driverData);
    } catch (error) {
      console.error('Error loading driver data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!driver) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-muted-accent mx-auto mb-4" />
            <h2 className="font-heading text-3xl text-foreground mb-2">
              Driver not found
            </h2>
            <p className="font-paragraph text-base text-secondary mb-6">
              The driver you're looking for doesn't exist
            </p>
            <Link
              to="/drivers"
              className="inline-flex items-center gap-2 font-paragraph text-base text-primary hover:text-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Drivers
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
              to="/drivers"
              className="inline-flex items-center gap-2 font-paragraph text-base text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Drivers
            </Link>

            <div className="flex items-start gap-6 mb-6">
              {driver.driverPhoto ? (
                <div className="w-24 h-24 rounded-full overflow-hidden bg-soft-gray-section flex-shrink-0">
                  <Image
                    src={driver.driverPhoto}
                    alt={`${driver.firstName} ${driver.lastName}`}
                    width={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                  <Users className="w-12 h-12 text-muted-accent" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="font-heading text-6xl text-foreground mb-2">
                  {driver.firstName} {driver.lastName}
                </h1>
                <div className="flex gap-3">
                  <Badge className={getStatusColor(driver.dutyStatus)}>
                    {driver.dutyStatus}
                  </Badge>
                  <Badge className={getLicenseStatusColor(driver.licenseStatus)}>
                    License: {driver.licenseStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Driver Details */}
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
                      <Mail className="w-6 h-6 text-primary" />
                      <CardTitle className="font-heading text-3xl text-foreground">
                        Contact Information
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {driver.email && (
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">Email</p>
                        <p className="font-paragraph text-base text-foreground font-medium">
                          {driver.email}
                        </p>
                      </div>
                    )}
                    {driver.phoneNumber && (
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">Phone Number</p>
                        <p className="font-paragraph text-base text-foreground font-medium">
                          {driver.phoneNumber}
                        </p>
                      </div>
                    )}
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
                      <CreditCard className="w-6 h-6 text-primary" />
                      <CardTitle className="font-heading text-3xl text-foreground">
                        License Information
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">License Number</p>
                        <p className="font-paragraph text-base text-foreground font-medium">
                          {driver.licenseNumber}
                        </p>
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">Status</p>
                        <Badge className={getLicenseStatusColor(driver.licenseStatus)}>
                          {driver.licenseStatus}
                        </Badge>
                      </div>
                      {driver.licenseExpiryDate && (
                        <div>
                          <p className="font-paragraph text-sm text-secondary mb-1">Expiry Date</p>
                          <p className="font-paragraph text-base text-foreground font-medium">
                            {format(new Date(driver.licenseExpiryDate), 'MMM dd, yyyy')}
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
                      <Award className="w-6 h-6 text-primary" />
                      <CardTitle className="font-heading text-3xl text-foreground">
                        Performance Metrics
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-2">Safety Score</p>
                        <div className="flex items-end gap-2">
                          <p className="font-heading text-5xl text-foreground">
                            {driver.safetyScore}
                          </p>
                          <p className="font-paragraph text-xl text-secondary mb-2">/100</p>
                        </div>
                        <div className="w-full bg-soft-gray-section rounded-full h-2 mt-3">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${driver.safetyScore}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-2">Trip Completion Rate</p>
                        <div className="flex items-end gap-2">
                          <p className="font-heading text-5xl text-foreground">
                            {driver.tripCompletionRate}
                          </p>
                          <p className="font-paragraph text-xl text-secondary mb-2">%</p>
                        </div>
                        <div className="w-full bg-soft-gray-section rounded-full h-2 mt-3">
                          <div
                            className="bg-status-available h-2 rounded-full transition-all duration-500"
                            style={{ width: `${driver.tripCompletionRate}%` }}
                          />
                        </div>
                      </div>
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
                      Current Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={`${getStatusColor(driver.dutyStatus)} text-lg px-4 py-2`}>
                      {driver.dutyStatus}
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
                      to="/drivers"
                      className="block w-full text-center py-3 px-4 bg-transparent text-primary border border-primary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      View All Drivers
                    </Link>
                    <Link
                      to="/trips"
                      className="block w-full text-center py-3 px-4 bg-transparent text-secondary border border-muted-accent rounded-lg hover:bg-muted-accent/20 transition-all duration-300"
                    >
                      View Trips
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
