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

})();
