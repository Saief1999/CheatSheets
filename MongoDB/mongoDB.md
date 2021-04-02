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

