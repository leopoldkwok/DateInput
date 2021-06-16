import React, { useState, useLayoutEffect, useEffect } from "react";
import PropTypes from "prop-types";

const Input = (props) => {
  const {
    config,
    inputValue,
    inputId,
    children,
    inputRef,
    setInputValue,
    validateInput,
    defaultError,
    disabled,
    invalid
  } = props;

  const [value, setValue] = useState(inputValue);
  const [firstRender, setFirstRender] = useState(true);
  const [error, setError] = useState(defaultError);

  useLayoutEffect(() => {
    setInputValue(value, error);
  }, [value, error]);

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  useEffect(() => {
    setError(defaultError);
  }, [defaultError]);

  const validate = (valueToTest) => {
    const inputPattern = new RegExp(config.pattern);
    let newError = "";
    if (valueToTest && inputPattern && !inputPattern.test(valueToTest)) {
      newError = config.invalidError;
    } else if (config.required && (!valueToTest || !/\S/.test(valueToTest))) {
      newError = config.emptyError;
    } else {
      newError = "";
    }
    setError(newError);
  };

  useLayoutEffect(() => {
    setFirstRender(false);
    if (!firstRender) {
      validate(value, false);
    }
  }, [validateInput]);

  const handleOnInputChanged = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const handleFocusOut = (e) => {
    e.preventDefault();
    validate(e.target.value, true);
  };

  return (
    <div className="form-item">
      <label htmlFor={inputId}>
        <span className="input-label card-name-label">
          {config.label}
          {config.required ? <span className="mandatory">*</span> : ""}
        </span>
        {children}
        <input
          id={inputId}
          type="text"
          tabIndex="0"
          className={error || invalid ? "invalid" : ""}
          aria-describedby={`${inputId}-error`}
          aria-label={config.label}
          placeholder={config.placeholder}
          onChange={handleOnInputChanged}
          onBlur={handleFocusOut}
          value={value}
          ref={inputRef}
          maxLength={config.maxLength}
          minLength={config.minLength}
          aria-required="true"
          aria-invalid={!!error}
          aria-disabled={disabled}
          disabled={disabled}
        />
      </label>
      <div id={`${inputId}-error`} className="error-info">
        {error}
      </div>
    </div>
  );
};

Input.propTypes = {
  config: PropTypes.shape({}).isRequired,
  inputValue: PropTypes.string,
  defaultError: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
  inputRef: PropTypes.shape({}),
  validateInput: PropTypes.bool,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool
};

Input.defaultProps = {
  inputValue: "",
  defaultError: "",
  validateInput: false,
  inputRef: null,
  disabled: false,
  invalid: false
};

export default Input;
