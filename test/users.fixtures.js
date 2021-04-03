function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "user 1",
      user_password: "password 1",
    },
    {
      id: 2,
      user_name: "user 2",
      user_password: "password 2",
    },
    {
      id: 3,
      user_name: "user 3",
      user_password: "password 3",
    },
  ];
}

// function makeUserPlantsArray() {
//   return [
//     {
//       plant_id: 1,
//       user_id: 1,
//     },
//   ];
// }

module.exports = {
  makeUsersArray,
  // makeUserPlantsArray,
};
