

# Go

## Basics 


Go code is grouped into packages, and packages are grouped into modules. Your module specifies dependencies needed to run your code, including the Go version and the set of other modules it requires. 

As you add or improve functionality in your module, you publish new versions of the module. Developers writing code that calls functions in your module can import the module's updated packages and test with the new version before putting it into production use. 


`go mod init <module_name>` : initialize our go module. Enables dependency tracking for the code.
  - We should specify where our module would be downloaded from, for example : `example.com/greetings`


`go run .` : run the `main` package in the current module directory, if no package with name `main` is provided an error will be thrown.


`go help` : get help about the go command.

`go mod tidy` : add any imported modules to our moldule definition



In Go, a function whose name starts with a capital letter can be called by a function not in the same package. This is known in Go as an exported name.



In Go, the := operator is a shortcut for declaring and initializing a variable in one line (Go uses the value on the right to determine the variable's type).

These two are equivalent : 

```go
message := fmt.Sprintf("Hi, %v. Welcome!", name)
```

```go
var message string
message = fmt.Sprintf("Hi, %v. Welcome!", name)
```


To reference a module we have locally , we  use the `replace` command

example : 

```bash
go mod edit -replace example.com/greetings=../greetings
go mod tidy
```

To reference a published module, a go.mod file would typically omit the replace directive and use a require directive with a tagged version number at the end. 


### Handling errors