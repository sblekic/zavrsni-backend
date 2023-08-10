export const formatToTitleCase = (req, res, next) => {
  let str = req.query._any;
  if (!str) {
    return "";
  }

  req.query._any = str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase().concat(word.substr(1));
    })
    .join(" ");

  next();
};
