import { useEffect } from 'react';
import { FamilyMember } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import PhotoUpload from './PhotoUpload';
import MicButton from './MicButton';
import { RELATION_OPTIONS, normalizeRelation } from '@/lib/relations';
import { toast } from '@/hooks/use-toast';

interface Props {
  members: FamilyMember[];
  onChange: (members: FamilyMember[]) => void;
}

const emptyMember = (): FamilyMember => ({
  id: crypto.randomUUID(),
  name: '',
  relation: '',
  occupation: '',
  education: '',
  mobile: '',
  gender: 'પુરુષ',
  photo: '',
});

const FamilyMemberForm = ({ members, onChange }: Props) => {

  // auto add first member
  useEffect(() => {
    if (members.length === 0) {
      onChange([emptyMember()]);
    }
  }, []);

  const update = (id: string, field: keyof FamilyMember, value: string) => {
    onChange(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addMember = () => onChange([...members, emptyMember()]);

  const removeMember = (id: string) => {
    if (members.length === 1) {
      toast({ title: 'ભૂલ', description: 'ઓછામાં ઓછો એક સભ્ય જરૂરી છે', variant: 'destructive' });
      return;
    }
    onChange(members.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-5">

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">👨‍👩‍👧 પરિવારના સભ્યો</h3>
        <Button onClick={addMember} size="sm">➕ સભ્ય ઉમેરો</Button>
      </div>

      <AnimatePresence>
        {members.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border rounded-xl p-4 space-y-4"
          >

            <div className="flex justify-between">
              <span>સભ્ય {i + 1}</span>
              <Button variant="ghost" onClick={() => removeMember(m.id)}>✕</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div>
                <Label>નામ *</Label>
                <div className="flex gap-2">
                  <Input value={m.name} onChange={e => update(m.id, 'name', e.target.value)} />
                  <MicButton onTranscript={(t) => update(m.id, 'name', t)} />
                </div>
              </div>

              <div>
                <Label>સંબંધ</Label>
                <Select value={m.relation} onValueChange={v => update(m.id, 'relation', v)}>
                  <SelectTrigger><SelectValue placeholder="પસંદ કરો" /></SelectTrigger>
                  <SelectContent>
                    {RELATION_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>વ્યવસાય</Label>
                <Input value={m.occupation} onChange={e => update(m.id, 'occupation', e.target.value)} />
              </div>

              <div>
                <Label>ભણતર</Label>
                <Input value={m.education} onChange={e => update(m.id, 'education', e.target.value)} />
              </div>

              <div>
                <Label>મોબાઇલ</Label>
                <Input value={m.mobile} onChange={e => update(m.id, 'mobile', e.target.value)} />
              </div>

              <div>
                <Label>લિંગ</Label>
                <Select value={m.gender} onValueChange={v => update(m.id, 'gender', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="પુરુષ">પુરુષ</SelectItem>
                    <SelectItem value="સ્ત્રી">સ્ત્રી</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <PhotoUpload
              value={m.photo}
              onChange={(url) => update(m.id, 'photo', url)}
              prefix={`members/${m.id}`}
            />

          </motion.div>
        ))}
      </AnimatePresence>

    </div>
  );
};

export default FamilyMemberForm;
