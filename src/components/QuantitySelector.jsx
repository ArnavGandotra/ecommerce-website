import React from 'react';

function QuantitySelector({ value, min = 1, max = 10, onChange, label }) {
  const labelText = label === undefined ? 'Quantity' : label;

  return (
    <label className={`quantity-select${labelText ? '' : ' quantity-select--no-label'}`}>
      {labelText ? <span>{labelText}</span> : null}
      <select
        value={value}
        aria-label="Quantity"
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {Array.from({ length: max - min + 1 }, (_, index) => min + index).map((quantity) => (
          <option key={quantity} value={quantity}>
            {quantity}
          </option>
        ))}
      </select>
    </label>
  );
}

export default QuantitySelector;
