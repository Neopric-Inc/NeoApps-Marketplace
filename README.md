# NeoApps.AI Marketplace

A standalone static storefront for the NeoApps factory catalog. Buyers can try ten sample workflows and follow a simulated purchase into their own example workspace. Builders can search 119 app briefs, copy a prompt, and check the acceptance test.

## Run locally

From the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [the storefront](http://127.0.0.1:8000/) or [the playbook](http://127.0.0.1:8000/#/playbook). The site uses plain HTML, CSS, and JavaScript. No build step, dependencies, or API keys are required. A static host can serve this directory directly. Relative asset links and hash routes support hosting under a subpath.

## What to try

1. Open **Custom Cake Orders** and select **Try sample app**. Pick a cake, add fondant, and check pickup capacity.
2. Choose **Preview purchase** on the listing. Use the demo account and follow the deployment through **My apps**. Checkout also offers test scenarios for a transient failure, a persistent failure, and an abandoned checkout.
3. Visit the [nonprofit collection](https://neopric-inc.github.io/NeoApps-Marketplace/#/nonprofits) to try the grant reporting and volunteer hours demos, or copy a build prompt from any of its 19 briefs.
4. Open **Playbook** to browse the seven categories and download the workbook or PRD.

The demo stores orders, support tickets, requests, and reviews in the browser. Payments, refunds, sign-in, publishing, and email use sample data. The transcript tagger shows recorded suggestions. Production prices and licence terms remain open in the PRD.

## Repository map

| Path | Contents |
| --- | --- |
| [index.html](index.html), [styles.css](styles.css) | Storefront shell and NeoApps theme |
| [ui.js](ui.js), [main.js](main.js), [nonprofits.js](nonprofits.js) | Catalog, search, navigation, and playbook views |
| [flows.js](flows.js), [ops.js](ops.js) | Buyer journeys and staff preview |
| [examples](examples/) | Ten interactive sample apps |
| [data.js](data.js) | The playbook records used by the website |
| [llms.txt](llms.txt), [llms-index.txt](llms-index.txt) | Full public marketplace text and compact resource index |
| [catalog](catalog/), [connect](connect/), [sitemap.xml](sitemap.xml) | Searchable HTML briefs, assistant setup and canonical page URLs |
| [resources](resources/) | Product requirements, playbook workbook, and Markdown briefs |

After editing the catalog, review the workbook and run `node scripts/export-briefs.mjs` followed by `python3 scripts/export-discovery.py`. The second command uses Python 3 and Node.js to regenerate the standalone HTML, sitemap and both text editions from the current storefront, fictional demos, playbook and PRD. Commit the generated files with their sources. GitHub Pages serves them directly.

The [full text](https://neopric-inc.github.io/NeoApps-Marketplace/llms.txt) and [sitemap](https://neopric-inc.github.io/NeoApps-Marketplace/sitemap.xml) belong to the GitHub Pages marketplace. The [platform agent index](https://neoapps.ai/llms.txt) and [official assistant setup](https://neoapps.ai/get-started.html) live on NeoApps.AI.

## Attribution

The theme and brand mark come from the [NeoApps.AI CodeGenerator website](https://github.com/Neopric-Inc/NeoApps.AI-CodeGenerator/tree/main/website). The original generator licence and the Inter font licence are included in [assets](assets/).
