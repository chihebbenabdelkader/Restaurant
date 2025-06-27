const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateMenuPdf = async (req, res) => {
  const { adminId } = req.params;

  // Example data – fetch real categories/products from DB
  const categories = await Category.find({ adminId }).populate("products");

  const doc = new PDFDocument();
  const pdfPath = path.join(__dirname, `../../public/menus/menu-${adminId}.pdf`);
  doc.pipe(fs.createWriteStream(pdfPath));

  doc.fontSize(20).text("Menu", { align: "center" });
  doc.moveDown();

  categories.forEach((category) => {
    doc.fontSize(16).text(category.name);
    category.products.forEach((product) => {
      doc.fontSize(12).text(`- ${product.name}: ${product.price} DT`);
    });
    doc.moveDown();
  });

  doc.end();

  res.status(200).json({ message: "PDF generated", url: `/menus/menu-${adminId}.pdf` });
};
