import { mount } from '@vue/test-utils'
import index from '@/pages/index.vue'

describe('index', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(index)
    expect(wrapper.vm).toBeTruthy()
  })
})
