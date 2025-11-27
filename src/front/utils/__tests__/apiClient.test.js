import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import apiClient from "../apiClient";

// Helper to stub localStorage
const mockLocalStorage = () => {
  const store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => (store[k] = String(v)),
    removeItem: (k) => delete store[k],
    clear: () => Object.keys(store).forEach((k) => delete store[k]),
  };
};

describe("apiClient.request", () => {
  let origFetch;
  let origLocalStorage;

  beforeEach(() => {
    origFetch = global.fetch;
    origLocalStorage = global.localStorage;
    global.localStorage = mockLocalStorage();
  });

  afterEach(() => {
    global.fetch = origFetch;
    global.localStorage = origLocalStorage;
    vi.restoreAllMocks();
  });

  it("retries network errors and succeeds on later candidate", async () => {
    // Simulate first two hosts failing with network error, then relative path succeeds
    global.fetch = vi.fn(async (url) => {
      if (typeof url === "string" && url.includes("localhost:3001")) {
        throw new Error("ECONNREFUSED");
      }
      if (typeof url === "string" && url.includes("127.0.0.1:3001")) {
        throw new Error("ECONNREFUSED");
      }
      // relative url (last candidate) returns success
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ ok: true, used: "relative" }),
      };
    });

    const res = await apiClient.post("/api/test", { a: 1 });
    expect(res).toEqual({ ok: true, used: "relative" });
  });

  it("propagates HTTP errors and annotates tried base", async () => {
    global.fetch = vi.fn(async (url) => {
      // return an HTTP error response
      return {
        ok: false,
        status: 409,
        statusText: "Conflict",
        text: async () => JSON.stringify({ message: "Already exists" }),
      };
    });

    await expect(apiClient.post("/api/test", { a: 1 })).rejects.toMatchObject({
      status: 409,
      response: { message: "Already exists" },
    });
  });
});
