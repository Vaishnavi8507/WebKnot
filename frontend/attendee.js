document.addEventListener('DOMContentLoaded', () => {
    const addAttendeeBtn = document.getElementById('add-attendee-btn');
    const addAttendeeModal = document.getElementById('add-attendee-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const addAttendeeForm = document.getElementById('add-attendee-form');
    const attendeeList = document.getElementById('attendee-list');
    const eventFilter = document.getElementById('event-filter');

    // Load attendees from localStorage on page load
    const loadAttendees = (eventFilterValue = '') => {
        const attendees = JSON.parse(localStorage.getItem('attendees')) || [];
        attendeeList.innerHTML = '';
        const filteredAttendees = attendees.filter(attendee => 
            !eventFilterValue || attendee.event === eventFilterValue
        );
        filteredAttendees.forEach((attendee, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${attendee.name}</td>
                <td>${attendee.email}</td>
                <td>${attendee.contact}</td>
                <td>${attendee.event}</td> <!-- Display event name -->
                <td>${attendee.task}</td> <!-- Display task assigned -->
                <td><button class="btn delete-btn" onclick="deleteAttendee(${index})">Delete</button></td>
            `;
            attendeeList.appendChild(row);
        });
    };

    // Add a new attendee
    addAttendeeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('attendee-name').value;
        const email = document.getElementById('attendee-email').value;
        const contact = document.getElementById('attendee-contact').value;
        const eventAssigned = document.getElementById('assigned-event').value; // Get selected event name directly
        const taskAssigned = document.getElementById('assigned-task').value; // Get task from text field

        const newAttendee = { name, email, contact, event: eventAssigned, task: taskAssigned };

        // Get existing attendees from localStorage
        const attendees = JSON.parse(localStorage.getItem('attendees')) || [];

        // Add the new attendee
        attendees.push(newAttendee);

        // Save back to localStorage
        localStorage.setItem('attendees', JSON.stringify(attendees));

        // Reload the attendee list
        loadAttendees(eventFilter.value);

        // Clear the form and close the modal
        addAttendeeForm.reset();
        addAttendeeModal.classList.add('hidden');
    });

    // Close the modal
    closeModalBtn.addEventListener('click', () => {
        addAttendeeModal.classList.add('hidden');
    });

    // Show the modal
    addAttendeeBtn.addEventListener('click', () => {
        addAttendeeModal.classList.remove('hidden');
    });

    // Event listener for filtering attendees based on the event selected
    eventFilter.addEventListener('change', () => {
        loadAttendees(eventFilter.value);
    });

    // Function to delete an attendee
    window.deleteAttendee = (index) => {
        const attendees = JSON.parse(localStorage.getItem('attendees')) || [];
        attendees.splice(index, 1);
        localStorage.setItem('attendees', JSON.stringify(attendees));
        loadAttendees(eventFilter.value);
    };

    // Initial load of attendees
    loadAttendees();

    // Function to load event names into the event dropdown and filter dropdown
    function loadEventNames() {
        const events = ["Tech Conference", "Technovate", "Hostel Fest","Musical Fest","Conference"]; 
        const eventDropdown = document.getElementById('assigned-event');
        const eventFilterDropdown = document.getElementById('event-filter');

        eventDropdown.innerHTML = '<option value="">Select Event</option>';
        eventFilterDropdown.innerHTML = '<option value="">All Events</option>';

        events.forEach(event => {
            const option = document.createElement('option');
            option.value = event; // Store event name directly
            option.textContent = event; // Display event name
            eventDropdown.appendChild(option);

            const filterOption = document.createElement('option');
            filterOption.value = event;
            filterOption.textContent = event; // Display event name
            eventFilterDropdown.appendChild(filterOption);
        });
    }

    // Call to load events when the page loads
    loadEventNames();
});
