const today = "2026-06-28";
const dataKey = "katsaras-praxis-data-v1";
const mediaDbName = "med-assistant-media";
const mediaStoreName = "files";
const maxStoredFileBytes = 20 * 1024 * 1024;

const seedData = {
  patients: [
    {
      id: "p-1001",
      name: "Eleni Papadopoulos",
      age: 58,
      phone: "+30 210 555 0141",
      risk: "High",
      diagnosis: "Type 2 diabetes, hypertension",
      allergies: "Penicillin",
      medication: "Metformin, ramipril",
      notes: "HbA1c zuletzt erhöht. Medikamentenadhärenz und Fußstatus kontrollieren.",
      exams: [
        { name: "HbA1c", date: "2026-06-18", result: "8.4%", status: "Review" },
        { name: "EKG", date: "2026-05-30", result: "Sinusrhythmus", status: "Done" }
      ],
      visits: [
        { date: "2026-06-28", time: "09:00", type: "Kontrolle", reason: "Blutzuckerkontrolle", plan: "Ernährungsplan anpassen, Labor in 6 Wochen wiederholen." },
        { date: "2026-05-21", time: "10:30", type: "Beratung", reason: "Müdigkeit", plan: "Blutdruckprotokoll begonnen." }
      ],
      tasks: [
        { title: "HbA1c-Befund telefonisch besprechen", due: "Heute", priority: "High", done: false },
        { title: "Diabetologische Augenuntersuchung planen", due: "Diese Woche", priority: "Moderate", done: false }
      ]
    },
    {
      id: "p-1002",
      name: "Nikos Antoniou",
      age: 42,
      phone: "+30 210 555 0198",
      risk: "Moderate",
      diagnosis: "Asthma",
      allergies: "Dust mites",
      medication: "Budesonide/formoterol",
      notes: "Gute Kontrolle, berichtet saisonale Beschwerden. Inhalationstechnik prüfen.",
      exams: [
        { name: "Spirometrie", date: "2026-06-12", result: "FEV1 78%", status: "Done" }
      ],
      visits: [
        { date: "2026-06-28", time: "11:30", type: "Beratung", reason: "Pfeifende Atmung", plan: "Asthma-Aktionsplan überprüfen." }
      ],
      tasks: [
        { title: "Inhalator-Rezept erneuern", due: "Morgen", priority: "Moderate", done: false }
      ]
    },
    {
      id: "p-1003",
      name: "Maria Georgiou",
      age: 31,
      phone: "+30 210 555 0133",
      risk: "Stable",
      diagnosis: "Migraine",
      allergies: "Keine bekannt",
      medication: "Sumatriptan as needed",
      notes: "Trigger nach Schlafanpassung gebessert. Kopfschmerztagebuch fortführen.",
      exams: [
        { name: "MRT Schädel", date: "2026-04-18", result: "Kein akuter Befund", status: "Done" }
      ],
      visits: [
        { date: "2026-06-30", time: "16:00", type: "Videosprechstunde", reason: "Medikationskontrolle", plan: "Frequenz und Nebenwirkungen beurteilen." }
      ],
      tasks: [
        { title: "Kopfschmerztagebuch prüfen", due: "30. Juni", priority: "Low", done: false }
      ]
    },
    {
      id: "p-1004",
      name: "Andreas Markou",
      age: 67,
      phone: "+30 210 555 0174",
      risk: "High",
      diagnosis: "Coronary artery disease",
      allergies: "Ibuprofen",
      medication: "Atorvastatin, aspirin, bisoprolol",
      notes: "Thorakales Druckgefühl letzte Woche. Belastungstest-Befund aus der Kardiologie ausstehend.",
      exams: [
        { name: "Belastungstest", date: "2026-06-25", result: "Ausstehend", status: "Pending" }
      ],
      visits: [
        { date: "2026-07-01", time: "12:15", type: "Befundbesprechung", reason: "Belastungstest-Befund", plan: "Mit Kardiologie abstimmen." }
      ],
      tasks: [
        { title: "Kardiologiebericht anfordern", due: "Heute", priority: "High", done: false }
      ]
    }
  ]
};

let data = loadData();
let selectedPatientId = data.patients[0]?.id;
let activeView = "dashboard";
let calendarCursor = new Date(`${today}T00:00:00`);

