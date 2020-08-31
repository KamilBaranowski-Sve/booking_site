
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