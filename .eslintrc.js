module.exports = {
    "parserOptions": {
      "ecmaVersion": 2017
    },
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-console": ["off"],
        "indent": ["warn", 2],
        "quotes": ["warn", "single", {
          "avoidEscape": true,
          "allowTemplateLiterals": true
          }
        ],
        "semi": ["warn", "always"],

        "array-bracket-spacing": ["warn", "never"],
        "block-spacing": ["warn", "always"],
        "camelcase": ["warn", { "properties": "always" }],
        "comma-dangle": ["warn", "always-multiline"],
        "comma-spacing": ["warn"],
        "comma-style": ["warn"],
        "eol-last": ["warn", "always"],
        "computed-property-spacing": ["warn", "never"],
        "func-call-spacing": ["warn", "never"],
        "key-spacing": ["warn"],
        "keyword-spacing": ["warn"],
        "new-cap": ["warn"],
        "new-parens": ["warn"],
        "no-trailing-spaces": ["warn"],
        "no-underscore-dangle": ["warn", {
          "allowAfterThis": true
        }],
        "object-curly-spacing": ["warn", "always"],
        "semi-spacing": ["warn"],
        "space-before-blocks": ["warn"],
        "space-before-function-paren": ["warn", {
            "anonymous": "always",
            "asyncArrow": "always",
            "named": "never"
          }
        ],
        "space-in-parens": ["warn"],

        "arrow-spacing": ["warn"],
        "no-var": ["warn"],

        "complexity": ["warn", { "max": 7 }],
        "max-statements": ["warn", { "max": 30 }]
    }
};
