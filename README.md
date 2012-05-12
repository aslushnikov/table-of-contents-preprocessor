# Table of Contents Generator

## About

Small and simple README.md preprocessor for creating table of contents.

Say you've got a README.md file with lots of information, and you want to
create a table of contents with reference links

This script will help you to do so. It extracts information of titles
in a given file, and inserts a formatted table of contents in the position,
specified by "@@TOC@@" line.

## Usage

```
node toc.js README.md > NEW_README.md
```

## Example

```
# Foo Great Project

Hey, this is my project

## Contents
@@TOC@@

## About

Some info about it

## Authors

My picture here
```

Will be transformed to
```
# Foo Great Project

Hey, this is my project

## Contents
- [Foo Great Project](#foo-great-project)
    - [Contents](#contents)
    - [About](#about)
    - [Authors](#authors)

## About

Some info about it

## Authors

My picture here
```

After the preprocessing you're free to modify the result as you wish.
For example, it makes sense to remove reference to table of contents from
table of contents

## Limitations

The script doesn't support underlined titles like this
```
My Title
========
```

Use sharps instead
```
# My Title
```
