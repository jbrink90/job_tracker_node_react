import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Full mock for @mdxeditor/editor when the package is uninstalled
vi.mock('@mdxeditor/editor', () => ({
  MDXEditor: (props: any) => ({
    $$typeof: Symbol.for('react.element'),
    type: 'div',
    key: null,
    ref: null,
    props: {
      'data-testid': 'mdx-editor',
      ...props,
    },
  }),

  headingsPlugin: () => ({}),
  listsPlugin: () => ({}),
  quotePlugin: () => ({}),
  thematicBreakPlugin: () => ({}),
  markdownShortcutPlugin: () => ({}),
  linkPlugin: () => ({}),
  imagePlugin: () => ({}),
  tablePlugin: () => ({}),
  codeBlockPlugin: () => ({}),
  toolbarPlugin: () => ({}),

  BoldItalicUnderlineToggles: () => null,
  BlockTypeSelect: () => null,
  CreateLink: () => null,
  InsertImage: () => null,
  InsertTable: () => null,
  UndoRedo: () => null,
  HighlightToggle: () => null,
  StrikeThroughSupSubToggles: () => null,
}));

vi.mock('@mdxeditor/editor/style.css', () => ({}));