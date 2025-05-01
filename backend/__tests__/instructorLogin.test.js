const request = require("supertest");
const app = require("../server"); // Make sure server.js exports app

describe("POST /api/auth/instructor-login", () => {
  it("should return 200 and a token for valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/instructor-login")
      .set("Content-Type", "application/json") // ✅ Explicit header
      .send({
        instructorId: "INST-89820218",
        password: "123456"  
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.message).toBe("Instructor login successful");
  });

  it("should return 401 for incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/instructor-login")
      .send({
        instructorId: "INST-89820218",
        password: "wrongPass"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid password.");
  });

  it("should return 404 for non-existent instructor", async () => {
    const res = await request(app)
      .post("/api/auth/instructor-login")
      .send({
        instructorId: "non_existing_id",
        password: "whatever"
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Instructor not found.");
  });


});
  