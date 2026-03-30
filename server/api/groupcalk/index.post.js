import GroupCalkModel from "~/server/models/GroupCalk";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await GroupCalkModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await GroupCalkModel.find().count();
      return { result, count };
    } else {
      const result = await GroupCalkModel.find();
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
