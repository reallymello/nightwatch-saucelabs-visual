module.exports = class CustomCommand {
    /**
     * This command is run after beginVisualTest and after takeSnapshot to trigger evaluation of the test and return of the test results.
     * @returns Object containing the SauceLabs test result; passed, status, totals, states, message
     * {@link https://docs.saucelabs.com/visual/e2e-testing/commands-options/#example-responses}
     */
    async command() {
        let returnValue;

        try {
            returnValue = await this.api.execute("/*@visual.end*/");
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