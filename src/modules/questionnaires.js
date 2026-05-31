import { supabase } from '../lib/supabase.js';
import { showToast } from '../components/ui.js';

let currentStep = 1;
let questionsData = [];
let questionnaireId = 'a83856b3-eb71-4a57-8fb2-c51121d51a66'; // PRE Questionnaire UUID
let userProfile = null;
let childrenList = [];

// Metadata mapping for sections, options, scales, and labels based on sort_order
const sectionsMetadata = [
  { name: 'Datos sociodemográficos', start: 1, end: 15 },
  { name: 'CAPSM-IJ', start: 16, end: 29, scale: { min: 1, max: 7, labels: { 1: 'Totalmente en desacuerdo', 2: 'En desacuerdo', 3: 'Algo en desacuerdo', 4: 'Ni de acuerdo ni en desacuerdo', 5: 'Algo de acuerdo', 6: 'Bastante de acuerdo', 7: 'Totalmente de acuerdo' } } },
  { name: 'Reconocimiento de problemas de salud mental', start: 30, end: 32, scale: { min: 1, max: 7, labels: { 1: 'Totalmente en desacuerdo', 2: 'En desacuerdo', 3: 'Algo en desacuerdo', 4: 'Ni de acuerdo ni en desacuerdo', 5: 'Algo de acuerdo', 6: 'Bastante de acuerdo', 7: 'Totalmente de acuerdo' } } },
  { name: 'Búsqueda de ayuda', start: 33, end: 38, customScales: {
      33: { min: 1, max: 5, labels: { 1: 'No acudiría a ellos', 2: 'Poca confianza', 3: 'No estoy seguro', 4: 'Bastante confianza', 5: 'Mucha confianza' } },
      34: { min: 1, max: 5, labels: { 1: 'No acudiría a ellos', 2: 'Poca confianza', 3: 'No estoy seguro', 4: 'Bastante confianza', 5: 'Mucha confianza' } },
      35: { min: 1, max: 5, labels: { 1: 'No acudiría a ellos', 2: 'Poca confianza', 3: 'No estoy seguro', 4: 'Bastante confianza', 5: 'Mucha confianza' } },
      36: { min: 1, max: 5, labels: { 1: 'No acudiría a ellos', 2: 'Poca confianza', 3: 'No estoy seguro', 4: 'Bastante confianza', 5: 'Mucha confianza' } },
      37: { min: 1, max: 5, labels: { 1: 'Muy poco probable', 2: 'Poco probable', 3: 'Ni probable ni improbable', 4: 'Bastante probable', 5: 'Muy probable' } },
      38: { min: 1, max: 5, labels: { 1: 'Muy poca confianza', 2: 'Poca confianza', 3: 'Ni confianza ni desconfianza', 4: 'Bastante confianza', 5: 'Mucha confianza' } }
    }
  },
  { name: 'PSOC', start: 39, end: 54, scale: { min: 1, max: 6, labels: { 1: 'No, totalmente en desacuerdo', 2: 'En desacuerdo', 3: 'En parte desacuerdo', 4: 'En parte de acuerdo', 5: 'De acuerdo', 6: 'Sí, totalmente de acuerdo' } } },
  { name: 'ECPP-p', start: 55, end: 71, scale: { min: 1, max: 4, labels: { 1: 'Nunca', 2: 'A veces', 3: 'Casi siempre', 4: 'Siempre' } } },
  { name: 'PSS', start: 72, end: 88, scale: { min: 1, max: 5, labels: { 1: 'Totalmente en desacuerdo', 2: 'En desacuerdo', 3: 'Ni de acuerdo ni en desacuerdo', 4: 'De acuerdo', 5: 'Totalmente de acuerdo' } } },
  { name: 'KIDSCREEN-27', start: 89, end: 103, scale: { min: 1, max: 5, labels: { 1: 'Nunca', 2: 'Casi nunca', 3: 'Algunas veces', 4: 'Casi siempre', 5: 'Siempre' } } }
];

