import { motion } from 'framer-motion';

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-card border-t border-border py-8 mt-auto"
  >
    <div className="container mx-auto px-4 text-center space-y-4">
      <p className="text-muted-foreground text-sm">
        Developed by <span className="font-semibold text-foreground">ER. Prins Sayja</span>
      </p>
      <p className="text-muted-foreground text-sm">📞 +91 8140805960</p>
      <div className="flex justify-center gap-4">
        <a
          href="https://wa.me/+918140805960"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
        >
          WhatsApp
        </a>
        
      </div>
      <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} સાજા પરિવાર</p>
    </div>
  </motion.footer>
);

export default Footer;
