import type * as d from '@stencil/core/internal'
import { MarkdownTable } from './docs-util'

export const propsToMarkdown = (props: d.JsonDocsProp[]) => {
  const content: string[] = []
  if (props.length === 0) {
    return content
  }

  content.push(`#### Properties`)
  content.push(``)
  content.push(`Follow the [Property Usage](https://design.baloise.dev/?path=/docs/implementation-property--page) guide to learn how to change properties of the component.`)
  content.push(``)

  const table = new MarkdownTable()

  table.addHeader(['Property', 'Attribute', 'Description', 'Type', 'Default'])

  props.forEach(prop => {
    table.addRow([getPropertyField(prop), getAttributeField(prop), getDocsField(prop), getPropertyType(prop), `\`${prop.default}\``])
  })

  content.push(...table.toMarkdown())
  content.push(``)
  content.push(``)

  return content
}

const getPropertyType = (prop: d.JsonDocsProp) => {
  if (prop.type.indexOf('|') >= 0) {
    return prop.type
      .split('|')
      .map(t => `\`${t}\``)
      .join(', ')
  }
  return `\`${prop.type}\``
}

const getPropertyField = (prop: d.JsonDocsProp) => {
  return `\`${prop.name}\`${prop.required ? ' _(required)_' : ''}`
}

const getAttributeField = (prop: d.JsonDocsProp) => {
  return prop.attr ? `\`${prop.attr}\`` : '--'
}

const getDocsField = (prop: d.JsonDocsProp) => {
  return `${prop.deprecation !== undefined ? `<span style="color:red">**[DEPRECATED]**</span> ${prop.deprecation}<br/><br/>` : ''}${prop.docs}`
}
