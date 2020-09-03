import { mount } from '@vue/test-utils'
import BurnDownChart from '@/components/BurnDownChart.vue'

describe('BurnDownChart', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(BurnDownChart)
    expect(wrapper.vm).toBeTruthy()
  })
})
