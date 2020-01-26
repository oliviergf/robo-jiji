const https = require("https");

const request = require("request");

let count = 0;

//create a server object:
https
  .createServer(function(req, res) {
    res.write("Hello World!"); //write a response to the client
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080

let call = () => {
  request(
    "https://www.kijiji.ca/rss-srp-for-rent/quebec/c30349001l9001",
    { json: true },
    (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      console.log(body);
      console.log(`call: ${count}`);
      count++;
    }
  );
};

setInterval(function() {
  call();
}, 3000);
