const express = require("express")
const bodyParser = require("body-parser");
const ejs = require("ejs")
var _ = require("lodash")
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();

const homeStartContent = "Welcome to our Daily Journal website, your go-to destination for staying organized, reflective, and focused. Whether you are looking to start journaling or looking for a new platform to record your daily thoughts and ideas, our website is the perfect place for you.We understand that journaling is a powerful tool for personal growth, and our website aims to make it simple and accessible for everyone. Our user-friendly interface allows you to easily create and customize your journal entries, add photos, and tag your thoughts for easy searching.With our website, you can make journaling a daily habit, set reminders to ensure you never miss a day, and track your progress over time. Plus, with our secure cloud-based storage, you can access your journal from any device, anytime, anywhere.But that's not all. Our website also offers a range of resources and prompts to help you kickstart your journaling journey, including daily writing prompts, inspirational quotes, and goal-setting templates.At Daily Journal, we believe that journaling can help you achieve a more balanced and fulfilling life, and we are committed to supporting you every step of the way. Sign up today and start journaling with ease!"

const aboutContent = "Welcome to Daily Journal, where we believe that journaling is a powerful tool for personal growth and self-discovery. Our mission is to make journaling accessible and easy for everyone, no matter your skill level or experience.We believe that daily journaling can help you achieve a more balanced and fulfilling life, by providing a space to reflect on your thoughts, feelings, and experiences. Whether you are looking to reduce stress, improve your mental health, or simply document your life journey, our website is here to support you every step of the way.Our team is made up of passionate journalers who understand the transformative power of this practice. We are dedicated to providing you with the best resources, tips, and tools to make journaling an enjoyable and rewarding experience.We also believe in the importance of community and connection. That's why we offer a space for users to share their journal entries and connect with other journalers. We believe that by supporting each other, we can all achieve our personal growth and self-improvement goals.Thank you for choosing Daily Journal as your go-to journaling platform. We are honored to be a part of your journey towards a more fulfilling and balanced life."

mongoose.connect( process.env.MONGOURI, {useNewUrlParser:true});

const postSchema = mongoose.Schema({
    title:String,
    content:String
});

const infoSchema = mongoose.Schema({
    name:String,
    email:String,
    message:String
});

const Info = mongoose.model("Info" , infoSchema);

const Post = mongoose.model("Post" , postSchema);


app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine" , "ejs");
app.use(express.static("public"));

const date = require(__dirname+"/date.js");

app.post("/compose" , function(req , res){
    const titleName = req.body.Title;
    const para = req.body.journal;

    const post = new Post({
        title:titleName,
        content:para
    });
    post.save()
    .then(function(){
        res.redirect("/");
    })
    .catch(function(err){
        console.log(err);
    });
    
     
});

app.post("/contact", function(req , res){
    const adminName = req.body.custName;
    const adminEmail = req.body.custEmail;
    const adminMessage = req.body.custMessage;
    const info = new Info({
        name:adminName,
        email:adminEmail,
        message:adminMessage
    });

    info.save()
    .then(function(){
        res.redirect("/");
    })
    .catch(function(err){
        console.log(err);
    });
});


app.get("/" , function(req , res)
{
   Post.find({})
   .then(function(posts){
    res.render("home" ,{
        homeContent:homeStartContent,
        posts:posts});
   })
   .catch(function(err){
    console.log(err);
});
    
});

app.get("/contact" , function(req , res){
    res.render("contact" , {});
    
});

app.get("/about" , function(req , res){
    res.render("about" , {aboutContents:aboutContent});
   
});
app.get("/compose" , function(req , res){
    res.render("compose" , {})
    
});

app.get("/:postId" , function(req , res){
   
    var requestId =  req.params.postId;
    

    Post.findOne({_id:requestId})
    .then(function(post){
        
        
            res.render("read" , {
                title:post.title ,
                content:post.content ,
                
            });
        

    })
    .catch(function(err){
        console.log(err);
    });
    


});

app.listen(3000 , function(){
    console.log("server is on at 3000");
})