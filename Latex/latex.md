## Basics 
### The preamble of a document

Everything in your **`.tex`** file before  `\begin{document}` is called the **preamble**. In the preamble you define the type of document you are writing, the language you are writing in, the _packages_ you would like to use (more on this later) and several other elements. For instance, a normal document preamble would look like this:

```latex
\documentclass[12pt, letterpaper]{article}
\usepackage[utf8]{inputenc}
```

`\documentclass[12pt, letterpaper]{article}`
this defines the type of document. Some additional parameters included in the square brackets can be passed to the command. These parameters must be comma-separated. In the example, the extra parameters set the font size (**`12pt`**) and the paper size (**`letterpaper`**). Of course other font sizes (**`9pt`**, **`11pt`**, **`12pt`**) can be used, but if none is specified, the default size is **`10pt`**. As for the paper size other possible values are **`a4paper`** and **`legalpaper`**; see the article about [Page size and margins](https://www.overleaf.com/learn/latex/Page_size_and_margins "Page size and margins") for more details about this.

### Adding a title, author and date

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

### Adding comments

```latex
% this is a comment
```

### Bold, italics and underlining

-   **Bold**: Bold text in LaTeX is written with the **`\textbf{...}`** command.
-   _Italics_: Italicised text in LaTeX is written with the **`\textit{...}`** command.
-   Underline: Underlined text in LaTeX is written with the **`\underline{...}`** command.

### Graphics & Images


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

### Lists

#### Unordered Lists

```
\begin{itemize}
  \item The individual entries are indicated with a black dot, a so-called bullet.
  \item The text in the entries may be of any length.
\end{itemize}
```

#### Ordered Lists

```
\begin{enumerate}
  \item This is the first entry in our list
  \item The list numbers increase with each entry we add
\end{enumerate}
```

### Adding Math to Latex

Two writing modes for mathematical expressions : **inline** and **display** mode

#### Inline Mode

```latex
In physics, the mass-energy equivalence is stated by the equation $E=mc^2$, discovered in 1905 by Albert Einstein.
```

This will print the math *inline* with the rest of the content. 3 Methods to write inline math: 

- `\(` `\)`
- `$` `$`
- `\begin{math}` `\end{math}`


#### Display Mode

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


## Basic Formatting

### Abstracts

In scientific documents it's a common practice to include a brief overview of the main subject of the paper. In LaTeX there's the abstract environment for this. The abstract environment will put the text in a special format at the top of your document.

```latex
\begin{document}

\begin{abstract}
A brief introduction about the main subject.
\end{abstract}
\end{document}
```


### Paragraphs and newlines

To start a new paragraph we simply insert an **empty line** between the two paragraphs.

```latex
\begin{document}
This is the first Paragraph.

This line will start a second Paragraph.
```

Note that both paragprahs will have *identation* at the start. To addA new line without starting a new paragraph, we use `\\` or `\newline`


**Note** : `\\` and `\newline` should **not** be used to stimulate the creation of paragraphs with large space between them. The recommended method to do so is to keep using double blank lines to create new paragraphs without any \\, and then add \usepackage{parskip} to the preamble.

### Chapters and sections 

```latex
\chapter{First Chapter}

\section{Introduction}

This is the first section.

Lorem  ipsum  dolor  sit  amet,  consectetuer  adipiscing  
elit.   Etiam  lobortisfacilisis sem.  Nullam nec mi et 
neque pharetra sollicitudin.  Praesent imperdietmi nec ante. 
Donec ullamcorper, felis non sodales...

\section{Second Section}

Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  
Etiam lobortis facilisissem.  Nullam nec mi et neque pharetra 
sollicitudin.  Praesent imperdiet mi necante...

\subsection{First Subsection}
Praesent imperdietmi nec ante. Donec ullamcorper, felis non sodales...

\section*{Unnumbered Section}
Lorem ipsum dolor sit amet, consectetuer adipiscing elit.  
Etiam lobortis facilisissem
```

Use `*` for unnumbered section

The basic levels or depth are listed below :

0. `\part{part}`
1. `\chapter{chapter}`
2. `\section{section}`
3. `\subsection{subsection}`
4. `\subsubsection{subsubsection}`
5. `\paragraph{paragraph}`
6. `\subparagraph{subparagraph}`

> `\part` and `\chapter` are only available in *report* and *book* **document classes**.

## Extras

### Creating tables

### Adding a Table of Contents

To create the table of contents is straightforward, the command `\tableofcontents` does all the work for you. Make sure to invoke it at the start of your **report**

Sections, subsections and chapters are automatically included in the table of contents. To manually add entries, for example when you want an unnumbered section, use the command `\addcontentsline`. For example : 

```latex
\tableofcontents
%...
\section*{Unnumbered Section}
\addcontentsline{toc}{section}{Unnumbered Section}

Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
%...
```


### Splitting Large Documents : input and include

There Are two methods to separate a large document into separate files. We can either use `\input` or `\include`


### `\input{filename}`

acts as though the contents of the file were typed where the \input command was. 

### `\include{filename}`

does more than just input the contents of the file. It also starts a new page (using `\clearpage`) and creates an auxiliary file associated with the included file. It also issues another `\clearpage` once the file has been read in. 

Using this approach, you can also govern which files to include using `\includeonly{file list}` ***in the preamble***, where `file list` is a comma-separated list of files you want included. This way, if you only want to work on one or two chapters, you can only include those chapters, which will speed up the document build. LaTeX will still read in all the cross-referencing information for the missing chapters, but **won't include those chapters in the PDF file**.

-> `includeonly` is useful when we're working on a certain chapter and we don't want to recompile the other chapters. You can still reference all the figures in the omitted chapter, as long as you have previously LaTeXed the document without the `\includeonly` command. 

We can use `excludeonly{file list}` to do the exact opposite and choose which files to exclude.



For example we can have 

```latex
% arara: pdflatex: { synctex: on }
% arara: pdflatex: { synctex: on }
\documentclass[oneside]{scrbook}

\title{A Sample Thesis}
\author{A.N. Other}
\date{July 2013}
\titlehead{A Thesis submitted for the degree of Doctor of Philosophy}
\publishers{School of Something\\University of Somewhere}

\begin{document}
\maketitle

\frontmatter
\tableofcontents
\listoffigures
\listoftables

\chapter{Acknowledgements}

I would like to thank my supervisor, Professor Someone. This
research was funded by the Imaginary Research Council.

\chapter{Abstract}

A brief summary of the project goes here.

\mainmatter

\include{intro}

\include{techintro}

\include{method}

\include{results}

\include{conc}

\backmatter

\end{document}
```


```latex
\chapter{Introduction}
\label{ch:intro}
```

```latex
\chapter{Technical Introduction}
\label{ch:techintro} 
```

and so on.

### Bibliography 


