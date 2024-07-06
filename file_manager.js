const fs = require('fs');

/**
 * Handles functionality for retrieving, creating, and saving files
 *
 * @type {module.FileManager}
 */
module.exports = class FileManager {

    /**
     * Initializes member variables that will be needed by the class
     *
     * @param benchmark_folder {string}, path to save benchmark file to
     * @returns void
     */
    constructor(benchmark_folder){

        /**
         * Path to save benchmark file to
         * @type {string}
         */
        this.benchmark_folder = benchmark_folder;

        /**
         * File which to save the benchmark data too
         * @type {string}
         */
        this.save_file = "";

    }

    /**
     * Gets the name of the last file in the directory. This is for running multiple benchmarks on a websocket
     * server. Files will be labels 1_1.csv, 2_1.csv, 3_1.csv, etc.
     *
     * @returns {Promise} resolves with the last file in the directory, 0_0.csv if the directory is empty
     */
    async getLastFile() {

        return new Promise((resolve, reject) => {

            //default to 0_0.csv is no files are found
            const last_file = "0_0.csv";

            try {

                //if directory doesn't exist, create it
                if (!fs.existsSync(this.benchmark_folder)) {
                    fs.mkdirSync(this.benchmark_folder,{ recursive: true });
                }

                // grab all the files in the directory
                fs.readdir(this.benchmark_folder, (err, files) => {

                    // resolve with the last file
                    resolve(files[files.length - 1]);
                });
            } catch (e) {

                //resolve the default file name
                resolve(last_file);
            }
        });
    }

    /**
     * Create a new file succeeding the previous file
     *
     * @returns {Promise<void>}
     */
    createFile(repetitionNumber = 1) {
        return new Promise((resolve, reject) => {
            if (typeof this.test_number !== 'undefined') {
                this.save_file = this.benchmark_folder + String(this.test_number).padStart(3, '0') + "_" + repetitionNumber + ".csv";
                resolve();
                return;
            }
            // retrieve the name of the last file in the directory
            this.getLastFile().then((file) => {
                let found;

                // set default file numbers in case the last file has an invalid name
                if (file === undefined) {
                    found = [null, 0, 0];
                } else {

                    // grab the benchmark numbers of the previous filename
                    const regex = /(?<test>\d+)_(?<run>\d+).csv/;
                    found = file.match(regex);
                }

                this.test_number = parseInt(found[1]) + 1;

                // create a new file indicating it is a benchmark test succeeding the previous file
                this.save_file = this.benchmark_folder + String(this.test_number).padStart(3, '0') + "_" + repetitionNumber + ".csv";

                resolve();
            });
        });

    }

    /**
     * Saves a given Object of data to a CSV file determined earlier in the program
     *
     * @param data {Object} the given data to save to a CSV file
     *
     * @returns {Promise} resolves when done
     */
    saveDataToFile(data, filename = null) {
        if (filename === null) {
            filename = this.save_file
        }

        const newLine = '\n';

        // create a CSV string from the data object
        const csv = Object.keys(data).map(function(k){return data[k]}).join(",") + newLine;

        return new Promise((resolve, reject) => {

            // allows for this to be used within nested functions
            let self = this;

            // grab the predetermined file
            fs.stat(filename, function (err, stat) {
                if (err == null) {
                    // if the file is retrieved without an error, append the data to the file

                    // append string to the file
                    fs.appendFile(filename, csv, function (err) {
                        if (err) throw reject();

                        // resolve when done
                        resolve();
                    });
                } else {
                    // if the file is not found, create the file with the column headings

                    // get the column headings
                    const fields = Object.keys(data) + newLine;

                    fs.writeFile(filename, fields + csv, function (err) {
                        if (err) throw reject();

                        resolve();
                    });
                }
            });
        });
    }
};
