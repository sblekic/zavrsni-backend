export const formatToTitleCase = (req, res, next) => {
  let str = req.query._any;
  if (!str) {
    console.log("nema query string");
    return next();
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
