const qrcode = require('qrcode');
const Table = require('../models/Table');

exports.generateQRCodes = async (req, res) => {
  const { adminId } = req.params;
  const { numberOfTables } = req.body;

  try {
    const tables = [];

    for (let i = 1; i <= numberOfTables; i++) {
      const tableLink = `http://localhost:5173/public-menu/${adminId}/table/${i}/menu`;
      const qrCodeUrl = await qrcode.toDataURL(tableLink);

      tables.push({
        adminId,
        number: i,
        qrCodeUrl,
      });
    }

    await Table.insertMany(tables);

    res.status(201).json({
      message: `${numberOfTables} QR Codes générés avec succès.`,
      tables,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la génération des QR codes.' });
  }
};