$(
  (document.ready = function () {
    const savedUser = localStorage.getItem("user");
    let api = `http://localhost:1879`;

    let nameDisplay = $(".username");
    let imgDisplay = $(".userDisplay");
    let mainBox = $(".main-box");
    let originalBg = mainBox.css("background-image");

    if (savedUser) {
      const user = JSON.parse(savedUser);
      $("#login").hide();
      $(".username")
        .text(`${user.first_name} ${user.last_name}`)
        .css("font-size", "1rem");

      return;
    } else {
      $(".login").show();
    }

    $("#login").on("click", function (e) {
      e.preventDefault();

      mainBox.css("background-image", "url('')");
      mainBox.html(`<form style="display: grid; gap:20px; margin: auto; width: 20vh">
        <input id="userName" placeholder="Enter Username" style="border-radius:15px; height: 2vh">
        <input id="passWord" placeholder="Enter Password" style="border-radius:15px; height: 2vh">
        <button style="width: 10vh; border-radius: 12px; height: 4vh; background-color: aquamarine" id='loginBtn' type="button">Login</button>
        <button style=" border-radius: 12px; height: 4vh; background-color: aquamarine" id="regBtn" type="button">Register a New User</button>
      </form>`);

      $("#loginBtn").on("click", function (e) {
        e.preventDefault();

        let username = $("#userName").val();
        let password = $("#passWord").val();

        if (!username || !password) {
          alert("Both fields required");
          return;
        }

        $.ajax({
          url: `${api}/user`,
          method: "GET",
          success: function (res) {
            let correctUser;

            res.forEach((i) => {
              if (i.username === username && i.password === password) {
                correctUser = i;
              }
            });
            if (correctUser) {
              mainBox.css("background-image", originalBg);
              mainBox.empty();
              $("#login").html("");
              $(".username")
                .text(`${correctUser.first_name} ${correctUser.last_name}`)
                .css("font-size", "1rem");
              localStorage.setItem("user", JSON.stringify(correctUser));
            } else {
              alert("Incorrect details. Check details or create an account");
            }
          },
          error: function (err) {
            return alert(err);
          },
        });
      });

      $("#regBtn").on("click", function (e) {
        e.preventDefault();

        let mainBox = $(".main-box");
        mainBox.css("background-image", "url('')");
        mainBox.html(`<form style="display: grid; grid-template-columns: 2, 1fr; gap:20px; margin: auto; width: 20vh">
        <input id="firstName" placeholder="Enter First Name" style="border-radius:15px; height: 2vh">
        <input id="lastName" placeholder="Enter Last Name" style="border-radius:15px; height: 2vh">
        <input id="regUsername" placeholder="Enter Username" style="border-radius:15px; height: 2vh">
        <input id="regPassword" placeholder="Enter Password" style="border-radius:15px; height: 2vh">
        <input id="confirmPassword" placeholder="Confirm Password" style="border-radius:15px; height: 2vh">
        <button style=" border-radius: 12px; height: 4vh; background-color: aquamarine" id="validate">Register a New User</button>
      </form>`);

        $("#validate").on("click", function (e) {
          e.preventDefault();

          let firstName = $("#firstName").val();
          let lastName = $("#lastName").val();
          let regUsername = $("#regUsername").val();
          let regPassword = $("#regPassword").val();
          let confirmPassword = $("#confirmPassword").val();

          if (
            !firstName ||
            !lastName ||
            !regUsername ||
            !regPassword ||
            !confirmPassword
          ) {
            alert("All fields are required.");
            return;
          }

          if (confirmPassword !== regPassword) {
            alert("Confirm Password must be the same as Password");
            return;
          }

          $.ajax({
            url: `${api}/user`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              first_name: firstName,
              last_name: lastName,
              username: regUsername,
              password: regPassword,
              isCompleted: false,
            }),
            success: function (res) {
              alert("Registration Successful");
            },
            error: function (err) {
              alert("Registration Failed");
            },
          });
        });
      });
    });
  })
);
