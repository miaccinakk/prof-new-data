import ElementCalkModel from "~/server/models/ElementCalk";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await ElementCalkModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await ElementCalkModel.find().count();
      return { result, count };
    } else {
      const result = await ElementCalkModel.find();
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
