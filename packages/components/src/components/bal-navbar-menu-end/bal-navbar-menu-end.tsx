import { Component, h, Host } from '@stencil/core'

@Component({
  tag: 'bal-navbar-menu-end',
  scoped: false,
  shadow: false,
})
export class NavbarMenuEnd {
  render() {
    return (
      <Host class="navbar-end">
        <slot></slot>
      </Host>
    )
  }
}
