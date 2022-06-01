import React from "react";
import {
  CodeEditor,
  CodeEditorProps,
  Language,
} from "@patternfly/react-code-editor";
import { useRulesQuery } from "queries/rules";

import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import { AppFile, Hint } from "api/models";
import { getMarkdown } from "utils/rule-utils";
import { MarkdownPreview } from "./markdown-preview";

interface IFileEditorProps {
  file: AppFile;
  hintToFocus?: Hint;
  props?: Partial<
    Omit<CodeEditorProps, "ref" | "code" | "options" | "onEditorDidMount">
  >;
}

export const FileEditor: React.FC<IFileEditorProps> = ({
  file,
  props,
  hintToFocus,
}) => {
  const allRules = useRulesQuery();

  /**
   * Adds the left Windup icon to the editor
   */
  const addDeltaDecorations = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
    hint: Hint
  ) => {
    if (hint.line === undefined) {
      return;
    }

    editor.deltaDecorations(
      [],
      [
        {
          range: new monaco.Range(hint.line, 1, hint.line, 1),
          options: {
            isWholeLine: true,
            glyphMarginClassName: "windupGlyphMargin",
          },
        },
      ]
    );
  };

  /**
   * Adds actions on to of the line with a Hint
   */
  const addCodeLens = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
    hint: Hint,
    setMarkdown: (value: string) => void,
    toggleIsExpanded: () => void
  ) => {
    const rule = allRules.data?.find((f) => f.id === hint.rule.id);
    if (!rule) {
      return;
    }

    const language = monaco.editor.getModels()[0].getLanguageId();

    const commandId = editor.addCommand(
      0,
      () => {
        setMarkdown(rule.message);
        toggleIsExpanded();
      },
      ""
    );

    monaco.languages.registerCodeLensProvider(language, {
      provideCodeLenses: (model, token) => {
        return {
          lenses: [
            {
              range: new monaco.Range(hint.line!, 1, hint.line!, 1),
              id: "view-hint",
              command: {
                id: commandId!,
                title: "View Hint",
              },
            },
          ],
          dispose: () => {},
        };
      },
      resolveCodeLens: (model, codeLens, token) => {
        return codeLens;
      },
    });
  };

  /**
   * Adds a hover text to the hint line
   */
  const addHover = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
    hint: Hint
  ) => {
    const rule = allRules.data?.find((f) => f.id === hint.rule.id);
    if (!rule) {
      return;
    }

    const language = monaco.editor.getModels()[0].getLanguageId();

    monaco.languages.registerHoverProvider(language, {
      provideHover: (model, position) => {
        if (position.lineNumber !== hint.line) {
          return undefined;
        }

        return {
          range: new monaco.Range(hint.line!, 1, hint.line!, 1),
          contents: [
            {
              value: getMarkdown(rule),
            },
          ],
        };
      },
    });
  };

  /**
   * Underlines the hint line
   */
  const addMarkers = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
    hint: Hint
  ) => {
    if (hint.line === undefined) {
      return;
    }

    const rule = allRules.data?.find((f) => f.id === hint.rule.id);
    if (!rule) {
      return;
    }

    const model = monaco.editor.getModels()[0];
    monaco.editor.setModelMarkers(model, "filename", [
      {
        startLineNumber: hint.line,
        startColumn: 0,
        endLineNumber: hint.line,
        endColumn: 1000,
        message: rule.title,
        source: rule.id,
        severity: monaco.MarkerSeverity.Warning,
      },
    ]);
  };

  const onEditorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
    setMarkdown: (value: string) => void,
    toggleIsExpanded: () => void
  ) => {
    editor.layout();
    editor.focus();
    monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });

    let firstHint;
    file?.hints.forEach((hint, index) => {
      addMarkers(editor, monaco, hint);
      addHover(editor, monaco, hint);
      addCodeLens(editor, monaco, hint, setMarkdown, toggleIsExpanded);
      addDeltaDecorations(editor, monaco, hint);

      if (index === 0) {
        firstHint = hint;
      }
    });

    const hintTo = hintToFocus || firstHint;
    if (hintTo && hintTo.line) {
      editor.revealLineInCenter(hintTo.line);
    }

    // Open warning programatically
    // editor.trigger("anystring", `editor.action.marker.next`, "s");
  };

  return (
    <MarkdownPreview>
      {({ toggleIsExpanded, setMarkdown }) => {
        return (
          <CodeEditor
            isDarkTheme
            isLineNumbersVisible
            isReadOnly
            isMinimapVisible
            isLanguageLabelVisible
            isDownloadEnabled
            code={file?.fileContent}
            language={Language.java}
            options={{
              glyphMargin: true,
              "semanticHighlighting.enabled": true,
              renderValidationDecorations: "on",
            }}
            onEditorDidMount={(
              editor: monacoEditor.editor.IStandaloneCodeEditor,
              monaco: typeof monacoEditor
            ) => {
              onEditorDidMount(editor, monaco, setMarkdown, toggleIsExpanded);
            }}
            height="800px"
            {...props}
          />
        );
      }}
    </MarkdownPreview>
  );
};
