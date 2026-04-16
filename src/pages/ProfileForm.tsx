import { FamilyMember } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import MicButton from '@/components/MicButton';
import PhotoUpload from '@/components/PhotoUpload';
import { Plus, X } from 'lucide-react';

interface Props {
  members: FamilyMember[];
  onChange: (members: FamilyMember[]) => void;
}

const relationOptions = [
  'પિતા',
  'માતા',
  'ભાઈ',
  'બહેન',
  'પુત્ર',
  'દીકરી',
  'પતિ',
  'પત્ની',
  'દાદા',
  'દાદી',
  'કાકા',
  'કાકી',
  'અન્ય',
];

const createEmptyMember = (): FamilyMember => ({
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

  const updateMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addMember = () => {
    onChange([...members, createEmptyMember()]);
  };

  const removeMember = (index: number) => {
    const updated = members.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">👨‍👩‍👧 પરિવારના સભ્યો</h2>

      {members.map((member, index) => (
        <div key={member.id} className="border border-border rounded-xl p-4 space-y-4 relative">

          {/* REMOVE BUTTON */}
          <button
            onClick={() => removeMember(index)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
          >
            <X size={18} />
          </button>

          <h3 className="font-medium">સભ્ય {index + 1}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* NAME */}
            <div>
              <Label>નામ *</Label>
              <div className="flex gap-2">
                <Input
                  value={member.name}
                  onChange={(e) => updateMember(index, 'name', e.target.value)}
                />
                <MicButton title="નામ" onTranscript={(t) => updateMember(index, 'name', t)} />
              </div>
            </div>

            {/* RELATION */}
            <div>
              <Label>સંબંધ</Label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-background"
                value={member.relation}
                onChange={(e) => updateMember(index, 'relation', e.target.value)}
              >
                <option value="">પસંદ કરો</option>
                {relationOptions.map((rel, i) => (
                  <option key={i} value={rel}>{rel}</option>
                ))}
              </select>
            </div>

            {/* OCCUPATION */}
            <div>
              <Label>વ્યવસાય</Label>
              <div className="flex gap-2">
                <Input
                  value={member.occupation}
                  onChange={(e) => updateMember(index, 'occupation', e.target.value)}
                />
                <MicButton title="વ્યવસાય" onTranscript={(t) => updateMember(index, 'occupation', t)} />
              </div>
            </div>

            {/* EDUCATION */}
            <div>
              <Label>ભણતર</Label>
              <div className="flex gap-2">
                <Input
                  value={member.education}
                  onChange={(e) => updateMember(index, 'education', e.target.value)}
                />
                <MicButton title="ભણતર" onTranscript={(t) => updateMember(index, 'education', t)} />
              </div>
            </div>

            {/* MOBILE */}
            <div>
              <Label>મોબાઇલ</Label>
              <div className="flex gap-2">
                <Input
                  value={member.mobile}
                  onChange={(e) => updateMember(index, 'mobile', e.target.value)}
                />
                <MicButton title="મોબાઇલ" onTranscript={(t) => updateMember(index, 'mobile', t)} />
              </div>
            </div>

            {/* GENDER */}
            <div>
              <Label>લિંગ</Label>
              <select
                className="w-full border rounded-md px-3 py-2 bg-background"
                value={member.gender}
                onChange={(e) => updateMember(index, 'gender', e.target.value)}
              >
                <option value="પુરુષ">પુરુષ</option>
                <option value="સ્ત્રી">સ્ત્રી</option>
              </select>
            </div>

          </div>

          {/* PHOTO */}
          <PhotoUpload
            value={member.photo}
            onChange={(url) => updateMember(index, 'photo', url)}
            prefix={`members/${member.id}`}
            label="📷 સભ્યનો ફોટો"
          />

        </div>
      ))}

      {/* ADD BUTTON */}
      <Button onClick={addMember} variant="outline" className="w-full gap-2">
        <Plus size={16} />
        ➕ સભ્ય ઉમેરો
      </Button>

    </div>
  );
};

export default FamilyMemberForm;
