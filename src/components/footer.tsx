import Link from 'next/link';
import { Logo } from './logo';

export default function Footer() {
  return (
    <footer className="bg-primary/5 border-t border-primary/10 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-bold text-lg text-foreground">Re-Source</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">
              About Us
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Re-Source. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