const els = {
  pageTitle: document.querySelector("#page-title"),
  search: document.querySelector("#search-input"),
  riskFilter: document.querySelector("#risk-filter"),
  patientGrid: document.querySelector("#patient-grid"),
  patientDetail: document.querySelector("#patient-detail"),
  selectedName: document.querySelector("#selected-name"),
  selectedRisk: document.querySelector("#selected-risk"),
  todayList: document.querySelector("#today-list"),
  taskList: document.querySelector("#task-list"),
  allTasks: document.querySelector("#all-tasks"),
  snapshot: document.querySelector("#snapshot"),
  calendarGrid: document.querySelector("#calendar-grid"),
  calendarTitle: document.querySelector("#calendar-title"),
  visitPatient: document.querySelector("#visit-patient"),
  taskPatient: document.querySelector("#task-patient"),
  taskStatusFilter: document.querySelector("#task-status-filter"),
  taskPriorityFilter: document.querySelector("#task-priority-filter"),
  taskPatientFilter: document.querySelector("#task-patient-filter"),
  patientDialog: document.querySelector("#patient-dialog"),
  visitDialog: document.querySelector("#visit-dialog"),
  taskDialog: document.querySelector("#task-dialog"),
  examDialog: document.querySelector("#exam-dialog"),
  patientForm: document.querySelector("#patient-form"),
  visitForm: document.querySelector("#visit-form"),
  taskForm: document.querySelector("#task-form"),
  examForm: document.querySelector("#exam-form")
};

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelector("#new-patient-btn").addEventListener("click", () => els.patientDialog.showModal());
document.querySelector("#quick-visit-btn").addEventListener("click", openVisitDialog);
document.querySelector("#new-appointment-btn").addEventListener("click", openVisitDialog);
document.querySelector("#prev-month-btn").addEventListener("click", () => moveCalendarMonth(-1));
document.querySelector("#today-month-btn").addEventListener("click", () => {
  calendarCursor = new Date(`${today}T00:00:00`);
  renderCalendar();
});
document.querySelector("#next-month-btn").addEventListener("click", () => moveCalendarMonth(1));
document.querySelector("#new-task-btn").addEventListener("click", () => openTaskDialog());
document.querySelector("#export-btn").addEventListener("click", exportData);
els.search.addEventListener("input", render);
els.riskFilter.addEventListener("change", renderPatients);
els.taskStatusFilter.addEventListener("change", renderTasks);
els.taskPriorityFilter.addEventListener("change", renderTasks);
els.taskPatientFilter.addEventListener("change", renderTasks);

els.patientForm.addEventListener("submit", async (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const form = new FormData(els.patientForm);
  const photoFile = form.get("photo");
  let photo = null;
  try {
    photo = photoFile?.size ? await readStoredFile(photoFile) : null;
  } catch {
    return;
  }
  const patient = {
    id: `p-${Date.now()}`,
    name: form.get("name").trim(),
    age: Number(form.get("age")),
    phone: form.get("phone").trim(),
    risk: form.get("risk"),
    diagnosis: form.get("diagnosis").trim(),
    medication: form.get("medication").trim() || "Nicht dokumentiert",
    allergies: form.get("allergies").trim() || "Keine bekannt",
    notes: form.get("notes").trim() || "Noch keine Notizen.",
    photo,
    exams: [],
    visits: [],
    tasks: [{ id: `t-${Date.now()}-intake`, title: "Aufnahme prüfen", due: "Heute", priority: "Moderate", notes: "", done: false }]
  };
  data.patients.unshift(patient);
  selectedPatientId = patient.id;
  saveData();
  els.patientForm.reset();
  els.patientDialog.close();
  render();
});

els.visitForm.addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const form = new FormData(els.visitForm);
  const patient = findPatient(form.get("patientId"));
  patient.visits.push({
    date: form.get("date"),
    time: form.get("time"),
    type: form.get("type"),
    reason: form.get("reason").trim(),
    plan: form.get("plan").trim() || "Plan wird ergänzt."
  });
  selectedPatientId = patient.id;
  saveData();
  els.visitForm.reset();
  els.visitDialog.close();
  render();
});

els.taskForm.addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const form = new FormData(els.taskForm);
  const patient = findPatient(form.get("patientId"));
  if (!patient) return;
  patient.tasks.unshift({
    id: `t-${Date.now()}`,
    title: form.get("title").trim(),
    due: form.get("due").trim(),
    priority: form.get("priority"),
    notes: form.get("notes").trim(),
    done: false,
    createdAt: new Date().toISOString()
  });
  selectedPatientId = patient.id;
  saveData();
  els.taskForm.reset();
  els.taskDialog.close();
  setView("tasks");
});

