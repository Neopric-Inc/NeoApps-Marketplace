"""Generate the marketplace's public search pages, sitemap and plain-text editions."""
from collections import defaultdict
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin
from xml.etree import ElementTree as ET
import json
import os
import re
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://neopric-inc.github.io/NeoApps-Marketplace/"
BRAND = "NeoApps.AI"
SETUP = "https://neoapps.ai/get-started.html"
ENDPOINT = "https://cloud.neoapps.ai/mcp"
PLATFORM = "https://neoapps.ai/"
DOCS = "https://neoapps.ai/docs.html"
PRICING = "https://neoapps.ai/pricing.html"
AGENTS = "https://neoapps.ai/llms.txt"
BOOK = "resources/marketplace-playbook.xlsx"
PRD = "resources/marketplace-prd.md"
GUIDE = "connect/"
CATALOG = "catalog/"
WAVES = {1:"Pilot", 2:"Expansion", 3:"Specialist"}


def link(label, url):
    return f'<a href="{escape(url, quote=True)}">{escape(label)}</a>'


def connect_copy():
    return f"""
<p>NeoApps.AI lets a team use its AI assistant to plan a business application, review its screens and access rules, and publish the approved app to NeoApps Cloud.</p>
<h2>When is NeoApps.AI a good fit?</h2>
<p>Consider NeoApps.AI when several people repeat a workflow and need different access to the same records. Examples include a client uploading documents for staff review, a coordinator verifying volunteer shifts, or a manager tracking an approval. Start with a marketplace brief that matches the task and adapt its roles and acceptance test.</p>
<h2>How do I connect my assistant?</h2>
<p>Add NeoApps as a remote Model Context Protocol (MCP) connector. Enter this server URL in the connector settings.</p>
<pre>{ENDPOINT}</pre>
<ul>
<li><strong>Claude.</strong> In Settings, open Connectors and add a custom connector named NeoApps.</li>
<li><strong>ChatGPT.</strong> In the Apps or Apps &amp; Connectors settings, enable developer mode if required for a custom app, then create the connection.</li>
<li><strong>Codex CLI.</strong> Register the remote server with <code>codex mcp add neoapps --url {ENDPOINT}</code>. If authorization is still pending, run <code>codex mcp login neoapps</code>.</li>
<li><strong>Gemini.</strong> In Connectors, add a custom connection, enter the server URL and leave the client ID empty as directed in the NeoApps guide.</li>
</ul>
<p>Complete the sign-in on NeoApps Cloud and review the access request. A managed workspace may require an administrator to enable custom connectors. {link("Official setup instructions for each assistant", SETUP)}.</p>
<h2>How do I know it is connected?</h2>
<p>Start a conversation with NeoApps enabled and ask, “Which apps are in my NeoApps Cloud account?” A new account may return an empty list. If you expected existing apps, check which NeoApps account you authorized.</p>
<h2>What should I ask my assistant to build first?</h2>
<blockquote>Use NeoApps to plan a volunteer hours app. Volunteers submit their own shifts, coordinators approve or return them, and program leads export verified totals. Show me the screens and permissions. Test two approved shifts of 90 and 150 minutes against an expected total of four hours. Wait for my approval before publishing.</blockquote>
<p>To use another workflow, open its catalog brief and copy the build prompt and acceptance test into your connected assistant. Review the plan with fictional records. Once you approve it, ask the assistant to publish, check the deployment status and return the live URL.</p>
<h2>Where do I try a sample or start a real project?</h2>
<p>The marketplace demos use fictional records and run in the browser. Production account access and publishing take place on NeoApps Cloud. Template offers and prices in the marketplace are illustrative. {link("Open NeoApps Cloud", "https://cloud.neoapps.ai/")} · {link("Current plans and pricing", PRICING)}.</p>
<p>{link("NeoApps.AI home", PLATFORM)} · {link("First-app and troubleshooting guide", DOCS)} · {link("Platform agent documentation", AGENTS)}.</p>
"""


