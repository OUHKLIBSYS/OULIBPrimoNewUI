/*Angular JS for OU LIB Primo*/
/*Global variables*/
var vid = "ouhk";
var csidsVid = "OUHK";
var pdsServer = "primo2.lib.ouhk.edu.hk";
var libPrimoServer = "www2.lib.ouhk.edu.hk";
var csidsPrimoServer = "primo2.csids.edu.hk";
var wcmServer = "www.ouhk.edu.hk";

var xhttp = new XMLHttpRequest();
xhttp.open("GET", "/primo_library/libweb/action/search.do?vid=" + vid, true);
xhttp.send();

/*GA track code*/
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-98135600-1', 'auto');
ga('send', 'pageview');

(function () {
"use strict";
'use strict';

var app = angular.module('viewCustom', ['angularLoad']);

/*Start - Change banner logos' language*/
app.component('prmLogoAfter', {
	bindings: { parentCtrl: '<' },
	controller: 'prmLogoAfterController',
	templateUrl: 'custom/' + vid +'/html/ouprimo-head.html',
});
app.controller('prmLogoAfterController', ['$rootScope', function($rootScope){

	try {
		this.lang = $rootScope.bwlang;
		this.vid = vid;
		this.wcmServer = wcmServer;
		this.libPrimoServer = libPrimoServer;
		var oulang = (this.lang == "zh_TW") ? "chi": (this.lang == "zh_CN") ? "sim":"eng";
		this.oulang = oulang;
	} catch(e) {
		this.lang = "en_US";
		this.oulang = "eng";
	}

}]);

app.component('prmTopbarAfter', {
	bindings: { parentCtrl: '<' },
	controller: 'prmTopbarAfterController',
});
app.controller('prmTopbarAfterController', ['$rootScope', function($rootScope){

	try {
	this.vid = vid;
    	var l = this.parentCtrl.$state.params.lang;		
		$rootScope.bwlang = l;

	} catch(e) {
		console.log("ou error... ");
	}

}]);
/*End - Change banner logos' language*/

/*Start - Prepare for the Article Search scope Logic */
app.component('prmUserAreaAfter', {
	bindings: { parentCtrl: '<' },
	controller: 'prmUserAreaAfterController'
});
app.controller('prmUserAreaAfterController', ['$rootScope','$http', function($rootScope,$http) {
		
    $http({
            method: 'GET',
            url: 'http://metalib.lib.ouhk.edu.hk/aleph-cgi/primo_access_bw.cgi'			
        })
        .then(function(response) {
			var testip2 = response.data.split("=");
			$rootScope.$allAccess = testip2[1];
        }, function(error){
			console.log("ou allowaccess error: " + error.status);
		});		

}]);
/*End - Prepare for the Article Search scope Logic */

/*Start - Fix Bx Recommender bug*/
app.component('prmRecomendationsAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmRecomendationsAfterController'
});
app.controller('prmRecomendationsAfterController', ['angularLoad', function (angularLoad) {
	var prmCtrl = this;
	angular.element(document).ready(function () {
		angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/ouhk.js').then(function(){fixBXRecommanderBug(prmCtrl);});
	});
}]);
/*End - Fix Bx Recommender bug*/


/*Start - Fix ezproxy problem of direct link resources*/
/*add ezproxy prefix to direct link resources - brief record*/
var prefixingDomains = ["academic.eb.com","www.gender.amdigital.co.uk","www.aspresolver.com","library.artstor.org","bsol.bsigroup.com",
				"go.galegroup.com", "www.oxfordartonline.com","search.proquest.com","dl.sae.org","d.wanfangdata.com.cn"];
var redirectUrl = "http://www.lib.ouhk.edu.hk/cgi-bin/redirect.cgi?url=";
app.component('prmSearchResultAvailabilityLineAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmSearchResultAvailabilityLineAfterController'
});
app.controller('prmSearchResultAvailabilityLineAfterController', ['angularLoad', function (angularLoad) {
	var prmCtrl = this;
	for(var i=0; i<prefixingDomains.length; i++)
		for(var j=0; j<	prmCtrl.parentCtrl.availabilityLinksUrl.length; j++){
			var link = prmCtrl.parentCtrl.availabilityLinksUrl[j];
			if(link.includes(prefixingDomains[i]))
				prmCtrl.parentCtrl.availabilityLinksUrl[j] = redirectUrl + prmCtrl.parentCtrl.availabilityLinksUrl[j];
		} //end for
}]);
/*add ezproxy prefix to direct link resources - viewonline*/
app.component('prmViewOnlineAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmViewOnlineAfterController'
});
app.controller('prmViewOnlineAfterController', ['angularLoad', function (angularLoad) {
	var prmCtrl = this;
	for(var i=0; i<prefixingDomains.length; i++)
		for(var j=0; j<	prmCtrl.parentCtrl.item.linkElement.links.length; j++){
			var link = prmCtrl.parentCtrl.item.linkElement.links[j].link;
			if(link.includes(prefixingDomains[i]))
				prmCtrl.parentCtrl.item.linkElement.links[j].link = redirectUrl + prmCtrl.parentCtrl.item.linkElement.links[j].link;
		} //end for
}]);
/*add ezproxy prefix to direct link resources - links*/
app.component('prmServiceLinksAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmServiceLinksAfterController'
});
app.controller('prmServiceLinksAfterController', ['angularLoad', function (angularLoad) {

	var prmCtrl = this;
	for(var i=0; i<prefixingDomains.length; i++)
		for(var j=0; j<	prmCtrl.parentCtrl.recordLinks.length; j++){
			var link = prmCtrl.parentCtrl.recordLinks[j].linkURL;
			if(link.includes(prefixingDomains[i]))
				prmCtrl.parentCtrl.recordLinks[j].linkURL = redirectUrl + prmCtrl.parentCtrl.recordLinks[j].linkURL;
		} //end for

}]);
/*End - Fix ezproxy problem of direct link resources*/


