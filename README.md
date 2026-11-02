# AI Systems Lab

Understand how AI systems work, what they cost, and who controls them.

A visual learning site combining plain-English explanations, animated diagrams,
interactive browser labs and practical decision exercises. Start with inference,
then explore sovereignty across Europe, the Middle East and Africa.

**[Open the learning hub](https://smitzlroy.github.io/ai-systems-lab/)**

## Explore

| Section | What is available |
| --- | --- |
| [Inference](https://smitzlroy.github.io/ai-systems-lab/#inference/request) | Eight lessons, eleven interactive labs, animated workflows and a 71-term glossary. Explore requests, memory, batching, economics, latency, deployment, customisation and evaluation. |
| [EMEA sovereignty](https://smitzlroy.github.io/ai-systems-lab/#sovereignty) | Six nontechnical lessons, a plain-English glossary, twelve country/regional guides, twelve assurance explainers and three decision exercises. |
| [Provider positions](https://smitzlroy.github.io/ai-systems-lab/#sovereignty/providers) | Public perspectives from Mistral, Microsoft, AWS, Google Cloud, OVHcloud and Core42, with questions to test the claims. Not a ranking or endorsement. |
| [Applied scenarios](https://smitzlroy.github.io/ai-systems-lab/#practice) | Five fictional workflows: document extraction, retrieval quality, permissions, voice latency and guardrail trade-offs. Synthetic data connects the theory to decisions. |
| [Study path and sources](https://smitzlroy.github.io/ai-systems-lab/#library) | A suggested learning sequence and 26 curated resources, with additional sources alongside the sovereignty content. |
| Further topics | GPU systems, LLM foundations, retrieval/data, agents/tools and evaluation/safety currently have curriculum outlines and resources, not full interactive courses. |

### A useful place to start

- **Understand inference:** follow a request, explore memory, then try batching
  and economics. Change a lab input and explain why the result moves.
- **Lead a sovereignty conversation:** distinguish residency, privacy, sovereignty
  and compliance. Read a relevant country guide, examine a provider's claims,
  then prepare an evidence-led decision brief.
- **Test your understanding:** use an applied scenario to separate a requirement,
  a hypothesis, a measurement and a decision.

## Run locally

Open [index.html](./index.html) in a current browser. No installation, build,
account, API key or backend is needed.

Alternatively, if Python is installed, run this from the repository root:

```shell
python -m http.server 8000 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8000/`. Stop the server with `Ctrl+C`.

The site uses vanilla JavaScript, CSS and SVG. Links and assets are relative so
it also works as a GitHub Pages project site.

## Privacy and content boundaries

- The application has no analytics, external scripts, embedded fonts or AI API
  calls. External references open third-party sites with their own policies.
- Inference progress, theme and the last selected lesson use browser
  `localStorage`. They are not uploaded by the application. File, localhost and
  GitHub Pages origins have separate storage.
- Scenario answers and sovereignty exercises are not persisted.
- Applied scenarios use invented records and numbers, not customer datasets or
  verified customer outcomes. Do not add confidential or personal information.
- GitHub hosts the public site and may process request information under its own
  policies; this is separate from application-level tracking.

## Read the evidence carefully

The simulations explain relationships. They are **not benchmarks, production
sizing tools or current price quotations**.

The sovereignty guide covers EU/EEA, UK, Switzerland, Turkey, Saudi Arabia, UAE,
Qatar, South Africa, Kenya, Nigeria, Egypt and Morocco. It is a selective learning
guide, **not an exhaustive EMEA legal inventory, legal advice or a compliance
assessment**.

Research was reviewed on **2 November 2026**. Laws, implementing rules, guidance,
proposals, qualifications and vendor positions are labelled separately. Check
current applicability, dates, source versions and contract terms before making
a real decision. Source-access and verification limitations are noted in the
relevant entries. Provider statements are not independent assurance, and a
certificate's scope matters more than a logo.

Explanations are original summaries with links to public sources, not
reproductions of vendor courses or paid standards. See
[About and publishing checklist](./about.html) for more detail.

## Content map

| File | Purpose |
| --- | --- |
| [index.html](./index.html) | Site shell and script loading |
| [js/learning-app.js](./js/learning-app.js) | Routing, rendering, filters, exercises and browser storage |
| [js/learning.js](./js/learning.js) | Inference lessons |
| [js/learning-labs.js](./js/learning-labs.js) | Interactive simulations |
| [js/learning-terms.js](./js/learning-terms.js) | Inference glossary and supporting explanations |
| [js/learning-diagrams.js](./js/learning-diagrams.js) | SVG diagram engine |
| [js/learning-diagram-specs.js](./js/learning-diagram-specs.js) | Inference diagram layouts |
| [js/scenarios.js](./js/scenarios.js) | Synthetic applied scenarios and their diagrams |
| [js/sovereignty.js](./js/sovereignty.js) | EMEA lessons, jurisdiction guides, assurance, providers, sources and exercises |
| [js/topics.js](./js/topics.js) | Topic navigation and curriculum outlines |
| [js/research.js](./js/research.js) | Study path and curated resource library |
| [css/learning-site.css](./css/learning-site.css) | Learning-site design over the base [styles](./css/styles.css) |

## Updating and publishing

GitHub Pages deploys from **`main`, repository root**. The
[.nojekyll](./.nojekyll) file keeps this a plain static site.

The [.gitignore](./.gitignore) is an **allowlist**: new files are ignored unless
explicitly admitted. Review a new file before adding it to that list. Do not
force-add private documents, credentials, backups or unrelated workspace files.

Before pushing an update:

1. Review the diff, source links and publication boundaries. Keep legal status,
   applicability caveats and citations together.
2. Open the changed routes and check the browser console.
3. Test relevant labs, diagram controls, search/filter combinations and exercise
   feedback. Check narrow screens, keyboard navigation and both themes.
4. Check that existing inference lessons and scenario links still work.
5. Run `git diff --check`, then commit and push only the reviewed files.
6. Wait for Pages to deploy and verify the live routes and assets.

There is no package installation, build step or automated test runner configured.

## Independence and licensing

This is an independent learning project, not an official publication of any
referenced provider or regulator.

No licence has been selected for this repository. Public visibility alone does
not grant an open-source licence. Linked third-party materials retain their own
terms.