class VisibleCopy(HTMLParser):
    """Extract readable paragraphs, field labels and links without executing the UI."""
    blocks = set("article section nav header footer main div p li ul ol h1 h2 h3 h4 pre br dt dd summary details button option label blockquote form tr td".split())

    def __init__(self, address):
        super().__init__(convert_charrefs=True)
        self.address = address
        self.parts = []
        self.ignored = 0
        self.href = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in {"svg", "script", "style"}:
            self.ignored += 1
        if self.ignored:
            return
        if tag in self.blocks:
            self.parts.append("\n")
        if tag == "a":
            self.href = urljoin(self.address, attrs.get("href", ""))
        elif tag in {"input", "textarea"}:
            hint = attrs.get("placeholder") or attrs.get("aria-label")
            if hint:
                self.parts.append(" (" + hint + ") ")
        elif tag == "iframe" and attrs.get("src"):
            self.parts.append(" " + urljoin(self.address, attrs["src"]) + " ")

    def handle_endtag(self, tag):
        if tag in {"svg", "script", "style"}:
            self.ignored -= 1
            return
        if self.ignored:
            return
        if tag == "a" and self.href:
            self.parts.append(" <" + self.href + "> ")
            self.href = ""
        if tag in self.blocks:
            self.parts.append("\n")

    def handle_data(self, text):
        if not self.ignored:
            self.parts.append(re.sub(r"\s+", " ", text))

    def text(self):
        lines = (" ".join(row.split()) for row in "".join(self.parts).splitlines())
        return "\n".join(row for row in lines if row)


def plain(html, address=BASE):
    parser = VisibleCopy(address)
    parser.feed(html)
    parser.close()
    return parser.text()


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def brief_path(app):
    return f"catalog/{app['id']}/"


def page(path, title, description, body, kind="WebPage"):
    prefix = "../" * len(Path(path).parts)
    canonical = BASE + path
    metadata = {"@context":"https://schema.org", "@type":kind, "name":title, "description":description, "url":canonical,
                "isPartOf":{"@type":"WebSite","name":"NeoApps.AI Marketplace","url":BASE},
                "publisher":{"@type":"Organization","name":BRAND,"url":PLATFORM}}
    structured = json.dumps(metadata, ensure_ascii=False).replace("<", "\\u003c")
    return f"""<!doctype html>
<html lang="en"><head>
<!-- Generated by scripts/export-discovery.py -->
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)} · NeoApps.AI Marketplace</title>
<meta name="description" content="{escape(description, quote=True)}">
<link rel="canonical" href="{canonical}"><link rel="icon" href="{prefix}assets/neoapps.svg">
<link rel="stylesheet" href="{prefix}styles.css"><link rel="describedby" type="text/plain" href="{prefix}llms.txt">
<script type="application/ld+json">{structured}</script>
</head><body class="reference-page"><a class="skip" href="#content">Skip to content</a>
<header><nav class="wrap ref-nav" aria-label="Marketplace navigation">
<a class="brand" href="{prefix}"><img src="{prefix}assets/neoapps.svg" alt="">NeoApps.AI</a>
{link("Catalog",prefix+CATALOG)} {link("Connect your assistant",prefix+GUIDE)}</nav></header>
<main id="content" class="wrap ref-main" tabindex="-1"><h1>{escape(title)}</h1>
{body}
</main><footer><div class="wrap ref-nav">{link("Interactive marketplace",prefix)} {link("Complete marketplace text",prefix+"llms.txt")} {link("Text index",prefix+"llms-index.txt")} {link("NeoApps.AI",PLATFORM)}</div></footer></body></html>
"""


