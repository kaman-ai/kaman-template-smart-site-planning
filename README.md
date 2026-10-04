# Nava Nagar planning desk

The app of the **Smart Site Planning** template in the Kaman marketplace —
and Kaman's reference for how an app on Kaman is built.

It is installed as a code project of yours when you install the template.

## What it does

| screen | what it is |
|---|---|
| `/login`, `/signup` | the app's **own** sign-in and sign-up — its users never see Kaman |
| `/` — the brief | a Kaman **scenario**: what the plan must serve in the target year, parcels by status, every parcel with **Ask the planner** |
| `/land` | a Kaman **scenario**: the land today, on the map |
| `/planner` | Kaman's **chat component**, talking to the planner agent |
| *Plan and send for sign-off* | an **action** the brief scenario declares: starts the template's workflow |

## How it is built — the rules

1. **The app acts as its signed-in user.** Every call a person's click
   causes carries *their* token, so Kaman applies their permissions and
   their organisation. `auth.session(req)` on the server gives you Kaman
   as that user.
2. **The API key is for what no user is present for.** Here: signing a new
   person up (`auth.signup`). Elsewhere: scheduled jobs, administration.
   It never reaches the browser.
3. **Screens are scenarios.** A scenario resolves its figures, charts and
   tables against the lake *as the user*, runs its row actions, and opens
   its drill-downs. The app mounts `ScenarioPage` from
   `@kamanai/ui-scenarios`; the page layout is the scenario's, so Kaman
   and the app show the same thing.
4. **What a screen can DO is declared in the scenario** — an action names
   a tool's function, a workflow or an agent. The engine performs it (as
   the user), and an agent's answer opens beside the row it was asked
   about. The app's own buttons invoke the same declared actions.
5. **The browser never holds a token.** Kaman's browser components call
   `app/api/kaman/[...path]`, which forwards as the user (`auth.proxy`),
   narrowed to the routes the app uses.
6. **Nothing hard-codes an id.** `kaman.app.json` names the agent,
   workflow, scenarios and lake; install rewrites it to your copies.

## Files

```
kaman.app.json                     what the app is wired to (install rewrites it)
middleware.ts                      signed out → /login
app/lib/kaman.ts                   wiring + `auth` (createKamanAuth)
app/lib/scenarios.ts               the scenario client, through the proxy
app/api/auth/{login,signup,signout} the app's own sign-in
app/api/kaman/[...path]/route.ts   browser components → Kaman, as the user
app/api/chat/route.ts              a chat turn with the planner, as the user
app/(desk)/…                       the screens, inside the desk's shell
app/components/…                   shell, scenario screen, chat, auth form
```

## `kaman.app.json`

| key | what |
|---|---|
| `agents.planner` | the Site Planning Analyst agent |
| `workflows.signoff` | "Plan, check and sign off" |
| `scenarios.brief`, `scenarios.land` | the two scenario screens |
| `lake`, `schema` | where the site's tables are |
| `targetYear` | the year the plan is sized for |

The ids in this repository are the template's own (revision 3). Install
rewrites each to the id of your copy, and `{{lake_name}}` /
`{{target_year}}` to the values you chose.

## Environment

A Kaman preview sets all of these. A deployment sets them itself.

| variable | what |
|---|---|
| `KAMAN_BASE_URL` | where this server reaches Kaman |
| `KAMAN_APP_CLIENT_ID` | `app:<project-id>` |
| `KAMAN_API_KEY` | for signup only |
| `KAMAN_PREVIEW_BASE` | the path a preview serves the app under |

## Publishing a new version

Push here, then republish the template pinned to the new commit. Installs
always take the pinned commit, never the tip of `main`.
