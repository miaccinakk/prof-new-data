import TypeCalkModel from "~/server/models/TypeCalk";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await TypeCalkModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await TypeCalkModel.find().count();
      return { result, count };
    } else {
      const result = await TypeCalkModel.find();
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
