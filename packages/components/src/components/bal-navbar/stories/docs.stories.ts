import docs from './readme.docs.mdx'
import { generateArgType } from '../../../stories/helpers/args'
import { BalNavbar, BalNavbarBrand, BalNavbarMenu, BalNavbarMenuEnd, BalNavbarMenuStart } from '../../../../.storybook/vue/components'

export default {
  title: '01-Components/Navbar',
  component: BalNavbar,
  subcomponent: { BalNavbarBrand, BalNavbarMenu, BalNavbarMenuEnd, BalNavbarMenuStart },
  argTypes: generateArgType('bal-navbar'),
  parameters: {
    docs: {
      page: docs,
    },
  },
}

export const Basic = args => ({
  components: { BalNavbar, BalNavbarBrand, BalNavbarMenu, BalNavbarMenuEnd, BalNavbarMenuStart },
  setup: () => ({ args }),
  template: `<bal-navbar v-bind="args">
  <bal-navbar-brand>
    <bal-icon name="logo" inverted size="large"></bal-icon>
    <bal-text style="margin-left: 15px"><strong>App</strong> Title</bal-text>
  </bal-navbar-brand>
  <bal-navbar-menu>
    <bal-navbar-menu-start>
      <a class="navbar-item"><bal-text>Home</bal-text></a>
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link"><bal-text>Language</bal-text></a>
        <div class="navbar-dropdown">
          <a class="navbar-item"><bal-text>English</bal-text></a>
          <a class="navbar-item"><bal-text>German</bal-text></a>
          <a class="navbar-item"><bal-text>French</bal-text></a>
          <hr class="navbar-divider" >
          <a class="navbar-item"><bal-text>Support</bal-text></a>
        </div>
      </div>
    </bal-navbar-menu-start>
    <bal-navbar-menu-end>
      <bal-button inverted>Logout</bal-button>
    </bal-navbar-menu-end>
  </bal-navbar-menu>
</bal-navbar>`,
})
Basic.args = {}
