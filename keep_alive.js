var http = require('http');

http.createServer(function (res,req) {
  res.write("I'am alive");
  res.end();
}).listen(8080);
