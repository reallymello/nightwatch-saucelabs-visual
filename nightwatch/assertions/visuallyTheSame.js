exports.assertion = function (msg) {
    let actualMessage = '';
    this.expected = function () {
        return this.negate ? `presence of visual regressions` : `0 visual regressions'`;
    };

    this.formatMessage = function () {
        const message = msg || `Verifying the snapshot ${this.negate ? 'contains ' : 'has no '}visual regressions`;

        return {
            message,
            args: []
        };
    };

    this.actual = function () {
        return actualMessage;
    };

    this.evaluate = function (result) {
        if (!result) {
            result = {
                passed: false,
                message: "There was an error getting the test result.",
                totals: {
                    changed: -1
                }
            }
        }
        actualMessage = result.message;

        return result.passed;
    };

    this.command = function (callback) {
        this.api.executeScript("/*@visual.end*/", [], function (result) {
            return callback.call(this, result);
        });
    };

};