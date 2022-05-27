# Qt

[TOC]

Qt is a set of libraries written in `C++`

Split into major parts
- `Qt Core` : non visual classes
- `QTWidgets` : older GUI runs on desktops
- `QML` : newer GUI runs anywhere 

## QT Core

### QtCreator 


Note : qmake was used before, CMake is more commonly used now

### Qt C++ build process

preprocessor -- > Qt runs the `MOC` (Meta object compiler) --> compiler --> linker
`CMakeLists.txt` : contains the configuration for CMake

### Output

if we want to use `std::cout` we need to use `std::cout<<flush` in order to flush the output otherwise it won't be shown

`std::cerr` : in order to output an error

- `qInfo` : general info message
- `qDebug` : Debug messages for the developer
- `qCritial` : critical info to be shown to the user
- `qFatal` : crash and show error message


If we want to capture all output messages and do special actions we can use `QtMessageHandler`



### Classes in Qt

> - Attributes are by default private in C++
> - **Qt Doesn't allow copies of `QObject`** (instead of `void test(Laptop machine)` do `void test(Laptop &machine)`)

To see the version for `cpp` we're using : in `CMakeLists.txt` -> `set(CMAKE_CXX_STANDARD 11)` (here it's 11)

#### Example

##### `animal.h`

```cpp
#ifndef ANIMAL_H
#define ANIMAL_H

#include <QObject>
#include <QDebug>

class Animal : public QObject
{
    Q_OBJECT
public:
    explicit Animal(QObject *parent = nullptr);
    void speak(QString message);

signals:

};

#endif // ANIMAL_H

```

- `Q_OBJECT` : macro that adds some attributes to us ( think of it as an `@Data` in `java` `lombok`)

- `explicit` : 

  - The compiler is allowed to make one implicit conversion to resolve the  parameters to a function. What this means is that the compiler can use  constructors callable with a **single parameter** to convert from one type to another in order to get the right type for a parameter.

  - 
  ```c++
    class Foo
    {
    private:
      int m_foo;
    
    public:
      // single parameter constructor, can be used as an implicit conversion
      Foo (int foo) : m_foo (foo) {}
    
      int GetFoo () { return m_foo; }
    };
    
    void DoBar (Foo foo)
    {
      int i = foo.GetFoo ();
    }
    
    int main ()
    {
      DoBar (42); // this will implicitly call the constructor that takes 1 integer in parameters , and will call the function `void DoBar (Foo foo)`
    }
    ```

  - using **explicit** on a construction prevents this implicit conversion

```
    public inheritance makes public members of the base class public in the derived class, and the protected members of the base class remain protected in the derived class.
    protected inheritance makes the public and protected members of the base class protected in the derived class.
    private inheritance makes the public and protected members of the base class private in the derived class.
```

##### `animal.cpp`

```cpp
#include "animal.h"


// we implemented the constructor "Animal" outside of its definition
Animal::Animal(QObject *parent)
    : QObject{parent}
{
    qInfo() << this << "Constructed";
}

void Animal::speak(QString message)
{
    qInfo() << this << message;

}
```

### Interfaces and abstract classes

