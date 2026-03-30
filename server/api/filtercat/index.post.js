import FilterModel from "~/server/models/Filter";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    const obj = { id_category: data.FilterCat };
    const result = await FilterModel.find(obj);
    return result;
  } catch (err) {
    return {
      result: [],
      count: 0,
      error: true,
    };
  }
});
