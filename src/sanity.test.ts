import { describe, expect, it } from "vitest";

describe("Aralivo workspace", () => {
  it("has a browser-capable test environment", () => {
    expect(document).toBeDefined();
  });
});
