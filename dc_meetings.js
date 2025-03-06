document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('close-btn');
    const meetingForm = document.getElementById('meeting-form');
    const meetingsList = document.getElementById('meetings-list');

    menuBtn.addEventListener('click', function() {
        sidebar.style.width = '250px';
    });

    closeBtn.addEventListener('click', function() {
        sidebar.style.width = '0';
    });

    meetingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const date = document.getElementById('meeting-date').value;
        const file = document.getElementById('minutes-file').files[0];
        const summary = document.getElementById('meeting-summary').value;

        // Here you would typically send this data to a server
        // For this example, we'll just add it to the list
        addMeetingToList(date, file.name, summary);

        meetingForm.reset();
    });

    function addMeetingToList(date, fileName, summary) {
        const meetingItem = document.createElement('div');
        meetingItem.classList.add('meeting-item');
        meetingItem.innerHTML = `
            <h3>Meeting on ${date}</h3>
            <p>Minutes file: ${fileName}</p>
            <p>${summary}</p>
        `;
        meetingsList.appendChild(meetingItem);
    }
});
