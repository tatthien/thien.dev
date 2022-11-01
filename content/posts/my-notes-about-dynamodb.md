---
title: My notes about DynamoDB
date: 2022-10-31T09:25:00.698Z
tags: dynamodb
draft: false
---

Recently, I've had a chance to work with DynamoDB. I found out some interesting stuff about its concept. Especially, **the single table design**.

That means we don't have multiple tables to store our data like relational databases (RDB).

## Key concepts

There are some key concepts that I've learned about DynamoDB.

### Table, item, and attributes

- **Table** is a group of data records
- **Item** is a single data record in a table
- **Attributes** are pieaces of data attached to a single item.

### Primary key

Primary key is the unique identifier of an item in a table. The primary key definition must be defined when we create the table.

There are two types of primary key: a simple primary key and a composite primary key

- **Simple primary key** is as simple as its name. I.e: Order tables with OrderId primary key.
- **Composite primary key** is a combination of partition key and sort key.

### Partition key, sort key

These keys must be defined at the creation of a table.

- **Partition key (PK)** is use to partitioning the data.
- **Sort key (SK)** is used to determine the order of how data with the same partition key is stored.

_In DynamoDB, we can name partition key and sort key by whatever name we favor. I.e: Username, email, created date, artist or song title. However, I see the name PK and SK are the most popular, artist or song title_

Let's take an example to see how PK and SK work. Suppose I'm storing the data of an application's extensions that contain metadata, versions, etc. This is how I structure the data in DynamoDB.

| PK          | SK               | Attributes              |
|-------------|------------------|-------------------------|
| EXT#Stealth | METADATA#Stealth | Title/Description/URL   |
| EXT#Stealth | VERSION#1.0.0    | Revision/Version/Readme |
| EXT#Stealth | VERSION#1.1.0    | Revision/Version/Readme |
| EXT#Catex   | METADATA#Catex   | Title/Description/URL   |
| EXT#Catex   | VERSION#2.0.0    | Revision/Version/Readme |

![Partition key and sort key](/img/my-notes-about-dynamodb/dynamodb-1.png)

Let's explain a bit. Version 1.0.0 and 1.1.0 have the same partition key but diffrent sort key, because they're both belong to the extension Stealth. This extension's information determines by the sort key `METADATA#Stealth` that having attributes: Title, Description and URL.

### Secondary indexes

In DynamoDB, secondary indexes are useful to query data. There are two types of secondary index.

- **Global secondary indexes (GSI)**: this key can be added after the creation of a table. We can have a GSI with a simple key, or composite key with a completely different PK and SK than the base table.
- **Local secondary indexes (LSI)**: this key must be defined at the creation of a table.

## Single table design

This concept is really new to me. I didn't know it till I dig into DynamoDB.

What is single table design? In short (as I understand), **single table is equal to database (in RDB)**. One table keeps all of the data of your application. And because there are no joins in DynamoDB. Single table helps us to solve the data relationship issues.

When working with this concept, I've learned something.

### Access patterns

In a simple word, access patterns is how we want to retrieve data from DynamoDB. Let's define some access patterns:

I'll reuse [the extensions example](#partition-key-sort-key) above:

1. Retrieve an extension.
2. Retrieve an extension and all the versions of that extension.
3. Retrieve only the versions from a specific extension.
4. Retrieve a specific version from a specific extension.

As you can see, we have four access patterns (and more). Defining these are really important and must be done firstly since access patterns will decide how we shape the structure of our table with PK, SK and secondary indexes.

### Relationships

In RDB, we can use join to retrieve the relationships between entities. But there are no joins in DynamoDB. We have to think of the strategies to deal with that issue.

About the strategies, I think [this awesome article](https://www.alexdebrie.com/posts/dynamodb-one-to-many/) explains in detail how to use complex attributes, composite primary key and secondary indexes.

Get back to the example above, I'd to take the example of using the composite primary + DynamoDB Query API to achive the access patterns.

1. **Retrieve an extension**. `PK = EXT#<name> AND SK = METADATA<name>`
2. **Retrieve an extension and all the versions of that extension**. `PK = EXT#<name>`
3. **Retrieve only the versions from a specific extension**. `PK = EXT#<name> AND SK begins_with("VERSION#")`
4. **Retrieve a specific version from a specific extension**. `PK = EXT#<name> AND SK = VERSION#<semver>`

Here's an implemetation in go:

```go
type GetExtensionVersions struct {
	Package string
}

func (c GetExtensionVersions) ToKeyConditionBuilder() expression.KeyConditionBuilder {
	sk := expression.Key("SK").BeginsWith("VERSION#")
	return expression.Key("PK").Equal(expression.Value("EXT#" + c.Package)).And(sk)
}
```

## References

I cannot learn and write up about DynamoDB without these references.

- https://www.dynamodbguide.com/
- https://www.alexdebrie.com/posts/dynamodb-one-to-many/
- https://blog.devgenius.io/how-to-do-single-table-design-with-dynamodb-db9101a43277

## Conclusion

That's what I've learned so far while working with DynamoDB. My notes may be incorrect in some aspects. However, it's interesting to write up these things.

To be updated...










