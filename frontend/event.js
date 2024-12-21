// Get DOM elements
const timeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const createEventBtn = document.querySelector('.create-event');
const createModal = document.getElementById('eventModal');
const updateModal = document.getElementById('updateModal');
const statusModal = document.getElementById('statusModal');
const closeBtns = document.querySelectorAll('.close');
const eventForm = document.getElementById('eventForm');
const updateForm = document.getElementById('updateForm');
const statusForm = document.getElementById('statusForm');
const eventContainer = document.getElementById('eventContainer');
let currentEventCard = null;
let currentStatusCard = null;
let events = []; // Array to store all events

// Function to validate event date
function validateEventDate(dateInput, errorDiv) {
    const selectedDate = new Date(dateInput.value);
    const now = new Date();
    const errorElement = errorDiv || dateInput.parentElement.querySelector('.date-error');

    if (selectedDate <= now) {
        errorElement.style.display = 'block';
        dateInput.setCustomValidity('Please select a future date and time');
        return false;
    } else {
        errorElement.style.display = 'none';
        dateInput.setCustomValidity('');
        return true;
    }
}

function getRelativeTime(timestamp) {
    if (!timestamp || isNaN(timestamp)) {
        return '';
    }

    const now = Date.now();
    const diffInMilliseconds = now - timestamp;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    if (diffInSeconds < 3600) { // Less than 1 hour
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) { // Less than 1 day
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else { // Days
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
}

// Function to load events from localStorage
function loadEvents() {
    const savedEvents = localStorage.getItem('events');
    eventContainer.innerHTML = '';

    if (savedEvents) {
        events = JSON.parse(savedEvents);
        events.sort((a, b) => b.createdAt - a.createdAt);

        events.forEach(eventData => {
            const eventCard = createEventCard(eventData);
            eventContainer.insertAdjacentHTML('beforeend', eventCard);
        });
    }
}

// Function to save events to localStorage
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
    updateEventCount(); // Update the event count in local storage
}

// Show create modal
createEventBtn.onclick = () => {
    createModal.style.display = "block";
}

// Close modals
closeBtns.forEach(btn => {
    btn.onclick = () => {
        createModal.style.display = "none";
        updateModal.style.display = "none";
        statusModal.style.display = "none";
    }
});

// Close modals when clicking outside
window.onclick = (e) => {
    if (e.target == createModal || e.target == updateModal || e.target == statusModal) {
        createModal.style.display = "none";
        updateModal.style.display = "none";
        statusModal.style.display = "none";
    }
}

// Add event listeners for date inputs
document.getElementById('eventDate').addEventListener('change', function() {
    validateEventDate(this);
});

document.getElementById('updateEventDate').addEventListener('change', function() {
    validateEventDate(this);
});

// Handle create form submission
eventForm.onsubmit = async(e) => {
    e.preventDefault();

    const dateInput = document.getElementById('eventDate');
    if (!validateEventDate(dateInput)) {
        return;
    }

    const imageFile = document.getElementById('eventImage').files[0];
    const imageBase64 = imageFile ? await convertToBase64(imageFile) : '';
    const currentTime = Date.now();

    const newEvent = {
        id: currentTime,
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        location: document.getElementById('eventLocation').value,
        attendees: document.getElementById('eventAttendees').value,
        image: imageBase64,
        status: 'pending',
        createdAt: currentTime
    };

    events.unshift(newEvent);
    saveEvents();
    loadEvents();
    showToast('Event created successfully! 🎉');

    eventForm.reset();
    createModal.style.display = "none";
}

// Handle update form submission
updateForm.onsubmit = async(e) => {
    e.preventDefault();

    const dateInput = document.getElementById('updateEventDate');
    if (!validateEventDate(dateInput)) {
        return;
    }

    const eventId = Number(updateForm.dataset.eventId);
    const eventIndex = events.findIndex(event => event.id === eventId);

    if (eventIndex !== -1) {
        const originalEvent = events[eventIndex];

        const updatedEvent = {
            ...originalEvent,
            name: document.getElementById('updateEventName').value,
            date: document.getElementById('updateEventDate').value,
            location: document.getElementById('updateEventLocation').value,
            attendees: document.getElementById('updateEventAttendees').value
        };

        const newImage = document.getElementById('updateEventImage').files[0];
        if (newImage) {
            try {
                updatedEvent.image = await convertToBase64(newImage);
            } catch (error) {
                console.error('Error updating image:', error);
                updatedEvent.image = originalEvent.image;
            }
        }

        events[eventIndex] = updatedEvent;
        saveEvents();
        loadEvents();
        showToast('Event updated successfully! ✨');
    }

    updateModal.style.display = "none";
    updateForm.reset();
    delete updateForm.dataset.eventId;
}

// Handle status form submission
statusForm.onsubmit = (e) => {
    e.preventDefault();

    if (currentStatusCard) {
        const eventId = Number(currentStatusCard.dataset.eventId);
        const eventIndex = events.findIndex(event => event.id === eventId);
        const newStatus = statusForm.querySelector('input[name="status"]:checked').value;

        if (eventIndex !== -1) {
            events[eventIndex].status = newStatus;
            saveEvents();
            loadEvents();

            if (newStatus === 'completed') {
                showToast('Event marked as completed! 🎉');
            } else {
                showToast('Event status updated to pending! 🕒');
            }
        }
    }

    statusModal.style.display = 'none';
    currentStatusCard = null;
}

// Function to create event card HTML
function createEventCard(eventData) {
    const formattedDate = new Date(eventData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const timestamp = typeof eventData.createdAt === 'string' ?
        parseInt(eventData.createdAt) :
        eventData.createdAt;
    const timeAgo = getRelativeTime(timestamp);
    const statusBadge = eventData.status === 'completed' ?
        '<span class="status-badge status-completed">✅ Completed</span>' :
        '<span class="status-badge status-pending">🕒 Pending</span>';

    return `
        <div class="event-card" data-event-id="${eventData.id}" data-created="${eventData.createdAt}">
            <div class="card-header">
                <div class="profile-info">
                    <div>👤</div>
                    <div>
                        <p class="name">Event Organizer ${statusBadge}</p>
                        <p class="time">${timeAgo}</p>
                    </div>
                </div>
                <div class="menu-dropdown">
                    <div class="menu-icon">⋮</div>
                    <div class="dropdown-content">
                        <button class="update-btn">
                            ✏️ Update
                        </button>
                        <button class="status-btn">
                            📊 Status
                        </button>
                        <button class="delete-btn">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
            <img src="${eventData.image || 'placeholder.jpg'}" alt="Event" class="event-image">
            <div class="event-details">
                <h4>${eventData.name}</h4>
                <div class="event-info">
                    <p><strong>📅 Date:</strong> ${formattedDate}</p>
                    <p><strong>📍 Location:</strong> ${eventData.location}</p>
                    <p><strong>👥 Expected Attendees:</strong> ${eventData.attendees}</p>
                </div>
            </div>
        </div>
    `;
}

// Handle menu interactions
document.addEventListener('click', function(e) {
    if (!e.target.matches('.menu-icon')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    if (e.target.matches('.menu-icon')) {
        const dropdown = e.target.nextElementSibling;
        dropdown.classList.toggle('show');
    }

    if (e.target.matches('.update-btn')) {
        const eventCard = e.target.closest('.event-card');
        if (eventCard) {
            showUpdateModal(eventCard);
        }
    }

    if (e.target.matches('.status-btn')) {
        currentStatusCard = e.target.closest('.event-card');
        const eventId = Number(currentStatusCard.dataset.eventId);
        const event = events.find(event => event.id === eventId);

        const radioButtons = statusForm.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.checked = radio.value === (event.status || 'pending');
        });

        statusModal.style.display = 'block';
    }

    if (e.target.matches('.delete-btn')) {
        if (confirm('Are you sure you want to delete this event?')) {
            const eventCard = e.target.closest('.event-card');
            const eventId = Number(eventCard.dataset.eventId);
            events = events.filter(event => event.id !== eventId);
            saveEvents();
            loadEvents();
            showToast('Event deleted successfully! 🗑️');
        }
    }
});

// Function to show update modal
function showUpdateModal(eventCard) {
    const eventId = Number(eventCard.dataset.eventId);
    const event = events.find(event => event.id === eventId);

    if (event) {
        updateForm.dataset.eventId = eventId;
        document.getElementById('updateEventName').value = event.name;
        document.getElementById('updateEventDate').value = event.date;
        document.getElementById('updateEventLocation').value = event.location;
        document.getElementById('updateEventAttendees').value = event.attendees;
        updateModal.style.display = 'block';
    }
}

// Function to show toast notifications
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
        toast.remove();
    }, 3000);
}

// Utility function to convert image to base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Function to update all times
function updateAllTimes() {
    document.querySelectorAll('.event-card').forEach(card => {
        const timestamp = parseInt(card.dataset.created);
        const timeElement = card.querySelector('.time');
        if (timeElement && timestamp) {
            timeElement.textContent = getRelativeTime(timestamp);
        }
    });
}

// Function to update the event count in local storage
function updateEventCount() {
    const eventCount = events.length; // Get the current number of events
    localStorage.setItem('eventCount', eventCount); // Store in local storage
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Set min datetime for date inputs to current time
    const now = new Date();
    const nowStr = now.toISOString().slice(0, 16);
    document.getElementById('eventDate').min = nowStr;
    document.getElementById('updateEventDate').min = nowStr;

    loadEvents();
    updateAllTimes();
    setInterval(updateAllTimes, 60000);
});