// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    rules: {
      'no-use-before-define': [
        'error',
        { functions: false, classes: false, variables: true },
      ],
    },
  },
)
