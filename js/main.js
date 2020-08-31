// PHOTO GALLERY, CHANGING PHOTOS
function photoGallery() {
    let URLpathname = window.location.pathname;
    if (URLpathname.endsWith("employees.html")) {  // controls which window is opened
        let galleryArrayEmployees = new Array[
            document.getElementById("img/e01.jpg").addEventListener("click", setImage),
                document.getElementById("img/e02.jpg").addEventListener("click", setImage),
                document.getElementById("img/e03.jpg").addEventListener("click", setImage),
                document.getElementById("img/e04.jpg").addEventListener("click", setImage)
            ]
    }

    if (URLpathname.endsWith("ourfleet.html")) {
        let galleryArrayFleet = new Array[
            document.getElementById("img/f01.jpg").addEventListener("click", setImage),
                document.getElementById("img/f02.jpg").addEventListener("click", setImage),
                document.getElementById("img/f03.jpg").addEventListener("click", setImage),
                document.getElementById("img/f04.jpg").addEventListener("click", setImage)
            ]
    }
}

// setting chosen image
function setImage() {
    document.getElementById("img0").src = this.id;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// DETECTING BROWSER
function detectBrowser() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Control of used browser according to https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
    let sBrowser, sUsrAg = navigator.userAgent;

    // The order matters here, and this may report false positives for unlisted browsers.

    if (sUsrAg.indexOf("Firefox") > -1) {
        sBrowser = "Mozilla Firefox";
        // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
    } else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
        sBrowser = "Samsung Internet";
        // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
    } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
        sBrowser = "Opera";
        // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
    } else if (sUsrAg.indexOf("Trident") > -1) {
        sBrowser = "Microsoft Internet Explorer";
        // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
    } else if (sUsrAg.indexOf("Edge") > -1) {
        sBrowser = "Microsoft Edge";
        // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    } else if (sUsrAg.indexOf("Chrome") > -1) {
        sBrowser = "Google Chrome or Chromium";
        // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
    } else if (sUsrAg.indexOf("Safari") > -1) {
        sBrowser = "Apple Safari";
        // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
    } else {
        sBrowser = "unknown";
    }
    //alert("You are using: " + sBrowser);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Adjusted content
    document.getElementById("browser_info").innerHTML = "You are using: " + sBrowser;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BOOKING SITE
