# nightwatch-saucelabs-visual
Nightwatch.js plugin (custom command and assertion) for automated visual regression testing through SauceLabs Visual E2E

This plugin allows you to run [SauceLabs Visual E2E](https://docs.saucelabs.com/visual/) tests inside [Nightwatch.js](https://www.nightwatchjs.org) automated test suites.

nightwatch-saucelabs-visual adds custom commands and assertions to Nightwatch that allow you to begin, take snapshots, and end SauceLabs visual tests within your Nightwatch test suites. You can even mix it in with regular Nightwatch functional assertions in your existing test flows.

```js
'Example test': (browser) => {
    browser.url('https://www.davidmello.com');
    browser.beginVisualTest("Name for my visual test")
    browser.takeSnapshot("Name for my snapshot");
    browser.assert.visuallyTheSame();
}
```

## What is Visual Regression Testing?

Visual regression testing is a form of software testing you can use to write automated test cases against your web applications to look for visual regressions.

Visual testing can be more effective at testing for look and feel, visual, and layout changes in your UI than traditional functional automated test assertions that rely on checking against value or attribute changes.

High level, visual tests compare a screenshot of the web application against a known baseline and report visual differences as errors.

Visual testing can check entire web pages with one test where functional tests need to have a separate assertion written for each area that needs to be checked. In addition, functional tests may miss issues that appear outside of their comparatively narrower checks.

Visual tests will cast a much wider net with less code alerting you to potential issues your functional tests may miss. The downside is they *have the potential* to be more flaky and they don't provide as much at-a-glance specifics about a failure than a functional test would. For example, something visually changed vs expected value 1, but got 2.

It is great to use in tandem with functional testing depending on the area being tested or for visually heavy features being tested.

## Installation Instructions

In the same directory as your Nightwatch test project

`npm i nightwatch-saucelabs-visual --save-dev`

This will install the plugin inside your Nightwatch test project inside the /node_modules folder. You have two different ways you can associate them with Nightwatch depending on your version.

### For Nightwatch 2.0 (plugin pattern)

In nightwatch.json or nightwatch.conf.js add nightwatch-saucelabs-visual to your plugins list

```js
{
  src_folders: [...],

  plugins: ['nightwatch-saucelabs-visual']

  // other nightwatch config options
}
```

### For Nightwatch 1.x (manually specify folders)

In nightwatch.json or nightwatch.conf.js add the node_modules paths to the custom_commands_path and custom_assertions_path

```js
{
  src_folders: [...],

  "custom_commands_path": ["./node_modules/nightwatch-saucelabs-visual/custom-commands"],
  "custom_assertions_path": ["./node_modules/nightwatch-saucelabs-visual/custom-assertions"],

  // other nightwatch config options
}
```

## Configuring Nightwatch.js with SauceLabs

SauceLabs Visual E2E requires a SauceLabs subscription. You'll want to associate those into [environment variables](https://www.davidmello.com/how-to-use-nightwatch-with-saucelabs/) if you haven't already and then add the following entries to your nightwatch.json or nightwatch.conf.js configuration file. Note the hub.screener.io and sauce:visual sections that are specific to Sauce Visual E2E.

```js
"test_settings": {
        "default": {
            ...
            "username": "${SAUCE_USERNAME}",
            "access_key": "${SAUCE_ACCESS_KEY}",
            "sauce_region": "us-west-1",
            "selenium": {
                "port": 443,
                "host": "hub.screener.io",
                "protocol": "https",
                "path": "/wd/hub",
                "start_process": false
            },
            "desiredCapabilities": {
                "browserName": "chrome",
                "screenResolution": "1920x1080",
                "browserVersion": "latest",
                "javascriptEnabled": true,
                "acceptSslCerts": true,
                "timeZone": "New York",
                "sauce:options": {
                    "username": "${SAUCE_USERNAME}",
                    "accesskey": "${SAUCE_ACCESS_KEY}"
                },
                "sauce:visual": {
                    "apiKey": "your-sauce-visual-api-key-here",
                    "projectName": "name-of-your-sauce-visual-project",
                    "viewportSize": "1920x1080"
                }
            }
        }
    }
```
## Running Visual Tests

For a SauceLabs visual test to work you need to initialize the test, take a screenshot, and then end the test--which causes the test result to be calculated. These steps are triggered by calling beginVisualTest, takeSnapshot, and endVisualTest (or by calling the visuallyTheSame() assertion instead of endVisualTest).

Below is an example

```js
'Example test': (browser) => {
    browser.url('https://www.davidmello.com');
    browser.beginVisualTest("Name for my visual test") // initializes the test
    browser.takeSnapshot("Name for my snapshot"); // takes a snapshot to compare (you can call this multiple times in different areas you navigate to)
    browser.assert.visuallyTheSame(); // will end the test and report pass if there were no changes or fail if there was
}
```

### beginVisualTest(testName, cssSelectorsToIgnore)

This custom command starts a visual test expects the name of the test and, optionally, a comma-separated string of css selectors you want to ignore changes in ".h2,#adBanner" for the entire test. This needs to be called before any other visual methods.

### takeSnapshot(testName, cssSelectorsToIgnore)

This command takes snapshots of the currently navigated to state of the web application. This custom command expects the name of the snapshot and, optionally, a comma-separated string of css selectors you want to ignore changes in ".h2,#adBanner" in *this specific* snapshot.

### endVisualTest

This command is called after beginVisualTest and takeSnapshot and will trigger comparison of the snapshots against the baseline. After, it will return a JSON response similar to 

```js
{
  passed: true,
  status: 'success',
  totals: {new: 0, changed: 0, accepted: 2, rejected: 0, all: 2},
  states: [
    {name: 'State 1', groupName: 'Test 1', status: 'accepted', url: '...'}
    {name: 'State 2', groupName: 'Test 1', status: 'accepted', url: '...'}
  ],
  message: null
}
```

### assert.visuallyTheSame

This is a custom assertion that can be used in place of endVisualTest to both end the test and return pass if there were no changes or fail if there were changes detected.

`Verifying the snapshot has no visual regressions in 5000ms - expected "0 visual regressions'" but got: "1 visual regression(s)" (38823ms)`
