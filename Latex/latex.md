## The preamble of a document

Everything in your **`.tex`** file before  `\begin{document}` is called the **preamble**. In the preamble you define the type of document you are writing, the language you are writing in, the _packages_ you would like to use (more on this later) and several other elements. For instance, a normal document preamble would look like this:

```latex
\documentclass[12pt, letterpaper]{article}
\usepackage[utf8]{inputenc}
```

`\documentclass[12pt, letterpaper]{article}`
this defines the type of document. Some additional parameters included in the square brackets can be passed to the command. These parameters must be comma-separated. In the example, the extra parameters set the font size (**`12pt`**) and the paper size (**`letterpaper`**). Of course other font sizes (**`9pt`**, **`11pt`**, **`12pt`**) can be used, but if none is specified, the default size is **`10pt`**. As for the paper size other possible values are **`a4paper`** and **`legalpaper`**; see the article about [Page size and margins](https://www.overleaf.com/learn/latex/Page_size_and_margins "Page size and margins") for more details about this.

## Adding a title, author and date

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

## Adding comments

```latex
% this is a comment
```

## Bold, italics and underlining

-   **Bold**: Bold text in LaTeX is written with the **`\textbf{...}`** command.
-   _Italics_: Italicised text in LaTeX is written with the **`\textit{...}`** command.
-   Underline: Underlined text in LaTeX is written with the **`\underline{...}`** command.

## Graphics & Images


to add graphics you need to add the package `graphicx` and specify the path to the images. For example: 

```latex
\documentclass{article}
\usepackage{graphicx}
\graphicspath{ {images/} }

\begin{document}
\includegraphics{universe}
\end{document}
```

It's better to put it within a figure 

```latex

\begin{figure}[h]
    \centering
    \includegraphics[width=0.25\textwidth]{mesh}
    \caption{a nice plot}
    \label{fig:mesh1}
\end{figure}

As you can see in the figure \ref{fig:mesh1}, the 
function grows near 0. Also, in the page \pageref{fig:mesh1} 
is the same example.
```


`\caption{a nice plot}` : caption of the figure
`\label{fig:mesh1}` : this will number each figure , used to reference it later on.
`\ref{fig:mesh1}` : represents the number corresponding to the figure with the label `mesh1`

`[width=0.25\textwidth]` : will give our figure 1/4 size of standard text in our document. This is useful to make our image fit properly with our document.

When placing images in a LaTeX document, we should always put them inside a **figure** environment or similar so that LaTeX will position the image in a way that fits in with the rest of your text. 

## Lists

### Unordered Lists

```
\begin{itemize}
  \item The individual entries are indicated with a black dot, a so-called bullet.
  \item The text in the entries may be of any length.
\end{itemize}
```

### Ordered Lists

```
\begin{enumerate}
  \item This is the first entry in our list
  \item The list numbers increase with each entry we add
\end{enumerate}
```

## Adding Math to Latex

Two writing modes for mathematical expressions : **inline** and **display** mode

### Inline Mode

```latex
In physics, the mass-energy equivalence is stated by the equation $E=mc^2$, discovered in 1905 by Albert Einstein.
```

This will print the math *inline* with the rest of the content. 3 Methods to write inline math: 

- `\(` `\)`
- `$` `$`
- `\begin{math}` `\end{math}`


### Display Mode

The equation will be printed centered on a new line. Two version : **numbered** and **unnumbered** 

```latex
% Unnumbered
\[ E=mc^2 \]

% Numbered
\begin{equation}
E=mc^2
\end{equation}
```

3 methods to type display math : 
- `\[` `\]` : unnumbered (method 1)
- `\begin{displaymath}` `\end{displaymath` : unnumbered (method 2)
- `\begin{equation}` `\end{equation}` : numbered 


Many math mode commands require the package **amsmath**. So be sure to include it when writing math.





