# The preamble of a document

Everything in your **`.tex`** file before  `\begin{document}` is called the **preamble**. In the preamble you define the type of document you are writing, the language you are writing in, the _packages_ you would like to use (more on this later) and several other elements. For instance, a normal document preamble would look like this:

```latex
\documentclass[12pt, letterpaper]{article}
\usepackage[utf8]{inputenc}
```

`\documentclass[12pt, letterpaper]{article}`
this defines the type of document. Some additional parameters included in the square brackets can be passed to the command. These parameters must be comma-separated. In the example, the extra parameters set the font size (**`12pt`**) and the paper size (**`letterpaper`**). Of course other font sizes (**`9pt`**, **`11pt`**, **`12pt`**) can be used, but if none is specified, the default size is **`10pt`**. As for the paper size other possible values are **`a4paper`** and **`legalpaper`**; see the article about [Page size and margins](https://www.overleaf.com/learn/latex/Page_size_and_margins "Page size and margins") for more details about this.

# Adding a title, author and date

To add a title, author and date to our document, you must add three lines to the **preamble** (NOT the main body of the document). These lines are

`\title{First document}`

This is the title.

`\author{Hubert Farnsworth}`

Here you put the name of the Author(s) and, as an optional addition, you can add the next command within the curly braces:

`\thanks{funded by the Overleaf team}`

This can be added after the name of the author, inside the braces of the **`author`** command. It will add a superscript and a footnote with the text inside the braces. Useful if you need to thank an institution in your article.

`\date{February 2014}`

You can enter the date manually or use the command **`\today`** so the date will be updated automatically at the time you compile your document

With these lines added, your preamble should look something like this

and  to show these information, we do `\maketitle` in our `document` area

# Adding comments

```latex
% this is a comment
```

# Bold, italics and underlining

-   **Bold**: Bold text in LaTeX is written with the **`\textbf{...}`** command.
-   _Italics_: Italicised text in LaTeX is written with the **`\textit{...}`** command.
-   Underline: Underlined text in LaTeX is written with the **`\underline{...}`** command.
