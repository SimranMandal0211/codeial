const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  console.log('---------------inside view helper');

  app.locals.assetPath = function(filePath){
    console.log('---------------view helper----------- assetPath()',env);
    if(env.name == 'development'){
      console.log('filepath::::', filePath);
    }

    console.log('---------------view helper production', filePath);
    return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/manifest.json')))[filePath];
  }
}