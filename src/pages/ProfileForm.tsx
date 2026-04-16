import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import Family from '../models/familyModel.js';


// =======================
// ✅ SAVE PROFILE + PDF
// =======================
export const saveProfile = async (req, res) => {
  try {
    const data = req.body;

    let existing = await Family.findOne({ mobile: data.mobile });

    if (existing) {
      existing = await Family.findOneAndUpdate(
        { mobile: data.mobile },
        data,
        { new: true }
      );
    } else {
      existing = await Family.create(data);
    }

    const pdfBuffer = await generatePDF(existing);

    res.status(200).json({
      message: 'Thanks for registration Sayja Parivar',
      data: existing,
      pdf: pdfBuffer.toString('base64'),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Save failed' });
  }
};


// =======================
// ✅ EXCEL EXPORT (WITH FAMILY CODE)
// =======================
export const exportExcel = async (req, res) => {
  try {
    const families = await Family.find();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Family Data');

    sheet.columns = [
      { header: 'Family No', key: 'familyCode', width: 12 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Mobile', key: 'mobile', width: 15 },
      { header: 'Village', key: 'village', width: 20 },

      { header: 'Member Name', key: 'memberName', width: 20 },
      { header: 'Relation', key: 'relation', width: 15 },
      { header: 'Member Mobile', key: 'memberMobile', width: 15 },
    ];

    families.forEach(f => {
      const code = f.family_code || '';

      if (f.members?.length) {
        f.members.forEach(m => {
          sheet.addRow({
            familyCode: code,
            name: f.name,
            mobile: f.mobile,
            village: f.nativeVillage,
            memberName: m.name,
            relation: m.relation,
            memberMobile: m.mobile,
          });
        });
      } else {
        sheet.addRow({
          familyCode: code,
          name: f.name,
          mobile: f.mobile,
        });
      }
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=Sayja_Data.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({ message: 'Excel error' });
  }
};


// =======================
// ✅ PDF (BOX STYLE + FAMILY NUMBER)
// =======================
const generatePDF = async (family) => {
  return new Promise(async (resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    // HEADER
    doc.fontSize(22).text('Sayja Parivar', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text('પરિવાર ની સંપૂર્ણ વિગત', { align: 'center' });

    doc.moveDown();

    // FAMILY NUMBER
    doc.fontSize(14).text(`પરિવાર નંબર: ${family.family_code || '-'}`);
    doc.moveDown();

    // BOX FUNCTION
    const drawBox = (label, value) => {
      doc
        .rect(doc.x, doc.y, 250, 25)
        .stroke()
        .fontSize(10)
        .text(`${label}: ${value || '-'}`, doc.x + 5, doc.y + 7);
      doc.moveDown();
    };

    // MAIN DATA BOXES
    drawBox('નામ', family.name);
    drawBox('મોબાઇલ', family.mobile);
    drawBox('ગામ', family.nativeVillage);
    drawBox('સરનામું', family.address);

    doc.moveDown();

    // PHOTO
    if (family.profilePhoto) {
      try {
        const img = await axios.get(family.profilePhoto, { responseType: 'arraybuffer' });
        doc.image(img.data, { width: 100 });
      } catch {}
    }

    doc.moveDown();

    // MEMBERS
    doc.fontSize(16).text('સભ્યોની વિગત');
    doc.moveDown();

    family.members.forEach((m, i) => {
      doc.fontSize(12).text(`સભ્ય ${i + 1}`);

      drawBox('નામ', m.name);
      drawBox('સંબંધ', m.relation);
      drawBox('મોબાઇલ', m.mobile);

      if (m.photo) {
        try {
          const img = await axios.get(m.photo, { responseType: 'arraybuffer' });
          doc.image(img.data, { width: 80 });
        } catch {}
      }

      doc.moveDown();
    });

    // FOOTER
    doc.moveDown(2);
    doc.fontSize(14).text('Thanks for registration Sayja Parivar', {
      align: 'center',
    });

    doc.end();
  });
};
