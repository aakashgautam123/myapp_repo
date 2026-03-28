const request = require("supertest");
const app = require("../src/app"); // adjust path if needed

describe("API Tests", () => {

  test("GET /health should return status OK", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "OK" });
  });

  test("GET /users should return user list", async () => {
    const res = await request(app).get("/users");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { id: 1, name: "Aakash" }
    ]);
  });

  test("GET /books should return book list", async () => {
    const res = await request(app).get("/books");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { id: 1, name: "Book New" }
    ]);
  });

});