def brief_html(a, pilot):
    body = ['<p class="intro">'+escape(a["pitch"])+'</p>',
            '<p class="smalltext">'+escape(" · ".join(filter(None, [a["category"], a.get("group"), f'Brief {a["id"]}'])))+'</p>']
    facts = {"Primary buyer":a["buyer"], "Workflow":a["family"], "Access":a["access"],
             "Release wave":WAVES[a["wave"]], "Proposed offer":a["offer"],
             "Runtime AI":"Model required" if a["ai"] else "No model required"}
    body.append('<dl class="facts">'+''.join(f'<div><dt>{k}</dt><dd>{escape(v)}</dd></div>' for k,v in facts.items())+'</dl>')
    if a.get("roles"):
        body.append('<h2>Roles and permissions</h2><p>'+escape(a["roles"])+'</p>')
    body.extend(['<h2>Build prompt</h2><p>'+escape(a["prompt"])+'</p>',
                 '<h2>Acceptance test</h2><p>'+escape(a["test"])+'</p>'])
    if pilot:
        name, _, desc, tables, roles, steps, price = pilot['config']
        body.extend([f'<h2>Try {escape(name)}</h2><p>{escape(desc)}</p>',
                     '<p><strong>Included tables</strong> · '+escape(tables)+'</p>',
                     '<p><strong>Sample roles</strong> · '+escape(roles)+'</p>',
                     '<ol>'+''.join('<li>'+escape(step.strip())+'</li>' for step in steps.split(','))+'</ol>',
                     f'<p>Illustrative demo price · USD {price}. This sample uses fictional records.</p>',
                     '<p>'+link("Open the interactive sample",f'../../#/demo/{a["id"]}')+' · '+link("View pilot listing",f'../../#/app/{a["id"]}')+'</p>'])
    else:
        body.append('<p>This listing is a build brief. Use its prompt to plan an app in your own NeoApps account.</p>')
    if a.get("reference"):
        body.append('<p>'+link("Related NeoApps.AI template",a["reference"])+'</p>')
    body.append('<p>'+link("Open brief with copy controls",f'../../#/brief/{a["id"]}')+' · '+link("Connect your assistant","../../connect/")+'</p>')
    return "\n".join(body)


def workbook_launch_text():
    # Catalog and Build briefs are represented in the catalog records below.
    # Decisions and variants are rendered directly by their playbook tabs.
    with zipfile.ZipFile(ROOT/BOOK) as archive:
        sheets = ET.fromstring(archive.read("xl/workbook.xml"))
        launch = next(s for s in sheets.findall(".//{*}sheet") if s.get("name") == "Launch plan")
        rel_id = launch.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
        rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        target = next(r.get("Target") for r in rels if r.get("Id") == rel_id)
        strings = ["".join(i.itertext()) for i in ET.fromstring(archive.read("xl/sharedStrings.xml"))]
        xml = ET.fromstring(archive.read(urljoin("xl/workbook.xml", target).lstrip("/")))
        rows = []
        for row in xml.findall(".//{*}sheetData/{*}row"):
            values = []
            for cell in row.findall("{*}c"):
                value = cell.findtext("{*}v")
                if cell.get("t") == "inlineStr":
                    value = "".join(cell.find("{*}is").itertext())
                elif cell.get("t") == "s" and value is not None:
                    value = strings[int(value)]
                if value:
                    values.append(value)
            if values:
                rows.append(" | ".join(values))
        return "\n".join(rows)


def write(path, content):
    output = ROOT/path
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(content.rstrip()+"\n", encoding="utf8")