function getQuestionMetadata(sortOrder) {
  for (const sec of sectionsMetadata) {
    if (sortOrder >= sec.start && sortOrder <= sec.end) {
      if (sec.customScales && sec.customScales[sortOrder]) {
        return { section: sec.name, scale: sec.customScales[sortOrder] };
      }
      return { section: sec.name, scale: sec.scale || null };
    }
  }
  return { section: 'Otros', scale: null };
}

export async function loadQuestionnaires() {
  const container = document.getElementById('page-content');
  if (!container) return;

  container.innerHTML = `
    <div class="questionnaire-container" style="max-width: 900px; margin: 0 auto; padding: 2rem;">
      <div class="card" style="padding: 3rem; text-align: center; border-radius: 16px; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px);">
        <div class="spinner" style="border: 4px solid rgba(0, 0, 0, 0.1); border-left-color: var(--primary); border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 1.5rem;"></div>
        <h3 style="color: var(--text-main); font-weight: 600;">Cargando cuestionario...</h3>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Preparando las preguntas oficiales y verificando tu estado.</p>
      </div>
    </div>
    <style>
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  `;

  try {
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      showToast('Error de autenticación', 'error');
      return;
    }

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileErr || !profile) {
      showToast('Error cargando el perfil de usuario', 'error');
      return;
    }
    userProfile = profile;

    // Check existing answers
    const { data: existingAnswers, error: checkErr } = await supabase
      .from('questionnaire_answers')
      .select('id')
      .eq('user_id', user.id)
      .eq('questionnaire_id', questionnaireId)
      .limit(1);

    if (existingAnswers && existingAnswers.length > 0) {
      renderCompletedState(container);
      return;
    }

    // Fetch questions
    const { data: questions, error: qErr } = await supabase
      .from('questionnaire_questions')
      .select('*')
      .eq('questionnaire_id', questionnaireId)
      .order('sort_order', { ascending: true });

    if (qErr || !questions || questions.length === 0) {
      showToast('No se pudieron cargar las preguntas del cuestionario en Supabase.', 'error');
      return;
    }

    questionsData = questions;
    renderQuestionnaire(container);
  } catch (err) {
    console.error(err);
    showToast('Ocurrió un error inesperado al cargar el cuestionario', 'error');
  }
}

function renderCompletedState(container) {
  container.innerHTML = `
    <div class="questionnaire-container" style="max-width: 700px; margin: 0 auto; padding: 2rem;">
      <div class="card" style="padding: 4rem 2rem; text-align: center; border-radius: 20px; background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.05);">
        <div style="background: #e6fcf5; color: #0ca678; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; font-size: 2.5rem;">✓</div>
        <h2 style="color: #2b2b2b; font-weight: 700; margin-bottom: 1rem; font-size: 2rem;">¡Cuestionario Completado!</h2>
        <p style="color: #666; font-size: 1.1rem; line-height: 1.6; max-width: 500px; margin: 0 auto 2.5rem;">
          Tus respuestas del cuestionario PRE han sido guardadas de forma segura.
        </p>
        <a href="/src/pages/app/dashboard.html" class="button" style="padding: 0.8rem 2.5rem; font-weight: 600; border-radius: 8px; text-decoration: none; display: inline-block;">Volver al Dashboard</a>
      </div>
    </div>
  `;
}

