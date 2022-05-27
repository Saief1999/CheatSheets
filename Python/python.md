[TOC]



## Notes

- Python is case sensitive
- True & False **Not** true & false
- It's perfectly possible to 'multiply strings' in Python...
- a var with type `list` contains the reference to that list and not the value
  - Operations on lists within functions generally **modify the original list** unless told not to ( by passing a copy )
  - To copy we do `areas_copy = list(areas)` or `areas_copy = areas[:]`
- Everything = Object

## Packages

- Each package Contains a couple of modules
- Each module contains some python scripts

## types (all of them are objects)

- `int`
- `float`
- `bool`
- `str`

### Lists

```python
family=["hey",["liz", 1.73], ["emma", 1.68],"yeah"]
print(family[0])  # 'hey'
print(family[-1]) # 'yeah'
# [start(inclusive):end(exclusive)]
print(family[1:3]) # [["liz", 1.73], ["emma", 1.68]]
print(family[:3]) # ["hey",["liz", 1.73], ["emma", 1.68]]
print(family[2:]) # [['emma', 1.68], 'yeah']
familiy = family + ["me",1.97] #add element to list
del(family[2]) # delete element from list


max(family) # max value in max

len(family) # length

sorted(my_list, reverse = True) # sort in descending order

family.index("hey") # 0 : Exists at index 0
family.count("hey") # 1 : Exists only once

family.append(1.7) # Appends 1.7 to family

family.remove("hey")  #  removes the first element of a list that matches the input
family.reverse() # reverses the order of the elements in the list it is called on.
```

### Show type

```python
print(type(var))
```

### Convert Type

```python
int(var)
float(var)
bool(var)
```



## Functions



#### Helpful Functions

- `help(function)` : gives details about function 
- round(number) : round to closest integer
- round(number, `ndigits`) : rounds with decimal point

- Positional Arguments (must have specific order): 

```python
doSomething(var1,var2)
```

  

- Keyword Arguments: 

```python
doSomething(label1=var1,label2=var2)
```

## Pandas

```python
# Turn csv to DataFrame
df = pd.read_csv('filename.csv')

# Print the first few lines
print(df.head())

# print info
print(df.info())

# selecting columns
df.var # if no special characters in column name 
df['my-var'] # if there is special characters, we do this 

# Select the dogs where Age is greater than 2
greater_than_2 = mpr[mpr.Age > 2]

# Select the dogs whose Status is equal to Still Missing
still_missing = mpr[mpr.Status == "Still Missing"]

# Select all dogs whose Dog Breed is not equal to Poodle
not_poodle = mpr[mpr["Dog Breed"] != "Poddle"]

```



## Matplotlib

```python
from matploblib import pyplot as plt

# plotting
plt.plot(x_values1, y_values1, label="label1", color="orange", linewidth=2, linestyle="--", marker="*" )

# plotting a second dataset
plt.plot(x_values2, y_values2, label= "label2")

# showing both graphs
plt.show()

# adding labels
plt.xlabel("Letter")
plt.ylabel("Frequency")

# adding title
plt.title("My Title", fontsize=15, color="orange")

# adding legends (taken from the label param for each plot function)
plt.lenged()

# adding text
plt.text(xcoord,ycoord,"Message")

# changing plot style
plt.style.use('ggplot')

# Creating scatter plot (alpha controls transparency)
plt.scatter(df.age, df.height, color="green",alpha=0.1)

# Creating Bar Chart
plt.bar(df.x_values, df.y_values)

# Creating Horizontal Bar Chart
plt.barh(df.x_values, df.y_values)

# adding error bars
plt.bar(df.x_values, df.y_values, yerr=df.error)

# Creating stacked bar chart
plt.bar(df.precinct, df.cat, bottom= df.dog, label="Dog")
plt.bar(df.precinct, df.dog, label="Cat")

# Creating Histogram (density normalizes two datasets to same height )
plt.hist(gravel.mass, bins=nbins, range = (xmin, xmax), density=false)
```

## Numpy

- Numpy might help to make some operations on lists much easier
  - We convert our arrays into Numpy arrays by doing `np.array(my_array)`
  - Then, we do operations normally as we do for integers `np_weight/np_height **2`
