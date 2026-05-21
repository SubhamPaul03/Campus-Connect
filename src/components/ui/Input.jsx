import { forwardRef } from 'react';

const groupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: 650,
  color: 'hsl(var(--text-main))',
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  letterSpacing: '0.01em',
};

const wrapperStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const inputBaseStyle = {
  width: '100%',
  height: '42px',
  padding: '0 14px',
  fontSize: '14px',
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  fontWeight: 500,
  color: 'hsl(var(--text-main))',
  background: 'hsl(var(--bg-app))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 'var(--radius-sm)',
  outline: 'none',
  transition: 'var(--transition)',
};

const textareaBaseStyle = {
  ...inputBaseStyle,
  height: 'auto',
  minHeight: '100px',
  padding: '12px 14px',
  resize: 'vertical',
  lineHeight: 1.6,
};

const iconWrapperStyle = {
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'hsl(var(--text-muted))',
  display: 'inline-flex',
  pointerEvents: 'none',
  zIndex: 1,
};

const errorBorderStyle = {
  borderColor: 'hsl(var(--danger))',
};

const errorTextStyle = {
  fontSize: '12px',
  color: 'hsl(var(--danger))',
  fontWeight: 500,
  marginTop: '4px',
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
};

const Input = forwardRef(({
  label,
  id,
  type = 'text',
  error,
  icon,
  textarea = false,
  style = {},
  ...props
}, ref) => {
  const Tag = textarea ? 'textarea' : 'input';

  const fieldStyle = {
    ...(textarea ? textareaBaseStyle : inputBaseStyle),
    ...(icon ? { paddingLeft: '40px' } : {}),
    ...(error ? errorBorderStyle : {}),
    ...style,
  };

  return (
    <div className="form-group" style={groupStyle}>
      {label && (
        <label
          className="form-label"
          htmlFor={id}
          style={labelStyle}
        >
          {label}
        </label>
      )}
      <div style={wrapperStyle}>
        {icon && (
          <span style={textarea ? { ...iconWrapperStyle, top: '18px', transform: 'none' } : iconWrapperStyle} aria-hidden="true">
            {icon}
          </span>
        )}
        <Tag
          ref={ref}
          id={id}
          type={textarea ? undefined : type}
          className={textarea ? 'form-textarea' : 'form-input'}
          style={fieldStyle}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <span
          className="form-error"
          id={`${id}-error`}
          style={errorTextStyle}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
