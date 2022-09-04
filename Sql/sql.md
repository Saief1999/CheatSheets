
## Joins & CTE & TEMP TABLES
![[joins.png]]
### Inner joins

This returns rows having the same value for `country` from the two tables (the join we're used to do)

```sql
SELECT *
FROM athletes a
INNER JOIN countries c
on a.country = c.country
```

**Important** : Note that by using `select *` this will select all the columns from **the first AND the second table**. The **country** column will be duplicated ( since it exists in both tables). 

If both tables have the same field name for joining. we can use `USING` which **will also avoid duplicating that field**

```sql
SELECT *
FROM athletes
INNER JOIN countries
USING (country)
```

### Left join

return **all** the left table rows and join to them their respective joins in the other table ( if they exist )

```sql
SELECT * 
FROM athletes a 
LEFT JOIN countries c
ON a.country = c.country
```

### Right join

```sql
SELECT *
FROM athletes a 
RIGHT JOIN countries c
ON a.country = c.country
```

### Full outer join

Return all entries , while joining when possible

```sql
SELECT *
FROM athletes a
FULL OUTER JOIN countries c
ON a.country = c.coutnry
```

**Disadvantages**

Full outer join put an order constraint on the Query planner  which other types of joins do not, using them might slow the query execution

### Subqueries and common table expressions

#### Subqueries

You can use a subquery in `SELECT`, `FROM` and `WHERE` clauses. Can be used as alternative to joins

**Advantages** : 
- Can return one result
- Readable
- SQL instructions similar to joins



##### Subqueries in SELECT

```sql
SELECT AVG(aword_length) AS avg_movie,
		(SELECT AVG(word_length)
		 FROM english_language)
		 AS avg_english
FROM MOVIE
```

##### Subqueries in WHERE

```sql
SELECT AVG(word_length) AS avg_movie
FROM english_language
WHERE word IN
	(SELECT DISTINCT word FROM movie)
```

##### Subqueries in FROM

```sql
SELECT AVG(word_length) AS avg_movie
FROM (SELECT * FROM movie)
```

**Disadvantages**

- Decreases readability
- Limits query plan flexibility
- **Best rewritten as joins** (they can't be optimized in the query plan)

#### common table expressions (CTE)

- Join alternative
- Standalone query with temporary results set

-> WITH statement

**Advantages** : 

- Can return one result
- More readable than joins
- Unlike subqueries, they create a temporary table that's only executed one time
- Useful when working with large tables that are resource intensive to query

```sql
WITH english_cte AS
(
	SELECT word_length,
		COUNT(word) AS word_count AS english_word_count
	FROM english_language
)
SELECT movie.word_length,
	COUNT(movie.word) AS movie_word_count,
	cte.english_word_count
FROM movie
INNER JOIN english_cte cte
ON movie.word_length = cte.word_length
GROUP BY movie.word_length, cte.english_word_count
```

The query planner materializes the cte into a temporary table, which optimizes the access to the `english_language` database which is quite large ( compared to the usage of a subquery)

### Temporary tables

- Short lived table

**How?**
- `CREATE TEMP TABLE name AS`

**Advantages**

- Transient storage
- Only available in the current Database session ( use resources temporarly)
- Available for Multiple queries
- User specific
- Creating temp table for large tables will make them faster to query


```sql
CREATE TEMP TABLE usa_holidays AS
	SELECT holiday, holiday_type
	FROM world_holidays
	WHERE country_code = 'USA';
```

**Advantages** :

- The last query will help us to query only holiday in the USA to avoid querying our **initial large table** everytime
- The initial creation of the **TEMP TABLE** might be slow if the initial table is large. But it's then stored in memory and querying it will be faster
- If we create a **TEMP TABLE** on a view. This will **materialize** the view and save it in memory for the duration of the db session (Useful when our **VIEW** has many underlying references to other tables, which might be slow)

- referencing the same large table multiple times in our query might be **slow**. We use the **TEMP TABLE** in our **CTE**'s and **Joins** to make our queries faster, as example this is faster than using the full world_holidays table each time : 

```sql
WITH religious AS
(
	SELECT usa.holiday, r.initial_yr, r.celebration_dt
	FROM religious r
	INNER JOIN usa_holidays usa
	USING (holiday)
),
secular AS
(
	SELECT usa.holiday, s.initial_yr, s.celebration_dt
	FROM secular s
	INNER JOIN usa_holidays usa
	USING (holiday)
),
...
```

#### Using `ANALYZE`

It returns no visible output, but helps in the **Query execution Plan**. It's good practice to use it after creating our temporary table

The **Query Planner** creates an execution plan

`ANALYZE` **collects the different statistics** stores information about the query in `pg_statistics` . The **Query Planner** will then use `pg_statistics` to estimate the runtime of the execution plan to choose the **optimal execution plan** which will **improve the Query planner ability**.

```sql
CREATE TEMP TABLE usa_holidays AS
SELECT holiday, holiday_type
FROM world_holidays
WHERE country_code = 'USA';

ANALYZE usa_holidays; -- helps in the creation of the TEMP TABLE

SELECT * FROM usa_holidays:
```


## Minimizing Results and Decreasing the Load

### SQL logical order of operations

| Order | Clause                  | Purpose                                                                | Limits  |
| ----- | ----------------------- | ---------------------------------------------------------------------- | ------- |
| 1     | `FROM`                  | Provides directions to the table (or tables if the query includes joins) |         |
| 2     | `WHERE`                 | Filters or limits the records                                         | rows    |
| 3     | `GROUP BY`              | Places records into categories                                         | columns |
| 4     | `SUM()`, `COUNT()`, ect | aggregates                                                             | rows    |
| 5     | `SELECT`                | identifies columns to return                                          | columns |
| 6     | `DISTINCT`              | removes duplicates                                                     | rows    |
| 7     | `ORDER BY`              | arranges results                                                       |         |
| 8     | `LIMIT`                 | filters records                                                           | rows        |


**IMPORANT** : `GROUP BY` loses all the different columns, that's why if you try to select columns that aren't part of the `GROUP BY` clause or are `aggregations` (step 4) it will return an error.

Note also that `ORDER BY` is executed before 

### Filterting in the WHERE clause

#### `EXPLAIN`

Add **EXPLAIN** before any query to see the ordered steps of the **Execution plan** of that Query.

```sql
EXPLAIN
SELECT * FROM phones
```


This returns : 
- a cost estimate
- rows
- width

For example , the last query returns one **step**, the `Sequential Scan`
```
Seq Scan on phones ( cost = 0.00..22.7, rows=1270, widht=36 )
```

Adding a `WHERE phone_code=235` will add one more instruction to the `sequential scan`

```
Seq Scan on phones ( cost = 0.00..25.8, rows=6, widht=636 )
	Filter: (phone_code=235)
```

#### Optimizations in `WHERE`

##### Filtering for similar values with `LIKE OR` ( Good )

```sql
EXPLAIN
SELECT * FROM phones
WHERE country LIKE 'Ch%'
	OR country LIKE 'In%'
```

```
Seq Scan on phones (cost = 0.00..29.05, rows=13, width=36)
	Filter= ((country~~'Ch%'::text) OR (country~~'In%'::text))
```

##### Fileting for similar values with `LIKE ANY` ( better )

```sql
EXPLAIN
SELECT * FROM phones
	WHERE country LIKE ANY (ARRAY['Ch%','In%'])
```

```
Seq Scan on phones (cost = 0.00..25.88, rows=13, width=36)
	Filter= ((country~~ANY('{Ch%,In%}'::text[]))

```

##### Filtering for exact values with `OR` ( good )


```sql
EXPLAIN
SELECT * FROM phones
WHERE country LIKE 'Chad'
	OR country LIKE 'China'
```

```
Seq Scan on phones (cost = 0.00..29.05, rows=13, width=36)
	Filter= ((country~~'Chad'::text) OR (country~~'China'::text))
```

##### Filtering for exact values with `ANY` ( better )


```sql
EXPLAIN
SELECT * FROM phones
	WHERE country IN ('Chad','China')
```

```
Seq Scan on phones (cost = 0.00..25.88, rows=13, width=36)
	Filter= ((country~~ANY('{Chad,China}'::text[]))
```

##### Filtering for numbers ( BEST ) 

**Numbers are generally easier to search than strings**

- Shorter length than strings
- Smaller storage than characters
- Speed performance

```sql
EXPLAIN
SELECT * 
FROM phones
WHERE phone_code IN (235, 86)
```

```
Seq Scan on phones (cost = 0.00..25.88, rows=13, width=36)
	Filter= ((phone_code~~ANY('{235,86}'::integer[]))
```


#### Conclusion

| Good | Better  |
| ---- | ------- |
| Text | Numeric |
| `OR` | `IN`, `ARRAY`        |


### Filtering while joining

We can use **non-linking join conditions** to filter in the `JOIN` clause ( by using other conditions in additions to `ON`, see example below)

```sql
SELECT *
FROM appointments a
LEFT JOIN patients p -- leave out all appointments data ( LEFT TABLE)
	ON a.partient_id = p.patient_id -- join the data
	AND p.sex = 'M' -- Select only male patients from the RIGHT TABLE
```

---

**Important : Filter pitfalls** : the query above will leave all appointments , but **will join only male patient infromation**

Result : 
| visit_id | reason    | patient_id | name  | sex |
| -------- | --------- | ---------- | ----- | --- |
| 01       | checkup   | 999        |       |     |
| 02       | infection | 888        | Zhang | M    |

The Query below will delete all entries in the result **where the associated partient is not `M`**. This has to do with the order of the SQL operations ( `FROM + JOIN ` is executed before `WHERE`)

```sql
SELECT *
FROM appointments a
LEFT JOIN patients p -- leave appointments data ( LEFT TABLE )
	ON a.partient_id = p.patient_id -- join the data
WHERE p.sex = 'M' -- Remove all rows where the patient isn't M
```

Result:
| visit_id | reason    | patient_id | name  | sex |
| -------- | --------- | ---------- | ----- | --- |
| 02       | infection | 888        | Zhang | M    |

If we use `INNER JOIN` we can put the condition ( `p.sex = 'M'`) in the `WHERE` or `ON` clause, the result will be the same.

| visit_id | reason    | patient_id | name  | sex |
| -------- | --------- | ---------- | ----- | --- |
| 02       | infection | 888        | Zhang | M    |

---

### Aggregating with different data granularities

Data granularity : Level or detail -> What makes the row unique ( what's needed to describe the row)

**Video Games** : 
| id  | games            | first_yr |
| --- | ---------------- | -------- |
| 012 | Grand Theft Auto | 1997     |
| 234 | Legend of Zelda  | 1986         |

**Games_plateforms** :
| game_id | plateform | year |
| ------- | --------- | ---- |
| 234     | FCDS      | 1986 |
| 234     | Gamecube  | 2003 |
| 234     | Wii       | 2006     |

Suppose we want to find the number of plateforms associated with each video game name. Doing a simple join will **duplicate our data**. we need to use a **CTE**

```sql
with plateforms_cte AS
( SELECT game_id, COUNT(plateforms) AS no_plateforms
  FROM game_plateforms
  GROUP BY game_id
)
SELECT g.id, g.game, cte.no_plateforms
FROM video_games g
INNER JOIN plateforms_cte cte
	ON cte.game_id = g.id
```


#### Matching data granularity when joining ( by using a CTE )

- No repeat or duplicates
- Minimum needed results
- No double counting


## Using Database Designed Properties

### Different Storage Types
- Queries can reference data using the `FROM` clause
- Queries can reference data from:
	- Tables
		- Base table
		- Temporary table
	- Views
		- View
		- Materialized View

#### Base Table 

| Describe | Organized storage                                                            |
| -------- | ---------------------------------------------------------------------------- |
| Contains | data                                                                         |
| Loaded   | extract, transform, load (ETL) process                                       |
| Source   | human resources program, client management system, survey collection, ect... |

#### Temporary Table

 | Describe | Organized (raw and column) storage |
 | -------- | ---------------------------------- |
 | Contains | data                               |
 | Loaded   | query(transient)                   |
 | Source   | existing base tables               | 

#### Standard view

| Describe | stored query                 |
| -------- | ---------------------------- |
| Contains | directions / view definition |
| Loaded   | never                        |
| Source   | existing base tables         | 

**View Utility** : 

- Combine commonly joined tables
- Computed columns
	- Summary metrics
- Show partial data in a table
	- Show employees but hide salaries

#### Materialized Views

it's a cross between `temporary tables` and `standard views`

- Like a View : it's a stored query
- Unlike a View : it contains data
	- The data comes from a **refresh process** that runs **the view definition** as some defined intervals
- They are essentially the same as views but **Faster**. 

| Describe | stored query         | view  |
| -------- | -------------------- | ----- |
| Contains | data                 | table |
| Loaded   | refresh process      | table |
| Source   | existing base tables | view  | 


| What              | Why                                      |
| ----------------- | ---------------------------------------- |
| Tablebase storage | base storage                             |
| Temp Table        | speeds queries on a big table            | 
| View              | complicated logic or calculated fields   |
| Materialized view | complicated logic that slows performance |



#### Information Schemas

Provides metadata about database

Exists in many databases

```sql
SELECT table_type
FROM information_schema.tables
WHERE table_catalog = 'orders_schema'
AND table_name = 'customer_table'
```


### Row-oriented storage and partitions ( In Postgresql )

**Row oriented storage**
- Maintains Relationship between columns

- One row stored in same location
- Fast to append/delete whole records
- Quick to return all columns
	- Slow to return all rows

**Reduce the number of rows**
- `WHERE` filter
- `INNER JOIN`
- `DISTINCT`
- `LIMIT`


#### Optimizations in row oriented database:
- Partitions
	- Method of splitting one (parent) table into many smaller (children) tables
- Indexes
	- Method of creating sorted column keys to improve search

Using paritions and indexes **advantages** : 
- Require set up and maintenance
- Existence known from database administrator or documentation

##### Partitions ( by rows )
- Parent table
	- Visible in database frontend
	- Write queries
- Children tables ( each having a few rows of the parent table )
	- Not visible in database frontend
	- Queries search

**What**
- They split one table into many smaller tables

**Why**
- Storage flexibility
- Fast queries ( since the initial table will be split into many smaller tables )

**Where Used?**
- Common filter columns
	- Date, location

###### Partition query assessment
The **Cost estimate** in the `EXPLAIN` clause is **the metric affected by using partitions**

### Using and Creating indexes

**What**
- Method of creating sorted columns keys to improve search
- Similar to book index
- Reference to data location

**Why**
- Faster queries

**Where**
- Common filter columns ( date, location... )
- Primary key

**How**

```sql
CREATE INDEX recipe_index
ON cookbok(recipe)
```

We can also create an index on multiple columns ( if filtered together for example )

```sql
CREATE INDEX CONCURRENTLY recipe_index
ON cookbook (recipe, serving_size)
```

>`CONCURRENTLY` allows records to be loaded into the table while the index is being created. This prevents the table from being locked when the index is being creation

#### When to use Indexes

**Use an Index**

- Large tables
- Common filter conditions
- Primary key

**Avoid an index**

- Small tables
- Columns with many nulls
- Frequently updated tables
	- Index will become fragmented ( New records will not be sorted , they will need reindexing )
	- Writes data in two places

#### Finding existing index

**`PG_TABLES`**
- Similar to `information_schema`
	- Specific to Postgres
- Metadata about database

**`pg_indexes`** : VIEW containing metadata about indexes in our database
- Has `tablename`, `indexname`, ...

#### Index query assessment
- Cost (time) estimate of `EXPLAIN` will decrease when an index is added to a column.


### Using Column-oriented storage

**Column oriented storage**
- Maintains Relationship between rows ( all rows for one column ) , however columns are separated from each other

- Columns oriented storage is a good fit for Analytics
	- One column stored in same location
	- Quick to return all rows ( unlike row oriented storage )
	- Fast to perform column calculations
- Analytics focus
	- Counts, averages, calculations
	- Reporting
	- Column aggregations

Column-oriented storage : a poor fit
- not well suited for transactional database needs (where we need rows intact)
	- Slow to return all columns of a row
	- **Slow** to **Insert/delete** data ( since data is usually inserted in row basis )

**Examples of column oriented storage databases**

| Database | Column Oriented databases used with it                          | 
| -------- | --------------------------------------------------------------- |
| Postgres | Citus Data, Greenplum, Amazon Redshift                          |
| MySQL    | MariaDB                                                         |
| Oracle   | Oracle In-memory cloud store, Clickhouse, Apache Druid, CrateDB |

#### Writing your queries in column oriented databases
- Don't use `SELECT *` , try to be more specific
- Examine each column in own query and restrict the the number of columns as much as possible

```sql
--Structure suited for column oriented
SELECT MIN(age), MAX(age)
FROM zoo_animals
WHERE species = 'zebra'
```

```sql
--Structure suited for row oriented
SELECT * 
FROM zoo_animals
WHERE species = 'zebra'
ORDER BY age
```


## Assessing Query performance

### Query lifecycle and the planner

#### Basic query lifecycle

| System              | Frontend steps                  | Backend process                                                                               |
| ------------------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| Parser              | Send query to database          | Checks syntax. Translates SQL into more computer friendly syntax based on system stored rules |
| Planner & Oprimizer | Assess and Optimize query tasks | Uses database stats to create query plan. Calculates costs and chooses the best plan          |
| Executor            | Return query results            | Follows the query plan to execute the query                                                   |

#### Query Planner & Optimizer

- Generates plan trees
	- Nodes corresponding to steps
	- Visualized with `EXPLAIN`
- Estimate cost of each tree
	- Statistics from `pg_tables`
	- Time based optimization
- Uses the `pg_class` TABLE and the `pg_stats` VIEW the create its plan and calculate estimates
	- Store information such as Column indexes, count null values, column width and distinct values

### `EXPLAIN`
- Window into query plan
- Steps and cost **estimates**
	- **Does not run query**

>`Seq scan` : is a scan of all rows in a table ( reported by the `ANALYZE` clause sometimes )

- **EXPLAIN : Cost** : 
	- The Cost output in `EXPLAIN` command should be used to compares structures with same output.
		- It **SHOULD NOT** be used to compares queries with different output. The values reported are **Dimensionless**. Meaning less rows might give more Cost.
	- Example : `Seq Scan on chesses (cost=0.00..10.50 ...)` :
		- 0.00 : start up time
		- 10.50 : total time
		- total time = start up + run time
- **EXPLAIN : Size**
	- Size estimates
	- Example :  `Seq Scan on chesses (cost=0.00..10.50 rows=5725 width=296)`
		- **rows** : rows query needs to examine to run
		- **width** : byte width of rows

#### `EXPLAIN` with a `WHERE` clause

```sql
EXPLAIN
SELECT * FROM cheeses WHERE species IN ('goat', 'sheet')
```

```
Seq Scan on cheeses (cost = 0.00..378.90, rows=3, width=118)
	Filter: ((species = ANY('{"goat","sheep"}'::text[]))
```

- The Steps are executed **From bottom to top**
	- Step 1 : Filter
	- Step 2 : Sequential scan
- `WHERE` clause
	- Decrease rows to scan and increases total cost (because this is a more complicated query)

#### `EXPLAIN` with an index

```sql
EXPLAIN
SELECT * FROM cheeses WHERE species IN ('goat', 'sheet') -- suppose we have an index on species column
```

```
Seq Scan on cheeses (cost = 0.29..12.66, rows=3, width=118)
	Index Cond: ((species = ANY('{"goat","sheep"}'::text[]))
```

- The INDEX exists in the backend to help performance
- Step 1 : Bitmap Index Scan
	- Index Cond explains the scan step
- INDEX
	- Start up increased from 0
	- Overall cost decreased from 379

### A Deeper dive into `EXPLAIN`

- `VERBOSE`
	- Shows columns for each plan node
	- Shows table schema and aliases

```sql
EXPLAIN VERBOSE
SELECT * FROM cheeses
```

```sql
Seq Scan on dairy.cheeses (cost=0.00..10.50 rows=5725 width=296)
  Output: name, species, type, age -- this is extra
```

- `ANALYZE` **(The Most useful)**
	- Runs the query
	- **Actual run time in milliseconds**

```sql
EXPLAIN ANALYZE
SELECT * FROM cheeses
```

```sql
Seq Scan on cheeses (cost=0.00..10.50 rows=5725 width=296) (actual time=0.007..1.087 rows=11992 loops=1) --extra
Planning Time: 0.059 ms -- extra
Execution Time: 1.538 ms --extra
```


#### Query plan - aggregations

Adding Aggregations to a query will use the `HashAggregate` operator as a step in the planner. 

Actual time  will be added to all the stops ( steps are from bottom to top )

```sql
EXPLAIN ANALYZE
SELECT type, AVG(age) AS avg_age
FROM cheeses
GROUP BY type
```

```sql
HashAggregate (cost=314.88..317.88 rows=200 width=40) (actual time=4.973..4.975 rows=2 loops=1)
	Group Key: type
		-> Seq Scan on cheeses (cost=0.00..286.25 rows=5725 width=10) (actual time=0.016..2.546 rows=11992 loops=1)
Planning Time: 0.059 ms
Execution Time: 1.538 ms
```

#### Query plan - sort

Sorting will use the `Sort` operation by the planner

Two Steps : 
- Seq Scan 1 
- Sort 2 

```sql
EXPLAIN ANALYZE
SELECT type, age
FROM cheeses
ORDER BY age DESC
```

```sql
Sort (cost=1161.37..1191.35 rows= width=20) (actual time=4.281..5.331 rows=11992 loops=1)
	Sort Key: type
	Sort Method: quicksort Memory: 1216kb
		-> Seq Scan on cheeses (cost=0.00..348.92 rows=11992 width=20) (actual time=0.0007..1.799 rows=11992 loops=1)
Planning Time: 0.059 ms
Execution Time: 5.870 ms
```

#### Query plan - join

Joining will use the `Hash` operation. Which will read data from the `JOIN` table, hash it, then do a second scan on our initial `FROM` table , and compare the values later. This will result in many steps.


### Query structure and query execution

#### Subqueries and joins

They are used to join and filter data

As long as the **Subquery** is in the `SELECT` or `WHERE` clause. The **Query planner** treats it as a `JOIN`

The two queries below will produce the same plan by the **Query Planner** ( same steps )

```sql
-- SUBQUERY
SELECT COUNT(athlete_id)
FROM athletes
WHERE country IN
	( SELECT country FROM climate
	  WHERE temp_annual > 22
	)
```

```sql
--JOIN
SELECT COUNT(athlete_id)
FROM athletes a
INNER JOIN climate c
	ON a.country = c.country
	AND c.temp_annual > 22
```

- Step 1 : Seq scan on climate -> and Hash
- Step 2 : Seq Scan on athletes -> Then Hash join

### Common Table Expressions & Temporary tables

Using CTE's is similar to the Temporary tables ( The query planner produces the same steps ) -W As a matter of fact , using a CTE will create a temporary table

### Limiting the data

Always make sure to filter on columns with **indexes** to have faster search.


### Aggregations - different granularities
- Always try to aggregate in the table with fewer fields before joining ( By using a CTE (`WITH ... AS () `))
	- Sometimes This might affect filtering, keep that in mind (The filter step won't be executed as soon as possible)



