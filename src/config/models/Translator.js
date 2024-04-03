module.exports = (sequelize, DataTypes) => {
    const Translators = sequelize.define("Translators", {
      tran_name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },{timestamps: false});
    return Translators;
  };