import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="px-6 h-16 flex items-center fixed w-full z-50 glass border-b border-border/40">
        <Link className="flex items-center justify-center font-bold text-xl tracking-tight" href="#">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2 text-primary-foreground">
             <ShieldCheck size={18} />
          </div>
          <span>Smart<span className="text-primary">Attendance</span></span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground" href="#about">
            About
          </Link>
        </nav>
        <div className="ml-6">
           <Link href="/login">
            <Button variant="premium" className="shadow-lg shadow-primary/20">
              Employee Login
            </Button>
           </Link>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 -z-10">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />
          </div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                  New: Payroll Integration Live
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground">
                  Workforce Management <br/>
                  <span className="text-primary">Reimagined.</span>
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                  The all-in-one platform for modern companies. Track attendance, manage leaves, and process payroll with enterprise-grade security and beautiful design.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                  <Link href="/login">
                    <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/20 w-full sm:w-auto">
                      Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-background/50 backdrop-blur w-full sm:w-auto">
                    View Demo
                  </Button>
                </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="w-full py-12 md:py-24 bg-muted/30 border-t border-border/40">
           <div className="container px-4 md:px-6">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything you need</h2>
                <p className="text-muted-foreground mt-4 text-lg">Powerful features wrapped in a simple, intuitive interface.</p>
             </div>
             <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
               {[ 
                 { title: "Smart Attendance", icon: Zap, desc: "Geolocation-fenced clock-ins with real-time verification." },
                 { title: "Team Management", icon: Users, desc: "Comprehensive directory and role-based access control." },
                 { title: "Payroll Automation", icon: CheckCircle2, desc: "One-click salary processing with automated tax calculations." }
               ].map((feature, i) => (
                 <Card key={i} className="relative overflow-hidden border-border/50 bg-background/50 hover:bg-background transition-colors duration-300">
                   <CardContent className="p-8 space-y-4">
                     <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary">
                       <feature.icon className="h-6 w-6" />
                     </div>
                     <h3 className="text-xl font-bold">{feature.title}</h3>
                     <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </div>
        </section>
      </main>

      <footer className="py-8 w-full border-t border-border/40 bg-background/50 backdrop-blur">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Smart Attendance Inc.
          </p>
          <div className="flex gap-6">
             <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
             <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
