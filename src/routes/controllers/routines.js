const { Router } = require('express');
const { User , Routine, Excercise, Muscle, Product, Membresy, Class, User_Routine} = require('../../db.js');
const { filterData, getRoutines , findUserRoutinesById } = require('./Utils.js');
const userExtractor = require('../middleware/userExtractor.js')
const { Op } = require("sequelize");

const router = Router();

router.post('/', userExtractor, async (req, res) => {
    try {
        let { name, createdBy, duration, difficulty, category } = req.body;
        if (!name || !createdBy || !duration || !difficulty || !category ) return res.status(400).json('Missing inputs')

            let newRoutine = await Routine.create({
                name,
                createdBy,
                duration,
                difficulty,
                category,
            });
            res.status(200).json(newRoutine);

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.get('/:idRoutine', userExtractor, async (req, res) => {
    try {
        const { idRoutine } = req.params;
        const routineSelected = await Routine.findByPk(idRoutine);    
        res.status(200).send(routineSelected);
    } catch (error) {
        res.status(400).send(error.message)
    }
    
})

router.get('/', userExtractor, async (req, res) => {

    const { id , filters } = req.body;

    const { favourite } = req.query;

    console.log(favourite)

    let userData;

    let dataFiltered;

    if(favourite) {
        console.log("aca entre")
        try {
            userData = await User.findByPk(1, {
                include:{
                    model: Routine,
                    include:{
                        model: Excercise,
                        include:{
                            model: Muscle
                        }
                    }
                }
            })
        } catch (error) {
            res.status(400).send(error.message)
        }

        dataFiltered = filterData(userData.routines,{owned:true,favourite:true})

        return res.status(200).json(dataFiltered)
    }

    if(!filters.owned){
        try {
            userData = await Routine.findAll({
                include:{
                    model: Excercise,
                    include:{
                        model: Muscle
                    }
                }
            })
        } catch (error) {
            res.status(400).send(error.message)
        }
        

    if(Object.entries(filters).length === 0) return res.status(200).json(userData)

    dataFiltered = filterData(userData,filters)

    }
    else{
        try {
            userData = await User.findByPk(1, {
                include:{
                    model: Routine,
                    include:{
                        model: Excercise,
                        include:{
                            model: Muscle
                        }
                    }
                }
            })
        } catch (error) {
            res.status(400).send(error.message)
        }

    if(Object.entries(filters).length === 1) return res.status(200).json(userData.routines)

    dataFiltered = filterData(userData.routines,filters)

    }

    res.status(200).json(dataFiltered)

})

router.patch('/:idRoutine', userExtractor, async (req, res) => {

    const { id } = req.body;
    const { idRoutine } = req.params;

    if(!id || !idRoutine) return res.status(400).send("Faltan datos");

    const routine = await User_Routine.findOne({
        where:{
            [Op.and]: [{ userId: id }, { routineId: idRoutine }],
        }
    })

    const aux = routine.favourite
    
    await routine.update({
        favourite:!aux,
    })
    

    res.status(200).json(routine)

})

module.exports = router;