els.examForm.addEventListener("submit", async (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault();
  const patient = findPatient(selectedPatientId);
  if (!patient) return;
  const form = new FormData(els.examForm);
  const file = form.get("file");
  let storedFile = null;
  try {
    storedFile = file?.size ? await readStoredFile(file) : null;
  } catch {
    return;
  }
  patient.exams.unshift({
    id: makeId("exam"),
    name: form.get("name").trim(),
    date: form.get("date"),
    status: form.get("status"),
    result: form.get("result").trim(),
    file: storedFile
  });
  saveData();
  els.examForm.reset();
  els.examDialog.close();
  render();
});

render();

function loadData() {
  const saved = localStorage.getItem(dataKey);
  return normalizeData(saved ? JSON.parse(saved) : structuredClone(seedData));
}

function saveData() {
  localStorage.setItem(dataKey, JSON.stringify(data));
}

function setView(view) {
  activeView = view;
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  document.querySelectorAll(".view").forEach((section) => section.classList.toggle("active-view", section.id === `view-${view}`));
  const titles = {
    dashboard: "Antonios Katsaras Praxis",
    patients: "Patienten",
    calendar: "Kalender",
    tasks: "Praxisaufgaben"
  };
  els.pageTitle.textContent = titles[view];
  render();
}

function render() {
  renderStats();
  renderVisitOptions();
  renderTaskOptions();
  renderPatients();
  renderSelectedPatient();
  renderToday();
  renderTasks();
  renderCalendar();
  hydrateStoredMedia();
}

function renderStats() {
  const visitsToday = data.patients.flatMap((patient) => patient.visits).filter((visit) => visit.date === today).length;
  const pending = data.patients.flatMap((patient) => patient.exams).filter((exam) => exam.status === "Pending" || exam.status === "Review").length;
  const high = data.patients.filter((patient) => patient.risk === "High").length;
  document.querySelector("#stat-patients").textContent = data.patients.length;
  document.querySelector("#stat-visits").textContent = visitsToday;
  document.querySelector("#stat-results").textContent = pending;
  document.querySelector("#stat-priority").textContent = high;
}

function renderPatients() {
  const query = els.search.value.trim().toLowerCase();
  const risk = els.riskFilter.value;
  const patients = data.patients.filter((patient) => {
    const haystack = [patient.name, patient.diagnosis, patient.medication, patient.notes, patient.exams.map((exam) => `${exam.name} ${exam.file?.name || ""}`).join(" ")].join(" ").toLowerCase();
    return (!query || haystack.includes(query)) && (risk === "all" || patient.risk === risk);
  });

  els.patientGrid.innerHTML = patients.map((patient) => `
    <article class="patient-card">
      <div class="patient-card-header">
        <div class="patient-title">
          ${avatarTemplate(patient)}
          <div>
            <h3>${escapeHtml(patient.name)}</h3>
            <p class="meta">${patient.age} Jahre · ${escapeHtml(patient.phone)}</p>
          </div>
        </div>
        <span class="risk-badge ${patient.risk}">${riskLabel(patient.risk)}</span>
      </div>
      <p><strong>${escapeHtml(patient.diagnosis)}</strong></p>
      <p class="meta">${escapeHtml(patient.notes)}</p>
      <div class="card-meta-row">
        <span class="tag">${patientFileCount(patient)} Dateien</span>
        <span class="tag">${patient.exams.length} Befunde</span>
      </div>
      <button class="button secondary" type="button" data-select="${patient.id}">Akte öffnen</button>
    </article>
  `).join("") || `<p class="empty-state">Keine passenden Patienten gefunden.</p>`;

  els.patientGrid.querySelectorAll("[data-select]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPatientId = button.dataset.select;
      setView("dashboard");
    });
  });
}

