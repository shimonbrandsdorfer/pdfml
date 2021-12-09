<h1 align="center">
  <a href='https://github.com/nutrition-power/pdfml'>PDFML</a> - <em>PDF</em> Markdown Language
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
  - [Convert to JS Object]
  - [Get A Buffer]
  - [Serve with express.js]
- [Features](#features)
  - [Conditional Elements](#conditional-elements)
<!--te-->

## Installation


```sh
npm i pdfml --save
```


## Usage


## Features

### Conditional Elements

Use the attribute ```print-if``` and pass a boolean value to include this elements (and it's children or not)
