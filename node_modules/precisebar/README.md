[![Dependencies][deps-image]][deps-url] [![star this repo][gh-stars-image]][gh-url] [![fork this repo][gh-forks-image]][gh-url] [![Node.js CI][workflow-image]][workflow-url]

**precisebar** is a low-level precise text-based progress bar for use in command-line applications.

<img src="https://github.com/leebradley/precisebar/raw/master/showoff2.gif" alt="demo" width="439"/>

Where most text-based progress bars use ascii characters, precisebar takes advantage of widespread unicode support to render sub-character lengths.


## Why use precisebar?

* precisebar allows for smaller progress bars
* precisebar allows for highly precise progress information
* precisebar only has one dependency, chalk

## Installation

`yarn install precisebar`

## Usage

**Basic usage:**

```javascript
const bar = require("precisebar");
const progress = 0.3; // Any number 0-1
const charWidth = 15; // Any integer value
console.log(bar.getProgress(progress, charWidth));
```

**Advanced usage:**

```javascript
const bar = require("precisebar");
const progress = 0.3;
const charWidth = 15;
const beginningColor = "cyan";
const endColor = "bgGrey";
console.log(bar.getProgress(progress, charWidth, beginningColor, endColor));
```

**Valid beginning colors:**

* black
* red
* green
* yellow
* blue
* magenta
* cyan
* white
* blackBright (alias: gray, grey)
* redBright
* greenBright
* yellowBright
* blueBright
* magentaBright
* cyanBright
* whiteBright
* Any RGB array (ex: [255, 105, 180])

**Valid end colors:**

* bgBlack
* bgRed
* bgGreen
* bgYellow
* bgBlue
* bgMagenta
* bgCyan
* bgWhite
* bgBlackBright (alias: bgGray, bgGrey)
* bgRedBright
* bgGreenBright
* bgYellowBright
* bgBlueBright
* bgMagentaBright
* bgCyanBright
* bgWhiteBright
* Any RGB array (ex: [248, 248, 255])

## License

Blue Oak License v1.0.0 - A modern [alternative](https://writing.kemitchell.com/2019/03/09/Deprecation-Notice.html) to the MIT License.

[deps-url]: https://david-dm.org/leebradley/precisebar
[deps-image]: https://badgen.net/david/dep/leebradley/precisebar

[gh-url]: https://github.com/leebradley/precisebar
[gh-stars-image]: https://badgen.net/github/stars/leebradley/precisebar
[gh-forks-image]: https://badgen.net/github/forks/leebradley/precisebar

[workflow-url]: https://github.com/leebradley/precisebar/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster
[workflow-image]: https://github.com/leebradley/precisebar/workflows/Node.js%20CI/badge.svg
