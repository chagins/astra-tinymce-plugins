import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
  editor.ui.registry.addButton('astra-pagebreak', {
    text: 'astra-pagebreak button',
    onAction: () => {
      editor.setContent('<p>content added from astra-pagebreak</p>');
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('astra-pagebreak', setup);
};
