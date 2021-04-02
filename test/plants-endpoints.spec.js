const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makePlantsArray, makeMaliciousPlant } = require("./plants.fixtures");
const { makeUsersArray } = require("./users.fixtures");

describe("Plants Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE plants, users, user_plants RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE plants, users, user_plants RESTART IDENTITY CASCADE")
  );

  //-----all plants
  describe(`GET /api/plants`, () => {
    context(`Given no plants`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/plants").expect(200, []);
      });
    });

    context("Given there are plants in the database", () => {
      const testUsers = makeUsersArray();
      const testPlants = makePlantsArray();

      beforeEach("insert plants", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("plants").insert(testPlants);
          });
      });

      it("responds with 200 and all of the plants", () => {
        return supertest(app).get("/api/plants").expect(200, testPlants);
      });
    });

    context(`Given an XSS attack plant`, () => {
      const testUsers = makeUsersArray();
      const { maliciousPlant, expectedPlant } = makeMaliciousPlant();

      beforeEach("insert malicious plant", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("plants").insert([maliciousPlant]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/plants`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].name).to.eql(expectedPlant.name);
            expect(res.body[0].plant_type).to.eql(expectedPlant.plant_type);
            expect(res.body[0].toxicity).to.eql(expectedPlant.toxicity);
            expect(res.body[0].care_details).to.eql(expectedPlant.care_details);
          });
      });
    });
  });

  //----specific plants
  describe(`GET /api/plants/:plant_id`, () => {
    context(`Given no plants`, () => {
      it(`responds with 404`, () => {
        const plantId = 123456;
        return supertest(app)
          .get(`/api/plants/${plantId}`)
          .expect(404, { error: { message: `Plant doesn't exist` } });
      });
    });

    context("Given there are plants in the database", () => {
      const testUsers = makeUsersArray();
      const testPlants = makePlantsArray();

      beforeEach("insert plants", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("plants").insert(testPlants);
          });
      });

      it("responds with 200 and the specified plant", () => {
        const plantId = 2;
        const expectedPlant = testPlants[plantId - 1];
        return supertest(app)
          .get(`/api/plants/${plantId}`)
          .expect(200, expectedPlant);
      });
    });

    context(`Given an XSS attack plant`, () => {
      const testUsers = makeUsersArray();
      const { maliciousPlant, expectedPlant } = makeMaliciousPlant();

      beforeEach("insert malicious plant", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("plants").insert([maliciousPlant]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/plants/${maliciousPlant.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.name).to.eql(expectedPlant.name);
            expect(res.body.plant_type).to.eql(expectedPlant.plant_type);
            expect(res.body.toxicity).to.eql(expectedPlant.toxicity);
            expect(res.body.care_details).to.eql(expectedPlant.care_details);
          });
      });
    });
  });

  describe(`POST /api/plants`, () => {
    const testUsers = makeUsersArray();
    beforeEach("insert malicious plant", () => {
      return db.into("users").insert(testUsers);
    });

    it(`creates a plant, responding with 201 and the new plant`, function () {
      this.retries(3);
      const newPlant = {
        name: "Test new plant",
        plant_type: "Succulent",
        toxicity: "Toxic",
        care_details: "Care detail here",
      };
      return supertest(app)
        .post("/api/plants")
        .send(newPlant)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).to.eql(newPlant.name);
          expect(res.body.plant_type).to.eql(newPlant.plant_type);
          expect(res.body.toxicity).to.eql(newPlant.toxicity);
          expect(res.body.care_details).to.eql(newPlant.care_details);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/plants/${res.body.id}`);
        })
        .then((res) =>
          supertest(app).get(`/api/plants/${res.body.id}`).expect(res.body)
        );
    });

    const requiredFields = ["name", "plant_type", "toxicity", "care_details"];

    requiredFields.forEach((field) => {
      const newPlant = {
        name: "Test new plant",
        plant_type: "Succulent",
        toxicity: "Toxic",
        care_details: "Care detail here",
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newPlant[field];

        return supertest(app)
          .post("/api/plants")
          .send(newPlant)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });

    it("removes XSS attack content from response", () => {
      const { maliciousPlant, expectedPlant } = makeMaliciousPlant();
      return supertest(app)
        .post(`/api/plants`)
        .send(maliciousPlant)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).to.eql(expectedPlant.name);
          expect(res.body.plant_type).to.eql(expectedPlant.plant_type);
          expect(res.body.toxicity).to.eql(expectedPlant.toxicity);
          expect(res.body.care_details).to.eql(expectedPlant.care_details);
        });
    });
  });

  describe(`DELETE /api/plants/:plant_id`, () => {
    context(`Given no plants`, () => {
      it(`responds with 404`, () => {
        const plantId = 123456;
        return supertest(app)
          .delete(`/api/plants/${plantId}`)
          .expect(404, { error: { message: `Plant doesn't exist` } });
      });
    });

    context(`Given there are plants in the database`, () => {
      const testUsers = makeUsersArray();
      const testPlants = makePlantsArray();

      beforeEach("insert plants", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("plants").insert(testPlants);
          });
      });

      it(`responds with 204 and removes the article`, () => {
        const idToRemove = 2;
        const expectedPlants = testPlants.filter(
          (plant) => plant.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/plants/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app).get(`/api/plants`).expect(expectedPlants)
          );
      });
    });
  });
});
