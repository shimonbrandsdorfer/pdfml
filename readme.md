<h1 align="center">
  <a href='https://github.com/nutrition-power/pdfml'>PDFML</a> - <em>PDF</em>  Markdown Language
</h1>

<p align="center">
  Write dynamic PDF files using a markdown language similar to HTML, Using the EJS rendering engine.
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
  - [Convert to JS Object]
  - [Get A Buffer]
  - [Serve with express.js](#serve-with-express.js)
- [Elements](#elements)
  - [PDFML](#pdfml)
  - [TEXT](#TEXT)
  - [Table](#table)
  - [Br](#br)
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
```

### EJS file
 Create an ejs file, for example:
 ```
 <pdfml page-margins="[ 25, 140, 24, 30 ]">

    <head>
        <styles>
            <npStyle font-size="50" bold="true"></npStyle>
            <hdStyle font-size="14" color="red"></hdStyle>
            <hpStyle font-size="14" color="red"></hpStyle>
        </styles>
        <values page-size="LETTER"></values>
        <header>Header</header>
        <footer>
        </footer>
    </head>

    <body>
        <text style="npStyle"><%= text %></text>
    </body>
</pdfml>
 ```

### Serve with express.js
```js
const pdfml = require('pdfml');

///in your express router
router.get('/pdf', async (res, res, next) => {

  try{
    
    //you can query some data here
    let doc = await pdfml.render({
      path : '', //path to your ejs file
      data : {} ,// data for context in your ejs file,
      fonts : {} //if you want to supply fonts
    });
    res.setHeader("Content-type", "application/pdf");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.attachment("PDF_FILE.pdf");
    res.send(doc);

  } catch (err) {
     next(err);
  }
})
```


## Elements

### PDFML

PDFML is the root element for the PDF document, and there is where you define all <a href="https://pdfmake.github.io/docs/0.1/document-definition-object/page/">document-level</a> Settings.


### text

```<text>This is plain text</text>```


### table

For tables use the the following elements (body, row, cell):

```xml
<table header-rows="1" widths="[95,95,95,95,95,95,95]" heights="[12,50,50,50,50,50,50]" dont-break-rows="true">
    <body>
        <% rows.forEach((row, rIdx) => { %>          
          <row>
            <% row.forEach((clm, cIdx) => { %>
                <cell fill-color="<%= rIdx ? '' : '#e5e5e5' %>">
                    <text font-size="8" bold="true"> <%= clm %> </text>
                </cell> 
            <% }) %>
        </row>
      <%  }) %>
  </body>
</table>
```


## Br
Just to break a line (Note, you cannot use it as a self-closing tag)
```xml
<br></br>
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