- Numpy array : Contains only one type ( all elements of array will be converted to one type)
- The typical arithmetic operators, such as `+`, `-`, `*` and `/` have a different meaning for regular Python lists and `numpy` arrays.
- Enforcing a data type with Numpy => calculations are much faster

```python
print(weight / height ** 2) # Throws Error !
import numpy as np 
np_height = np.array(height) # convert height array in np array
np_weight = np.array(weight)
bmi = np_weight / np_height ** 2
np.array([1.0, "is", True]) # array(['1.0', 'is', 'True'])

# Addition becomes element wise
python_list = [1, 2, 3]
numpy_array = np.array([1, 2, 3])
print(python_list + python_list) # [1, 2, 3, 1, 2, 3]
print(numpy_array + numpy_array) # array([2,4,6]) !!!!

# Numpy Subsetting
bmi[1] # 2
bmi # array([2, 20, 21, 24, 21])
bmi > 23 # array([False, False, False, True, False, dtype=bool])
bmi[bmi>23] # array([24])

# Numpy 2D
np_2d  = np.array([[1,2,3],[4,5,6]]) # array([[1,2,3],[4,5,6]])
np_2d.shape # (2,3) # 2 rows, 3 columns

np_2d[0][2] # 3
np_2d[0,2] # 3
np_2d[:,1:3] # all rows, only columns with index 1 & 2
np_2d[1,:] # entire second row

# average
np.mean(np_city[:,0]) 
# median
np.median(np_city)[:,0] 
# coefficient de correlation
cp.corrcoef(array)
# standard deviation
np.std(np_city[:, 0])
# sum(), sort()..
```



---

## Variables

### f-strings

```python
first_name = "ada"
last_name = "lovelace"
full_name = f"{first_name} {last_name}"
print(full_name) # ada lovelace
```

F- strings were first introduced in Python 3.6. If you’re using Python 3.5 or earlier, you’ll need to use the format() method rather than this f syntax.

```python
full_name = "{} {}".format(first_name, last_name)
```

### Integers and Floats

When you divide any two numbers, even if they are integers that result in a whole number, you’ll always get a float:

```python
>>> 4/2 # 2.0
```

Python defaults to a float in any operation that uses a float, even if the output is a whole number.

### Underscores in Numbers

When you’re writing long numbers, you can group digits using underscores to make large numbers more readable:

```python
universe_age = 14_000_000_000
print(universe_age) # 14000000000
```

### Multiple Assignment

```python
x, y, z = 0, 0, 0
```

### Constants

**Python doesn’t have built- in constant types**, but Python programmers use all capital letters to indicate a variable should be treated as a constant and never be changed

## lists

```python
########### Adding Elements
motorcycles = [] 
motorcycles.append('honda') # motorcycles : ['honda']
motorcycles.insert(0,'103') # motorcycles: ['103','honda']

########### Removing Elements

del motorcycles[0] # motorcycles : ['honda']
last_item = motorcycles.pop() # motorcycles : [] | last_item : 'honda' 

motorcycles = ['honda', 'yamaha', 'suzuki', 'ducati'] 
motorcycles.remove('ducati') # ['honda', 'yamaha', 'suzuki']  

########### Sorting 
# Note : use sorted() instead of sort() in order to not change the original list
cars = ['bmw', 'audi', 'toyota', 'subaru']
cars.sort() # cars : ['audi', 'bmw', 'subaru', 'toyota'] 
cars.sort(reverse=True) # cars : ['toyota', 'subaru', 'bmw', 'audi'] 

########### Reversing
cars = ['bmw', 'audi', 'toyota', 'subaru']
cars.reverse() # cars : ['subaru', 'toyota', 'audi', 'bmw']

########### Length
print(len(cars)) # 4 

```

### Working with lists

#### Looping through lists

```python
magicians = ['alice', 'david', 'carolina'] 
for magician in magicians: 
	print(magician
```

#### Using the range() function

```python
for value in range(1, 5):
    print(value) # 1 2 3 4 (first param inclusive, second exclusive)
```

You can also pass range() only one argument, and it will start the sequence of numbers at 0. For example, range(6) would return the numbers from 0 through 5.

##### Using range() to Make a List of Numbers

