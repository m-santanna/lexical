/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isParagraphNode,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_LOW,
  EditorState,
  KEY_ENTER_COMMAND,
  LexicalEditor,
} from 'lexical';
import {useEffect} from 'react';

export function clearEditor(editor: LexicalEditor) {
  editor.update(() => {
    const root = $getRoot();
    root.clear();
    const paragraph = $createParagraphNode();
    paragraph.append($createTextNode(''));
    root.append(paragraph);
    if ($isParagraphNode(paragraph)) {
      paragraph.selectEnd();
    }
  });
}

interface SubmitOnEnterPluginProps {
  onSubmit: (editorState: EditorState) => void;
}

export function SubmitOnEnterPlugin({onSubmit}: SubmitOnEnterPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (event !== null && event.shiftKey) {
          return false;
        }
        if (event !== null) {
          event.preventDefault();
        }
        const hasContent = editor
          .getEditorState()
          .read(() => $getRoot().getTextContent().trim() !== '');
        if (hasContent) {
          onSubmit(editor.getEditorState());
          editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
        }
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, onSubmit]);

  return null;
}
