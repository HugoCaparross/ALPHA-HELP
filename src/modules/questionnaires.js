import {
  supabase
} from '../lib/supabase.js'

import {
  showToast
} from '../components/ui.js'

export async function loadQuestionnaires() {

  const container =
    document.getElementById(
      'page-content'
    )

  if (!container) return

  container.innerHTML = `

    <div class="questionnaire-container">

      <div class="questionnaire-header">

        <h2>
          Cuestionario inicial
        </h2>

        <p>
          Responde las siguientes preguntas.
        </p>

        <div class="questionnaire-progress">

          <div
            class="questionnaire-progress-bar"
            id="questionnaire-progress-bar"
            style="width:0%;"
          ></div>

        </div>

      </div>

      <form id="questionnaire-form">

      </form>

    </div>

  `

  const form =
    document.getElementById(
      'questionnaire-form'
    )

  const {
    data: questions,
    error
  } = await supabase

    .from(
      'questionnaire_questions'
    )

    .select('*')

    .order(
      'sort_order',
      {
        ascending: true
      }
    )

  if (error) {

    showToast(
      'Error cargando preguntas',
      'error'
    )

    return
  }

  questions.forEach(
    (
      question,
      index
    ) => {

      form.innerHTML += `

        <div class="card question-card">

          <div class="question-title">

            ${index + 1}. ${question.question}

          </div>

          <div class="likert-grid">

            ${[1,2,3,4,5].map(value => `

              <label class="likert-option">

                <span>
                  ${value}
                </span>

                <input
                  type="radio"
                  name="${question.id}"
                  value="${value}"
                  required
                />

              </label>

            `).join('')}

          </div>

        </div>

      `

    }
  )

  form.innerHTML += `

    <button
      type="submit"
      class="button questionnaire-submit"
    >
      Guardar respuestas
    </button>

  `

  updateProgress()

  form.addEventListener(
    'change',
    updateProgress
  )

  form.addEventListener(
    'submit',
    async event => {

      event.preventDefault()

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) return

      const answers = []

      questions.forEach(question => {

        const value =

          form.querySelector(
            `input[name="${question.id}"]:checked`
          )?.value

        if (!value) return

        answers.push({

          user_id: user.id,

          questionnaire_id:
            question.questionnaire_id,

          question_id:
            question.id,

          likert_value:
            Number(value)

        })

      })

      const {
        error
      } = await supabase

        .from(
          'questionnaire_answers'
        )

        .insert(answers)

      if (error) {

        showToast(
          'Error guardando respuestas',
          'error'
        )

        return
      }

      showToast(
        'Cuestionario completado',
        'success'
      )

    }
  )

}

function updateProgress() {

  const form =
    document.getElementById(
      'questionnaire-form'
    )

  const progressBar =
    document.getElementById(
      'questionnaire-progress-bar'
    )

  if (
    !form ||
    !progressBar
  ) return

  const total =
    form.querySelectorAll(
      '.question-card'
    ).length

  const completed =
    form.querySelectorAll(
      'input:checked'
    ).length

  const progress =
    total
      ? (completed / total) * 100
      : 0

  progressBar.style.width =
    `${progress}%`
}