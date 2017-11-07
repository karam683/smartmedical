try {require('@dynatrace/oneagent')(); } catch(err) {     console.log(err.toString()); } 
var path = require('path');
express = require('express');
var bodyParser =require('body-parser');
var asset =require('./api.js');	
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/search/:id', asset.searchByKitId)
app.use('/getkit/:id', asset.getByKitId)
app.use('/gethistory/:id', asset.getHistorybyKitId)
app.use('/add', asset.addToBlockChain)
app.use('/ownertransfer', asset.transferOwner)
app.use('/kitsterilization', asset.kitSterilization)
app.use('/sendjson', asset.sendJson)
app.use('/stats', asset.getBlockStats)


//app.use('/ui5', express.static(path.join(__dirname, 'webapp')));

app.listen(process.env.PORT || 3000, function () {
	console.log('SmartMedical app is listening on port 3000!');
});