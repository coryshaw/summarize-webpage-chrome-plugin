document.getElementById("save").addEventListener("click", function () {
  var apiKey = document.getElementById("apiKey").value;
  localStorage.setItem("apiKey", apiKey);
  alert("API Key saved!");
});
