const plan = {
  "CBC": ["Química", "Int. Con. Sociedad y Estado", "Int. Pensamiento Científico", "Matemática", "Física e Int. Biofísica", "Biología e Int. Biología Celular"],
  "Primer Año": ["Anatomía", "Histología - Biología Celular - Embriología - Genética", "Salud Mental", "Bioética I", "Medicina Familiar"],
  "Segundo Año": ["Química Biológica", "Fisiología y Biofísica"],
  "Tercer Año": ["Microbiología y Parasitología I", "Inmunología Humana", "Microbiología y Parasitología II", "Patología I", "Farmacología I"],
  "Ciclo Clínico": ["Medicina A", "Patología II", "Salud Pública I", "Farmacología II", "Salud Pública II", "Medicina Legal y Deontología Médica", "Bioética II", "Toxicología"],
  "Clínicas": ["Medicina B", "Nutrición", "Diagnóstico por Imágenes", "Dermatología", "Infectología", "Neumonología", "Neurología", "Psiquiatría"],
  "Quirúrgicas": ["Pediatría", "Obstetricia", "Ginecología", "Cirugía general", "Urología", "Ortopedia - Traumatología", "Oftalmología", "Otorrinolaringología", "Neurocirugía"],
  "Internado": ["Clínica Médica", "Cirugía", "Tocoginecología", "Pediatría", "Salud Mental", "APS", "Módulo Específico / Curso de Residencia"]
};

function crearMalla() {
  const container = document.getElementById("malla");
  for (const [ciclo, materias] of Object.entries(plan)) {
    const col = document.createElement("div");
    col.className = "columna";
    const h = document.createElement("h3");
    h.textContent = ciclo;
    col.appendChild(h);
    materias.forEach(m => {
      const div = document.createElement("div");
      div.className = "materia";
      div.textContent = m;
      div.dataset.materia = m;
      div.addEventListener("click", () => cambiarEstado(div));
      col.appendChild(div);
    });
    container.appendChild(col);
  }
  restaurarEstado();
}

function cambiarEstado(el) {
  const estados = ["", "cursando", "regular", "aprobada"];
  let actual = estados.findIndex(e => el.classList.contains(e));
  el.classList.remove(estados[actual]);
  actual = (actual + 1) % estados.length;
  if (estados[actual]) el.classList.add(estados[actual]);
  guardarEstado();
}

function guardarEstado() {
  const materias = document.querySelectorAll(".materia");
  const estado = {};
  materias.forEach(el => {
    if (el.classList.length > 1)
      estado[el.dataset.materia] = el.classList[1];
  });
  localStorage.setItem("estadoMalla", JSON.stringify(estado));
}

function restaurarEstado() {
  const estado = JSON.parse(localStorage.getItem("estadoMalla") || "{}");
  for (const [materia, clase] of Object.entries(estado)) {
    const el = [...document.querySelectorAll(".materia")].find(e => e.dataset.materia === materia);
    if (el) el.classList.add(clase);
  }
}

window.onload = crearMalla;
