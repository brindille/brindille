export function brindillePage (page, lang = null) {
  return window.isMultilingual ? '/' + (window.lang || lang) + '/' + page : '/' + page
}
