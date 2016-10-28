tui.util.defineNamespace("fedoc.content", {});
fedoc.content["models_bounds_spectrumLegendCalculator.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Calculator for spectrum legend.\n * @author NHN Ent.\n *         FE Development Lab &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar chartConst = require('../../const');\nvar renderUtil = require('../../helpers/renderUtil');\n\n/**\n * Calculator for spectrum legend.\n * @module spectrumLegendCalculator\n */\nvar spectrumLegendCalculator = {\n    /**\n     * Make vertical dimension.\n     * @param {string} maxValue - formatted max value\n     * @param {object} labelTheme - theme for label\n     * @returns {{width: number, height: number}}\n     * @private\n     */\n    _makeVerticalDimension: function(maxValue, labelTheme) {\n        var labelWidth = renderUtil.getRenderedLabelWidth(maxValue, labelTheme);\n        var padding = chartConst.LEGEND_AREA_PADDING + chartConst.MAP_LEGEND_LABEL_PADDING;\n\n        return {\n            width: chartConst.MAP_LEGEND_GRAPH_SIZE + labelWidth + padding,\n            height: chartConst.MAP_LEGEND_SIZE\n        };\n    },\n\n    /**\n     * Make horizontal dimension.\n     * @param {string} maxValue - formatted max value\n     * @param {object} labelTheme - theme for label\n     * @returns {{width: number, height: number}}\n     * @private\n     */\n    _makeHorizontalDimension: function(maxValue, labelTheme) {\n        var labelHeight = renderUtil.getRenderedLabelHeight(maxValue, labelTheme);\n        var padding = chartConst.LEGEND_AREA_PADDING + chartConst.MAP_LEGEND_LABEL_PADDING;\n\n        return {\n            width: chartConst.MAP_LEGEND_SIZE,\n            height: chartConst.MAP_LEGEND_GRAPH_SIZE + labelHeight + padding\n        };\n    }\n};\n\nmodule.exports = spectrumLegendCalculator;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"