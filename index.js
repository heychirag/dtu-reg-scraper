require('newrelic');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  var result = 'App is running';
  response.send(result);
}).listen(app.get('port'), function() {
  console.log('App is running, server is listening on port ', app.get('port'));
});

var request = require('request');
var writeFile = require('write');
var html2json = require('html2json').html2json;
var htmlParser = require('html-parser');
const jsdom = require("jsdom");
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const { JSDOM } = jsdom;

var scrape = [
    {
        'branch':'AE',
        'year':'2K15',
        'start':1,
        'end':90
    },
    {
        'branch':'AE',
        'year':'2K16',
        'start':501,
        'end':508
    },
    {
        'branch':'BT',
        'year':'2K15',
        'start':1,
        'end':35
    },
    {
        'branch':'BT',
        'year':'2K16',
        'start':501,
        'end':505
    },
    {
        'branch':'CE',
        'year':'2K15',
        'start':1,
        'end':130
    },
    {
        'branch':'CE',
        'year':'2K16',
        'start':501,
        'end':503
    },
    {
        'branch':'CO',
        'year':'2K15',
        'start':1,
        'end':150
    },
    {
        'branch':'EC',
        'year':'2K15',
        'start':1,
        'end':195
    },
    {
        'branch':'EE',
        'year':'2K15',
        'start':1,
        'end':145
    },
    {
        'branch':'EE',
        'year':'2K16',
        'start':501,
        'end':504
    },
    {
        'branch':'EL',
        'year':'2K15',
        'start':1,
        'end':100
    },
    {
        'branch':'EL',
        'year':'2K16',
        'start':501,
        'end':503
    },
    {
        'branch':'EN',
        'year':'2K15',
        'start':1,
        'end':60
    },
    {
        'branch':'EN',
        'year':'2K16',
        'start':501,
        'end':506
    },
    {
        'branch':'EP',
        'year':'2K15',
        'start':1,
        'end':80
    },
    {
        'branch':'EP',
        'year':'2K16',
        'start':501,
        'end':520
    },
    {
        'branch':'MC',
        'year':'2K15',
        'start':1,
        'end':103
    },
    {
        'branch':'ME',
        'year':'2K15',
        'start':1,
        'end':200
    },
    {
        'branch':'IT',
        'year':'2K15',
        'start':1,
        'end':105
    },
    {
        'branch':'PE',
        'year':'2K15',
        'start':1,
        'end':40
    },
    {
        'branch':'PE',
        'year':'2K16',
        'start':501,
        'end':515
    },
    {
        'branch':'PS',
        'year':'2K15',
        'start':1,
        'end':50
    },
    {
        'branch':'PS',
        'year':'2K16',
        'start':501,
        'end':513
    },
    {
        'branch':'SE',
        'year':'2K15',
        'start':1,
        'end':100
    },
    {
        'branch':'SE',
        'year':'2K16',
        'start':501,
        'end':504
    }
];


var db;

var DB_URI = "mongodb://<user>:<pass>@<database>";

var loginHeaders = {
  'Host': 'reg.exam.dtu.ac.in:8080',
  'Connection': 'keep-alive',
  'Content-Length': '81',
  'Pragma': 'no-cache',
  'Cache-Control': 'no-cache',
  'Origin': 'http://reg.exam.dtu.ac.in:8080',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Referer': 'http://reg.exam.dtu.ac.in:8080/index.php',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en-US,en;q=0.8',
  'Cookie': 'PHPSESSID=etksl6a0i8e9721ir12kf8egsn'
};

var pageHeaders = {
  'Host': 'reg.exam.dtu.ac.in:8080',
  'Connection': 'keep-alive',
  'Pragma': 'no-cache',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Referer': 'http://reg.exam.dtu.ac.in:8080/index.php',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en-US,en;q=0.8',
  'Cookie': 'PHPSESSID=etksl6a0i8e9721ir12kf8egsn'
};

var logoutHeaders = {
  'Host': 'reg.exam.dtu.ac.in:8080',
  'Connection': 'keep-alive',
  'Pragma': 'no-cache',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Referer': 'http://reg.exam.dtu.ac.in:8080/reg_success.php',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en-US,en;q=0.8',
  'Cookie': 'PHPSESSID=etksl6a0i8e9721ir12kf8egsn'
};

var loginUri = 'http://reg.exam.dtu.ac.in:8080/index.php';
var pageUri = 'http://reg.exam.dtu.ac.in:8080/reg_success.php';
var logoutUri = 'http://reg.exam.dtu.ac.in:8080/logout/index.php';