function renderSelectedPatient() {
  const patient = findPatient(selectedPatientId) || data.patients[0];
  if (!patient) {
    els.patientDetail.innerHTML = "Noch keine Patienten.";
    return;
  }
  selectedPatientId = patient.id;
  els.selectedName.textContent = patient.name;
  els.selectedRisk.textContent = riskLabel(patient.risk);
  els.selectedRisk.className = `risk-badge ${patient.risk}`;

  const latestVisit = [...patient.visits].sort(sortByDateTime).at(-1);
  const pendingExam = patient.exams.find((exam) => exam.status === "Pending" || exam.status === "Review");
  const files = patientFiles(patient);
  els.patientDetail.classList.remove("empty-state");
  els.patientDetail.innerHTML = `
    <div class="patient-header">
      <div class="patient-title">
        ${avatarTemplate(patient, "large")}
        <div>
          <h3>${escapeHtml(patient.name)}</h3>
          <p class="meta">${patient.age} Jahre · ${escapeHtml(patient.phone)}</p>
        </div>
      </div>
      <div class="record-actions">
        <button class="button secondary" type="button" id="add-exam-selected">Befunddatei</button>
        <button class="button primary" type="button" id="add-visit-selected">Termin</button>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-box"><span>Diagnose</span><strong>${escapeHtml(patient.diagnosis)}</strong></div>
      <div class="detail-box"><span>Medikation</span><strong>${escapeHtml(patient.medication)}</strong></div>
      <div class="detail-box"><span>Allergien</span><strong>${escapeHtml(patient.allergies)}</strong></div>
    </div>
    <section>
      <h3>Klinische Notizen</h3>
      <p>${escapeHtml(patient.notes)}</p>
    </section>
    <section>
      <h3>Letzter Termin</h3>
      ${latestVisit ? visitTemplate(latestVisit, patient, false) : `<p class="empty-state">Keine Termine dokumentiert.</p>`}
    </section>
    <section>
      <h3>Befunde</h3>
      ${patient.exams.map(examTemplate).join("") || `<p class="empty-state">Keine Befunde dokumentiert.</p>`}
    </section>
    <section>
      <h3>Dateien</h3>
      <div class="file-list">
        ${files.map(fileTemplate).join("") || `<p class="empty-state">Noch keine Dateien hinterlegt.</p>`}
      </div>
    </section>
    ${pendingExam ? `<div class="snapshot-item"><strong>Zu prüfen:</strong> ${escapeHtml(pendingExam.name)} ist als ${statusLabel(pendingExam.status)} markiert.</div>` : ""}
  `;
  document.querySelector("#add-visit-selected").addEventListener("click", openVisitDialog);
  document.querySelector("#add-exam-selected").addEventListener("click", openExamDialog);
  document.querySelectorAll("[data-exam-status]").forEach((select) => {
    select.addEventListener("change", handleExamStatusChange);
  });
}

function renderToday() {
  const visits = data.patients.flatMap((patient) => patient.visits.map((visit) => ({ ...visit, patient }))).filter((visit) => visit.date === today).sort(sortByDateTime);
  els.todayList.innerHTML = visits.map((visit) => visitTemplate(visit, visit.patient, true)).join("") || `<p class="empty-state">Heute sind keine Termine geplant.</p>`;
}

function renderTasks() {
  const tasks = getTasks();
  const openTasks = tasks.filter((task) => !task.done);
  const status = els.taskStatusFilter.value;
  const priority = els.taskPriorityFilter.value;
  const patientId = els.taskPatientFilter.value;
  const filteredTasks = tasks.filter((task) => {
    const statusMatch = status === "all" || (status === "open" && !task.done) || (status === "completed" && task.done);
    const priorityMatch = priority === "all" || task.priority === priority;
    const patientMatch = patientId === "all" || task.patient.id === patientId;
    return statusMatch && priorityMatch && patientMatch;
  });

  els.taskList.innerHTML = openTasks.slice(0, 5).map((task) => taskTemplate(task, "compact")).join("") || `<p class="empty-state">Keine offenen Nachverfolgungen.</p>`;
  els.allTasks.innerHTML = filteredTasks.map((task) => taskTemplate(task, "full")).join("") || `<p class="empty-state">Keine Aufgaben für diese Filter.</p>`;
  document.querySelectorAll("[data-task-action]").forEach((button) => {
    button.addEventListener("click", handleTaskAction);
  });

  const highRisk = data.patients.filter((patient) => patient.risk === "High");
  els.snapshot.innerHTML = [
    ...highRisk.map((patient) => `<div class="snapshot-item"><strong>${escapeHtml(patient.name)}</strong><p class="meta">${escapeHtml(patient.diagnosis)}</p></div>`),
    `<div class="snapshot-item"><strong>${openTasks.length}</strong><p class="meta">Offene Praxisaufgaben</p></div>`
  ].join("");
}

