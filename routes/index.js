var express = require('express');
var router = express.Router();
var jsforce = require('jsforce');
var conn = new jsforce.Connection({ loginUrl : 'https://namespace.my.salesforce.com/'	});
var username = 'username@email.com';
var password = 'password+securityToken';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET apply page. */
router.get('/apply', function(req, res, next) {
  res.render('apply', { title: 'Apply Now' });
});

/* GET Employees page. */
router.get('/employees', function(req, res) {
    var db = req.db;
    var collection = db.get('employeeCollection');
    collection.find({},{},function(e,docs){
        res.render('employees', {
            "employeelist" : docs    		
        });
        console.log(docs);
    });
});

/* GET Add Apply for Loan to SF - POST to Salesforce */
router.post('/applyforloan', function(req, res) {
	var accountId = '001e000000fOZTS';
	var contactRecType = '012i0000000CETb';
	var contactFirstName = req.body.contactfirstname;
	var contactLastName = req.body.contactlastname;
	var contactPhone = req.body.contactmobilephone;
	var contactEmail = req.body.contactemail;
	var contactPresentAddress = req.body.contactpresentstreetaddress;
	var contactPresentCity = req.body.contactpresentcity;
	var contactPresentState = req.body.contactpresentstate;
	var contactPresentZip = req.body.contactpresentpostalcode;
	
	var db = req.db;
	var collection = db.get('sfContactCollection');
	
	conn.login(username, password, function(err, userInfo) {
		if (err) { return console.error(err); }
			conn.sobject("Contact").create(
				{ 
					AccountId: accountId,
					//Owner: contactOwner,
					//Name: contactFirstName + ' ' + contactLastName,
					FirstName: contactFirstName,
					LastName: contactLastName,
					MobilePhone: contactPhone,
					Email: contactEmail,
					Present_Street__c: contactPresentAddress,
					Present_City__c: contactPresentCity,
					Present_State__c: contactPresentState,
					Present_Postal_Code__c: contactPresentZip,
				}
				
			, function(err, ret) {
				if (err || !ret.success) {
					return res.send(err); 
					}
				else { 
					// Submit to the DB
							collection.insert({
								"sfContactId": ret.id,
								"mobilePhone": contactPhone,
								"email": contactEmail
							}, function(err, doc) {
								if (err) {
									// If it failed, return error
									res.send("There was a problem adding the information to the database.")
								}
								else {
									// And foward to success page
									res.redirect("/");
								}
							});
					// res.redirect("sfaccountslist"); 
					} // {res.send("Created record id : " + ret.id);}
			});
		});
		conn.cache.clear();
});

module.exports = router;