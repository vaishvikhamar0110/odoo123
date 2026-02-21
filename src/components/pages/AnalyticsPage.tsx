import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Vehicles, Trips, MaintenanceLogs, Expenses } from '@/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Truck, DollarSign, Wrench, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AnalyticsPage() {
  const [vehicles, setVehicles] = useState<Vehicles[]>([]);
  const [trips, setTrips] = useState<Trips[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogs[]>([]);
  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRegion, setFilterRegion] = useState<string>('all');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [vehiclesData, tripsData, maintenanceData, expensesData] = await Promise.all([
        BaseCrudService.getAll<Vehicles>('vehicles'),
        BaseCrudService.getAll<Trips>('trips'),
        BaseCrudService.getAll<MaintenanceLogs>('maintenancelogs'),
        BaseCrudService.getAll<Expenses>('expenses')
      ]);
      
      setVehicles(vehiclesData.items);
      setTrips(tripsData.items);
      setMaintenanceLogs(maintenanceData.items);
      setExpenses(expensesData.items);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredVehicles = () => {
    if (filterRegion === 'all') return vehicles;
    return vehicles.filter(v => v.region === filterRegion);
  };

  const filteredVehicles = getFilteredVehicles();
  const regions = Array.from(new Set(vehicles.map(v => v.region).filter(Boolean)));

  // Calculate metrics
  const totalVehicles = filteredVehicles.length;
  const activeVehicles = filteredVehicles.filter(v => v.status === 'On Trip').length;
  const availableVehicles = filteredVehicles.filter(v => v.status === 'Available').length;
  const inShopVehicles = filteredVehicles.filter(v => v.status === 'In Shop').length;
  const utilizationRate = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;

  const totalOdometer = filteredVehicles.reduce((sum, v) => sum + (v.odometer || 0), 0);
  const averageOdometer = totalVehicles > 0 ? Math.round(totalOdometer / totalVehicles) : 0;

  const totalCapacity = filteredVehicles.reduce((sum, v) => sum + (v.maxLoadCapacity || 0), 0);
  const averageCapacity = totalVehicles > 0 ? Math.round(totalCapacity / totalVehicles) : 0;

  const completedTrips = trips.filter(t => t.tripStatus === 'Completed').length;
  const dispatchedTrips = trips.filter(t => t.tripStatus === 'Dispatched').length;
  const draftTrips = trips.filter(t => t.tripStatus === 'Draft').length;
  const cancelledTrips = trips.filter(t => t.tripStatus === 'Cancelled').length;

  const totalMaintenanceCost = maintenanceLogs.reduce((sum, log) => sum + (log.serviceCost || 0), 0);
  const averageMaintenanceCost = maintenanceLogs.length > 0 ? Math.round(totalMaintenanceCost / maintenanceLogs.length) : 0;

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const fuelExpenses = expenses.filter(e => e.expenseCategory?.toLowerCase().includes('fuel'));
  const totalFuelCost = fuelExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const totalOperationalCost = totalMaintenanceCost + totalExpenses;
  const costPerKm = totalOdometer > 0 ? (totalOperationalCost / totalOdometer).toFixed(2) : '0.00';

  const fuelLiters = fuelExpenses.reduce((sum, e) => sum + (e.quantity || 0), 0);
  const fuelEfficiency = fuelLiters > 0 ? (totalOdometer / fuelLiters).toFixed(2) : '0.00';

  // Vehicle type distribution
  const vehicleTypeDistribution = filteredVehicles.reduce((acc, v) => {
    const type = v.vehicleType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
              <BarChart3 className="w-12 h-12 text-primary" />
              <h1 className="font-heading text-6xl text-foreground">
                Operational Analytics
              </h1>
            </div>
            <p className="font-paragraph text-xl text-secondary max-w-3xl mb-8">
              Comprehensive insights into fleet performance, costs, and efficiency metrics.
            </p>

            {/* Region Filter */}
            <div className="max-w-xs">
              <label className="font-paragraph text-sm text-secondary mb-2 block">Filter by Region</label>
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

        {/* Fleet Overview */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-4xl text-foreground mb-8">
              Fleet Overview
            </h2>

            <div className="min-h-[200px]">
              {isLoading ? null : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-muted-accent/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-paragraph text-sm text-secondary font-normal">
                          Total Vehicles
                        </CardTitle>
                        <Truck className="w-5 h-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-heading text-4xl text-foreground mb-1">{totalVehicles}</p>
                      <p className="font-paragraph text-sm text-secondary">Registered</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-paragraph text-sm text-secondary font-normal">
                          Active Fleet
                        </CardTitle>
                        <TrendingUp className="w-5 h-5 text-status-on-trip" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-heading text-4xl text-foreground mb-1">{activeVehicles}</p>
                      <p className="font-paragraph text-sm text-secondary">On Trip</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-paragraph text-sm text-secondary font-normal">
                          Available
                        </CardTitle>
                        <Truck className="w-5 h-5 text-status-available" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-heading text-4xl text-foreground mb-1">{availableVehicles}</p>
                      <p className="font-paragraph text-sm text-secondary">Ready for dispatch</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-paragraph text-sm text-secondary font-normal">
                          Utilization Rate
                        </CardTitle>
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-heading text-4xl text-foreground mb-1">{utilizationRate}%</p>
                      <p className="font-paragraph text-sm text-secondary">Fleet efficiency</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Trip Analytics */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16 bg-soft-gray-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Package className="w-8 h-8 text-primary" />
              <h2 className="font-heading text-4xl text-foreground">
                Trip Analytics
              </h2>
            </div>

            <div className="min-h-[200px]">
              {isLoading ? null : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Completed Trips</p>
                      <p className="font-heading text-4xl text-foreground">{completedTrips}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">In Progress</p>
                      <p className="font-heading text-4xl text-foreground">{dispatchedTrips}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Draft Trips</p>
                      <p className="font-heading text-4xl text-foreground">{draftTrips}</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Cancelled</p>
                      <p className="font-heading text-4xl text-foreground">{cancelledTrips}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Financial Analytics */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <DollarSign className="w-8 h-8 text-primary" />
              <h2 className="font-heading text-4xl text-foreground">
                Financial Analytics
              </h2>
            </div>

            <div className="min-h-[200px]">
              {isLoading ? null : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Total Operational Cost</p>
                      <p className="font-heading text-4xl text-foreground mb-1">
                        ${totalOperationalCost.toLocaleString()}
                      </p>
                      <p className="font-paragraph text-sm text-secondary">
                        Maintenance + Expenses
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Maintenance Costs</p>
                      <p className="font-heading text-4xl text-foreground mb-1">
                        ${totalMaintenanceCost.toLocaleString()}
                      </p>
                      <p className="font-paragraph text-sm text-secondary">
                        Avg: ${averageMaintenanceCost.toLocaleString()} per service
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Fuel Expenses</p>
                      <p className="font-heading text-4xl text-foreground mb-1">
                        ${totalFuelCost.toLocaleString()}
                      </p>
                      <p className="font-paragraph text-sm text-secondary">
                        {fuelLiters.toLocaleString()} liters consumed
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Cost per Kilometer</p>
                      <p className="font-heading text-4xl text-foreground mb-1">
                        ${costPerKm}
                      </p>
                      <p className="font-paragraph text-sm text-secondary">
                        Based on {totalOdometer.toLocaleString()} km
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Fuel Efficiency</p>
                      <p className="font-heading text-4xl text-foreground mb-1">
                        {fuelEfficiency}
                      </p>
                      <p className="font-paragraph text-sm text-secondary">
                        km per liter
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Other Expenses</p>
                      <p className="font-heading text-4xl text-foreground mb-1">
                        ${totalExpenses.toLocaleString()}
                      </p>
                      <p className="font-paragraph text-sm text-secondary">
                        {expenses.length} records
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Vehicle Performance */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16 bg-soft-gray-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Wrench className="w-8 h-8 text-primary" />
              <h2 className="font-heading text-4xl text-foreground">
                Vehicle Performance
              </h2>
            </div>

            <div className="min-h-[200px]">
              {isLoading ? null : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Average Odometer</p>
                      <p className="font-heading text-4xl text-foreground">
                        {averageOdometer.toLocaleString()}
                      </p>
                      <p className="font-paragraph text-sm text-secondary">km per vehicle</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Total Distance</p>
                      <p className="font-heading text-4xl text-foreground">
                        {totalOdometer.toLocaleString()}
                      </p>
                      <p className="font-paragraph text-sm text-secondary">km traveled</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">In Maintenance</p>
                      <p className="font-heading text-4xl text-foreground">{inShopVehicles}</p>
                      <p className="font-paragraph text-sm text-secondary">vehicles</p>
                    </CardContent>
                  </Card>

                  <Card className="border-muted-accent/30">
                    <CardContent className="pt-6">
                      <p className="font-paragraph text-sm text-secondary mb-2">Avg Load Capacity</p>
                      <p className="font-heading text-4xl text-foreground">
                        {averageCapacity.toLocaleString()}
                      </p>
                      <p className="font-paragraph text-sm text-secondary">kg per vehicle</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {isLoading ? null : (
                <Card className="border-muted-accent/30">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-foreground">
                      Fleet Composition by Vehicle Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(vehicleTypeDistribution).map(([type, count]) => (
                        <div key={type}>
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-paragraph text-base text-foreground">{type}</p>
                            <p className="font-paragraph text-base text-secondary">
                              {count} vehicles ({Math.round((count / totalVehicles) * 100)}%)
                            </p>
                          </div>
                          <div className="w-full bg-soft-gray-section rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(count / totalVehicles) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
