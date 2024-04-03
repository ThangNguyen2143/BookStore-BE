module.exports = (sequelize, DataTypes) => {
    const Field = sequelize.define("Field", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },{timestamps: false});
    Field.association = module =>{
        Field.hasMany(module.TypeBook)
    }
    return Field;
  };