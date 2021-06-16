import { useState } from "react";
import DateInput from "./DateInput";
import Config from "./config.json";
import "./styles.css";

export default function App() {
  const [validateForm] = useState(false);
  const [formData, setFormData] = useState({
    day: "",
    error: {
      dayError: ""
    }
  });

  const handleName = (value, error) => {
    const newData = { ...formData };
    newData.day = value;
    newData.error.dayError = error;
    setFormData(newData);
  };

  return (
    <div className="App">
      <DateInput
        config={Config.dateOfBirth}
        inputId="input-id"
        inputValue={formData.day}
        setInputValue={handleName}
        validateInput={validateForm}
      />
    </div>
  );
}
