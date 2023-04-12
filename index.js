//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const ejs = require("ejs");
const _ =require("lodash");
const path=require("path");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('views', path.join(__dirname, 'views'));
var posts=[];
app.set('view engine', 'ejs');
require("dotenv").config();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname+"/public"));
//mongoose.connect("mongodb://127.0.0.1:27017/ejs");
//async function run()

   mongoose.connect(process.env.DB_key).then(()=> {
    console.log("connected md");
   })
    .catch((err)=>
   {
    console.log(err);
 });
//};
//run();


const blogschema={
    title:String, compose_content:String
};
const blog=mongoose.model("Blog",blogschema);
const post1=new blog({
    title:"example",
    compose_content:"this is an example of how your post will be seen"
});





  




app.get("/", async function(req,res)
{
    await blog.find({}).then( async function(item)
{ 
    if(item.length===0)
    {  await post1.save();
        res.redirect("/");

    }
    else
      {
    res.render("./home",{home_content:homeStartingContent,post:item});
      }

   
   
});});
app.get("/contact",function(req,res)
{
    res.render("./contact",{contact_content:contactContent});
});
app.get("/about",function(req,res)
{
    res.render("./about",{about_content:aboutContent});
});
app.get("/compose",function(req,res)
{
    res.render("./compose");
});
app.post("/compose", async function(req,res)
{
   if(req.body.Title.length !=0 && req.body.compose_content.length !=0)
   {
   const  post=new blog({
    compose_content:req.body.compose_content,
    title:req.body.Title

   });
   await post.save();
}
   
   res.redirect("/");
 
   
});
app.get("/post/:title",function(req,res)
{
    const t=_.lowerCase(req.params.title);
    var flag=0;
  
    blog.find({}).then(function(item)
{   item.forEach(function(e)
    {
        if(t===_.lowerCase(e.title) && flag===0)
        {
            flag=1;
            res.render("./post",{post:e})
            
        }

    });
   

   
   
});

});
app.post("/", function(req,res)
{
   
   res.render("./compose");
 
   
});
app.post("/delete/:title",async function(req,res)
{
    const t=_.lowerCase(req.params.title);
  
    await blog.find({}).then(function(item)
{   item.forEach(async function(e)
    {
        if(item.length >1)
        {
       
        if(t===_.lowerCase(e.title) )
        {
           console.log("hello" + e.title + " " + e._id +" "+"delete this");
            
           await blog.findByIdAndDelete(e._id);
         
        }
    }

    });
    res.redirect("/");
   

   
   
});




});















app.listen(process.env.PORT || 3000,function()
{
    console.log("running");
});


