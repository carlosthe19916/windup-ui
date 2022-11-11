import React, { useEffect, useRef, useState } from "react";
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
  Text,
  TextContent,
} from "@patternfly/react-core";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

import { useRulesQuery } from "queries/rules";
import { AppFile, Hint } from "api/models";
import { getMarkdown } from "utils/rule-utils";
import { SimpleMarkdown } from "./simple-markdown";
import { useFileQuery } from "queries/files";
import { ConditionalRender } from "@project-openubl/lib-ui";

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
  const fileContent = useFileQuery(file.id);

  // Editor
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>();
  const monacoRef = useRef<typeof monacoEditor>();
  useEffect(() => {
    return () => {
      monacoRef.current?.editor.getModels().forEach((model) => model.dispose());
      editorRef.current?.dispose();
    };
  }, [editorRef, monacoRef]);

  // Disposables
  const [disposables, setDisposables] = useState<monacoEditor.IDisposable[]>(
    []
  );
  useEffect(() => {
    return () => {
      disposables.forEach((disposable) => disposable && disposable.dispose());
    };
  }, [disposables]);

  const drawerRef = React.useRef<any>();
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [drawerHint, setDrawerHint] = useState<Hint>();
  const onDrawerExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  /**
   * Adds the left Windup icon to the editor
   */
  const addDeltaDecorations = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
    hints: Hint[]
  ) => {
    const decorations = hints.map((hint) => {
      const decoration = {
        range: new monaco.Range(hint.line, 1, hint.line, 1),
        options: {
          isWholeLine: true,
          glyphMarginClassName: "windupGlyphMargin",
        },
      };
      return decoration;
    });

    editor.deltaDecorations([], decorations);
  };

  /**
   * Adds actions on top of the line with a Hint
   */
  const addCodeLens = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
    hints: Hint[]
  ) => {
    const lenses = hints.map((hint) => {
      const lense: monacoEditor.languages.CodeLens = {
        range: new monaco.Range(hint.line!, 1, hint.line!, 1),
        id: "view-hint",
        command: {
          title: "View Hint",
          id: editor.addCommand(
            0,
            () => {
              setDrawerHint(hint);
              setIsDrawerExpanded(true);
            },
            ""
          )!,
        },
      };
      return lense;
    });

    const codeLens = monaco.languages.registerCodeLensProvider("*", {
      provideCodeLenses: (model, token) => {
        return {
          lenses: lenses,
          dispose: () => {
            // codeLens.dispose();
          },
        };
      },
      resolveCodeLens: (model, codeLens, token) => {
        return codeLens;
      },
    });

    return codeLens;
  };

  /**
   * Adds a hover text to the hint line
   */
  const addHover = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
    hints: Hint[]
  ) => {
    return hints.map((hint) => {
      return monaco.languages.registerHoverProvider("*", {
        provideHover: (model, position) => {
          if (position.lineNumber !== hint.line) {
            return undefined;
          }

          return {
            range: new monaco.Range(hint.line!, 1, hint.line!, 1),
            contents: [
              {
                value: getMarkdown(hint.content, hint.links),
              },
            ],
          };
        },
      });
    });
  };

  /**
   * Underlines the hint line
   */
  const addMarkers = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor,
    hints: Hint[]
  ) => {
    const markers = hints.map((hint) => {
      const rule = allRules.data?.find((f) => f.id === hint.ruleId);
      const marker: monacoEditor.editor.IMarkerData = {
        startLineNumber: hint.line,
        startColumn: 0,
        endLineNumber: hint.line,
        endColumn: 1000,
        message: hint.content,
        source: rule?.id,
        severity: monaco.MarkerSeverity.Warning,
      };
      return marker;
    });

    const model = monaco.editor.getModels()[0];
    monaco.editor.setModelMarkers(model, "*", markers);
  };

  const onEditorDidMount = (
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor
  ) => {
    editor.layout();
    editor.focus();
    monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });

    const hints = file?.hints || [];
    let newDisposables: monacoEditor.IDisposable[] = [];

    // Add markers
    addMarkers(editor, monaco, file?.hints || []);

    // Add code lenses
    const codeLens = addCodeLens(editor, monaco, hints);
    newDisposables.push(codeLens);

    // Add delta decorations
    addDeltaDecorations(editor, monaco, hints);

    // Add hovers
    const hovers = addHover(editor, monaco, hints);
    newDisposables = newDisposables.concat(hovers);

    setDisposables(newDisposables);

    // const hintTo = hintToFocus || firstHint;
    // if (hintTo && hintTo.line) {
    //   editor.revealLineInCenter(hintTo.line);
    // }

    // Open warning programatically
    // editor.trigger("anystring", `editor.action.marker.next`, "s");

    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  return (
    <Drawer isExpanded={isDrawerExpanded} onExpand={onDrawerExpand} isInline>
      <DrawerContent
        panelContent={
          <DrawerPanelContent
            isResizable
            defaultSize={"800px"}
            minSize={"350px"}
          >
            <DrawerHead>
              <Card isLarge>
                <CardHeader>
                  <CardActions hasNoOffset>
                    <DrawerActions>
                      <DrawerCloseButton
                        onClick={() => setIsDrawerExpanded(false)}
                      />
                    </DrawerActions>
                  </CardActions>
                  <CardTitle>
                    <TextContent>
                      <Text component="h1">{drawerHint?.title}</Text>
                      <Text component="small">Line: {drawerHint?.line}</Text>
                    </TextContent>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  {drawerHint && (
                    <SimpleMarkdown children={drawerHint.content} />
                  )}
                </CardBody>
              </Card>
            </DrawerHead>
          </DrawerPanelContent>
        }
      >
        <DrawerContentBody>
          <ConditionalRender
            when={fileContent.isLoading}
            then={<span>Loading...</span>}
          >
            <CodeEditor
              isDarkTheme
              isLineNumbersVisible
              isReadOnly
              isMinimapVisible
              isLanguageLabelVisible
              isDownloadEnabled
              code={fileContent.data?.content}
              language={Object.values(Language).find(
                (l) => l === file.sourceType.toLowerCase()
              )}
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
              height={`${window.innerHeight - 300}px`}
              {...props}
            />
          </ConditionalRender>
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};
