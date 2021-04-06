# Course 1 : M100

## Chapter 1 

### Lecture : MongoDB in Five Minutes

- data is stored in records called **documents**

- Features of MongoDB :
  -  Fault Tolerance : data stored across multiple servers (many copies)
  -  Scalability : scales across servers
  - Transparency : You can move data where you need it
  - MongoDB as a service (MongoDB Atlas) : available in AWS, azure ...

**The MongoDB query language is optimized to pull data from many collections at once.**

> This is **incorrect**.
>
> Pulling data from many collections, like Relational Databases Management Systems do, is inefficient.
>
> MongoDB uses the power of the Document Model to keep information that needs to be retrieved together in the same location.

### NoSQL Databases :

- 4 families of No SQL databases :
  - Key value :
    - key (primary key) points to the information
    - Database can be partitioned
    - Features :
      - Redundant Data on servers
      - Automatic  Failovers
      - Server Failures tolerance 
    - Limited access to Primary key
  - Graph : 
    - Relations within table 
    - SQL statements with self-joins
  - column oriented 
    - each data is stored in a column 
    - data is polymorphic
  - document oriented
    - Polymorphic data structures
    - Obvious relationships using embedded arrays and documents
    - Easy and natural representation
    - o complex mapping between application data and database

### Database Terminology

- Table -> collection 
- row -> Document
- column -> field

### The Document Model



- a Document : 
  - A way to organize and store data as a set of field-value pairs.
  - Similar to :
    - Dictionaries in Python
    - Maps in Java
    - JSON Object in JavaScript
  - Document model Constructs :
    - Fields (attributes)
    - Sub-documents(Nested Documents or Objects)
      - Allows to group information together (One to One Relationship)
    - Arrays 
      - Can contain values / objects (a One-to-Many Relationship)
- MongoDB uses what we call **BSON** (Binary JSON)
  - Physical storage of Document
  - `int`, `long`, `float`, `decimal` data types (JSON only supports `number`)

- Summary
  - models relationships with sub-document and arrays
  - keep the information used together stored together
  - map easily to the data structures of our code



### ACID with Transactions and Documents

- Atomicity : transactions are all or nothing
- Consistency : Only valid data is saved
- Isolation : Transactions do not affect each other
- Durability : Written data will not be lost

Example ACID in MongoDB : 

- Atomic :All writes to one document are done at once
- Consistency : no dependency on other documents
- Isolation : document being modified not seen by other reads
- Durability : guaranteed by doing a write with a "majority" concern

ACID with a MongoDB Transaction(action across multiple collections)

- Atomic : all writes to all documents are committed are once
- Consistency : all checks are done within the transaction
- Isolation : guaranteed through a "snapshot" isolation level
- Durability : guaranteed by default : the write has a "majority" concern.



**Summary** :

- Fewer transactions means minimal performance impact
- avoid long running transactions
- Prefer the Document Model to limit updates to a single document to achieve ACID, over transactions

### Distributed Database Considerations

- many servers
- process need to talk to each other
- network speed

- Common Deployments : 
  - Replica  Set :
    - a Set of Servers (commonly 3 servers ) that each have a complete copy of the DB (high availability + data availability)
    - from now and then an election of the primary node (primary server of the 3) will be held automatically
  - Sharded Cluster :
    - a Group of replica sets
      - used to :
        - partition a data set into many servers
        - placing data close to the users



### Read / Writes Operation Guarantees

- Contracts between the application and the database server on aspects like durability and staleness

- **Operation Guarantees/Configurations**
  - **Write concern** : the contract of durability between an application and a mongodb server where the writes happen
    - mongodb writes to the primary member of the replica or of the shards then the writes will be replicated to all members of a replica set automatically 
    - **Write concern of one** : waiting for the ack from the primary member
    - **Write concern of majority** : waiting for the ack from the secondary members
  - **Read concern** :
    - **Read  Concern local** : the application gets the latest information written to a node which it connect to 
    - **Read concern majority** : ...
  - **Read preference** : The default is to read from the primary node
    - **Read preference nearest** : read from the closest possible node to the application
    - Second type  : read from a dedicated node (for example analytics node )

