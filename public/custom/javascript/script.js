const registerForm = document.querySelector("#register-form");


registerForm.addEventListener("submit", async function(event){
    event.preventDefault();
    let form_errors = [];//empty errors array
    document.querySelector("#register-form-info").innerHTML = "";


    let firstname = this.firstname.value.trim();
    let lastname = this.lastname.value.trim();
    let email = this.email.value.trim();
    let password = this.password.value.trim();

    let password_confirm = this.password_confirm.value.trim();

    if(firstname.length == 0){
        form_errors.push("You did not enter first name");
        document.querySelector("#register-form-info").innerHTML += `<div class='mb-3 alert alert-danger'>
        You did not enter first name
        </div>`;
    }

    if(lastname.length == 0){
        form_errors.push("You did not enter last name");
        document.querySelector("#register-form-info").innerHTML += `<div class='mb-3 alert alert-danger'>
        You did not enter last name
        </div>`;
    }

    if(email.length == 0){
        form_errors.push("You did not enter email");
        document.querySelector("#register-form-info").innerHTML += `<div class='mb-3 alert alert-danger'>
        You did not enter email
        </div>`;
    }

    if(password.length == 0){
        form_errors.push("You did not enter password");
        document.querySelector("#register-form-info").innerHTML += `<div class='mb-3 alert alert-danger'>
        You did not enter password
        </div>`;
    }

    if(password_confirm.length == 0){
        form_errors.push("You did not confirm password");
        document.querySelector("#register-form-info").innerHTML += `<div class='mb-3 alert alert-danger'>
        You did not confirm password
        </div>`;
    }




    if(password != password_confirm){
        //output error
        form_errors.push("Password must match Password Confirmation");
        document.querySelector("#register-form-info").innerHTML += `<div class='mb-3 alert alert-danger'>
                                                                    Password must match Password Confirmation
                                                                </div>`;

    }



    if(form_errors.length == 0){
        //start the spinner
        startSpinner()

        //there are no errors
        const userdata = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password
        }

        const feedback = await axios.post("/register-user", userdata)
        console.log(feedback);

        if(feedback){
            //stop the spinner
            stopSpinner()

            document.querySelector("#register-form-info").innerHTML = `<div class='alert alert-success'>
                <h4>Your account was created successfully!</h4>
                <p>We sent you a validation email. Please click the link to activate your account.</p>
            </div>`

            //clear the form field
            // $("#register-form")[0].reset();
            $("#register-form").html("<div></div>");
        }

        

    }






    

})

function startSpinner(){
    const modalCode = `<div class="modal" tabindex="-1" id='spinner-modal' data-backdrop='static' data-keyboard='false'>
    <div class="modal-dialog modal-dialog-centered border-0">
      <div class="modal-content border-0" style='background: transparent;'>
        <!-- <div class="modal-header border-0">
          <h5 class="modal-title">Please wait ...</h5>
        </div> -->
        <div class="modal-body border-0">
        <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        </div>
      </div>
    </div>
  </div>`

  let divElement = document.createElement("div");
  divElement.innerHTML = modalCode

  document.body.appendChild(divElement);

  $("#spinner-modal").modal('show');

}

function stopSpinner(){
    $("#spinner-modal").modal('hide');
}