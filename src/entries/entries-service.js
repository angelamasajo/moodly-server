const EntriesService = {
  getAllPlants(knex) {
    return knex.select("*").from("entries");
  },
  insertEntry(knex, newEntry) {
    return knex
      .insert(newEntry)
      .into("entries")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("entries")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteEntry(knex, id) {
    return knex("entries")
      .where({ id })
      .delete();
  },
};

module.exports = EntriesService;