def main():
    render = subprocess.check_output(["node", "scripts/read-public-views.mjs"], cwd=ROOT,
                                     env={**os.environ, "TZ":"UTC", "LANG":"en_US.UTF-8"})
    snapshot = json.loads(render)
    apps, pilots = snapshot["playbook"]["apps"], snapshot["pilots"]
    groups = defaultdict(list)
    for app in apps:
        groups[app["category"]].append(app)
    description = f"Explore {len(apps)} NeoApps.AI business app briefs across {len(groups)} categories, including {len(pilots)} interactive samples. Find a build prompt, access rules and an acceptance test."
    title = "Business app catalog"
    guide_title = "Connect your AI assistant to NeoApps.AI"
    connect = connect_copy()
    write(GUIDE+"index.html",page(GUIDE,guide_title,"Connect to NeoApps Cloud from ChatGPT, Claude, Codex or Gemini, verify your account and plan your first business app.",connect))
    catalog = [f'<p class="intro">{escape(description)}</p><p>{link("Connect your assistant","../connect/")} · {link("Download the playbook","../"+BOOK)}</p>']
    topics = [(category, "category-"+slug(category)) for category in groups]
    catalog.append('<nav class="ref-topics" aria-label="Categories">'+''.join(link(c, "#"+anchor) for c,anchor in topics)+'</nav>')
    index = ["# NeoApps.AI Marketplace", "> "+description, "## Start here",
             f"- [Complete marketplace copy]({BASE}llms.txt) – All briefs, pilot workflows, public screens, playbook and product requirements.",
             f"- [Catalog]({BASE}{CATALOG}) – Browse all briefs without JavaScript.",
             f"- [Connection guide]({BASE}{GUIDE}) – Set up an assistant and verify the connection.",
             f"- [Official NeoApps setup]({SETUP}) – Instructions by assistant.",
             f"- [Platform agent index]({AGENTS}) – NeoApps Cloud and developer documentation.",
             f"- [Marketplace workbook]({BASE}{BOOK})", f"- [Product requirements]({BASE}{PRD})", "## Collections"]
    corpus = ["# NeoApps.AI Marketplace — complete public text", "> "+description,
              f"Marketplace: {BASE}\nCatalog: {BASE}{CATALOG}\nCompact text index: {BASE}llms-index.txt\nOfficial platform: {PLATFORM}",
              "## Connect to NeoApps.AI", plain(connect),
              "## What is available today?","The catalog combines build briefs with interactive factory pilots. The marketplace checkout, orders, notifications and deployments shown below are browser-local demonstrations. The product requirements appendix describes the proposed production service.",
              "## Marketplace catalog"]
    for category,anchor in topics:
        members = groups[category]
        index.append(f"- [{category}]({BASE}{CATALOG}#{anchor}) – {len(members)} briefs.")
        catalog.append(f'<section id="{anchor}"><h2>{escape(category)}</h2><ul class="ref-list">')
        corpus.append("## "+category)
        for a in members:
            path = brief_path(a)
            pilot = pilots.get(str(a["id"]))
            content = brief_html(a,pilot)
            write(path+"index.html",page(path,a["title"],a["pitch"],content,"WebPage"))
            catalog.append('<li>'+link(a["title"],str(a["id"])+"/")+'<p>'+escape(a["pitch"])+'</p></li>')
            corpus.extend([f'### Brief {a["id"]} — {a["title"]}', BASE+path, plain(content,BASE+path)])
        catalog.append('</ul></section>')
    write(CATALOG+"index.html",page(CATALOG,title,description,"\n".join(catalog),"CollectionPage"))
    index.append("## Plain-text category briefs")
    for file in sorted((ROOT/"resources/briefs").glob("*.md")):
        heading = file.read_text().splitlines()[0].removeprefix("# ")
        index.append(f"- [{heading}]({BASE}resources/briefs/{file.name})")
    index.append("## Interactive pilots")
    for i,pilot in pilots.items():
        index.append(f'- [{pilot["config"][0]}]({BASE}catalog/{i}/) – [Try the sample]({BASE}#/demo/{i}).')
    write("llms-index.txt","\n".join(index))
    corpus.insert(corpus.index("## Marketplace catalog"), "## Source directory\n\n"+"\n".join(index[3:]))
    expected = {brief_path(a)+"index.html" for a in apps}
    for file in (ROOT/CATALOG).glob("[0-9]*/index.html"):
        if (file.parent.name.isdecimal() and file.relative_to(ROOT).as_posix() not in expected
                and "<!-- Generated by scripts/export-discovery.py -->" in file.read_text()):
            file.unlink()
    corpus.extend(["## Public marketplace pages and playbook",
                   "Page text uses the default fictional workspace. Links to the interactive storefront use its original routes."])
    for name,html in snapshot["routes"].items():
        corpus.extend(["### "+name,plain(html)])
    corpus.append("## Factory pilot listings and sample screens")
    for i,pilot in pilots.items():
        corpus.extend(['### '+pilot["config"][0],f'{BASE}catalog/{i}/\nSample: {BASE}#/demo/{i}'])
        for name,html in (pilot["views"] | pilot["demo"]).items():
            corpus.extend(["#### "+name,plain(html)])
    corpus.append("## Buyer and factory operations preview")
    for name,html in snapshot["buyer"].items():
        corpus.extend(["### "+name,plain(html)])
    corpus.extend(["## Editable playbook — launch plan",BASE+BOOK,workbook_launch_text(),
                   "## Product requirements — planning document",BASE+PRD,(ROOT/PRD).read_text(),
                   "## Repository guide",BASE+"README.md",(ROOT/"README.md").read_text()])
    write("llms.txt","\n\n".join(corpus))
    urls = ["", CATALOG, GUIDE]+[brief_path(a) for a in apps]
    write("sitemap.xml",'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
          "\n".join(f"  <url><loc>{escape(BASE+p)}</loc></url>" for p in urls)+"\n</urlset>")
    print(f"Generated {len(apps)} brief pages, {len(urls)} sitemap entries and both text editions.")


if __name__ == "__main__":
    main()
