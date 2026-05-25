export function setFormError(element, message) {
  element.textContent = message
  element.classList.remove('hidden')
}

export function clearFormError(element) {
  element.textContent = ''
  element.classList.add('hidden')
}