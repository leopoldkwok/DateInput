import { useState } from "react";
import Input from "./Input";
import Config from "./config.json";
import "./styles.css";

export default function App() {
  const [validateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    error: {
      nameError: ""
    }
  });

  const handleName = (value, error) => {
    const newData = { ...formData };
    newData.name = value;
    newData.error.nameError = error;
    setFormData(newData);
  };

  return (
    <div className="App">
      <Input
        config={Config.input}
        inputId="input-id"
        inputValue={formData.name}
        setInputValue={handleName}
        validateInput={validateForm}
      />
    </div>
  );
}
