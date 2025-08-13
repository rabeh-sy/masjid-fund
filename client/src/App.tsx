import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { PWAInstall } from "@/components/pwa-install";
import MosquesPage from "@/pages/mosques";
import MosqueProfilePage from "@/pages/mosque-profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MosquesPage} />
      <Route path="/mosques" component={MosquesPage} />
      <Route path="/mosque/:id" component={MosqueProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Navigation />
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
      <PWAInstall />
      <Toaster />
    </div>
  );
}

export default App;
