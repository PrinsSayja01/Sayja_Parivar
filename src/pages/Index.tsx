import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <Header />

    <main className="flex-1">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 gradient-warm opacity-50" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              <span
                className="gradient-primary bg-clip-text"
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                સાયજા પરિવાર
              </span>
            </h1>

            <p className="text-xl text-muted-foreground">
              પરિવાર ની સંપૂર્ણ માહિતી એક જગ્યાએ સંગ્રહ કરવા માટે બનાવાયેલ સિસ્ટમ
            </p>

            <p className="text-muted-foreground text-base">
              આ પ્લેટફોર્મ દ્વારા તમે તમારા પરિવારના તમામ સભ્યોની માહિતી સરળતાથી ભરી શકો છો.
              તમે ફોર્મ ભરી શકો, ફોટો અપલોડ કરી શકો અથવા OCR દ્વારા ફોટામાંથી માહિતી આપમેળે મેળવી શકો છો.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link to="/login">
                <Button
                  size="lg"
                  className="gradient-primary text-primary-foreground border-0 shadow-elevated text-lg px-8"
                >
                  ➕ નવી માહિતી ઉમેરો
                </Button>
              </Link>

              <Link to="/ocr">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  📷 ફોટો અપલોડ કરીને માહિતી ભરો
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {[
            {
              icon: '📝',
              title: 'સરળ ફોર્મ સિસ્ટમ',
              desc: 'ગુજરાતીમાં સરળ રીતે પરિવારની સંપૂર્ણ માહિતી ભરો અને સંગ્રહ કરો',
            },
            {
              icon: '⚡',
              title: 'ઝડપી ડેટા એન્ટ્રી',
              desc: 'બોલીને અથવા ટાઇપ કરીને તમામ કોલમમાં ઝડપથી માહિતી ઉમેરો',
            },
            {
              icon: '📊',
              title: 'Excel ડાઉનલોડ',
              desc: 'તમામ પરિવારની માહિતી એક ક્લિકમાં Excel ફાઇલમાં મેળવો',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card border border-border text-center space-y-3"
            >
              <span className="text-4xl">{item.icon}</span>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* INFO SECTION */}
      <section className="pb-20 container mx-auto px-4 text-center max-w-3xl">
        <p className="text-muted-foreground text-base leading-relaxed">
          આ સિસ્ટમ ખાસ કરીને પરિવારની માહિતી એકઠી કરવા માટે બનાવવામાં આવી છે.
          દરેક સભ્યની વિગતો, ફોટો અને અન્ય માહિતી સુરક્ષિત રીતે સંગ્રહિત થાય છે.
          તમે જ્યારે પણ ઇચ્છો ત્યારે માહિતી અપડેટ કરી શકો છો અને Excel માં ડાઉનલોડ કરી શકો છો.
        </p>
      </section>
    </main>

    <Footer />
  </div>
);

export default Index;
