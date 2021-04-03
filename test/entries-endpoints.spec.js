const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makeEntriesArray, makeMaliciousEntry } = require("./entries.fixtures");
const { makeUsersArray } = require("./users.fixtures");

describe("Entries Endpoints", function () {
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
    db.raw("TRUNCATE users, entries RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE users, entries RESTART IDENTITY CASCADE")
  );

  //-----all plants
  describe(`GET /api/entries`, () => {
    context(`Given no entries`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/entries").expect(200, []);
      });
    });

    context("Given there are entries in the database", () => {
      const testUsers = makeUsersArray();
      const testEntries = makeEntriesArray();

      beforeEach("insert entries", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("entries").insert(testEntries);
          });
      });

      it("responds with 200 and all of the entries", () => {
        return supertest(app).get("/api/entries").expect(200, testEntries);
      });
    });

    context(`Given an XSS attack plant`, () => {
      const testUsers = makeUsersArray();
      const { maliciousEntry, expectedEntry } = makeMaliciousEntry();

      beforeEach("insert malicious entry", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("entries").insert([maliciousEntry]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/entries`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].title).to.eql(expectedEntry.title);
            expect(res.body[0].description).to.eql(expectedEntry.description);
            expect(res.body[0].mood).to.eql(expectedEntry.mood);
          });
      });
    });
  });

  //----specific plants
  describe(`GET /api/entries/:id`, () => {
    context(`Given no entries`, () => {
      it(`responds with 404`, () => {
        const entryId = 123456;
        return supertest(app)
          .get(`/api/plants/${entryId}`)
          .expect(404);
      });
    });

    context("Given there are entries in the database", () => {
      const testUsers = makeUsersArray();
      const testEntries = makeEntriesArray();

      beforeEach("insert entries", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("entries").insert(testEntries);
          });
      });

      it("responds with 200 and the specified entry", () => {
        const entryId = 2;
        const expectedEntry = testEntries[entryId - 1];
        return supertest(app)
          .get(`/api/entries/${entryId}`)
          .expect(200, expectedEntry);
      });
    });


  describe(`POST /api/entries`, () => {
    const testUsers = makeUsersArray();
    beforeEach("insert malicious entry", () => {
      return db.into("users").insert(testUsers);
    });

    it(`creates an entry, responding with 201 and the new entry`, function () {
      this.retries(3);
      const newEntry = {
        title: "Test new entry",
        description: "this is the description",
        mood: "happy",
      };
      return supertest(app)
        .post("/api/entries")
        .send(newEntry)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(newEntry.title);
          expect(res.body.description).to.eql(newEntry.description);
          expect(res.body.mood).to.eql(newEntry.mood);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/entries/${res.body.id}`);
        })
        .then((res) =>
          supertest(app).get(`/api/entries/${res.body.id}`).expect(res.body)
        );
    });

    const requiredFields = ["title", "description", "mood"];

    requiredFields.forEach((field) => {
      const newEntry = {
        title: "Test new entry",
        description: "this is the description",
        mood: "happy",
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newEntry[field];

        return supertest(app)
          .post("/api/entries")
          .send(newEntry)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });

    it("removes XSS attack content from response", () => {
      const { maliciousEntry, expectedEntry } = makeMaliciousEntry();
      return supertest(app)
        .post(`/api/entries`)
        .send(maliciousEntry)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(expectedEntry.title);
          expect(res.body.description).to.eql(expectedEntry.description);
          expect(res.body.mood).to.eql(expectedEntry.mood);
        });
    });
  });

  describe(`DELETE /api/entries/:id`, () => {
    context(`Given no entries`, () => {
      it(`responds with 404`, () => {
        const entryId = 123456;
        return supertest(app)
          .delete(`/api/plants/${entryId}`)
          .expect(404);
      });
    });

    context(`Given there are entries in the database`, () => {
      const testUsers = makeUsersArray();
      const testEntries = makeEntriesArray();

      beforeEach("insert entries", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("entries").insert(testEntries);
          });
      });

      it(`responds with 204 and removes the article`, () => {
        const idToRemove = 2;
        const expectedEntries = testEntries.filter(
          (entry) => entry.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/entries/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app).get(`/api/entries`).expect(expectedEntries)
          );
      });
    });
  });
});
})