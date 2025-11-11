function briteVerify(email, callback) {
	const urlParams = new URLSearchParams(window.location.search);
	const paramValue = urlParams.get('k');
	if (email) {		
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Authorization", "ApiKey: " + paramValue);

		var raw = JSON.stringify({
		  "email": email
		});

		var requestOptions = {
		  method: 'POST',
		  headers: myHeaders,
		  body: raw,
		  redirect: 'follow'
		};

		fetch("https://bpi.briteverify.com/api/public/v1/fullverify", requestOptions)
		  .then(response => { return response.json(); })	
		  .then(data => {
				var isValid = (data.email.status === 'valid');
				if (typeof callback === 'function') {
					callback(isValid);
				}
		  })
		  .catch(error => console.log('error', error));
	} else { callback(false); }
}
function setupFormVerification(formElement) {
    const emailInput = formElement.querySelector('input[type="email"]');
    const submitButton = formElement.querySelector('button');
    if (emailInput && submitButton) {
        const divElement = emailInput.parentElement;
		const divElementParent = divElement.parentElement;

        submitButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            briteVerify(emailInput.value, function(result) { 
                const dataEmbed = formElement.getAttribute('data-embed');
                const form = window[dataEmbed];

                if (result) {
                    if (divElement) divElement.classList.remove('required');
					if (divElementParent) divElementParent.classList.remove('required');
                    if (form && form.Validate()) {
                        FW.Lazy.Commit(submitButton, { cmd: 'submit' });
                    }
                } else {
                    if (divElement) divElement.classList.add('required');
					if (divElementParent) divElementParent.classList.remove('required');
                }
            });
        }, true);
    }
}
function initializeAllForms() {
    var formElements = document.querySelectorAll('form');
    
    if (formElements.length > 0) {
        formElements.forEach(form => {
            setupFormVerification(form);
        });
    } else { 
        setTimeout(initializeAllForms, 1000);
    }
}

initializeAllForms();
