module.exports = (sequelize, DataTypes) => {
    const Author = sequelize.define("Author", {
      other_name: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },{timestamps: false});
    return Author;
  };