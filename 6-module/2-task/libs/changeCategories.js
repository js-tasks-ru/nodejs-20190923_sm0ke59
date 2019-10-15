function changeCategories(categories) {
  return answerToUser = categories
      .map((item) => {
        const i = item.toJSON();
        object = {id: i._id, title: i.title, subcategories: i.subcategories};
        if (object.subcategories.length) {
          object.subcategories = object.subcategories.map((i) => {
            return {title: i.title, id: i._id};
          });
        } else {
          return [];
        }
        delete(object.__v);
        return object;
      });
}
module.exports = changeCategories;
