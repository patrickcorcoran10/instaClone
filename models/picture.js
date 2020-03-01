module.exports = function(sequelize, DataTypes) {
  const Picture = sequelize.define("Pictures", {
    picture: DataTypes.STRING,
    comment: DataTypes.STRING,
    poster: DataTypes.STRING
  });
  return Picture;
};
