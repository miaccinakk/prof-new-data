import StageModel from "~/server/models/Stage";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined && !data.Project) {
      const result = await StageModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await StageModel.find().count();
      return { result, count };
    } else {
      const result = await StageModel.find().sort({ level: 1 });
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
