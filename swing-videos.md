# Section 1 : Introducing spring 5.0

## Video 1.2 : what is spring ?

**Spring** : an open source java based application framework, the latest major 
stable release is version 5.0 module based

Modules include :

- Spring core container : Base module with `BeanFactory` and `ApplicationContext`
- Security : authentication / authorization (OAuth 2.0 )
- IOC : lifecycle management management with dependency injection
- MVC : Used for creating RESTful web services
- Data access : Database management systems (`jdbc` access ... ) 

**Spring Boot** : 

- Easy to use solution for creating a standalone Spring application with minimal effort & minimal configuration
- support for embedded tomcat , curated maven dependencies & simplified security
- behind the scenes, Spring boot uses Spring 5.0

---

## Video 1.3 : Choosing an IDE ?

- List of tools are available in this link  https://Spring.io/tools .
- in this tutorial we're gonna use **IntelliJ**

> check student pack for IntelliJ ultimate version

#### To create a new project :
`New project > Maven > fill groupId and artifactId > choose location > create`

---

## Video 1.4 : Setting Up Maven 

- Maven: Software project build management tool providing a standard way for creating and managing java projects .
- dependencies : packages you software relies on.

### Adding  dependencies

We start by copying this from this block from https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-parent

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.4.2</version>
    <type>pom</type>
</dependency>
```

we change it to `parent` and we delete the `type` attribute.

In `pom.xml`

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.4.2</version>
</parent>
```



**parent dependencies** : avoid redundancies and duplicate configuration in project (multiple version for example)


we add `spring-boot-starter-web` to `pom.xml`

```xml
<dependencies>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>2.4.2</version><!-- this can be deleted-->
</dependency>
</dependencies>
```



#### To Download the dependencies

`right click project > maven > download sources and documentation`

---

## Video 1.5 : Creating a Run Configuration 

### Creating the main class

In `src/main/java/main.java`

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```

### adding Run Configuration :

To add a run configuration we do :

`Add run configuration < + < Application < name it ' Demo Run ' < Select Main.java as Main Class < Apply` 


---

## Video 1.6 : Running a Spring Application


### configuring main class

We move our Main class to `com.demo` and add necessary configuration

In `src/main/java/com.demo/main.java`

```java
package com.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class,args);
    }
}
```

### Creating a Rest Controller

In `src/main/java/com.demo/RestController.java`

```java
package com.demo;

import org.springframework.web.bind.annotation.RequestMapping;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @RequestMapping("/hello")
    public String helloWorld(){
        return "hello World"; // this will return hello world as html

    }
}
```

# Section 2 : Working with Spring IOC


## Video 2.1 : Introducing IOC ?

**Inversion of control** : 

- a software design principle where parts of the software receive flow of control , for example from another framework.
- instead of the custom code calling the library . We have the framework calls the custom code.
- Used for decoupling execution of a task from actual implementation to avoid problems
- Separates **what to do** (defined by the interface) from **where to do** (a component implementing that interface)


- **Dependency Injection** :
	- one way of achieving inversion of control
	- control is inverted via setting other objects that an existing object depends on
	- Various ways (Setter-based DI / Field Based DI / Interface-based DI / Constructor-based DI)


### Example Of Inversion of control : 

**A printer that uses a document**

Instead of using the `Document`  in the `Printer` as an attribute. We create a `DocumentInterface` and we use it inside the Printer instead.



---

## Video 2.2 : Dependency Injection with Annotations

- **Annotations** : metadata that is added to java source Code
	- Examples : `@override`  and `@SuppressWarnings`
	- Are processed by annotation processors

#### Annotations in Spring

- to inject dependencies, the `@Autowired` annotation is commonly used in spring
- In addition we have (will be explained later)  :
	- `@Qualifier` (DI by qualifier)
	- `@Component` and `@ComponentScan` (DI by name)


---

## Video 2.3 : Introduction to the @Component Annotation

- **Spring Beans** : 
	- Custom objects instantiated and managed by the Spring IOC container.
	- every bean require a definition for creating the actual instances of the bean object later

- **@Component** :
	- used to mark a classes as Spring managed components -> Beans.
	-  `@ComponentScan` can be used to scan the class path and creates beans of classes annotated with `@Component`
	-  **@Bean** and **@Component** both are used to create Beans
		- @Bean : declared a bean on the method level (we annotate a method to make it return a Bean), can only be used on configuration classes(@Configuration).
		- @Component : operates on the class level

### Creating our First Bean 

- We create a class named `Greeter.java`. We Annotate it with `@Component`

In `/src/main/java/com.demo/Greeter.java`

``` java
package com.demo;
import org.springframework.stereotype.Component;

