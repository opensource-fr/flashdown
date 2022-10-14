// Designed to be run directly with ts-node for now since we don't have a proper unit testing
// framework set up yet.

import { TextWithCursor } from "../types";
import * as sessionPage from "./sessionPage";

// const testTextWithCursor = {
//   text: "Heading\n\nThis is some test text with a blank here _______ and this is the end.",
//   cursorPosition: {
//     x: 40,
//     y: 2,
//   },
// };

const testCardBody: TextWithCursor = {
  lines: [
    "Topic: Spanish words",
    "",
    "La puta madre: The whore mother (that's awesome!)",
  ],
};

const testCardBodyWithCursor = {
  lines: [
    "Topic: Spanish words",
    "",
    "La puta madre: __________________________________",
  ],
  cursorPosition: {
    x: 15,
    y: 2,
  },
};

describe("addFrame", () => {
  test("card body text, width 20", () => {
    expect(sessionPage.addFrame(testCardBody, 30)).toStrictEqual({
      cursorPosition: undefined,
      lines: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Topic: Spanish words       ┃
┃                            ┃
┃ La puta madre: The whore   ┃
┃ mother (that's awesome!)   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.split("\n"),
    });
  });

  test("card body text, width 30", () => {
    expect(sessionPage.addFrame(testCardBody, 30)).toStrictEqual({
      cursorPosition: undefined,
      lines: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Topic: Spanish words       ┃
┃                            ┃
┃ La puta madre: The whore   ┃
┃ mother (that's awesome!)   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.split("\n"),
    });
  });

  test("card body text with cursor, width 30", () => {
    expect(sessionPage.addFrame(testCardBodyWithCursor, 30)).toStrictEqual({
      cursorPosition: {
        x: 17,
        y: 3,
      },
      lines: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Topic: Spanish words       ┃
┃                            ┃
┃ La puta madre: ___________ ┃
┃ _______________________    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.split("\n"),
    });
  });
});

describe("createCard", () => {
  test("Big blank to reflow", () => {
    expect(
      sessionPage.createCard("Spanish", {
        lines: [
          "This is a test which includes a blank here: _____________________________",
        ],
        cursorPosition: { x: 44, y: 0 },
      })
    ).toStrictEqual({
      cursorPosition: {
        x: 46,
        y: 3,
      },
      lines: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Topic: Spanish                                           ┃
┃                                                          ┃
┃ This is a test which includes a blank here: ____________ ┃
┃ _________________                                        ┃
┃                                                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.split("\n"),
    });
  });

  test("Blank on front side", () => {
    expect(
      sessionPage.createCard("Spanish", {
        lines:
          "_______________: This is a test which includes a blank on the first side <---".split(
            "\n"
          ),
        cursorPosition: { x: 0, y: 0 },
      })
    ).toStrictEqual({
      cursorPosition: {
        x: 2,
        y: 3,
      },
      lines: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Topic: Spanish                                           ┃
┃                                                          ┃
┃ _______________: This is a test which includes a blank   ┃
┃ on the first side <---                                   ┃
┃                                                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.split("\n"),
    });
  });

  test("With cursor 2", () => {
    expect(
      sessionPage.createCard("Celsius/Fahrenheit conversion", {
        lines: ["176C : ____"],
        cursorPosition: { x: 7, y: 0 },
      })
    ).toStrictEqual({
      cursorPosition: {
        x: 9,
        y: 3,
      },
      lines: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Topic: Celsius/Fahrenheit conversion                     ┃
┃                                                          ┃
┃ 176C : ____                                              ┃
┃                                                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.split("\n"),
    });
  });

  test("With cursor 3", () => {
    expect(
      sessionPage.createCard("Solar energy", {
        lines: [
          "What was the total electricity consumption of Spain in 2018? : _______",
        ],
        cursorPosition: { x: 63, y: 0 },
      })
    ).toStrictEqual({
      cursorPosition: {
        x: 10,
        y: 4,
      },
      lines: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ Topic: Solar energy                                      ┃
┃                                                          ┃
┃ What was the total electricity consumption of Spain in   ┃
┃ 2018? : _______                                          ┃
┃                                                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.split("\n"),
    });
  });
});