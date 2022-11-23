const { Router } = require("express");
const bcrypt = require('bcrypt');
const { User , Routine, Excercise, Muscle, Product, Membresy, Class, User_Routine } = require('../../db.js')
const jwt = require('jsonwebtoken')
const userExtractor = require('../middleware/userExtractor.js')
//
const router = Router();

router.get('/', userExtractor, async (req,res) => {

   return res.status(200).json({id: req.body.id, userRole: req.body.userRole})

})

//"google-oauth2|104240256115839630283"

router.post('/', async (req,res) => {

    let { email, password, name , imgUrl} = req.body;

    if(!email || !password || !name) return res.status(400).send("Faltan datos")

    if(!imgUrl){
        imgUrl = "https://wellesleysocietyofartists.org/wp-content/uploads/2015/11/image-not-found.jpg";
    }

    try {

        const checkingUser = await User.findOne({where: {email:email}})

        const userForToken = {
            id: checkingUser.id,
            userRole: checkingUser.role,
            userName: checkingUser.name,
        }
    
        const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 * 24 * 7})
    
        return res.status(200).send({
            token,
            userRole: checkingUser.role
        })

    } catch (error) {

        const date = new Date( Date.now() ).toString()

        const newUser = await User.create({
            email,
            hashPassword : await bcrypt.hash(password,8),
            name,
            imgUrl,
            membresyExpDate: date
        })
    
        const userForToken = {
            id: newUser.id,
            userRole: newUser.role,
            userName: newUser.name,
        }
    
        const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 * 24 * 7})
    
        return res.status(200).send({
            token,
            userRole: newUser.role,
        })
    }

})

/*router.put('/', async (req,res) => {

    const user1 = await User.findByPk(1);
    await user1.addRoutine(1);
    await user1.addRoutine(2);

    const routine1 = await Routine.findByPk(1);

    await routine1.addExcercise(1)
    await routine1.addExcercise(2)
    await routine1.addExcercise(3)
    await routine1.addExcercise(4)

    const excercise1 = await Excercise.findByPk(1);
    const excercise2 = await Excercise.findByPk(2);
    const excercise3 = await Excercise.findByPk(3);
    const excercise4 = await Excercise.findByPk(4);

    await excercise1.setMuscle(1)
    await excercise2.setMuscle(2)
    await excercise3.setMuscle(3)
    await excercise4.setMuscle(4)

    const user2 = await User.findByPk(2);
    await user2.addRoutine(2);

    const routine2 = await Routine.findByPk(2);

    await routine2.addExcercise(1)
    await routine2.addExcercise(2)
    await routine2.addExcercise(5)
    await routine2.addExcercise(6)

    const excercisec = await Excercise.findByPk(5);
    const excercised = await Excercise.findByPk(6);

    await excercisec.setMuscle(5)
    await excercised.setMuscle(6)

    const usuario = await User_Routine.findOne({where:{userId:1}})
    
    await usuario.update({
        favourite:true,
    })

    res.json("Relaciones cargadas")

})*/

module.exports = router;
