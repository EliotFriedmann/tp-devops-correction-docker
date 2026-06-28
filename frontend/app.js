const statusEl = document.querySelector("#status");
const studentsEl = document.querySelector("#students");
const departmentsEl = document.querySelector("#departments");
const refreshButton = document.querySelector("#refresh");

async function fetchJson(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`${path} a repondu avec le statut ${response.status}`);
  }

  return response.json();
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

function renderStudents(students) {
  if (!students.length) {
    studentsEl.innerHTML = '<p class="muted">Aucun etudiant trouve.</p>';
    return;
  }

  studentsEl.innerHTML = students
    .map((student) => {
      const firstname = student.firstname || "";
      const lastname = student.lastname || "";
      const department = student.department?.name || "Sans departement";

      return `
        <div class="item">
          <strong>${firstname} ${lastname}</strong>
          <span class="muted">${department}</span>
        </div>
      `;
    })
    .join("");
}

function renderDepartments(departments) {
  if (!departments.length) {
    departmentsEl.innerHTML = '<p class="muted">Aucun departement trouve.</p>';
    return;
  }

  departmentsEl.innerHTML = departments
    .map((department) => `
      <div class="item">
        <strong>${department.name}</strong>
        <span class="muted">Departement #${department.id}</span>
      </div>
    `)
    .join("");
}

async function loadData() {
  setStatus("Chargement...");

  try {
    const [students, departments] = await Promise.all([
      fetchJson("/api/students"),
      fetchJson("/api/departments"),
    ]);

    renderStudents(students);
    renderDepartments(departments);
    setStatus("Donnees chargees.");
  } catch (error) {
    studentsEl.innerHTML = "";
    departmentsEl.innerHTML = "";
    setStatus(error.message, true);
  }
}

refreshButton.addEventListener("click", loadData);
loadData();
