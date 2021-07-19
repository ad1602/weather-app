const express= require("express");
const https=require("https");
const bodyParser=require("body-parser");

require('dotenv').config();

const app=express();

app.set("view engine","ejs");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));



app.get("/",function(req,res){
     res.sendFile(__dirname+"/index.html");
})

app.post("/again",function(req,res){
    res.redirect("/");
})

app.post("/",function(req,res){
    var city=String(req.body.cty);
    const key=process.env.API_KEY;
    
    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+key+"&units=metric";
    
    https.get(url,function(resp){
        resp.on("data",function(data){
            const weather=JSON.parse(data);
            // console.log(weather);
            const icon=weather.weather[0].icon;
            const temp=weather.main.temp;
            const feels=weather.main.feels_like;
            // const temp_max=weather.main.temp_max;
            // const temp_min=weather.main.temp_min;
            // const pressure=weather.main.pressure;
            const wind=weather.wind.speed;
            const description=weather.weather[0].description;
            
            const img_url="http://openweathermap.org/img/wn/"+icon+"@2x.png";
            // res.write("<p>The weather in "+ city + " is currently "+desc+"<p>");
            // res.write("<p>temperature:"+ temp +"<p>");
            // res.write("<p>pressure:"+ pressure +"<p>");
            // res.write("<p>wind-speed:"+ wind +"<p>");
            // res.write("<img src=" + img_url +">");
            // res.send();
            var months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
            var days=["SUN","MON","TUE","WED","THU","FRI","SAT"];
            const date = new Date();
            const dd= date.getDate();
            const mm=months[date.getMonth()];
            const hh=date.getHours();
            const min=date.getMinutes();
            const day=days[date.getDay()];
            const final_date= day+" | " +mm+" "+dd+" | "+hh+":"+min;

            
            res.render("result",{ icon:img_url , location:city , date_time:final_date , tem:temp , desc:description , feels:feels ,wind:wind});


        })
    })
    
    })




app.listen(process.env.PORT || 1000,function(){
    console.log("server is running on port 1000");
})