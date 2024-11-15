import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

const EditorContainer = styled.div`
  border: 1px solid #ccc;
  overflow: hidden;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-bottom: 1px solid #ccc;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.15rem;
  }
`;

const ToolbarButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  background: ${props => props.$active ? 'var(--app-yellow)' : 'white'};
  border: 1px solid #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    background: ${props => props.$active ? 'var(--app-yellow)' : '#f0f0f0'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ToolbarGroup = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0 0.5rem;
  border-right: 1px solid #ccc;

  &:last-child {
    border-right: none;
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

  /* Nuevos estilos */
  ul, ol {
    margin: 1em 0;
    padding-left: 2em;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  h3 {
    font-size: 1.17em;
    margin: 0.83em 0;
    color: var(--dark-grey);
  }

  s, strike {
    text-decoration: line-through;
  }

  /* Estilos para alineación */
  [style*="text-align: left"] {
    text-align: left;
  }

  [style*="text-align: center"] {
    text-align: center;
  }

  [style*="text-align: right"] {
    text-align: right;
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

    const ensureSelection = () => {
        if (!selection && editorRef.current) {
            const range = document.createRange();
            range.selectNodeContents(editorRef.current);
            range.collapse(true); // Colapsa al inicio
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(range);
                setSelection(range.cloneRange());
            }
        }
    };

    const handleCommand = (command: string, value?: string) => {
        if (!editorRef.current) return;

        editorRef.current.focus();
        ensureSelection();

        if (selection) {
            restoreSelection();
        }

        // Para los comandos de formato de bloque, necesitamos un manejo especial
        if (command === 'formatBlock') {
            const currentFormat = document.queryCommandValue('formatBlock');
            if (currentFormat === value) {
                // Si ya está en ese formato, lo quitamos
                document.execCommand('formatBlock', false, 'p');
            } else {
                document.execCommand(command, false, value);
            }
        } else {
            document.execCommand(command, false, value);
        }

        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
            saveSelection();
        }
    };

    const isStyleActive = (command: string) => {
        if (command === 'formatBlock') {
            return false; // Los headings no necesitan estado activo
        }
        return document.queryCommandState(command);
    };

    return (
        <EditorContainer>
            <Toolbar>
                <ToolbarGroup>
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
                        onClick={() => handleCommand('strikeThrough')}
                        $active={isStyleActive('strikeThrough')}
                        title="Tachado"
                    >
                        <s>S</s>
                    </ToolbarButton>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarButton
                        type="button"
                        onClick={() => handleCommand('justifyLeft')}
                        $active={isStyleActive('justifyLeft')}
                        title="Alinear a la izquierda"
                    >
                        ←
                    </ToolbarButton>
                    <ToolbarButton
                        type="button"
                        onClick={() => handleCommand('justifyCenter')}
                        $active={isStyleActive('justifyCenter')}
                        title="Centrar"
                    >
                        ↔
                    </ToolbarButton>
                    <ToolbarButton
                        type="button"
                        onClick={() => handleCommand('justifyRight')}
                        $active={isStyleActive('justifyRight')}
                        title="Alinear a la derecha"
                    >
                        →
                    </ToolbarButton>
                </ToolbarGroup>

                <ToolbarGroup>
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
                    <ToolbarButton
                        type="button"
                        onClick={() => handleCommand('formatBlock', 'h3')}
                        title="Título 3"
                    >
                        H3
                    </ToolbarButton>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarButton
                        type="button"
                        onClick={() => handleCommand('insertUnorderedList')}
                        $active={isStyleActive('insertUnorderedList')}
                        title="Lista con viñetas"
                    >
                        •
                    </ToolbarButton>
                    <ToolbarButton
                        type="button"
                        onClick={() => handleCommand('insertOrderedList')}
                        $active={isStyleActive('insertOrderedList')}
                        title="Lista numerada"
                    >
                        1.
                    </ToolbarButton>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarButton
                        type="button"
                        onClick={() => handleCommand('indent')}
                        title="Aumentar sangría"
                    >
                        →|
                    </ToolbarButton>
                    <ToolbarButton
                        type="button"
                        onClick={() => handleCommand('outdent')}
                        title="Disminuir sangría"
                    >
                        |←
                    </ToolbarButton>
                </ToolbarGroup>

                <ToolbarGroup>
                    <ToolbarButton
                        type="button"
                        onClick={() => handleCommand('undo')}
                        title="Deshacer"
                    >
                        ↩
                    </ToolbarButton>
                    <ToolbarButton
                        type="button"
                        onClick={() => handleCommand('redo')}
                        title="Rehacer"
                    >
                        ↪
                    </ToolbarButton>
                </ToolbarGroup>
            </Toolbar>
            <EditorContent
                ref={editorRef}
                contentEditable
                onInput={() => {
                    if (editorRef.current) {
                        onChange(editorRef.current.innerHTML);
                        saveSelection();
                    }
                }}
                onClick={saveSelection}
                onKeyUp={saveSelection}
                onMouseUp={saveSelection}
                onBlur={saveSelection}
                suppressContentEditableWarning
            />
        </EditorContainer>
    );
};

export default CustomEditor;