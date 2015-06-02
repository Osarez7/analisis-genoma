/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var dna = require('dna2json');
var JSONStream = require('JSONStream');
var fs = require('fs');
var path = require('path');
var male = require('genoset-male');
var es = require('event-stream');
var JSONStream = require('JSONStream');

module.exports = {
	upload: function  (req, res) {
    if(req.method === 'GET')
      return res.json({'status':'GET not allowed'});            
      //  Call to /upload via GET is error

    var uploadFile = req.file('uploadFile');
    var name = req.param('name');
   // console.log(uploadFile);
     console.log(name);
     uploadFile.upload({maxBytes: 100000000},function onUploadComplete (err, files) {        
      //  Files will be uploaded to .tmp/uploads
                                          
        if (err) return res.serverError(err);               
        //  IF ERROR Return and send 500 error with error
        var streamEscritura = fs.createWriteStream(path.join(__dirname,"..","..",".tmp","uploads", name + ".json"));
         streamEscritura.on('finish',function(){
           // res.json({status:200,file:files});
             return res.redirect('/file/listarSNP')
         });

       /* console.log(files)
        fs.createReadStream(files[0].fd)
        .pipe(dna.parse())
        .pipe(JSONStream.stringify())
        .pipe(streamEscritura);*/


        var txt = fs.readFileSync(files[0].fd);  
           //console.log(typeof text);  

           /* dna.parse(text.toString(), function(err, snps){
                 JSONStream.stringify(snps)
                 .pipe(streamEscritura);
                 //snps = the object with your mutations
            }); */
      

      dna.parse(txt.toString(), function(err, snps){
      console.log(snps);
      fs.writeFileSync(path.join(__dirname,"..","..",".tmp","uploads", name + ".json"), JSON.stringify(snps));
      res.json({status:200,file:files});
});

       
      });
//res.json({status:200,file:files});
  },
  listarSNP: function  (req, res) {

    listDirectoryFilesByExtension(path.join(__dirname,"..","..",".tmp","uploads"), '.json',function(files){

      res.view('listarSNP',{files:files});

       //  res.json({status:200,file:files});
    });
  
  },
  analizar: function(req, res){

     var archivo = req.param('archivo');
     var data = require(path.join(__dirname,"..","..",".tmp","uploads",archivo));

     res.json({status:200, hombre:  male(data), genoma:data});
  }
};


function listDirectoryFilesByExtension(folderPath,extension,callback) {
    fs.readdir(folderPath, function (error, files) {
      if (error) {
        //logManager.error(error.stack);
        callback();
      }else{


       var fileList = files.filter(function (file) {
        return  (path.extname(file) ==  extension);
        //return fs.statSync(file).isFile();
      });
      callback(fileList);
    }

  });
  };