function taskTemplate(task, density) {
  const actionText = task.done ? "Wieder öffnen" : "Erledigen";
  const notes = density === "full" && task.notes ? `<p class="meta task-notes">${escapeHtml(task.notes)}</p>` : "";
  const actions = density === "full" ? `
    <div class="task-actions">
      <button class="button secondary" type="button" data-task-action="open-record" data-patient-id="${task.patient.id}">Akte öffnen</button>
      <button class="button ${task.done ? "secondary" : "primary"}" type="button" data-task-action="toggle" data-patient-id="${task.patient.id}" data-task-id="${task.id}">${actionText}</button>
    </div>
  ` : `
    <button class="button secondary compact-action" type="button" data-task-action="toggle" data-patient-id="${task.patient.id}" data-task-id="${task.id}">${actionText}</button>
  `;

  return `
    <article class="task-row ${density === "full" ? "task-row-full" : ""} ${task.done ? "is-done" : ""}">
      <span class="task-check ${task.done ? "done" : ""}" aria-hidden="true">${task.done ? "✓" : "!"}</span>
      <div class="task-content">
        <div class="task-title-line">
          <strong>${escapeHtml(task.title)}</strong>
          <span class="risk-badge ${priorityClass(task.priority)}">${priorityLabel(task.priority)}</span>
        </div>
        <p class="meta">${escapeHtml(task.patient.name)} · Fällig ${escapeHtml(task.due)} · ${task.done ? "Erledigt" : "Offen"}</p>
        ${notes}
      </div>
      ${actions}
    </article>
  `;
}

function handleTaskAction(event) {
  const action = event.currentTarget.dataset.taskAction;
  const patientId = event.currentTarget.dataset.patientId;
  const patient = findPatient(patientId);
  if (!patient) return;

  if (action === "open-record") {
    selectedPatientId = patient.id;
    setView("dashboard");
    return;
  }

  if (action === "toggle") {
    const task = patient.tasks.find((item) => item.id === event.currentTarget.dataset.taskId);
    if (!task) return;
    task.done = !task.done;
    task.completedAt = task.done ? new Date().toISOString() : "";
    saveData();
    render();
  }
}

function renderCalendar() {
  const visibleYear = calendarCursor.getFullYear();
  const visibleMonth = calendarCursor.getMonth();
  const firstOfMonth = new Date(visibleYear, visibleMonth, 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
  const visits = data.patients.flatMap((patient) => patient.visits.map((visit) => ({ ...visit, patient })));
  els.calendarTitle.textContent = new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(firstOfMonth);
  els.calendarGrid.innerHTML = days.map((date) => {
    const dateKey = toDateKey(date);
    const dayVisits = visits.filter((visit) => visit.date === dateKey).sort(sortByDateTime);
    const isOutsideMonth = date.getMonth() !== visibleMonth;
    const isToday = dateKey === today;
    return `
      <div class="calendar-day ${isOutsideMonth ? "outside-month" : ""} ${isToday ? "is-today" : ""}">
        <strong>${formatCalendarDay(date)}</strong>
        ${dayVisits.map((visit) => `
          <div class="calendar-event">
            <b>${visit.time}</b> ${escapeHtml(visit.patient.name)}
            <div>${visitTypeLabel(visit.type)}</div>
          </div>
        `).join("") || `<p class="empty-state">Frei</p>`}
      </div>
    `;
  }).join("");
}

function moveCalendarMonth(delta) {
  calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + delta, 1);
  renderCalendar();
}

function renderVisitOptions() {
  els.visitPatient.innerHTML = data.patients.map((patient) => `<option value="${patient.id}">${escapeHtml(patient.name)}</option>`).join("");
}

function renderTaskOptions() {
  const patientOptions = data.patients.map((patient) => `<option value="${patient.id}">${escapeHtml(patient.name)}</option>`).join("");
  els.taskPatient.innerHTML = patientOptions;
  const currentFilter = els.taskPatientFilter.value || "all";
  els.taskPatientFilter.innerHTML = `<option value="all">Alle Patienten</option>${patientOptions}`;
  els.taskPatientFilter.value = data.patients.some((patient) => patient.id === currentFilter) ? currentFilter : "all";
}

