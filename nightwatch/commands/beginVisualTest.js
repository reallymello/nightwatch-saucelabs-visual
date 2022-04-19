module.exports = class CustomCommand {
    /**
     * This command will initialize, start, a SauceLabs Visual test and needs to be called before takeSnapshot or endVisualTest.
     * {@link https://docs.saucelabs.com/visual/e2e-testing/commands-options/#init-command}
     * @param {*} visualTestName The name for your visual test
     * @param {*} selectorsToIgnore Comma-separated list of CSS selectors you want the test to bypass visual comparisons for.
     * @returns Only if there is an error response from SauceLabs.
     */
    async command(visualTestName, selectorsToIgnore) {
        let returnValue;
        let optionalSettings = {};

        if (selectorsToIgnore) {
            optionalSettings.ignore = selectorsToIgnore;
        }

        try {
            returnValue = await this.api.execute(
                "/*@visual.init*/", [visualTestName, optionalSettings]);
        } catch (err) {
            console.error('An error occurred', err);
            returnValue = {
                status: -1,
                error: err.message
            }
        }

        return returnValue;
    }
}