/*Fixing the bug that on BX records wrong URLs shown*/
function fixBXRecommanderBug(prmCtrl){
	try{
	var recommendationList = document.querySelector(".full-view-aside.flex-xl-20.flex-md-25.flex-lg-25.flex");
	if(recommendationList==null)
		recommendationList = document.querySelector(".flex-xl-20.flex-md-25.flex-lg-25.flex");
	if(recommendationList!=null)
		recommendationList.style.display="none";

	var retryCount = 0;
	var timeout = 10;
	var convertedLinks = false;
	var totalDocsNumber = 999;
	var sfxHrefs = [];
	var updateURLsCallID = null;


	var loadMoreRecommendationsAndFix = function(){
		try{		
			if(!convertedLinks) {
				if(prmCtrl.parentCtrl.more){
					prmCtrl.parentCtrl.moreSuggestions();
					fixingRecommendations(prmCtrl);
					recommendationList = document.querySelector(".full-view-aside.flex-xl-20.flex-md-25.flex-lg-25.flex");
					if(recommendationList==null)
						recommendationList = document.querySelector(".flex-xl-20.flex-md-25.flex-lg-25.flex");
					if(recommendationList!=null)
						recommendationList.style.display="none";
					
				} else {
					fixingRecommendations(prmCtrl);
				} //end if
			} //end if
		} //end try

		catch(err){console.log("fixBXRecommanderBug():loadMoreRecommendations()" + err);console.log(prmCtrl);}
	};

	var updateURLs = function(){
			try{		
				if(convertedLinks){
					var listTag = document.getElementsByClassName("recommendations-list")[0];
					if(listTag!=null){
						var list = listTag.children;
						for(var m=0; m<list.length; m++){
							var aTag = list[m].firstChild.firstChild.firstChild;
							if(sfxHrefs[m]!=null){
								aTag.href = sfxHrefs[m];
								aTag.setAttribute("ng-href", sfxHrefs[m]);
							} //end if
						} //end for
						if(recommendationList!=null)
							recommendationList.style.display="inline";
					} else {
						if(updateURLsCallID!=null)
							clearInterval(updateURLsCallID);
					} //end if
				} //end if
			} //end try
			catch(err){console.log("fixBXRecommanderBug():updateURLs()" + err);console.log(prmCtrl);}
			} //end function;


	var fixingRecommendations = function(prmCtrl) {
		try{
		var convertedNumber = 0;
		var recommendations = prmCtrl.parentCtrl.recommendations;
		if (!convertedLinks && typeof recommendations !== "undefined" && typeof recommendations.docs !== "undefined" && recommendations.docs.length>0) {
			var docs = recommendations.docs;
			totalDocsNumber = docs.length;
			var xhr = [];
			for (var i = 0; i < docs.length; i++) {
				convertedNumber += 1;
				if (docs[i].delivery.availabilityLink != null) {

					var doi = "";
					if(docs[i].pnx.addata.doi!=null)
						doi = docs[i].pnx.addata.doi[0];

					var atitle = "";
					if(docs[i].pnx.display.title!=null)
						atitle = docs[i].pnx.display.title[0];
					atitle = atitle.replace(/[^&A-Za-z0-9\u4E00-\u9FFF]/gi, ' ')
					atitle = atitle.replace("&", "%26");
					atitle = atitle.replace("  ", " ");

					var jtitle = "";
					if(docs[i].pnx.addata.jtitle!=null)
						jtitle = docs[i].pnx.addata.jtitle[0];

					var issn = "";
					if(docs[i].pnx.addata.issn!=null)
						issn = docs[i].pnx.addata.issn[0];

					var eissn = "";
					if(docs[i].pnx.addata.eissn!=null)
						eissn = docs[i].pnx.addata.eissn[0];

					var aufirst = "";
					if(docs[i].pnx.addata.aufirst!=null)
						aufirst = docs[i].pnx.addata.aufirst[0];

					var aulast = "";
					if(docs[i].pnx.addata.aulast!=null)
						aulast = docs[i].pnx.addata.aulast[0];


					var ajax_url = "";
					if(doi=="" && atitle!=""){
						ajax_url = "/primo_library/libweb/ouhk/jsp/pciArticleService.jsp?";

						if(atitle!="")
							ajax_url += "atitle=" + atitle;
						if(jtitle!="")
							ajax_url += "&jtitle=" + jtitle;
						if(issn!="")
							ajax_url += "&issn=" + issn;
						if(eissn!="")
							ajax_url += "&eissn=" + eissn;
						if(aufirst!="")
							ajax_url += "&aufirst=" + aufirst;
						if(aulast!="")
							ajax_url += "&aulast=" + aulast;


						xhr[i] = new XMLHttpRequest();
						(function (j, url, doc){

						xhr[j].onreadystatechange = function(){
							try{
							if (xhr[j].readyState == 4 && xhr[j].status == 200) {
								var json = JSON.parse(xhr[j].responseText);
								var qtitle = doc.pnx.display.title[0];
								var link = "";
								if(json!=null && json.docs.length>0){
									for(var l=0;l<json.docs.length; l++){
										if(json.docs[l].delivery!=null){
											if( json.docs[l].title.replace(/[^A-Za-z\u4E00-\u9FFF\s]/gi, '').toLowerCase().trim().includes(qtitle.replace(/[^A-Za-z\u4E00-\u9FFF\s]/gi, "").toLowerCase().trim()) ){
												sfxHrefs[j] = json.docs[l].delivery.GetIt1[0].links[0].link;

												for(var k=0; k<doc.delivery.availabilityLink.length; k++){
													doc.delivery.availabilityLink[k].availabilityLinkUrl = sfxHrefs[j];
												} //end for

												
												if(convertedNumber==docs.length){
													convertedLinks = true;
												} //end if
												break;
											} //end if
										} //end if
									} //end for
								} //end if
							} //end if
							} //end try
							catch(err){
								console.log("fixBXRecommanderBug():fixingRecommendations():xhttp" + err);
							}
						} //end function()
						xhr[j].open("GET", url, true);
						xhr[j].send();
						})(i, ajax_url, docs[i]);
					} //end if
				} // end if
			} // end for
			if(retryCount<3 && !convertedLinks){
				retryCount++;
				timeout *= 10;
				if(timeout>1000)
					timeout /= 2;
				setTimeout(function(){loadMoreRecommendationsAndFix(); }, timeout);
			} //end if
		} else if(retryCount<40  && !convertedLinks){
			retryCount++;
			setTimeout(function(){loadMoreRecommendationsAndFix();  }, 2000);	
		} //end if
		} //end try
		catch(err){console.log("fixBXRecommanderBug():fixingRecommendations()" + err);console.log(prmCtrl);}
	}; // end function
	loadMoreRecommendationsAndFix();
	updateURLsCallID = setInterval(function(){ updateURLs(); }, 500);	
	} //end try
	catch(err){console.log("fixBXRecommanderBug((): " + err);console.log(prmCtrl);}
} //end fixBXRecommanderBug()

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
