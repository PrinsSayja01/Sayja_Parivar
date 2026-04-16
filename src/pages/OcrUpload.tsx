import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';
import { loginByMobile } from '@/lib/api';

// 🔥 Convert ImageData → Canvas
const imageDataToCanvas = (imgData: ImageData) => {
  const canvas = document.createElement('canvas');
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imgData, 0, 0);
  return canvas;
};

// 🔥 Normalize Gujarati (robust)
const normalizeGujarati = (text: string) =>
  text
    .replace(/મોબાઈલ|મોબાઇલ નંબર/g, 'મોબાઇલ')
    .replace(/નંબર/g, '')
    .replace(/[-—]/g, ':')
    .replace(/\s+/g, ' ')
    .trim();

// 🔥 Extract field value
const extractField = (text: string, key: string) => {
  const regex = new RegExp(`${key}\\s*:?\\s*([^\\n]+)`);
  const match = text.match(regex);
  return match ? match[1].trim() : '';
};

// 🔥 Extract mobile safely
const extractMobile = (text: string) => {
  const match = text.match(/\d{10}/);
  return match ? match[0] : '';
};

// 🔥 OCR ENGINE (FINAL STABLE VERSION)
const runUltimateOCR = async (imageSrc: string) => {
  const Tesseract = await import('tesseract.js');

  const img = new Image();
  img.src = imageSrc;

  return new Promise<any>((resolve) => {
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      // 🔥 Preprocess (binary threshold)
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;

      for (let i = 0; i < d.length; i += 4) {
        const gray = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2];
        const val = gray > 140 ? 255 : 0;
        d[i] = d[i + 1] = d[i + 2] = val;
      }

      ctx.putImageData(imgData, 0, 0);

      const width = canvas.width;
      const height = canvas.height;

      // 🔥 Adaptive sections
      const mainArea = ctx.getImageData(0, height * 0.12, width, height * 0.30);
      const tableY = height * 0.45;
      const tableH = height * 0.50;

      // 🔥 OCR MAIN SECTION
      const mainResult = await Tesseract.recognize(
        imageDataToCanvas(mainArea),
        'guj+eng',
        { tessedit_pageseg_mode: 6 }
      );

      const mainText = normalizeGujarati(mainResult.data.text);

      // 🔥 TABLE PROCESSING
      const rows = 10;
      const cols = 5;

      const cellW = width / cols;
      const cellH = tableH / rows;

      const members: any[] = [];

      for (let r = 0; r < rows; r++) {
        let row: any = {};

        for (let c = 0; c < cols; c++) {
          const cell = ctx.getImageData(
            c * cellW,
            tableY + r * cellH,
            cellW,
            cellH
          );

          const res = await Tesseract.recognize(
            imageDataToCanvas(cell),
            'guj+eng',
            { tessedit_pageseg_mode: 6 }
          );

          const txt = normalizeGujarati(res.data.text);

          if (c === 0) row.relation = txt;
          if (c === 1) row.name = txt;
          if (c === 2) row.occupation = txt;
          if (c === 3) row.education = txt;
          if (c === 4) row.mobile = extractMobile(txt);
        }

        // 🔥 filter valid rows
        if (row.name && row.name.length > 1) {
          members.push(row);
        }
      }

      // 🔥 FINAL DATA
      resolve({
        name: extractField(mainText, 'નામ'),
        mobile: extractMobile(mainText),
        nativeVillage: extractField(mainText, 'મૂળ'),
        currentVillage: extractField(mainText, 'હાલ'),
        occupation: extractField(mainText, 'વ્યવસાય'),
        education: extractField(mainText, 'ભણતર'),
        address: extractField(mainText, 'એડ્રેસ'),
        members,
      });
    };
  });
};

const OcrUpload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [parsed, setParsed] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setCurrentUser } = useAppStore();

  const handleUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const runOcr = async () => {
    if (!image) return;

    setLoading(true);
    setProgress(10);

    try {
      const data = await runUltimateOCR(image);
      setParsed(data);
      setProgress(100);

      toast({
        title: 'સફળતા',
        description: 'ડેટા સચોટ રીતે મળ્યો!',
      });
    } catch (err: any) {
      toast({
        title: 'ભૂલ',
        description: err.message || 'OCR ફેઇલ',
        variant: 'destructive',
      });
    }

    setLoading(false);
  };

  const useExtracted = async () => {
    if (!parsed?.mobile) {
      toast({
        title: 'ભૂલ',
        description: 'મોબાઇલ મળ્યો નથી',
        variant: 'destructive',
      });
      return;
    }

    const profile = await loginByMobile(parsed.mobile);

    const merged = {
      ...profile,
      ...parsed,
      members: parsed.members.map((m: any) => ({
        ...m,
        id: crypto.randomUUID(),
      })),
    };

    setCurrentUser(merged);
    navigate('/profile', { state: { prefilled: merged } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto space-y-6">

          <Input type="file" accept="image/*" onChange={handleUpload} />

          {image && (
            <>
              <img src={image} className="rounded-lg border" />
              <Button onClick={runOcr} disabled={loading}>
                {loading ? 'Processing...' : 'OCR ચલાવો'}
              </Button>
              <Progress value={progress} />
            </>
          )}

          {parsed && (
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <p><b>નામ:</b> {parsed.name}</p>
              <p><b>મોબાઇલ:</b> {parsed.mobile}</p>
              <p><b>સભ્યો:</b> {parsed.members.length}</p>

              <Button onClick={useExtracted}>
                આગળ વધો
              </Button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OcrUpload;