- `virtual` : A virtual function is a member function which is declared within a  base class and is re-defined (overridden) by a derived class. When you  refer to a derived class object using a pointer or a reference to the  base class, you can call a virtual function for that object and execute  the derived class’s version of the function. 
  - Virtual  functions ensure that the correct function is called for an object,  regardless of the type of reference (or pointer) used for function call.
  - They are mainly used to achieve [Runtime polymorphism](https://www.geeksforgeeks.org/polymorphism-in-c/)
  - Functions are declared with a **virtual** keyword in base class.
  - The resolving of function call is done at runtime.
- The `virtual` keyword indicates that the function can be overridden in a derived class. The `= 0` syntax means that this function is purely virtual and must be overridden in any concrete derived class. 

```cpp
#ifndef TOASTER_h
#define TOASTER_h

class Toaster {
    public:
    	virtual bool grill() = 0;
}
#endif
```

```cpp
#ifndef TOASTER_h
#define TOASTER_h

class Freezer {
    public:
    	virtual bool freeze() = 0;
}
#endif
```

```cpp
#ifndef TOASTER_h
#define TOASTER_h

class Microwave {
    public:
    	virtual bool cook() = 0;
}
#endif
```

In `applicance.h`

```cpp
#ifndef APPLICANCE_H
#define APPLICANCE_H

#include <QObject>
#include <QDebug>
#include "Freezer.h"
#include "Microwave.h"
#include "Toaster.h"

class Applicance : public QObject, public Freezer, public Toaster, public Microwave
{
    Q_OBJECT
public:
    explicit Applicance(QObject *parent = nullptr);

    // Microwave interface
    bool cook();

    // Toaster interface
    bool grill();

    // Freezer interface
    bool freeze();

signals:

};

#endif // APPLICANCE_H
```

In `applicance.cpp`

```c++
#include "applicance.h"

Applicance::Applicance(QObject *parent) : QObject(parent)
{
    qInfo() << this << "Constructed";
}


bool Applicance::cook()
{
    return true;
}

bool Applicance::grill()
{
    return true;
}

bool Applicance::freeze()
{
    return true;
}
```

### References & pointers

- With pointers, we need to construct /destruct objects ourselves ( with `new` and `delete`)
- If you don't use pointers , default constructor will be called

```cpp
Qobject p ;  // one the stack, c++ manages for us
o.setObjectName(name);

Qobject *o = new Qobject(); // on the heap, we will manage this ( will not be deleted after function call, might even not be deleted after the program exits)
o->setObjectName(name); 
delete o; // we do this to delete
```

#### Automatic memory management

```cpp
std::unique_ptr<MyClass> myClass(new MyClass()); //create this in memory, will be deleted automatically even though it's a pointer
t-> doStruff()
```

#### `QObject` parent child relationships (memory management by Qt)

- When you create a child object that extends a `QObject`. When the parent `QObject` class is deleted , the child will be deleted also

```cpp
QCoreApplication(a(argc, argv));
Test *test = new Test(&a); // constructor that takes its parent in parameter
//...
return a.exec();
// QObject deleted , and so is the Test object after it
```

#### `QObject` can not be copied (because of signals & slots)

```c++
//bad
QObject getObject() {
    QObject o; 
    return o;
}

//good, but we need to delete it later
QObject* getObject() { 
	Object *o = new QObject();
    return o;
}
```

```cpp
//bad
void test(QObject object) {
    //...
}

//good
void test(QObject &object) {
    //...
}
```



### Signals & Slots

- A **signal** (event) that connects to a **slot**(handler)
- Signals are functions that do not have a definition
- Slots are like normal functions, we can emit other signals in slots
  - We can have private slots
- We use the `connect` function to connect signals and slots
- **We can have both the `signal` and the `slot` in the same class.**

In `source.h`

```c++
#ifndef SOURCE_H
#define SOURCE_H

#include <QObject>

class Source : public QObject
{
    Q_OBJECT
public:
    explicit Source(QObject *parent = nullptr);
    void test();
signals:
    void mySignal(QString message);
};

#endif // SOURCE_H

```

In `source.cpp`

```c++
#include "source.h"

Source::Source(QObject *parent)
    : QObject{parent}
{

}

void Source::test() {
    emit mySignal("Hello world!");
}
```

In `destination.h`

```cpp
#ifndef DESTINATION_H
#define DESTINATION_H

#include <QObject>
#include <QDebug>
class Destination : public QObject
{
    Q_OBJECT
public:
    explicit Destination(QObject *parent = nullptr);

public slots:
    void signalEmitted(QString message);

};

#endif // DESTINATION_H
```

In `destination.cpp`

```cpp
#include "destination.h"

Destination::Destination(QObject *parent)
    : QObject{parent}
{

}

void Destination::signalEmitted(QString message)
{
    qInfo() << "Signal emitted with message" << message;
}
```

In `main.cpp`

```cpp
Source source;
Destination destination;
QObject::connect(
    &source,
    &Source::mySignal,
    &destination,
    &Destination::signalEmitted);
source.test();
```

#### Disconnecting

 ```cpp
 QTextStream qtin(stdin); //the Qt way to read from the Stdin
 QString line = qtin.readLine().trimmed().toUpper();
 if (line == "OFF") {
     QObject::disconnect(channel, &Station::send, &boombox, &Radio::listen);
 }
 ```



#### Q_Property (property binding)

```cpp
Q_PROPERTY(QString message READ message WRITE setMessage NOTIFY messageChanged);
```



#### Types of connections 

you can specify the type of connection when we call `connect`

- `AutoConnection` : This is the default, combination of many types
- `DirectConnection` : Slot invoked immediately when the signal is emited
- `QueuedConnection` : used for threading
- `BlockedQueuedConnection` : used for threading
- `UniqueConnection` 
- `SingleShotConnection`

### Casting

#### Implicit casting

```cpp
double age = 5.75
int intAge = age ; 
```

#### Explicit casting

```cpp
double age = 5.75
int intAge = (int)age ; 
```

#### dynamic casting (alternative to polymorphism)

- The dynamic_cast operator ensures that if you convert a pointer  of class `A` to a pointer of class `B`, the object of type `A` pointed to by the former belongs to an object of type `B` or a class derived from B as a base class subobject.
- It can only be used with pointers and references
- Its purpose is to ensure that the result of the type conversion is a valid complete object of the base class

```cpp
Car* obj = dynmaic_cast<Car*>(player);
if (obj) 
    testDrive(obj);
else 
    qInfo() <<"Error while casting";
```

#### Static casting (alternative to upcasting using explicit casting)

- the static_cast operator performs a `nonpolymorphic` cast.
- for example, it can be used to cast a base class pointer into a derived class pointer

```cpp
Car* car = new Car(&a);
RaceCar* racer = static_cast<RaceCar*>(car);
```

#### `QObject` Cast

Used with classes that extend the `QObject` class to perform `downcasting` / `upcasting`

```cpp
//Derived class to the base
RaceCar* mycar = new RaceCar(&a);
Car* car = qobject_cast<Car*>(mycar);
car->drive();

//Base to the derived class
RaceCar* fastcar = qobject_cast<RaceCar*>(car);
fastcar->gofast();
```



### Exception Handling

```cpp
try {
    if (value == 0) {
        throw QString("Can not divide by zero")
    }
    if (value <1) {
        throw new std::runtime_error("should be greater than 1");
    }
}
catch (std::exception const& e) {
    qWarning() << "We Caught a std exception:" << e.what();
}
catch(QString e) {
    qWarning() << "Something went wrong:" << e;
}
catch(...) { // this is a catchall block
    qWarning() << "Something went wrong, but we don't know what";
}
```



### Templates

- we use the standard template library
  - functions : `add(T,T)`
  - containers : `List<T>`

```cpp
template<typename T>
void print(T value) {
    qInfo() << value;
}

print<int>(15);
```

#### template class

- Note: **You can not use template class with a class that extends `QObject` because they are not copyable**

```cpp
template <class T>
class Test {
    public:
    	T add(T value1, T value2) { return value1 + value2 }
}
```



### Basic Qt Classes 

#### Qt int types

```cpp
qint8 value8 = 0;
qint16 value16 = 0;
qint32 value32 = 0;
qint64 value64 = 0;
qintptr valueptr = 0;
```



#### `QDate`, `QTime`, `QDateTime`

```c++

#include <QCoreApplication>
#include <QDebug>
#include <QDate>
#include <QTime>
#include <QDateTime>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QDate today = QDate::currentDate();
    qInfo() << today;
    qInfo() << today.addDays(1);
    qInfo() << today.addYears(20);

    //Different than Qt 5
    //qInfo() << today.toString(Qt::DateFormat::SystemLocaleDate);

    qInfo() << "ISODate" << today.toString(Qt::DateFormat::ISODate);
    qInfo() << "RFC2822Date" << today.toString(Qt::DateFormat::RFC2822Date);
    qInfo() << "TextDate" << today.toString(Qt::DateFormat::TextDate);

    QTime now = QTime::currentTime();
    qInfo() << "ISODate" << now.toString(Qt::DateFormat::ISODate);
    qInfo() << "RFC2822Date" << now.toString(Qt::DateFormat::RFC2822Date);
    qInfo() << "TextDate" << now.toString(Qt::DateFormat::TextDate);

    QDateTime current = QDateTime::currentDateTime();

    qInfo() << current;
    QDateTime expire = current.addDays(45);
    qInfo() << "Expire on" << expire;


    if(current > expire)
    {
        qInfo() << "Expired!";
    }
    else
    {
        qInfo() << "Not Expired!";
    }
    return a.exec();
}
```

#### `QString`

- Qts universal string class;
- 

```c++
void test(QString name) //You can copy a QString normally (because it's not a QObject)
{
    qInfo() << name;
}


int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString name = "Bryan Cairns";
    qInfo() << name;
    qInfo() << name.mid(1,3);
    qInfo() << name.insert(0,"Mr. ");
    qInfo() << name.split(" ");

    int index = name.indexOf(" ");
    if(index > -1)
    {
        qInfo() << name.remove(0, index).trimmed();
    }

    QString title = "Teacher";
    QString full = name.trimmed() + " " + title;
    qInfo() << full;

    qInfo() << full.toUtf8();

    test(full);
    
	return a.exec();
}
```



#### `QByteArray`

...

#### `QVariant`

- Used for unknown types , it's a basic part of the meta system

```cpp
QVariant value = 1;
QVariant value2 = "Hello World";

// convert QVariant to int
bool ok = false;
int i = value.toInt(&ok);
if (ok) {
    // conversion successful
}
```

#### `QStringList`

- List of strings
- inherit from `QList<QString>`

```cpp
Qstring data ="Hello there"
QStringList lst = data.split(" ");
foreach(QString str, lst) {
    qInfo() <<str;
}
lst.sort(Qt::CaseInsensitive);
qInfo() << lst;

QString myvar = "Hello";
if (lst.contains(myvar)) {
    int index = lst.indexOf(myvar);
}
```

#### `QList`

```c++
    QString data = "Hello world how are you";
    QList<QString> list = data.split(" ");

    foreach(QString word, list)
    {
        qInfo() << word;
    }

    QList<int> age({44,56,21,13});
    age.append(99);
    age.remove(1);
    qInfo() << age;

    foreach(int word, age)
    {
        qInfo() << word;
    }
```

#### `QVector`

- **`QVector` is an alias for `QList`** and they both can be used interchangebly

## Qt Quick and QML

A typical Qt Quick application is made out of a runtime called the QmlEngine which loads the initial QML
code. The developer can register C++ types with the runtime to interface with the native code. These C++ types
can also be bundled into a plugin and then dynamically loaded using an import statement. The qmlscene and
`qml` tool are pre-made runtimes, which can be used directly.

- `qmlproject` : the project file, where the relevant project configuration is stored. This file is managed by Qt Creator, so don’t edit it yourself

In the background, Qt Creator runs qmlscene and passes your QML document as the first argument. The
`qmlscene` application parses the document, and launches the user interface

The declaration language is called QML and it needs a runtime to execute it. Qt provides a standard runtime called
qmlscene but it’s also not so difficult to write a custom runtime. For this, we need a quick view and set the main
QML document as a source. 

### QML

QML is a declarative language used to describe the user interface of your application. It breaks down the user
interface into smaller elements, which can be combined into components. QML describes the look and the be-
havior of these user interface elements. This user interface description can be enriched with JavaScript code to
provide simple but also more complex logic. In this perspective, it follows the HTML-JavaScript pattern but QML
is designed from the ground up to describe user interfaces, not text-documents

In its simplest way, QML is a hierarchy of elements. Child elements inherit the coordinate system from the parent.
An x,y coordinate is always relative to the parent.

```
// RectangleExample.qml
import QtQuick 2.5
// The root element is the Rectangle
Rectangle {
    // name this element root
    id: root
    // properties: <name>: <value>
    width: 120; height: 240
    // color property
    color: "#4A4A4A"
    
    // Declare a nested element (child of root)
    Image {
        id: triangle
        // reference the parent
        x: (parent.width - width)/2; y: 40
        source: 'assets/triangle_red.png'
    }
    
    // Another child of root
    Text {
        // un-named element
        // reference element by id
        y: triangle.y + triangle.height + 20
        // reference root element
        width: root.width
        
        color: 'white'
        horizontalAlignment: Text.AlignHCenter
        text: 'Triangle'
    }
}
```

- The import statement imports a module in a specific version.
- Comments can be made using // for single line comments or /* */ for multi-line comments. Just like in
  C/C++ and JavaScript
- very QML file needs to have exactly one root element, like HTML
- An element is declared by its type followed by { }
- Elements can have properties, they are in the form  `name: value`
- Arbitrary elements inside a QML document can be accessed by using their id (an unquoted identifier)
- Elements can be nested, meaning a parent element can have child elements. The parent element can be
  accessed using the parent keyword
- The import statement you import a specific version of a module. For the QML modules that comes with Qt 
- the version is linked to the Qt version you intend to use. The lower the version number, the earlier Qt version
  can be used. The minor version of the import statement matches the minor version of the Qt release, so Qt
  5.11 corresponds to QtQuick 2.11, Qt 5.12 to QtQuick 2.12 and so on. Prior to Qt 5.11, the QML modules
  shipped with Qt had their own versioning sequences, meaning that QtQuick followed the Qt versions, while
  `QtQuick.Controls` started with version 2.0 at Qt 5.7 and was at version 2.4 by Qt 5.11.

> Tip: Often you want to access a particular element by id or a parent element using the parent keyword. So it’s
> good practice to name your root element “root” using id: root. Then you don’t have to think about how the
> root element is named in your QML document.
>
> You can run the example using the Qt Quick runtime from the command line from your OS like this:
> ```bash
> $QTDIR/bin/qmlscene RectangleExample.qml
> ```

#### Properties

```
Text {
    // (1) identifier
    id: thisLabel
    
    // (2) set x- and y-position
    x: 24; y: 16
    
    // (3) bind height to 2 * width
    height: 2 * width
    
    // (4) custom property
    property int times: 24
    
    // (5) property alias
    property alias anotherTimes: thisLabel.times
    
    // (6) set text appended by value
    text: "Greetings " + times
    
    // (7) font is a grouped property
    font.family: "Ubuntu"
    font.pixelSize: 24
    
    // (8) KeyNavigation is an attached property
    KeyNavigation.tab: otherLabel
    
    // (9) signal handler for property changes
    onHeightChanged: console.log('height:', height)
    
    // focus is need to receive key events
    focus: true
    
    // change color based on focus value
    color: focus?"red":"black"
}
```

1. id is a very special property-like value, it is used to reference elements inside a QML file (called “document” in QML). The id is not a string type but rather an identifier and part of the QML syntax. An id needs to be unique inside a document and it can’t be reset to a different value, nor may it be queried. (It behaves much like a reference in the C++ world.)

2. A property can be set to a value, depending on its type. If no value is given for a property, an initial value will be chosen. You need to consult the documentation of the particular element for more information about the initial value of a property.

3. A property can depend on one or many other properties. This is called binding. A bound property is updated when its dependent properties change. It works like a contract, in this case, the height should always be two times the width.

4. Adding own properties to an element is done using the property qualifier followed by the type, the name and the optional initial value (`property <type> <name> : <value>`). If no initial value is given a system initial value is chosen.

   > Note: You can also declare one property to be the default property if no property name is given by prepending the property declaration with the default keyword. This is used for example when you add child elements, the child elements are added automatically to the default property children of type list if they are visible elements.

5. Another important way of declaring properties is using the alias keyword (property alias `<name>: <reference>`). The alias keyword allows us to forward a property of an object or an object itself from within the type to an outer scope. We will use this technique later when defining components to export the inner properties or element ids to the root level. A property alias does not need a type, it uses the type of the referenced property or object.

6. The text property depends on the custom property times of type int. The int based value is automatically converted to a string type. The expression itself is another example of binding and results in the text being updated every time the times property changes.

7. Some properties are grouped properties. This feature is used when a property is more structured and related properties should be grouped together. Another way of writing grouped properties is `font { family:` `"Ubuntu"; pixelSize: 24 }`.

8. Some properties are attached to the element itself. This is done for global relevant elements which appear only once in the application (eg. keyboard input). The writing is `<Element>.<property>:` `<value>`.

9. For every property, you can provide a signal handler. This handler is called after the property changes. For example, here we want to be notified whenever the height changes and use the built-in console to log a message to the system

> Warning: An element id should only be used to reference elements inside your document (e.g. the current file). QML provides a mechanism called dynamic-scoping where later loaded documents overwrite the element id’s from earlier loaded documents. This makes it possible to reference element id’s from earlier loaded documents if they are not yet overwritten. It’s like creating global variables. Unfortunately, this frequently leads to really bad code in practice, where the program depends on the order of execution. Unfortunately, this can’t be turned off. Please only use this with care or even better don’t use this mechanism at all. It’s better to export the element you want to provide to the outside world using properties on the root element of your document.

#### Scripting

We can use javascript

```
Text {
    id: label
    x: 24; y: 24
    
    // custom counter property for space presses
    property int spacePresses: 0
    text: "Space pressed: " + spacePresses + " times"
    
    // (1) handler for text changes
    onTextChanged: console.log("text changed to:", text)
    
    // need focus to receive key events
    focus: true
    
    // (2) handler with some JS
    Keys.onSpacePressed: {
    increment()
    }
    
    // clear the text on escape
    Keys.onEscapePressed: {
    label.text = ''
    }
    
    // (3) a JS function
    function increment() {
    spacePresses = spacePresses + 1
    }
}
```



> **Note**: The difference between the QML : (binding) and the JavaScript = (assignment) is, that the binding is a contract and keeps true over the lifetime of the binding, whereas the JavaScript assignment (=) is a one time value assignment. The lifetime of a binding ends, when a new binding is set to the property or even when a JavaScript value is assigned is to the property. For example, a key handler setting the text property to an empty string would destroy our increment display:
>
> ```
> Keys.onEscapePressed: {
> label.text = ''
> }
> ```
>
> After pressing escape, pressing the space-bar will not update the display anymore as the previous binding of the text property (`text: “Space pressed: ” + spacePresses + ” times”`) was destroyed. When you have conflicting strategies to change a property as in this case (text updated by a change to a property increment via a binding and text cleared by a JavaScript assignment) then you can’t use bindings! You need to use assignment on both property change paths as the binding will be destroyed by the assignment (broken contract!).

#### Basic Elements

Elements can be grouped into visual and non-visual elements. A visual element (like the Rectangle) has a geometry and normally presents an area on the screen. A non-visual element (like a Timer) provides general functionality, normally used to manipulate the visual elements.

Currently, we will focus on the fundamental visual elements, such as Item, Rectangle, Text, Image and MouseArea. However, by using the Qt Quick Controls 2 module, it is possible to create user interfaces built from standard platform components such as buttons, labels and sliders.

##### Item Element

Item is the base element for all visual elements as such all other visual elements inherits from Item. It doesn’t
paint anything by itself but defines all properties which are common across all visual elements



- **Geometry** : `x` and `y` to define the top-left position, `width` and `height` for the expansion of the
  element and also the `z` stacking order to lift elements up or down from their natural
  ordering
- **Layout handling** : anchors (`left`, `right`, `top`, `bottom`, `vertical` and `horizontal` `center`) to position elements
  relative to other elements with their margins
- **Key handling** : attached `Key` and `KeyNavigation` properties to control key handling and the input
  focus property to enable key handling in the first place
- **Transformation** : scale and rotate transformation and the generic transform property list for x,y,z
  transformation and their `transformOrigin` point
- **Visual** : `opacity` to control transparency, `visible` to show/hide elements, `clip` to restrain
  paint operations to the element boundary and `smooth` to enhance the rendering quality
- **State definition** : states list property with the supported list of states and the current state property
  as also the transitions list property to animate state changes.



##### Rectangle Element

The `Rectangle` extends `Item` and adds a fill color to it. Additionally it supports borders defined by `border`.
`color` and `border.width`. To create rounded rectangles you can use the `radius` property.

```
Rectangle {
    id: rect1
    x: 12; y: 12
    width: 76; height: 96
    color: "lightsteelblue"
}
    Rectangle {
    id: rect2
    x: 112; y: 12
    (continues on next page)
    36 Chapter 4. Quick Starter
    Qt5 Cadaques, Release master
    (continued from previous page)
    width: 76; height: 96
    border.color: "lightsteelblue"
    border.width: 4
    radius: 8
}
```

> Note: Valid colors values are colors from the `SVG` color names (see http://www.w3.org/TR/css3-color/
> \#svg-color). You can provide colors in QML in different ways, but the most common way is an RGB string
> (‘#FF4444’) or as a color name (e.g. ‘white’).
>
> Note: A rectangle with no width/height set will not be visible. This happens often when you have several
> rectangles width (height) depending on each other and something went wrong in your composition logic.

##### Text Element

To display text, you can use the Text element. Its most notable property is the text property of type string.
The element calculates its initial width and height based on the given text and the font used. The font can be
influenced using the font property group (e.g. font.family, font.pixelSize, . . . ). To change the color
of the text just use the color property

```
Text {
    text: "The quick brown fox"
    color: "#303030"
    font.family: "Ubuntu"
    font.pixelSize: 28
}
```

## Notes From a book : Mastering Qt 5

### Qt project basic structure : To do Example

Setting the C version , in `CMakeLists.txt`

```
set(CMAKE_CXX_STANDARD 14)
```

Setting source files, in `CMakeLists.txt`

```
set(PROJECT_SOURCES
        main.cpp
        mainwindow.cpp
        mainwindow.h
        mainwindow.ui
)
```

- `mainwindow.ui` : designer file for out main window
- `mainwindow.cpp` : source
- `mainwindow.h` : header

#### `Main.cpp`

```cpp
#include "MainWindow.h"
#include <QApplication>
int main(int argc, char *argv[])
{
QApplication a(argc, argv);
MainWindow w;
w.show();
return a.exec();
}
```

Usually, the main.cpp file contains the program entry point. It will, by default, perform three actions:

- Instantiate `QApplication`
- Instantiate and show your main window
- Execute the blocking main event loop

#### `MainWindow` structure

##### `mainwindow.h`

It's important to take a look at the `MainWindow.h` header file. Our `MainWindow` object inherits from Qt's `QMainWindow` class

```cpp
#include <QMainWindow>
namespace Ui {
    class MainWindow;
}
class MainWindow : public QMainWindow
{
    Q_OBJECT
    public:
        explicit MainWindow(QWidget *parent = 0);
        ~MainWindow();
    private:
        Ui::MainWindow *ui;
};
```

As our class inherits from the `QMainWindow` class, we will have to add the corresponding #include at the top of the header file. The second part is the forward declaration of `Ui::MainWindow`, as we only declare a pointer.

`Q_OBJECT` can look a little strange to a non-Qt developer. This macro allows the class to define its own signals/slots through Qt's meta-object system.

This class defines a public constructor and destructor. The latter is pretty common but the constructor takes a parent parameter. This parameter is a `QWidget` pointer that is `null` by default.

`QWidget` is a UI component. It can be a label, a textbox, a button, and so on. **If you define a parent-child relationship between your window, layout, and other UI widgets, the memory management of your application will be easier. Indeed, in this case, deleting the parent is enough because its destructor will take care of also deleting its child recursively.**

Our `MainWindow` class extends `QMainWindow` from the Qt framework. We have a ui member variable in the private fields. Its type is a pointer of `Ui::MainWindow`, which is defined in the `ui_MainWindow.h` file generated by Qt. It's the C++ transcription of the `MainWindow.ui` UI design file. The ui member variable will allow you to interact with your C++ UI components (`QLabel`, `QPushButton`, and so on), as shown in the following figure:


> If your class only uses pointers or references for a class type, you can avoid including the header by using forward declaration. That
> will drastically reduce compilation time and avoid circular dependencies.

##### `mainwindow.cpp`

```cpp
#include "mainwindow.h"
#include "./ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
}

MainWindow::~MainWindow()
{
    delete ui;
}

```

the first include is our class header. The second one is required by the generated `Ui::MainWindow` class. This include is required as we only use a forward declaration in the header

The parent argument is used to call the `QMainWindow` superclass constructor. Our `ui` private member variable is also initialized.

Now that `ui` is initialized, we must call the `setupUi` function to initialize all the widgets used by
the `MainWindow.ui` design file. As the pointer is initialized in the constructor, it must be cleaned in the destructor:

#### Signals and slots : reminder

The Qt framework offers a flexible message-exchange mechanism that is composed of three concepts:

- signal is a message sent by an object
- slot is a function that will be called when this signal is triggered
- The connect function specifies which signal is linked to which slot

Qt already provides signals and slots for its classes, which you can use in your application. For example, `QPushButton` has signal clicked(), which will be triggered when the user clicks on the button. Another example: the `QApplication` class has a slot quit() function, which can be called when you want to terminate your application.

##### properties of signals and slots 

- A slot remains an ordinary function, so you can call it yourself
- A single signal can be linked to different slots
- A single slot can be called by different linked signals
- A connection can be made between a signal and a slot from different objects, and even between objects living inside different threads

Keep in mind that to be able to connect a **signal** to a **slot**, **their methods' signatures must match**. The count, order, and type of arguments must be identical. Note that signals and slots never return values.

This is the syntax of a Qt connection: `connect(sender, &Sender::signalName,receiver, &Receiver::slotName);`

The first test that we can do to use this wonderful mechanism is to connect an existing signal with an existing slot. We will add this connect call to the `MainWindow` constructor:

```cpp
MainWindow::MainWindow(QWidget *parent) :
QMainWindow(parent),
ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    connect(ui->addTaskButton, &QPushButton::clicked, QApplication::instance(), &QApplication::quit);
}
```

- `sender` :  Object that will send the signal. In our example, the `QPushButton` named `addTaskButton` is
  added from the UI designer.
- `&Sender::singalName` : Pointer to the member signal function. Here, we want do something when the clicked signal is triggered
- `receiver`: Object that will receive and handle the signal. In our case, it is the `QApplication`
  object created in `main.cpp`.
- `&Receiver::slotName`: Pointer to one of the receiver's member slot functions. In this example, we
  use the built-in `quit()` slot from `QApplication`, which will exit the application.

##### Custom Slot

let's declare and implement a custom `addTask()` slot in our `MainWindow` class. This slot will be called when the user
clicks on `ui->addTaskButton`.

In `MainWindow.h`  we add our slot

```cpp
class MainWindow : public QMainWindow
{
	Q_OBJECT
public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();
public slots:
	void addTask();
private:
	Ui::MainWindow *ui;
};
```

Qt uses a specific slots keyword to identify slots. Since a slot is a function, you can always adjust the visibility (`public`, `protected`, or `private`) depending on your needs.

In `MainWindow.cpp` we add the implementation of the slot, we also connect the signal and the slot in the constructor

```cpp
#include <QDebug>
void MainWindow::addTask()
{
	qDebug() << "User clicked on the button!";
}

MainWindow::MainWindow(QWidget *parent) : QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    connect(ui->addTaskButton, &QPushButton::clicked,
    this, &MainWindow::addTask);
}
```

#### Custom `QWidget` : Task class

We now have to create the Task class that will hold our data (task name and completed status).
This class will have its form file separated from `MainWindow`. Qt Creator provides an automatic tool
to generate a base class and the associated form.

Click on File | New File or Project | Qt | Qt Designer Form Class. There are several form templates; you will recognize Main Window, which Qt Creator created for us when we started the `todo` app project. Select Widget and name the class `Task`, then click on Next. Here is a summary of what Qt Creator will do:

1. Create a `Task.h` file and `Task.cpp` file
2. Create the associated `Task.ui` and do the plumping to connect `Task.h`
3. Add these freshly created files to our `CMakeLists.txt` configuration so they can be compiled

Start by dragging and dropping `checkbox` `(objectName = checkbox)` and `Push Button` `(objectName = removeButton)`

---
We have several default layout classes

- `Vertical Layout`: Widgets are vertically stacked.
- `Horizontal Layout`: Widgets are horizontally stacked.
- `Grid Layout`: Widgets are arranged in a grid that can be subdivided into smaller cells.
- `Form Layout`: Widgets are arranged like a web form, a label, and an input.

A basic layout will try to constrain all its widgets to occupy equal surfaces. It will either change the widgets' shape or add extra margins, depending on each widget's constraints. `Check Box` will not be stretched but `Push Button` will

---

In our `Task` object, we want this to be horizontally-stacked. In the Form Editor tab, right-click on the window and select Lay out | Lay out Horizontally. Each time you add a new widget in this layout, it will be arranged horizontally.

you can note that the push buttons are stretched. It looks bad. We need something to "hint" to the layout that these buttons should not be stretched. Enter the Spacer widget. Take Horizontal Spacer in the widget box and drop it after the `checkbox` object

A spacer is a special widget that tries to push (horizontally or vertically) adjacent widgets to force them to take up as little space as possible. The `editButton` and `removeButton` objects will take up only the space of their text and will be pushed to the edge of the window when resized.

##### Creating the Model

Since we created a Qt Designer Form class, Task is closely linked to its UI. We will use this as a leverage to store our model in a single place. When we create a Task object, it has to have a name:

```cpp
#ifndef TASK_H
#define TASK_H
#include <QWidget>
#include <QString>
namespace Ui {
	class Task;
}
class Task : public QWidget
{
    Q_OBJECT
    public:
        explicit Task(const QString& name, QWidget *parent = 0);
        ~Task();
        void setName(const QString& name);
        QString name() const;
        bool isCompleted() const;
    private:
        Ui::Task *ui;
};
#endif // TASK_H
```

The constructor specifies a name and, as you can see, there are no private fields storing any state of the object. All of this will be done in the form part. We also added some getters and setters that will interact with the form. It's better to have a model completely separated from the UI, but our example is simple enough to merge them. Moreover, the Task implementation details are hidden from the outside world and can still be refactored later on. Here is the content of the `Task.cpp` file:

```cpp
#include "task.h"
#include "ui_task.h"

Task::Task(const QString& name, QWidget *parent) :
    QWidget(parent),
    ui(new Ui::Task)
{
    ui->setupUi(this);
    this->setName(name);
}

Task::~Task()
{
    delete ui;
}

void Task::setName(const QString& name) {
    ui->checkbox->setText(name);
}

QString Task::name() const {
    return ui->checkbox->text();
}

bool Task::isCompleted() const {
    return ui->checkbox->isChecked();
}

```

The implementation is straightforward; we store the information in `ui->checkbox` and both the `name()`
and the `isCompleted()` getters take their data from `ui->checkbox`.

##### Adding a task

We will now rearrange the layout of `MainWindow` to be able to display our todo tasks. At this moment, there is no widget where we can display our tasks. Open the `MainWindow.ui` file. We will use Qt designer to create the UI:

1. Drag and drop Horizontal layout inside the central widget and rename it `toolbarLayout`
2. Right-click on the central widget and select Lay out vertically
3. Drag and drop the label, spacer, and button **inside** `toolbarLayout`
4. Drag and drop Vertical layout under `toolbarLayout` (a blue helper line will be displayed) and
   rename it `tasksLayout`
5. Add a vertical spacer under `tasksLayout` (again, check the blue helper line)

To sum up, we have:

- A vertical layout for `centralWidget` that contains the `toolbarLayout` item and the `tasksLayout` item.
- A vertical spacer pushing these layouts to the top, forcing them to take up the smallest possible space.
- Gotten rid of `menuBar`, `mainToolBar`, and `statusBar`. Qt Creator created them automatically, we simply don't need them for our purposes. You can guess their uses from their names.

Now that the `MainWindow` UI is ready to welcome tasks, let's switch to the code part. The application has to keep track of new tasks. Add the following in the `MainWindow.h` file:

```cpp
//...
#include "Task.h"
class MainWindow : public QMainWindow {
//...
    private:
    	Ui::MainWindow *ui;
    	QVector<Task*> mTasks;
}
```

> The `QVector`(aka `QList`) is the Qt container class providing a dynamic array, which is an equivalent of std::vector. Generally speaking, the rule says that `STL` containers are more customizable, but they may miss some features compared to Qt containers. If you use C++11 smart pointers, you should favor std containers.

In `MainWindow.cpp` we initialize our `QVector` and connect our signal to our slot

```cpp
MainWindow::MainWindow(QWidget *parent) : QMainWindow(parent), ui(new Ui::MainWindow), mTasks()
{
    ui->setupUi(this);
    connect(ui->addTaskButton, &QPushButton::clicked,
    this, &MainWindow::addTask);
}
```

> **As a best practice, try to always initialize member variables in the initializer list and respect the order of variable declarations. Your code will run faster and you will avoid unnecessary variable copies. For more information, take a look at the standard C++**

In `MainWindow.cpp` The body of the `addTask()` function should look like this:

```cpp
void MainWindow::addTask()
{
    qDebug() << "Adding new task";
    Task* task = new Task("Untitled task");
    mTasks.append(task);
    ui->tasksLayout->addWidget(task);
}
```

#### Custom `QWidget` : Notes on Memory Management

We created a new task and added it to our `mTask` vector. Because the Task object is a `QWidget`, we also added it directly to `tasksLayout`. An important thing to note here is that we never managed our new task's memory. Where is the delete task instruction? This is a key feature of the Qt Framework we started to mention earlier in the chapter; the `QObject` class parenting automatically handles object destruction.

In the preceding code snippet, the `ui->tasksLayout->addWidget(task)` call has an interesting side-effect: the ownership of the task is transferred to the layout's widget. The `QObject*` parent defined in the Task constructor is now `centralWidget` of the `MainWindow`. The Task destructor will be called when `MainWindow` releases its own memory by recursively iterating through its children and calling their destructor.

This feature has interesting consequences. First, if you use the `QObject` parenting model in your application, you will have much less memory to manage. Second, it can collide with some new C++11 semantics, specifically the smart pointers.

#### Using a `QDialog`

We deserve something better than an untitled task. The user needs to define its name when created. The easiest path would be to display a dialog where the user can input the task name. Fortunately, Qt offers us a very configurable dialog that fits perfectly in `addTask()`

```cpp
#include <QInputDialog>
...
void MainWindow::addTask()
{
    bool ok;
    QString name = QInputDialog::getText(this, tr("Add task"), tr("Task name"), QLineEdit::Normal, tr("Untitled task"), &ok);
    if (ok && !name.isEmpty()) {
        qDebug() << "Adding new task";
        Task* task = new Task(name);
        mTasks.append(task);
        ui->tasksLayout->addWidget(task);
    }
}
```

The `QinputDialog::getText` function is a static blocking function that displays the dialog. When the
user validates/cancels the dialog, the code continues. If we run the application and try to add a new task:

The `QInputDialog::getText` **signature** looks like this:

```cpp
QString QinputDialog::getText(
    QWidget* parent,
    const QString& title,
    const QString& label,
    QLineEdit::EchoMode mode = QLineEdit::Normal,
    const QString& text = QString(),
    bool* ok = 0, ...)
```

- `parent` : This is the parent widget (`MainWindow`) to which `QinputDialog` is attached. This is another instance of the `QObject` class's parenting model.
- `title` : This is the title displayed in the window title. In our example, we use `tr("Add task")`, which is how Qt handles **`i18n`** in your code. Later, we will see how to provide multiple translations for a given string.
- `label` : This is the label displayed right above the input text field.
- `mode` : This is how the input field is rendered (password mode will hide the text).
- `ok` : This is a pointer to a variable that is set to true if the user presses OK and false if the user presses Cancel.
- **return Type** : `Qstring` 

#### Distributing code responsibility

We add the renaming feature to the `Task` class (in order for it to be as autonomous as possible)

```cpp
// In Task.h
public slots:
	void rename();

// In Task.cpp
#include <QInputDialog>
Task::Task(const QString& name, QWidget *parent) : QWidget(parent), ui(new Ui::Task)
{
    ui->setupUi(this);
    setName(name);
    connect(ui->editButton, &QPushButton::clicked, this, &Task::rename);
}
//...
void Task::rename()
{
    bool ok;
    QString value = QInputDialog::getText(this, tr("Edit task"),
    tr("Task name"),
    QLineEdit::Normal,
    this->name(), &ok);
    if (ok && !value.isEmpty()) {
	    setName(value);
    }
}
```

The nice thing is that Task::rename() is completely autonomous. Nothing has been modified
in `MainWindow`, so we have effectively zero coupling between our Task and the parent `QWidget`.

#### Emitting a custom signal using lambdas

The remove task is straightforward to implement, but we'll study some new concepts along the
way. The Task has to **notify** its owner and **parent** (the `MainWindow`) that the `removeTaskButton QPushButton`
has been clicked. We'll implement this by defining a custom removed signal in the `Task.h` files

```cpp
class Task : public QWidget
{
//...
public slots:
	void rename();
signals:
	void removed(Task* task);
//...
};
```

**IMPORTANT : Here, we connected the clicked signal to an anonymous inline function, a lambda. Qt allows signal-relaying by connecting a signal to another signal if their signatures match. It's not the case here: the clicked signal has no parameter and the removed signal needs a Task*. A lambda avoids the declaration of a verbose slot in Task. Qt 5 accepts a lambda instead of a slot in a connect, and both syntaxes can be used.**

---

Lambdas are a great addition to C++. They offer a very practical way of defining short functions in your code. Technically, a lambda is the construction of a closure capable of capturing variables in its scope. The full syntax goes like this:

```
[ capture-list ] ( params ) -> ret { body }
```

- `capture-list`: Defines what variables will be visible inside the lambda scope.
- `params`: This is the function parameter's type list that can be passed to the lambda scope. There are no parameters in our case. We might have written `[this] () { ... }`, but C++11 lets us skip the parentheses altogether.
- `ret`: This is the return type of the `lambda` function. Just like `params`, this parameter can be
  omitted if the return type is `void`.
- `body`: This is obviously your code body where you have access to your `capture-list` and `params`,
  and which must return a variable with a `ret` type.

In our example, we captured the this pointer to be able to:

- Have a reference on the `removed()` function, which is part of the `Task` class. If we did not
  capture this, the compiler would have shouted `error: 'this' was not captured for this lambda`
  `function emit removed(this);.`
- Pass `this` to the `removed` signal: the caller needs to know which task triggered `removed`.

---

The task now emits the removed() signal. This signal has to be consumed by `MainWindow`

```cpp
// in MainWindow.h
public slots:
	void addTask();
	void removeTask(Task* task);

// In MainWindow.cpp
void MainWindow::addTask() {
    //...
    if (ok && !name.isEmpty()) {
        qDebug() << "Adding new task";
        Task* task = new Task(name);
        connect(task, &Task::removed, this, &MainWindow::removeTask);
    //...
	}
}

void MainWindow::removeTask(Task* task) {
    mTasks.removeOne(task);
    ui->tasksLayout->removeWidget(task);
    delete task;
}
```

`MainWindow::removeTask()` must match the signal signature. The connection is made when the task is created. The interesting part comes in the implementation of `MainWindow::removeTask()`.

The task is first removed from the `mTasks` vector. It is then removed from `tasksLayout`. The last step is to delete Task. The destructor will unregister itself from `centralWidget` of `MainWindow`. In this case, we don't rely on the Qt hierarchical parent-children system for the `QObject` life cycle because we want to delete Task before the destruction of `MainWindow`.

#### Simplifying with the `auto` type and a range-based `for loop`

The final step to a complete CRUD of our tasks is to implement the completed task feature. We'll implement the following:

- Click on the checkbox to mark the task as completed
- Strike the task name
- Update the status label in `MainWindow`

The checkbox click-handling follows the same pattern as `removed`:

```cpp
// In Task.h
signals:
    void removed(Task* task);
    void statusChanged(Task* task);
private slots:
	void checked(bool checked);
// in Task.cpp
Task::Task(const QString& name, QWidget *parent) :
QWidget(parent),
ui(new Ui::Task)
{
//...
    connect(ui->checkbox, &QCheckBox::toggled,
    this, &Task::checked);
}
//...
void Task::checked(bool checked)
{
    QFont font(ui->checkbox->font());
    font.setStrikeOut(checked);
    ui->checkbox->setFont(font);
    emit statusChanged(this);
}
```

We define a `checked(bool checked)` slot that will be connected to the `QCheckBox::toggled` signal. In slot checked(), we strike out the checkbox text according to the `bool` checked value. This is done by using the `QFont` class. We create a copied font from `checkbox->font()`, modify it, and assign it back to `ui->checkbox`. Event if the original font was in bold or with a special size, its appearance would still be guaranteed to stay the same.

The last instruction notifies `MainWindow` that the Task status has changed. The signal name
is `statusChanged`, rather than `checkboxChecked`, in order to hide the implementation details of the task.

In `MainWindow.h` we add our `connect` function , the rest is straightforward


