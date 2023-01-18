const express = require("express");
const pdfml = require("../index");
const Path = require("path");
const app = express();


const PORT = 3000;

app.get("/:filename", async (req, res, next) => {
  try {
    //you can query some data here
    let doc = await pdfml.render({
      path: Path.join(__dirname, req.params.filename), //path to your ejs file
      data: {}, // data for context in your ejs file,
      fonts: {}, //if you want to supply fonts
    });
    //set the content type to pdf
    res.setHeader("Content-type", "application/pdf");
    //set the attachment header
    //res.attachment("PDF_FILE.pdf");
    res.send(doc);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
