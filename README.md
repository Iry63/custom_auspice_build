# Markdown

## Custom build for auspice
Base build version 2.27.0

### Features

New panels to display a distance matrix that dynamically update with the tree view.  

## Installation

Install [Auspice](https://github.com/nextstrain/auspice) from source.  
```bash
git clone https://github.com/nextstrain/auspice.git
cd auspice
npm install --global .

```

#### Then replace the src folder with the one in this repository  

Generate auspice build:  
```bash
auspice build
```
Launch auspice:  
```bash
auspice view --datasetDir path/to/data
```

And view auspice in the browser at [localhost:4000](http://localhost:4000)  

## How to add matrix

Recommended:  
To add you will need a .tsv file that contain the matrice and use [Auract](https://github.com/Iry63/Auract) a tool that i have made to generate auspice and microreact input from tree and metadata.

If don't want to use Auract:  
An other way is to get your matrice in html table and add at the end of the json file your html code.

```json
"matrice": "<table></table>"

```

[![License GPL v3](https://img.shields.io/badge/license-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.en.html)
