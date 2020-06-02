import { menuHandler, cartHandler, calorieCounterHandler } from "..";

/**
 * These tests only provide a basic assessment of correctness.
 *
 * Feel free to modify as you find necessary.
 */

describe("Homework", () => {
  const expectedResponseShape = {
    body: expect.any(String),
    statusCode: expect.any(Number)
  };

  describe("Question #1: Menu", () => {
    it("should return the correct data shape", async () => {
      const response = await menuHandler();

      expect(response).toEqual(expectedResponseShape);
    });
  });

  describe("Question #2: Cart", () => {
    it("should return the correct data shape", async () => {
      const response = await cartHandler();

      expect(response).toEqual(expectedResponseShape);
    });
  });

  describe("Question #3: Calorie counter", () => {
    it("should return the correct data shape", async () => {
      const response = await calorieCounterHandler();

      expect(response).toEqual(expectedResponseShape);
    });
  });
});
