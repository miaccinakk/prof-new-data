import ItemCalkModel from "~/server/models/ItemCalk";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await ItemCalkModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await ItemCalkModel.find().count();
      return { result, count };
    } else {
      const result = await ItemCalkModel.find();
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
