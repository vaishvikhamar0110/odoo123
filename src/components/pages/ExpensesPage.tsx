import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Expenses } from '@/entities';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, DollarSign, Calendar, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [hasNext, setHasNext] = useState(false);
  const [skip, setSkip] = useState(0);
  const LIMIT = 12;

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async (loadMore = false) => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Expenses>('expenses', [], { 
        limit: LIMIT, 
        skip: loadMore ? skip : 0 
      });
      
      if (loadMore) {
        setExpenses(prev => [...prev, ...result.items]);
      } else {
        setExpenses(result.items);
      }
      
      setHasNext(result.hasNext);
      setSkip(result.nextSkip || 0);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredExpenses = () => {
    return expenses.filter(expense => {
      const searchMatch = !searchQuery || 
        expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.expenseCategory?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const categoryMatch = filterCategory === 'all' || expense.expenseCategory === filterCategory;
      
      return searchMatch && categoryMatch;
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const categories = Array.from(new Set(expenses.map(e => e.expenseCategory).filter(Boolean)));

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const averageExpense = filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0;

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
              <DollarSign className="w-12 h-12 text-primary" />
              <h1 className="font-heading text-6xl text-foreground">
                Expense Tracking
              </h1>
            </div>
            <p className="font-paragraph text-xl text-secondary max-w-3xl mb-8">
              Monitor all operational expenses. Track fuel costs, maintenance, and other fleet-related expenditures.
            </p>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-muted-accent"
                />
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-background border-muted-accent">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category!}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </section>

        {/* Summary Cards */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-muted-accent/30">
                <CardContent className="pt-6">
                  <p className="font-paragraph text-sm text-secondary mb-2">Total Expenses</p>
                  <p className="font-heading text-4xl text-foreground">
                    ${totalExpenses.toLocaleString()}
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
                <CardContent className="pt-6">
                  <p className="font-paragraph text-sm text-secondary mb-2">Average Expense</p>
                  <p className="font-heading text-4xl text-foreground">
                    ${averageExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-muted-accent/30">
                <CardContent className="pt-6">
                  <p className="font-paragraph text-sm text-secondary mb-2">Total Records</p>
                  <p className="font-heading text-4xl text-foreground">
                    {filteredExpenses.length}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="mb-6">
            <p className="font-paragraph text-base text-secondary">
              Showing {filteredExpenses.length} of {expenses.length} expense records
            </p>
          </div>

          <div className="min-h-[600px]">
            {isLoading ? null : filteredExpenses.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredExpenses.map((expense, index) => (
                    <motion.div
                      key={expense._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <Card className="border-muted-accent/30 h-full">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-heading text-2xl text-foreground mb-1">
                                {expense.expenseCategory}
                              </h3>
                              <p className="font-paragraph text-sm text-secondary">
                                {expense.description}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            {expense.expenseDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="font-paragraph text-sm text-secondary">Date</p>
                                  <p className="font-paragraph text-sm text-foreground font-medium">
                                    {format(new Date(expense.expenseDate), 'MMM dd, yyyy')}
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-primary flex-shrink-0" />
                              <div className="flex-1">
                                <p className="font-paragraph text-sm text-secondary">Amount</p>
                                <p className="font-paragraph text-lg text-foreground font-medium">
                                  ${expense.amount?.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {expense.quantity && expense.unitOfMeasure && (
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-primary flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="font-paragraph text-sm text-secondary">Quantity</p>
                                  <p className="font-paragraph text-sm text-foreground font-medium">
                                    {expense.quantity} {expense.unitOfMeasure}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {expense.quantity && expense.amount && (
                            <div className="pt-4 border-t border-muted-accent/30">
                              <div className="flex justify-between items-center">
                                <p className="font-paragraph text-sm text-secondary">
                                  Unit Cost
                                </p>
                                <p className="font-paragraph text-sm text-foreground font-medium">
                                  ${(expense.amount / expense.quantity).toFixed(2)} / {expense.unitOfMeasure}
                                </p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                {hasNext && (
                  <div className="mt-12 text-center">
                    <Button
                      onClick={() => loadExpenses(true)}
                      className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      Load More Expenses
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <DollarSign className="w-16 h-16 text-muted-accent mx-auto mb-4" />
                <h3 className="font-heading text-2xl text-foreground mb-2">
                  No expenses found
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