function canvasPrint() {
    // Controlling which window opened
    let URLpathname = window.location.pathname;
    if (!(URLpathname.endsWith("booking.html"))) {
        return;
    }

    // VARIABLES
    let canvas = document.getElementById("booking_seats");
    let ctx = canvas.getContext("2d");

    //  button colors
    const colorArray = [
        "#00a896",  // green color
        "#118ab2",  // blue color
        "#ef476f"  // red color
    ];

    // creating array with seat coordinates
    let arrayCounter = 0;
    let seatCoordinateArray = [];
    for (let i = 0; i < numberRows; i++) {
        for (let j = 0; j < numberColumns; j++) {
            seatCoordinateArray[arrayCounter] = [
                Xorigin + j * dx,  // first corner X-coordinate
                Yorigin + i * dy,  // first corner Y-coordinate
                Xorigin + j * dx + seatWidth,  // second corner X-coordinate
                Yorigin + i * dy + seatHeight  // second corner Y-coordinate
            ];
            arrayCounter++;
        }
    }

    // track X, Y position when click on canvas
    canvas.addEventListener("click", (event) => {
        let rect = canvas.getBoundingClientRect();
        let mousePos = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top}
            selectSeat(mousePos.x, mousePos.y);
            drawSeats();
        //console.log(mousePos.x, mousePos.y);
        });

    // form buttons
    let buttonClearTheForm = document.getElementById("clear_the_form");
    buttonClearTheForm.addEventListener("click", clearForm);

    let buttonSubmit = document.getElementById("submit");
    buttonSubmit.addEventListener("click", submitForm);

    // CREATING SEAT OBJECT
    // constructor
    function Seat(x, y, w, h, name, surname, identificationNumber, travelClass, seatNumber, seatColor) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        // undefined yet
        // data about passenger
        // this.name = name;
        // this.surname = surname;
        // this.identificationNumber = identificationNumber;
        // this.travelClass = travelClass;  // 0 == business class, 1 == economy class
        // this.seatNumber = seatNumber;
        this.seatColor = seatColor;  // 0 == free seat (green) , 1 == chosen (blue) , 2 == occupied (red)
    }

    // SEPARATE FUNCTIONS
    function drawSeats() {  // rendering picture with seat rectangles
        // different colours depending on if seat is chosen or not, booked or not
        for (let i = 0; i < seatArray.length; i++) {
            if (seatArray[i].seatColor === 0) {
                ctx.fillStyle = colorArray[0];
            } else if (seatArray[i].seatColor === 1) {
                ctx.fillStyle = colorArray[1];
            } else if (seatArray[i].seatColor === 2) {
                ctx.fillStyle = colorArray[2];
            }
            ctx.fillRect(seatArray[i].x, seatArray[i].y, seatArray[i].w, seatArray[i].h);
        }
    }

    function selectSeat(clickX, clickY) {
        // selecting seat depending on coordinates and setting data into form
        for (let i = 0; i < numberColumns * numberRows; i++)
            if (clickX > seatCoordinateArray[i][0] && clickX < seatCoordinateArray[i][2] && clickY > seatCoordinateArray[i][1] && clickY < seatCoordinateArray[i][3]) {
                if (seatArray[i].seatColor === 2)
                    return;
                clearForm();
                seatArray[i].seatColor = 1;
                document.getElementById("seat_number_form").value = i + 1;

                if (i < 6)
                    document.getElementById("travel_class_form").value = "Business class";
                else document.getElementById("travel_class_form").value = "Travel class";

                return;
            }
    }

    function clearForm() {
        // clearing all input from the form
        for (let i = 0; i < seatArray.length; i++) {
            if (seatArray[i].seatColor !== 2)
                seatArray[i].seatColor = 0;
        }
        drawSeats();
    }

    function submitForm() {
        // submitting given values inside the form
        // variables depending on form element
        let firstName = document.getElementById("first_name_form").value;
        let surname = document.getElementById("second_name_form").value;
        let IDnumber = document.getElementById("ID_number_form").value;
        let travelClass = document.getElementById("travel_class_form").value;
        let seatNumber = document.getElementById("seat_number_form").value;

        // checking if form is filled correctly
        let isVariableCorrect = true;

        if (checkingCorrect(firstName) === false)
            isVariableCorrect = false;
        if (checkingCorrect(surname) === false)
            isVariableCorrect = false;
        if (checkingCorrect(IDnumber) === false)
            isVariableCorrect = false;
        if (checkingCorrect(travelClass) === false)
            isVariableCorrect = false;
        if (checkingCorrect(seatNumber) === false)
            isVariableCorrect = false;
        if (isVariableCorrect === false) {
            alert("Form is not filled correctly");
            return;
        }

        // setting values inside seatArray
        seatArray[seatNumber - 1].name = firstName;
        seatArray[seatNumber - 1].surname = surname;
        seatArray[seatNumber - 1].identificationNumber = IDnumber;
        seatArray[seatNumber - 1].travelClass = travelClass;
        seatArray[seatNumber - 1].seatNumber = seatNumber;

        //setting seat color
        seatArray[seatNumber - 1].seatColor = 2;
        drawSeats();

        // Summary of order
        // opening new window with summary
        let orderSummary = window.open("", "", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=150,height=200,menubar=yes");

        // setting up @media style
        orderSummary.document.head.innerHTML +=
            '<style>' +
            '@media print{p{font-size: 25px;font-family: Lato}}' +
            '</style>';

        // showing info about order
        orderSummary.document.body.innerHTML +=
            '<p class="orderContainer">' +
            'Order summary' +
            '</p>' +
            '<p class="orderContainer">' +
            'First name: ' + firstName +
            '</p>' +
            '<p class="orderContainer">' +
            'Second name: ' + surname +
            '</p>' +
            '<p class="orderContainer">' +
            'ID number: ' + IDnumber +
            '</p>' +
            '<p class="orderContainer">' +
            'Travel class: ' + travelClass +
            '</p>' +
            '<p class="orderContainer">' +
            'Seat number: ' + seatNumber +
            '</p>';

        // resetting form values
        let clearingForm = document.getElementById("clear_the_form");
        clearingForm.click();

        // session storage
        if (seatArray.length !== 0) {
            sessionStorage.setItem("sessionStorageObject", JSON.stringify(seatArray));
        }
    }


    // Initializing values of Seat array objects
    function initializeSeatArray() {
        drawSeats();
        // session storage if data exist inside seatArray
        let retrievedObject = JSON.parse(sessionStorage.getItem("sessionStorageObject"));
        if (retrievedObject.length !== 0) {
            seatArray = retrievedObject;
            // new seatArray values if new form is created
        } else if (retrievedObject.length === 0) {
            for (let i = 0; i < seatArray.length; i++) {
                seatArray[i].seatNumber = i;
                if (i < 6) {
                    seatArray[i].travelClass = 0;
                } else {
                    seatArray[i].travelClass = 1;
                }
            }
        }
    }

    // checking if user gives proper values
    function checkingCorrect(testCorrect) {
        return !(testCorrect === null || testCorrect === undefined || testCorrect === 0 || testCorrect === "");
    }

    // SEPARATE COMMANDS
    // Initial values of Seat object
    let xStart = 50;
    let xCurr = xStart;
    let yCurr = 50;

    // Creating array of Seat objects
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
            seatArray.push(new Seat(xCurr, yCurr, seatWidth, seatHeight, undefined, undefined, undefined, undefined, undefined, 0));
            xCurr += dx;
        }
        xCurr = xStart;
        yCurr += dy;
    }

    // Initializing values of Seat array objects
    initializeSeatArray();

    // Rendering seat objects=
    drawSeats();
}


// PAGE NAME DETECTION
function pageDetect() {
    let URLpathname = window.location.pathname;
    if (URLpathname.endsWith("employees.html") || URLpathname.endsWith("ourfleet.html"))
        photoGallery();
    else if (URLpathname.endsWith("contact.html"))
        detectBrowser();
    else if (URLpathname.endsWith("booking.html"))
        canvasPrint();
}


// EVENT LISTENER
window.addEventListener("load", pageDetect);

// GLOBAL VARIABLES
let seatArray = [];
const numberRows = 6;
const numberColumns = 3;
const seatWidth = 80;
const seatHeight = 35;
const Xorigin = 50;
const Yorigin = 50;
const dx = 100;
const dy = 50;