import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore, FamilyProfile } from '@/lib/store';
import { saveProfile } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FamilyMemberForm from '@/components/FamilyMemberForm';
import PhotoUpload from '@/components/PhotoUpload';
import MicButton from '@/components/MicButton';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ProfileForm = () => {
  const { currentUser, setCurrentUser } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<FamilyProfile | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const prefilled = (location.state as any)?.prefilled;
    setForm({ ...currentUser, ...(prefilled || {}) });
  }, [currentUser, navigate, location.state]);

  if (!form) return null;

  const update = (field: keyof FamilyProfile, value: string | number) => {
    setForm(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: 'ભૂલ', description: 'કૃપા કરી નામ દાખલ કરો', variant: 'destructive' });
      return;
    }

    if (!form.mobile.trim()) {
      toast({ title: 'ભૂલ', description: 'મોબાઇલ નંબર જરૂરી છે', variant: 'destructive' });
      return;
    }

    const cleanedMembers = form.members.filter(m =>
      m.name.trim() || m.relation.trim() || m.mobile.trim()
    );

    const invalidMember = cleanedMembers.find(m => !m.name.trim());

    if (invalidMember) {
      toast({ title: 'ભૂલ', description: 'દરેક સભ્યનું નામ જરૂરી છે', variant: 'destructive' });
      return;
    }

    setSaving(true);

    try {
      const res = await saveProfile({ ...form, members: cleanedMembers });

      setCurrentUser(res.data);
      setForm(res.data);

      // ✅ PDF DOWNLOAD
      if (res.pdf) {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${res.pdf}`;
        link.download = `Sayja_Parivar_${res.data.mobile}.pdf`;
        link.click();
      }

      toast({
        title: 'સફળતા',
        description: 'માહિતી સેવ થઈ ગઈ છે અને PDF ડાઉનલોડ થઈ ગઈ છે',
      });

    } catch (err: any) {
      toast({
        title: 'ભૂલ',
        description: err.message || 'માહિતી સેવ કરવામાં સમસ્યા આવી',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-card rounded-2xl shadow-card border border-border p-6 sm:p-8 space-y-6"
        >
          {/* HEADER */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">🧾 પરિવાર માહિતી ફોર્મ</h1>

            <p className="text-sm text-muted-foreground">
              તમારા પરિવારની તમામ માહિતી અહીં ભરો. માહિતી સેવ કર્યા પછી તમને PDF મળશે.
            </p>
          </div>

          {/* PROFILE PHOTO */}
          <PhotoUpload
            value={form.profilePhoto}
            onChange={url => update('profilePhoto', url)}
            prefix={`profiles/${form.id}`}
            size="lg"
            label="📷 પ્રોફાઇલ ફોટો"
          />

          {/* FORM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <Label>નામ *</Label>
              <div className="flex gap-2">
                <Input value={form.name} onChange={e => update('name', e.target.value)} />
                <MicButton title="નામ" onTranscript={(t) => update('name', t)} />
              </div>
            </div>

            <div>
              <Label>મોબાઇલ નંબર</Label>
              <Input value={form.mobile} disabled className="bg-muted" />
            </div>

            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={e => update('email', e.target.value)} />
            </div>

            <div>
              <Label>મૂળ ગામ</Label>
              <Input value={form.nativeVillage} onChange={e => update('nativeVillage', e.target.value)} />
            </div>

            <div>
              <Label>હાલ ગામ</Label>
              <Input value={form.currentVillage} onChange={e => update('currentVillage', e.target.value)} />
            </div>

            <div>
              <Label>વ્યવસાય</Label>
              <Input value={form.occupation} onChange={e => update('occupation', e.target.value)} />
            </div>

            <div>
              <Label>ભણતર</Label>
              <Input value={form.education} onChange={e => update('education', e.target.value)} />
            </div>

            <div>
              <Label>કુલ સભ્ય</Label>
              <Input
                type="number"
                value={form.totalMembers}
                onChange={e => update('totalMembers', parseInt(e.target.value) || 1)}
              />
            </div>

          </div>

          {/* ADDRESS */}
          <Textarea
            value={form.address}
            onChange={e => update('address', e.target.value)}
            placeholder="સરનામું"
          />

          {/* MEMBERS */}
          <FamilyMemberForm
            members={form.members}
            onChange={members => setForm(prev => prev ? { ...prev, members } : prev)}
          />

          {/* SAVE */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full text-lg py-6"
          >
            {saving ? <Loader2 className="animate-spin" /> : '💾 માહિતી સાચવો'}
          </Button>

        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileForm;
