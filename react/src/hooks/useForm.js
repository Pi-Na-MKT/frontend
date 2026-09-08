import { useState } from 'react'

export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const fieldError = validate?.({ ...values, [name]: value })
      setErrors((prev) => ({ ...prev, [name]: fieldError?.[name] }))
    }
  }

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const fieldError = validate?.(values)
    setErrors((prev) => ({ ...prev, [name]: fieldError?.[name] }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return { values, errors, touched, handleChange, handleBlur, reset }
}