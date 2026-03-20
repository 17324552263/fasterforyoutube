# Faster For YouTube
Unlocking video playback speeds and functionality for users to own how they want to interact with media.

Maintaining a set of principles which puts user experience above all else:
- No data collected. Data utilized by the extension stays on the user's computer and is not collected.
- Avoid unncessary dependencies. Reduce distractions from pursuing the main goals, while maximizing the accessibility of the codebase.

## Project Structure
The project has two main sections, the public website hosted by [Github Pages](https://docs.github.com/en/pages) within `docs/` and the chrome extension source under `src/`.

### Public Website
With Github Pages, we host under the [subdomain FFYT](https://ffyt.17324552263.com/) showcasing a landing page, privacy policy, and release notes.

### Source File Overview
`content/`
- `controls` - HTML Speed Buttons added to a video
- `statistics` - 1 Second interval which logs time saved from watching videos faster
- `inject` - We need data directly from YouTube (YT) javascript objects. Content Scripts do not have access to the same executing environment as the page, so we need to _inject_ our own script into the Document Object Model (DOM).
- `extract` - The script which is _inject_-ed into the DOM to retrieve and post back data.

`public/`
- `index` - Popup that appears when the extension is clicked.
- `channels`- Channel Statistics list that shows time saved by channel.

`service/`
- `background` - Service worker handling event-based requests and rebroadcasting messages.

## Building & Distribution

No build tools or dependencies are required. The extension runs directly from the `src/` directory.

### Load Unpacked (Local Development)

**Chrome / Chromium:**
1. Navigate to `chrome://extensions`
2. Enable **Developer mode** (toggle, top right)
3. Click **Load unpacked** and select the `src/` folder

**Firefox:**
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select any file inside the `src/` folder (e.g. `manifest.json`)

> Temporary add-ons in Firefox are removed when the browser closes. For persistent local installs, you need a [signed or unlisted build](https://extensionworkshop.com/documentation/publish/).

### Create a Release Build

The release artifact is a zip of the `src/` directory. Run from the repo root:

```bash
VERSION=$(grep -m1 '"version"' src/manifest.json | sed 's/[^0-9.]//g') && (cd src && zip -r "../dist/FFTY-${VERSION}.zip" . -x "**/.DS_Store")
```

The version is read directly from `manifest.json`, so updating the manifest is all you need before building. The same zip can be submitted to both stores — Chrome ignores `browser_specific_settings` and Firefox ignores `version_name`.

### Submitting to Stores

| Store | Dashboard | Notes |
|---|---|---|
| Chrome Web Store | [Developer Dashboard](https://chrome.google.com/webstore/devconsole) | Upload the zip under the existing listing |
| Firefox Add-ons (AMO) | [Developer Hub](https://addons.mozilla.org/developers/) | Create a new listing; the `gecko.id` in `manifest.json` ties it to your account |

## Chrome Extension - How Do?
Working in the Chrome Extension ecosystem has its own set of constraints and preferred architecture. Different aspects of your extension have access to different subsets of the HTML elements and the Chrome API. Bridging this gap, is a set of messaging capabilities which ensure higher impact APIs are executed in isolation.

There are 5 main areas of access in a Chrome Extension:
- Popup page which is activated by clicking on a specific chrome extension icon on the top bar of the browser
- Extension pages like the Channel Statistics which are hosted under `chrome-extension://{EXTENSION+ID}/path/to/page.html`
- Content Scripts which are injected into certain webpages with access to the HTML elements but execute in an isolated javascript environment.
- Web Accessible Resources which can be attached to a webpage that you have had a Content Script injected. This allows you to gain access to Javascript objects on the page that a Content Script wouldn't have access to.
- Background service worker that is persistent* across all the tabs your extension may be running on.
    - *Event driven responses means your service worker may be put to sleep when not utilized, unloading local variables.

### Chrome Extension Message Flow
Once you understand how information is passed between the above components, breaking down where to add new functionality or investigate issues becomes easier.

- Popup pages, Extension pages, and Background service worker can broadcast messages across your extension and to specific tabs.
- Content Scripts can broadcast messages across your extension.
- Web Accessible Resources executing within the page and outside of the Chrome API can only use `window.postMessage` which can be intercepted by anyone listening.