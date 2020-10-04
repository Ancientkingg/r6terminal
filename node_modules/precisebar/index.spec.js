const bar = require("./index");
const assert = require("assert");
const chalk = require("chalk");

describe("Test bar results", () => {
  // 0	All colors disabled
  // 1	Basic color support (16 colors)
  // 2	256 color support
  // 3	Truecolor support (16 million colors)
  chalk.level = 1;

  it("getBlocks should return the correct blocks", () => {
    assert.equal(bar.getBlocks(0.8, 10), "█".repeat(8));
    assert.equal(bar.getBlocks(0.1, 3), "▎");
  });

  it("getProgress should return the correct progress bar", () => {
    assert.equal(
      bar.getProgress(0.8, 10),
      "\x1B[37m\x1B[100m████████  \x1B[49m\x1B[39m"
    );
    assert.equal(
      bar.getProgress(0.3, 15),
      "\x1B[37m\x1B[100m████▌          \x1B[49m\x1B[39m"
    );
  });

  it("getProgress should pass colors to chalk", () => {
    assert.equal(
      bar.getProgress(0.8, 10, "red", "blue"),
      "\x1B[31m\x1B[34m████████  \x1B[39m\x1B[39m"
    );
  });
});