/*Start - 1. Logout also to CSIDS Primo.*/
app.component('prmAuthenticationAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmAuthenticationAfterController'
});
app.controller('prmAuthenticationAfterController', ['angularLoad', function (angularLoad) {
	var prmCtrl = this;
	//Handle double logout issues
	angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/ouhk.js').then(function(){logoutCSIDSAlso(prmCtrl);});
	angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/ouhk.js').then(function(){handleLogoutFromCSIDS(prmCtrl);});
}]);
/*End - 1. Logout also to CSIDS Primo and 2. Change the guest wordings.*/


/*Start - Fix Send Email Record Source ID Problem.*/
app.component('prmSendEmailAfter', {
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
        controller: 'prmSendEmailAfterController'
});
app.controller('prmSendEmailAfterController', ['angularLoad', function (angularLoad) {
	var prmCtrl = this;
	angularLoad.loadScript('/primo-explore/custom/' + vid + '/js/ouhk.js').then(function(){fixSendEmailRecord(prmCtrl);});
}]);
/*End - Fix Send Email Record Source ID Problem*/


/*Start - Add reminder for the citation users.*/
app.component('prmCitationAfter', {
	templateUrl: '/primo-explore/custom/' + vid + '/html/prmCitationAfter.html',
        require: ['child', '^parent'],
        bindings: {parentCtrl: '='},
});
/*End - Add reminder for the citation users.*/

function langReload(){
	
	
	var checkGuest = document.body.innerHTML.toString().search('user-name');
	if (checkGuest > -1){
		var isGuest = angular.element( document.querySelector( '.user-name' ) )[0].innerHTML;
		if (isGuest.indexOf('Guest') > -1 || isGuest.indexOf('访客') > -1 || isGuest.indexOf('訪客') > -1 ){
				var guestelement = document.getElementsByClassName("user-name");
				guestelement[1].innerHTML = "Sign in<br>My Account";
		 }
	}		
	
	var checkeshelf = document.body.innerHTML.toString().search('prm_pin');
	if (checkeshelf > -1){
		var eshelfelement = document.getElementsByClassName("rotate-25");
		eshelfelement[0].innerHTML = "<img src='/primo-explore/custom/" + vid + "/img/eshelf.png' width='30'><prm-icon-after parent-ctrl='ctrl'></prm-icon-after>";

	}	
	
	var checkactionitem = document.body.innerHTML.toString().search('prm-library-card-menu');
	if (checkactionitem > -1){
			var actionitemelement = document.getElementsByClassName("md-fab-action-item");
			actionitemelement[2].className = "md-fab-action-item flex-sm-40";
			
	}
	
    setTimeout(langReload, 500);
}

langReload();


})();
