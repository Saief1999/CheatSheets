## Introduction  

- Two standards of Prolog are used currently : 
  - Edinburgh (old)
  - ISO (new)

## Chapter 1 : Tutorial Introduction

### 1.1 Prolog

- The Prolog programmer asks more about which formal relationships and objects occur in the problem, and which relationships are “true” about the desired solution.
-  Prolog can be viewed as a **descriptive** language as well as a **prescriptive** one.

### 1.2 Objects and Relationships

- Prolog is a computer programming language that is used for solving problems that involve objects and the relationships between objects.
- Prolog should not be compared with object-oriented languages such as C++ and Java ( it uses thee world object in a completely different way)
- Prolog is a practical and efficient implementation of many aspects of “intelligent” program execution, such as **non-determinism**, **parallelism**, **and pattern-directed procedure call**.
- Prolog provides a uniform data structure, called the **term**, from which all data, as well as Prolog programs, are constructed.
- A Prolog program consists of a set of **clauses**, where each clause is either a **fact** about the given information or a **rule** about how the solution may relate to or be inferred from the given facts. 
- Example of a rule : `Two people are sisters if they are both female and have the same parents`

### 1.3 Programming

- Computer programming in Prolog consists of: 
  - specifying some facts about objects and their relationships
  - defining some rules about objects and their relationships
  - asking questions about objects and their relationships
- we can consider Prolog as a storehouse of facts and rules, and it uses the facts and rules to answer questions.
- Programming in Prolog consists of supplying all these facts and rules. 



### 1.4 Facts

- Suppose we want to tell Prolog the fact that “John likes Mary”. This fact consists of two objects, called “Mary” and “John”, and a relationship, called “likes”
- Syntax :```likes(john, mary).```

- **Important Points** :
  - The names of all relationships and objects must begin with a lower-case letter. For example, `likes`, `john`, `mary`.
  - The **relationship** is written first, and the objects are written separated by commas, and the objects are enclosed by a pair of round brackets. 
  - The **dot** character “.” must come at the end of a fact. The dot is what some people also call a “period” or a “full stop”.
- the fact `likes(john, mary)` is not the same thing as `likes(mary, john)`

- A name can have several interpretations:
  - `valuable(gold)` could mean that this particular lump of gold, which we have named gold, is valuable.
  - `valuable(gold)` could would mean that the chemical element Gold is valuable.

- names of objects within a fact -> **arguments**
- name of the relationship -> **predicate** 

- A collection of facts is called a **database**. We shall use the word **database** whenever we have collected together some facts (and later, rules) that are used to solve a particular problem.

### 1.5 Questions

- Once we have some facts, we can ask some questions about them.
- Example : `?- owns(mary, book).` 
  - If we interpret `mary` to be a person called Mary, and `book` to be some particular book, this question is asking `Does Mary own the book?`, or `Is it a fact that Mary owns the book?` We are not asking whether she owns all books, or books in general.
  - When a question is asked of a Prolog system, it will search through the database. It looks for facts that **unify** the fact in the question. 
    - Two facts **unify** if their predicates are the same (spelled the same way),
- Example 2 :

Database : 

```
likes(joe, fish). 
ikes(joe, mary).
likes(mary, book).
likes(john, book).
likes(john, france).
```

Questions : 

```
?- likes(joe, money).
no
?- likes(mary, joe).
no
?- likes(mary, book).
yes
```



- **no** :  nothing **unifies** with the question.
- **no** is the same as **false**.
- Example 3 :

Database :

```
human(socrates).
human(aristotle).
athenian(socrates).   
```

Questions : 

```
?- athenian(socrates).
yes
?- athenian(aristotle).
no
?- greek(socrates)
Existence error: procedure greek
no
```



### 1.6 Variables : 

- In Prolog we can not only name particular objects,but we can also use terms like X to stand for objects that we are unwilling or unable to name. 
- Any name beginning with a capital letter is taken to be a variable.
- When Prolog uses a variable, the variable can be either instantiated or not instantiated. 
	- A variable is instantiated when there is an object that the variable stands for. 
	- A variable is not instantiated when what the variable stands for is not yet known.
- When Prolog is asked a question containing a variable, Prolog **searches** through all its facts to find an **object** that the variable could stand for.

