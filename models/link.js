'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Link extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Link.belongsTo(models.Brand, {
        foreignKey: "uniqueLink",
        as: "brandUniqueLink",
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      })
    }
  };
  Link.init({
    brandUniqueLink: DataTypes.STRING,
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    image: DataTypes.STRING
  },{
    sequelize,
    modelName: 'Link',
  });
  return Link;
};