import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

const EditorContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-bottom: 1px solid #ccc;
`;

const ToolbarButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem;
  background: ${props => props.$active ? 'var(--app-yellow)' : 'white'};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$active ? 'var(--app-yellow)' : '#f0f0f0'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const EditorContent = styled.div`
  min-height: 300px;
  padding: 1rem;
  outline: none;
  direction: ltr;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: var(--dark-grey);
  font-size: 1rem;
  line-height: 1.5;

  &:focus {
    outline: none;
  }

  /* Estilos para el contenido editado */
  b, strong {
    font-weight: bold;
    color: var(--dark-grey);
  }

  i, em {
    font-style: italic;
    color: var(--dark-grey);
  }

  u {
    text-decoration: underline;
    color: var(--dark-grey);
  }

  h1 {
    font-size: 2em;
    margin: 0.67em 0;
    color: var(--dark-grey);
  }

  h2 {
    font-size: 1.5em;
    margin: 0.75em 0;
    color: var(--dark-grey);
  }

  p {
    margin: 1em 0;
    color: var(--dark-grey);
  }
`;

const CustomEditor: React.FC<EditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [selection, setSelection] = useState<Range | null>(null);

    useEffect(() => {
        if (editorRef.current && !editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            setSelection(sel.getRangeAt(0).cloneRange());
        }
    };

    const restoreSelection = () => {
        if (selection && editorRef.current) {
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(selection);
            }
        }
    };

    const handleCommand = (command: string, value?: string) => {
        editorRef.current?.focus();

        if (selection) {
            restoreSelection();
        }

        document.execCommand(command, false, value);

        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
            saveSelection();
        }
    };

    const isStyleActive = (command: string) => {
        return document.queryCommandState(command);
    };

    return (
        <EditorContainer>
            <Toolbar>
                <ToolbarButton
                    type="button"
                    onClick={() => handleCommand('bold')}
                    $active={isStyleActive('bold')}
                    title="Negrita"
                >
                    <strong>B</strong>
                </ToolbarButton>
                <ToolbarButton
                    type="button"
                    onClick={() => handleCommand('italic')}
                    $active={isStyleActive('italic')}
                    title="Cursiva"
                >
                    <em>I</em>
                </ToolbarButton>
                <ToolbarButton
                    type="button"
                    onClick={() => handleCommand('underline')}
                    $active={isStyleActive('underline')}
                    title="Subrayado"
                >
                    <u>U</u>
                </ToolbarButton>
                <ToolbarButton
                    type="button"
                    onClick={() => handleCommand('formatBlock', 'h1')}
                    title="Título 1"
                >
                    H1
                </ToolbarButton>
                <ToolbarButton
                    type="button"
                    onClick={() => handleCommand('formatBlock', 'h2')}
                    title="Título 2"
                >
                    H2
                </ToolbarButton>
            </Toolbar>
            <EditorContent
                ref={editorRef}
                contentEditable
                onInput={() => {
                    if (editorRef.current) {
                        onChange(editorRef.current.innerHTML);
                    }
                }}
                onBlur={saveSelection}
                suppressContentEditableWarning
            />
        </EditorContainer>
    );
};

export default CustomEditor; 