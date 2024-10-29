export const handleDescriptionKeyDown = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  currentValue: string,
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  setFormData: (callback: (prev: any) => any) => void
) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const { selectionStart, selectionEnd } = e.currentTarget;

    const newValue =
      currentValue.substring(0, selectionStart) +
      "\\n" +
      currentValue.substring(selectionEnd);

    setFormData((prev) => ({ ...prev, description: newValue }));

    const newCursorPosition = selectionStart + 2;
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
        textareaRef.current.focus();
      }
    });
  }
};
