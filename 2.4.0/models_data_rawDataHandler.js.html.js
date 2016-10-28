tui.util.defineNamespace("fedoc.content", {});
fedoc.content["models_data_rawDataHandler.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Raw data handler.\n * @author NHN Ent.\n *         FE Development Lab &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar chartConst = require('../../const');\nvar predicate = require('../../helpers/predicate');\n\n/**\n * Raw data Handler.\n * @module rawDataHandler\n */\nvar rawDataHandler = {\n    /**\n     * Pick stacks.\n     * @param {Array.&lt;{stack: string}>} seriesData - raw series data\n     * @param {boolean} [divergingOption] - diverging option\n     * @returns {Array.&lt;string>} stacks\n     */\n    pickStacks: function(seriesData, divergingOption) {\n        var stacks, uniqStacks, filteredStack;\n\n        stacks = tui.util.map(seriesData, function(seriesDatum) {\n            return seriesDatum.stack;\n        });\n\n        uniqStacks = tui.util.unique(stacks);\n\n        if (divergingOption) {\n            uniqStacks = uniqStacks.slice(0, 2);\n        }\n\n        filteredStack = tui.util.filter(uniqStacks, function(stack) {\n            return !!stack;\n        });\n\n        if (filteredStack.length &lt; uniqStacks.length) {\n            filteredStack.push(chartConst.DEFAULT_STACK);\n        }\n\n        return filteredStack;\n    },\n\n    /**\n     * Sort series data from stacks.\n     * @param {Array.&lt;{stack: ?string}>} seriesData series data\n     * @param {Array.&lt;string>} stacks stacks\n     * @returns {Array}\n     * @private\n     */\n    _sortSeriesData: function(seriesData, stacks) {\n        var newSeriesData = [];\n\n        if (!stacks) {\n            stacks = this.pickStacks(seriesData);\n        }\n\n        tui.util.forEachArray(stacks, function(stack) {\n            var filtered = tui.util.filter(seriesData, function(datum) {\n                return (datum.stack || chartConst.DEFAULT_STACK) === stack;\n            });\n            newSeriesData = newSeriesData.concat(filtered);\n        });\n\n        return newSeriesData;\n    },\n\n    /**\n     * Remove stack of series data.\n     * @param {Array.&lt;{stack: ?string}>} seriesData series data\n     */\n    removeSeriesStack: function(seriesData) {\n        tui.util.forEachArray(seriesData, function(datum) {\n            delete datum.stack;\n        });\n    },\n\n    /**\n     * Find char type from chart name.\n     * @param {object.&lt;string, string>} seriesAlias - alias map\n     * @param {string} seriesName - series name\n     * @returns {*}\n     */\n    findChartType: function(seriesAlias, seriesName) {\n        var chartType;\n\n        if (seriesAlias) {\n            chartType = seriesAlias[seriesName];\n        }\n\n        return chartType || seriesName;\n    },\n\n    /**\n     * Get chart type map.\n     * @param {{series: (Array | object)}} rawData - raw data\n     * @returns {object.&lt;string, string>}\n     */\n    getChartTypeMap: function(rawData) {\n        var self = this;\n        var chartTypeMap = {};\n\n        if (tui.util.isObject(rawData.series)) {\n            tui.util.forEach(rawData.series, function(data, seriesName) {\n                chartTypeMap[self.findChartType(rawData.seriesAlias, seriesName)] = true;\n            });\n        }\n\n        return chartTypeMap;\n    },\n\n    /**\n     * Create minus values.\n     * @param {Array.&lt;number>} data number data\n     * @returns {Array} minus values\n     * @private\n     */\n    _createMinusValues: function(data) {\n        return tui.util.map(data, function(value) {\n            return value &lt; 0 ? 0 : -value;\n        });\n    },\n\n    /**\n     * Create plus values.\n     * @param {Array.&lt;number>} data number data\n     * @returns {Array} plus values\n     * @private\n     */\n    _createPlusValues: function(data) {\n        return tui.util.map(data, function(value) {\n            return value &lt; 0 ? 0 : value;\n        });\n    },\n\n    /**\n     * Make normal diverging raw series data.\n     * @param {{data: Array.&lt;number>}} rawSeriesData raw series data\n     * @returns {{data: Array.&lt;number>}} changed raw series data\n     * @private\n     */\n    _makeNormalDivergingRawSeriesData: function(rawSeriesData) {\n        rawSeriesData.length = Math.min(rawSeriesData.length, 2);\n\n        rawSeriesData[0].data = this._createMinusValues(rawSeriesData[0].data);\n\n        if (rawSeriesData[1]) {\n            rawSeriesData[1].data = this._createPlusValues(rawSeriesData[1].data);\n        }\n\n        return rawSeriesData;\n    },\n\n    /**\n     * Make raw series data for stacked diverging option.\n     * @param {{data: Array.&lt;number>, stack: string}} rawSeriesData raw series data\n     * @returns {{data: Array.&lt;number>}} changed raw series data\n     * @private\n     */\n    _makeRawSeriesDataForStackedDiverging: function(rawSeriesData) {\n        var self = this;\n        var stacks = this.pickStacks(rawSeriesData, true);\n        var result = [];\n        var leftStack = stacks[0];\n        var rightStack = stacks[1];\n\n        rawSeriesData = this._sortSeriesData(rawSeriesData, stacks);\n\n        tui.util.forEachArray(rawSeriesData, function(seriesDatum) {\n            var stack = seriesDatum.stack || chartConst.DEFAULT_STACK;\n            if (stack === leftStack) {\n                seriesDatum.data = self._createMinusValues(seriesDatum.data);\n                result.push(seriesDatum);\n            } else if (stack === rightStack) {\n                seriesDatum.data = self._createPlusValues(seriesDatum.data);\n                result.push(seriesDatum);\n            }\n        });\n\n        return result;\n    },\n\n    /**\n     * Make raw series data for diverging.\n     * @param {{data: Array.&lt;number>, stack: string}} rawSeriesData raw series data\n     * @param {?string} stackTypeOption stackType option\n     * @returns {{data: Array.&lt;number>}} changed raw series data\n     * @private\n     */\n    _makeRawSeriesDataForDiverging: function(rawSeriesData, stackTypeOption) {\n        if (predicate.isValidStackOption(stackTypeOption)) {\n            rawSeriesData = this._makeRawSeriesDataForStackedDiverging(rawSeriesData);\n        } else {\n            rawSeriesData = this._makeNormalDivergingRawSeriesData(rawSeriesData);\n        }\n\n        return rawSeriesData;\n    },\n\n    /**\n     * Update raw series data by options.\n     * @param {object} rawData - raw data\n     * @param {{stackType: ?string, diverging: ?boolean}} seriesOptions - series options\n     */\n    updateRawSeriesDataByOptions: function(rawData, seriesOptions) {\n        seriesOptions = seriesOptions || {};\n\n        if (predicate.isValidStackOption(seriesOptions.stackType)) {\n            rawData.series = this._sortSeriesData(rawData.series);\n        }\n\n        if (seriesOptions.diverging) {\n            rawData.series = this._makeRawSeriesDataForDiverging(rawData.series, seriesOptions.stackType);\n        }\n    },\n\n    /**\n     * Filter raw data belong to checked legend.\n     * @param {object} rawData raw data\n     * @param {Array.&lt;?boolean> | {line: ?Array.&lt;boolean>, column: ?Array.&lt;boolean>}} checkedLegends checked legends\n     * @returns {object} rawData\n     */\n    filterCheckedRawData: function(rawData, checkedLegends) {\n        var cloneData = JSON.parse(JSON.stringify(rawData));\n\n        if (tui.util.isArray(cloneData.series)) {\n            cloneData.series = tui.util.filter(cloneData.series, function(series, index) {\n                return checkedLegends[index];\n            });\n        } else {\n            tui.util.forEach(cloneData.series, function(serieses, chartType) {\n                if (!checkedLegends[chartType]) {\n                    cloneData.series[chartType] = [];\n                } else if (checkedLegends[chartType].length) {\n                    cloneData.series[chartType] = tui.util.filter(serieses, function(series, index) {\n                        return checkedLegends[chartType][index];\n                    });\n                }\n            });\n        }\n\n        return cloneData;\n    }\n};\n\nmodule.exports = rawDataHandler;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"