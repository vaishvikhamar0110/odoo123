// HPI 1.7-G
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Vehicles, Trips, MaintenanceLogs, Expenses } from '@/entities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { 
  Truck, 
  AlertTriangle, 
  TrendingUp, 
  Package, 
  BarChart3, 
  Users, 
  Wrench, 
  DollarSign, 
  Activity,
  MapPin,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Types & Interfaces ---
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  trend?: string;
  colorClass: string;
  delay: number;
}

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: custom * 0.1 }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function HomePage() {
  // --- 1. Data Fidelity Protocol: Identification & Canonization ---
  const [vehicles, setVehicles] = useState<Vehicles[]>([]);
  const [trips, setTrips] = useState<Trips[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLogs[]>([]);
  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');

  // Scroll Hooks for Parallax
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // --- 2. Data Fidelity Protocol: Preservation ---
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. Data Fidelity Protocol: Utilization (Derived Data) ---
  const getFilteredVehicles = () => {
    return vehicles.filter(vehicle => {
      const typeMatch = filterType === 'all' || vehicle.vehicleType === filterType;
      const statusMatch = filterStatus === 'all' || vehicle.status === filterStatus;
      const regionMatch = filterRegion === 'all' || vehicle.region === filterRegion;
      return typeMatch && statusMatch && regionMatch;
    });
  };

  const filteredVehicles = getFilteredVehicles();
  const activeFleet = filteredVehicles.filter(v => v.status === 'On Trip').length;
  const maintenanceAlerts = filteredVehicles.filter(v => v.status === 'In Shop').length;
  const availableVehicles = filteredVehicles.filter(v => v.status === 'Available').length;
  const totalCapacity = filteredVehicles.reduce((sum, v) => sum + (v.maxLoadCapacity || 0), 0);
  const utilizationRate = filteredVehicles.length > 0 
    ? Math.round((activeFleet / filteredVehicles.length) * 100) 
    : 0;
  const pendingTrips = trips.filter(t => t.tripStatus === 'Draft' || t.tripStatus === 'Dispatched').length;
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Extract unique values for filters
  const vehicleTypes = Array.from(new Set(vehicles.map(v => v.vehicleType).filter(Boolean)));
  const vehicleStatuses = Array.from(new Set(vehicles.map(v => v.status).filter(Boolean)));
  const regions = Array.from(new Set(vehicles.map(v => v.region).filter(Boolean)));

  // Helper for status colors
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Available': return 'bg-status-available text-white';
      case 'On Trip': return 'bg-status-on-trip text-white';
      case 'In Shop': return 'bg-status-in-shop text-white';
      case 'Suspended': return 'bg-status-suspended text-gray-600';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background font-paragraph text-foreground overflow-x-hidden selection:bg-primary/20">
      <Header />
      
      <main className="w-full relative">
        
        {/* --- HERO SECTION: Immersive Parallax --- */}
        <section className="relative w-full h-[85vh] overflow-clip flex items-center justify-center">
          {/* Parallax Background */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute inset-0 w-full h-[120%] -top-[10%]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-background z-10" />
            <Image 
              src="https://static.wixstatic.com/media/58754a_ea3db11b162e422d9a6841e7e4f30a33~mv2.png?originWidth=1280&originHeight=704" 
              alt="Fleet Operations Center" 
              className="w-full h-full object-cover opacity-40 grayscale contrast-125"
            />
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-20 w-full max-w-[120rem] mx-auto px-6 md:px-12 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1 border-primary/40 text-primary bg-primary/5 backdrop-blur-sm uppercase tracking-widest text-xs font-semibold">
                Enterprise Logistics ERP
              </Badge>
              <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold text-foreground tracking-tight mb-6 leading-[0.9]">
                FleetFlow <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-muted-accent">Command</span>
              </h1>
              <p className="font-paragraph text-xl md:text-2xl text-secondary max-w-3xl mx-auto leading-relaxed mb-10">
                Orchestrate your global operations with precision. Real-time intelligence for the modern fleet manager.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-foreground text-background hover:bg-primary transition-colors duration-300 min-w-[180px] h-14 text-lg rounded-full">
                  View Dashboard
                </Button>
                <Button variant="outline" size="lg" className="border-foreground/20 hover:bg-soft-gray-section min-w-[180px] h-14 text-lg rounded-full">
                  System Status
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
          >
            <span className="text-xs uppercase tracking-widest text-muted-accent">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
          </motion.div>
        </section>

        {/* --- STICKY COMMAND BAR: Filters & Controls --- */}
        <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm transition-all duration-300">
          <div className="max-w-[120rem] mx-auto px-6 md:px-12 py-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold leading-none">Live Operations</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isLoading ? 'Syncing...' : `Last updated: ${new Date().toLocaleTimeString()}`}
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[160px] bg-transparent border-border/60 focus:ring-primary/20">
                    <SelectValue placeholder="Vehicle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {vehicleTypes.map(type => (
                      <SelectItem key={type} value={type!}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[160px] bg-transparent border-border/60 focus:ring-primary/20">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {vehicleStatuses.map(status => (
                      <SelectItem key={status} value={status!}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="w-[160px] bg-transparent border-border/60 focus:ring-primary/20">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region!}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="h-8 w-[1px] bg-border/60 mx-2 hidden lg:block" />
                
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => {
                  setFilterType('all');
                  setFilterStatus('all');
                  setFilterRegion('all');
                }}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* --- KPI SECTION: High-Level Metrics --- */}
        <section className="w-full max-w-[120rem] mx-auto px-6 md:px-12 py-16 lg:py-24">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <KPICard 
              title="Active Fleet" 
              value={activeFleet} 
              subtitle="Vehicles currently on trip" 
              icon={Truck} 
              colorClass="text-status-on-trip"
              delay={0}
            />
            <KPICard 
              title="Maintenance Alerts" 
              value={maintenanceAlerts} 
              subtitle="Vehicles in shop" 
              icon={AlertTriangle} 
              colorClass="text-status-in-shop"
              delay={1}
            />
            <KPICard 
              title="Utilization Rate" 
              value={`${utilizationRate}%`} 
              subtitle={`${availableVehicles} vehicles available`} 
              icon={TrendingUp} 
              colorClass="text-primary"
              delay={2}
            />
            <KPICard 
              title="Pending Cargo" 
              value={pendingTrips} 
              subtitle="Scheduled trips" 
              icon={Package} 
              colorClass="text-secondary"
              delay={3}
            />
          </motion.div>
        </section>

        {/* --- FLEET REGISTRY: Horizontal Scroll Discovery --- */}
        <section className="w-full bg-soft-gray-section py-24 overflow-hidden">
          <div className="max-w-[120rem] mx-auto px-6 md:px-12 mb-12 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Fleet Registry</h2>
              <p className="text-secondary max-w-xl">
                Real-time status and location data for your entire fleet. 
                Currently showing {filteredVehicles.length} vehicles based on your filters.
              </p>
            </div>
            <Link to="/vehicles">
              <Button variant="outline" className="group">
                View Full Registry 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Horizontal Scroll Container */}
          <div className="w-full overflow-x-auto pb-12 px-6 md:px-12 scrollbar-hide">
            <div className="flex gap-6 min-w-max">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  // Loading Skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={`skel-${i}`} className="w-[350px] h-[420px] bg-white rounded-2xl animate-pulse" />
                  ))
                ) : filteredVehicles.length === 0 ? (
                  <div className="w-full flex flex-col items-center justify-center py-20 px-12 bg-white rounded-2xl border border-dashed border-muted-accent">
                    <Truck className="w-12 h-12 text-muted-accent mb-4 opacity-50" />
                    <p className="text-lg text-secondary">No vehicles match the current filters.</p>
                  </div>
                ) : (
                  filteredVehicles.map((vehicle, index) => (
                    <motion.div
                      key={vehicle._id}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="w-[350px] group"
                    >
                      <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white">
                        <div className="relative h-48 overflow-hidden">
                          <div className="absolute top-4 right-4 z-10">
                            <Badge className={`${getStatusColor(vehicle.status)} border-none shadow-sm px-3 py-1`}>
                              {vehicle.status}
                            </Badge>
                          </div>
                          <Image 
                            src={vehicle.vehicleImage || "https://static.wixstatic.com/media/58754a_cb93a8e770914060a9525bc0753df6e8~mv2.png?originWidth=320&originHeight=320"} 
                            alt={vehicle.name || "Vehicle"}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                          <div className="absolute bottom-4 left-4 text-white">
                            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{vehicle.vehicleType}</p>
                            <h3 className="font-heading text-2xl">{vehicle.name}</h3>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">License Plate</p>
                              <p className="font-medium text-foreground">{vehicle.licensePlate}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Region</p>
                              <p className="font-medium text-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-primary" /> {vehicle.region}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Capacity</p>
                              <p className="font-medium text-foreground">{vehicle.maxLoadCapacity} kg</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Odometer</p>
                              <p className="font-medium text-foreground">{vehicle.odometer?.toLocaleString()} km</p>
                            </div>
                          </div>
                          <div className="mt-6 pt-4 border-t border-border/40 flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">ID: {vehicle._id.slice(-6)}</span>
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto font-medium">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* --- OPERATIONAL PULSE: Split View (Trips & Maintenance) --- */}
        <section className="w-full max-w-[120rem] mx-auto px-6 md:px-12 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Active Trips (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-3xl md:text-4xl text-foreground">Recent Dispatches</h2>
                <Link to="/trips" className="text-sm font-medium text-primary hover:underline">View All Trips</Link>
              </div>
              
              <div className="space-y-4">
                {isLoading ? (
                  <div className="h-24 bg-soft-gray-section rounded-xl animate-pulse" />
                ) : trips.slice(0, 4).map((trip, idx) => (
                  <motion.div 
                    key={trip._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-white border border-border/40 rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-soft-gray-section rounded-full group-hover:bg-primary/10 transition-colors">
                          <Package className="w-6 h-6 text-secondary group-hover:text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-heading text-xl font-semibold text-foreground">{trip.tripNumber}</h4>
                            <Badge variant="secondary" className="text-[10px] h-5">{trip.tripStatus}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{trip.cargoDetails}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase">From</span>
                          <span className="font-medium">{trip.startLocation}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-accent" />
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground uppercase">To</span>
                          <span className="font-medium">{trip.endLocation}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Maintenance & Financials (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              
              {/* Maintenance Widget */}
              <div className="bg-soft-gray-section rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Wrench className="w-32 h-32" />
                </div>
                <h3 className="font-heading text-2xl text-foreground mb-6 relative z-10">Maintenance Watch</h3>
                
                <div className="space-y-4 relative z-10">
                  {maintenanceLogs.slice(0, 3).map((log) => (
                    <div key={log._id} className="bg-white p-4 rounded-lg shadow-sm border border-border/20 flex items-start gap-3">
                      <div className="mt-1">
                        <div className="w-2 h-2 rounded-full bg-status-in-shop" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{log.vehicleLicensePlate}</p>
                        <p className="text-xs text-muted-foreground mt-1">{log.maintenanceType} - {log.description}</p>
                        <p className="text-[10px] text-muted-accent mt-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> 
                          {log.serviceDate ? new Date(log.serviceDate).toLocaleDateString() : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {maintenanceLogs.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No active maintenance logs.</p>
                  )}
                </div>
                <Link to="/maintenance" className="inline-block mt-6 text-sm font-medium text-primary hover:underline relative z-10">
                  Maintenance Schedule &rarr;
                </Link>
              </div>

              {/* Financial Snapshot */}
              <div className="bg-foreground text-background rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                <h3 className="font-heading text-2xl mb-2">Financial Overview</h3>
                <p className="text-white/60 text-sm mb-8">Total operational expenses for current period</p>
                
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold tracking-tight">${totalExpenses.toLocaleString()}</span>
                  <span className="text-sm text-primary">+2.4% vs last month</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Fuel</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[65%]" />
                  </div>
                  
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-white/60">Maintenance</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-status-in-shop w-[25%]" />
                  </div>
                </div>
                
                <Link to="/expenses" className="inline-block mt-8 text-sm font-medium text-white hover:text-primary transition-colors">
                  View Financial Reports &rarr;
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* --- QUICK ACCESS GRID --- */}
        <section className="w-full bg-white border-t border-border/40 py-24">
          <div className="max-w-[100rem] mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl text-foreground mb-4">System Modules</h2>
              <p className="text-secondary">Direct access to core management subsystems</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <QuickLinkCard title="Registry" icon={Truck} link="/vehicles" />
              <QuickLinkCard title="Dispatch" icon={Package} link="/trips" />
              <QuickLinkCard title="Drivers" icon={Users} link="/drivers" />
              <QuickLinkCard title="Service" icon={Wrench} link="/maintenance" />
              <QuickLinkCard title="Finance" icon={DollarSign} link="/expenses" />
              <QuickLinkCard title="Analytics" icon={BarChart3} link="/analytics" />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

// --- Sub-Components ---

function KPICard({ title, value, subtitle, icon: Icon, colorClass, delay }: KPICardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={delay}
      className="h-full"
    >
      <Card className="h-full border-border/40 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </CardTitle>
          <Icon className={`h-5 w-5 ${colorClass} opacity-70 group-hover:opacity-100 transition-opacity`} />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold font-heading text-foreground mb-1">{value}</div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickLinkCard({ title, icon: Icon, link }: { title: string, icon: React.ElementType, link: string }) {
  return (
    <Link to={link} className="block group">
      <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-soft-gray-section border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-lg transition-all duration-300 h-full">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 group-hover:text-primary transition-all duration-300">
          <Icon className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
        </div>
        <span className="font-heading text-lg font-medium text-foreground">{title}</span>
      </div>
    </Link>
  );
}