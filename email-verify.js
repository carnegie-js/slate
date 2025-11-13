let url = new URL(document.currentScript.src);
let kValue = url.searchParams.get('k');
function briteVerify(email, callback) {
	if (email) {		
		let myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Authorization", "ApiKey: " + kValue);
		
		let raw = JSON.stringify({
		  "email": email
		});
		
		let requestOptions = {
		  method: 'POST',
		  headers: myHeaders,
		  body: raw,
		  redirect: 'follow'
		};
		
		fetch("https://bpi.briteverify.com/api/public/v1/fullverify", requestOptions)
		  .then(response => { return response.json(); })	
		  .then(data => {
				let isValid = (data.email.status === 'valid');
				callback(isValid);
		  })
		  .catch(error => callback(true));
	} else { callback(false); }
}
function setupFormVerification(formElement) {
    let emailInput = formElement.querySelector('input[type="email"]');
    let submitButton = formElement.querySelector('button');
	
    if (emailInput && submitButton) {
        let divElement = emailInput.parentElement.parentElement;
		
        submitButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();            
            briteVerify(emailInput.value, function(result) { 
                let dataEmbed = formElement.getAttribute('data-embed');
                let form = window[dataEmbed];

                if (result) {
                    if (divElement) divElement.classList.remove('required');
                    if (form && form.Validate()) {
                        FW.Lazy.Commit(submitButton, { cmd: 'submit' });
                    }
                } else {
                    if (divElement) divElement.classList.add('required');
                }
            });
        }, true);
    }
}
function initializeAllForms() {
    let formElements = document.querySelectorAll('form');  
	
    if (formElements.length > 0) {
        formElements.forEach(form => {
            setupFormVerification(form);
        });
    } else {  setTimeout(initializeAllForms, 1000); }
}
initializeAllForms();





