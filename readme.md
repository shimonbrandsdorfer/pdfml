<h1 align="center">
  <a href='https://github.com/nutrition-power/pdfml'>PDFML</a> - <em>PDF</em>  Markup Language
</h1>

<p align="center">
  Write dynamic PDF files using a markup language similar to HTML, Using the EJS rendering engine.
<p>

<p align="center">
  This project is built using <a href='http://pdfmake.org/#/'>pdfmake</a> and <a href='https://ejs.co/'>ejs</a>
<p>


## Table of Contents

<!--ts-->
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
  - [EJS file](#ejs-file)
  - [Convert to DocDefinition Object](#convert-to-docdefinition-object)
  - [Get A Buffer](#get-a-buffer)
  - [Serve with express.js](#serve-with-express.js)
  - [Use Templates](#use-templates)
- [Elements](#elements)
  - [PDFML](#pdfml)
  - [p](#p)
  - [div](#div)
  - [columns](#columns)
  - [Table](#table)
  - [Br](#br)
  - [Image](#image)
  - [hr](#hr)
- [Features](#features)
  - [Conditional Elements](#conditional-elements)
- [Fonts](#Fonts)
<!--te-->

## Installation


```sh
npm i pdfml --save
```


## Usage
```js
const pdfml = require('pdfml');
pdfml.render({
  path : PATH_TO_FILE_NAME
  data : RENDER_DATA
});
```

### EJS file
 Create an ejs file, for example:
 ```
 <pdfml page-margins="25 140 24 30" page-size="LETTER">

    <head>
        <styles>
            <npStyle font-size="50" bold="true"></npStyle>
            <hdStyle font-size="14" color="red"></hdStyle>
            <hpStyle font-size="14" color="red"></hpStyle>
        </styles>
        <header>Header</header>
        <footer>
        </footer>
    </head>

    <body>
        <text style="npStyle"><%= text %></text>
    </body>
</pdfml>
 ```


### Convert to DocDefinition Object
```js
const pdfml = require('pdfml');
let dd = pdfml.getDD(STRING_OR_PATH_TO_FILE, RENDER_DATA, OPTIONS);
```

### Get A Buffer
```js
const pdfml = require('pdfml');
let buffer = await pdfml.generatePDF(docDefinition, OPTIONS);
```

### Serve with express.js
```js
const pdfml = require('pdfml');

///in your express router
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
    res.attachment("PDF_FILE.pdf"); // remove this if you want to open the pdf in the browser
    res.send(doc);
  } catch (err) {
    next(err);
  }
});
```
### Use Templates
Synce this is powered by ejs, you can use the include function and setup multiple templates.
This is very useful when you have generic parts of your document that you want to reuse.

Consider the following file structure:

- templates/
    - header.pdfml
    - footer.pdfml
- main.pdfml


You can then use the include function to include the header and footer in your main file:
```xml
<%- include('./templates/header.pdfml') %>
<body>
  <text>Main Content</text>
</body>
<%- include('./templates/footer.pdfml') %>
```

## Elements

### PDFML

PDFML is the root element for the PDF document, and there is where you define all <a href="https://pdfmake.github.io/docs/0.1/document-definition-object/page/">document-level</a> Settings.


Using the attributes of the ```<pdfml>``` element ([see example](#pdfml-attributes-example)) you can define document level settings, such as page size, orientation, margins, etc.

#### PDFML Attributes Example
```xml
<pdfml page-size="LETTER" page-orientation="landscape" page-margins="25 140 24 30">
</pdfml>
```


### p
(or text)
A ```p``` element is for displaying a paragraph of text.

```xml
<p>This is plain text</p>
```

### div
(also known as ```stack```)
A ```div``` will keep the inner elements together, the inner elemets will be diplayed in block mode.

```xml
<div>
    <text>This is one block of text</text>
    <text>This is another block of text</text>
</div>
```

### columns
```columns``` will keep the inner elements together, the inner elemets will be diplayed inline mode.

```xml
<columns>
  <text>This is one block of text</text>
    <text>This is another block of text</text>
</columns>
```
### table

For tables use the the following elements (body, row, cell):

Note: The table will be rendered in a single page, if you want to break the table in multiple pages use the ```dont-break-rows="true"``` attribute.

Note: PDFML is resilent to a mismatched number of columns in each row, it will fill the missing columns with empty cells.

```xml
<table header-rows="1" widths="95 95 95 95 95 95 95 " heights="12 50 50 50 50 50 50" dont-break-rows="true">
    <tbody>
        <% rows.forEach((row, rIdx) => { %>          
          <tr>
            <% row.forEach((clm, cIdx) => { %>
                <td fill-color="<%= rIdx ? '' : '#e5e5e5' %>">
                    <text font-size="8" bold="true"> <%= clm %> </text>
                </td> 
            <% }) %>
        </tr>
      <%  }) %>
  </tbody>
</table>
```


## Br
Just to break a line
```xml
<br/>
```

## Image
```xml
<img src="<%= image_data %>" width="100" height="100" fit="100 100"/>
```

## hr
```xml
<hr/>
```

## Features

### Conditional Elements

Use the attribute ```print-if``` and pass a boolean value to include this elements (and it's children or not).

Note - that the inner content is still rendered with ejs, so the variables need to be defined.

## Fonts

Supported fonts are:
- Avenir
- Geo
- Roboto
