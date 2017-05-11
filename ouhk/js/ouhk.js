/*Loggin out to CSIDS Primo also while loggin out on OU LIB Primo*/
function logoutCSIDSAlso(prmCtrl){
	try{
	var customizedLogout = function(){
		var form4out = document.createElement("form");
		form4out.id = "customizedLogout";
		form4out.name = "customizedLogout";
		form4out.method = "GET";
		form4out.action = "https://" + pdsServer + "/pds";
		document.body.appendChild(form4out);
		var input1 = document.createElement("input");
		input1.type = "hidden";
		input1.name = "func";
		input1.value = "logout";
		form4out.appendChild(input1);
		var input2 = document.createElement("input");
		input2.type = "hidden";
		input2.name = "calling_system";
		input2.value = "primo";
		form4out.appendChild(input2);
		var input3 = document.createElement("input");
		input3.type = "hidden";
		input3.name = "institute";
		input3.value = "OUHK";
		form4out.appendChild(input3);
		var input3 = document.createElement("input");
		input3.type = "hidden";
		input3.name = "url";
		input3.value = "http://" + csidsPrimoServer + "/primo-explore/search?vid=" + csidsVid + "&fromOUHKLIBPrimo=yes";
		form4out.appendChild(input3);
		form4out.submit();
	}; //end function
	prmCtrl.parentCtrl.authenticationService.handleLogout = customizedLogout;
	} //end try
	catch(err){console.log("logoutCSIDSAlso(): " + err);console.log(prmCtrl);}
} //end logoutCSIDSAlso()

/*Loggin out to CSIDS Primo also while loggin out on OU LIB Primo - for the CSIDS Primo old UI*/
function logoutCSIDSAlsoForOldUI(prmCtrl){
	try{

	var customizedLogout = function(){
		var form4out = document.createElement("form"); 
		form4out.id = "form4out";
		form4out.name = "form4out";
		form4out.method = "GET"; 
		form4out.action = "http://" + csidsPrimoServer + "/primo_library/libweb/action/logout.do";
		document.body.appendChild(form4out);
		var input1 = document.createElement("input"); 
		input1.type = "hidden"; 
		input1.name = "loginFn";
		input1.value = "signout";
		form4out.appendChild(input1);
		var input2 = document.createElement("input"); 
		input2.type = "hidden";
		input2.name = "vid";
		input2.value = csidsVid;
		form4out.appendChild(input2);
		var input3 = document.createElement("input");
		input3.type = "hidden";
		input3.name = "targetURL";
		input3.value = "http://" + libPrimoServer + "/primo-explore/search?vid=" + vid + "&performLogout=true";
		form4out.appendChild(input3);
		form4out.submit();
	}; //end function
	prmCtrl.parentCtrl.authenticationService.handleLogout = customizedLogout;

	} //end try
	catch(err){console.log("logoutCSIDSAlsoForOldUI(): " + err);console.log(prmCtrl);}
} //end logoutCSIDSAlsoForOldUI()


function handleLogoutFromCSIDS(prmCtrl){
	try{
		/*Test if logout request is from CSIDS Primo, redirect to the CSIDS Primo if this is the case*/
		var locationSearch = location.search;
		if(locationSearch.includes("fromCSIDSPrimo=yes")){
			prmCtrl.parentCtrl.loginService.userSessionManagerService.local_logout();
			window.location.href="http://" + csidsPrimoServer + "/primo-explore/search?vid=" + csidsVid + "&performLogout=true";
		} //end if
	} //end try

	catch(err){console.log("handleLogoutFromCSIDS(): " + err); console.log(prmCtrl);}
} //end handleLogoutFromCSIDS();


/*Changing the icon display of e-shelf*/
function changeEshelfIcon(prmCtrl){
	try{
		if(prmCtrl.parentCtrl.iconDefinition=="prm_pin"){
			var eshelf = document.querySelector('[icon-definition="prm_pin"]');
			if(eshelf != null){
				eshelf.innerHTML = "<img src='/primo-explore/custom/" + vid + "/img/eshelf.png' width=30>";
			} //end if
		} //end if
	} //end try
	catch(err){console.log("changeEshelfIcon(): " + err);console.log(prmCtrl);}
} //end changeEshelfIcon()

/*Change the guest wording display*/
function changeGuestWordings(prmCtrl){
	try{
		var lang = prmCtrl.parentCtrl.primolyticsService.userSessionManagerService.i18nService.getLanguage();
		if(!prmCtrl.parentCtrl.isLoggedIn){
			var guests = document.querySelectorAll(".user-name");
			for(var i=0; i<guests.length; i++){
					guests[i].innerHTML = "Sign in <br> My Account";
			} //end for
		} //end if

	} //end try
	catch(err){console.log("changeGuestWordings(): " + err);console.log(prmCtrl);}
} //end changeGuestWordings()

/*Fix the email content wrong source ID*/
function fixSendEmailRecord(prmCtrl){
	try{
		var sources = prmCtrl.parentCtrl.item.pnx.display.source;
		for(var i=0; i<sources.length; i++){
			sources[i] = sources[i].replace(/^.*\$\$O/, "");
		} //end for
	} //end try
	catch(err){console.log("changeEmailSubject(): " + err);console.log(prmCtrl);}
} //end fixSendEmailRecord()
