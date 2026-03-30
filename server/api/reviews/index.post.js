import ReviewsModel from "~/server/models/Reviews";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined && !data.Project) {
      const result = await ReviewsModel.find()
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await ReviewsModel.find().count();
      return { result, count };
    } else if (data == undefined) {
      const result = await ReviewsModel.find();
      return { result, count };
    } else if (data.Project) {
      const result = await ReviewsModel.find({ project: data.Project });
      return { result, count };
    }
  } catch (err) {
    console.error(err);
    return {
      result: [],
      count: 0,
      error: true,
    };
  }
});
