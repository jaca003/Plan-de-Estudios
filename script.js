const materias = [
  { id: 'm1', nombre: 'Anatomía', correlativas: [] },
  { id: 'm2', nombre: 'Fisiología', correlativas: ['m1'] },
  { id: 'm3', nombre: 'Bioquímica', correlativas: ['m1'] },
  { id: 'm4', nombre: 'Microbiología', correlativas: ['m2', 'm3'] },
  { id: 'm5', nombre: 'Farmacología', correlativas: ['m4'] },
  { id: 'm6', nombre: 'Patología', correlativas: ['m4'] },
];

const estados = ['pendiente', 'cursando', 'regularizado', 'aprobado'];

const mallaDiv = document.getElementById('malla');

// Cargar estados guardados o inicializar
let estadoMaterias = JSON.parse(localStorage.getItem('estadoMaterias')) || {};

// Función para crear el div de cada materia
function crearMateria(materia) {
  const div = document.createElement('div');
  div.classList.add('materia');

  // Estado actual
  let estado = estadoMaterias[materia.id] || 'pendiente';

  // Actualizar estilo según estado
  actualizarEstilo(div, estado);

  div.textContent = materia.nombre;

  // Habilitar solo si correlativas aprobadas
  const desbloqueada = materia.correlativas.every(cor => estadoMaterias[cor] === 'aprobado');
  if (!desbloqueada && estado !== 'pendiente') {
    // Permitir estados solo si desbloqueada
  } else if (!desbloqueada && estado === 'pendiente') {
    div.style.opacity = '0.5';
    div.style.cursor = 'not-allowed';
  }

  // Al hacer click cambiar estado
  div.addEventListener('click', () => {
    if (!desbloqueada && estado === 'pendiente') {
      alert('Debes aprobar las materias correlativas primero.');
      return;
    }
    // Cambiar al siguiente estado
    let idx = estados.indexOf(estado);
    idx = (idx + 1) % estados.length;
    estado = estados[idx];
    estadoMaterias[materia.id] = estado === 'pendiente' ? undefined : estado;
    if (estado === 'pendiente') delete estadoMaterias[materia.id];
    localStorage.setItem('estadoMaterias', JSON.stringify(estadoMaterias));
    actualizarEstilo(div, estado);

    // Actualizar toda la malla para desbloquear nuevas materias
    actualizarMalla();
  });

  div.dataset.id = materia.id;

  return div;
}

// Cambiar clases según estado
function actualizarEstilo(div, estado) {
  div.classList.remove('aprobado', 'cursando', 'regularizado');
  div.style.opacity = '1';
  div.style.cursor = 'pointer';

  switch (estado) {
    case 'aprobado':
      div.classList.add('aprobado');
      break;
    case 'cursando':
      div.classList.add('cursando');
      break;
    case 'regularizado':
      div.classList.add('regularizado');
      break;
    case 'pendiente':
      // nada, estilo base
      break;
  }
}

// Renderizar malla entera
function actualizarMalla() {
  mallaDiv.innerHTML = '';
  materias.forEach(materia => {
    const div = crearMateria(materia);
    // Revisar desbloqueo para materia
    const desbloqueada = materia.correlativas.every(cor => estadoMaterias[cor] === 'aprobado');
    if (!desbloqueada && !(estadoMaterias[materia.id] && estadoMaterias[materia.id] !== 'pendiente')) {
      div.style.opacity = '0.5';
      div.style.cursor = 'not-allowed';
    }
    mallaDiv.appendChild(div);
  });
}

// Inicializar la malla
actualizarMalla();
