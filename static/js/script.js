            function checkSpam() {
                const emailInput = document.getElementById('emailInput');
                const resultDiv = document.getElementById('result');
                const emailContent = emailInput.value;

                // Send email content to the backend (Flask) for processing
                fetch('http://127.0.0.1:5000/check_spam', {
                    method: 'POST',
                    headers: {  
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email_content: emailContent
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'spam') {
                        resultDiv.innerHTML = '<img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.svgrepo.com%2Fsvg%2F21214%2Fspam&psig=AOvVaw3gO9gBE48O5eYcDvLMAnk3&ust=1735508426725000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCICfx-22y4oDFQAAAAAdAAAAABAE" alt="Spam"> This email is classified as SPAM! ⚠';
                        resultDiv.className = 'alert alert-danger';
                    } else {
                        resultDiv.innerHTML = '<img src="https://img.icons8.com/color/48/000000/checkmark.png" alt="Ham"> This email is classified as HAM (Not Spam). ✓';
                        resultDiv.className = 'alert alert-success';
                    }
                    resultDiv.style.display = 'block';
                    emailInput.classList.remove('is-invalid');
                })
                .catch(error => {
                    console.error('Error:', error);
                    resultDiv.innerHTML = 'An error occurred. Please try again.';
                    resultDiv.className = 'alert alert-warning';
                    resultDiv.style.display = 'block';
                });
            }


            function handleSignIn(response) {
                const googleToken = response.credential; // Google JWT token
                console.log("Token received:", googleToken);

                // Send the token to your backend for verification
                fetch('http://127.0.0.1:5000/verify_google_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token: googleToken })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert("Error: " + data.error);
                    } else {
                        alert("Welcome " + data.name + " (" + data.email + ")");
                        window.location.href = '/analysis';

                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("An error occurred while verifying the token.");
                });
            }
            document.addEventListener('DOMContentLoaded', () => {
                const trendTableBody = document.querySelector('#chartSection tbody');
            
                // Function to fetch trend data and update the table
                async function fetchAndRenderTrend() {
                    try {
                        // Fetch the trend data from the backend
                        const response = await fetch('/analyze-trend');
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        
                        const data = await response.json();
            
                        // Clear existing table rows
                        trendTableBody.innerHTML = '';
            
                        // Check if trend data exists
                        if (data.trend && Object.keys(data.trend).length > 0) {
                            // Loop through the trend data and create table rows
                            for (const [category, count] of Object.entries(data.trend)) {
                                const row = document.createElement('tr');
                                row.classList.add(category === 'spam' ? 'spam' : 'ham');
                                
                                // Create and append Category cell
                                const categoryCell = document.createElement('td');
                                categoryCell.textContent = category;
                                row.appendChild(categoryCell);
            
                                // Create and append Count cell
                                const countCell = document.createElement('td');
                                countCell.textContent = count;
                                row.appendChild(countCell);
            
                                // Append the row to the table body
                                trendTableBody.appendChild(row);
                            }
                        } else {
                            // If no trend data, display a "No data available" row
                            const noDataRow = document.createElement('tr');
                            const noDataCell = document.createElement('td');
                            noDataCell.colSpan = 2;
                            noDataCell.textContent = 'No data available.';
                            noDataRow.appendChild(noDataCell);
                            trendTableBody.appendChild(noDataRow);
                        }
                    } catch (error) {
                        console.error('Error fetching trend data:', error);
            
                        // Display error in the table
                        trendTableBody.innerHTML = `
                            <tr>
                                <td colspan="2">Error fetching data. Please try again later.</td>
                            </tr>
                        `;
                    }
                }
            
                // Fetch and render the trend data on page load
                fetchAndRenderTrend();
            });
            
            // Call the function to fetch and display the analysis when the page loads
            document.addEventListener('DOMContentLoaded', fetchAnalysis);