function openVisitDialog() {
  els.visitForm.elements.patientId.value = selectedPatientId || data.patients[0]?.id || "";
  els.visitForm.elements.date.value = today;
  els.visitForm.elements.time.value = "09:00";
  els.visitDialog.showModal();
}

function openTaskDialog(patientId = selectedPatientId) {
  els.taskForm.elements.patientId.value = patientId || data.patients[0]?.id || "";
  els.taskForm.elements.priority.value = "Moderate";
  els.taskForm.elements.due.value = "Heute";
  els.taskDialog.showModal();
}

function openExamDialog() {
  els.examForm.elements.date.value = today;
  els.examForm.elements.status.value = "Done";
  els.examDialog.showModal();
}

function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "katsaras-praxis-demo-daten.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function findPatient(id) {
  return data.patients.find((patient) => patient.id === id);
}

function getTasks() {
  return data.patients.flatMap((patient) => patient.tasks.map((task) => ({ ...task, patient })));
}

function patientFiles(patient) {
  return patient.exams
    .filter((exam) => exam.file)
    .map((exam) => ({
      ...exam.file,
      examName: exam.name,
      date: exam.date,
      status: exam.status
    }));
}

function patientFileCount(patient) {
  return patientFiles(patient).length + (patient.photo ? 1 : 0);
}

function normalizeData(source) {
  source.patients.forEach((patient, patientIndex) => {
    patient.photo = patient.photo || null;
    patient.exams = (patient.exams || []).map((exam, examIndex) => ({
      id: exam.id || `exam-${patient.id || patientIndex}-${examIndex}`,
      name: exam.name || "Unbenannter Befund",
      date: exam.date || today,
      result: exam.result || "Pending",
      status: exam.status || "Pending",
      file: exam.file || null
    }));
    patient.tasks = (patient.tasks || []).map((task, taskIndex) => ({
      id: task.id || `t-${patient.id || patientIndex}-${taskIndex}`,
      title: task.title || "Unbenannte Aufgabe",
      due: task.due || "Heute",
      priority: task.priority || "Moderate",
      notes: task.notes || "",
      done: Boolean(task.done),
      createdAt: task.createdAt || "",
      completedAt: task.completedAt || ""
    }));
  });
  return source;
}

function avatarTemplate(patient, size = "") {
  const classes = `avatar ${size === "large" ? "avatar-large" : ""}`;
  if (patient.photo?.dataUrl) {
    return `<img class="${classes}" src="${patient.photo.dataUrl}" alt="Foto von ${escapeHtml(patient.name)}" />`;
  }
  if (patient.photo?.id) {
    return `<img class="${classes}" data-media-id="${patient.photo.id}" alt="Foto von ${escapeHtml(patient.name)}" />`;
  }
  return `<div class="${classes}">${initials(patient.name)}</div>`;
}

function examTemplate(exam) {
  const fileLink = exam.file ? `
    <a class="file-link" href="${exam.file.dataUrl || "#"}" download="${escapeHtml(exam.file.name)}" target="_blank" rel="noreferrer" ${exam.file.id ? `data-file-id="${exam.file.id}"` : ""}>
      <span aria-hidden="true">▣</span>
      ${escapeHtml(exam.file.name)}
    </a>
  ` : `<span class="meta">Keine Datei hinterlegt</span>`;

  return `
    <div class="visit-row exam-row">
      <span class="time-chip">${statusLabel(exam.status)}</span>
      <div class="exam-content">
        <div class="exam-title-line">
          <strong>${escapeHtml(exam.name)}</strong>
          <label class="status-control">
            <span>Status</span>
            <select data-exam-status="${escapeHtml(exam.id)}">
              ${["Pending", "Review", "Done"].map((status) => `<option value="${status}" ${exam.status === status ? "selected" : ""}>${statusLabel(status)}</option>`).join("")}
            </select>
          </label>
        </div>
        <p class="meta">${formatDate(exam.date)} · ${escapeHtml(exam.result)}</p>
        ${fileLink}
      </div>
    </div>
  `;
}

function handleExamStatusChange(event) {
  const patient = findPatient(selectedPatientId);
  const exam = patient?.exams.find((item) => item.id === event.currentTarget.dataset.examStatus);
  if (!exam) return;
  exam.status = event.currentTarget.value;
  saveData();
  render();
}