var fetchStudent = function(year,branch,serial,end,curr){
    var next=serial+1;
    serial=serial.toString();
    if(serial.length==1){
        serial='0'+serial;
    }
    if(serial==end){
        console.log(scrape[curr+1].year+'/'+scrape[curr+1].branch+'/');
        fetchStudent(scrape[curr+1].year,scrape[curr+1].branch,scrape[curr+1].start,scrape[curr+1].end,curr+1);
        return;
    }
    var rollNo = year+'/'+branch+'/'+serial;
    //console.log(rollNo);
    request ({
        headers: loginHeaders,
        uri: loginUri,
        body: 'username='+year+'%2F'+branch+'%2F'+serial+'&password=11-11-1111&session=2017-2018&sem=5&submit=Log+In',
        method: 'POST'
    }, function (loginError, loginRes, loginBody) {
        //console.log('code = ', loginRes.statusCode);
        if(loginError){
            console.log(loginError);
        }
        else if(!(loginRes.statusCode==200)){
            request ({
                headers: pageHeaders,
                uri: pageUri,
                method : 'GET'
            }, function (pageError, pageRes, pageBody) {
                if(pageError){
                    console.log (pageError);
                }
                else {
                    writeFile('foo.html',pageBody, function(err) {
                        if (err) console.log(err);
                    });
                    //console.log(pageBody);
                    const domJson = html2json(new JSDOM(pageBody)
                                              .window
                                              .document
                                              .documentElement
                                              .outerHTML)
                          .child[0]
                          .child[2]
                          .child[7];
                    if(domJson.child[11]){
                        var coursesDomJson = domJson
                            .child[11]
                            .child[3];
                        //console.log(JSON.stringify(domJson));
                        var elective1 = {};
                        var elective2 = {};
                        var elective3 = {};
                        //console.log(JSON.stringify(domJson.child[11]));
                        elective1.DOM = coursesDomJson.child[10];
                        elective2.DOM = coursesDomJson.child[12];
                        elective3.DOM = coursesDomJson.child[14];
                        var student = {};
                        student.name = domJson
                            .child[9]
                            .child[3]
                            .child[3]
                            .child[3]
                            .child[0].text;
                        student._id = rollNo;
                        student.courses = [];
                        if(elective3.DOM){
                            elective1.type = elective1.DOM.child[1].child[0].text;
                            elective2.type = elective2.DOM.child[1].child[0].text;
                            elective3.type = elective3.DOM.child[1].child[0].text;
                            elective1.code = elective1.DOM.child[3].child[0].text;
                            elective2.code = elective2.DOM.child[3].child[0].text;
                            elective3.code = elective3.DOM.child[3].child[0].text;
                            elective1.code = elective1.code.replace(/\s/g,'');
                            elective2.code = elective2.code.replace(/\s/g,'');
                            elective3.code = elective3.code.replace(/\s/g,'');
                            delete elective1.DOM;
                            delete elective2.DOM;
                            delete elective3.DOM;
                            if (elective3.type){
                                student.courses[0] = elective1;
                                student.courses[1] = elective2;
                                student.courses[2] = elective3;
                            }
                            console.log(student);
                            db.collection('studAtLast').find({
                                $and:[
                                    {
                                        "_id":student._id
                                    },
                                    {
                                        "courses.code":student.courses[0].code
                                    },
                                    {
                                        "courses.code":student.courses[1].code
                                    },
                                    {
                                        "courses.code":student.courses[2].code
                                    }
                                ]
                            }).toArray(function(DBerror, docs) {
                                if(!DBerror){
                                    if(!docs[0]){
                                        //console.log("Not Found!");
                                        db.collection('studAtLast').deleteOne({"_id":rollNo},function(deleteError,deleteRes){
                                            //console.log(deleteError);
                                            db.collection('studAtLast').insertOne(student);
                                            console.log("Updated! ",rollNo);
                                        });
                                    }
                                }
                                else{
                                    db.collection('studAtLast').insertOne(student);
                                }
                            });
                        }
                        else{
                            db.collection('studAtLast').find({
                                "_id":student._id
                            }).toArray(function(DBerror, docs) {
                                if(!DBerror&&!docs[0]){
                                    db.collection('studAtLast').insertOne(student);
                                    console.log("Inserted! ",rollNo);
                                }
                            });
                        }
                    }
                }
                request ({
                    headers: logoutHeaders,
                    uri: logoutUri,
                    method: 'GET'
                }, function (logoutError, logoutRes, logoutBody) {
                    if(logoutError){
                        console.log (logoutError);
                    }
                    else {
                        //console.log('Logged Out');
                        fetchStudent(year,branch,next,end,curr);
                    }
                });
            });
        }
        else{
            fetchStudent(year,branch,next,end,curr);
        }
    });
};

MongoClient.connect(DB_URI, function(error, response) {
    console.log("Connected correctly to server");
    db=response;
    fetchStudent(scrape[0].year,scrape[0].branch,scrape[0].start,scrape[0].end,0);
});