function renderQuestionnaire(container) {
  container.innerHTML = `
    <div class="questionnaire-container" style="max-width: 900px; margin: 0 auto; padding: 1.5rem;">
      <div class="questionnaire-header" style="margin-bottom: 2.5rem;">
        <h2 style="font-weight: 700; font-size: 1.85rem; color: var(--text-main); margin-bottom: 0.5rem;">Cuestionario Inicial (PRE)</h2>
        <p style="color: var(--text-muted); font-size: 1rem;">Sección <span id="current-step-num">1</span> de ${sectionsMetadata.length}: <strong id="current-section-name" style="color: var(--primary);">${sectionsMetadata[0].name}</strong></p>
        <div class="questionnaire-progress" style="height: 8px; background: #e2e8f0; border-radius: 99px; overflow: hidden; margin-top: 1rem;">
          <div class="questionnaire-progress-bar" id="questionnaire-progress-bar" style="width: ${100 / sectionsMetadata.length}%; height: 100%; background: var(--primary); transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);"></div>
        </div>
      </div>

      <form id="questionnaire-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div id="step-container"></div>
        
        <div class="form-navigation" style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">
          <button type="button" id="prev-btn" class="button button-secondary" style="display: none; padding: 0.75rem 1.75rem; border-radius: 8px;">Anterior</button>
          <div style="flex-grow: 1;"></div>
          <button type="button" id="next-btn" class="button" style="padding: 0.75rem 2rem; border-radius: 8px; font-weight: 600;">Siguiente</button>
          <button type="submit" id="submit-btn" class="button" style="display: none; padding: 0.75rem 2.5rem; border-radius: 8px; font-weight: 600; background: #0ca678;">Guardar respuestas</button>
        </div>
      </form>
    </div>
  `;

  renderStep(currentStep);

  const form = document.getElementById('questionnaire-form');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      renderStep(currentStep);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep++;
      renderStep(currentStep);
    } else {
      showToast('Por favor, responde a todas las preguntas obligatorias antes de continuar.', 'error');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      showToast('Por favor, responde a todas las preguntas obligatorias.', 'error');
      return;
    }

    try {
      submitBtn.setAttribute('disabled', 'true');
      submitBtn.textContent = 'Guardando...';

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const answers = [];

      // 1. Demographics processing
      const centroSelect = form.querySelector('[data-type="centro-escolar"]');
      if (centroSelect) {
        answers.push({
          user_id: user.id,
          questionnaire_id: questionnaireId,
          question_id: centroSelect.dataset.questionId,
          likert_value: parseInt(centroSelect.value)
        });
      }

      const sexoRadio = form.querySelector('input[data-type="sexo"]:checked');
      if (sexoRadio) {
        answers.push({
          user_id: user.id,
          questionnaire_id: questionnaireId,
          question_id: sexoRadio.dataset.questionId,
          likert_value: parseInt(sexoRadio.value)
        });
      }

      const edadInput = form.querySelector('[data-type="edad"]');
      if (edadInput) {
        answers.push({
          user_id: user.id,
          questionnaire_id: questionnaireId,
          question_id: edadInput.dataset.questionId,
          likert_value: parseInt(edadInput.value)
        });
      }

      const dropdowns = ['estudios', 'laboral', 'civil', 'socioeconomico', 'centro', 'hijos', 'estructura'];
      dropdowns.forEach(type => {
        const select = form.querySelector(`[data-type="${type}"]`);
        if (select) {
          answers.push({
            user_id: user.id,
            questionnaire_id: questionnaireId,
            question_id: select.dataset.questionId,
            likert_value: parseInt(select.value)
          });
        }
      });

      // 2. Child table data encoding
      const childQuestions = questionsData.filter(q => q.sort_order >= 10 && q.sort_order <= 14);
      childrenList.forEach((child, i) => {
        if (i < childQuestions.length) {
          const sexVal = child.sex === 'Mujer' ? 1 : (child.sex === 'Hombre' ? 2 : 3);
          const therapyVal = child.received_therapy === 'Sí' ? 1 : 2;
          // Encode as integer: AGE * 100 + SEX * 10 + THERAPY
          const encoded = (child.age * 100) + (sexVal * 10) + therapyVal;

          answers.push({
            user_id: user.id,
            questionnaire_id: questionnaireId,
            question_id: childQuestions[i].id,
            likert_value: encoded
          });
        }
      });

      // 3. Regular Scale questions processing
      const scaleRadios = form.querySelectorAll('input[data-scale-radio]:checked');
      scaleRadios.forEach(radio => {
        answers.push({
          user_id: user.id,
          questionnaire_id: questionnaireId,
          question_id: radio.dataset.questionId,
          likert_value: parseInt(radio.value)
        });
      });

      // Save answers in Supabase
      const { error: answersErr } = await supabase
        .from('questionnaire_answers')
        .insert(answers);

      if (answersErr) throw answersErr;

      showToast('¡Cuestionario completado con éxito!', 'success');
      renderCompletedState(container);
    } catch (err) {
      console.error(err);
      showToast('Ocurrió un error al guardar tus respuestas.', 'error');
      submitBtn.removeAttribute('disabled');
      submitBtn.textContent = 'Guardar respuestas';
    }
  });
}

