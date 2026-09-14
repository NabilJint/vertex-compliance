# PostHog Self-driving setup report

## Summary
PostHog Self-driving has been configured with Session Replay, Error Tracking, and Support enabled. Health checks, all Error Tracking responders, and the Support-ticket responder are enabled; findings will begin appearing in the [Self-driving inbox](https://eu.posthog.com/project/273749/inbox) within about 30 minutes as data arrives and scouts run.

No project code was changed. The existing browser PostHog initialization is compatible with the enabled products: it enables exception capture and does not disable session recording.

## AI data processing

Approved.

## GitHub

Connected before this setup by the PostHog GitHub App. GitHub Issues was not selected as a Self-driving source in this run, so no GitHub Issues responder was enabled.

## Products enabled

| Product | Result | Notes |
|---|---|---|
| Session Replay | enabled | Web SDK initialization does not disable session recording. No recordings were returned by the recent availability probe. |
| Error Tracking | enabled | Web SDK initialization has exception capture enabled. No issues were returned by the recent availability probe. |
| Support | enabled | Connect an inbound email, inbox, or Slack channel in PostHog before Support tickets can arrive. |

## Signal sources

| Source product | Source type | Action | Notes |
|---|---|---|---|
| `signals_scout` | `cross_source_issue` | skipped | On by default; no opt-out row existed. |
| `health_checks` | `health_issue` | enabled | New responder configuration created. |
| `error_tracking` | `issue_created` | enabled | New responder configuration created. |
| `error_tracking` | `issue_reopened` | enabled | New responder configuration created. |
| `error_tracking` | `issue_spiking` | enabled | New responder configuration created. |
| `conversations` | `ticket` | enabled | New responder configuration created; remains idle until a Support channel is connected. |
| `session_replay` | `session_analysis_cluster` | skipped | Retired responder; replay is covered by Replay Vision scanners when scanner access is available. |

## Connected tools

No external tools were selected in the connected-tools prompt. No connected-tool responder was enabled or warehouse source created.

## Scout troop

**Active scouts (4)**

| Scout | Reason |
|---|---|
| `signals-scout-general` | Cross-product coverage and surfaces without a specialist. |
| `signals-scout-product-analytics` | The app captures product-engagement events across the training discovery and curriculum experience. |
| `signals-scout-web-analytics` | Browser-based application coverage for traffic, attribution, and landing-page health. |
| `signals-scout-health-checks` | Prioritizes actionable PostHog configuration and instrumentation health issues. |

**Disabled scouts (23)**

| Scout | Reason |
|---|---|
| `signals-scout-ai-observability` | No active AI-observability data was established. |
| `signals-scout-anomaly-detection` | The focused active scouts cover the currently evidenced product surfaces. |
| `signals-scout-apm` | No APM or distributed-tracing usage was established. |
| `signals-scout-conversations` | No Support channel or ticket activity is connected yet. |
| `signals-scout-csp-violations` | No CSP reporting configuration was established. |
| `signals-scout-customer-analytics` | No account-analytics usage was established. |
| `signals-scout-data-pipelines` | No CDP, batch-export, or Hog Flow usage was established. |
| `signals-scout-data-warehouse` | No warehouse source was connected. |
| `signals-scout-error-tracking` | Covered by the native Error Tracking responders. |
| `signals-scout-experiments` | No active experiment usage was established. |
| `signals-scout-feature-flags` | No feature-flag usage was established. |
| `signals-scout-inbox-validation` | Fresh setup with no resolved Self-driving reports to validate. |
| `signals-scout-insight-alerts` | No configured insight-alert usage was established. |
| `signals-scout-logs` | No PostHog Logs usage was established. |
| `signals-scout-mcp-tool-calls` | No MCP tool-call telemetry surface was established. |
| `signals-scout-observability-gaps` | Deferred to keep the initial troop selective. |
| `signals-scout-replay-vision` | No existing Replay Vision scanner estate was verified. |
| `signals-scout-revenue-analytics` | No payment or revenue-data surface was established. |
| `signals-scout-session-replay` | Covered by Replay Vision scanners once scanner access is available. |
| `signals-scout-skills-store` | No project skills-store usage needs scheduled hygiene monitoring. |
| `signals-scout-surveys` | No surveys were returned by the recent availability probe. |
| `signals-scout-tasks` | No PostHog Tasks usage was established. |
| `signals-scout-web-vitals` | Web-vitals instrumentation was not established. |

**Run budget:** 100 runs per day; 0 used today; 100 remaining. The current announcement says Scouts are in early access and projects receive up to 100 runs a day; contact `team-self-driving@posthog.com` to request more.

## Custom scouts

No custom scouts were created because the proposal was declined/cancelled. Two candidates were considered:

- **Training discovery-to-start conversion:** a scheduled check for an abnormal drop from searching or choosing a training program to starting training, while discovery traffic remains stable. This was a genuine domain-specific funnel gap beyond the built-in product-analytics scout’s saved-flow coverage, but was declined.
- **Curriculum browsing stalls:** a scheduled check for repeated curriculum expansion without lesson selection, only when the pattern rises above its normal level. This was a secondary engagement-friction gap, but was declined.

Existing error bursts and replay analysis were ruled out because native Error Tracking responders and Replay Vision scanners respectively own those routes. If a scout becomes noisy in future, set its configuration’s `emit` value to `false` in PostHog to switch it to dry-run.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes clear defects to the Self-driving inbox. It is the only component in this setup that spends Replay Vision quota; its findings arrive at half weight and require corroboration before promotion into a report.

| Brief | Status | Intended coverage | Query and estimate |
|---|---|---|---|
| Breakage monitor | skipped | Visible failure while discovering, selecting, or starting compliance training. | Scanner inventory and quota/estimate mechanics could not be accessed because the scanner endpoints returned an authentication error. No completion-flow URL query was created. |
| Frustration monitor | skipped | Visible frustration such as repeated clicks or stalled interactions in the training experience. | The required `$rageclick`-only monitor query was not created because the scanner endpoints returned an authentication error. No spend estimate was available. |

No recordings were returned by the recent availability probe. Once scanner access is repaired, create both standing monitors; they can remain armed without recordings and begin scanning when recordings arrive.

## Repository files

| File | Change |
|---|---|
| `posthog-self-driving-report.md` | Created this setup report. |
| `.claude/skills/replay-vision-scanners-core/SKILL.md` | Installed shared scanner workflow. |
| `.claude/skills/replay-vision-scanner-broken-experiences/SKILL.md` | Installed breakage-monitor brief. |
| `.claude/skills/replay-vision-scanner-user-frustration/SKILL.md` | Installed frustration-monitor brief. |

No application source files or environment files were modified.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) so the enabled Support-ticket responder has ticket data.
- [ ] Reconnect or reauthorize the PostHog MCP/scanner access: Replay Vision scanner listing and the in-product scanner guidance both returned an authentication error. Then create the breakage and frustration monitors in PostHog.
- [ ] If the project starts using a disabled surface (for example, surveys, flags, experiments, revenue, logs, or warehouse pipelines), enable its corresponding scout from the Self-driving inbox.
- [ ] Reconnect MCP access with the property-definition read scope to verify the deployed event schema before adding event-specific custom scouts.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Each scheduled run uses the daily scout budget; findings cluster into reports in the [Self-driving inbox](https://eu.posthog.com/project/273749/inbox), where immediately actionable reports can start coding tasks.
