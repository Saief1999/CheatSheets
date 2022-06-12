# LLVM

## Overview 
The LLVM Project is a collection of modular and reusable compiler and toolchain technologies.

The **LLVM Core** libraries provide a modern source- and target-independent [optimizer](https://llvm.org/docs/Passes.html), along with [code generation support](https://llvm.org/docs/CodeGenerator.html) for many popular CPUs (as well as some less common ones!) These libraries are built around a [well specified](https://llvm.org/docs/LangRef.html) code representation known as the LLVM intermediate representation ("LLVM IR").


---

### Indiv 

- only data type : 64 bit floating point type ( `double` )

- No type declaration  



```python
# Compute the x'th fibonacci number.
def fib(x)
  if x < 3 then
    1
  else
    fib(x-1)+fib(x-2)

# This expression will compute the 40th number.
fib(40)
```

We also allow Kaleidoscope to call into standard library functions - the LLVM JIT makes this really easy. This means that you can use the ‘extern’ keyword to define a function before you use it (this is also useful for mutually recursive functions). For example:

```python
extern sin(arg);
extern cos(arg);
extern atan2(arg1 arg2);

atan2(sin(.4), cos(42))
```


### Lexer

Each token returned by our lexer will either be one of the Token enum values or it will be an ‘unknown’ character like ‘+’, which is returned as its ASCII value.

the name of the identifier. If the current token is a numeric literal (like 1.0), `NumVal` holds its value. We use global variables for simplicity, but this is not the best choice for a real language implementation :).

The actual implementation of the lexer is a single function named `gettok`. The `gettok` function is called to return the next token from standard input. Its definition starts as:


---


## Building a language with LLVM


### Lexer 





### Parser & AST

### AST
