// Touchstone 4: simple favorites and form checks
const bakeryItems = [
  { id: "signature", name: "Signature Bread" },
  { id: "fresh", name: "Fresh Bread" }
];
const storageKey = "bakeryFavorites";

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(saved) ? saved.filter(id => bakeryItems.some(item => item.id === id)) : [];
  } catch (error) {
    return [];
  }
}

function showFavorites() {
  const favorites = loadFavorites();
  const result = document.getElementById("favorites-result");
  if (!result) return;
  const names = bakeryItems.filter(item => favorites.includes(item.id)).map(item => item.name);
  result.textContent = names.length ? "Your saved favorites: " + names.join(", ") : "You have not saved any favorites yet.";
  document.querySelectorAll("[data-favorite]").forEach(button => {
    const saved = favorites.includes(button.dataset.favorite);
    button.textContent = saved ? "Remove from Favorites" : "Add to Favorites";
    button.setAttribute("aria-pressed", String(saved));
  });
}

function toggleFavorite(id) {
  const favorites = loadFavorites();
  const updated = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
  localStorage.setItem(storageKey, JSON.stringify(updated));
  showFavorites();
}

function setupFavorites() {
  const options = document.getElementById("favorite-options");
  if (!options) return;
  bakeryItems.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.favorite = item.id;
    button.setAttribute("aria-label", "Save or remove " + item.name);
    const label = document.createElement("span");
    label.textContent = item.name + ": ";
    const wrapper = document.createElement("div");
    wrapper.append(label, button);
    options.append(wrapper);
    button.addEventListener("click", () => toggleFavorite(item.id));
  });
  document.getElementById("clear-favorites").addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    showFavorites();
  });
  showFavorites();
}

function showError(id, message) {
  const field = document.getElementById(id);
  document.getElementById(id + "-error").textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
}

function checkContactForm(event) {
  event.preventDefault(); // The class project does not send real messages.
  const name = document.getElementById("full-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const topic = document.getElementById("topic").value;
  const message = document.getElementById("message").value.trim();
  const errors = {
    "full-name": name.length < 2 ? "Please enter your name (at least 2 characters)." : "",
    "email": !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Please enter a valid email address." : "",
    "topic": !topic ? "Please choose a topic." : "",
    "message": message.length < 10 ? "Please write at least 10 characters." : ""
  };
  Object.keys(errors).forEach(id => showError(id, errors[id]));
  const firstBad = Object.keys(errors).find(id => errors[id]);
  const result = document.getElementById("form-result");
  if (firstBad) {
    result.textContent = "Please fix the highlighted fields and try again.";
    document.getElementById(firstBad).focus();
  } else {
    result.textContent = "Your message looks good! This is a class demo, so it was not sent.";
  }
}

function setupForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", checkContactForm);
  ["full-name", "email", "topic", "message"].forEach(id => {
    const field = document.getElementById(id);
    field.setAttribute("aria-describedby", id + "-error");
    field.addEventListener("input", () => showError(id, ""));
    field.addEventListener("change", () => showError(id, ""));
  });
}

setupFavorites();
setupForm();
