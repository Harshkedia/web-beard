module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ["prettier"],
  extends: [
    "plugin:vue/recommended",
    "airbnb-base",
    "plugin:prettier/recommended",
    "eslint:recommended"
  ],
  rules: {
    "import/no-extraneous-dependencies": "warn",
    "import/no-unresolved": "off",
    "no-console": "off",
    "prettier/prettier": "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/require-default-prop": "off",
    "vue/html-closing-bracket-spacing": "off",
    "vue/html-self-closing": "off",
    "no-plusplus": "off",
    "array-callback-return": "off",
    "no-param-reassign": ["error", { props: false }],
    "no-underscore-dangle": "off",
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: 5,
        multiline: {
          max: 5,
          allowFirstLine: true
        }
      }
    ]
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "/src"]],
        extensions: [".js", ".json", ".jsx", ".scss", ".ts"]
      }
    }
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
