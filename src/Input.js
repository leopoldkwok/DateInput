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
  const currencyOptions = {
    maximumFractionDigits: 2,
    currency: "GBP",
    style: "currency"
  };

  useLayoutEffect(() => {
    setInputValue(value, error);
  }, [value, error]);

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  useEffect(() => {
    setError(defaultError);
  }, [defaultError]);

  /**
   * Convert string type value to number.
   * Especially for currency input type.
   * @param {string} amount - amount with string type
   * @returns {number} amount in number type.
   */
  const localStringToNumber = (amount) => {
    const regExp = new RegExp(config.currencyPattern, "g");
    return Number(amount.replace(regExp, ""));
  };

  /**
   * remove any special characters except (,) and (.)
   * @param {string} val - user input value.
   * @returns {string} - value with no special characters.
   */
  const formatCurrencyValue = (val) => val.replace(/[^0-9.,]/g, "").trim();

  /**
   * validate currency based on min and max config values.
   * @param {string} targetValue - user entered amount.
   * @param {*} currencyConfig - config related to currency.
   * @param {*} options - currency options.
   */
  const validateCurrencyValue = (targetValue, currencyConfig, options) => {
    // Remove all special characters except decimal for money comparisons
    const amount = String(targetValue).replace(/[^\d.]/g, "");
    const validationResult = {
      result: formatCurrencyValue(
        localStringToNumber(amount).toLocaleString(undefined, options)
      ),
      errorMessage: ""
    };

    switch (true) {
      case amount < currencyConfig.minAmount:
        validationResult.errorMessage = currencyConfig.minAmountError;
        break;
      case amount > currencyConfig.maxAmount:
        validationResult.errorMessage = currencyConfig.maxAmountError;
        break;
      default:
        break;
    }

    return validationResult;
  };

  const validate = (valueToTest, shouldSetValue) => {
    const inputPattern = new RegExp(config.pattern);
    let newError = "";
    if (valueToTest && inputPattern && !inputPattern.test(valueToTest)) {
      newError = config.invalidError;
    } else if (config.required && (!valueToTest || !/\S/.test(valueToTest))) {
      newError = config.emptyError;
    } else {
      newError = "";
    }

    // If input type is currency perform extra validation to get currency value.
    if (
      config.inputType === "currency" &&
      valueToTest &&
      inputPattern.test(valueToTest)
    ) {
      const { result, errorMessage } = validateCurrencyValue(
        valueToTest,
        config,
        currencyOptions
      );
      if (shouldSetValue) {
        setValue(result);
      }
      newError = errorMessage;
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
