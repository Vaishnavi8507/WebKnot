document.addEventListener('DOMContentLoaded', async() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('You must log in first!');
        window.location.href = '/'; // Redirect to login page
        return;
    }

    try {
        const response = await fetch('/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Set the username in the welcome message
            document.getElementById('user-name').textContent = data.user.name;

            // Set the event and attendee counts
            const eventCount = data.events ?.length || 0; // Corrected optional chaining
            const attendeeCount = data.attendees ?.length || 0; // Corrected optional chaining

            document.getElementById('event-count').textContent = eventCount;
            document.getElementById('attendee-count').textContent = attendeeCount;

            // Update circular progress indicators
            const totalEvents = 10; // Maximum number of events
            const totalAttendees = 100; // Maximum number of attendees

            const eventProgress = (eventCount / totalEvents) * 100;
            const attendeeProgress = (attendeeCount / totalAttendees) * 100;

            // Update event progress
            const eventProgressCircle = document.querySelector('#event-progress .circle-progress');
            const eventProgressOffset = 100 - eventProgress; // Stroke dash offset calculation
            eventProgressCircle.style.strokeDashoffset = eventProgressOffset;

            // Update attendee progress
            const attendeeProgressCircle = document.querySelector('#attendee-progress .circle-progress');
            const attendeeProgressOffset = 100 - attendeeProgress; // Stroke dash offset calculation
            attendeeProgressCircle.style.strokeDashoffset = attendeeProgressOffset;

        } else {
            alert(data.message); // Handle errors like token expiry
            localStorage.removeItem('authToken'); // Remove invalid token
            window.location.href = '/'; // Redirect to login page
        }
    } catch (error) {
        alert('Error fetching user data: ' + error.message);
        window.location.href = '/'; // Redirect to login page on error
    }

    // Function to update the event count display
    function updateEventCountDisplay() {
        const eventCountElement = document.getElementById('eventCount');
        const eventCount = Number(localStorage.getItem('eventCount')) || 0; // Convert to number
        eventCountElement.textContent = eventCount; // Update the display
    }

    // Call the function to update the count
    updateEventCountDisplay();
});