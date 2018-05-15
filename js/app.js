document.addEventListener("DOMContentLoaded", function() {

	const form = document.querySelector('#myForm');
	const inputs = form.querySelectorAll('input, input[required]');

	form.setAttribute('novalidate', true);

	const displayFieldError = function(elem) {
  	
  		const fieldContent = elem.closest('.inputs__content');
  		const fieldError = fieldContent.querySelector('.field-error');

  		if (fieldError === null) {

  			const errorText = elem.dataset.error;
    		const divError = document.createElement('div');
    	
    		divError.classList.add('field-error');
    		divError.innerText = errorText;
    		fieldContent.appendChild(divError);
  		}
	};

	const hideFieldError = function(elem) {

  		const fieldContent = elem.closest('.inputs__content');
  		const fieldError = fieldContent.querySelector('.field-error');

 		if (fieldError !== null) {
 			fieldError.remove();
  		}
	};

	[...inputs].forEach(elem => {
		elem.addEventListener('input', function() {
    		if (!this.checkValidity()) {
    			this.classList.add('error');
    		} else {
    			this.classList.remove('error');
    			hideFieldError(this);
    		}
  		});
	});

	const checkFieldsErrors = function(elements) {

  		let fieldsAreValid = true;

  		[...elements].forEach(elem => {
    		if (elem.checkValidity()) {
      			hideFieldError(elem);
      			elem.classList.remove('error');
    		} else {
    			displayFieldError(elem);
      			console.log(elem);
      			elem.classList.add('error');
      			fieldsAreValid = false;
    		}
  		});

  		return fieldsAreValid;
	};

	function stripTags(str) {
		return str.replace(/[\<\>]/ig,"");
	}

	function formatJSON(json) {
  		
  		var regeStr = '';
  		var f = {
    		brace: 0
  		};

  		regeStr = json.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, function (m, p1) {

  			var rtnFn = function() {
  				return '<div style="text-indent: ' + (f['brace'] * 20) + 'px;">' + p1 + '</div>';
    		},

    		rtnStr = 0;
    		if (p1.lastIndexOf('{') === (p1.length - 1)) {
    			rtnStr = rtnFn();
      			f['brace'] += 1;
    		} else if (p1.indexOf('}') === 0) {
    			f['brace'] -= 1;
    			rtnStr = rtnFn();
    		} else {
    			rtnStr = rtnFn();
    		}

    		return rtnStr;
  		});

  		return regeStr;

	}

	form.addEventListener('submit', e => {
		e.preventDefault();
		console.log(checkFieldsErrors(inputs));
  		if (checkFieldsErrors(inputs)) {
  			var formData = new FormData();
    		formData.append('field_name' , stripTags(document.querySelector('input[name="full_name"]').value));
    		formData.append('company' , stripTags(document.querySelector('input[name="company"]').value));
    		formData.append('email' , stripTags(document.querySelector('input[name="email"]').value));
    		formData.append('phone' , stripTags(document.querySelector('input[name="phone"]').value));

    		fetch(form.getAttribute('action'), {
    		method: 'POST',
    		headers: {
        		'Accept': 'application/json',
        		//'Content-Type': 'application/json'
      		},

      		body: formData
      		}).then(res => res.json())
    		.then(res => {
      			
      			let popup = document.querySelector('.popup');
      			if (popup !== null) {
      				popup.remove();
      			}

      			const txt = JSON.stringify(res);
      			popup = document.createElement('div');
      			popup.classList.add('popup');

            const btn = document.createElement('button');
      			btn.classList.add('popup-close');
      			popup.appendChild(btn);

      			const div = document.createElement('div');
      			div.innerHTML = formatJSON(txt);
      			popup.appendChild(div);

      			document.querySelector('body').appendChild(popup);

      			document.querySelector('.popup-close').addEventListener('click', function() {
        			this.parentElement.remove();
      			});

            [...inputs].forEach(el => el.value = '');
    		});
    	}
	});
});