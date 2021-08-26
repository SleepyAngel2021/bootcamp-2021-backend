const { palindrome } = require('../utils/for_testing')

describe('palindrome', () => {
  test('of josep', () => {
    expect(palindrome('josep')).toBe('pesoj')
  })

  test('palindrome of empty string', () => {
    expect(palindrome('')).toBe('')
  })

  test('palindrome of undefined', () => {
    expect(palindrome()).toBeUndefined()
  })
})
