request=require('request');

var env =require('./env.js');
// for test_blockchain instance //var chaincode ="b2279e0cbbc294aef9eb4ca4c85d489f";
var chaincode ="083e3fb357c46f5bdfdc9cf527cf410c";
module.exports = {

searchByKitId: function (req,res)
{
	var kitId=	req.params.id;
	console.log('kitId:', kitId);
	var messageObj = 
				{
						"uri": env.serviceUrl + '/query',
						"json": true,
						"headers": {apikey: env.serviceApiKey	},
						"body":  {
							"chaincodeId": chaincode,
							"fcn": "search",
							"args": [kitId]
						}
				}
				
				 	request.post(messageObj, function (err, resp, body){
					console.log('Call to BC:::RESPONSE:', resp && resp.statusCode);
					console.log('Call to BC:::ERR:', err);
					console.log('Call to BC:::Body:', body);
					if(err==null)
						{
						res.send(body);
						}
					else
						{
						res.send(resp.statusCode+" Error:"+err);
						}
					
				});
				
},
getByKitId: function (req,res)
{
	var kitId=	req.params.id;
	console.log('kitId:', kitId);
	var messageObj = 
				{
						"uri": env.serviceUrl + '/query',
						"json": true,
						"headers": {apikey: env.serviceApiKey	},
						"body":  {
							"chaincodeId": chaincode,
							"fcn": "read",
							"args": [kitId]
						}
				}
				
				 	request.post(messageObj, function (err, resp, body){
					console.log('Call to BC:::RESPONSE:', resp && resp.statusCode);
					console.log('Call to BC:::ERR:', err);
					console.log('Call to BC:::Body:', body);
					if(err==null)
						{
						res.send(body);
						}
					else
						{
						res.send(resp.statusCode+" Error:"+err);
						}
					
				});
				
},

getHistorybyKitId: function (req,res)
{
	var kitId=	req.params.id;
	var messageObj = 
				{
						"uri": env.serviceUrl + '/query',
						"json": true,
						"headers": {apikey: env.serviceApiKey	},
						"body":  {
							"chaincodeId": chaincode,
							"fcn": "history",
							"args": [kitId]
						}
				}
				
				 	request.post(messageObj, function (err, resp, body){
					console.log('Call to BC:::RESPONSE:', resp && resp.statusCode);
					console.log('Call to BC:::ERR:', err);
					console.log('Call to BC:::Body:', body);
					if(err==null)
						{
						res.send(body);
						}
					else
						{
						res.send(resp.statusCode+" Error:"+err);
						}
					
				});
				
},
addToBlockChain:function (req,res)
{
	var kit= req.body;
	
	console.log('Adding Kit:'+ kit)
	if(kit!=undefined){
		var assetID=kit.assetID;
		console.log('assetID:', assetID);
		var st=kit.st;
		console.log('st:', st);
		var location=kit.location;
		console.log('location:', location);
		var ownerrole=kit.ownerrole;
		console.log('ownerrole:', ownerrole);
		var ownername=kit.ownername;
		console.log('ownername:', ownername);
		var assetType=kit.assetType;
		console.log('assetType:', assetType);
		var assetModel=kit.assetModel;
		console.log('assetModel:', assetModel);
		var firmwareVersion=kit.firmwareVersion;
		console.log('firmwareVersion:', firmwareVersion);
		var buildNumber=kit.buildNumber;
		console.log('buildNumber:', buildNumber);
		var buildBy=kit.buildBy;
		console.log('buildBy:', buildBy);
		var batteryLevel=kit.batteryLevel;
		console.log('batteryLevel:', batteryLevel);
		var ownerid=kit.ownerid;
		console.log('ownerid:', ownerid);
		var Alt=kit.Alt;
		console.log('Alt:', Alt);
		var Lat=kit.Lat;
		console.log('Lat:', Lat);
		var Lon=kit.Lon;
		console.log('Lon:', Lon);
		var Csts=kit.CSts;
		console.log('Csts:', Csts);
		var Bsts=kit.BSts;
		console.log('Bsts:', Bsts);
		var Dsts=kit.DSts;
		console.log('Dsts:', Dsts);
		var Tmpr=kit.Tmpr;
		console.log('Tmpr:', Tmpr);
		var Hmdt=kit.Hmdt;
		console.log('Hmdt:', Hmdt);
		
		// check to make sure the kit does not alredy exist in blockchain
		searchBlockchain(assetID, function(readkitObj){
			

			if(readkitObj!==null && readkitObj.length===0)
			{
					
					var messageObj = 
					{
							"uri": env.serviceUrl + '/invoke',
							"json": true,
							"headers": {apikey: env.serviceApiKey	},
							"body":  {
								"chaincodeId": chaincode,
								"fcn": "write",
								"args": [assetID,st,location,ownerrole,ownername,assetType,assetModel,firmwareVersion,buildNumber,buildBy,batteryLevel,ownerid,Alt,Lat,Lon,Csts,Bsts,Dsts,Tmpr,Hmdt],
								"async": false
							}
					}
					
					 	request.post(messageObj, function (err, resp, body){
						console.log('Call to BC:::RESPONSE:', resp && resp.statusCode);
						console.log('Call to BC:::ERR:', err);
						console.log('Call to BC:::Body:', body);
						if(err==null)
							{
							res.send(resp.statusCode);
							}
						else
							{
							res.send(resp.statusCode+" Error:"+err);
							}
						
					});
			}
			else
			{
					res.send("Error: Kit already exists in blockchain service");
			}

		});

		
	}else
		{
			res.send("Error reading the request payload");
		}
		
	
				
},
transferOwner:function (req,res)
{
	var kit= req.body;

	
	console.log('Transferring Kit :'+ kit)
	if(kit!=undefined){
		var assetID=kit.assetID;
		console.log('Kit Id:'+ assetID)
		var st=kit.st;
		var location=kit.location;
		var ownerrole=kit.ownerrole;
		var ownername=kit.ownername;
		var assetType=kit.assetType;
		var assetModel=kit.assetModel;
		var firmwareVersion=kit.firmwareVersion;
		var buildNumber=kit.buildNumber;
		var buildBy=kit.buildBy;
		var batteryLevel=kit.batteryLevel;
		var ownerid=kit.ownerid;
		var Alt=kit.Alt;
		var Lat=kit.Lat;
		var Lon=kit.Lon;
		var Csts=kit.CSts;
		var Bsts=kit.BSts;
		var Dsts=kit.DSts;
		var Tmpr=kit.Tmpr;
		var Hmdt=kit.Hmdt;
		//var readkitObj;

		// search for the kit in blockchain svc
		searchBlockchain(assetID, function(readkitObj){
			console.log("Result in search callback:"+readkitObj);

			if(readkitObj!==null && readkitObj.length===1)
		{
			console.log("Status from search callback:"+readkitObj[0].st);
			var bc_st=readkitObj[0].st;
			var bc_ownerrole=readkitObj[0].ownerrole;
			

			isTransferAllowed(bc_ownerrole,bc_st,ownerrole, function(isAllowed){
				console.log("Transfer Allowed?"+isAllowed);
			if(isAllowed)
			{
				var writeMessageObj = 
					{
							"uri": env.serviceUrl + '/invoke',
							"json": true,
							"headers": {apikey: env.serviceApiKey	},
							"body":  {
								"chaincodeId": chaincode,
								"fcn": "write",
								"args": [assetID,bc_st,location,ownerrole,ownername,assetType,assetModel,firmwareVersion,buildNumber,buildBy,batteryLevel,ownerid,Alt,Lat,Lon,Csts,Bsts,Dsts,Tmpr,Hmdt],
								"async": false
							}
					}
					
					 	request.post(writeMessageObj, function (err, resp, body){
						console.log('Transfer Call to BC:::RESPONSE:', resp && resp.statusCode);
						console.log('TransferCall to BC:::ERR:', err);
						//console.log('Transfer Call to BC:::Body:', body);
						if(err==null)
							{
							res.send(resp.statusCode+" :Kit Transfer Success");
							}
						else
							{
							res.send(resp.statusCode+" Error:"+err);
							}
						
					});
			}
			else{
				res.send("Error: Transfer not allowed");
			}


			});

		
		} else{

			res.send("Error: Kit not available in Blockchain");

		}

			
		});
		
		


	}else
		{
			res.send("Error reading the request payload");
		}
		
	
				
},
kitSterilization:function (req,res)
{
	var kit= req.body;

	
	console.log('Sterilizing Kit:'+ kit)
	if(kit!=undefined){
		var assetID=kit.assetID;
		var st=kit.st;
		var location=kit.location;
		var ownerrole=kit.ownerrole;
		var ownername=kit.ownername;
		var assetType=kit.assetType;
		var assetModel=kit.assetModel;
		var firmwareVersion=kit.firmwareVersion;
		var buildNumber=kit.buildNumber;
		var buildBy=kit.buildBy;
		var batteryLevel=kit.batteryLevel;
		var ownerid=kit.ownerid;
		var Alt=kit.Alt;
		var Lat=kit.Lat;
		var Lon=kit.Lon;
		var Csts=kit.CSts;
		var Bsts=kit.BSts;
		var Dsts=kit.DSts;
		var Tmpr=kit.Tmpr;
		var Hmdt=kit.Hmdt;

		// search for the kit in blockchain svc
		searchBlockchain(assetID,function(readkitObj){
			console.log("Result in search callback:"+readkitObj)
		if(readkitObj!==null && readkitObj.length===1)
		{
			console.log("Status from search callback:"+readkitObj[0].st);
			var bc_st=readkitObj[0].st;
			var bc_ownerrole=readkitObj[0].ownerrole;
			
			isSterilizationAllowed(bc_ownerrole,bc_st,function(isAllowed){

			if(isAllowed)
			{
				var sterlizationStatus='sterilized';
				var writeMessageObj = 
					{
							"uri": env.serviceUrl + '/invoke',
							"json": true,
							"headers": {apikey: env.serviceApiKey	},
							"body":  {
								"chaincodeId": chaincode,
								"fcn": "write",
								"args": [assetID,sterlizationStatus,location,ownerrole,ownername,assetType,assetModel,firmwareVersion,buildNumber,buildBy,batteryLevel,ownerid,Alt,Lat,Lon,Csts,Bsts,Dsts,Tmpr,Hmdt],
								"async": false
							}
					}
					
					 	request.post(writeMessageObj, function (err, resp, body){
						console.log('Transfer Call to BC:::RESPONSE:', resp && resp.statusCode);
						console.log('TransferCall to BC:::ERR:', err);
						console.log('Transfer Call to BC:::Body:', body);
						if(err==null)
							{
							res.send(resp.statusCode+" :Kit Sterlization Success");
							}
						else
							{
							res.send(resp.statusCode+" Error:"+err);
							}
						
					});
			}
			else{
				res.send("Error: Sterlization not allowed");
			}

			});
			} else{

			res.send("Error: Kit not available in Blockchain");

		}
		});
	}else
		{
			res.send("Error reading the request payload");
		}
		
	
				
},

sendJson:function (req,res)
		{
			var kit= req.body;

			
			console.log('Received Kit from Device :'+ kit)
			if(kit!=undefined){
				var assetID=kit.assetID;
				console.log('Kit Id:'+ assetID)
				var st=kit.st;
				var location=kit.location;
				var ownerrole=kit.ownerrole;
				var ownername=kit.ownername;
				var assetType=kit.assetType;
				var assetModel=kit.assetModel;
				var firmwareVersion=kit.firmwareVersion;
				var buildNumber=kit.buildNumber;
				var buildBy=kit.buildBy;
				var batteryLevel=kit.batteryLevel;
				var ownerid=kit.ownerid;
				var Alt=kit.Alt;
				var Lat=kit.Lat;
				var Lon=kit.Lon;
				var Csts=kit.CSts;
				var Bsts=kit.BSts;
				var Dsts=kit.DSts;
				var Tmpr=kit.Tmpr;
				var Hmdt=kit.Hmdt;
				//var readkitObj;

				// search for the kit in blockchain svc
				searchBlockchain(assetID, function(readkitObj){
					console.log("Result in search callback:"+readkitObj);

					if(readkitObj!==null && readkitObj.length===1)
					{
						console.log("Status from search callback:"+readkitObj[0].st);
						var bc_st=readkitObj[0].st;
						var bc_ownerrole=readkitObj[0].ownerrole;
						var bc_prevownerrole=readkitObj[0].DSts
						
						updateKitStatus(st,bc_st,bc_ownerrole,bc_prevownerrole,function(derivedStatus){
							console.log("Derived Status:"+derivedStatus);

								var writeMessageObj;

									if(derivedStatus!=="") // change the status
									{
										writeMessageObj = 
														{
																"uri": env.serviceUrl + '/invoke',
																"json": true,
																"headers": {apikey: env.serviceApiKey	},
																"body":  {
																	"chaincodeId": chaincode,
																	"fcn": "write",
																	"args": [assetID,derivedStatus,location,ownerrole,ownername,assetType,assetModel,firmwareVersion,buildNumber,buildBy,batteryLevel,ownerid,Alt,Lat,Lon,Csts,Bsts,Dsts,Tmpr,Hmdt],
																	"async": false
																}
														}
									}
									//no change
									else
									{
										writeMessageObj = 
														{
																"uri": env.serviceUrl + '/invoke',
																"json": true,
																"headers": {apikey: env.serviceApiKey	},
																"body":  {
																	"chaincodeId": chaincode,
																	"fcn": "write",
																	"args": [assetID,st,location,ownerrole,ownername,assetType,assetModel,firmwareVersion,buildNumber,buildBy,batteryLevel,ownerid,Alt,Lat,Lon,Csts,Bsts,Dsts,Tmpr,Hmdt],
																	"async": false
																}
														}
									}

							
								
							 	request.post(writeMessageObj, function (err, resp, body){
								console.log('Device call to BC:::RESPONSE:', resp && resp.statusCode);
								console.log('Device call to BC:::ERR:', err);
								//console.log('Transfer Call to BC:::Body:', body);
								if(err==null)
									{
									res.send(resp.statusCode+" :Kit Status Updated Successfully");
									}
								else
									{
									res.send(resp.statusCode+" Error:"+err);
									}					
								});			
						
						});
					
					}else
					{
						res.send("Error: Kit not available in Blockchain");
					}						
				});

	}
	else 
	{
			res.send("Error reading the request payload");
	}

},
getBlockStats:function(req,res)
{
	var messageObj = 
	{
		"uri": env.serviceUrl + '/stats',
		"json": true,
		"headers": {apikey: env.serviceApiKey	}
	}
					request.get(messageObj, function (err, resp, body){
					console.log('getBlockStats:::RESPONSE:', resp && resp.statusCode);
					console.log('getBlockStats:::ERR:', err);
					console.log('getBlockStats:::Body:', body);
					if(err==null)
						{
						res.send(body)
						}
					else
						{
						res.send(resp.statusCode+" Error:"+err);
						}
					
				});	

}

};

