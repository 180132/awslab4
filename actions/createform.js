var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "index.ejs";


var task = function(request, callback){
	//1. load configuration
	var awsConfig = helpers.readJSONFile(AWS_CONFIG_FILE);
	var policyData = helpers.readJSONFile(POLICY_FILE);

	//2. prepare policy
	var policy = new Policy(policyData);

	//3. generate form fields for S3 POST
	var s3Form = new S3Form(policy);
	//4. get bucket name
	var formFields = s3Form.generateS3FormFields();
	formFields = s3Form.addS3CredientalsFields(formFields, awsConfig);

	var bucketName = policy.getConditionValueByKey("bucket");

	var sdb = new simpledb.SimpleDB({keyid: awsConfig.accessKeyId,secret:awsConfig.secretAccessKey})

	sdb.createDomain( domaind, function( error ) {

	  sdb.putItem(domaind, ip, {attr1: request.ip }, function( error ) {

		sdb.getItem(domaind, ip, function( error, result ) {
		  console.log( 'attr1 = '+result.attr1 )
		})
	  })
	})

	callback(null, {template: INDEX_TEMPLATE, params:{fields:formFields, bucket:bucketName}});


}

exports.action = task;
