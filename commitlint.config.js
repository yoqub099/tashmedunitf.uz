/**
 * Conventional Commits — https://www.conventionalcommits.org
 *
 * Allowed types:
 *   feat:     New feature
 *   fix:      Bug fix
 *   docs:     Documentation only
 *   style:    Formatting, no code change
 *   refactor: Code refactor (no feature/fix)
 *   perf:     Performance improvement
 *   test:     Add/modify tests
 *   build:    Build system / dependencies
 *   ci:       CI/CD configuration
 *   chore:    Misc, no production change
 *   revert:   Revert previous commit
 *
 * Examples:
 *   feat(api): add news bulk export endpoint
 *   fix(web): correct hreflang on news detail
 *   docs(adr): add ADR for monorepo migration
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [2, 'always', 120],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'scope-enum': [
      1,
      'always',
      [
        'api',
        'web',
        'admin',
        'mobile',
        'e2e',
        'ui',
        'sdk',
        'types',
        'config',
        'utils',
        'i18n',
        'docs',
        'infra',
        'deps',
        'release',
      ],
    ],
  },
};
