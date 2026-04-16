import { useEffect, useState } from 'react';
import { saveProfile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import FamilyMemberForm from '@/components/FamilyMemberForm';
import { toast } from '@/hooks/use-toast';

const ProfileForm = () => {
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await saveProfile(form);

      // IMPORTANT
      setForm({
        ...res.data,
        pdf: res.pdf
      });

      // 🔥 AUTO DOWNLOAD
      if (res.pdf) {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${res.pdf}`;
        link.download = `Sayja_${res.data.family_code || res.data.mobile}.pdf`;
        link.click();
      }

      toast({ title: 'સફળતા', description: 'PDF ડાઉનલોડ થઈ ગઈ છે' });

    } catch {
      toast({ title: 'ભૂલ', description: 'સેવ ફેઇલ', variant: 'destructive' });
    }

    setSaving(false);
  };

  return (
    <div>

      <FamilyMemberForm
        members={form?.members || []}
        onChange={(members) => setForm({ ...form, members })}
      />

      <Button onClick={handleSave}>
        💾 સેવ કરો
      </Button>

      {/* MANUAL DOWNLOAD */}
      {form?.pdf && (
        <Button
          onClick={() => {
            const link = document.createElement('a');
            link.href = `data:application/pdf;base64,${form.pdf}`;
            link.download = 'family.pdf';
            link.click();
          }}
        >
          📄 PDF ડાઉનલોડ કરો
        </Button>
      )}

    </div>
  );
};

export default ProfileForm;