@Component
public class Greeter {
    String greet()
    {
        return hello ;
    }
}
```

---

## Video 2.4 : Introduction to the @Autowired Annotation

- Annotation for auto-wiring(resolving beans via setter , constructor , or field
- if a **field** is annotated `@Autowired(required=true)`, Spring tries to resolve the annotated field and performs dependency injection
- If the required property is set to `false`, Spring won't throw exceptions of **unresolved beans**

In `/src/main/java/com.demo/Greeter.java`

```java
import org.springframework.beans.factory.annotation.Autowired;
//...
    private Greeter greeter ;

    @RequestMapping("/hello")
    public String helloWorld(){
        return greeter.greet();

    }
//...

```



- if we want to **disable exception throwing** for a field if the bean doesn't exist

In `/src/main/java/com.demo/NotABean.java`

```java
package com.demo;
public class NotABean {
}
```

In `/src/main/java/com.demo/RestController.java`

```java
//...
@Autowired(required = false)
private NotABean notABean ;
//...
```

This will work without exceptions !

---

## Video 2.5 : Dependency Injection with the @Autowired Annotation


- the `@Autowired` annotation has different executions paths that define which way `@Autowired` dependencies are resolved
	- Match via the type (default)
	- match via  the field name
	- Match via the qualifier by an additional `@Qualifier` and using `@Component(value=specifiedValue)`


### Example


- We create an interface for our bean 

In `GreetInterface.java`

```java
package com.demo;
public interface GreetInterface {
    String greet()  ;
}

```

- now we add a second Bean implementing the same interface

In `FriendlyGreeter.java`
```java
package com.demo;

public class FriendlyGreeter implements GreetInterface{

    @Override
    public String greet() {
        return "Friendly Greeting" ;
    }
}
```


In `Greeter.java`
```java
package com.demo;

import org.springframework.stereotype.Component;

@Component
public class Greeter implements GreetInterface{

    @Override
    public String greet()
    {
        return "hello" ;
    }
}
```


In `RestController.java`

```java
//...
    @Autowired
    private GreetInterface greeter ;
    @Autowired
    private GreetInterface friendlyGreeter ;

    @RequestMapping("/hello")
    public String helloWorld(){
        return greeter.greet();
    }
    @RequestMapping("/hellofriendly")
    public String helloFriendly(){
        return friendlyGreeter.greet()  ;
    }
//...
```


***IMPORTANT*** : 

- In this case, spring uses the **Attribute Name** as an indication for **the bean that needs to be instantiated**
- If we change the **Attribute Name** (`friendlyGreeter` to `friendlyGreeter1` for example) Spring won't be able to recognize which class (Already two components implement this interface ).
- Therefore, We need to Use **@Qualifier** or **@Primary** 

### Solution 1 : Adding @Component(value="specificName")

In `Greeter.java` : We add `value` Field for `@Component`

```java
@Component(value="greeter1")
public class Greeter implements GreetInterface{
```

In `RestController.java` : We leave the name **as it is**

```java
@Autowired
private GreetInterface greeter1 ;
```

- The problem here. If we want to use the interface . We should Name our Attribute **exactly** as it's mentioned in the component.

### Solution 2 : Using @Qualifier(value="beanName")

In `RestController.java` : We add `@Qualifier` and we specify the `beanName`

```java
//...
@Autowired
@Qualifier(value="friendlyGreeter")
private GreetInterface friendlyGreeter1 ;
//...
```

### Solution 3 : Using @Primary

In `Greeter.java` : We add `value` Field for `@Component`
```java
@Component()
@Primary
public class Greeter implements GreetInterface{
    //class body
}
```

- In case of a conflict, the Primary bean will be instantiated.

# Section 3 : Working with Spring Beans

## Video 3.1 : Introduction to Spring Beans

- **@Bean** 
	- Can be used for methods in configuration classes ( annotated with `@Configuration` ), to register the **return value of a method** as a **Spring Bean**.
	- Declared at the **method** level (whereas `@Component` is declared at **class** level )
	- the bean name is the **same** as the method name  (default) 

### Example : Class Based Configuration of components

1. We delete **@Component** from our classes 

2. In `GreeterConfiguration.java` : 
	- We annotate class `@Configuration` 
	- We add methods `Greeter` and `FriendlyGreeter` , and annotate them with **@Bean** 
	- We make them return the wanted objects

```java
package com.demo;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GreeterConfiguration {

    @Bean
    public GreetInterface Greeter()
    {
        return new Greeter() ;
    }

    @Bean
    public GreetInterface FriendlyGreeter()
    {
        return new FriendlyGreeter() ;
    }
}
```








---

## Video 3.3 : Spring Bean Scopes












---

## Video 3.3 : Choosing an IDE 


---

## Video 3.4 : Choosing an IDE 

---

## Video 3.5 : Choosing an IDE 

---

## Video 1.2 : Choosing an IDE 
