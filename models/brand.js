'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Hr method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Brand.belongsTo(models.User, {
        foreignKey: "userId",
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      });
      Brand.hasMany(models.Link, {
        foreignKey: "uniqueLink"
      })
    }
  };
  Brand.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    uniqueLink: {type: DataTypes.STRING, unique: true},
    viewCount: DataTypes.INTEGER,
    templateId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  },{
    sequelize,
    modelName: 'Brand',
  });
  return Brand;
};