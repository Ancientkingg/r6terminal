const chalk = require("chalk");

const blocks = ["", "▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"];

/**
 * Create just one section of the progress bar
 * 
 * @param {*} value   The value as a decimal. Valid ranges are 0-1
 * @param {*} length  The length of the progress bar in total
 * 
 * @returns {string}
 */
function getBlocks(value, length = 40) {
  const progressWidth = value * length;
  const fullBlocks = Math.floor(progressWidth);
  const remainder = progressWidth - fullBlocks;
  const lastBlockIndex = Math.round(remainder * 8);
  return "█".repeat(fullBlocks) + blocks[lastBlockIndex];
}

function colorize(bar, fg, bg) {
  if (fg || bg) {
    let colorized = chalk;
    if (typeof fg === "string") colorized = colorized[fg];
    if (typeof fg === "object") colorized = colorized.rgb(fg[0], fg[1], fg[2]);
    if (typeof bg === "string") colorized = colorized[bg];
    if (typeof bg === "object") colorized = colorized.bgRgb(bg[0], bg[1], bg[2]);
    return colorized(bar);
  }
  return bar;
}

/**
 * Create a progress bar and return it as a string
 * 
 * @param {*} value       The value as a decimal. Valid ranges are 0-1
 * @param {*} length      The length of the progress bar in total
 * @param {*} colorBegin  The color of the first part of the bar (valid values in chalk library)
 * @param {*} colorEnd    The color of the end of the bar (valid values in chalk library)
 * 
 * @returns {string}
 */
function getProgress(
  value,
  length = 40,
  colorBegin = "white",
  colorEnd = "bgGrey"
) {
  const first = getBlocks(value, length, colorBegin, colorEnd);
  const last = " ".repeat(length - first.length);
  return colorize(first + last, colorBegin, colorEnd);
}

module.exports = {
  getBlocks,
  getProgress,
};