If you want to make a list of numbers, you can convert the results of range() directly into a list using the list() function. When you wrap list() around a call to the range() function, the output will be a list of numbers.

```python
numbers = list(range(1, 6))
print(numbers) # [1, 2, 3, 4, 5] 

even_numbers = list(range(2, 11, 2)) # last param : Step (defaults to 1)
print(even_numbers) # even_numbers: [2, 4, 6, 8, 10]
```

#### List Comprehensions

A list comprehension combines the for loop and the creation of new elements into one line, and automatically appends each new element.

```python
squares = [value**2 for value in range(1, 11)]
print(squares) # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
```

### Copying a List

To copy a list, you can make a slice that includes the entire original list by omitting the first index and the second index ([:]). This tells Python to make a slice that starts at the first item and ends with the last item, producing a copy of the entire list.

```
my_food = ['pizza', 'falafel', 'carrot cake']
my_food_copy = my_foods[:]
```

## Tuples

Sometimes you’ll want to create a list of items that cannot change. Tuples allow you to do just that. Python refers to values that cannot change as immutable, and an immutable list is called a tuple.

```python
dimensions = (200, 50)
print(dimensions[0]) # 200, and it cannot be changed
```

**Note (single element tuple)**:

- Tuples are technically defined by the presence of a comma; the parentheses make them 
  look neater and more readable. If you want to define a tuple with one element, you 
  need to include a trailing comma:

```python
my_t = (3,)
```

### Writing over a Tuple

- We can't change a tuple, but we can reassign our variable to a new tuple

```python
dimensions = (200, 50)
print("Original dimensions:")
for dimension in dimensions:
    print(dimension)
    
dimensions = (400, 100)
print("\nModified dimensions:")
for dimension in dimensions:
    print(dimension)
```

**Result:**

```
Original dimensions: 
200 
50 
Modified dimensions: 
400 
100
```

**Important Note**

> PEP 8  Summarizes the best style guidelines in Python

## if Statements

- At the heart of every if statement is an expression that can be evaluated as `True` or `False` and is called a conditional test.

|                      C Like Languages                      |        Python         |
| :--------------------------------------------------------: | :-------------------: |
|                            \|\|                            |          or           |
|                             &&                             |          and          |
|  `list.contains(element)` { or `list.includes(element)` }  |   `element in list`   |
| `!list.contains(element)` { or `!list.includes(element)` } | `element not in list` |

### The if elif else

```python
age = 12
if age < 4:
    price = 0
elif age < 18:
    price = 25
elif age < 65:
    price = 40
else:
    price = 20
print(f"Your admission cost is ${price}.")
```

### Testing whether list is empty

```python
my_list = []
if not(my_list): # len(my_list) == 0
	print("list is empty")
else:
	print("good bye") 
```

## Dictionaries

- A dictionary in Python is a collection of key-value pairs. Each key is connected to a value, and you can use a key to access the value associated with that key. 
- A key’s value can be a number, a string, a list, or even another dictionary. In fact, you can use any object that you can create in Python as a value in a dictionary.
- In Python, a dictionary is wrapped in braces, {}, with a series of key value pairs inside the braces

```python
alien_0 = {'color': 'green', 'points': 5}
print(alien_0['color']) # green
############ Adding / Modifying key-value pairs
alien_0['x_position'] = 0 # we can't use "." here, it's not an object!
alien_0['y_position'] = 25
print(alien_0) # {'color': 'green', 'points': 5, 'y_position': 25, 'x_position': 0}

############ Deleting key-value pairs
del alien_0['points']

############ Using get() to Access values
point_value = alien_0.get('points', 'No point value assigned.') # 2nd Param: Default Value, if we don't give it we receive "None" if no value was found for that key
print(point_value) # No point value assigned.

############ Looping through keys and values
user = {
    'username': 'efermi',
    'first': 'enrico',
    'last': 'fermi',
    }
for key, value in user.items():
	print(f"\nKey: {key}")
    print(f"Value: {value}")
    
############ Looping through keys only
for name in favorite_languages.keys():
    print(name.title())
    
############ Looping through values only
for language in favorite_languages.values():
    print(language.title())
    
# When you wrap set() around a list that contains duplicate items, Python identifies the unique items in the list and builds a set from those items.
for language in set(favorite_languages.values()): # get unique values
    print(language.title())
```

