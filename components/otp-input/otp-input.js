/**
 * OTP Input
 *
 * Features:
 * - Auto-advance to next input on typing
 * - Backspace navigates to previous input
 * - Paste support (distributes digits across inputs)
 * - Arrow key navigation
 *
 * Usage:
 *   import { createOTPInput } from 'modest-ui/components/otp-input/otp-input.js';
 *
 *   const otp = createOTPInput(document.querySelector('.mdst-otp'), {
 *     onComplete: (code) => console.log('Code entered:', code),
 *     onChange: (code) => console.log('Current value:', code),
 *   });
 *
 *   // Methods
 *   otp.getValue();  // Returns current OTP value
 *   otp.setValue('1234');  // Set OTP value programmatically
 *   otp.clear();     // Clear all inputs
 *   otp.focus();     // Focus first input
 *   otp.destroy();   // Remove event listeners
 */

export function createOTPInput(container, options = {}) {
  const { onComplete = () => {}, onChange = () => {} } = options;

  const inputs = Array.from(container.querySelectorAll(".mdst-otp-digit"));

  if (inputs.length === 0) {
    console.warn("createOTPInput: No .mdst-otp-digit elements found");
    return null;
  }

  function getValue() {
    return inputs.map((input) => input.value).join("");
  }

  function setValue(value) {
    const digits = value.replace(/\D/g, "").split("");
    inputs.forEach((input, i) => {
      input.value = digits[i] || "";
    });
    onChange(getValue());
  }

  function clear() {
    inputs.forEach((input) => {
      input.value = "";
    });
    onChange("");
  }

  function focus() {
    inputs[0]?.focus();
  }

  function focusInput(index) {
    const target = inputs[Math.max(0, Math.min(index, inputs.length - 1))];
    target?.focus();
    target?.select();
  }

  function checkComplete() {
    const value = getValue();
    onChange(value);
    if (value.length === inputs.length && !value.includes("")) {
      onComplete(value);
    }
  }

  function handleInput(e) {
    const input = e.target;
    const index = inputs.indexOf(input);

    // Only keep the last character if multiple entered
    if (input.value.length > 1) {
      input.value = input.value.slice(-1);
    }

    // Only allow digits
    input.value = input.value.replace(/\D/g, "");

    // Auto-advance to next input
    if (input.value && index < inputs.length - 1) {
      focusInput(index + 1);
    }

    checkComplete();
  }

  function handleKeyDown(e) {
    const input = e.target;
    const index = inputs.indexOf(input);

    switch (e.key) {
      case "Backspace":
        if (!input.value && index > 0) {
          // If empty, go to previous and clear it
          e.preventDefault();
          focusInput(index - 1);
          inputs[index - 1].value = "";
          onChange(getValue());
        }
        break;

      case "Delete":
        // Clear current and stay
        input.value = "";
        onChange(getValue());
        break;

      case "ArrowLeft":
        e.preventDefault();
        focusInput(index - 1);
        break;

      case "ArrowRight":
        e.preventDefault();
        focusInput(index + 1);
        break;
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").split("");
    const startIndex = inputs.indexOf(e.target);

    digits.forEach((digit, i) => {
      const targetIndex = startIndex + i;
      if (targetIndex < inputs.length) {
        inputs[targetIndex].value = digit;
      }
    });

    // Focus the next empty input or the last one
    const nextEmptyIndex = inputs.findIndex((input) => !input.value);
    focusInput(nextEmptyIndex === -1 ? inputs.length - 1 : nextEmptyIndex);

    checkComplete();
  }

  function handleFocus(e) {
    // Select content on focus for easy replacement
    e.target.select();
  }

  // Attach event listeners
  inputs.forEach((input) => {
    input.addEventListener("input", handleInput);
    input.addEventListener("keydown", handleKeyDown);
    input.addEventListener("paste", handlePaste);
    input.addEventListener("focus", handleFocus);
  });

  function destroy() {
    inputs.forEach((input) => {
      input.removeEventListener("input", handleInput);
      input.removeEventListener("keydown", handleKeyDown);
      input.removeEventListener("paste", handlePaste);
      input.removeEventListener("focus", handleFocus);
    });
  }

  return {
    getValue,
    setValue,
    clear,
    focus,
    destroy,
  };
}
