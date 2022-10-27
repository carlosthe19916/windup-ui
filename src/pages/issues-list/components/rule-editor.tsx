import React, { useEffect, useRef } from "react";
import {
  CodeEditor,
  CodeEditorProps,
  Language,
} from "@patternfly/react-code-editor";
import { Rule } from "api/models";

import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import { useRuleQuery } from "queries/rules";
import { ConditionalRender } from "@project-openubl/lib-ui";

interface IRuleEditorProps {
  rule: Rule;
  props?: Partial<Omit<CodeEditorProps, "ref" | "code">>;
}

export const RuleEditor: React.FC<IRuleEditorProps> = ({ rule, props }) => {
  const ruleQuery = useRuleQuery(rule.id);

  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor>();
  const monacoRef = useRef<typeof monacoEditor>();
  useEffect(() => {
    return () => {
      monacoRef.current?.editor.getModels().forEach((model) => model.dispose());
    };
  }, [monacoRef]);

  return (
    <ConditionalRender
      when={ruleQuery.isLoading}
      then={<span>Loading...</span>}
    >
      <CodeEditor
        key={rule.id}
        isDarkTheme
        isLineNumbersVisible
        isReadOnly
        isMinimapVisible
        isLanguageLabelVisible
        isDownloadEnabled
        code={ruleQuery.data?.content}
        language={Language.xml}
        onEditorDidMount={(editor, monaco) => {
          editor.layout();
          editor.focus();
          monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });

          editorRef.current = editor;
          monacoRef.current = monaco;
        }}
        height="600px"
        {...props}
      />
    </ConditionalRender>
  );
};
