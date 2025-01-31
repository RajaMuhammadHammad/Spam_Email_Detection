// Function to render the chart for spam and ham percentages
function renderChart(spamCount, hamCount) {
    const ctx = document.getElementById('spamChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Spam', 'Ham'],
            datasets: [{
                label: 'Email Classification',
                data: [spamCount, hamCount],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Fetch email data and display analysis
fetch('http://127.0.0.1:5000/fetch_emails')
    .then(response => response.json())
    .then(data => {
        // Update the summary with counts and percentages
        document.getElementById('spamCount').textContent = 'Spam Count: ' + data.spam_count;
        document.getElementById('hamCount').textContent = 'Ham Count: ' + data.ham_count;
        document.getElementById('spamPercentage').textContent = 'Spam Percentage: ' + data.spam_percentage.toFixed(2) + '%';
        document.getElementById('hamPercentage').textContent = 'Ham Percentage: ' + data.ham_percentage.toFixed(2) + '%';

        // Render the pie chart
        renderChart(data.spam_percentage, data.ham_percentage);

        // Display email details in a table
        const emailTableBody = document.getElementById('emailTableBody');
        emailTableBody.innerHTML = ''; // Clear the table

        data.emails.forEach(email => {
            const row = document.createElement('tr');
            const subjectCell = document.createElement('td');
            const typeCell = document.createElement('td');
            
            subjectCell.textContent = email.subject;
            typeCell.textContent = email.type;

            row.appendChild(subjectCell);
            row.appendChild(typeCell);
            emailTableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Error fetching email analysis:', error);
        alert('An error occurred while fetching the email data.');
    });
