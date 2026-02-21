import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
              <Mail className="w-12 h-12 text-primary" />
              <h1 className="font-heading text-6xl text-foreground">
                Contact Us
              </h1>
            </div>
            <p className="font-paragraph text-xl text-secondary max-w-3xl">
              Get in touch with our team for support, inquiries, or partnership opportunities.
            </p>
          </motion.div>
        </section>

        {/* Contact Content */}
        <section className="w-full max-w-[100rem] mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-muted-accent/30">
                  <CardHeader>
                    <CardTitle className="font-heading text-3xl text-foreground">
                      Send us a message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {submitSuccess && (
                      <div className="mb-6 p-4 bg-status-available/20 border border-status-available rounded-lg">
                        <p className="font-paragraph text-base text-foreground">
                          Thank you for your message! We'll get back to you soon.
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="font-paragraph text-sm text-secondary mb-2 block">
                            Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="border-muted-accent"
                            placeholder="Your name"
                          />
                        </div>

                        <div>
                          <label htmlFor="email" className="font-paragraph text-sm text-secondary mb-2 block">
                            Email *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="border-muted-accent"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="font-paragraph text-sm text-secondary mb-2 block">
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="border-muted-accent"
                          placeholder="How can we help?"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="font-paragraph text-sm text-secondary mb-2 block">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          className="border-muted-accent min-h-[200px]"
                          placeholder="Tell us more about your inquiry..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-transparent text-primary border border-primary hover:bg-primary hover:text-primary-foreground w-full md:w-auto"
                      >
                        {isSubmitting ? (
                          <>Sending...</>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-muted-accent/30">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-foreground">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-soft-gray-section flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">Email</p>
                        <p className="font-paragraph text-base text-foreground">
                          support@fleetflow.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-soft-gray-section flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">Phone</p>
                        <p className="font-paragraph text-base text-foreground">
                          +1 (555) 123-4567
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-soft-gray-section flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-paragraph text-sm text-secondary mb-1">Address</p>
                        <p className="font-paragraph text-base text-foreground">
                          123 Fleet Street<br />
                          Logistics District<br />
                          San Francisco, CA 94102
                        </p>
                      </div>
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
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <p className="font-paragraph text-base text-secondary">Monday - Friday</p>
                      <p className="font-paragraph text-base text-foreground font-medium">9:00 AM - 6:00 PM</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-paragraph text-base text-secondary">Saturday</p>
                      <p className="font-paragraph text-base text-foreground font-medium">10:00 AM - 4:00 PM</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="font-paragraph text-base text-secondary">Sunday</p>
                      <p className="font-paragraph text-base text-foreground font-medium">Closed</p>
                    </div>
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