### building sets

```python
languages = {'python', 'ruby', 'python', 'c'} # like dictionaries, but are not key-value
```

## User Input

```python
name = input("Please enter your name: ") # accept user input
my_number = int(input("Give me an integer: ")) # in order to convert to int we use int()
```

## Functions 

```python
def greet_user(username):
    """Display a simple greeting."""
    print(f"Hello, {username.title()}!")

greet_user('Saief')

describe_pet('harry', 'hamster') # Positional Arguments, order matters
describe_pet(animal_type='hamster', pet_name='harry') # Keyword Arguments, order doesn't matter
############ Default Value
def describe_pet(pet_name, animal_type='dog'):
    """Display information about a pet."""
    print(f"\nI have a {animal_type}.")
    print(f"My {animal_type}'s name is {pet_name.title()}.")
describe_pet(pet_name='willie')
############ Returning values
def get_formatted_name(first_name, last_name):
    """Return a full name, neatly formatted."""
	full_name = f"{first_name} {last_name}"
	return full_name.title()

musician = get_formatted_name('jimi', 'hendrix')
print(musician)
```

### Modifying a List in a Function

- Any changes to a list within a function are permanent, they are passed by reference, in order to prevent this modification we instead pass a copy of our list to the function like this : 
  - `function_name(list_name[:])`
- Even though you can preserve the contents of a list by passing a copy of it to your functions, you should pass the original list to functions unless you have a specific reason to pass a copy. It’s more efficient for a function to work with an existing list to avoid using the time and memory needed to make a separate copy, especially when you’re working with large lists.

### Passing an Arbitrary Number of Arguments

```python
def make_pizza(*toppings):
    """Print the list of toppings that have been requested."""
    print(toppings)
        
make_pizza('pepperoni')
make_pizza('mushrooms', 'green peppers', 'extra cheese')
```

- The asterisk in the parameter name *toppings tells Python to make an empty tuple called toppings and pack whatever values it receives into this tuple. 
- The print() call in the function body produces output showing that Python can handle a function call with one value and a call with three values. It treats the different calls similarly. 
- Note that Python packs the arguments into a tuple, even if the function receives only one value.

#### Mixing Positional and Arbitrary Arguments

- If you want a function to accept several different kinds of arguments, the parameter that accepts an arbitrary number of arguments must be placed last in the function definition. 
- Python matches positional and keyword arguments first and then collects any remaining arguments in the final parameter.

```python
def make_pizza(size, *toppings): 
    """Summarize the pizza we are about to make."""
    print(f"\nMaking a {size}-inch pizza with the following toppings:") 
    for topping in toppings: 
        print(f"- {topping}") 
        
make_pizza(16, 'pepperoni') 
make_pizza(12, 'mushrooms', 'green peppers', 'extra cheese')
```

#### Using Arbitrary Keyword Arguments

- **The double asterisks before the parameter `**user_info` cause Python to create an empty dictionary called user_info and pack whatever name-value pairs it receives into this dictionary.** 
- Within the function, you can access the key-value pairs in user_info just as you would for any dictionary.

```python
def build_profile(first, last, **user_info):
    """Build a dictionary containing everything we know about a user."""
    user_info['first_name'] = first
    user_info['last_name'] = last
    return user_info
user_profile = build_profile('albert', 'einstein',
                             location='princeton',
                             field='physics')
print(user_profile)
```

### Storing Your Functions in Modules

You can go a step further by storing your functions in a separate file called a module and then importing that module into your main program. An import statement tells Python to make the code in a module available in the currently running program file.

#### Importing an Entire Module

To start importing functions, we first need to create a module. A module is a file ending in `.py` that contains the code you want to import into your program.

```python
import module_name # importing the whole module
module_name.function_name() # calling a function within a module
```

#### Importing Specific Functions (selective import)

```python
from module_name import function1, function2, function3
```

#### Using as to Give a Function an Alias

```python
from module_name import function_name as fn
```

#### Using as to Give a Module an Alias

```python
import module_name as mn
```

#### Importing All Functions in a Module (not recommended)

```python
from module_name import *
```

