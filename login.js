form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Validate text/email/password fields
    inputs.forEach(input => {
        const error = input.parentElement.querySelector('.error');
        if (input.value.trim() === '') {
            error.style.display = 'block';
            valid = false;
        } else {
            error.style.display = 'none';
        }
    });

    // Validate gender
    const genderSelected = Array.from(genderInputs).some(input => input.checked);
    let genderError = form.querySelector('.gender-error');
    if (!genderError) {
        genderError = document.createElement('div');
        genderError.classList.add('error', 'gender-error');
        genderError.innerText = "Please select your gender";
        genderInputs[0].parentElement.appendChild(genderError);
    }
    if (!genderSelected) {
        genderError.style.display = 'block';
        valid = false;
    } else {
        genderError.style.display = 'none';
    }

    // If everything is valid, redirect to home page
    if (valid) {
        window.location.href = "index.html";  // Redirect to home page
    }
});
