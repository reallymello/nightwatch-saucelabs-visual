module.exports = class CustomCommand {
    /**
     * If called after beginVisualSnapshot, takeSnapshot will take capture visual snapshots of the application's 
     * current state in the browser. It can be called multiple times.
     * {@link https://docs.saucelabs.com/visual/e2e-testing/commands-options/#snapshot-command}
     * @param {*} snapshotName Name to give to the visual snapshot
     * @param {*} selectorsToIgnore Comma-separated list of CSS selectors you want the test to bypass visual comparisons for.
     * @returns Only if there is an error response from SauceLabs.
     */
    async command(snapshotName, selectorsToIgnore) {
        let returnValue;
        let optionalSettings = {};

        if (selectorsToIgnore) {
            optionalSettings.ignore = selectorsToIgnore;
        }

        try {
            returnValue = await this.api.execute(
                "/*@visual.snapshot*/", [snapshotName, optionalSettings]);
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