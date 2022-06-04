import React from "react";
import {
  CodeEditor,
  CodeEditorProps,
  Language,
} from "@patternfly/react-code-editor";
import { Rule } from "api/models";

interface IRuleEditorProps {
  rule: Rule;
  props?: Partial<Omit<CodeEditorProps, "ref" | "code">>;
}

export const RuleEditor: React.FC<IRuleEditorProps> = ({ rule, props }) => {
  return (
    <CodeEditor
      isDarkTheme
      isLineNumbersVisible
      isReadOnly
      isMinimapVisible
      isLanguageLabelVisible
      isDownloadEnabled
      code={rule?.content}
      language={Language.xml}
      onEditorDidMount={(editor, monaco) => {
        editor.layout();
        editor.focus();
        monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });
      }}
      height="600px"
      {...props}
    />
  );
};
