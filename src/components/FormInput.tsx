
interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

function FormInput({
  label,
  name,
  type = "text",
  value,
  placeholder,
  error,
  required = false,
  onChange
}: FormInputProps) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />

      {error && <small className="form-error">{error}</small>}
    </div>
  );
}

export default FormInput;
