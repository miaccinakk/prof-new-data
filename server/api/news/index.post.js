import NewsModel from "~/server/models/News";

export default defineEventHandler(async (event) => {
  try {
    const data = (await readBody(event)) || {};

    const filter = {};
    if (!data.Project) {
      if (data.levelFilter) {
        filter.level_index = { $in: [1, 2, 3] };
      }

      let query = NewsModel.find(filter).sort({ level: 1 });

      if (data.selectFields) {
        // Минимальные поля для списка статей (без description, galery и других тяжёлых данных)
        query = query.select("title kirilica");
      }

      // Применяем пагинацию
      if (data.sortPage !== undefined) {
        query = query.skip(data.sortPage);
      }
      // Применяем лимит если указан pageSize
      if (data.pageSize !== undefined) {
        query = query.limit(data.pageSize);
      }

      const result = await query;
      const count = await NewsModel.countDocuments(filter);
      return { result, count };
    } else {
      const result = await NewsModel.find().sort({ level: 1 });
      return result;
    }
  } catch (err) {
    console.error("Ошибка в API /news:", err);
    return { error: "Произошла ошибка при загрузке данных" };
  }
});