- IMPORTANT : Mongodb always writes to the primary member of the replica set / of the shards
- you can use a global global clusters  to direct some write operations to a certain server (easy to deploy in )

SUMMARY : 

- `writeConcern` : is the durability guarantee of a write operation
- `readConcern` : is the guarantee that a read operation will get durable data
- `readPreference` : the preferred node to read from 

## Chapter 2 : Modeling for MongoDB

### Flexible Methodology for Data Modeling 

- Many ways to model data 
- Methodologies for :
  - conceptual model
  - logical model
  - physical model

- Emphasis on **Workload**
- **Simple Methodology** (3 phases)
  - phase 1 : description of the workload : size data , quantity ops , quality ops
    - **understand**  : what operations are modeling for 
    - **quantify and qualify** : read and write operations
    - **outputs** : list of operations
    - which of theses are the most important ones
  - phase 2 : identify Relationships( like an ER  diagram) : identify , quantify , embed or link
    - similar to relational modeling :
      - one-to-one  (generally on one document) 
      - one-to-many and many-to-many (either embedding in same document / link the documents)*
  - phase 3 : Apply patterns (like denormalization)
    - transformations : address performance, maintenance, or simplicity requirements



# Course 2 : M001

## Chapter 1 : What is MongoDB ?

### Atlas User Interface

- A cluster has a set of databases
- Each database has a couple of collections
- Each collections has documents, these documents can have different structures

- 0.0.0.0 will give access to **everyone** to the cluster.
- 2 ways to access data :
  - through the website (select cluster then click collections)
  - through the shell 



### In-Browser IDE

### How does MongoDB store data?

- Data is stored in BSON (not human readable) and visualized in JSON
  - offers speed , flexibility ... over JSON.

## Chapter 2 : Importing & Exporting

- **drop** clears the database before inserting

```shell
mongodump --uri "mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies"

mongoexport --uri="mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies" --collection=sales --out=sales.json

mongorestore --uri "mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies"  --drop dump

mongoimport --uri="mongodb+srv://<your username>:<your password>@<your cluster>.mongodb.net/sample_supplies" --drop sales.json
```

### Data Explorer

#### Using Atlas UI

- Using the atlas UI , we go to collection
- we then select the wanted collection by searching `db_name.collection_name` and then write our filter to find the data

Example : 

```json
{"state":"NY", "city" : "ALBANY"}
```

This will return documents with matching state and city

#### Using Shell

> A fully functional JavaScript interpreter

- To select a Database : 

  ```
  use db_name
  ```

- To show Databases :

  ```
  show dbs
  ```

- To show collection in a specific Database

  ```
  show collections
  ```



### Find command

```shell
db.zips.find({"state": "NY"})
```

- `it` iterates through the cursor. (if it show 20 per page , `it` will show the next 20)

- To Count the number of documents in the result:

```shell
db.zips.find({"state": "NY"}).count()
```

- To prettify : 

```shell
db.zips.find({"state": "NY", "city": "ALBANY"}).pretty()
```





## Chapter 3  : Inserting New Documents 

### Inserting New Documents - ObjectId (Check M320 after this)

- ObjectId() : Gives unique value to `_id` (it is the default value unless otherwise specified)

### Inserting New Documents - insert() and errors

```shell
db.<collection-name>.insert({document});
```



- Final remarks : 
  - We can insert two duplicate documents, as long as the `_id` is different
  - if we don't provide a`_id` field, it will be automatically generated 

### Inserting New Documents - insert() order

- Inserting multiple documents

```
db.inspections.insert([ { doc1 }, { doc2 }, { doc3 } ])
```



#### ordered parameter

- This will insert test1 (is is sequential in the insertion, one error and it stops)

