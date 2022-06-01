import React, { useReducer, useState } from "react";

import {
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
} from "@patternfly/react-core";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

export interface ChildrenProps {
  setMarkdown: (value: string) => void;
  toggleIsExpanded: () => void;
}

interface IMarkdownPreviewProps {
  children: (args: ChildrenProps) => any;
}

export const MarkdownPreview: React.FC<IMarkdownPreviewProps> = ({
  children,
}) => {
  const [isExpanded, toggleIsExpanded] = useReducer((state) => !state, false);
  const drawerRef = React.useRef<HTMLDivElement>();

  const [markdown, setMarkdown] = useState("");

  const onExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  return (
    <Drawer isExpanded={isExpanded} onExpand={onExpand} isInline>
      <DrawerContent
        panelContent={
          <DrawerPanelContent
            isResizable
            defaultSize={"800px"}
            minSize={"350px"}
          >
            <DrawerHead>
              <ReactMarkdown
                className="markdown-body"
                children={markdown}
                remarkPlugins={[remarkGfm]}
                linkTarget="_blank"
                rawSourcePos
              />
              <DrawerActions>
                <DrawerCloseButton onClick={toggleIsExpanded} />
              </DrawerActions>
            </DrawerHead>
          </DrawerPanelContent>
        }
      >
        <DrawerContentBody>
          {children({ toggleIsExpanded, setMarkdown })}
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};
