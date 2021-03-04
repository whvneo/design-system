const path = require('path')
const htmlParser = require('node-html-parser')
const log = require('../../.scripts/log')
const file = require('../../.scripts/file')
const libraryLib = require('../../packages/library/.scripts/components.lib')
const { NEWLINE, LEFT_WHITESPACE } = require('../../.scripts/constants')

const JAVASCRIPT_CONTENT = []
let INDEX = 0

const camelize = s => s.replace(/-./g, x => x.toUpperCase()[1])

async function main() {
  log.title('create component docs')
  const components = await libraryLib.components()
  await file.remove(path.join(__dirname, '../src/.vuepress/components/docs-demo-bal-*.vue'))
  await generateSidebar(components)
  await generateMarkdown(components)
}

async function generateSidebar(components) {
  const sidebar = []
  await forEachComponent(components, async component => sidebar.push(component.tag))
  await file.save(path.join(__dirname, '../src/.vuepress/generated/components.json'), JSON.stringify(sidebar))
}

async function generateMarkdown(components) {
  const dir = path.join(__dirname, `../src/components`)
  await file.empty(dir)
  await forEachComponent(components, async component => {
    const { markdown, scripts } = generateExamples(component)
    JAVASCRIPT_CONTENT.push(scripts)

    const lines = []
    lines.push(`# ${component.tag}`)
    component.readme.split(NEWLINE).forEach(line => lines.push(line))
    lines.push(markdown)
    lines.push('')

    if (scripts) {
      lines.push(`<docs-component-script tag="${camelize(component.tag)}"></docs-component-script>`)
      lines.push('')
    }

    await file.save(path.join(dir, `${component.tag}.md`), lines.join(NEWLINE))
  })

  await file.save(path.join(__dirname, `../src/.vuepress/generated/components.js`), JAVASCRIPT_CONTENT.join(NEWLINE))
}

function generateExamples(component) {
  if (!component.examples) {
    return ''
  }

  return {
    markdown: transformToMarkdown(component),
    scripts: transformScripts(component),
  }
}

function transformScripts(component) {
  const container = findContainer(component)
  const scriptContent = container.childNodes
    .map(node => (node.rawTagName === 'script' ? getCodeExample(node) : ''))
    .filter(a => a.trim().length !== 0)
    .join(NEWLINE + NEWLINE)
  if (scriptContent.length > 0) {
    return (
      `export function ${camelize(component.tag)}(){` +
      scriptContent
        .split(NEWLINE)
        .map(c => `  ${c}`)
        .join(NEWLINE) +
      NEWLINE +
      '}' +
      NEWLINE
    )
  }
}

function transformToMarkdown(component) {
  const container = findContainer(component)
  return container.childNodes
    .map(node => {
      if (node.nodeType === 3) {
        return node.rawText
      }
      if (node.nodeType === 1) {
        if (node.rawTagName === 'h2') {
          return `## ${printRawText(node)}` + NEWLINE
        }
        if (node.rawTagName === 'h3') {
          return `### ${printRawText(node)}` + NEWLINE
        }
        if (node.rawTagName === 'h4') {
          return `#### ${printRawText(node)}` + NEWLINE
        }
        if (node.rawTagName === 'p') {
          return `${printRawText(node)}` + NEWLINE
        }
        if (node.rawTagName === 'section') {
          const tag = `docs-demo-${component.tag}-${INDEX++}`
          const content = getCodeExample(node)
          writeDemoComponent(tag, content)
          return [`<${tag}></${tag}>`, NEWLINE + NEWLINE, '```html', content, '```', NEWLINE].join('')
        }
      }
      return ''
    })
    .filter(a => a)
    .filter(a => a.trim().length !== 0)
    .join(NEWLINE)
}

function printRawText(node) {
  return node.childNodes
    .map(n => n.rawText.trim())
    .join(' ')
    .trim()
}

function getCodeExample(node) {
  return node.innerHTML
    .toString()
    .split(NEWLINE)
    .map(line => line.substring(LEFT_WHITESPACE))
    .join(NEWLINE)
}

function findContainer(component) {
  const root = htmlParser.parse(component.examples)
  const containerElement = root.querySelector('.container')
  if (!containerElement) {
    log.error(`Example file index.html of the component ${component.tag} is invalid`)
    return process.exit(1)
  }
  return htmlParser.parse(containerElement.innerHTML)
}

async function writeDemoComponent(tag, content) {
  const componentContent = [
    '<template>',
    '<div class="demo bal-app">',
    content,
    '</div>',
    '</template>',
    '<script>',
    'export default {',
    `  name: '${tag}'`,
    '}',
    '</script>',
  ].join(NEWLINE)
  await file.save(path.join(__dirname, `../src/.vuepress/components/${tag}.vue`), componentContent)
}

function forEachComponent(components, callback) {
  components.forEach(async component => {
    // if (component.tag.indexOf('bal-icon-') === -1 && component.isChild === false) {
    //   await callback(component)
    // }
    if (component.tag === 'bal-button' || component.tag === 'bal-accordion' || component.tag === 'bal-toast') {
      await callback(component)
    }
  })
}

main()
