// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
// https://timonweb.com/posts/how-to-enable-es6-imports-in-nodejs/
require("@babel/register")({
    plugins: ["@babel/plugin-proposal-class-properties"],
    presets: ["@babel/preset-env"],
});
  
// Import the rest of our application.
module.exports = require('./app.js')