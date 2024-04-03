module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define("Book", {
      publication_date: {
        type: DataTypes.DATE(6),
        allowNull: false,
      },
      national:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      number_of_pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
    });
    Book.associate = module =>{
          Book.belongsTo(module.Product)

    }
    return Book;
  };