function validateStep(step) {
  const stepContainer = document.getElementById('step-container');
  if (!stepContainer) return false;

  if (step === 1) {
    const requiredInputs = stepContainer.querySelectorAll('select[required], input[required]');
    let allValid = true;
    requiredInputs.forEach(input => {
      if (!input.value.trim()) {
        allValid = false;
        input.style.borderColor = 'red';
      } else {
        input.style.borderColor = '';
      }
    });

    // Validate child rows if number of children is positive
    const childAges = stepContainer.querySelectorAll('.child-age');
    childAges.forEach(input => {
      if (!input.value.trim()) {
        allValid = false;
        input.style.borderColor = 'red';
      } else {
        input.style.borderColor = '';
      }
    });

    return allValid;
  }

  const questionCards = stepContainer.querySelectorAll('.question-card');
  let allAnswered = true;
  questionCards.forEach(card => {
    const checked = card.querySelector('input[type="radio"]:checked');
    if (!checked) {
      allAnswered = false;
      card.style.borderLeft = '4px solid red';
      card.style.background = '#fff5f5';
    } else {
      card.style.borderLeft = '';
      card.style.background = '';
    }
  });

  return allAnswered;
}

function renderStep(step) {
  const activeSection = sectionsMetadata[step - 1];

  document.getElementById('current-step-num').textContent = step;
  document.getElementById('current-section-name').textContent = activeSection.name;
  document.getElementById('questionnaire-progress-bar').style.width = `${(step / sectionsMetadata.length) * 100}%`;

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');

  prevBtn.style.display = step > 1 ? 'block' : 'none';
  if (step === sectionsMetadata.length) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'block';
  } else {
    nextBtn.style.display = 'block';
    submitBtn.style.display = 'none';
  }

  const stepContainer = document.getElementById('step-container');
  stepContainer.innerHTML = '';

  const stepQuestions = questionsData.filter(q => q.sort_order >= activeSection.start && q.sort_order <= activeSection.end);

  if (activeSection.name === 'Datos sociodemográficos') {
    renderDemographics(stepContainer, stepQuestions);
  } else {
    stepQuestions.forEach((q) => {
      const meta = getQuestionMetadata(q.sort_order);
      const scale = meta.scale;
      const labels = scale.labels || {};
      
      const optionsHtml = Array.from({ length: scale.max - scale.min + 1 }, (_, i) => {
        const val = scale.min + i;
        const label = labels[val] || '';
        return `
          <label class="likert-option" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; text-align: center; gap: 0.5rem;">
            <span style="font-weight: 700; font-size: 1.1rem; color: var(--text-main);">${val}</span>
            <input type="radio" name="${q.id}" data-question-id="${q.id}" data-scale-radio="true" value="${val}" required style="width: 20px; height: 20px; cursor: pointer; accent-color: var(--primary);" />
            <span style="font-size: 0.75rem; color: var(--text-muted); max-width: 80px; line-height: 1.2;">${label}</span>
          </label>
        `;
      }).join('');

      stepContainer.innerHTML += `
        <div class="card question-card" style="padding: 2rem; border-radius: 12px; background: white; border: 1px solid #e2e8f0; margin-bottom: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: transform 0.2s, box-shadow 0.2s;">
          <div class="question-title" style="font-size: 1.1rem; font-weight: 600; color: var(--text-main); margin-bottom: 1.75rem; line-height: 1.5;">
            ${q.sort_order - 15}. ${q.question}
          </div>
          <div class="likert-grid" style="display: grid; grid-template-columns: repeat(${scale.max - scale.min + 1}, 1fr); gap: 1rem; padding: 0.5rem 0;">
            ${optionsHtml}
          </div>
        </div>
      `;
    });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderDemographics(container, questions) {
  let html = `<div class="card" style="padding: 2.5rem; border-radius: 16px; background: white; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">`;

  const schools = {
    "ES": [
      { name: "Nuestra Señora del Pilar (Jerez de la Frontera)", val: 1 },
      { name: "Jesús María \"El Cuco\" (Jerez de la Frontera)", val: 2 },
      { name: "C. E. Marni (Rascanya)", val: 3 },
      { name: "Otro centro", val: 4 }
    ],
    "LATAM": [
      { name: "Innovación Educativa Montessori", val: 1 },
      { name: "Escuela Telesecundaria \"5 de mayo\"", val: 2 },
      { name: "Escuela Telesecundaria \"Guadalupe Victoria\"", val: 3 },
      { name: "Escuela Telesecundaria \"Leona Vicario\"", val: 4 },
      { name: "Escuela Telesecundaria \"Manuel C. Tello\"", val: 5 },
      { name: "Escuela Telesecundaria \"Rafael Ramires\"", val: 6 },
      { name: "Otro centro", val: 7 }
    ]
  };

  questions.forEach(q => {
    if (q.question === 'Centro escolar') {
      const region = userProfile?.region || 'ES';
      const options = schools[region] || [];
      html += `
        <div class="form-group" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">P1. Centro escolar</label>
          <select data-question-id="${q.id}" data-type="centro-escolar" class="form-control" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; background: white;">
            <option value="">Selecciona tu centro escolar...</option>
            ${options.map(s => `<option value="${s.val}">${s.name}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (q.question === 'Sexo') {
      html += `
        <div class="form-group" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">P2. Sexo</label>
          <div style="display: flex; gap: 2rem; margin-top: 0.25rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-main);">
              <input type="radio" name="${q.id}" data-question-id="${q.id}" data-type="sexo" value="1" required style="accent-color: var(--primary); width: 18px; height: 18px;" />
              <span>Mujer</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-main);">
              <input type="radio" name="${q.id}" data-question-id="${q.id}" data-type="sexo" value="2" required style="accent-color: var(--primary); width: 18px; height: 18px;" />
              <span>Hombre</span>
            </label>
          </div>
        </div>
      `;
    } else if (q.question === 'Edad') {
      html += `
        <div class="form-group" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">P3. Edad</label>
          <input type="number" data-question-id="${q.id}" data-type="edad" min="18" class="form-control" placeholder="Introduce tu edad (mínimo 18)" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none;" />
        </div>
      `;
    } else if (['Estudios', 'Situación laboral', 'Estado civil', 'Nivel socioeconómico', 'Tipo de centro', 'Tipo estructura familiar'].includes(q.question)) {
      const optionsMap = {
        'Estudios': [
          { name: "Primarios", val: 1 },
          { name: "Secundarios", val: 2 },
          { name: "Universitarios", val: 3 },
          { name: "Doctorado", val: 4 }
        ],
        'Situación laboral': [
          { name: "Estudiante", val: 1 },
          { name: "Trabajo", val: 2 },
          { name: "Parado/a", val: 3 },
          { name: "Gestión doméstica", val: 4 },
          { name: "Jubilado/a", val: 5 },
          { name: "Incapacitado/a", val: 6 }
        ],
        'Estado civil': [
          { name: "Soltero/a", val: 1 },
          { name: "Casado/a", val: 2 },
          { name: "Separado/a / Divorciado/a", val: 3 },
          { name: "Viudo/a", val: 4 }
        ],
        'Nivel socioeconómico': [
          { name: "Bajo", val: 1 },
          { name: "Medio", val: 2 },
          { name: "Alto", val: 3 }
        ],
        'Tipo de centro': [
          { name: "Público", val: 1 },
          { name: "Concertado", val: 2 },
          { name: "Privado", val: 3 }
        ],
        'Tipo estructura familiar': [
          { name: "Biparental", val: 1 },
          { name: "Monoparental", val: 2 },
          { name: "Reconstituida", val: 3 },
          { name: "Otra", val: 4 }
        ]
      };
      const typeKey = q.question === 'Tipo estructura familiar' ? 'estructura' : (q.question === 'Tipo de centro' ? 'centro' : q.question === 'Nivel socioeconómico' ? 'socioeconomico' : q.question === 'Estado civil' ? 'civil' : q.question === 'Situación laboral' ? 'laboral' : 'estudios');
      const labelNum = q.question === 'Tipo estructura familiar' ? 'P11' : (q.question === 'Tipo de centro' ? 'P8' : q.question === 'Nivel socioeconómico' ? 'P7' : q.question === 'Estado civil' ? 'P6' : q.question === 'Situación laboral' ? 'P5' : 'P4');
      const opts = optionsMap[q.question] || [];
      html += `
        <div class="form-group" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">${labelNum}. ${q.question}</label>
          <select data-question-id="${q.id}" data-type="${typeKey}" class="form-control" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; background: white;">
            <option value="">Selecciona una opción...</option>
            ${opts.map(o => `<option value="${o.val}">${o.name}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (q.question === 'Número de hijos') {
      html += `
        <div class="form-group" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">P9. Número de hijos</label>
          <input type="number" id="num-hijos-input" data-question-id="${q.id}" data-type="hijos" min="0" max="5" class="form-control" placeholder="0" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none;" />
        </div>

        <!-- Dynamic Child Table block -->
        <div id="hijos-table-section" style="display: none; flex-direction: column; gap: 1rem; background: #f8fafc; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0;">
          <h4 style="font-weight: 700; color: var(--text-main); margin-bottom: 0.5rem;">P10. Datos de los Hijos</h4>
          
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #cbd5e1;">
                <th style="padding: 0.5rem; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted);">Orden</th>
                <th style="padding: 0.5rem; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted);">Edad</th>
                <th style="padding: 0.5rem; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted);">Sexo</th>
                <th style="padding: 0.5rem; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted);">Atención psicológica previa</th>
              </tr>
            </thead>
            <tbody id="children-table-body"></tbody>
          </table>
        </div>
      `;
    }
  });

  html += `</div>`;
  container.innerHTML = html;

  const numHijosInput = document.getElementById('num-hijos-input');
  const hijosSection = document.getElementById('hijos-table-section');
  const tableBody = document.getElementById('children-table-body');

  if (numHijosInput) {
    numHijosInput.addEventListener('input', () => {
      const count = Math.min(5, Math.max(0, parseInt(numHijosInput.value) || 0));
      if (count > 0) {
        hijosSection.style.display = 'flex';
        renderChildrenRows(count, tableBody);
      } else {
        hijosSection.style.display = 'none';
        childrenList = [];
      }
    });
  }
}

function renderChildrenRows(count, container) {
  container.innerHTML = '';
  childrenList = [];

  for (let i = 1; i <= count; i++) {
    childrenList.push({ order: i, age: '', sex: 'Mujer', received_therapy: 'No' });

    container.innerHTML += `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 0.75rem 0.5rem; font-weight: 600; color: var(--text-main);">Hijo/a ${i}</td>
        <td style="padding: 0.75rem 0.5rem;">
          <input type="number" min="0" max="100" placeholder="Edad" class="form-control child-age" data-index="${i - 1}" required style="width: 80px; padding: 0.5rem; border-radius: 6px; border: 1px solid #cbd5e1;" />
        </td>
        <td style="padding: 0.75rem 0.5rem;">
          <select class="form-control child-sex" data-index="${i - 1}" style="padding: 0.5rem; border-radius: 6px; border: 1px solid #cbd5e1; background: white;">
            <option value="Mujer">Mujer</option>
            <option value="Hombre">Hombre</option>
            <option value="Otro">Otro</option>
          </select>
        </td>
        <td style="padding: 0.75rem 0.5rem;">
          <select class="form-control child-therapy" data-index="${i - 1}" style="padding: 0.5rem; border-radius: 6px; border: 1px solid #cbd5e1; background: white;">
            <option value="No">No</option>
            <option value="Sí">Sí</option>
          </select>
        </td>
      </tr>
    `;
  }

  container.querySelectorAll('.child-age').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.index);
      childrenList[idx].age = parseInt(e.target.value) || '';
    });
  });

  container.querySelectorAll('.child-sex').forEach(select => {
    select.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.index);
      childrenList[idx].sex = e.target.value;
    });
  });

  container.querySelectorAll('.child-therapy').forEach(select => {
    select.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.index);
      childrenList[idx].received_therapy = e.target.value;
    });
  });
}