function searchBlockchain(kitid, callback)
{
	var kitId=	kitid;
	console.log('kitId:', kitId);
	if(kitId!==undefined)
	{
		var messageObj = 
				{
						"uri": env.serviceUrl + '/query',
						"json": true,
						"headers": {apikey: env.serviceApiKey	},
						"body":  {
							"chaincodeId": chaincode,
							"fcn": "search",
							"args": [kitId]
						}
				}
				
				 	request.post(messageObj, function (err, resp, body){
					console.log('searchBlockchain:::RESPONSE:', resp && resp.statusCode);
					console.log('searchBlockchain:::ERR:', err);
					console.log('searchBlockchain:::Body:', body);
					if(err==null)
						{
						callback(body)
						}
					else
						{
						callback(null);
						}
					
				});	
	}else
	{
		callback(null);
	}

	
}

function isTransferAllowed(currentOwner,currentStatus, newOwner, callback)
{

var bc_ownerrole=currentOwner;
var bc_st=currentStatus;
var ownerrole=newOwner;

if(bc_ownerrole!=="" && bc_st!=="" && ownerrole!==""){


			if(bc_ownerrole.toUpperCase()==="MANUFACTURER" && bc_st.toUpperCase()==="STERILIZED" && ownerrole.toUpperCase()==="DISTRIBUTOR")
			{
				callback(true);
			}
			else if(bc_ownerrole.toUpperCase()==="DISTRIBUTOR" && bc_st.toUpperCase()==="STERILIZED" && ownerrole.toUpperCase()==="HOSPITAL")
			{
				callback(true);
			}
			else if(bc_ownerrole.toUpperCase()==="DISTRIBUTOR" && bc_st.toUpperCase()==="TAMPERED" && ownerrole.toUpperCase()==="MANUFACTURER")
			{
				callback(true);
			}
			else if(bc_ownerrole.toUpperCase()==="DISTRIBUTOR" && bc_st.toUpperCase()==="USED" && ownerrole.toUpperCase()==="MANUFACTURER")
			{
				callback(true);
			}
			else if(bc_ownerrole.toUpperCase()==="HOSPITAL" && bc_st.toUpperCase()==="STERILIZED" && ownerrole.toUpperCase()==="DISTRIBUTOR")
			{
				callback(true);
			}
			else if(bc_ownerrole.toUpperCase()==="HOSPITAL" && bc_st.toUpperCase()==="TAMPERED" && ownerrole.toUpperCase()==="DISTRIBUTOR")
			{
				callback(true);
			}
			else if(bc_ownerrole.toUpperCase()==="HOSPITAL" && bc_st.toUpperCase()==="USED" && ownerrole.toUpperCase()==="DISTRIBUTOR")
			{
				callback(true);
			}
			else
			{
				callback(false);
			}


		}else{
			callback(false);
		}		
					
}
function isSterilizationAllowed(currentOwner,currentStatus,callback)
{

var bc_ownerrole=currentOwner;
var bc_st=currentStatus;


if(bc_ownerrole!==""){


			if(bc_ownerrole.toUpperCase()==="MANUFACTURER" && bc_st.toUpperCase()==="USED")
			{
				callback(true);
			}
			else if(bc_ownerrole.toUpperCase()==="MANUFACTURER" && bc_st.toUpperCase()==="TAMPERED")
			{
				callback(true);
			}
			else if(bc_ownerrole.toUpperCase()==="MANUFACTURER" && bc_st==="")
			{
				callback(true);
			}
			else
			{
				callback(false);
			}


		}else{
			callback(false);
		}		
					
}

