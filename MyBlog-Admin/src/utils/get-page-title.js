import defaultSettings from '@/settings'
import store from '@/store'

const title = defaultSettings.title

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    // return `${pageTitle} | ${title}`
    return `${pageTitle} | ${store.getters.options.name || title}`
  }
  return `${title}`
}
