// const knex = require("knex");
// const supertest = require("supertest");
// const app = require("../src/app");
// const { makePlantsArray } = require("./plants.fixtures");
// const { makeUsersArray, makeUserPlantsArray } = require("./users.fixtures");

// describe("Users Endpoints", function () {
//   let db;

//   before("make knex instance", () => {
//     db = knex({
//       client: "pg",
//       connection: process.env.TEST_DATABASE_URL,
//     });
//     app.set("db", db);
//   });

//   after("disconnect from db", () => db.destroy());

//   before("clean the table", () =>
//     db.raw("TRUNCATE plants, users, user_plants RESTART IDENTITY CASCADE")
//   );

//   afterEach("cleanup", () =>
//     db.raw("TRUNCATE plants, users, user_plants RESTART IDENTITY CASCADE")
//   );

//   //----all plants with user
//   describe(`GET /api/users/1/plants`, () => {
//     context(`Given no plants with user`, () => {
//       it(`responds with 200 and an empty list`, () => {
//         return supertest(app).get("/api/users/1/plants").expect(200, []);
//       });
//     });

//     context(`Given there are plants with user`, () => {
//       const testUsers = makeUsersArray();
//       const testUserPlants = makeUserPlantsArray();
//       const testPlants = makePlantsArray();

//       beforeEach("insert users", () => {
//         return db
//           .into("users")
//           .insert(testUsers)
//           .then(() => {
//             return db
//               .into("plants")
//               .insert(testPlants)
//               .then(() => {
//                 return db.into("user_plants").insert(testUserPlants);
//               });
//           });
//       });

//       it("responds with 200 and all of the user plants", () => {
//         const expected = [
//           {
//             plant_name: "Monstera Deliciosa",
//             care_details: 'Here"s the care detail for the monstera',
//             toxicity: "Toxic",
//             plant_type: "Tropical",
//             plant_id: 1,
//             user: "user 1",
//             user_id: 1,
//           },
//         ];
//         return supertest(app).get("/api/users/1/plants").expect(200, expected);
//       });
//     });
//   });

//   describe(`POST /api/users/1/plants`, () => {
//     const testUsers = makeUsersArray();
//     const testUserPlants = makeUserPlantsArray();
//     const testPlants = makePlantsArray();

//     beforeEach("insert users", () => {
//       return db
//         .into("users")
//         .insert(testUsers)
//         .then(() => {
//           return db
//             .into("plants")
//             .insert(testPlants)
//             .then(() => {
//               return db.into("user_plants").insert(testUserPlants);
//             });
//         });
//     });

//     it(`creates a user plant, responding with 201 and the new plant`, function () {
//       const newUserPlant = {
//         plant_id: 2,
//         user_id: 1,
//       };
//       return supertest(app)
//         .post("/api/users/1/plants")
//         .send(newUserPlant)
//         .expect(201)
//         .expect((res) => {
//           expect(res.body.plant_id).to.eql(newUserPlant.plant_id);
//           expect(res.body.user_id).to.eql(newUserPlant.user_id);
//         });
//     });

//     const requiredFields = ["plant_id", "user_id"];

//     requiredFields.forEach((field) => {
//       const newUserPlant = {
//         plant_id: 1,
//         user_id: 1,
//       };

//       it(`responds with 400 and an error message when the '${field}' is missing`, () => {
//         delete newUserPlant[field];

//         return supertest(app)
//           .post("/api/users/1/plants")
//           .send(newUserPlant)
//           .expect(400, {
//             error: { message: `Missing '${field}' in request body` },
//           });
//       });
//     });
//   });

//   describe(`DELETE /api/users/1/plants/:plant_id`, () => {
//     context(`Given no plants`, () => {
//       it(`responds with 204, no content`, () => {
//         const plantId = 123456;
//         return supertest(app)
//           .delete(`/api/users/1/plants/${plantId}`)
//           .expect(204);
//       });
//     });

//     context(`Given there are user plants in the database`, () => {
//       const testUsers = makeUsersArray();
//       const testUserPlants = makeUserPlantsArray();
//       const testPlants = makePlantsArray();

//       beforeEach("insert users", () => {
//         return db
//           .into("users")
//           .insert(testUsers)
//           .then(() => {
//             return db
//               .into("plants")
//               .insert(testPlants)
//               .then(() => {
//                 return db.into("user_plants").insert(testUserPlants);
//               });
//           });
//       });

//       it(`responds with 204 and removes the article`, () => {
//         const idToRemove = 1;
//         const expectedUserPlants = testUserPlants.filter(
//           (plant) => plant.plant_id !== idToRemove
//         );

//         return supertest(app)
//           .delete(`/api/users/1/plants/${idToRemove}`)
//           .expect(204)
//           .then((res) =>
//             supertest(app).get(`/api/users/1/plants`).expect(expectedUserPlants)
//           );
//       });
//     });
//   });
// });
