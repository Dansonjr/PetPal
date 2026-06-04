import { useState } from 'react';

export const useFormValidation = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    
    if (touched[name]) {
      const validationErrors = validate({ ...values, [name]: value });
      setErrors({ ...errors, [name]: validationErrors[name] });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    const validationErrors = validate(values);
    setErrors({ ...errors, [name]: validationErrors[name] });
  };

  const validateForm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    const isValid = Object.keys(validationErrors).length === 0;
    return isValid;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  };
};