### Global and Local Scopes

Parameters and variables that are assigned in a called function are said to exist in that function’s local scope. Variables that are assigned outside all functions are said to exist in the global scope. 

- Code  in  the  global  scope,  outside  of  all  functions,  cannot  use  any  local variables.
- However, code in a local scope can access global variables.
- Code  in  a  function’s  local  scope  cannot  use  variables  in  any  other  local scope.
- You  can  use  the  same  name  for  different  variables  if  they  are  in  different scopes.  That  is,  there  can  be  a local  variable  named  `spam`  and  a  global variable also named `spam`.

#### Global Variables Can Be Read from a Local Scope

```python
def spam(): 
    print(eggs) 
eggs = 42 
spam() 
print(eggs)
```

Since there is no parameter named eggs or any code that assigns `eggs` a value in the `spam()` function, when eggs is used in `spam()`, Python considers it a reference to the global variable `eggs`. This is why 42 is printed when the previous program is run.

#### Local and Global Variables with the Same Name

```python
def spam(): 
    eggs = 'spam local' 
    print(eggs)    # prints 'spam local' 
 
def bacon():
	eggs = 'bacon local' 
    print(eggs)    # prints 'bacon local' 
    spam() 
    print(eggs)    # prints 'bacon local' 
 
eggs = 'global' 
bacon() 
print(eggs)        # prints '
```

#### The global Statement

If you need to modify a global variable from within a function, use the global statement. If you have a line such as global eggs at the top of a function, it tells Python,  “In  this  function,  eggs  refers  to  the  global  variable,  so  don’t  create  a local variable with this name.”

```python
def spam(): 
	global eggs 
    eggs = 'spam' 
 
eggs = 'random text' 
spam() 
print(eggs) # prints 'spam'
```

#### Examples and Notes

```python
def spam(): 
	global eggs 
    eggs = 'spam' # this is the global 
 
def bacon(): 
	eggs = 'bacon' # this is a local 
 
def ham(): 
	print(eggs) # this is the global 
 
eggs = 42 # this is the global 
spam() 
print(eggs)
```

**Note**

- If you ever want to modify the value stored in a global variable from in a function, you must use a global statement on that variable.
- If you try to use a local variable in a function before you assign a value to it, as in the following program, Python will give you an error. 

```python
def spam(): 
       print(eggs) # ERROR! 
    ➊ eggs = 'spam local' 
 
➋ eggs = 'global' 
   spam()
```

This error happens because Python sees that there is an assignment statement for `eggs` in the `spam()` function ➊ and, therefore, considers  `eggs`  to  be  local.  But  because  `print(eggs)`  is  executed  before  `eggs`  is assigned anything, the local variable `eggs` doesn’t exist. Python will not fall back to using the global `eggs` variable ➋.

## Object Oriented Programming

### Creating and Using a Class

```python
class Dog:
    """A simple attempt to model a dog."""
    def __init__(self, name, age):
        """Initialize name and age attributes."""
        self.name = name
        self.age = age

    def sit(self):
        """Stimulate a dog sitting in response to a command."""
        print(f"{self.name} is now sitting.")

    def roll_over(self):
        """Stimulate rolling over in response to a command."""
        print(f"{self.name} rolled over!")
```

### The __init__() Method

- The __init__() method is a special method that Python runs automatically whenever we create a new instance based on the Dog class.
-  The self parameter is required in the method definition, and it must come first before the other parameters. It must be included in the definition because when Python calls this method later (to create an instance of the class), the method call will automatically pass the self argument. 
- Any variable prefixed with self is available to every method in the class, and we’ll also be able to access these variables through any instance created from the class. 

### Inheritance

```python
class Car:
    """A simple attempt to represent a car."""
    def __init__(self, make, model, year):
        self.make = make
        self.model = model
        self.year = year
        self.odometer_reading = 0
        
    def get_descriptive_name(self):
        long_name = f"{self.year} {self.manufacturer} {self.model}"
        return long_name.title()
    
    def read_odometer(self):
        print(f"This car has {self.odometer_reading} miles on it.")
        
    def update_odometer(self, mileage):
        if mileage >= self.odometer_reading:
            self.odometer_reading = mileage
        else:
            print("You can't roll back an odometer!")
    
    def increment_odometer(self, miles):
        self.odometer_reading += miles
        
class ElectricCar(Car):
    """Represent aspects of a car, specific to electric vehicles."""
    
    def __init__(self, make, model, year):
        """Initialize attributes of the parent class."""
        super().__init__(make, model, year)
        
 my_tesla = ElectricCar('tesla', 'model s', 2019)
print(my_tesla.get_descriptive_name())
```

