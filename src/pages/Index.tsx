import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <Header />

    <main className="flex-1">
      {/* HERO */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 gradient-warm opacity-50" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-4xl sm:text-6xl font-bold">
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
              પરિવાર ની સંપૂર્ણ માહિતી સરળ રીતે સંગ્રહ કરો
            </p>

            <p className="text-muted-foreground text-base">
              આ સિસ્ટમમાં તમે તમારા પરિવારના તમામ સભ્યોની માહિતી એક જગ્યાએ ભરી શકો છો.
              એક વાર માહિતી સેવ કર્યા પછી તે સુરક્ષિત રીતે સેવ થઈ જાય છે અને પછી તમે તેને ફરી જોઈ અથવા સુધારી શકો છો.
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {[
            {
              icon: '📝',
              title: 'સરળ માહિતી દાખલ કરો',
              desc: 'ગુજરાતીમાં સરળ રીતે તમામ વિગતો ભરો',
            },
            {
              icon: '💾',
              title: 'ડેટા સુરક્ષિત રીતે સેવ થાય',
              desc: 'તમારી માહિતી એક વાર સેવ કર્યા પછી સુરક્ષિત રીતે સ્ટોર થાય છે',
            },
            {
              icon: '✏️',
              title: 'માહિતી સુધારો',
              desc: 'તમે કોઈપણ સમયે તમારી માહિતીમાં ફેરફાર કરી શકો છો',
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

      {/* INFO */}
      <section className="pb-20 container mx-auto px-4 text-center max-w-3xl">
        <p className="text-muted-foreground text-base leading-relaxed">
          આ પ્લેટફોર્મ પરિવારની માહિતી એકઠી કરવા માટે બનાવવામાં આવ્યું છે.
          દરેક સભ્યની માહિતી સરળ રીતે ભરી શકાય છે અને તે સુરક્ષિત રીતે સંગ્રહિત થાય છે.
          તમે પછી કોઈપણ સમયે આવી માહિતી ફરી જોઈ શકો છો અને તેમાં ફેરફાર કરી શકો છો.
        </p>
      </section>
    </main>

    <Footer />
  </div>
);

export default Index;
