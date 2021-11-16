const express = require('express')
const router = express.Router();
const User = require('../Modules/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "jbcqjbcyqj@#&*vcqvqu";

router.post('/createuser', [
  body('email', 'Enter a Valid Email').isEmail(),
  body('password', 'Enter a Valid Password').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let user = await User.findOne({ email: req.body.email })
  if (user) {
    return res.status(400).json({ "message": "Email already exixts" })
  }
  const salt = await bcrypt.genSalt(10);
  const encPass = await bcrypt.hash(req.body.password, salt);
  user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: encPass
  });
  res.json({ "message": "Signup Successful" });
});

router.post('/login', [
  body('email', 'Enter a Valid Email').isEmail(),
  body('password', 'Enter a Valid Password').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(400).json({ "message": "User doesn't exixts" })
  }
  const passwordcheck = await bcrypt.compare(req.body.password, user.password);
  if (!passwordcheck) {
    return res.status(400).json({ "message": "User doesn't exixts" })
  }
  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  res.json({ "token": token });
});

router.post('/getuser', async (req, res) => {

  try{
    const decoded = jwt.verify(req.body.token, JWT_SECRET);
    const userid = decoded.id;
    let user = await User.findById(userid).select("-password");
    if (!user) {
      return res.status(400).json({ "message": "User doesn't exixts" })
    }
    res.json(user)
  }catch(err){
      return res.status(401).json({"message":"wrong token"})
  }
});

module.exports = router;