function updateKitStatus(deviceStatus,bc_status,bc_ownerrole,bc_prevownerrole,callback)
{
	var dv_status = deviceStatus;
	var bc_status = bc_status;
	var bc_ownerrole = bc_ownerrole;
	var bc_prevownerrole = bc_prevownerrole;

	if(dv_status!=="")
	{
			if(dv_status.toUpperCase()==="OPEN" || dv_status.toUpperCase()==="CLOSE" )
			{
				if(bc_ownerrole!=="" && bc_ownerrole.toUpperCase()==="HOSPITAL")
				{
						callback("used");
				}
				else if(bc_ownerrole!=="" && bc_ownerrole.toUpperCase()==="MANUFACTURER")
				{
					if(bc_status !=="" && bc_status.toUpperCase() ==="STERILIZED")
					{
						callback("tampered");
					}
					else
					{
							callback(bc_status);
					}
				}
				else if (bc_ownerrole!=="" && bc_ownerrole.toUpperCase()==="DISTRIBUTOR")
				{
					if(bc_status !=="" && bc_status.toUpperCase() ==="USED" &&  bc_prevownerrole!=="" && bc_prevownerrole.toUpperCase()==="HOSPITAL")
					{
						callback("used")
					}
					else
					{
						callback("tampered")
					}
				}
			}
	}else{

		callback("");
	}


}