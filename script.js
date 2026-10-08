// ========================================
// SYNTAXS HOSPITAL - APPOINTMENT SYSTEM
// ========================================


// Get appointments from localStorage
let appointments = [];

try {
    appointments =
        JSON.parse(
            localStorage.getItem("syntaxsAppointments")
        ) || [];
} catch (error) {
    appointments = [];
}


// ========================================
// ELEMENTS
// ========================================

const appointmentForm =
    document.getElementById("appointmentForm");

const successMessage =
    document.getElementById("successMessage");

const confirmationText =
    document.getElementById("confirmationText");

const appointmentsList =
    document.getElementById("appointmentsList");


// ========================================
// BOOK APPOINTMENT
// ========================================

if (appointmentForm) {

    appointmentForm.addEventListener(
        "submit",
        function (event) {

            // Stop page refresh
            event.preventDefault();


            // Get form values
            const patientName =
                document
                    .getElementById("patientName")
                    .value
                    .trim();

            const doctor =
                document
                    .getElementById("doctorSelect")
                    .value;

            const problem =
                document
                    .getElementById("problem")
                    .value
                    .trim();

            const date =
                document
                    .getElementById("date")
                    .value;

            const time =
                document
                    .getElementById("time")
                    .value;


            // Check all fields
            if (
                patientName === "" ||
                doctor === "" ||
                problem === "" ||
                date === "" ||
                time === ""
            ) {

                alert(
                    "Please fill in all appointment details."
                );

                return;
            }


            // Format date
            const formattedDate =
                new Date(
                    date + "T00:00:00"
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                    }
                );


            // Create appointment object
            const newAppointment = {

                id: Date.now(),

                patientName: patientName,

                doctor: doctor,

                problem: problem,

                date: formattedDate,

                time: time,

                status: "Confirmed"

            };


            // Add appointment to array
            appointments.push(newAppointment);


            // ========================================
            // SAVE TO LOCAL STORAGE
            // ========================================

            localStorage.setItem(
                "syntaxsAppointments",
                JSON.stringify(appointments)
            );


            // Check whether it saved
            console.log(
                "Appointment saved:",
                newAppointment
            );

            console.log(
                "All appointments:",
                appointments
            );


            // ========================================
            // SUCCESS MESSAGE
            // ========================================

            if (successMessage) {

                successMessage.classList.add(
                    "show"
                );

            }


            if (confirmationText) {

                confirmationText.textContent =
                    "Appointment for " +
                    patientName +
                    " with " +
                    doctor +
                    " has been booked successfully.";

            }


            // ========================================
            // UPDATE APPOINTMENT LIST
            // ========================================

            displayAppointments();


            // Clear form
            appointmentForm.reset();


            // Scroll to success message
            if (successMessage) {

                successMessage.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }
    );

}


// ========================================
// DISPLAY APPOINTMENTS
// ========================================

function displayAppointments() {

    if (!appointmentsList) {
        return;
    }


    // No appointments
    if (appointments.length === 0) {

        appointmentsList.innerHTML = `

            <div class="empty-appointments">

                <div class="empty-icon">
                    📅
                </div>

                <h3>
                    No Appointments Yet
                </h3>

                <p>
                    Book an appointment and
                    it will appear here.
                </p>

                <a
                    href="#book"
                    class="btn primary"
                >
                    Book Appointment
                </a>

            </div>

        `;

        return;
    }


    // Clear old appointments
    appointmentsList.innerHTML = "";


    // Display every appointment
    appointments.forEach(
        function (appointment, index) {

            const appointmentCard =
                document.createElement("div");

            appointmentCard.className =
                "appointment-card";


            appointmentCard.innerHTML = `

                <div class="appointment-top">

                    <span class="appointment-number">
                        APPOINTMENT #${index + 1}
                    </span>

                    <span class="appointment-status">
                        ${appointment.status}
                    </span>

                </div>


                <h3>
                    ${escapeHTML(
                        appointment.patientName
                    )}
                </h3>


                <p class="appointment-doctor">
                    ${escapeHTML(
                        appointment.doctor
                    )}
                </p>


                <div class="appointment-detail">

                    <span>
                        Date
                    </span>

                    <strong>
                        ${escapeHTML(
                            appointment.date
                        )}
                    </strong>

                </div>


                <div class="appointment-detail">

                    <span>
                        Time
                    </span>

                    <strong>
                        ${escapeHTML(
                            appointment.time
                        )}
                    </strong>

                </div>


                <div class="problem-text">

                    <strong>
                        Patient Problem
                    </strong>

                    <br><br>

                    ${escapeHTML(
                        appointment.problem
                    )}

                </div>


                <button
                    class="cancel-btn"
                    onclick="cancelAppointment(${appointment.id})"
                >
                    Cancel Appointment
                </button>

            `;


            appointmentsList.appendChild(
                appointmentCard
            );

        }
    );

}


// ========================================
// CANCEL APPOINTMENT
// ========================================

function cancelAppointment(id) {

    const answer =
        confirm(
            "Are you sure you want to cancel this appointment?"
        );


    if (!answer) {
        return;
    }


    // Remove appointment
    appointments =
        appointments.filter(
            function (appointment) {
                return appointment.id !== id;
            }
        );


    // Save updated list
    localStorage.setItem(
        "syntaxsAppointments",
        JSON.stringify(appointments)
    );


    // Refresh display
    displayAppointments();

}


// ========================================
// ESCAPE HTML
// Prevents HTML from being inserted
// into the appointment display
// ========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ========================================
// PREVENT PAST APPOINTMENT DATES
// ========================================

const dateInput =
    document.getElementById("date");


if (dateInput) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    dateInput.min = today;

}


// ========================================
// LOAD SAVED APPOINTMENTS
// WHEN PAGE OPENS
// ========================================

displayAppointments();