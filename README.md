<p align="center">
  <img width="580" src="assets/logo.png" alt="Script Palette">
</p>

# CommitPal

A delightful CLI tool for building commit messages which conform to your project's specific commit message format.

<p align="center">
  <img width="580" src="assets/demo.gif" alt="Demo">
</p>

## Install ⬇️

Install globally

```bash
npm install -g commitpal
```

## Get started 🏁

```bash
commitpal
```

Usage with npx

```bash
npx commitpal
```

## Configuration

If you're not using one of the predefined commit message formats, CommitPal will attempt to search for a `commitpal.config.json`.

Which can be configured like so:

```json
{
  "name": "Angular commit message format",
  "steps": [
    {
      "type": "option",
      "message": "What type of change?",
      "options": [
        { "value": "feat", "description": "feature" },
        { "value": "fix", "description": "bug fix" },
        { "value": "docs", "description": "documentation" },
        {
          "value": "style",
          "description": "formatting, missing semi colons, …"
        },
        { "value": "test", "description": "tests" },
        { "value": "chore", "description": "adhoc maintenance" }
      ]
    },
    {
      "type": "option",
      "message": "What scope of the project is affected?",
      "before": "(",
      "after": "):",
      "options": [
        { "value": "authentication", "description": "Authentication modules" },
        { "value": "users", "description": "User profiles" },
        { "value": "settings", "description": "Settings" },
        { "value": "payments", "description": "Payments modules" },
        { "value": "shipping", "description": "Shipping modules" },
        { "value": "build system", "description": "Build system" },
        { "value": "CI", "description": "Continuous integration" }
      ]
    },
    {
      "type": "text",
      "message": "Summarise this change..."
    },
    {
      "type": "text",
      "before": "\n\n",
      "message": "Describe this change..."
    },
    {
      "type": "text",
      "before": "\n\n",
      "message": "Describe any breaking changes..."
    }
  ]
}
```
