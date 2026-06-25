export function log(message) {
  document.getElementById("output").innerHTML = "<p>" + message + "</p>";
}

export function normalClick() {
  log("Normal button clicked");

  // ถ้าติดตั้ง RUM แล้ว
  if (window.DD_RUM) {
    DD_RUM.addAction("normal-click");
  }
}

export function throwError() {
  log("Throwing JS error...");

  setTimeout(() => {
    nonExistingFunction();
  }, 100);
}

export async function successApi() {
  log("Calling success API...");

  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");

  const data = await response.json();

  log("Success API: " + JSON.stringify(data, null, 2));
}

export async function failApi() {
  log("Calling failed API...");

  try {
    await fetch("https://this-api-does-not-exist-12345.com");
  } catch (err) {
    console.error(err);
    log("API Failed");
  }
}

export function freezeUI() {
  log("Freezing UI for 5 seconds...");

  const start = Date.now();

  while (Date.now() - start < 5000) {
    // block main thread
  }

  log("UI Unfrozen");
}

export function changeRoute() {
  const route = "/page-" + Math.floor(Math.random() * 100);

  history.pushState({}, "", route);

  log("Route changed to: " + route);
}

document.getElementById("username").addEventListener("input", (e) => {
  console.log("Input changed:", e.target.value);
});

window.addEventListener("load", () => {
  console.log("Page Loaded");
});
