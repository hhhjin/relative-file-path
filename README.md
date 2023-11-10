# relative-file-path

Return a file path relative to a given file

## Installation

```sh
$ npm install relative-file-path
```

## Usage

```javascript
import { relativeFilePath, RelativeFilePathError } from "relative-file-path";

console.log(relativeFilePath("/a.js", "/b.js"));
// ./b.js

console.log(relativeFilePath("a.js", "b.js"));
// ./b.js

console.log(relativeFilePath("/a/b.js", "/c/d.js"));
// ../c/d.js

console.log(relativeFilePath("/a.js", "b.js"));
// PathTypeError: Both parameter values must begin with '/' or not

console.log(relativeFilePath("/a.js/", "/b.js"));
// NotFilePathError: Both parameter values must not end with '/'

// Error Handling
try {
  relativeFilePath("/a.js", "b.js");
} catch(e) {
  if (e instanceof RelativeFilePathError) {
    if (e.name === "PathTypeError") // ...
    else if (e.name === "NotFilePathError") // ...
  }
}
```
