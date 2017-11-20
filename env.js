cfenv= require('cfenv');
appEnv = cfenv.getAppEnv();

// for test_blockchain instance //serviceCred = appEnv.getServiceCreds("test_blockchain")

serviceCred = appEnv.getServiceCreds("smartmedical-blockchain")

	
	module.exports.serviceUrl= serviceCred.serviceUrl
	module.exports.serviceApiKey=serviceCred.apiKey