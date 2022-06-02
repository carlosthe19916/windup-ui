import React, { useEffect, useReducer, useState } from "react";
import {
  CodeEditor,
  CodeEditorProps,
  Language,
} from "@patternfly/react-code-editor";
import {
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardTitle,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
} from "@patternfly/react-core";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

import { useRulesQuery } from "queries/rules";
import { AppFile, Hint } from "api/models";
import { getMarkdown } from "utils/rule-utils";
import { SimpleMarkdown } from "./simple-markdown";

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

  const [hovers, setHovers] = useState<monacoEditor.IDisposable[]>([]);
  useEffect(() => {
    return () => {
      hovers.forEach((element) => {
        element.dispose();
      });
    };
  }, [hovers]);

  const drawerRef = React.useRef<HTMLDivElement>();
  const [isExpanded, toggleIsExpanded] = useReducer((state) => !state, false);
  const [drawerContent, setDrawerContent] = useState("");
  const onDrawerExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

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
    hint: Hint
  ) => {
    const rule = allRules.data?.find((f) => f.id === hint.rule.id);
    if (!rule) {
      return;
    }

    const language = monaco.editor.getModels()[0].getLanguageId();

    const commandId = editor.addCommand(
      0,
      () => {
        setDrawerContent(rule.message);
        toggleIsExpanded();
      },
      ""
    );

    const codeLens = monaco.languages.registerCodeLensProvider(language, {
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
          dispose: () => {
            codeLens.dispose();
          },
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

    const hover = monaco.languages.registerHoverProvider(language, {
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

    setHovers([...hovers, hover]);
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
    monaco: typeof monacoEditor
  ) => {
    editor.layout();
    editor.focus();
    monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });

    let firstHint;
    file?.hints.forEach((hint, index) => {
      addMarkers(editor, monaco, hint);
      addHover(editor, monaco, hint);
      addCodeLens(editor, monaco, hint);
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
    <Drawer isExpanded={isExpanded} onExpand={onDrawerExpand} isInline>
      <DrawerContent
        panelContent={
          <DrawerPanelContent
            isResizable
            defaultSize={"800px"}
            minSize={"350px"}
          >
            <DrawerHead>
              <Card isLarge isPlain>
                <CardHeader>
                  <CardActions hasNoOffset>
                    <DrawerActions>
                      <DrawerCloseButton onClick={toggleIsExpanded} />
                    </DrawerActions>
                  </CardActions>
                  <CardTitle>Hint</CardTitle>
                </CardHeader>
                <CardBody>
                  <SimpleMarkdown children={drawerContent} />
                </CardBody>
              </Card>
            </DrawerHead>
          </DrawerPanelContent>
        }
      >
        <DrawerContentBody>
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
              onEditorDidMount(editor, monaco);
            }}
            height="700px"
            {...props}
          />
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};