#### Example 1 : 

Database :

```
likes(john, flowers).
likes(john, mary).
likes(paul, mary).
```

Question 

```
?- likes(john, X).
X = flowers
```



- **Explanation** :

  1. the variable X is initially not instantiated. Prolog searches though the database, looking for a fact that unifies with the question.

  2. If an `uninstantiated` variable appears as an argument, Prolog will allow that argument to unify with any other argument in the same position in the fact (Prolog searches for any fact where the predicate is likes, and the first argument is john.)
  3. Prolog searches through the database in the order it was typed in (or top-to-bottom of the page) so the fact likes(john, flowers) is found first.
  4. X is **instantiated** to flowers. Prolog now **marks** the place in the database where a unifier is found.
  5. If we hit "Enter", we are satisfied we the answer , if we hit ";", Prolog must forget that X stands for flowers, and resume searching with X `uninstantiated` again. Because we are searching for an alternative solution, the search is continued from the **place-marker**. (will give us `X = Mary` )
  6. if we hit ";" it returns **no**.

​    

#### Example 2 (same database) : 

```
?- likes(X, mary).
X = john ;
X = paul ;
no
```

- IMPORTANT : in SWI-Prolog, we have this output  (will stop searching if there's not more instantiations available)

```
?- likes(X, mary).
X = john ;
X = paul .
```



### 1.7 Conjunctions

- when asking a question : `,` -> **and**

Example :

Database

```
likes(mary, chocolate).
likes(mary, wine).
likes(john, wine).
likes(john, mary).
```

Questions 

```
?- likes(john, mary), likes(mary, john).
no
```

In SWI-Prolog 

```
likes(john, mary), likes(mary, john).
false.
```



- **IMPORTANT** :
  - Prolog answers the question by attempting to satisfy the first goal. If the **first goal** is in the database, then Prolog will **mark** the place in the database, and **attempt** to satisfy the second goal. 
  - If the second goal is **satisfied**, then Prolog marks that goal’s place in the database, and we have found a solution that satisfies both goals. It is most important to remember that each goal keeps its own **place-marker**.
  - If the second goal of a conjunction is not satisfied, then Prolog will attempt to re-satisfy the previous goal (in this case the first goal). **Starting from the goal’s own place-marker**. then will try to satisfy the next goal **starting from the top of the database** (basically backtracking).
- Example ( explanation page 12 &13 )  : 

```
?- likes(mary, X), likes(john, X).
X = wine.
```



### 1.8 Rules

- In Prolog, rules are used when you want to say that a fact depends on a group of other facts. In English, we use the word “if” to express a rule
- A rule is a general statement about objects and their relationships.
- **Syntax** : 
  - In Prolog, a rule consists of a **head** and a **body**. The head and body are connected by the symbol “:-”, which is made up of a colon and a hyphen. The “:-” is pronounced if. 
    - **The head** of the rule describes what fact the rule is intended to define. 
    - The body, in this case likes(X, wine), describes the conjunction of goals that must be satisfied, one after the other, for the head to be true.
- Example1 : 
  - `likes(john, X) :- likes(X, wine).`
- Example 2 :

Database : 

```
male(albert).
male(edward).
female(alice).
female(victoria).
parents(edward, victoria, albert).
parents(alice, victoria, albert).
sister_of(X, Y) :- female(X), parents(X, M, F), parents(Y, M, F).
```

Question 

```
?- sister_of(alice, edward).
yes(in SWI-prolog true )
```

Explanation : 

1. First, the question unifies with the head of the only sister_of rule above, so **X** in the rule becomes instantiated to `alice`, and **Y** becomes instantiated to `edward`. The place marker for the question is put against this rule. Now Prolog attempts to satisfy the three goals in the body, one by one. 
2. The first goal is `female(alice)` because **X** was instantiated to `alice` in the previous step. This goal is true from the list of facts, so the goal succeeds. As it succeeds, Prolog marks the goal’s place in the database (the third entry in the database). No new variables were instantiated, so no other note is made. Prolog now attempts to satisfy the next goal. 
3. Now Prolog searches for `parents(alice, M, F)`, where **M** and **F** will unify with any arguments because they are `uninstantiated`. A unifying fact is `parents(alice, victoria, albert)`, so the goal succeeds. Prolog marks the place in the database (sixth down from the top) and records that **M** became instantiated to `victoria`, and **F** to `albert`.
4. Now Prolog searches for `parents(edward, victoria, albert)` because **Y** is known as `edward` from the question, and **M** and **F** were known to stand for `victoria` and `albert` from the previous goal. The goal succeeds, because a unifying fact is found (fifth down from the top). Since it is the last goal in the conjunction, the entire goal succeeds, and the fact `sister_of(alice, edward)` is established as **true**. Prolog answers `yes.`

Question 2 : 

```
?- sister_of(alice, X).
X = edward ;                                                                                         X = alice.  
```



- a clause in the database : a **fact** or a **rule** .



##  Chapter 2 : a closer look

### 2.1 Syntax

- Prolog programs are built from terms
- A term is either 
  - a constant, 
  - a variable, 
  - a structure.

#### 2.1.1 Constants 

- they name specific objects or specific relationships. There are two kinds of constants: atoms & numbers
- **atoms**
  - two kinds of atoms : 
    - atoms made up from letters&digits :
      - they generally begin with a lower case letter
      - Examples : `likes mary john book wine owns jewels can_steal`
    - atoms made up from signs 
      - Examples :  `?-` , `:-` , `-->`
  - we can put atoms between ``` ` then they may have **any** character in their name. 
    - Example `’george-smith’`
- Numbers : 
  - `-17 -2.67e2 0 1 99.9 512 8192 14765 67344 6.02e-23`

 #### 2.1.2 Variables

- Variables look like atoms, except they have names beginning with a **capital letter** or an **underline sign** “_”.
- stands for some object that we are unable or unwilling to name at the time we write the program.
- Examples :  `Answer Input Gross_Pay _3_blind_mice A_very_long_variable_name`
- **anonymous variables** : 
  - when we needs to use a variable, but its name will never be used.
  - Example :
    - if we want to find out if anyone likes John, but we do not need to know just who it is,
    - `?- likes(_, john).`

#### 2.1.3 Structures

- also called “compound terms”
- A structure is a single object consisting of a collection of other objects, called components
- A structure is written in Prolog by specifying its `functor` and its `components`.
  -  The `functor` names the general kind of structure, and corresponds to a datatype in an ordinary programming language. 
  - The `components` are enclosed in round brackets and separated by commas.
- Example `owns(john, book(ulysses, author(james, joyce), 3129)).`
  - John owns the 3,129th copy of Ulysses, by James Joyce.

### 2.2 Characters

- In Standard Prolog, a character is actually an atom of length 1. It is most common to use input and output operations on characters; 
- Prolog recognizes two kinds of characters:
  - Printing characters: cause a symbol to appear on your computer terminal’s display.
  - Non-printing characters : 
    - do not cause a symbol to appear, but cause an action to be carried out. 
    - Such actions include printing a blank space, beginning new lines of text, or perhaps making a beeping sound.

### 2.3 Operators

- Sometimes it is convenient to write some `functors` as operators. This is a form of syntax that makes some structures easier to read. 
- If we had to write the arithmetic expression `x + y * z` in the normal way for structures, it would look like this: `+(x,*(y,z))`, and this would be a legal Prolog term. 
- in Prolog, 3+4 does not mean the same thing as 7. The term 3+4 is another way to write the term +(3,4), which is a **data structure**.
- Types of operators : 
  -  Operators like plus (+), hyphen (-), asterisk (*), and slash (/) are written between their arguments, so we call them **infix operators**.
  - It is also possible to put operators before their arguments, as in “-x + y”, where the hyphen before the x is used in to denote **negation**. Operators that come before their arguments are called **prefix operators**.
  - Operators that are written after their arguments( the factorial of x is written “x!” ) are called **postfix operators**. 
- The **precedence** of an operator is used to indicate which operation is carried out first. Each operator that is used in Prolog has a precedence class associated with it (an integer value associated with an operator)
- **left associative** operators :
  - add, subtract, multiply, and divide
  - expressions like “8/4/4” are read as “(8/4)/4”



### 2.4 Equality and Unification

- `?-X=Y`

- pronounced “X equals Y”, Prolog attempts to unify `X` and `Y`, and the goal succeeds if they unify

- The equality predicate is built-in

- Given a goal of the form `X=Y`, where `X` and `Y` are any two terms which are permitted to contain `uninstantiated` variables, the rules for deciding whether `X` and `Y` are equal are as follows:

  - If `X` is an `uninstantiated` variable, and if `Y` is instantiated to any term, then `X` and `Y` are equal. Also, `X` will become instantiated to whatever `Y` is

    - Example : `?- rides(student, bicycle) = X.` { X is instantiated to the structure rides }

  - Integers and atoms are always equal : 

    ```
    policeman = policeman succeeds
    paper = pencil fails
    1066 = 1066 succeeds
    1206 = 1583 fails
    ```

  - Two structures are equal if : 

    - they have the same `functor` and number of components
    - all the corresponding components are equal.
    - Example : `rides(student, bicycle) = rides(student, X)`
      - goal succeeds, and causes X to be instantiated to bicycle

  - If `X`and `Y` are both `uninstantiated`, they **share**

    - whenever one of them becomes instantiated to some term, the other one automatically is instantiated to the same term.

  - **NOTES**  : An X = Y goal will always succeed if either argument is `uninstantiated`.

### 2.5 Arithmetic

```
X =:=Y X and Y stand for the same number
X =\=Y X and Y stand for different numbers
X < Y X is less than Y
X > Y X is greater than Y
X =< Y X is less than or equal to Y
X >= Y X is greater than or equal to Y
```

- Note that the “less than or equal to” symbol is not written as “<=” as in many programming languages. This is done so that the Prolog programmer is free to use the “<=” atom, which looks like an arrow, for other purposes
- The arguments could be variables instantiated to integers, or they could be integers written as constants, or they could be more general expressions.

Example : 

Database : 

```
reigns(rhodri, 844, 878).
reigns(anarawd, 878, 916).
reigns(hywel_dda, 916, 950).
reigns(lago_ap_idwal, 950, 979).
reigns(hywel_ap_ieuaf, 979, 985).
reigns(cadwallon, 985, 986).
reigns(maredudd, 986, 999).
```



Then we define this : `X was a prince during year Y if: X reigned between years A and B, and Y is between A and B, inclusive.`

```
prince(X, Y) :-
reigns(X, A, B),
Y >= A,
Y =< B.
```

Question : 

```
?- prince(cadwallon, 986).
yes
?- prince(X, 979).
X=lago_ap_idwal ;
X=hywel_ap_ieuaf
yes
```



Example 2 :

 

```
pop(usa, 203).
pop(india, 548).
pop(china, 800).
pop(brazil, 108).
area(usa, 3).
area(india, 1).
area(china, 4).
area(brazil, 3).

density(X, Y) :-
pop(X, P),
area(X, A),
Y is P / A.
```



- The rule is read as follows: 
  - The population density of country X is Y, if: 
    - The population of X is P
    - and The area of X is A, 
    - and Y is calculated by dividing P by A.

- **is** : 
  - The “is” operator is an infix operator. Its right-hand argument is a term which is interpreted as an arithmetic expression. To satisfy an “is”, Prolog first evaluates its right-hand argument according to the rules of arithmetic. The answer is unified with the left-hand argument to determine whether the goal succeeds
  - The left hand argument needs to be **always instantiated** .
  - We need to use the “is” predicate any time we require to evaluate an arithmetic expression. 
  - Example : `?- X is 2+3.` , X become equal to **5**
  - We can define a predicate for addition : `add(X, Y, Z) :- Z is X + Y.`
    - the predicate is true if Z is X+Y (note that X and Y **must** be instantiated.)



Depending on what computer you use, various arithmetic operators can be used on the right-hand side of the “is” operator. All Standard Prolog systems, however, will have the following

```
X + Y the sum of X and Y
X - Y the difference of X and Y
X * Y the product of X and Y
X / Y the quotient of X divided by Y
X // Y the integer quotient of X divided by Y
X mod Y the remainder of X divided by Y
```



### 2.6 Summary of Satisfying Goals

- Prolog performs a task in response to a question from the programmer (you). 
- A question provides a conjunction of goals to be satisfied. Prolog uses the known clauses to satisfy the goals. A fact can cause a goal to be satisfied immediately, whereas a rule can only reduce the task to that of satisfying a conjunction of sub goals. 
- However, a clause can only be used if it unifies the goal under consideration. If a goal cannot be satisfied, backtracking will be initiated. 
- Backtracking consists of reviewing what has been done, attempting to re-satisfy the goals by finding an alternative way to satisfying them.
-  Furthermore, if you are not content with an answer to your question, you can initiate backtracking yourself by typing a semicolon when Prolog informs you of a solution.



**General rule of Unification (IMPORTANT)** 

- The rules for deciding whether a goal unifies with the head of a use of a clause are as follows. Note that in the use of a clause, all variables are initially `uninstantiated`. 
  - An `uninstantiated` variable will unify with any object. As a result, that object will be what the variable stands for. 
  - Otherwise, an integer or atom will unify with only itself.
  - Otherwise, a structure will unify with another structure with the same `functor` and number of arguments, and all the corresponding arguments must unify.

## Using Data Structures

### 3.1 Structures and Trees

- based on structure
- we take the predicate , and create a tree out of it 

### 3.2 Lists

- The list is an ordered sequence of elements that can have any length.
- The “elements” of a list may be any terms — constants, variables, structures — which of course includes other lists.
- A list is either :
  - an empty list, having no element :
    
    - `[]`
    
  - it is a structure that has two components: the **head** and **tail**.
  
  - the head of the list is the first element of the list.
  
  - The tail of the list is a list that consists of every element except the first.
  
    - Example : The head and tail of a list are components of the `functor` named “.”, which is the dot (called the period or full stop). Thus, the list consisting of one element “a” is “.(a,[])” 
  
    - we can also use another notation , called the `list notation` : `[a]`
  
    - | List                    | Head       | Tail               |
      | ----------------------- | ---------- | ------------------ |
      | [a,b,c]                 | a          | [b,c]              |
      | []                      | (none)     | (none)             |
      | [[the, cat], sat]       | [the, cat] | [sat]              |
      | [the, [cat, sat]]       | the        | [[cat, sat]]       |
      | [the, [cat, sat], down] | the        | [[cat, sat], down] |
      | [X+Y,x+y]               | X+Y        | [x+y]              |





Example : 

```
p([1,2,3]).
p([the, cat, sat, [on, the, mat]]).
?- p([X|Y]).
X=1 Y= [2, 3] ;
X = the [Y = cat, sat, [on, the, mat]]
?- p([_,_,_,[_|X]]).
X = [the, mat]
```



Examples 2 :

| List 1        | List 2                  | Instantiations                   |
| ------------- | ----------------------- | -------------------------------- |
| [X, Y, Z]     | [john, likes, fish]     | X = john Y = likes Z = fish      |
| [cat]         | [X\|Y]                  | X = cat Y = []                   |
| [X, Y\|Z]     | [mary, likes, wine]     | X = mary Y = likes Z = [wine]    |
| [[the, Y]\|Z] | [[X, hare], [is, here]] | X = the Y = hare Z = [[is,here]] |
| [golden\|T]   | [golden, norfolk]       | T = [norfolk]                    |
| [vale, horse] | [horse, X]              | (NONE)                           |
| [white\|Q]    | [P\|horse]              | P = white Q = horse              |



-  it is possible to use the list notation to create structures that resemble lists, but which do not terminate with the empty list.  One such structure, `[white|horse]`,

### 3.3 Recursive Search

Example  :

```
member(X, [X|_]).
member(X, [_|Y]) :- member(X, Y).
?- member(d, [a, b, c, d, e, f, g]).
yes
?- member(2, [3, a, 4, f]).
no
```



**Circular definition(error)**

```
parent(X, Y) :- child(Y, X).
child(A, B) :- parent(B, A)
```

**left recursion(error):**

```
person(X) :- person(Y), mother(X, Y).
person(adam).
?- person(X).
```

**Solution left recursion (this case)**

```
person(adam).
person(X) :- person(Y), mother(X, Y).
```



- **Important note** : Don’t assume that, just because you have provided all the relevant facts and rules, Prolog will always find them. You must bear in mind when you write Prolog programs how Prolog searches through the database and which variables will be instantiated when one of your rules is used.
- When we write f(N-1) he searches for f(X-Y) !!!

