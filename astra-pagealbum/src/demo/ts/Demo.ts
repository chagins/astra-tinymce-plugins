import { TinyMCE } from 'tinymce';

import Plugin from '../../main/ts/Plugin';

declare let tinymce: TinyMCE;

Plugin();

tinymce.init({
  icons: 'custom',
  selector: 'textarea.tinymce',
  plugins: 'code astra-pagealbum astra-pagebreak lists pagebreak',
  toolbar: 'astra-pagebreak astra-pagealbum bullist pagebreak',
  height: 700,
  newline_behavior: 'block',
});
