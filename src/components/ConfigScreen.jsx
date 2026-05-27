import { useState } from 'react'
import { useConfig } from '../hooks/useConfig'

const FIELDS = [
  { name: 'jiraUrl',  label: 'URL do Jira',  type: 'url',      placeholder: 'https://suaempresa.atlassian.net' },
  { name: 'email',    label: 'Email',         type: 'email',    placeholder: 'voce@empresa.com' },
  { name: 'token',    label: 'API Token',     type: 'password', placeholder: 'ATATT3xFf…' },
  { name: 'boardId',  label: 'Board ID',      type: 'text',     placeholder: '42' },
  { name: 'sprintId', label: 'Sprint ID',     type: 'text',     placeholder: '123' },
]

function validate(values) {
  const errors = {}
  for (const { name, label, type } of FIELDS) {
    const v = values[name]?.trim()
    if (!v) {
      errors[name] = `${label} é obrigatório`
      continue
    }
    if (type === 'url' && !v.startsWith('http')) {
      errors[name] = 'Informe uma URL válida (começa com http ou https)'
    }
    if (type === 'email' && !v.includes('@')) {
      errors[name] = 'Informe um email válido'
    }
  }
  return errors
}

export default function ConfigScreen() {
  const { saveConfig } = useConfig()
  const [values, setValues] = useState({
    jiraUrl: '', email: '', token: '', boardId: '', sprintId: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const allFilled = FIELDS.every(({ name }) => values[name]?.trim())

  function handleChange(e) {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, ...validate({ ...values, [name]: value }) }))
    }
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors((prev) => ({ ...prev, ...validate(values) }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(values)
    if (Object.keys(errs).length) {
      setErrors(errs)
      setTouched(Object.fromEntries(FIELDS.map(({ name }) => [name, true])))
      return
    }
    saveConfig({
      jiraUrl:  values.jiraUrl.trim().replace(/\/$/, ''),
      email:    values.email.trim(),
      token:    values.token.trim(),
      boardId:  values.boardId.trim(),
      sprintId: values.sprintId.trim(),
    })
  }

  return (
    <div className="config-screen">
      <h1 className="config-screen__title">epic-flow</h1>
      <p className="config-screen__subtitle">Configure sua conexão com o Jira para começar.</p>

      <form className="config-form" onSubmit={handleSubmit} noValidate>
        {FIELDS.map(({ name, label, type, placeholder }) => (
          <div key={name} className="config-form__field">
            <label className="config-form__label" htmlFor={name}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              placeholder={placeholder}
              value={values[name]}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`config-form__input${errors[name] && touched[name] ? ' config-form__input--error' : ''}`}
              autoComplete={type === 'password' ? 'current-password' : 'off'}
            />
            {errors[name] && touched[name] && (
              <p className="config-form__error" role="alert">{errors[name]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="btn btn--primary config-form__submit"
          disabled={!allFilled}
        >
          Conectar
        </button>
      </form>
    </div>
  )
}
