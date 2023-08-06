const express = require('express');
const router = express.Router();
const dbModel = require('../utilities/connection');
const mongoDB = require('mongodb');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secretKey = "secretKey"


router.post('/UserLogin', async (req, res, next) => {
  try {
    const email = req.query.email; // Use req.body instead of req.query since it's a POST request
    const password = req.query.password; // Use req.body instead of req.query

    // Assuming dbModel contains the database model
    const data = await dbModel.getCollection();
    const udata = await data.findOne({ email: email });

    if (udata) {
      const passwordData = bcrypt.compareSync(password, udata.password);

      if (passwordData) {
        // Generate a unique token for each user containing their user ID (_id) as the payload
        const tokenId = { id: udata._id };
        const token = jwt.sign(tokenId, secretKey);

        res.send(token);
      } else {
        throw new Error('Invalid Password');
      }
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/checkUser',async(req,res,next)=>{
  const {email} = req.body
  console.log(email);
  const Users = await dbModel.getCollection()
  const isPresent=await Users.find({email:email})
  console.log(isPresent.length);
  if(isPresent.length){
    res.status(400).send({message:'User already exist'})
  }else{
    res.status(201).send({message:'Email not Found'})
  }
})

router.post('/newUserData',async(req,res,next)=>{
  const {password} = req.body
  console.log(req.body);
  console.log(password);
  let UserData = req.body
  const Users = await dbModel.getCollection()
  UserData.passwod= bcrypt.hashSync(password,10)
  console.log(UserData);
  const AddUser = await Users.create(req.body)
  if(AddUser){
    res.status(201).send({message:'Registered Successfully'})
  }else{
    res.status(400).send({message:'Something went wrong'})
  }
})

function VerifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = decoded; // Attach the decoded payload (which contains user._id) to the request
      next();
    });
  } else {
    res.status(401).send('Token not Found'); // Changed to status code 401 (Unauthorized)
  }
} 

// router.post('/Watchlist/:movieId', VerifyToken, async (req, res) => {
//   const MovieId = Number(req.params.movieId)
//   const UserId = (req.user.id);
//   console.log("In add List");
//   console.log(UserId);
//   console.log("Request in watchList", MovieId);
//   const model = await dbModel.getCollection()
//   const userData = await model.find({ _id: UserId })
//   console.log(userData);
//   if(userData){
//     const isPresent = userData[0].watchlist
//     console.log(isPresent);
//     if(!isPresent.includes(MovieId)){
//       console.log("Dont Include",MovieId);
//       const UserData = await model.updateOne({ _id: UserId }, { $push: { watchlist: [MovieId] } })
//       console.log(UserData);
//       if(UserData.nModified=== 1){
//         const updatedData = await model.find({_id:UserId})
//         console.log("updated Data",updatedData);
//         res.status(201).send(updatedData)

//       }
//     }
//   }
// })

router.post('/:watchlist/:movieId', VerifyToken, async (req, res) => {
  const MovieId = Number(req.params.movieId)
  const ListType = (req.params.watchlist)
  const UserId = (req.user.id);
  console.log(ListType,MovieId);
  const model = await dbModel.getCollection()
  const userData = await model.find({ _id: UserId })
  // console.log(userData);
  if(userData){
    const isPresent = userData[0].watchlist
    const isPresentinFav = userData[0].favMovies
    // console.log(isPresent);
    if(!isPresent.includes(MovieId) ){
      console.log("Dont Include",MovieId);
      const UserData = await model.updateOne({ _id: UserId }, { $push: { [ListType]: [MovieId] } })
      if(UserData.nModified=== 1){
        const updatedData = await model.find({_id:UserId})
        console.log("updated Data",updatedData);
        res.status(201).send(updatedData)

      }
    } else
    if(!isPresentinFav.includes(MovieId) ){
      console.log("Dont Include",MovieId);
      const UserData = await model.updateOne({ _id: UserId }, { $push: { [ListType]: [MovieId] } })
      if(UserData.nModified=== 1){
        const updatedData = await model.find({_id:UserId})
        console.log("updated Data",updatedData);
        res.status(201).send(updatedData)

      }
    }
  }
 
})

router.put('/UpdateImage',VerifyToken,async(req,res)=>{
  const UserId = (req.user.id);
  const imageUrl=req.body.profile
  console.log(imageUrl);
  const model = await dbModel.getCollection()
  const UserData = await model.updateOne({ _id: UserId },{profile:imageUrl})
  if(UserData.nModified=== 1){
    const updatedData = await model.find({_id:UserId})
    console.log("updated Data",updatedData);
    res.status(201).send(updatedData)
  }
})

router.put('/remove/:watchlist/:movieId', VerifyToken, async (req, res) => {
  const MovieId = Number(req.params.movieId)
  const UserId = (req.user.id);
  const type= req.params.watchlist
  console.log("In remove List");
  console.log("Request in watchList", UserId);
  const model = await dbModel.getCollection()
  const userData = await model.find({ _id: UserId })
  if(userData){
    const isPresent = userData[0].watchlist
    console.log(UserId);
    console.log(isPresent);
      const UpadateData = await model.updateOne({ _id: req.user.id }, { $pull: { [type]: MovieId } })
      console.log(UpadateData);
      if(UpadateData.nModified=== 1){
        const updatedData = await model.find({ _id: UserId })
        console.log("updated Data",updatedData);
        res.status(201).send(updatedData)
    }
  }
})


router.get('/UserData', VerifyToken, async (req, res) => {
  try {
    const data = await dbModel.getCollection();
    const userData = await data.findOne({ _id: req.user.id }); // Fetch data of the user using the decoded user ID

    if (userData) {
      res.send(userData);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports=router;
