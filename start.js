// Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
require("@babel/register")({
    plugins: ["@babel/plugin-proposal-class-properties"],
    presets: ["@babel/preset-env"],
});
  
// Import the rest of our application.
module.exports = require('./app.js')