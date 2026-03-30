import ParentGroupModel from "~/server/models/ParentGroup";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined) {
      const result = await ParentGroupModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await ParentGroupModel.find().count();
      return { result, count };
    } else {
      const result = await ParentGroupModel.find();
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
