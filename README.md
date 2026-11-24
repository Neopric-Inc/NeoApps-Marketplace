# NeoApps.AI Marketplace

A standalone static storefront for the NeoApps factory catalog. Buyers can try eight sample workflows and follow a simulated purchase into their own example workspace. Builders can search 100 app briefs, copy a prompt, and check the acceptance test.

## Run locally

From the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [the storefront](http://127.0.0.1:8000/) or [the playbook](http://127.0.0.1:8000/#/playbook). The site uses plain HTML, CSS, and JavaScript. No build step, dependencies, or API keys are required. A static host can serve this directory directly. Relative asset links and hash routes support hosting under a subpath.

## What to try

1. Open **Custom Cake Orders** and select **Try sample app**. Pick a cake, add fondant, and check pickup capacity.
2. Choose **Preview purchase** on the listing. Use the demo account and follow the deployment through **My apps**. Checkout also offers test scenarios for a transient failure, a persistent failure, and an abandoned checkout.
3. Open **Playbook** to browse the six categories and download the workbook or PRD.

The demo stores orders, support tickets, requests, and reviews in the browser. Payments, refunds, sign-in, publishing, and email use sample data. The transcript tagger shows recorded suggestions. Production prices and licence terms remain open in the PRD.

## Repository map

| Path | Contents |
| --- | --- |
| [index.html](index.html), [styles.css](styles.css) | Storefront shell and NeoApps theme |
| [ui.js](ui.js), [main.js](main.js) | Catalog, search, navigation, and playbook views |
| [flows.js](flows.js), [ops.js](ops.js) | Buyer journeys and staff preview |
| [examples](examples/) | Eight interactive sample apps |
| [data.js](data.js) | The playbook records used by the website |
| [llms.txt](llms.txt) | Machine-readable entry point linking to the PRD and category briefs |
| [resources](resources/) | Product requirements, playbook workbook, and Markdown briefs |

The category Markdown files are generated from `data.js`. After editing the playbook records, run `node scripts/export-briefs.mjs`. Review the workbook separately when its editorial content changes.

## Attribution

The theme and brand mark come from the [NeoApps.AI CodeGenerator website](https://github.com/Neopric-Inc/NeoApps.AI-CodeGenerator/tree/main/website). The original generator licence and the Inter font licence are included in [assets](assets/).
