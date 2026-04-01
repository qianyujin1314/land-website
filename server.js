const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/yuanyu');
const Project = mongoose.model('Project',{
  name:String,
  price:String,
  area:String,
  lat:Number,
  lng:Number,
  geojson:Object
});
const User = mongoose.model('User',{
  email:String,
  password:String,
  isSubscribed:Boolean
});
// 项目接口
app.get('/api/projects', async (req,res)=>{
  res.json(await Project.find());
});
// 注册
app.post('/register', async (req,res)=>{
  const user = new User(req.body);
  await user.save();
  res.json(user);
});
// 登录
app.post('/login', async (req,res)=>{
  const user = await User.findOne(req.body);
  if(user) res.json(user);
  else res.status(401).send("error");
});
// 模拟订阅
app.post('/subscribe', async (req,res)=>{
  const user = await User.findById(req.body.id);
  user.isSubscribed = true;
  await user.save();
  res.json(user);
});
app.listen(3000, ()=>console.log("Server running"));
