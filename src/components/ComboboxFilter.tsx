import { useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";
import { VisuallyHidden } from "./VisuallyHidden";

const Wrapper = styled.div`
  position: relative;
  max-width: 320px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.35rem;
  color: #1f2933;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #b8c0c8;
  border-radius: 6px;
  background: #fff;

  &:focus-within {
    outline: 3px solid #1a5fb4;
    outline-offset: 1px;
    border-color: #1a5fb4;
  }
`;

const Input = styled.input`
  flex: 1;
  border: none;
  padding: 0.55rem 0.6rem;
  font-size: 0.95rem;
  border-radius: 6px;
  outline: none;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  padding: 0 0.6rem;
  cursor: pointer;
  color: #52606d;
  font-size: 0.85rem;

  &:focus-visible {
    outline: 3px solid #1a5fb4;
    outline-offset: 1px;
  }
`;

const Listbox = styled.ul`
  position: absolute;
  z-index: 10;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 0.25rem 0;
  list-style: none;
  background: #fff;
  border: 1px solid #b8c0c8;
  border-radius: 6px;
  box-shadow: 0 8px 20px rgba(15, 23, 30, 0.12);
`;

const Option = styled.li<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 0.92rem;
  background: ${(p) => (p.$active ? "#e4edf7" : "transparent")};
  color: #1f2933;

  &:hover {
    background: #e4edf7;
  }
`;

interface ComboboxFilterProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

/**
 * Accessible combobox filter following the WAI-ARIA Authoring Practices
 * "Combobox with List Autocomplete" pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * - input has role="combobox" and aria-expanded/aria-controls/aria-activedescendant
 * - the popup list has role="listbox"
 * - options are announced via a visually-hidden live region as they change
 * - fully keyboard operable: ArrowUp/Down, Home/End, Enter, Escape
 */
export function ComboboxFilter({ label, options, value, onChange }: ComboboxFilterProps) {
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const baseId = useId();
  const inputId = `${baseId}-input`;
  const listboxId = `${baseId}-listbox`;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  // Adopt a selection made elsewhere (e.g. restored from the URL) without
  // overwriting a partially typed query, which arrives here as value === null.
  useEffect(() => {
    if (value !== null) setQuery(value);
  }, [value]);

  // aria-activedescendant doesn't move DOM focus, so the browser won't scroll for us
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listboxRef.current
      ?.querySelector(`[id="${CSS.escape(optionId(activeIndex))}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.trim().toLowerCase())
  );

  function openList() {
    setOpen(true);
    setActiveIndex(filtered.length > 0 ? 0 : -1);
  }

  function closeList() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function selectOption(option: string) {
    setQuery(option);
    onChange(option);
    closeList();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      openList();
      e.preventDefault();
      return;
    }
    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(filtered.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && filtered[activeIndex]) {
          selectOption(filtered[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        closeList();
        break;
      case "Tab":
        // must close synchronously; Safari otherwise keeps the popup up as focus leaves
        closeList();
        break;
      default:
        break;
    }
  }

  function handleClear() {
    setQuery("");
    onChange(null);
    closeList();
    inputRef.current?.focus();
  }

  return (
    <Wrapper
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeList();
      }}
    >
      <Label htmlFor={inputId}>{label}</Label>
      <InputRow>
        <Input
          id={inputId}
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          autoComplete="off"
          placeholder="e.g. React, WCAG, Remote"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(null);
            openList();
          }}
          onFocus={openList}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <ClearButton type="button" onClick={handleClear} aria-label={`Clear ${label} filter`}>
            Clear
          </ClearButton>
        )}
      </InputRow>

      {open && filtered.length > 0 && (
        <Listbox id={listboxId} ref={listboxRef} role="listbox" aria-label={label}>
          {filtered.map((option, index) => (
            <Option
              key={option}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
              $active={index === activeIndex}
              onMouseDown={(e) => {
                // onMouseDown (not onClick) so it fires before the input's onBlur
                e.preventDefault();
                selectOption(option);
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {option}
            </Option>
          ))}
        </Listbox>
      )}

      <VisuallyHidden role="status" aria-live="polite">
        {open
          ? filtered.length === 0
            ? "No matching tags"
            : `${filtered.length} matching tag${filtered.length === 1 ? "" : "s"} available`
          : ""}
      </VisuallyHidden>
    </Wrapper>
  );
}