- We start with Car. When you create a child class, the parent class must be part of the current file and must appear before the child class in the file. we then define the child class, `ElectricCar`. The name of the parent class must be included in parentheses in the definition of a child class.
- The __init__() method at w takes in the information required to make a Car instance.
- The **super()** function is a special function that allows you to call a method from the parent class. This line tells Python to call the __init__() method from Car, which gives an `ElectricCar` instance all the attributes defined in that method.

### Overriding Methods from the Parent Class

- You can override any method from the parent class that doesn’t fit what you’re trying to model with the child class. To do this, you define a method in the child class with the same name as the method you want to override in the parent class. 
- Python will disregard the parent class method and only pay attention to the method you define in the child class.

```python
class ElectricCar(Car):
    --snip--
    def fill_gas_tank(self):
        """Electric cars don't have gas tanks."""
        print("This car doesn't need a gas tank!")
```

### has-a Relationship

```python
class Car:
    --snip--        
        
class Battery:
    """A simple attempt to model a battery for an electric car."""
    
    def __init__(self, battery_size=75):
        """Initialize the battery's attributes."""
        self.battery_size = battery_size
    def describe_battery(self):
        """Print a statement describing the battery size."""
        print(f"This car has a {self.battery_size}-kWh battery.")
    
        
class ElectricCar(Car):
    """Represent aspects of a car, specific to electric vehicles."""
    def __init__(self, make, model, year):
        """
        Initialize attributes of the parent class.
        Then initialize attributes specific to an electric car.
        """
        super().__init__(make, model, year)
        self.battery = Battery()
        
my_tesla = ElectricCar('tesla', 'model s', 2019)
print(my_tesla.get_descriptive_name())
my_tesla.battery.describe_battery()
```

### Importing Classes

#### Importing multiple classes

```python
from module_name import ClassName1, ClassName2, ClassName3

my_object1 = ClassName1()
my_object2 = ClassName2()
my_object3 = ClassName3()
```

#### Importing an Entire Module

```
import module_name
my_object = module_name.ClassName()
```

#### Importing all Classes from a Module

```python
from module_name import *
```

#### Using Aliases

```python
from module_name import ClassName1 as CN1
my_object1 = CN1()
```

## Files and Exceptions

### Reading From Files

```python
with open('pi_digits.txt') as file_object:
    contents = file_object.read()
print(contents)
```

- To do any work with a file, even just printing its contents, you first need to open the file to access it. The open() function needs one argument: the name of the file you want to open. Python looks for this file in the directory where the program that’s currently being executed is stored. 
- The open() function returns an object representing the file. Python assigns this object to `file_object`, which we’ll work with later in the program
- The keyword with closes the file once access to it is no longer needed. Notice how we call open() in this program but not close(). You could open and close the file by calling open() and close(), but if a bug in your program prevents the close() method from being executed, the file may never close.
- Once we have a file object representing pi_digits.txt, we use the read() method in the second line of our program to read the entire contents of the file and store it as one long string in contents.

#### File Paths

- We can pass either a relative or an absolute path , the open() function will work either way

#### Reading Line by Line

```python
filename = 'pi_digits.txt'
with open(filename) as file_object:
    for line in file_object:
       print(line)
```

**Output**

```
3.1415926535

  8979323846 

  2643383279 
```

- These blank lines appear because an invisible newline character is at the end of each line in the text file. The print function adds its own new-line each time we call it, so we end up with two newline characters at the end of each line: one from the file and one from print(). Using `rstrip()` on each line in the print() call eliminates these extra blank lines

#### Making a List of Lines from a File

- When you use with, the file object returned by open() is only available inside the with block that contains it. If you want to retain access to a file’s contents outside the with block, you can store the file’s lines in a list inside the block and then work with that list. You can process parts of the file immediately and postpone some processing for later in the program.

