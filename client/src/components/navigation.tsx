import { Link } from "wouter";
import { Church } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navigation() {
  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center ml-3">
                <Church className="text-primary-foreground text-sm w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-primary">مساجد سوريا</h1>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link href="/" className="text-primary hover:text-primary/80 font-medium">
              الرئيسية
            </Link>
            <a href="#" className="text-muted-foreground hover:text-primary font-medium">
              عن المشروع
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary font-medium">
              تواصل معنا
            </a>
            <ThemeToggle />
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button className="text-muted-foreground hover:text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
