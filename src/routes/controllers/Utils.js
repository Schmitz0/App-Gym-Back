// const axios = require('axios');
const { Class, Routine, Membresy, User } = require('../../db.js')


const getClass = async () => {
    const classes = await Class.findAll({
        attributes: ["name", "instructor", "date"],
        // include: [
        //     {
        //         model: Country,
        //         attributes: [
        //             "id",
        //             "name",
        //             "flag",
        //             "capital",
        //         ],
        //     }
        // ]
    })
    return classes;
}

const getMembresies = async () => {
    const membresies = await Membresy.findAll({
        attributes: ["name", "cost", "expiration"],
        // include: [
        //     {
        //         model: Country,
        //         attributes: [
        //             "id",
        //             "name",
        //             "flag",
        //             "capital",
        //         ],
        //     }
        // ]
    })
    return membresies;
}

const getRoutines = async () => {
    const routines = await Routine.findAll({
        attributes: ["name", "createdBy", "duration", "difficulty", "category"],
        // include: [
        //     {
        //         model: Country,
        //         attributes: [
        //             "id",
        //             "name",
        //             "flag",
        //         ],
        //     }
        // ]
    })
    return routines;
}


const getUsers = async () => {
    const users = await User.findAll({
        attributes: ["name", "email", "hashPassword", "role"],
        // include: [
        //     {
        //         model: Country,
        //         attributes: [
        //             "id",
        //             "name"
        //         ],
        //     }
        // ]
    })
    return users;
}


const findUserRoutinesById = async (id, name, category, duration, difficulty) => {
    const usersModel = await User.findAll({
      include: [
        {
          model: Routine,
          attributes: ["name", "createdBy", "duration", "difficulty","category"],
          where:{
            id:id,
            name:{
                [Sequelize.Op.in]: name
            },
            category:{
                [Sequelize.Op.in]: category
            },
            duration:{
                [Sequelize.Op.in]: duration
            },
            difficulty:{
                [Sequelize.Op.in]: difficulty
            },
          }
        },
      ],
    });
    return usersModel;
  };


module.exports = { getClass, getRoutines, getMembresies, getUsers ,findUserRoutinesById}