```python
filename = 'pi_digits.txt'
with open(filename) as file_object:
    lines = file_object.readlines()
for line in lines:
    print(line.rstrip())
```

### Writing to Files

```python
filename = 'programming.txt'
with open(filename, 'w') as file_object:
    file_object.write("I love programming.")
```

-  You can open a file in read mode ('r'), write mode ('w'), append mode ('a'), or a mode that allows you to read and write to the file ('r+'). If you omit the mode argument, Python opens the file in read-only mode by default.
- The open() function automatically creates the file you’re writing to if it doesn’t already exist. However, be careful opening a file in write mode ('w') because if the file does exist, Python will erase the contents of the file before returning the file object.

#### Writing Multiple Lines

- The write() function doesn’t add any newlines to the text you write. So if you write more than one line without including newline characters, your file may not look the way you want it to. Always add `\n` whenever you want to insert in a new line.

```python
filename = 'programming.txt'
with open(filename, 'w') as file_object:
    file_object.write("I love programming.\n")
    file_object.write("I love creating new games.\n")
```

- You can also use spaces, tab characters, and blank lines to format your output, just as you’ve been doing with terminal-based output.

#### Appending to a File

```python
filename = 'programming.txt' _message.py
with open(filename, 'a') as file_object:
    file_object.write("I also love finding meaning in large datasets.\n")
    file_object.write("I love creating apps that can run in a browser.\n")
```

### Exceptions

Python uses special objects called exceptions to manage errors that arise during a program’s execution. Whenever an error occurs that makes Python unsure what to do next, it creates an exception object. If you write code that handles the exception, the program will continue running. If you don’t handle the exception, the program will halt and show a traceback, which includes a report of the exception that was raised.

#### Using try-except Blocks

```python
try:
    print(5/0)
except ZeroDivisionError:
    print("You can't divide by zero!")
```

#### The else Block

- Any code that depends on the try block executing successfully goes in the else block

```python
--snip--
while True:
    --snip--
    if second_number == 'q':
        break
    try:
        answer = int(first_number) / int(second_number)
    except ZeroDivisionError:
        print("You can't divide by 0!")
    else:
        print(answer)
```



#### The else Block : Working with Files

```python
def count_words(filename):
    """Count the approximate number of words in a file."""
    try:
        with open(filename, encoding='utf-8') as f:
            contents = f.read() 
    except FileNotFoundError:
        print(f"Sorry, the file {filename} does not exist.")
    else:
        words = contents.split()
        num_words = len(words)
        print(f"The file {filename} has about {num_words} words.")
filename = 'alice.txt'
count_words(filename)
```

#### Failing Silently : Pass

- In the previous example, we informed our users that one of the files was unavailable. But you don’t need to report every exception you catch. Sometimes you’ll want the program to fail silently when an exception occurs and continue on as if nothing happened. To make a program fail silently, you write a try block as usual, but you explicitly tell Python to do nothing in the except block. Python has a pass statement that tells it to do nothing in a block:

```python
def count_words(filename):
    """Count the approximate number of words in a file."""
    try:
        --snip--
    except FileNotFoundError:
        pass
    else:
        --snip--
filenames = ['alice.txt', 'siddhartha.txt', 'moby_dick.txt', 'little_women.txt']
for filename in filenames:
    count_words(filename)
```

### Storing Data

#### Using `json.dump()` and `json.load()`

```python
########## Storing
import json
numbers = [2, 3, 5, 7, 11, 13]
filename = 'numbers.json'
with open(filename, 'w') as f:
    json.dump(numbers, f)
########## Loading
with open(filename) as f:
    numbers = json.load(f)
    
print(numbers)
```

## Alien Invasion : Notes

```python
  if __name__ == '__main__':
        # Make a game instance, and run the game.
        ai = AlienInvasion()
        ai.run_game()
```

- We place run_game() in an if block that only runs if the file is called directly. When you run this `alien_invasion.py` file.

## Data Visualization : Notes

### Generating Data

The method `tick_params()` styles the tick marks. The arguments shown here affect the tick marks on both the `x­` and `y­axes` (axis='both') and set the font size of the tick mark labels to 14 (`labelsize`=14).

