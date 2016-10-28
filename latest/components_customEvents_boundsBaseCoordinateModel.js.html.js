tui.util.defineNamespace("fedoc.content", {});
fedoc.content["components_customEvents_boundsBaseCoordinateModel.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview BoundsBaseCoordinateModel is data mode for custom event of point type.\n * @author NHN Ent.\n *         FE Development Lab &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\n/**\n * position\n * @typedef {{left: number, top: number}} position\n */\n\n/**\n * bound\n * @typedef {{\n *      dimension: {width: number, height: number},\n *      position: position\n *}} bound\n */\n\n/**\n * group bound\n *  @typedef {Array.&lt;Array.&lt;bound>>} groupBound\n */\n\n/**\n * group position\n *  @typedef {Array.&lt;Array.&lt;position>>} groupPosition\n */\n\n/**\n * series info\n * @typedef {{\n *      chartType: {string},\n *      data: {\n *          groupBounds: ?groupBound,\n *          groupValues: ?Array.&lt;Array.&lt;number>>,\n *          groupPositions: ?groupPosition\n *      }\n *}} seriesInfo\n */\n\nvar chartConst = require('../../const/'),\n    predicate = require('../../helpers/predicate');\n\nvar BoundsBaseCoordinateModel = tui.util.defineClass(/** @lends BoundsBaseCoordinateModel.prototype */ {\n    /**\n     * BoundsBaseCoordinateModel is data mode for custom event of point type.\n     * @constructs BoundsBaseCoordinateModel\n     * @param {Array.&lt;seriesInfo>} seriesInfos series infos\n     */\n    init: function(seriesInfos) {\n        this.data = this._makeData(seriesInfos);\n    },\n\n    /**\n     * Make coordinate data about bar type graph\n     * @param {groupBound} groupBounds group bounds\n     * @param {string} chartType chart type\n     * @returns {Array} coordinate data\n     * @private\n     */\n    _makeRectTypeCoordinateData: function(groupBounds, chartType) {\n        var allowNegativeTooltip = !predicate.isBoxTypeChart(chartType);\n\n        return tui.util.map(groupBounds, function(bounds, groupIndex) {\n            return tui.util.map(bounds, function(_bound, index) {\n                var bound;\n                if (!_bound) {\n                    return null;\n                }\n\n                bound = _bound.end;\n\n                return {\n                    sendData: {\n                        chartType: chartType,\n                        indexes: {\n                            groupIndex: groupIndex,\n                            index: index\n                        },\n                        allowNegativeTooltip: allowNegativeTooltip,\n                        bound: bound\n                    },\n                    bound: {\n                        left: bound.left,\n                        top: bound.top,\n                        right: bound.left + bound.width,\n                        bottom: bound.top + bound.height\n                    }\n                };\n            });\n        });\n    },\n\n    /**\n     * Make coordinate data about dot type graph\n     * @param {groupPositions} groupPositions group positions\n     * @param {string} chartType chart type\n     * @returns {Array.&lt;Array.&lt;object>>} coordinate data\n     * @private\n     */\n    _makeDotTypeCoordinateData: function(groupPositions, chartType) {\n        if (!groupPositions) {\n            return [];\n        }\n\n        return tui.util.map(tui.util.pivot(groupPositions), function(positions, groupIndex) {\n            return tui.util.map(positions, function(position, index) {\n                if (!position) {\n                    return null;\n                }\n                return {\n                    sendData: {\n                        chartType: chartType,\n                        indexes: {\n                            groupIndex: groupIndex,\n                            index: index\n                        },\n                        bound: position\n                    },\n                    bound: {\n                        left: position.left - chartConst.DOT_RADIUS,\n                        top: position.top - chartConst.DOT_RADIUS,\n                        right: position.left + chartConst.DOT_RADIUS,\n                        bottom: position.top + chartConst.DOT_RADIUS\n                    }\n                };\n            });\n        });\n    },\n\n    /**\n     * Join data.\n     * @param {Array.&lt;Array.&lt;Array.&lt;object>>>} groupData group data\n     * @returns {Array.&lt;Array.&lt;object>>} joined data\n     * @private\n     */\n    _joinData: function(groupData) {\n        var results = [];\n        tui.util.forEachArray(groupData, function(coordData) {\n            tui.util.forEachArray(coordData, function(data, index) {\n                var addtionalIndex;\n\n                if (!results[index]) {\n                    results[index] = data;\n                } else {\n                    addtionalIndex = results[index].length;\n                    tui.util.forEachArray(data, function(datum) {\n                        datum.sendData.indexes.legendIndex = datum.sendData.indexes.index + addtionalIndex;\n                    });\n                    results[index] = results[index].concat(data);\n                }\n            });\n        });\n\n        return results;\n    },\n\n    /**\n     * Make coordinate data.\n     * @param {Array.&lt;seriesInfo>} seriesInfos series infos\n     * @returns {Array.&lt;Array.&lt;object>>} coordinate data\n     * @private\n     */\n    _makeData: function(seriesInfos) {\n        var self = this;\n        var coordinateData = tui.util.map(seriesInfos, function(info) {\n            var result;\n            if (predicate.isLineTypeChart(info.chartType)) {\n                result = self._makeDotTypeCoordinateData(info.data.groupPositions, info.chartType);\n            } else {\n                result = self._makeRectTypeCoordinateData(info.data.groupBounds, info.chartType);\n            }\n\n            return result;\n        });\n\n        return this._joinData(coordinateData);\n    },\n\n    /**\n     * Find candidates.\n     * @param {{bound: {left: number, top: number, right: number, bottom: number}}} data data\n     * @param {number} layerX layerX\n     * @param {number} layerY layerY\n     * @returns {Array.&lt;{sendData: object}>} candidates\n     * @private\n     */\n    _findCandidates: function(data, layerX, layerY) {\n        return tui.util.filter(data, function(datum) {\n            var bound = datum &amp;&amp; datum.bound,\n                included = false,\n                includedX, includedY;\n\n            if (bound) {\n                includedX = bound.left &lt;= layerX &amp;&amp; bound.right >= layerX;\n                includedY = bound.top &lt;= layerY &amp;&amp; bound.bottom >= layerY;\n                included = includedX &amp;&amp; includedY;\n            }\n\n            return included;\n        });\n    },\n\n    /**\n     * Find tooltip data.\n     * @param {number} groupIndex group index\n     * @param {number} layerX mouse position x\n     * @param {number} layerY mouse position y\n     * @returns {object} tooltip data\n     */\n    findData: function(groupIndex, layerX, layerY) {\n        var min = 10000;\n        var result = null;\n        var candidates;\n\n        if (groupIndex > -1 &amp;&amp; this.data[groupIndex]) {\n            // layerX, layerY를 포함하는 data 추출\n            candidates = this._findCandidates(this.data[groupIndex], layerX, layerY);\n\n            // 추출된 data 중 top이 layerY와 가장 가까운 data 찾아내기\n            tui.util.forEachArray(candidates, function(data) {\n                var diff = Math.abs(layerY - data.bound.top);\n\n                if (min > diff) {\n                    min = diff;\n                    result = data.sendData;\n                }\n            });\n        }\n\n        return result;\n    }\n});\n\nmodule.exports = BoundsBaseCoordinateModel;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"