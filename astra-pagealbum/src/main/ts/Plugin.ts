import { Editor, TinyMCE, PluginManager } from 'tinymce';

declare const tinymce: TinyMCE;

type TBeforeSetContentEvent = {
  format: string;
  set: boolean;
  no_events?: boolean;
  no_selection?: boolean;
  paste?: boolean;
  load?: boolean;
  initial?: boolean;
  content: string;
  selection?: boolean;
};

type TToggleButtonApi = {
  isActive: () => boolean;
  setActive: (state: boolean) => void;
};

const setup = (): void => {
  const pluginManager: PluginManager = tinymce.util.Tools.resolve('tinymce.PluginManager');
  let placeholderObserver: MutationObserver;
  const tagsThatCanBeSplit = ['P', 'SPAN'];
  const propertiesTypes = ['start', 'end'] as const;

  type TPropertyType = (typeof propertiesTypes)[number];
  type TResultType = { [key in TPropertyType]: string };
  type TProperties = {
    defaultHtmlSeparator: TResultType;
    htmlSeparatorOptionName: TResultType;
    svgPlaceholderOptionName: TResultType;
    astraPageAlbumClass: TResultType;
    defaultSvg: TResultType;
    commandNames: TResultType;
  };

  const properties: TProperties = {
    defaultHtmlSeparator: {
      start: '<!-- astra-pagealbum-start -->',
      end: '<!-- astra-pagealbum-end -->',
    },
    defaultSvg: {
      start:
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjUzMCIKICAgaGVpZ2h0PSIyMSIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMTQwLjIyNTM1IDUuNTU2MzE0MSIKICAgaWQ9InN2ZzgiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEyIiAvPgogIDxnCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTkuMTUwOSwtOC45MTc5KSIKICAgICBpZD0iZzYiPgogICAgPHRleHQKICAgICAgIHg9IjkuMTYyNjcxMSIKICAgICAgIHk9IjEzLjMzOTk2OCIKICAgICAgIHN0eWxlPSJmb250LXNpemU6NC4yMzMzOHB4O2xpbmUtaGVpZ2h0OjEuMjU7Zm9udC1mYW1pbHk6J1NlZ29lIFVJJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDtmaWxsOiMwMDc4ZDI7c3Ryb2tlLXdpZHRoOjAuMjY0NTgiCiAgICAgICB4bWw6c3BhY2U9InByZXNlcnZlIgogICAgICAgaWQ9InRleHQ0Ij48dHNwYW4KICAgICAgICAgeD0iOS4xNjI2NzExIgogICAgICAgICB5PSIxMy4zMzk5NjgiCiAgICAgICAgIHN0eWxlPSJmb250LXNpemU6NC4yMzMzOHB4O2ZvbnQtZmFtaWx5OidTZWdvZSBVSSc7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtZWFzdC1hc2lhbjpub3JtYWw7ZmlsbDojMDA3OGQyO3N0cm9rZS13aWR0aDowLjI2NDU4IgogICAgICAgICBpZD0idHNwYW4yIj4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPHRzcGFuCiAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTo0LjIzMzM4cHg7Zm9udC1mYW1pbHk6J1NlZ29lIFVJJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidTZWdvZSBVSSwgTm9ybWFsJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtcG9zaXRpb246bm9ybWFsO2ZvbnQtdmFyaWFudC1jYXBzOm5vcm1hbDtmb250LXZhcmlhbnQtbnVtZXJpYzpub3JtYWw7Zm9udC12YXJpYW50LWVhc3QtYXNpYW46bm9ybWFsIgogICBpZD0idHNwYW44Nzc1NyI+8J+hszwvdHNwYW4+INCQ0LvRjNCx0L7QvNC90LDRjyDQvtGA0LjQtdC90YLQsNGG0LjRjyDwn6GzLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTwvdHNwYW4+PC90ZXh0PgogIDwvZz4KPC9zdmc+Cg==',
      end: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjUzMCIKICAgaGVpZ2h0PSIyMSIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMTQwLjIyNTM1IDUuNTU2MzE0MSIKICAgaWQ9InN2ZzgiCiAgIHNvZGlwb2RpOmRvY25hbWU9InBhZ2UtYWxidW0tbWFya2VyLWVuZC5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMS4yIChiOGUyNWJlODMzLCAyMDIyLTAyLTA1KSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMTIiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcxMCIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICB3aWR0aD0iNjA3cHgiCiAgICAgaGVpZ2h0PSIyMS4zNjNweCIKICAgICBpbmtzY2FwZTp6b29tPSIxLjQ3Mzc2MTEiCiAgICAgaW5rc2NhcGU6Y3g9IjMxNC44NDA3MiIKICAgICBpbmtzY2FwZTpjeT0iNTUuNjM5OTU0IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDA5IgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJnNiIgLz4KICA8ZwogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05LjE1MDksLTguOTE3OSkiCiAgICAgaWQ9Imc2Ij4KICAgIDx0ZXh0CiAgICAgICB4PSI5LjE2MjY3MTEiCiAgICAgICB5PSIxMi45ODA5MDYiCiAgICAgICBzdHlsZT0iZm9udC1zaXplOjQuMjMzMzhweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OidTZWdvZSBVSSc7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtZWFzdC1hc2lhbjpub3JtYWw7ZmlsbDojMDA3OGQyO3N0cm9rZS13aWR0aDowLjI2NDU4IgogICAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICAgIGlkPSJ0ZXh0NCI+PHRzcGFuCiAgICAgICAgIHg9IjkuMTYyNjcxMSIKICAgICAgICAgeT0iMTIuOTgwOTA2IgogICAgICAgICBzdHlsZT0iZm9udC1zaXplOjQuMjMzMzhweDtmb250LWZhbWlseTonU2Vnb2UgVUknO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1jYXBzOm5vcm1hbDtmb250LXZhcmlhbnQtbnVtZXJpYzpub3JtYWw7Zm9udC12YXJpYW50LWVhc3QtYXNpYW46bm9ybWFsO2ZpbGw6IzAwNzhkMjtzdHJva2Utd2lkdGg6MC4yNjQ1OCIKICAgICAgICAgaWQ9InRzcGFuMiI+LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLfCfobEg0JDQu9GM0LHQvtC80L3QsNGPINC+0YDQuNC10L3RgtCw0YbQuNGPIPCfobEtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPC90c3Bhbj48L3RleHQ+CiAgPC9nPgo8L3N2Zz4K',
    },
    htmlSeparatorOptionName: {
      start: 'astra_pagealbum_start_separator',
      end: 'astra_pagealbum_end_separator',
    },
    svgPlaceholderOptionName: {
      start: 'astra_pagealbum_start_svg_data_URI',
      end: 'astra_pagealbum_end_svg_data_URI',
    },
    astraPageAlbumClass: {
      start: 'mce-astra-pagealbum-start',
      end: 'mce-astra-pagealbum-end',
    },
    commandNames: {
      start: 'mceAstraPageAlbumStart',
      end: 'mceAstraPageAlbumEnd',
    },
  };

  const getHtmlSeparatorOption = (editor: Editor, type: TPropertyType) => {
    return editor.options.get(properties.htmlSeparatorOptionName[type]) as string;
  };

  const getSvgPlaceholderOption = (editor: Editor, type: TPropertyType) => {
    return editor.options.get(properties.svgPlaceholderOptionName[type]) as string;
  }

  const getRegExpHTMlSeparator = (editor: Editor) => {
    const regexpStr = propertiesTypes
      .reduce<string[]>((acc, type) => {
        const htmlSeparator = getHtmlSeparatorOption(editor, type);
        return acc.concat(htmlSeparator);
      }, [])
      .join('|');
    return new RegExp(regexpStr, 'gi');
  };

  const getHTMLPlaceholder = (editor: Editor, type: TPropertyType) => {
    const svg = getSvgPlaceholderOption(editor, type);
    const className = properties.astraPageAlbumClass[type];
    const html = `<img style="display: block;" src="${svg}" class="${className}" data-mce-resize="false" data-mce-placeholder />`;
    return `<p>${html}</p>`;
  };

  const getNodePlaceholder = (editor: Editor, type: TPropertyType) => {
    const html = getHTMLPlaceholder(editor, type);
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild;
  };

  const isAlbumPagePlaceholder = (element: Element, pageAlbumClassName: string) => {
    const isImgPlaceholder =
      element.tagName === 'IMG' && element.classList.contains(pageAlbumClassName);
    const isParagraphPlaceholder =
      element.tagName === 'P' &&
      element?.children?.length > 0 &&
      element?.children.item(0)?.classList.contains(pageAlbumClassName);
    return isImgPlaceholder || isParagraphPlaceholder;
  };

  const isSpecificAlbumPagePlaceholder = (element: Element, type: TPropertyType) => {
    if (!element) {
      return false;
    }
    const pageAlbumClassName = properties.astraPageAlbumClass[type];
    return isAlbumPagePlaceholder(element, pageAlbumClassName);
  };

  const isAnyAlbumPagePlaceholder = (...elements: Element[]) => {
    return elements.some((element) =>
      propertiesTypes.some((type) => isSpecificAlbumPagePlaceholder(element, type))
    );
  };

  const contentContainsPlaceholders = (editor: Editor) => {
    let result = false;
    const topStartElement = getTopParentElement(editor.selection.getStart());
    const topEndElement = getTopParentElement(editor.selection.getEnd());
    let currentElement = topStartElement;

    while (currentElement && currentElement !== topEndElement) {
      if (isAnyAlbumPagePlaceholder(currentElement)) {
        result = true;
      }
      currentElement = currentElement.nextElementSibling;
    }

    return result;
  };

  const contentWrappedInPlaceholders = (editor: Editor) => {
    const selection = editor.selection;
    const startElement = selection.getStart();
    const endElement = selection.getEnd();
    const topSibling = getSiblingElement(getTopParentElement(startElement), 'start');
    const endSibling = getSiblingElement(getTopParentElement(endElement), 'end');

    const isStartPageAlbumPlaceholder = isSpecificAlbumPagePlaceholder(topSibling, 'start');
    const isEndPageAlbumPlaceholder = isSpecificAlbumPagePlaceholder(endSibling, 'end');
    return isStartPageAlbumPlaceholder && isEndPageAlbumPlaceholder;
  };

  const getTopParentElement = (element: Element) => {
    let currentElement = element;
    while (
      currentElement &&
      currentElement.parentElement?.tagName !== 'HTML' &&
      currentElement.parentElement?.tagName !== 'BODY'
    ) {
      currentElement = currentElement.parentElement;
    }
    return currentElement;
  };

  const getSiblingElement = (element: Element, direction: TPropertyType) => {
    return direction === 'start' ? element.previousElementSibling : element.nextElementSibling;
  };

  const findPageAlbumPlaceholder = (currentElement: Element, direction: TPropertyType) => {
    let siblingElement: Element | null = currentElement;
    while (siblingElement) {
      const propertyType = propertiesTypes.find((type) =>
        isSpecificAlbumPagePlaceholder(siblingElement, type)
      );
      if (propertyType === direction) {
        break;
      } else if (propertyType && propertyType !== direction) {
        siblingElement = null;
      } else {
        siblingElement = getSiblingElement(siblingElement, direction);
      }
    }
    return siblingElement;
  };

  const hasPageAlbumPlaceholder = (editor: Editor, direction: TPropertyType) => {
    const currentElement = getTopParentElement(editor.selection.getStart());
    if (isAnyAlbumPagePlaceholder(currentElement)) {
      return false;
    }
    const hasPlaceholder = !!findPageAlbumPlaceholder(currentElement, direction);
    return hasPlaceholder;
  };

  const contentInPlaceholders = (editor: Editor) => {
    const hasStartPageAlbumPlaceholder = hasPageAlbumPlaceholder(editor, 'start');
    const hasEndPageAlbumPlaceholder = hasPageAlbumPlaceholder(editor, 'end');
    return hasStartPageAlbumPlaceholder && hasEndPageAlbumPlaceholder;
  };

  const insertElement = (
    editor: Editor,
    exitingElement: Element,
    newElement: Element,
    direction: TPropertyType
  ) => {
    const topParentElement = getTopParentElement(exitingElement);
    const siblingElement = getSiblingElement(topParentElement, direction);
    const isAlbumPagePlaceholder = isAnyAlbumPagePlaceholder(siblingElement);
    let cursorLocationElement: Element | ChildNode;
    let cursorOffset = 0;

    if (isAlbumPagePlaceholder) {
      siblingElement.remove();
    } else {
      if (direction === 'start') {
        topParentElement.before(newElement);
        cursorLocationElement = topParentElement?.firstChild;
      } else {
        topParentElement.after(newElement);
        const albumPlaceholder = findPageAlbumPlaceholder(topParentElement, direction);
        cursorLocationElement = albumPlaceholder;
        cursorOffset = 1;
      }
      editor.selection.setCursorLocation(cursorLocationElement, cursorOffset);
    }
  };

  const canSplit = (element: Element) => {
    return tagsThatCanBeSplit.includes(element.tagName);
  };

  const hasOffset = (editor: Editor, direction: TPropertyType) => {
    const range = editor.selection.getRng();
    return direction === 'start'
      ? range.startOffset !== 0
      : range.endOffset !== range.endContainer.textContent.length;
  };

  const insertSinglePlaceholder = (editor: Editor, placeHolderType: TPropertyType) => {
    let selectedElement = editor.selection.getStart();
    if (isAnyAlbumPagePlaceholder(selectedElement)) {
      return;
    }
    const topParentElement = getTopParentElement(selectedElement);
    if (hasOffset(editor, placeHolderType) && canSplit(topParentElement)) {
      editor.execCommand('InsertParagraph');
      selectedElement = editor.selection.getStart();
      insertElement(editor, selectedElement, getNodePlaceholder(editor, placeHolderType), 'start');
    } else {
      insertElement(editor, topParentElement, getNodePlaceholder(editor, placeHolderType), placeHolderType);
    }
  };

  const insertPairPlaceholders = (editor: Editor, inverse = false) => {
    let startElement = editor.selection.getStart();
    let endElement = editor.selection.getEnd();
    if (isAnyAlbumPagePlaceholder(startElement, endElement)) {
      return;
    }
    const topParentStartElement = getTopParentElement(startElement);
    const topParentEndElement = getTopParentElement(endElement);
    const hasStartOffset = hasOffset(editor, 'start');
    const hasEndOffset = hasOffset(editor, 'end');
    const startOffset = editor.selection.getRng().startOffset;
    let endOffset = editor.selection.getRng().endOffset;
    const startCanSplit = canSplit(topParentStartElement);
    const endCanSplit = canSplit(topParentEndElement);
    const firstPlaceholderType = inverse ? 'end' : 'start';
    const secondPlaceholderType = inverse ? 'start' : 'end';

    editor.selection.collapse(true);
    if (hasStartOffset && startCanSplit) {
      editor.execCommand('InsertParagraph');
      startElement = editor.selection.getStart();
      insertElement(editor, startElement, getNodePlaceholder(editor, firstPlaceholderType), 'start');
    } else {
      insertElement(
        editor,
        topParentStartElement,
        getNodePlaceholder(editor, firstPlaceholderType),
        'start'
      );
    }

    if (topParentStartElement === topParentEndElement) {
      endElement = startElement;
    }

    if (hasEndOffset && endCanSplit) {
      endOffset =
        topParentStartElement === topParentEndElement ? (endOffset -= startOffset) : endOffset;
      editor.selection.setCursorLocation(endElement?.firstChild, endOffset);
      editor.execCommand('InsertParagraph');
    }
    insertElement(editor, endElement, getNodePlaceholder(editor, secondPlaceholderType), 'end');
  };

  const removePairPlaceholders = (editor: Editor) => {
    const selection = editor.selection;
    const startElement = selection.getStart();
    const endElement = selection.getEnd();
    const topSibling = getSiblingElement(getTopParentElement(startElement), 'start');
    const endSibling = getSiblingElement(getTopParentElement(endElement), 'end');
    topSibling.remove();
    endSibling.remove();
    selection.collapse(true);
  };

  const getPageAlbumPlaceholder = (editor: Editor, api: TToggleButtonApi) => {
    const selection = editor.selection;
    const selectionCanSplit = canSplit(getTopParentElement(selection.getStart()));
    const isSinglePlaceholderMode = selection.isCollapsed() && selectionCanSplit;
    const containsPlaceholders = contentContainsPlaceholders(editor);
    const contentWrappedIn = contentWrappedInPlaceholders(editor);
    const contentIn = contentInPlaceholders(editor);

    editor.undoManager.transact(() => {
      if (isSinglePlaceholderMode) {
        if (contentIn) {
          return;
        } else {
          insertSinglePlaceholder(editor, api.isActive() ? 'end' : 'start');
        }
      } else {
        if (containsPlaceholders) {
          return;
        } else if (contentWrappedIn) {
          removePairPlaceholders(editor);
        } else if (contentIn) {
          insertPairPlaceholders(editor, true);
        } else {
          insertPairPlaceholders(editor, false);
        }
      }
    });
  };

  const initPlaseholderObserver = (editor: Editor) => {
    placeholderObserver = new MutationObserver((mutationsList) => {
      mutationsList
        .filter(({ type }) => type === 'childList')
        .forEach(({ removedNodes, target }) => {
          if (target.nodeName !== 'P') {
            return;
          }
          removedNodes.forEach((removedNode) => {
            if (removedNode?.nodeName !== 'IMG') {
              return;
            }
            const imgElement = removedNode as Element;
            const firstPlaceholderType = propertiesTypes.find((type) => {
              return imgElement.classList.contains(properties.astraPageAlbumClass[type]);
            });
            if (firstPlaceholderType) {
              const firstPlaceholder = target as Element;
              const secondPlaceholderType = propertiesTypes.find(
                (type) => type !== firstPlaceholderType
              );
              const secondPlaceholder = findPageAlbumPlaceholder(
                firstPlaceholder,
                secondPlaceholderType
              );
              if (firstPlaceholder && secondPlaceholder) {
                editor.dom.remove(firstPlaceholder);
                editor.dom.remove(secondPlaceholder);
              }
            }
          });
        });
    });

    const body = editor.getBody();
    if (body) {
      placeholderObserver.observe(body, { subtree: true, childList: true });
    }
  };

  const registerOptions = (editor: Editor) => {
    propertiesTypes.forEach((type) => {
      editor.options.register(properties.htmlSeparatorOptionName[type], {
        processor: 'string',
        default: properties.defaultHtmlSeparator[type],
      });
      editor.options.register(properties.svgPlaceholderOptionName[type], {
        processor: 'string',
        default: properties.defaultSvg[type],
      });
    });
  };

  const registerButton = (editor: Editor) => {
    editor.ui.registry.addToggleButton('astra-pagealbum', {
      icon: 'page-album',
      tooltip: 'Альбомная ориентация',
      onAction: (api) => {
        getPageAlbumPlaceholder(editor, api);
      },
      onSetup: (api) => {
        const nodeChangeHandler = () => {
          api.setActive(hasPageAlbumPlaceholder(editor, 'start'));
        };
        editor.on('NodeChange', nodeChangeHandler);
        return () => editor.off('NodeChange', nodeChangeHandler);
      },
    });
  };

  const registerEvents = (editor: Editor) => {
    editor.on('init', () => {
      initPlaseholderObserver(editor);
    });

    editor.on('BeforeSetContent', (e: TBeforeSetContentEvent) => {
      e.content = e.content.replace(getRegExpHTMlSeparator(editor), (matched) => {
        const propertyType = propertiesTypes.find(
          (type) => getHtmlSeparatorOption(editor, type) === matched
        );
        return propertyType ? getHTMLPlaceholder(editor, propertyType) : matched;
      });
    });

    editor.on('PreInit', () => {
      editor.serializer.addNodeFilter('img', (nodes) => {
        const textNodeTypeValue = 3; // Web/API/Node/nodeType
        nodes.forEach((node) => {
          const className = node.attr('class');
          const propertyType: TPropertyType | undefined = propertiesTypes.find((type) =>
            className?.includes(properties.astraPageAlbumClass[type])
          );

          if (className && propertyType) {
            const htmlSeparator = getHtmlSeparatorOption(editor, propertyType);
            const parentNode = node.parent;
            if (parentNode && editor.schema.getBlockElements()[parentNode.name]) {
              parentNode.type = textNodeTypeValue;
              parentNode.value = htmlSeparator;
              parentNode.raw = true;
              node.remove();
              return;
            }
            node.type = textNodeTypeValue;
            node.value = htmlSeparator;
            node.raw = true;
          }
        });
      });
    });
  };

  const registerElementNameResolve = (editor: Editor) => {
    editor.on('ResolveName', (e) => {
      const hasAstraPageAlbumClass = propertiesTypes.some((type) =>
        editor.dom.hasClass(e.target, properties.astraPageAlbumClass[type])
      );
      if (e.target.nodeName === 'IMG' && hasAstraPageAlbumClass) {
        e.name = 'astra-pagealbum';
      }
    });
  };

  const registerCommands = (editor: Editor) => {
    propertiesTypes.forEach((type) => {
      editor.addCommand(properties.commandNames[type], () => {
        editor.insertContent(getHTMLPlaceholder(editor, type));
      });
    });
  };

  const registerPlugin = () => {
    pluginManager.add('astra-pagealbum', (editor) => {
      registerOptions(editor);
      registerCommands(editor);
      registerButton(editor);
      registerEvents(editor);
      registerElementNameResolve(editor);
    });
  };

  registerPlugin();
};





export default (): void => {
  setup();
};
