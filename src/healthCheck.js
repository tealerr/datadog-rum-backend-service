export async function healthCheck() {
  const output = document.getElementById("output");

  output.innerHTML = "Calling health endpoint...";

  try {
    const response = await fetch("http://localhost:3000/api/health");

    const data = await response.json();

    output.innerHTML = `
      <h3>Health Check Success</h3>
      <p>Status: ${response.status}</p>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;

    if (window.DD_RUM) {
      DD_RUM.addAction("health-check-success", {
        status: response.status,
      });
    }
  } catch (error) {
    output.innerHTML = `
      <h3>Health Check Failed</h3>
      <p>${error.message}</p>
    `;

    console.error(error);

    if (window.DD_RUM) {
      DD_RUM.addAction("health-check-failed", {
        message: error.message,
      });
    }
  }
}
