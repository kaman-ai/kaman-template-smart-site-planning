# Nava Nagar planning desk

The app of the **Smart Site Planning** template in the Kaman marketplace.

It shows the Nava Nagar site from its lake, asks the template's planner
agent to plan the land, and runs the template's sign-off workflow. It is
installed as a code project of yours when you install the template.

## How it is wired

`kaman.app.json` names what the app uses:

| key | what |
|---|---|
| `agents.planner` | the Site Planning Analyst agent |
| `workflows.signoff` | the "Plan, check and sign off" workflow |
| `lake`, `schema` | where the site's tables are |
| `targetYear` | the year the plan is sized for |

The ids in this repository are the template's own. **Install rewrites the
file**: each id becomes the id of your installed copy, and `{{lake_name}}` /
`{{target_year}}` take the values you chose. Nothing else is rewritten.

The app talks to Kaman only from its server routes (`app/api/*`), through
`@yoctotta/kaman-sdk/app`, with `KAMAN_BASE_URL` and `KAMAN_API_KEY` — which
a Kaman preview injects. The key never reaches the browser.

## Publishing a new version

Push here, then republish the template pinned to the new commit. Installs
always take the pinned commit, never the tip of `main`.