function fileTemplate(file) {
  return `
    <div class="file-row">
      <a class="file-link" href="${file.dataUrl || "#"}" download="${escapeHtml(file.name)}" target="_blank" rel="noreferrer" ${file.id ? `data-file-id="${file.id}"` : ""}>
        <span aria-hidden="true">▣</span>
        ${escapeHtml(file.name)}
      </a>
      <p class="meta">${escapeHtml(file.examName)} · ${formatDate(file.date)} · ${statusLabel(file.status)}${file.size ? ` · ${formatFileSize(file.size)}` : ""}</p>
    </div>
  `;
}

function readStoredFile(file) {
  return new Promise((resolve, reject) => {
    if (file.size > maxStoredFileBytes) {
      alert("Diese Demo speichert Dateien im Browser. Jede Datei muss kleiner als 20 MB sein.");
      reject(new Error("File is too large for local demo storage."));
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      try {
        const storedFile = {
          id: makeId("file"),
          dataUrl: reader.result
        };
        await putStoredFile(storedFile);
        resolve({
          id: storedFile.id,
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size
        });
      } catch (error) {
        alert("Diese Datei konnte nicht im Browser gespeichert werden. Bitte eine kleinere Datei versuchen.");
        reject(error);
      }
    });
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function openMediaDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(mediaDbName, 1);
    request.addEventListener("upgradeneeded", () => {
      request.result.createObjectStore(mediaStoreName, { keyPath: "id" });
    });
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}

async function putStoredFile(fileRecord) {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(mediaStoreName, "readwrite");
    transaction.objectStore(mediaStoreName).put(fileRecord);
    transaction.addEventListener("complete", () => {
      db.close();
      resolve();
    });
    transaction.addEventListener("error", () => {
      db.close();
      reject(transaction.error);
    });
  });
}

async function getStoredFileDataUrl(id) {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(mediaStoreName, "readonly");
    const request = transaction.objectStore(mediaStoreName).get(id);
    request.addEventListener("success", () => resolve(request.result?.dataUrl || ""));
    request.addEventListener("error", () => reject(request.error));
    transaction.addEventListener("complete", () => db.close());
  });
}

async function hydrateStoredMedia() {
  const imageTargets = [...document.querySelectorAll("img[data-media-id]")];
  const fileTargets = [...document.querySelectorAll("a[data-file-id]")];
  await Promise.all([
    ...imageTargets.map(async (image) => {
      const dataUrl = await getStoredFileDataUrl(image.dataset.mediaId);
      if (dataUrl) image.src = dataUrl;
    }),
    ...fileTargets.map(async (link) => {
      const dataUrl = await getStoredFileDataUrl(link.dataset.fileId);
      if (dataUrl) link.href = dataUrl;
    })
  ]);
}

function priorityClass(priority) {
  return priority === "High" || priority === "Moderate" || priority === "Low" ? priority : "Stable";
}

function riskLabel(risk) {
  return {
    High: "Hoch",
    Moderate: "Mittel",
    Stable: "Stabil"
  }[risk] || risk;
}

function priorityLabel(priority) {
  return {
    High: "Hoch",
    Moderate: "Mittel",
    Low: "Niedrig"
  }[priority] || priority;
}

function statusLabel(status) {
  return {
    Pending: "Ausstehend",
    Review: "Zur Prüfung",
    Done: "Erledigt"
  }[status] || status;
}

function visitTypeLabel(type) {
  return {
    Consultation: "Beratung",
    "Follow-up": "Kontrolle",
    "Exam review": "Befundbesprechung",
    Telehealth: "Videosprechstunde"
  }[type] || escapeHtml(type);
}

function initials(name) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(date) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${date}T00:00:00`));
}

function formatCalendarDay(date) {
  return new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "short" }).format(date);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function visitTemplate(visit, patient, showPatient) {
  return `
    <div class="visit-row">
      <span class="time-chip">${escapeHtml(visit.time)}</span>
      <div>
        <strong>${showPatient ? `${escapeHtml(patient.name)} · ` : ""}${visitTypeLabel(visit.type)}</strong>
        <p class="meta">${formatDate(visit.date)} · ${escapeHtml(visit.reason)}</p>
        <p class="meta">${escapeHtml(visit.plan)}</p>
      </div>
    </div>
  `;
}

function sortByDateTime(a, b) {
  return `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
