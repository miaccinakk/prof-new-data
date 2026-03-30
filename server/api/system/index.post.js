import SystemModel from "~/server/models/System";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await SystemModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await SystemModel.find().count();
      return { result, count };
    } else {
      const result = await SystemModel.find();
      return result;
    }
  } catch (err) {
    return {
      result: [],
      count: 0,
      error: true,
    };
  }
});
