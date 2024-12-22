document.addEventListener('DOMContentLoaded', async () => {
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

            // Set the attendee count (We no longer have the element, but let's keep it for potential future use)
            const attendeeCount = data.attendees?.length || 0; // Corrected optional chaining
            // document.getElementById('attendee-count').textContent = attendeeCount; // Remove this line if not used

        } else {
            throw new Error(data.message || 'Error fetching profile');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    updateEventCountDisplay();
});

function updateEventCountDisplay() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const eventCount = events.length; // Count of events
    document.getElementById('event-count').textContent = eventCount;

    const totalEvents = 10;
    const eventProgress = (eventCount / totalEvents) * 100;
    const eventProgressCircle = document.querySelector('#event-progress .circle-progress');
    const eventProgressOffset = 100 - eventProgress;
    eventProgressCircle.style.strokeDashoffset = eventProgressOffset;
}