```
db.inspections.insert([{ "_id": 1, "test": 1 },{ "_id": 1, "test": 2 },
                       { "_id": 3, "test": 3 }])
```



- This will only insert test 3 (the only one without an error)

```
db.inspections.insert([{ "_id": 1, "test": 1 },{ "_id": 1, "test": 2 },
                       { "_id": 3, "test": 3 }],{ "ordered": false })
```



#### finals notes on insertion

- When we insert a document to a collection that doesn't exist, well it exists now !
- when the collection is created, the database is created also if it doesn't exist

### Updating Documents - Data Explorer

> EZ PZ

### Updating Documents - mongo shell

- `findOne()` : returns **one** document that matches the given query
- `updateOne()`: updates one document that matches the given query
- `updateMany()` : updates all documents matching query



#### Examples : 

- Increment a field

```shell
db.zips.updateMany({ "city": "HUDSON" }, { "$inc": { "pop": 10 } })
```

- Set the value of a field (if it doesn't exist, it gets created)

```sh
db.zips.updateOne({ "zip": "12534" }, { "$set": { "population": 17630 } })
```

- add and element to an array field :

```shell
db.grades.updateOne({ "student_id": 250, "class_id": 339 },
                    { "$push": { "scores": { "type": "extra credit","score": 100 }}})
```



### Deleting Documents and Collections

- `deleteOne()` : only useful when we're querying by `_id` (otherwise using it is very dangerous ).
- `deleteMany()`  : to delete many documents based on a query

- `db.<collection-name>.drop()`: Drops a collection 



## Chapter 4: Advanced CRUD Operations

### Query Operators - Comparison

#### update operators 

- $inc
- $set
- $unset

#### Query operators

- Provide additional ways to locate data within the database

####  Comparison operators

```json
{ <field>: { <operator>: <value>} }
```

- `$eq` (we can omit it ) and `$ne`
- `$gt` and `$lt`
- `$gte` and `$lte`

Examples

- In Atlas UI

```json
{"tripduration" : {"$lt": 70}}
{ "tripduration": { "$lte" : 70 },"usertype": { "$ne": "Subscriber" } }
```

- In Shell

```shell
db.trips.find({ "tripduration": { "$lte" : 70 },
                "usertype": { "$ne": "Subscriber" } }).pretty()
```

Example 2

```shell
db.trips.find({"birth year": {"$gt":1998}}).count() - db.trips.find({"birth year": 1998}).count()
```

### Query Operators - Logic

- $and , $or , $nor  ( $and is implicit most of the times ) : 
  - Syntax : `{ <operator> : [{statement1},{statement2},...] }`
- $not :
  - Syntax : `{ $not: { statement } }`



Examples 

```shell
db.routes.find({ "$and": [ { "$or" :[ { "dst_airport": "KZN" },
                                    { "src_airport": "KZN" }
                                  ] },
                          { "$or" :[ { "airplane": "CR2" },
                                     { "airplane": "A81" } ] }
                         ]}).pretty()
```

```shell
db.zips.find({ "pop" : {"$lt" : 1000000 ,"$gt": 5000}})
```

Challenging Example : 

```shell
db.companies.find({
	"$or" : [
	{"$and" : [ {"founded_year":2004}, {"$or" : [{"category_code":"web"},{"category_code":"social"}]}]},
	{"$and" : [ {"founded_month":10}, {"$or" : [{"category_code":"web"},{"category_code":"social"}]}]} ]        
	})
```

Same as : 

```shell
db.companies.find({
	"$and" : [ { "$or" : [{"founded_year":2004},{"founded_month":10}]} ,{ "$or" : [{"category_code":"web"},{"category_code":"social"}]}]}).count()
```



- $and is used as the default operator when an operator is not specified
- explicitly use $and when you need to include the same operator more than once in a query ; for example   `( ( a or b ) and ( c or d ) )`

### Expressive Query Operator

> we will attack this tomorrow