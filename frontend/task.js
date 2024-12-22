document.addEventListener('DOMContentLoaded', () => {
    const taskListBody = document.getElementById('task-list-body');
    const noTasksMessage = document.getElementById('no-tasks-message');

    // Load the attendees and their assigned tasks
    const loadTasks = () => {
        const attendees = JSON.parse(localStorage.getItem('attendees')) || [];
        taskListBody.innerHTML = ''; // Clear existing task rows
        let hasTasks = false;

        attendees.forEach((attendee, index) => {
            if (attendee.task) { // Only include those who have tasks assigned
                hasTasks = true;
                const row = document.createElement('tr');
                row.classList.add('task-row');
                row.innerHTML = `
                    <td>${attendee.name}</td>
                    <td>${attendee.event}</td>
                    <td>${attendee.task}</td>
                    <td>
                        <input type="date" class="task-deadline" value="${attendee.deadline || ''}" data-index="${index}">
                    </td>
                    <td>
                        <select class="task-status" data-index="${index}">
                            <option value="Pending" ${attendee.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Completed" ${attendee.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </td>
                    <td>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${attendee.status === 'Completed' ? '100%' : '0%'};"></div>
                        </div>
                    </td>
                    <td>
                        <button class="update-task-btn" data-index="${index}">Update</button>
                    </td>
                `;
                taskListBody.appendChild(row);
            }
        });

        // Show/hide the "no tasks" message based on whether tasks exist
        if (hasTasks) {
            noTasksMessage.style.display = 'none';
        } else {
            noTasksMessage.style.display = 'block';
        }
    };

    // Handle task updates
    taskListBody.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('update-task-btn')) {
            const index = e.target.getAttribute('data-index');
            const deadline = document.querySelector(`.task-deadline[data-index="${index}"]`).value;
            const status = document.querySelector(`.task-status[data-index="${index}"]`).value;

            const attendees = JSON.parse(localStorage.getItem('attendees')) || [];
            attendees[index].deadline = deadline;
            attendees[index].status = status;

            // Update the attendees array in localStorage
            localStorage.setItem('attendees', JSON.stringify(attendees));

            // Add animation class for row update
            const row = e.target.closest('tr');
            row.classList.add('task-row-updated');

            // Reload the tasks list to reflect changes
            setTimeout(() => {
                loadTasks();
            }, 300); // Wait for animation to finish before reloading
        }
    });

    // Initial load of tasks
    loadTasks();
});
