import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-ink text-canvas pt-section pb-xl px-md lg:px-xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-xl">
        <div>
          <h3 className="text-caption-md uppercase mb-lg">Find a Store</h3>
          <h3 className="text-caption-md uppercase mb-lg">Become A Member</h3>
          <h3 className="text-caption-md uppercase mb-lg">Student Discount</h3>
          <h3 className="text-caption-md uppercase mb-lg">Send Us Feedback</h3>
        </div>
        
        <div>
          <h3 className="text-caption-md uppercase mb-lg text-mute">Get Help</h3>
          <ul className="space-y-sm text-caption-sm text-stone">
            <li><Link href="/help" className="hover:text-canvas transition-colors">Order Status</Link></li>
            <li><Link href="/help" className="hover:text-canvas transition-colors">Delivery</Link></li>
            <li><Link href="/help" className="hover:text-canvas transition-colors">Returns</Link></li>
            <li><Link href="/help" className="hover:text-canvas transition-colors">Payment Options</Link></li>
            <li><Link href="/help" className="hover:text-canvas transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-caption-md uppercase mb-lg text-mute">About Shopstack</h3>
          <ul className="space-y-sm text-caption-sm text-stone">
            <li><Link href="/about" className="hover:text-canvas transition-colors">News</Link></li>
            <li><Link href="/about" className="hover:text-canvas transition-colors">Careers</Link></li>
            <li><Link href="/about" className="hover:text-canvas transition-colors">Investors</Link></li>
            <li><Link href="/about" className="hover:text-canvas transition-colors">Sustainability</Link></li>
          </ul>
        </div>
        
        <div className="flex justify-start md:justify-end space-x-md">
          {/* Social Icons Placeholder */}
          <div className="w-8 h-8 bg-charcoal rounded-full flex items-center justify-center hover:bg-stone cursor-pointer transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </div>
          <div className="w-8 h-8 bg-charcoal rounded-full flex items-center justify-center hover:bg-stone cursor-pointer transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </div>
        </div>
      </div>
      
      <div className="mt-section pt-xl border-t border-charcoal flex flex-col md:flex-row justify-between items-start md:items-center text-utility-xs text-stone">
        <div className="mb-sm md:mb-0">
          © {new Date().getFullYear()} Shopstack, Inc. All Rights Reserved
        </div>
        <div className="flex space-x-lg">
          <Link href="/terms" className="hover:text-canvas transition-colors">Terms of Sale</Link>
          <Link href="/terms" className="hover:text-canvas transition-colors">Terms of Use</Link>
          <Link href="/privacy" className="hover:text-canvas transition-colors">Shopstack Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
