
function init() {
  window.dynamicContent = document.getElementById('content'); // The div to replace the image into.
  window.clickUrl = "https://www.copado.com/devops-hub/maximize-salesforce-cpq-with-automated-testing?utm_source=6sense&utm_medium=cpc&utm_campaign=crt_cpq_fy23_q1&utm_term=learn_how&utm_content=test_cpq_like_its_2022"; // the global variable to store the url from mapping. 'undefined' during init process.
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
        companyName = res.company.name;
        displayPersonalizedText(companyName);
        var matchedMappingKey = Object.keys(companyUrlMapping).find(function (name) {
          return name.toLowerCase() === companyName.toLowerCase();
        }); 
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

function clickEventHandler(e) { 
  window.open(clickUrl);
}
