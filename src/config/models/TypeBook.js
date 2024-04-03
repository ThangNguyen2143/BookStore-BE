module.exports = (sequelize, DataTypes) => {
    const TypeBook = sequelize.define("TypeBook", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },{timestamps: false});
    TypeBook.association = module =>{
        TypeBook.hasMany(module.Book)
    }
    return TypeBook;
  };