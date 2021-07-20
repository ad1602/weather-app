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
    const cityCap = city.charAt(0).toUpperCase() + city.slice(1);
    let lat,lon;
    const key=process.env.API_KEY;
    const key2=process.env.API_KEY2;
    
    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+key+"&units=metric";
    
    https.get(url,function(resp){
        resp.on("data",function(data){
            const weather=JSON.parse(data);

             lat=weather.coord.lat;
             lon=weather.coord.lon;
             const icon=weather.weather[0].icon;
             const temp=weather.main.temp;
             const feels=weather.main.feels_like;
             const wind=weather.wind.speed;
             const description=weather.weather[0].description;
             
             const img_url="http://openweathermap.org/img/wn/"+icon+"@2x.png";

             const url2="https://api.timezonedb.com/v2.1/get-time-zone?key="+key2+"&format=json&by=position&lat="+lat+"&lng="+lon;
           
            
            var months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
            var days=["SUN","MON","TUE","WED","THU","FRI","SAT"];

             
             https.get(url2,function(resp){
                 resp.on("data",function(data){
                    
                     const time=JSON.parse(data);
                     const timeString=time.formatted;
                     const timestamp=time.timestamp;
                    

                    var date = new Date(timestamp);
                    
                    const day=days[date.getDay()];
                   

                    var month = parseInt(timeString.slice(5,7));
                    var dd = parseInt(timeString.slice(8,10));
                    var hh = parseInt(timeString.slice(11,13));
                    var min = parseInt(timeString.slice(14,16));
                    let mm=months[month-1];
                    
                     
                     const final_date= day+" | " +mm+" "+dd+" | "+hh+":"+min;

                     res.render("result",{ icon:img_url , location:cityCap , date_time:final_date , tem:temp , desc:description , feels:feels ,wind:wind});
                 })
             })
            
            
        })
        
    })
    
         

       

    })




app.listen(process.env.PORT || 1000,function(){
    console.log("server is running on port 1000");
})