const http = require("http");
const fs = require("fs");
const args = require("minimist")(process.argv);
const port = args.port;

let homepge = "";
let projectpge = "";
let registrationpge = "";

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homepge = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectpge = project;
});

fs.readFile("registration.html", (err, registration) => {
  if (err) {
    throw err;
  }
  registrationpge = registration;
});

http
  .createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/project":
        response.write(projectpge);
        response.end();
        break;

      case "/registration":
        response.write(registrationpge);
        response.end();
        break;
      default:
        response.write(homepge);
        response.end();
        break;
    }
  })
  .listen(port);
