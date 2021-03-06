function init() {
  window.dynamicContent = document.getElementById('content'); // The div to replace the image into.
  window.clickUrl = undefined; // the global variable to store the url from mapping. 'undefined' during init process.
  window.companyName = undefined;  // the global variable to store the company name. 'undefined' during init process.
  // Showing loader
  showImage(loader);
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    addListeners(); // Adding click listener to content; to handle click redirects
    if (this.readyState == 4) { // After we get the response.
      showImage();
      if (this.status === 200){ // if we get the success response
        res = JSON.parse(this.responseText); // this is how you parse the response from company details api
        console.log(res)
        companyName = res.company.name;
        companyLogo = res.company.logo
        console.log(companyName)
        displayPersonalizedText(companyName);
        var matchedMappingKey = Object.keys(companyUrlMapping).find(function (name) {
          return name.toLowerCase() === companyName.toLowerCase();
          
        }); // match company name ignoring case from the mapping object
        if (companyName && matchedMappingKey) {
          clickUrl = companyUrlMapping[matchedMappingKey]; // get the custom click url from mapping
          displayPersonalizedText(companyName); // passing the company name to add personalized company name text on top of the ad
        }
      }
    }
  });
  xhr.open("GET", "https://epsilon.6sense.com/v1/company/details"); // The actual call made to company details api
  xhr.setRequestHeader("Authorization", "Token ec6d083d2d590e9f79a0d6cd433e44b00a358637"); // The company details api-token (provided by 6sense) goes here.
  // xhr.setRequestHeader("X-Forwarded-For", "<IP_ADDRESS>"); To test your HTML5 ad uncomment this line and put the appropiate ip address for the account you want to test
  xhr.timeout = 5000; // ideal to wait for 5 seconds
  xhr.send(); // The call starts here.
}

function showImage() {
  dynamicContent.style.backgroundImage = "url(" + imageUrl + ")"; // this shows your creative
}

function displayPersonalizedText(userCompanyName) {
  
  var companyNameEle = document.getElementById('company-name'); // the div that shows the custom text, the company name
  companyNameEle.innerHTML = userCompanyName + ','
  // document.getElementById('text-area').style.top = '30%' // move the text a little more down to accomodate showing company name
}

function addListeners() {
	dynamicContent.addEventListener('click', clickEventHandler, false);
}

function clickEventHandler(e) { // function that redirects to landing page url. We get the landing page url from APPNEXUS library.
  function updateClickUrl(clickTag, dynamicClickUrl, dynamicCompanyName) {
    var baseClickTag, anClickUrl, sixSenseClickUrl, modifiedDynamicClickUrl;
    var anClickUrlKey = 'clickenc=';
    modifiedDynamicClickUrl = new URL(dynamicClickUrl);
    modifiedDynamicClickUrl.searchParams.set('xsrc', '6s'); // set param for source to be from 6s to the clickurl from mapped item
    // add your query params to your custom click URL here, if needed
    if(dynamicCompanyName) {
      modifiedDynamicClickUrl.searchParams.set('xdcname', dynamicCompanyName); // set param to recogonise the user company name to the clickUrl from the maped item
    }
    baseClickTag = clickTag.split(anClickUrlKey)[0];
    anClickUrl = clickTag.split(anClickUrlKey)[1];
    sixSenseClickUrl = new URL(decodeURIComponent(anClickUrl));
    sixSenseClickUrl.searchParams.set('redirect', modifiedDynamicClickUrl); // update redirect URL to clickUrl from mapped item with, modified with additionam params 'xsrc' and 'xdcname'
    // DO NOT ADD ANY MORE QUERY PARAMS HERE, this is for 6sense analytics
    if(dynamicCompanyName) {
      sixSenseClickUrl.searchParams.set('xdcname', dynamicCompanyName); // set param to recogonise the user company name
    }
    return baseClickTag + anClickUrlKey + encodeURIComponent(sixSenseClickUrl);
  }

  var clickTag = APPNEXUS.getClickTag();
  if (window.clickUrl) {
    // if custom click url for the matched mapping item present then update the app nexus
    // click tag with some more custom query params
    clickTag = updateClickUrl(clickTag, window.clickUrl, window.companyName);
  }
  window.open(clickTag);
}
