
const leaveForm = document.getElementById('leaveForm');
const leaveList = document.getElementById('leaveList');

// Allow today and future dates only
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

function setMinimumDates() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    startDateInput.min = today;
    endDateInput.min = today;
}

startDateInput.addEventListener('change', () => {
    endDateInput.min = startDateInput.value || getToday();
});

function getToday() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

setMinimumDates();

async function loadLeaves() {
    try {
        const response = await fetch('/api/leaves');
        const leaves = await response.json();

        leaveList.replaceChildren();

        if (!response.ok) {
            throw new Error('Could not load leave applications');
        }

        if (leaves.length === 0) {
            leaveList.textContent = 'No leave applications yet.';
            return;
        }

        leaves.forEach((leave) => {
            const card = document.createElement('div');
            card.className = 'leave-card';

            const heading = document.createElement('h3');
            heading.textContent = leave.name;

            const details = document.createElement('p');
            details.textContent =
                `Type: ${leave.leaveType} | From: ${leave.startDate} | To: ${leave.endDate}`;

            const reason = document.createElement('p');
            reason.textContent = `Reason: ${leave.reason}`;

            const status = document.createElement('p');
            status.textContent = `Status: ${leave.status}`;

            card.append(heading, details, reason, status);

            if (leave.status === 'Pending') {
                const approve = document.createElement('button');
                approve.textContent = 'Approve';
                approve.addEventListener('click', () =>
                    updateLeaveStatus(leave._id, 'Approved')
                );

                const reject = document.createElement('button');
                reject.textContent = 'Reject';
                reject.addEventListener('click', () =>
                    updateLeaveStatus(leave._id, 'Rejected')
                );

                card.append(approve, reject);
            }

            leaveList.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        leaveList.textContent = 'Unable to load leave applications.';
    }
}

leaveForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (endDateInput.value < startDateInput.value) {
        alert('End date cannot be before start date.');
        return;
    }

    const data = {
        name: document.getElementById('name').value.trim(),
        leaveType: document.getElementById('leaveType').value,
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        reason: document.getElementById('reason').value.trim()
    };

    try {
        const response = await fetch('/api/leaves', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to submit application');
        }

        alert('Leave application submitted successfully!');
        leaveForm.reset();
        setMinimumDates();
        loadLeaves();
    } catch (error) {
        alert(error.message);
    }
});

async function updateLeaveStatus(id, status) {
    try {
        const response = await fetch(`/api/leaves/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Unable to update status');
        }

        alert(`Leave status updated to ${status}`);
        loadLeaves();
    } catch (error) {
        alert(error.message);
    }
}

loadLeaves();
