import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getFlights } from "./flights";

vi.mock("axios");

describe("getFlights", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return flights array when API returns { flights: [...] }", async () => {
    const mockFlights = [
      { id: 1, destination: "NYC", price: 299 },
      { id: 2, destination: "LAX", price: 399 },
    ];

    axios.get.mockResolvedValue({ data: { flights: mockFlights } });

    const result = await getFlights();

    expect(result).toEqual(mockFlights);
  });

  it("should return data directly when API returns array", async () => {
    const mockFlights = [{ id: 1, destination: "NYC", price: 299 }];

    axios.get.mockResolvedValue({ data: mockFlights });

    const result = await getFlights();

    expect(result).toEqual(mockFlights);
  });

  it("should throw error when API fails", async () => {
    axios.get.mockRejectedValue(new Error("Network error"));

    await expect(getFlights()).rejects.toThrow("Network error");
  });
});