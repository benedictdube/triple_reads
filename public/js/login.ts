document.addEventListener("DOMContentLoaded", async function () {
    const login = document.getElementById("login") as HTMLButtonElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("pwd") as HTMLInputElement;
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    login.addEventListener("click", async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        // validate email 
        if (email == "") {
            emailInput.setCustomValidity("Please enter an email address");
            emailInput.reportValidity();
            return;
        }
        else if (!isEmailValid(email)) {
            emailInput.setCustomValidity("Please enter a valid email address");
            emailInput.reportValidity();
            return;
        }

        else if (password == "") {
            passwordInput.setCustomValidity("Please enter a password");
            passwordInput.reportValidity();
            return;
        }

        else {
            localStorage.setItem('email', email);
            window.location.href = "index.html";
        }
    });

    function isEmailValid(email: string) {
        if (!email)
            return false;
    
        if(email.length>254)
            return false;
    
        var valid = emailRegex.test(email);
        if(!valid)
            return false;
    
        // Further checking of some things regex can't handle
        var parts = email.split("@");
        if(parts[0].length>64)
            return false;
    
        var domainParts = parts[1].split(".");
        if(domainParts.some(function(part) { return part.length>63; }))
            return false;
    
        return true;
    }

    emailInput.addEventListener("input", function () {
        emailInput.setCustomValidity("");
    });

    passwordInput.addEventListener("input", function () {
        passwordInput.setCustomValidity("");
    });
});