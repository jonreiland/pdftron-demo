// Importing PDFTron's PDFNet module
const { PDFNet } = require("@pdftron/pdfnet-node");
// Importing prompt for making a CLI
const prompt = require("prompt");

// Defining global variable to hold the file path of the PDF
let pdfPath = "";

// Define function to add a blank page to the end of the PDF
const addPageToEnd = async () => {
  try {
    const doc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
    let page = await doc.pageCreate();
    doc.pagePushBack(page);
    doc.save(pdfPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  } catch (err) {
    console.log(err);
  }
};

// Define function to add a bookmark to the root of the PDF
const addBookmarkToRoot = async () => {
  try {
    const doc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
    const myBookmark = await PDFNet.Bookmark.create(doc, "My Bookmark");
    doc.addRootBookmark(myBookmark);
    doc.save(pdfPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  } catch (err) {
    console.log(err);
  }
};

// Define function to add a highlight annotation to first page of the PDF
const addHighlightAnnotation = async () => {
  try {
    const doc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
    const page = await doc.getPage(1);

    const hl = await PDFNet.HighlightAnnot.create(
      doc,
      new PDFNet.Rect(100, 490, 150, 515)
    );
    hl.setColor(await PDFNet.ColorPt.init(0, 1, 0), 3);
    hl.refreshAppearance();
    page.annotPushBack(hl);
    doc.save(pdfPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  } catch (err) {
    console.log(err);
  }
};

// Starting CLI
prompt.start();

prompt.get(["_pdfPath", "_method"], (err, result) => {
  // Catch errors
  if (err) {
    return onErr(err);
  }

  // Set global PDF Path variable
  pdfPath = result._pdfPath;

  // Execute add blank page to end function based on user's input
  if (result._method == "addPageToEnd") {
    PDFNet.runWithCleanup(addPageToEnd, 0).then(() => {
      PDFNet.shutdown();
    });
  }

  // Execute add bookmark to root function based on user's input
  if (result._method == "addBookmarkToRoot") {
    PDFNet.runWithCleanup(addBookmarkToRoot, 0).then(() => {
      PDFNet.shutdown();
    });
  }

  // Execute add highlight annotation function based on user's input
  if (result._method == "addHighlightAnnotation") {
    PDFNet.runWithCleanup(addHighlightAnnotation, 0).then(() => {
      PDFNet.shutdown();
    });
  }
});

function onErr(err) {
  console.log(err);
  return 1;
}
