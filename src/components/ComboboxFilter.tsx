import { useId, useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import { Surface } from "./ui/Surface";

const Wrapper = styled.div`
  max-width: 420px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
  color: ${({ theme }) => theme.color.text};
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectShell = styled(Surface)`
  flex: 1;
  border-color: ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};

  &:focus-within {
    outline: 3px solid ${({ theme }) => theme.color.link};
    outline-offset: 1px;
    border-color: ${({ theme }) => theme.color.link};
  }
`;

const Select = styled.select`
  width: 100%;
  border: none;
  padding: 0.55rem 2rem 0.55rem 0.6rem;
  font-size: 0.95rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  outline: none;
  color: ${({ theme }) => theme.color.text};
  background: ${({ theme }) => theme.color.surface};
`;

const ClearButton = styled.button`
  align-self: stretch;
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0 0.75rem;
  cursor: pointer;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.85rem;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.link};
    outline-offset: 1px;
  }
`;

interface ComboboxFilterProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

export function ComboboxFilter({ label, options, value, onChange }: ComboboxFilterProps) {
  const selectId = useId();
  const selectRef = useRef<HTMLSelectElement>(null);

  useLayoutEffect(() => {
    const selectedValue = value ?? "";

    for (const option of selectRef.current?.options ?? []) {
      option.toggleAttribute("selected", option.value === selectedValue);
    }
  }, [options, value]);

  return (
    <Wrapper>
      <Label htmlFor={selectId}>{label}</Label>
      <ControlRow>
        <SelectShell>
          <Select
            id={selectId}
            ref={selectRef}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value || null)}
          >
            <option value="" />
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </SelectShell>
        <ClearButton
          type="button"
          onClick={() => onChange(null)}
          aria-label="Clear tag filter"
        >
          Clear
        </ClearButton>
      </ControlRow>
    </Wrapper>
  );
}
