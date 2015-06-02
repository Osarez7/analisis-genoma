var JSONStream = require("JSONStream");
var dna = {a:1,b:2,c:3}

//JSONStream.stringify().pipe(process.stdout);

 var es = require('event-stream')
    , reader = es.readArray([dna])
    , writer = es.writeArray(function (err, array){
      //array deepEqual [1, 2, 3]
       console.log(array[0])
    })

  reader.pipe(writer)
