const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require('../Modules/Note')
const jwt = require('jsonwebtoken');

const JWT_SECRET = "jbcqjbcyqj@#&*vcqvqu";

router.get('/fetchallnotes', async (req, res) => {
    const decoded = jwt.verify(req.body.token, JWT_SECRET);
    const userid = decoded.id;
    const notes = await Note.find({mainid:userid}).select("-mainid -password -date -__v");
    res.json(notes);
})

router.post('/createnote', [
    body('title', 'Enter a Valid Title').isLength({ min: 3 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const decoded = jwt.verify(req.body.token, JWT_SECRET);
        const userid = decoded.id;
        const note = await Note.create({
            mainid: userid,
            title: req.body.title,
            author: req.body.author,
            desc: req.body.desc,
            tag: req.body.tag,
        });
        res.json({
            noteid:note._id,
            notetitle:note.title,
            notedesc:note.desc,
            noteauthor:note.author,
            notetag:note.tag
        });
    }catch(e){
        res.json({"message":"Wrong Token"});
    }
})

router.post('/updatenote',[
    body('title', 'Enter a Valid Title').isLength({ min: 3 })
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const decoded = jwt.verify(req.body.token, JWT_SECRET);
    const userid = decoded.id;
    var note = await Note.findById(req.body.id);
    if(!note){
        return res.json({"message":"note doesn't exist"})
    }
    if(!userid===note.mainid){
        return res.status(401).json({"message":"permission denied"})
    }
    await Note.updateOne({"_id":req.body.id},{
        mainid: userid,
        title: req.body.title,
        author: req.body.author,
        desc: req.body.desc,
        tag: req.body.tag,
    })
    note = await Note.findById(req.body.id);
    res.json({
        noteid:note._id,
        notetitle:note.title,
        notedesc:note.desc,
        noteauthor:note.author,
        notetag:note.tag
    })
})

router.post('/deletenote',async (req,res)=>{
    const decoded = jwt.verify(req.body.token, JWT_SECRET);
    const userid = decoded.id;
    var note = await Note.findById(req.body.id);
    if(!note){
        return res.json({"message":"note doesn't exist"})
    }
    if(!userid===note.mainid){
        return res.status(401).json({"message":"permission denied"})
    }
    await Note.findByIdAndDelete(req.body.id);
    res.json({"message":"deleted successfully"})
})

module.exports = router;