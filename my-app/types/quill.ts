import React from 'react';
import Quill from 'quill';

export interface ReactQuillProps {
  theme?: string;
  modules?: any;
  formats?: string[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, delta: any, source: any, editor: any) => void;
  onTextChange?: (value: string, delta: any, source: any, editor: any) => void;
  onSelectionChange?: (range: any, source: any, editor: any) => void;
  onFocus?: (range: any, source: any, editor: any) => void;
  onBlur?: (previousRange: any, source: any, editor: any) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyPress?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  readOnly?: boolean;
  style?: React.CSSProperties;
  className?: string;
  tabIndex?: number;
  bounds?: string | HTMLElement;
  scrollingContainer?: string | HTMLElement;
}

export interface ReactQuillRef {
  getEditor(): Quill;
  focus(): void;
  blur(): void;
}

declare const ReactQuill: React.ForwardRefExoticComponent<ReactQuillProps & React.RefAttributes<ReactQuillRef>>;

export default ReactQuill;
